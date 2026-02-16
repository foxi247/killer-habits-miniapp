// Опросы: 10 вопросов, шкала 0-4
const SURVEYS = {
  porn: {
    title: "Зависимость от порно",
    questions: [
      "Как часто ты смотришь порно?",
      "Используешь ли порно для снятия стресса?",
      "Бывает ли, что порно мешает сну/работе/учёбе?",
      "Испытываешь чувство вины после просмотра?",
      "Есть ли эскалация (нужен всё более жёсткий контент)?",
      "Пробовал(-а) сокращать просмотр за последнюю неделю?",
      "Есть альтернативные способы расслабления (спорт, прогулки)?",
      "Обсуждаешь проблему с кем-то (друг, психотерапевт)?",
      "Бывает ли, что пропускаешь дела ради просмотра?",
      "Как оцениваешь контроль над этим сейчас?"
    ]
  },
  dopamine: {
    title: "Дофаминовые ловушки",
    questions: [
      "Часто ли листаешь ленту/реелсы без цели?",
      "Тянешься к сладкому/фастфуду при усталости?",
      "Сколько времени тратится на короткие ролики в день?",
      "Можешь ли обходиться без уведомлений 2–3 часа?",
      "Испытываешь тревогу, если телефон далеко?",
      "Есть ли план вознаграждений за выполненные задачи?",
      "Практикуешь ли цифровой детокс?",
      "Часто ли откладываешь важное ради быстрого удовольствия?",
      "Есть ли у тебя чёткий распорядок дня?",
      "Как оцениваешь контроль над дофаминовыми триггерами?"
    ]
  },
  productivity: {
    title: "Прокрастинация и дисциплина",
    questions: [
      "Часто ли откладываешь важные задачи до дедлайна?",
      "Есть ли у тебя ежедневный список дел?",
      "Сколько глубоких рабочих часов в день ты делаешь?",
      "Проверяешь ли задачи в конце дня?",
      "Отвлекаешься ли на соцсети во время работы?",
      "Делишь ли большие задачи на мелкие шаги?",
      "Есть ли у тебя утренний ритуал?",
      "Планируешь ли день заранее (вечером)?",
      "Как часто выполняешь обещания себе?",
      "Как оцениваешь свою дисциплину сейчас?"
    ]
  },
  social: {
    title: "Соцсети и гаджеты",
    questions: [
      "Сколько часов в день в соцсетях?",
      "Часто ли проверяешь уведомления автоматически?",
      "Есть ли лимиты экранного времени?",
      "Используешь ли режим «Не беспокоить»?",
      "Как часто листаешь ленту без цели?",
      "Откладываешь ли телефон за 1 час до сна?",
      "Есть ли офлайн-хобби без экрана?",
      "Общение вживую заменяется перепиской?",
      "Часто ли берёшь телефон на встречах?",
      "Как оцениваешь контроль над гаджетами?"
    ]
  }
};

const ANSWER_OPTIONS = [
  { label: "Плохо", score: 0 },
  { label: "Скорее плохо", score: 1 },
  { label: "Нейтрально", score: 2 },
  { label: "Скорее хорошо", score: 3 },
  { label: "Отлично", score: 4 }
];

const surveySelect = document.getElementById('survey-select');
const startBtn = document.getElementById('start-btn');
const questionCard = document.getElementById('question-card');
const resultCard = document.getElementById('result-card');
const questionText = document.getElementById('question-text');
const answersEl = document.getElementById('answers');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const resultScore = document.getElementById('result-score');
const resultText = document.getElementById('result-text');
const restartBtn = document.getElementById('restart-btn');
const splash = document.getElementById('splash');
const coursesCard = document.getElementById('courses-card');

let currentSurvey = null;
let currentIndex = 0;
let answers = [];

function showCard(el) {
  el.hidden = false;
  requestAnimationFrame(() => {
    el.classList.add('show');
  });
}

function hideCard(el) {
  el.classList.remove('show');
  setTimeout(() => { el.hidden = true; }, 300);
}

function renderQuestion() {
  const q = currentSurvey.questions[currentIndex];
  questionText.textContent = q;
  answersEl.innerHTML = '';
  ANSWER_OPTIONS.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = opt.label;
    if (answers[currentIndex] === idx) btn.classList.add('selected');
    btn.addEventListener('click', () => {
      answers[currentIndex] = idx;
      renderQuestion();
    });
    answersEl.appendChild(btn);
  });
  const progress = Math.round(((currentIndex + 1) / currentSurvey.questions.length) * 100);
  progressBar.style.setProperty('--w', progress + '%');
  progressText.textContent = `${currentIndex + 1} / ${currentSurvey.questions.length}`;
  prevBtn.disabled = currentIndex === 0;
  nextBtn.textContent = currentIndex === currentSurvey.questions.length - 1 ? 'Завершить' : 'Далее';
}

function calcResult() {
  const maxScore = currentSurvey.questions.length * (ANSWER_OPTIONS.length - 1);
  const sumScore = answers.reduce((acc, val) => acc + (val ?? 0), 0);
  const percent = Math.round((sumScore / maxScore) * 100);
  resultScore.textContent = `${percent}%`;
  let text = '';
  if (percent >= 80) text = 'Хороший контроль. Продолжай в том же духе, усиливай поддерживающие привычки.';
  else if (percent >= 60) text = 'Неплохо, но есть риски. Сокращай триггеры, добавь альтернативы (спорт, сон, живое общение).';
  else if (percent >= 40) text = 'Средний контроль. Введи жёсткие лимиты, убери уведомления, договорись с собой о правилах.';
  else text = 'Риск высокий. Нужен план: убрать триггеры, чёткий режим, поддержка (куратор/терапевт). Начни с одного шага уже сегодня.';
  resultText.textContent = text;
}

// Splash autohide
setTimeout(() => {
  splash.style.display = 'none';
  // показать курсы после заставки
  if (coursesCard) coursesCard.classList.add('show');
}, 2000);

startBtn.addEventListener('click', () => {
  const key = surveySelect.value;
  currentSurvey = SURVEYS[key];
  currentIndex = 0;
  answers = new Array(currentSurvey.questions.length).fill(null);
  showCard(questionCard);
  hideCard(resultCard);
  renderQuestion();
});

prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
});

nextBtn.addEventListener('click', () => {
  if (answers[currentIndex] == null) return;
  if (currentIndex < currentSurvey.questions.length - 1) {
    currentIndex++;
    renderQuestion();
  } else {
    calcResult();
    hideCard(questionCard);
    showCard(resultCard);
  }
});

restartBtn.addEventListener('click', () => {
  hideCard(resultCard);
  hideCard(questionCard);
});

if (window.Telegram?.WebApp) {
  Telegram.WebApp.ready();
  Telegram.WebApp.expand();
}
