function initApp() {
  loadCompletedCount();
  bindControls();
  updateDisplay();
}

function bindControls() {
  const startButton = document.getElementById('start-button');
  const pauseButton = document.getElementById('pause-button');
  const resumeButton = document.getElementById('resume-button');
  const resetButton = document.getElementById('reset-button');

  startButton.addEventListener('click', startTimer);
  pauseButton.addEventListener('click', pauseTimer);
  resumeButton.addEventListener('click', resumeTimer);
  resetButton.addEventListener('click', resetTimer);
}

function startTimer() {
  // TODO: begin or resume countdown
}

function pauseTimer() {
  // TODO: pause countdown
}

function resumeTimer() {
  // TODO: resume countdown if paused
}

function resetTimer() {
  // TODO: reset current session time and update UI
}

function switchSession() {
  // TODO: swap between focus and break modes
}

function updateDisplay() {
  const timerValue = document.getElementById('timer-value');
  const sessionLabel = document.getElementById('session-label');
  const completedCount = document.getElementById('completed-count');

  timerValue.textContent = '25:00';
  sessionLabel.textContent = 'Focus Session';
  completedCount.textContent = '0';
}

function updateProgressCircle() {
  // TODO: update circular progress visuals
}

function incrementCompletedCount() {
  // TODO: increment completed focus session counter and persist it
}

function loadCompletedCount() {
  // TODO: read completed session count from localStorage
  return 0;
}

function playNotificationSound() {
  // TODO: play a short session transition sound
}

window.addEventListener('DOMContentLoaded', initApp);
