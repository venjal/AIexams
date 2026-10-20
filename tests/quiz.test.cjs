const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const vm = require("node:vm");
const { webcrypto } = require("node:crypto");

function setup() {
  const values = new Map();
  const errors = [];
  const context = vm.createContext({
    crypto: webcrypto, Uint8Array, URL, URLSearchParams,
    console: { error: (...args) => errors.push(args) },
    localStorage: {
      getItem: key => values.has(key) ? values.get(key) : null,
      setItem: (key, value) => values.set(key, value)
    }
  });
  context.window = context;
  for (const file of ["data/existing-courses.js", "data/copilot-courses.js", "quiz-core.js"]) {
    vm.runInContext(readFileSync(join(__dirname, "..", file), "utf8"), context, { filename: file });
  }
  return { quiz: context.Quiz, values, errors };
}

const businessCodes = ["MS-4018", "MS-4019", "MS-4021", "MS-4023", "AI-3025", "AB-730", "AB-731"];
const expectedCounts = { "MS-4018": 45, "MS-4019": 20, "MS-4021": 20, "MS-4023": 20, "AI-3025": 20, "AB-730": 40, "AB-731": 40 };

test("learner links transfer exact questions to a clean browser without private fields", () => {
  const instructor = setup();
  const learner = setup();
  for (const course of Object.values(instructor.quiz.courses)) {
    for (const difficulty of instructor.quiz.modes) {
      const settings = config(course, difficulty);
      if (!instructor.quiz.getPool(settings).length) continue;
      const session = instructor.quiz.createSession(settings);
      const url = new URL(instructor.quiz.createShareLink({
        ...session, instructorPassword: "private", learner_name: "Private learner", answers: { secret: "answer" }
      }, "https://venjal.github.io/AIexams/instructor.html?ignored=value"));
      assert.equal(url.origin + url.pathname, "https://venjal.github.io/AIexams/index.html");
      assert.equal(url.search, "");
      assert.equal(url.href.includes("private"), false);
      const imported = learner.quiz.readSharedSession(url.hash);
      assert.equal(JSON.stringify(imported), JSON.stringify(session));
      learner.quiz.saveSession(imported);
      assert.equal(learner.quiz.readSession().key, session.key);
      assert.deepEqual(Array.from(imported.questionIds), Array.from(session.questionIds));
      assert.equal(learner.quiz.getSessionQuestions(imported).length, session.count);
    }
  }
});

test("shared links reject corrupt, incompatible and ended sessions without overwriting storage", () => {
  const { quiz, values } = setup();
  const session = quiz.createSession(config(quiz.getCourse("AI-3026"), "Easy"));
  quiz.saveSession(session);
  const before = values.get(quiz.sessionStorageKey);
  assert.equal(quiz.readSharedSession(""), null);
  assert.equal(quiz.readSharedSession("#other=value"), null);
  for (const hash of ["#session=", "#session=%7B", "#session=null", "#session=a&session=b",
    `#session=${"a".repeat(16001)}`,
    ...[{ isActive: false }, { version: 99 }, { questionIds: ["missing"] }, { duration: 0 }]
      .map(patch => `#${new URLSearchParams({ session: JSON.stringify({ ...session, ...patch }) })}`)]) {
    assert.throws(() => quiz.readSharedSession(hash));
    assert.equal(values.get(quiz.sessionStorageKey), before);
  }
  assert.throws(() => quiz.createShareLink({ ...session, isActive: false }, "https://example.com/instructor.html"), /ended/);
});

function config(course, difficulty = "Difficult", count = 5) {
  return { course: course.code, modules: Array.from(course.modules, m => m.id), difficulty, count, duration: 5 };
}

test("catalog retains existing courses, adds seven unique business courses, and omits rejected codes", () => {
  const { quiz } = setup();
  assert.equal(Object.keys(quiz.courses).length, 11);
  for (const code of ["AI-3026", "AI-103", "GH-900", "AB-100", ...businessCodes]) {
    assert.equal(quiz.getCourse(code).code, code);
    assert.equal(quiz.getCourse(code.replace(/-/g, "")).code, code);
  }
  for (const code of ["MS-3025", "MS-4007", "AI-3017"]) assert.throws(() => quiz.getCourse(code));
});

test("every question has four unique options, a correct answer, an explanation and an official study source", () => {
  const { quiz } = setup();
  for (const course of Object.values(quiz.courses)) {
    assert.equal(new URL(course.url).hostname, "learn.microsoft.com");
    assert.equal(new Set(course.modules.map(m => m.id)).size, course.modules.length);
    for (const module of course.modules) {
      assert.equal(new URL(module.url).hostname, "learn.microsoft.com");
      for (const mode of quiz.modes) {
        const questions = module.questions[mode];
        assert.equal(new Set(questions.map(q => q.text)).size, questions.length, `${course.code}/${module.id}/${mode} duplicate prompt`);
        for (const question of questions) {
          assert.ok(typeof question.text === "string" && question.text.length > 15);
          assert.equal(question.options.length, 4);
          assert.equal(new Set(question.options).size, 4, question.text);
          assert.ok(question.options.every(option => typeof option === "string" && option.trim()));
          assert.ok(Number.isInteger(question.correct) && question.correct >= 0 && question.correct < 4);
          assert.ok(typeof question.explanation === "string" && question.explanation.length > 15);
        }
      }
    }
  }
});

test("all new courses have the measured Easy/Difficult counts and genuinely separate prompts", () => {
  const { quiz } = setup();
  for (const code of businessCodes) {
    const course = quiz.getCourse(code);
    for (const mode of quiz.modes) {
      assert.equal(quiz.getPool(config(course, mode)).length, expectedCounts[code], `${code} ${mode}`);
    }
    for (const module of course.modules) {
      assert.ok(module.questions.Easy.length >= 5);
      assert.ok(module.questions.Difficult.length >= 5);
      const easyPrompts = new Set(module.questions.Easy.map(q => q.text));
      assert.ok(module.questions.Difficult.every(q => !easyPrompts.has(q.text)));
    }
  }
});

test("every course/mode generates exact counts without duplicates or cross-course questions", () => {
  const { quiz } = setup();
  for (const course of Object.values(quiz.courses)) {
    for (const mode of quiz.modes) {
      const base = config(course, mode);
      const pool = quiz.getPool(base);
      if (!pool.length) continue;
      for (const count of [1, 5, 10, 15, 20].filter(n => n <= pool.length)) {
        const session = quiz.createSession({ ...base, count });
        assert.equal(session.questionIds.length, count);
        assert.equal(new Set(session.questionIds).size, count);
        assert.equal(quiz.validateSession(session), session);
        const questions = quiz.getSessionQuestions(session);
        assert.equal(questions.length, count);
        for (const question of questions) {
          assert.ok(course.modules.some(module => module.id === question.moduleId));
          const original = pool.find(item => item.id === question.id);
          assert.equal(question.options[question.correct], original.options[original.correct]);
          assert.equal(new Set(question.options).size, 4);
        }
        if (count >= course.modules.length) {
          assert.equal(new Set(questions.map(q => q.moduleId)).size, course.modules.length);
        }
      }
    }
  }
});

test("single-module selection never includes questions from unselected modules", () => {
  const { quiz } = setup();
  for (const code of businessCodes) {
    const course = quiz.getCourse(code);
    for (const module of course.modules) {
      for (const mode of quiz.modes) {
        const session = quiz.createSession({ ...config(course, mode), modules: [module.id] });
        assert.ok(quiz.getSessionQuestions(session).every(q => q.moduleId === module.id));
      }
    }
  }
});

test("invalid configuration fails explicitly rather than returning a sample quiz", () => {
  const { quiz } = setup();
  const base = config(quiz.getCourse("MS-4019"));
  for (const patch of [
    { course: "unknown" }, { modules: [] }, { modules: ["not-a-module"] },
    { modules: [base.modules[0], base.modules[0]] }, { difficulty: "Hard" },
    { count: 0 }, { count: 21 }, { count: 2.5 }, { duration: 0 }, { duration: Infinity },
    { duration: 121 }, { modules: [base.modules[0]], count: 20 }
  ]) assert.throws(() => quiz.createSession({ ...base, ...patch }));
  assert.throws(() => quiz.createSession(config(quiz.getCourse("AI-103"), "Easy")));
});

test("session storage validates missing, corrupt, legacy, ended and altered data", () => {
  const { quiz, values, errors } = setup();
  assert.throws(() => quiz.readSession(), /browser/);
  values.set(quiz.sessionStorageKey, "{");
  assert.throws(() => quiz.readSession(), /cannot be read/);
  assert.equal(errors.length, 1);
  values.set(quiz.sessionStorageKey, JSON.stringify({ course: "MS-4018" }));
  assert.throws(() => quiz.readSession(), /older or invalid/);
  const session = quiz.createSession(config(quiz.getCourse("MS-4018"), "Easy", 20));
  quiz.saveSession(session);
  assert.equal(quiz.readSession().key, session.key);
  quiz.saveSession({ ...session, isActive: false });
  assert.throws(() => quiz.readSession(), /ended/);
  assert.equal(quiz.readSession(false).isActive, false);
  for (const patch of [
    { key: "bad" }, { startedAt: 0 }, { isActive: "true" },
    { questionIds: ["missing"] }, { questionIds: Array(20).fill(session.questionIds[0]) }
  ]) assert.throws(() => quiz.validateSession({ ...session, ...patch }));
});

test("key normalization accepts hyphenless and lowercase input but does not invent a session", () => {
  const { quiz } = setup();
  assert.equal(quiz.normalizeKey(" abc-234 "), "ABC234");
  assert.equal(quiz.normalizeKey("abc234"), "ABC234");
  const session = quiz.createSession(config(quiz.getCourse("AI-3025")));
  assert.match(session.key, /^[A-HJ-NP-Z2-9]{3}-[A-HJ-NP-Z2-9]{3}$/);
});

test("answer shuffling preserves correctness and does not mutate the bank", () => {
  const { quiz } = setup();
  const course = quiz.getCourse("AI-3025");
  const before = JSON.stringify(course);
  const session = quiz.createSession(config(course, "Easy", 20));
  const positions = new Set();
  for (let run = 0; run < 10; run++) {
    for (const question of quiz.getSessionQuestions(session)) positions.add(question.correct);
  }
  assert.equal(positions.size, 4);
  assert.equal(JSON.stringify(course), before);
});

test("static pages use same-origin scripts and have no service dependency or sample-question fallback", () => {
  for (const file of ["index.html", "instructor.html", "exam.html"]) {
    const html = readFileSync(join(__dirname, "..", file), "utf8");
    assert.doesNotMatch(html, /azurewebsites\.net|sampleQuestions|https?:\/\/[^"']+\.js/i);
    for (const [, src] of html.matchAll(/<script[^>]+src="([^"]+)"/g)) {
      assert.ok(readFileSync(join(__dirname, "..", src), "utf8").length);
    }
  }
  for (const file of ["quiz-core.js", "instructor.js", "learner.js", "exam.js"]) {
    const js = readFileSync(join(__dirname, "..", file), "utf8");
    assert.doesNotMatch(js, /\bfetch\s*\(|XMLHttpRequest|WebSocket|azurewebsites\.net/);
  }
});
