// ==========================
// BURGER MENU
// ==========================
function toggleMenu() {
  const nav = document.getElementById("myTopnav");
  nav.classList.toggle("open");
}

// ==========================
// VIDEO (unmute on click)
// ==========================
const video = document.getElementById("myVideo");

if (video) {
  document.addEventListener(
    "click",
    () => {
      video.muted = false;
    },
    { once: true },
  );
}

// ==========================
// INFO CARDS PANEL
// ==========================
const panel = document.getElementById("expandedPanel");
const content = document.getElementById("expandedContent");

function toggleCard(card) {
  const cardContent = card.querySelector(".card-content")?.innerHTML || "";
  const title = card.querySelector("h2")?.innerText || "";

  content.innerHTML = `
    <h2>${title}</h2>
    ${cardContent}
  `;

  panel.classList.add("active");
}

function closePanel() {
  panel.classList.remove("active");
}

// ==========================
// CHECKLIST PROGRESS (FIXED)
// ==========================
const checkboxes = document.querySelectorAll(
  ".check-card input[type='checkbox']",
);

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressPercent");

function updateProgress() {
  if (!checkboxes.length) return;

  const total = checkboxes.length;
  const checked = Array.from(checkboxes).filter((cb) => cb.checked).length;

  const percent = Math.round((checked / total) * 100);

  if (progressFill) {
    progressFill.style.width = percent + "%";
  }

  if (progressText) {
    progressText.textContent = percent + "%";
  }
}

checkboxes.forEach((cb) => {
  cb.addEventListener("change", updateProgress);
});

updateProgress();

// ==========================
// QUIZ DATA (MASTER QUIZ)
// ==========================
const quizData = {
  Budget: [
    {
      question: "Hvad er et budget?",
      answers: ["En plan for dine penge", "En bankkonto", "Et lån", "En skat"],
      correct: 0,
    },
  ],

  SU: [
    {
      question: "Hvad står SU for?",
      answers: [
        "Statens Uddannelsesstøtte",
        "Studie Unit",
        "Skatte Udbytte",
        "Social Uddannelse",
      ],
      correct: 0,
    },
  ],

  Lån: [
    {
      question: "Hvad er en rente?",
      answers: [
        "Prisen for at låne penge",
        "En opsparing",
        "En skat",
        "Et gebyr",
      ],
      correct: 0,
    },
  ],

  Opsparing: [
    {
      question: "Hvad er en opsparing?",
      answers: ["Penge du gemmer", "Penge du skylder", "Et lån", "En regning"],
      correct: 0,
    },
  ],
};

// ==========================
// MASTER QUIZ
// ==========================
const masterQuizBox = document.getElementById("masterQuizBox");
const startMasterBtn = document.getElementById("startMasterQuiz");

let masterIndex = 0;
let masterScore = 0;
let shuffledQuestions = [];

function buildMasterQuiz() {
  const all = Object.entries(quizData).flatMap(([topic, questions]) =>
    questions.map((q) => ({ ...q, topic })),
  );

  shuffledQuestions = all.sort(() => Math.random() - 0.5);
}

function renderMasterQuiz() {
  const q = shuffledQuestions[masterIndex];

  masterQuizBox.innerHTML = `
    <div class="master-quiz-card">
      <div class="master-quiz-progress">
        Emne: <strong>${q.topic}</strong><br>
        ${masterIndex + 1} / ${shuffledQuestions.length}
      </div>

      <h2>${q.question}</h2>

      <div class="master-quiz-answers">
        ${q.answers
          .map(
            (a, i) => `
          <button class="master-answer-btn" data-i="${i}">
            ${a}
          </button>
        `,
          )
          .join("")}
      </div>
    </div>
  `;

  document.querySelectorAll(".master-answer-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (+btn.dataset.i === q.correct) masterScore++;

      masterIndex++;

      if (masterIndex < shuffledQuestions.length) {
        renderMasterQuiz();
      } else {
        masterQuizBox.innerHTML = `
          <div class="master-quiz-card">
            <h2>🎉 Færdig!</h2>
            <p>Du fik ${masterScore} / ${shuffledQuestions.length}</p>

            <button class="master-answer-btn" onclick="location.reload()">
              Prøv igen
            </button>
          </div>
        `;
      }
    });
  });
}

if (startMasterBtn) {
  buildMasterQuiz();

  startMasterBtn.addEventListener("click", () => {
    masterIndex = 0;
    masterScore = 0;
    renderMasterQuiz();
  });
}

//Mini QUIZ //

// ==========================
// MINI QUIZZES (4 STK)
// ==========================

const miniStates = {};

function startMiniQuiz(container, key) {
  const data = quizData[key];

  miniStates[key] = {
    index: 0,
    score: 0,
    questions: [...data].sort(() => Math.random() - 0.5),
  };

  renderMiniQuiz(container, key);
}

function renderMiniQuiz(container, key) {
  const state = miniStates[key];
  const q = state.questions[state.index];

  container.innerHTML = `
    <div class="master-quiz-card">
      <h4>${key} quiz</h4>

      <p>${state.index + 1} / ${state.questions.length}</p>

      <h3>${q.question}</h3>

      <div class="master-quiz-answers">
        ${q.answers
          .map(
            (a, i) => `
          <button class="master-answer-btn" data-i="${i}">
            ${a}
          </button>
        `,
          )
          .join("")}
      </div>
    </div>
  `;

  container.querySelectorAll(".master-answer-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (+btn.dataset.i === q.correct) state.score++;

      state.index++;

      if (state.index < state.questions.length) {
        renderMiniQuiz(container, key);
      } else {
        container.innerHTML = `
          <div class="master-quiz-card">
            <h3>Færdig 🎉</h3>
            <p>${state.score} / ${state.questions.length}</p>
          </div>
        `;
      }
    });
  });
}

// init buttons
document.querySelectorAll(".mini-quiz").forEach((box) => {
  const key = box.dataset.quiz;
  const btn = box.querySelector(".mini-start-btn");
  const container = box.querySelector(".mini-box");

  btn.addEventListener("click", () => {
    startMiniQuiz(container, key);
  });
});
