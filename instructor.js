(() => {
  "use strict";
  const byId = id => document.getElementById(id);
  // A public static page cannot provide secure server-side authentication.
  const passwordHash = "ca54e393427726de095401917ce2242075083ee70bf600587c7f14bf2ec65b2e";

  function report(error, element = byId("sessionError")) {
    console.error("Instructor action failed:", error);
    element.textContent = error.message;
    element.hidden = false;
  }

  function selectedModules() {
    return Array.from(document.querySelectorAll(".module-check:checked"), input => input.value);
  }

  function updateCounts() {
    const previous = Number(byId("questionCount").value) || 10;
    const course = Quiz.getCourse(byId("courseSelect").value);
    const difficulty = byId("difficulty").value;
    const selected = selectedModules();
    const available = selected.reduce((total, id) =>
      total + course.modules.find(module => module.id === id).questions[difficulty].length, 0);
    const counts = [5, 10, 15, 20].filter(count => count <= available);
    if (available > 0 && !counts.length) counts.push(available);
    const select = byId("questionCount");
    select.replaceChildren();
    counts.forEach(count => select.add(new Option(String(count), String(count))));
    if (counts.length) select.value = String(counts.includes(previous) ? previous : counts[counts.length - 1]);
    else select.add(new Option("No questions available", ""));
    byId("startSession").disabled = !available;
    byId("questionAvailability").textContent = `${available} unique ${difficulty.toLowerCase()} questions available in ${selected.length} selected module(s).`;
  }

  function renderModules() {
    const course = Quiz.getCourse(byId("courseSelect").value);
    const list = byId("moduleList");
    list.replaceChildren();
    course.modules.forEach(module => {
      const row = document.createElement("div");
      row.className = "form-check";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.className = "module-check";
      input.id = `module-${module.id}`;
      input.value = module.id;
      input.checked = true;
      input.addEventListener("change", updateCounts);
      const content = document.createElement("div");
      const label = document.createElement("label");
      label.htmlFor = input.id;
      label.textContent = module.title;
      const link = document.createElement("a");
      link.className = "module-link";
      link.href = module.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Learn";
      link.setAttribute("aria-label", `Study ${module.title} on Microsoft Learn`);
      const count = document.createElement("div");
      count.className = "muted";
      count.textContent = `${module.questions.Easy.length} Easy / ${module.questions.Difficult.length} Difficult`;
      content.append(label, link, count);
      row.append(input, content);
      list.appendChild(row);
    });
    for (const option of byId("difficulty").options) {
      option.disabled = !course.modules.some(module => module.questions[option.value].length > 0);
    }
    if (byId("difficulty").selectedOptions[0].disabled) {
      byId("difficulty").value = Array.from(byId("difficulty").options).find(option => !option.disabled).value;
    }
    const hasEasy = course.modules.some(module => module.questions.Easy.length);
    byId("difficultyNote").textContent = hasEasy
      ? "Easy covers foundations; Difficult applies concepts to realistic scenarios."
      : "This existing technical bank currently provides Difficult questions only.";
    byId("courseDescription").textContent = `${course.modules.length} module(s) - ${course.title}`;
    byId("courseSource").href = course.url;
    byId("sessionError").hidden = true;
    updateCounts();
  }

  function refreshSession() {
    const raw = localStorage.getItem(Quiz.sessionStorageKey);
    byId("copyKey").disabled = true;
    byId("btnEndSession").disabled = true;
    byId("openLearner").hidden = true;
    if (!raw) {
      byId("sessionKeyDisplay").textContent = "--- ---";
      byId("sessionStatusText").textContent = "No active session. Select settings and start a session.";
      return;
    }
    try {
      const session = Quiz.readSession(false);
      byId("sessionKeyDisplay").textContent = session.isActive ? session.key : "--- ---";
      byId("sessionStatusText").textContent = session.isActive
        ? `Active: ${session.course} - ${session.difficulty} - ${session.modules.length} module(s) - ${session.count} questions - ${session.duration} minutes. Same browser/profile only.`
        : "Session ended. Start a new session when ready.";
      byId("copyKey").disabled = !session.isActive;
      byId("btnEndSession").disabled = !session.isActive;
      byId("openLearner").hidden = !session.isActive;
    } catch (error) {
      byId("sessionKeyDisplay").textContent = "--- ---";
      byId("sessionStatusText").textContent = "Saved session unavailable. Start a new session.";
      report(error);
    }
  }

  byId("loginForm").addEventListener("submit", async event => {
    event.preventDefault();
    const password = byId("instructorPassword");
    byId("loginError").hidden = true;
    byId("loginButton").disabled = true;
    try {
      const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password.value));
      const hash = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
      if (hash !== passwordHash) {
        byId("loginError").textContent = "Incorrect password.";
        byId("loginError").hidden = false;
        password.select();
        return;
      }
      renderModules();
      password.value = "";
      byId("loginPanel").hidden = true;
      byId("dashboard").hidden = false;
      document.title = "Instructor Dashboard";
      byId("courseSelect").focus();
      refreshSession();
    } catch (error) {
      console.error("Instructor sign-in failed:", error);
      byId("loginError").textContent = "Unable to open the dashboard. Please use an up-to-date browser over HTTPS with site storage enabled.";
      byId("loginError").hidden = false;
    } finally {
      byId("loginButton").disabled = false;
    }
  });

  const groups = new Map();
  for (const course of Object.values(Quiz.courses)) {
    if (!groups.has(course.group)) {
      const group = document.createElement("optgroup");
      group.label = course.group;
      groups.set(course.group, group);
      byId("courseSelect").appendChild(group);
    }
    groups.get(course.group).appendChild(new Option(`${course.code} - ${course.title}`, course.code));
  }
  byId("courseSelect").value = "AI-3026";
  byId("courseSelect").addEventListener("change", renderModules);
  byId("difficulty").addEventListener("change", updateCounts);
  byId("selectAll").addEventListener("click", () => {
    document.querySelectorAll(".module-check").forEach(input => { input.checked = true; });
    updateCounts();
  });
  byId("deselectAll").addEventListener("click", () => {
    document.querySelectorAll(".module-check").forEach(input => { input.checked = false; });
    updateCounts();
  });
  byId("startSession").addEventListener("click", () => {
    byId("sessionError").hidden = true;
    try {
      const count = Number(byId("questionCount").value);
      const session = Quiz.createSession({
        course: byId("courseSelect").value,
        modules: selectedModules(),
        difficulty: byId("difficulty").value,
        count,
        duration: byId("duration").value === "auto" ? count * 1.5 : Number(byId("duration").value)
      });
      Quiz.saveSession(session);
      refreshSession();
    } catch (error) { report(error); }
  });
  byId("btnEndSession").addEventListener("click", () => {
    try {
      const session = Quiz.readSession();
      Quiz.saveSession({ ...session, isActive: false });
      byId("sessionError").hidden = true;
      refreshSession();
    } catch (error) { report(error); }
  });
  byId("copyKey").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(Quiz.readSession().key);
      byId("sessionError").hidden = true;
      byId("sessionStatusText").textContent += " Key copied.";
    } catch (error) {
      console.error("Unable to copy session key:", error);
      report(new Error("Unable to copy automatically. Select and copy the displayed key manually."));
    }
  });
  byId("signOut").addEventListener("click", () => location.reload());
  window.addEventListener("storage", event => {
    if (event.key === Quiz.sessionStorageKey && !byId("dashboard").hidden) refreshSession();
  });
  window.addEventListener("pageshow", event => {
    if (event.persisted) location.reload();
  });
})();
