const DEFAULT_HABITS = [
  "Прокрастинация","Чрезмерное использование соцсетей","Негативные мысли и самобичевание",
  "Зависимость от гаджетов","Плохое питание","Отсутствие физической активности",
  "Сон менее 7 часов","Избегание ответственности","Критика других","Гнев и раздражительность"
];

const checklistEl = document.getElementById('checklist');
const habitsTotalEl = document.getElementById('habits-total');
const habitsDoneEl = document.getElementById('habits-done');
const progressEl = document.getElementById('progress');

let habits = JSON.parse(localStorage.getItem('habits')) || DEFAULT_HABITS.map(text => ({ text, done: false }));

function updateStats() {
  const total = habits.length;
  const done = habits.filter(h => h.done).length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;
  habitsTotalEl.textContent = total;
  habitsDoneEl.textContent = done;
  progressEl.textContent = `${progress}%`;
}

function renderHabits() {
  checklistEl.innerHTML = '';
  habits.forEach((habit, index) => {
    const habitEl = document.createElement('div');
    habitEl.className = 'habit-item';
    habitEl.dataset.index = index;
    habitEl.innerHTML = `
      <div class="habit-checkbox">
        <input type="checkbox" ${habit.done ? 'checked' : ''}>
      </div>
      <div class="habit-text ${habit.done ? 'done' : ''}">${habit.text}</div>
    `;
    checklistEl.appendChild(habitEl);
    const checkbox = habitEl.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
      habits[index].done = checkbox.checked;
      localStorage.setItem('habits', JSON.stringify(habits));
      renderHabits();
      updateStats();
    });
  });
  setTimeout(() => {
    document.querySelectorAll('.habit-item').forEach(el => el.classList.add('fade-in'));
  }, 100);
}

updateStats();
renderHabits();
// Telegram Web App hooks (на будущее):
// if (window.Telegram?.WebApp) { Telegram.WebApp.ready(); Telegram.WebApp.expand(); }
