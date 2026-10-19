document.getElementById("joinForm").addEventListener("submit", event => {
  event.preventDefault();
  const errorElement = document.getElementById("errorMsg");
  errorElement.hidden = true;
  try {
    const name = document.getElementById("learnerName").value.trim();
    if (!name || name.length > 100) throw new Error("Enter a name of 1 to 100 characters.");
    const key = document.getElementById("sessionKey").value;
    const session = Quiz.readSession();
    if (Quiz.normalizeKey(key) !== Quiz.normalizeKey(session.key)) {
      throw new Error("This key does not match the active session in this browser. Check it with the instructor.");
    }
    localStorage.setItem("learner_name", name);
    localStorage.setItem("active_session_key", session.key);
    window.location.href = "exam.html";
  } catch (error) {
    console.error("Unable to join quiz:", error);
    errorElement.textContent = error.message;
    errorElement.hidden = false;
  }
});
