(() => {
  "use strict";
  const courses = window.QuizCourses;
  const sessionStorageKey = "active_session";
  const modes = ["Easy", "Difficult"];

  function getCourse(code) {
    const normalized = String(code).toUpperCase().replace(/-/g, "");
    const course = Object.values(courses).find(item => item.code.replace(/-/g, "") === normalized);
    if (!course) throw new Error("Select a supported course.");
    return course;
  }

  function getPool(config) {
    const course = getCourse(config.course);
    if (!modes.includes(config.difficulty)) throw new Error("Select Easy or Difficult.");
    if (!Array.isArray(config.modules) || !config.modules.length ||
        new Set(config.modules).size !== config.modules.length) {
      throw new Error("Select at least one module, without duplicates.");
    }
    return config.modules.flatMap(id => {
      const module = course.modules.find(item => item.id === id);
      if (!module) throw new Error("A selected module does not belong to this course.");
      return module.questions[config.difficulty].map((question, index) => ({
        ...question,
        options: [...question.options],
        id: `${module.id}:${config.difficulty}:${index}`,
        module: module.title,
        moduleId: module.id,
        source: module.url
      }));
    });
  }

  function validateConfig(config) {
    const pool = getPool(config);
    if (!Number.isInteger(config.count) || config.count < 1 || config.count > 20) {
      throw new Error("Choose a question count between 1 and 20.");
    }
    if (pool.length < config.count) {
      throw new Error(`Only ${pool.length} unique questions are available for these settings. Select more modules or a smaller count.`);
    }
    if (!Number.isFinite(config.duration) || config.duration < 1 || config.duration > 120) {
      throw new Error("Quiz time must be between 1 and 120 minutes.");
    }
    return pool;
  }

  function shuffle(items) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index--) {
      const other = Math.floor(Math.random() * (index + 1));
      [result[index], result[other]] = [result[other], result[index]];
    }
    return result;
  }

  function createSession(config) {
    const pool = validateConfig(config);
    const groups = shuffle(config.modules.map(id => shuffle(pool.filter(q => q.moduleId === id))));
    const questionIds = [];
    while (questionIds.length < config.count) {
      for (const group of groups) {
        if (group.length && questionIds.length < config.count) questionIds.push(group.pop().id);
      }
    }
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const bytes = crypto.getRandomValues(new Uint8Array(6));
    const rawKey = Array.from(bytes, byte => chars[byte % chars.length]).join("");
    return {
      version: 2,
      key: `${rawKey.slice(0, 3)}-${rawKey.slice(3)}`,
      course: getCourse(config.course).code,
      modules: [...config.modules],
      difficulty: config.difficulty,
      count: config.count,
      duration: config.duration,
      questionIds,
      isActive: true,
      startedAt: Date.now()
    };
  }

  function validateSession(session, requireActive = true) {
    if (!session || session.version !== 2) {
      throw new Error("These are older or invalid session settings. Ask the instructor to create a new session.");
    }
    if (typeof session.key !== "string" || !/^[A-HJ-NP-Z2-9]{3}-[A-HJ-NP-Z2-9]{3}$/.test(session.key) ||
        !Number.isFinite(session.startedAt) || session.startedAt <= 0 ||
        typeof session.isActive !== "boolean") {
      throw new Error("The saved session is invalid. Ask the instructor to create a new session.");
    }
    const pool = validateConfig(session);
    const allowed = new Set(pool.map(q => q.id));
    if (!Array.isArray(session.questionIds) || session.questionIds.length !== session.count ||
        new Set(session.questionIds).size !== session.count ||
        session.questionIds.some(id => !allowed.has(id))) {
      throw new Error("The session's questions no longer match its course settings. Create a new session.");
    }
    if (requireActive && !session.isActive) throw new Error("This session has ended. Ask the instructor for a new session.");
    return session;
  }

  function readSession(requireActive = true) {
    const raw = localStorage.getItem(sessionStorageKey);
    if (!raw) {
      throw new Error("No session is stored in this browser. Open the full learner link from your instructor first; a short code or the exam page address alone cannot load a session on another device.");
    }
    let session;
    try {
      session = JSON.parse(raw);
    } catch (error) {
      console.error("Unable to parse saved quiz session:", error);
      throw new Error("The saved session cannot be read. Ask the instructor to create a new one.");
    }
    return validateSession(session, requireActive);
  }

  function saveSession(session) {
    validateSession(session, false);
    localStorage.setItem(sessionStorageKey, JSON.stringify(session));
  }

  function createShareLink(session, pageUrl) {
    validateSession(session);
    const { version, key, course, modules, difficulty, count, duration, questionIds, isActive, startedAt } = session;
    const shared = { version, key, course, modules, difficulty, count, duration, questionIds, isActive, startedAt };
    const url = new URL("index.html", pageUrl);
    url.hash = new URLSearchParams({ session: JSON.stringify(shared) }).toString();
    return url.href;
  }

  function readSharedSession(hash) {
    const params = new URLSearchParams(hash.replace(/^#/, ""));
    if (!params.has("session")) return null;
    const raw = params.get("session");
    if (!raw || raw.length > 16000 || params.getAll("session").length !== 1) {
      throw new Error("The learner link is invalid or incomplete. Ask the instructor to copy the full learner link again.");
    }
    let session;
    try {
      session = JSON.parse(raw);
    } catch (error) {
      console.error("Unable to parse shared quiz session:", error);
      throw new Error("The learner link cannot be read. Ask the instructor to copy the full learner link again.");
    }
    return validateSession(session);
  }

  function normalizeKey(key) {
    return String(key).trim().toUpperCase().replace(/[-\s]/g, "");
  }

  function getSessionQuestions(session) {
    validateSession(session);
    const pool = new Map(getPool(session).map(q => [q.id, q]));
    return session.questionIds.map(id => {
      const question = pool.get(id);
      const correctAnswer = question.options[question.correct];
      const options = shuffle(question.options);
      return { ...question, options, correct: options.indexOf(correctAnswer) };
    });
  }

  window.Quiz = Object.freeze({
    courses, modes, sessionStorageKey, getCourse, getPool, validateConfig,
    shuffle, createSession, validateSession, readSession, saveSession,
    createShareLink, readSharedSession, normalizeKey, getSessionQuestions
  });
})();
