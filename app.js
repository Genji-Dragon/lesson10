const WORK_DURATION_S = 25 * 60;
const BREAK_DURATION_S = 5 * 60;
const RING_RADIUS = 100;
const RING_STROKE_WIDTH = 16;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

let remainingSeconds = WORK_DURATION_S;
let timerIntervalId = null;
let progressCircle = null;
let audioContext = null;
let completedCount = 0;
const state = {
  isRunning: false,
  phase: 'work',
};

function initApp() {
  completedCount = loadCompletedCount();
  bindEventListeners();
  initProgressRing();
  updateDisplay();
  updateButtonStates();
}

function bindEventListeners() {
  const startButton = document.getElementById('start-button');
  const pauseButton = document.getElementById('pause-button');
  const resumeButton = document.getElementById('resume-button');
  const resetButton = document.getElementById('reset-button');

  startButton.addEventListener('click', startTimer);
  pauseButton.addEventListener('click', pauseTimer);
  resumeButton.addEventListener('click', resumeTimer);
  resetButton.addEventListener('click', resetTimer);
}

function updateButtonStates() {
  const startButton = document.getElementById('start-button');
  const pauseButton = document.getElementById('pause-button');
  const resumeButton = document.getElementById('resume-button');
  const isRunning = state.isRunning;
  const isPaused = !isRunning && timerIntervalId === null && remainingSeconds !== getPhaseDuration();

  if (startButton) {
    startButton.disabled = isRunning || isPaused;
  }

  if (pauseButton) {
    pauseButton.disabled = !isRunning;
  }

  if (resumeButton) {
    resumeButton.disabled = !isPaused;
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainderSeconds.toString().padStart(2, '0')}`;
}

function updateTimerDisplay() {
  const timerValue = document.getElementById('timer-value');
  timerValue.textContent = formatTime(remainingSeconds);
  updateProgressCircle();
}

function startTimer() {
  if (timerIntervalId !== null) {
    return;
  }

  if (remainingSeconds <= 0) {
    remainingSeconds = state.phase === 'work' ? WORK_DURATION_S : BREAK_DURATION_S;
  }

  updateDisplay();
  state.isRunning = true;
  updateButtonStates();

  timerIntervalId = setInterval(() => {
    remainingSeconds -= 1;

    if (remainingSeconds <= 0) {
      switchSession();
      return;
    }

    updateTimerDisplay();
  }, 1000);
}

function pauseTimer() {
  if (timerIntervalId === null) {
    return;
  }

  clearInterval(timerIntervalId);
  timerIntervalId = null;
  state.isRunning = false;
  updateButtonStates();
}

function resumeTimer() {
  if (state.isRunning) {
    return;
  }

  startTimer();
}

function resetTimer() {
  if (timerIntervalId !== null) {
    clearInterval(timerIntervalId);
    timerIntervalId = null;
  }

  state.isRunning = false;
  state.phase = 'work';
  remainingSeconds = WORK_DURATION_S;

  updateDisplay();
  updateProgressCircle();
  updateButtonStates();

  const startButton = document.getElementById('start-button');
  if (startButton) {
    startButton.textContent = 'Start';
  }
}

function initProgressRing() {
  progressCircle = document.querySelector('.progress-ring__progress');

  if (!progressCircle) {
    return;
  }

  progressCircle.style.strokeDasharray = RING_CIRCUMFERENCE;
  progressCircle.style.strokeDashoffset = 0;
}

function switchSession() {
  const prevPhase = state.phase;
  state.phase = prevPhase === 'work' ? 'break' : 'work';
  remainingSeconds = state.phase === 'work' ? WORK_DURATION_S : BREAK_DURATION_S;

  // Increment only when transitioning from a completed work session into break
  if (prevPhase === 'work' && state.phase === 'break') {
    incrementCompletedCount();
    playWorkToBreakTone();
  } else {
    playBreakToWorkTone();
  }

  updateDisplay();
  updateButtonStates();
}

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  return audioContext;
}

function playTone(frequency, duration) {
  const context = getAudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;

  gain.gain.setValueAtTime(0, context.currentTime);
  gain.gain.linearRampToValueAtTime(0.12, context.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start(context.currentTime);
  oscillator.stop(context.currentTime + duration);
}

function playWorkToBreakTone() {
  playTone(880, 0.18);
}

function playBreakToWorkTone() {
  playTone(660, 0.22);
}

function updateDisplay() {
  const timerValue = document.getElementById('timer-value');
  const sessionLabel = document.getElementById('session-label');
  const completedCount = document.getElementById('completed-count');

  timerValue.textContent = formatTime(remainingSeconds);
  sessionLabel.textContent = state.phase === 'work' ? 'Work' : 'Break';
  if (completedCount) {
    completedCount.textContent = String(completedCountValue());
  }
  updateProgressCircle();
}

function completedCountValue() {
  return typeof completedCount === 'number' && !Number.isNaN(completedCount) ? completedCount : 0;
}

function getPhaseDuration() {
  return state.phase === 'work' ? WORK_DURATION_S : BREAK_DURATION_S;
}

function updateProgressCircle() {
  if (!progressCircle) {
    initProgressRing();
  }

  if (!progressCircle) {
    return;
  }

  const duration = getPhaseDuration();
  const normalizedSeconds = Math.min(Math.max(remainingSeconds, 0), duration);
  const progress = normalizedSeconds / duration;
  const strokeDashoffset = RING_CIRCUMFERENCE - progress * RING_CIRCUMFERENCE;

  progressCircle.style.strokeDashoffset = strokeDashoffset;
}

function incrementCompletedCount() {
  completedCount = completedCountValue() + 1;
  saveCompletedCount(completedCount);
  updateDisplay();
}

function loadCompletedCount() {
  try {
    const raw = localStorage.getItem('pomodoro_completed_sessions');
    const n = raw ? parseInt(raw, 10) : 0;
    return Number.isNaN(n) ? 0 : n;
  } catch (e) {
    return 0;
  }
}

function saveCompletedCount(count) {
  try {
    localStorage.setItem('pomodoro_completed_sessions', String(count));
  } catch (e) {
    // ignore storage errors
  }
}

function playNotificationSound() {
  // play a short notification tone
  try {
    playTone(1200, 0.12);
  } catch (e) {
    // ignore audio errors
  }
}

window.addEventListener('DOMContentLoaded', initApp);
