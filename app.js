let running = false;
let startedAt = null;
let timerInterval = null;

const timer = document.querySelector("#timer");
const button = document.querySelector("#startStop");

function formatDuration(ms) {
  const total = Math.floor(ms / 1000);
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function renderTimer() {
  timer.textContent = formatDuration(Date.now() - startedAt);
}

button.addEventListener("click", () => {
  if (!running) {
    running = true;
    startedAt = Date.now();
    button.textContent = "Zeit stoppen";
    timerInterval = setInterval(renderTimer, 250);
  } else {
    running = false;
    clearInterval(timerInterval);
    renderTimer();
    button.textContent = "Zeit starten";
  }
});
