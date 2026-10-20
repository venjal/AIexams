STATIC COURSE DATA

The GitHub Pages quiz loads existing-courses.js, copilot-courses.js, and
quiz-core.js from this repository. No model API, Python service, Azure resource,
or external database is needed. Microsoft Learn links open only when clicked.

copilot-courses.js contains original practice questions based on the topics
in the linked Microsoft Learn modules. These are not copied Microsoft knowledge
checks, certification exam items, or a guarantee of exam coverage.
Module titles and course mappings were checked on 2026-10-19.

New / refreshed business courses (unique questions per difficulty):
  MS-4018  Draft, analyze, and present with Microsoft Copilot          45 / 45
  MS-4019  Transform your everyday business processes with agents    20 / 20
  MS-4021  Copilot Immersion Experience                              20 / 20
  MS-4023  Transform Ideas into Action with Copilot Chat (Basic)      20 / 20
  AI-3025  Work smarter with AI                                      20 / 20
  AB-730   Transform business workflows with generative AI           40 / 40
  AB-731   Drive AI transformation in your organization              40 / 40

MS4018 and MS-4018 are one course. MS3025 was confirmed to mean AI-3025.
MS-4007 and AI-3017 were omitted at the owner's request because the checked
course URLs no longer resolve to current course pages.

existing-courses.js preserves the existing AI-3026, AI-103, GH-900, and AB-100
question banks, exported as static data from app.py. AI-3026 has both modes.
The other three existing technical banks have Difficult questions only; the UI
disables Easy rather than relabeling their questions.

QUESTION FORMAT

Each course has a code, title, group, official Learn URL, and modules.
Each module has a stable ID, title, Learn URL, and Easy/Difficult arrays.
Each question has text, four unique options, a zero-based correct-answer index,
and an explanation. The q() helper in copilot-courses.js records the first option
as correct for authoring; the learner UI shuffles options and remaps that index.
Do not change stable IDs or question order during an active session.

SELECTION AND SESSION BEHAVIOR

The instructor dropdown selects the actual course data. Module and difficulty
filters determine the eligible pool. Counts reflect the available pool; questions
are not repeated to reach an unsupported count. Selection distributes questions
across selected modules where the chosen count permits.

Session configuration and selected question IDs live in localStorage. Learner
progress and an absolute timer deadline live in sessionStorage, so refreshing
the same tab preserves answers and does not restart the timer.

Short keys work only in the browser/profile that created the session. There is
no cross-device key lookup, live attendance, or central results collection.
To share across devices, start a session and select Copy Learner Link. Send the
entire generated URL, including its #session= fragment. Learners open that link,
enter their name, and select Join; the session key is filled in automatically.
If clipboard permission is unavailable, copy the full Learner link field manually.
Do not send just exam.html or a short key to a new device.

The link carries only session settings and selected question IDs, not instructor
credentials, learner names, answers, or scores. The fragment is read locally by
the browser, not sent in HTTP requests. It is not encrypted or signed: anyone
with the link can use, forward, or change it. Imported data is validated against
the published question bank. Changes to that bank can invalidate older links.
Ending a session affects only the local browser; it cannot revoke shared links.
Each learner's timer starts on first opening the exam and survives a tab refresh.
This sharing feature is for practice, not secure or centrally controlled exams.

The instructor password check is only a browser-side gate: public static HTML
and data cannot provide secure authentication or conceal correct answers.

VALIDATION

From the repository root, run:
  node --test tests\quiz.test.cjs

For a local browser preview:
  python -m http.server 8766 --bind 127.0.0.1

No npm install or runtime Python server is required on GitHub Pages.
