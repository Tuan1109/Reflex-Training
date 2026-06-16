const ARROWS = ["↑", "↓", "←", "→", "↖", "↗", "↙", "↘"];

let running = false;
let paused = false;

let interval = 2.0;
let flashMode = false;
let flashTime = 300;

let sessionMinutes = 2;
let timeLeft = 120;

let lastArrow = null;

let arrowTimer = null;
let countdownTimer = null;

const enabledArrows = {};

ARROWS.forEach((a) => {
  enabledArrows[a] = true;
});

const stimulus = document.getElementById("stimulus");
const timer = document.getElementById("timer");

const settingsBtn = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");
const closeSettings = document.getElementById("closeSettings");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const stopBtn = document.getElementById("stopBtn");

buildArrowOptions();

function buildArrowOptions() {
  const container = document.getElementById("arrowContainer");

  ARROWS.forEach((arrow) => {
    const row = document.createElement("div");

    row.className = "arrow-option";

    row.innerHTML = `
            <input
                type="checkbox"
                checked
                data-arrow="${arrow}"
            >
            <span>${arrow}</span>
        `;

    container.appendChild(row);
  });

  container.querySelectorAll("input").forEach((box) => {
    box.addEventListener("change", (e) => {
      const arrow = e.target.dataset.arrow;

      enabledArrows[arrow] = e.target.checked;
    });
  });
}

settingsBtn.onclick = () => {
  settingsModal.classList.remove("hidden");
};

closeSettings.onclick = () => {
  settingsModal.classList.add("hidden");
};

document.getElementById("flashMode").onchange = (e) => {
  flashMode = e.target.checked;
};

document.getElementById("flashTime").oninput = (e) => {
  flashTime = Number(e.target.value);

  document.getElementById("flashValue").textContent = flashTime;
};

document.getElementById("interval").oninput = (e) => {
  interval = Number(e.target.value);

  document.getElementById("intervalValue").textContent = interval.toFixed(1);

  if (running) {
    restartArrowLoop();
  }
};

document.getElementById("sessionTime").oninput = (e) => {
  sessionMinutes = Number(e.target.value);

  document.getElementById("sessionValue").textContent =
    sessionMinutes.toFixed(1);
};

startBtn.onclick = startSession;

pauseBtn.onclick = togglePause;

stopBtn.onclick = stopSession;

function activeArrows() {
  return ARROWS.filter((a) => enabledArrows[a]);
}

function startSession() {
  if (running) return;

  const arrows = activeArrows();

  if (arrows.length === 0) {
    alert("Hãy chọn ít nhất 1 mũi tên.");

    return;
  }

  running = true;
  paused = false;

  timeLeft = sessionMinutes * 60;

  updateTimerDisplay();

  startArrowLoop();

  countdownTimer = setInterval(updateTimer, 1000);
}

function restartArrowLoop() {
  clearInterval(arrowTimer);

  arrowTimer = setInterval(showNextArrow, interval * 1000);
}

function startArrowLoop() {
  showNextArrow();

  restartArrowLoop();
}

function showNextArrow() {
  if (!running || paused) {
    return;
  }

  const arrows = activeArrows();

  if (arrows.length === 0) {
    return;
  }

  let arrow;

  if (arrows.length === 1) {
    arrow = arrows[0];
  } else {
    do {
      arrow = arrows[Math.floor(Math.random() * arrows.length)];
    } while (arrow === lastArrow);
  }

  lastArrow = arrow;

  stimulus.textContent = arrow;

  if (flashMode) {
    setTimeout(() => {
      if (running && !paused) {
        stimulus.textContent = "";
      }
    }, flashTime);
  }
}

function updateTimer() {
  if (!running || paused) {
    return;
  }

  timeLeft--;

  updateTimerDisplay();

  if (timeLeft <= 0) {
    finishSession();
  }
}

function updateTimerDisplay() {
  const m = Math.floor(timeLeft / 60);

  const s = Math.floor(timeLeft % 60);

  timer.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function togglePause() {
  if (!running) {
    return;
  }

  paused = !paused;

  pauseBtn.textContent = paused ? "▶" : "⏸";
}

function stopSession() {
  running = false;
  paused = false;

  clearInterval(arrowTimer);
  clearInterval(countdownTimer);

  stimulus.textContent = "■";

  timer.textContent = "00:00";

  pauseBtn.textContent = "⏸";
}

function finishSession() {
  running = false;

  clearInterval(arrowTimer);
  clearInterval(countdownTimer);

  stimulus.textContent = "✓";

  pauseBtn.textContent = "⏸";
}
