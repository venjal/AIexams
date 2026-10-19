(() => {
  "use strict";
  const byId = id => document.getElementById(id);
  let session;
  let questions;
  let attempt;
  let attemptKey;
  let timer;

  function fail(error) {
    console.error("Quiz failed:", error);
    clearInterval(timer);
    byId("examPanel").hidden = true;
    byId("fatalMessage").textContent = error.message;
    byId("fatalPanel").hidden = false;
  }

  function guard(action) {
    return (...args) => {
      try { action(...args); } catch (error) { fail(error); }
    };
  }

  function save() {
    sessionStorage.setItem(attemptKey, JSON.stringify(attempt));
  }

  function sourceLink(question) {
    const link = document.createElement("a");
    link.href = question.source;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Study this module on Microsoft Learn";
    return link;
  }

  function isCorrect(question) {
    return attempt.answers[question.id] === question.options[question.correct];
  }

  function renderDots() {
    byId("navDots").replaceChildren();
    questions.forEach((question, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = `dot${index === attempt.index ? " current" : ""}`;
      const answered = Object.hasOwn(attempt.answers, question.id);
      if (answered || attempt.finished) dot.classList.add(isCorrect(question) ? "correct" : "incorrect");
      dot.textContent = String(index + 1);
      dot.setAttribute("aria-label", `Question ${index + 1}${answered ? ", answered" : ", unanswered"}`);
      if (index === attempt.index) dot.setAttribute("aria-current", "step");
      dot.addEventListener("click", guard(() => {
        attempt.index = index;
        save();
        byId("resultContainer").hidden = true;
        byId("quizContainer").hidden = false;
        renderQuestion();
      }));
      byId("navDots").appendChild(dot);
    });
  }

  function renderQuestion() {
    const question = questions[attempt.index];
    const answered = Object.hasOwn(attempt.answers, question.id);
    byId("questionCategory").textContent = question.module;
    byId("questionNumber").textContent = `Question ${attempt.index + 1} of ${questions.length}`;
    byId("questionPrompt").textContent = question.text;
    byId("optionsList").replaceChildren();
    question.options.forEach((text, index) => {
      const option = document.createElement("button");
      option.type = "button";
      option.className = "option";
      option.textContent = text;
      option.disabled = answered || attempt.finished;
      if (answered || attempt.finished) {
        if (index === question.correct) option.classList.add("correct");
        if (text === attempt.answers[question.id]) {
          option.classList.add(index === question.correct ? "selected-ans" : "chosen-wrong");
        }
      } else {
        option.addEventListener("click", guard(() => {
          if (attempt.finished || Object.hasOwn(attempt.answers, question.id)) return;
          if (Date.now() >= attempt.deadline) { finish(true); return; }
          attempt.answers[question.id] = text;
          save();
          renderQuestion();
        }));
      }
      byId("optionsList").appendChild(option);
    });
    const showFeedback = answered || attempt.finished;
    byId("feedbackBox").hidden = !showFeedback;
    byId("explanation").hidden = !showFeedback;
    byId("questionSource").hidden = !showFeedback;
    if (showFeedback) {
      byId("feedbackBox").className = `feedback ${isCorrect(question) ? "correct" : "incorrect"}`;
      byId("feedbackBox").textContent = !answered ? "No answer recorded" : isCorrect(question) ? "Correct!" : "Incorrect";
      byId("explanation").textContent = question.explanation;
      byId("questionSource").href = question.source;
    }
    byId("btnPrev").disabled = attempt.index === 0;
    const last = attempt.index === questions.length - 1;
    byId("btnNext").hidden = last;
    byId("btnSubmit").hidden = !last || attempt.finished;
    byId("btnSummary").hidden = !attempt.finished;
    byId("timerSection").hidden = attempt.finished;
    const score = questions.filter(isCorrect).length;
    const answeredCount = Object.keys(attempt.answers).length;
    byId("scoreBadge").textContent = `Score: ${score} / ${attempt.finished ? questions.length : answeredCount}`;
    renderDots();
  }

  function showResults() {
    byId("quizContainer").hidden = true;
    byId("resultContainer").hidden = false;
  }

  function renderResults() {
    const score = questions.filter(isCorrect).length;
    byId("finalScoreDisplay").textContent = `${score} / ${questions.length}`;
    byId("percentageDisplay").textContent = `${Math.round(score / questions.length * 100)}%`;
    byId("timeExpired").hidden = !attempt.expired;
    const breakdown = byId("answerBreakdown");
    breakdown.replaceChildren();
    questions.forEach((question, index) => {
      const section = document.createElement("section");
      section.className = "review-question";
      const heading = document.createElement("h3");
      heading.textContent = `${index + 1}. ${question.text}`;
      const feedback = document.createElement("p");
      feedback.className = `feedback ${isCorrect(question) ? "correct" : "incorrect"}`;
      feedback.textContent = !Object.hasOwn(attempt.answers, question.id)
        ? "No answer recorded" : isCorrect(question) ? "Correct!" : "Incorrect";
      const options = document.createElement("div");
      options.className = "options";
      question.options.forEach((text, optionIndex) => {
        const option = document.createElement("div");
        option.className = "option";
        const correct = optionIndex === question.correct;
        const chosen = text === attempt.answers[question.id];
        if (correct) option.classList.add("correct");
        if (chosen) option.classList.add(correct ? "selected-ans" : "chosen-wrong");
        option.textContent = `${text}${correct ? " (Correct answer)" : ""}${chosen ? " (Your answer)" : ""}`;
        options.appendChild(option);
      });
      const explanation = document.createElement("p");
      explanation.className = "explanation";
      explanation.textContent = question.explanation;
      section.append(heading, feedback, options, explanation, sourceLink(question));
      breakdown.appendChild(section);
    });
  }

  function finish(expired = false) {
    if (attempt.finished) return;
    attempt.finished = true;
    attempt.expired = expired;
    clearInterval(timer);
    save();
    renderQuestion();
    renderResults();
    showResults();
  }

  function tick() {
    const seconds = Math.max(0, Math.ceil((attempt.deadline - Date.now()) / 1000));
    byId("timerDisplay").textContent =
      `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
    const percentage = Math.max(0, Math.min(100, seconds / (session.duration * 60) * 100));
    byId("timerBar").style.width = `${percentage}%`;
    byId("timerBar").className = `timer-bar${percentage <= 15 ? " danger" : percentage <= 40 ? " warning" : ""}`;
    if (seconds === 0) finish(true);
  }

  function loadAttempt(name) {
    attemptKey = `quiz-attempt:${JSON.stringify([session.key, session.startedAt, name])}`;
    const raw = sessionStorage.getItem(attemptKey);
    if (!raw) return { version: 1, answers: {}, deadline: Date.now() + session.duration * 60000, index: 0, finished: false, expired: false };
    let saved;
    try { saved = JSON.parse(raw); } catch (error) {
      console.error("Unable to parse quiz progress:", error);
      throw new Error("Saved quiz progress is unreadable. Ask the instructor to start a new session.");
    }
    if (!saved || saved.version !== 1 || !saved.answers || typeof saved.answers !== "object" ||
        Array.isArray(saved.answers) || !Number.isFinite(saved.deadline) || saved.deadline <= 0 ||
        !Number.isInteger(saved.index) || saved.index < 0 || saved.index >= questions.length ||
        typeof saved.finished !== "boolean" || typeof saved.expired !== "boolean" ||
        Object.entries(saved.answers).some(([id, text]) => !questions.some(q => q.id === id && q.options.includes(text)))) {
      throw new Error("Saved quiz progress is invalid. Ask the instructor to start a new session.");
    }
    return saved;
  }

  try {
    session = Quiz.readSession();
    const key = localStorage.getItem("active_session_key");
    const name = localStorage.getItem("learner_name");
    if (!key || Quiz.normalizeKey(key) !== Quiz.normalizeKey(session.key) ||
        !name || !name.trim() || name.length > 100) {
      throw new Error("Join with your name and the current session key on the learner page first.");
    }
    questions = Quiz.getSessionQuestions(session);
    attempt = loadAttempt(name);
    save();
    byId("displayKey").textContent = session.key;
    byId("displayName").textContent = name;
    const course = Quiz.getCourse(session.course);
    byId("courseTitle").textContent = `${course.code} - ${course.title}`;
    byId("difficultyDisplay").textContent = session.difficulty;
    document.title = `${course.code} Practice Quiz`;
    byId("examPanel").hidden = false;
    renderQuestion();
    if (attempt.finished) {
      renderResults();
      showResults();
    } else {
      tick();
      if (!attempt.finished) timer = setInterval(guard(tick), 1000);
    }
  } catch (error) { fail(error); }

  byId("btnPrev").addEventListener("click", guard(() => {
    if (attempt.index > 0) { attempt.index--; save(); renderQuestion(); }
  }));
  byId("btnNext").addEventListener("click", guard(() => {
    if (attempt.index < questions.length - 1) { attempt.index++; save(); renderQuestion(); }
  }));
  byId("btnSubmit").addEventListener("click", guard(() => finish(Date.now() >= attempt.deadline)));
  byId("btnSummary").addEventListener("click", showResults);
  byId("reviewQuestions").addEventListener("click", guard(() => {
    attempt.index = 0;
    save();
    byId("resultContainer").hidden = true;
    byId("quizContainer").hidden = false;
    renderQuestion();
  }));
  window.addEventListener("storage", guard(event => {
    if (event.key !== Quiz.sessionStorageKey && event.key !== null) return;
    const current = Quiz.readSession();
    if (current.key !== session.key || current.startedAt !== session.startedAt) {
      throw new Error("The instructor has replaced this session. Join the new session from the learner page.");
    }
  }));
  window.addEventListener("pageshow", event => {
    if (event.persisted) location.reload();
  });
})();
