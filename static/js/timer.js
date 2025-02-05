let timerContainer = document.getElementById('timer-container');
let timerElement = document.getElementById('slide-timer');
let toggleButton = document.getElementById('toggle-timer');
let resetButton = document.getElementById('reset-timer');

let startTime = null;
let elapsedTime = 0; // Store elapsed time when paused
let isRunning = false;
let timerInterval;
let fadeTimeout;

// Attempt to get stored timer values safely
function loadStoredTimer() {
  try {
    const storedStartTime = localStorage.getItem('startTime');
    const storedElapsedTime = localStorage.getItem('elapsedTime');
    const storedIsRunning = localStorage.getItem('isRunning');

    elapsedTime = storedElapsedTime ? parseInt(storedElapsedTime) : 0;
    isRunning = storedIsRunning === 'true';

    if (storedStartTime && isRunning) {
      startTime = parseInt(storedStartTime);
      startTimer();
    } else {
      startTime = null;
    }

    updateTimer();
  } catch (e) {
    console.warn("Local storage access denied or unavailable.");
  }
}

function updateTimer() {
  let currentTime = startTime ? (Date.now() - startTime) + elapsedTime : elapsedTime;
  let elapsedSeconds = Math.floor(currentTime / 1000);
  let minutes = Math.floor(elapsedSeconds / 60);
  let seconds = elapsedSeconds % 60;
  timerElement.innerText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function resetFadeTimer() {
  clearTimeout(fadeTimeout);
  timerContainer.style.opacity = "1"; // Show timer
  fadeTimeout = setTimeout(() => {
    timerContainer.style.opacity = "0"; // Fade out after 6 sec
  }, 6000);
}

function startTimer() {
  if (!isRunning) {
    startTime = Date.now();
    if (elapsedTime > 0) {
      startTime -= elapsedTime; // Adjust for paused time
    }

    localStorage.setItem('startTime', startTime.toString());
    localStorage.setItem('isRunning', 'true');

    timerInterval = setInterval(updateTimer, 1000);
    isRunning = true;
    toggleButton.innerText = "Stop";
  }
}

function stopTimer() {
  if (isRunning) {
    elapsedTime += Date.now() - startTime; // Store elapsed time
    startTime = null;
    clearInterval(timerInterval);
    isRunning = false;

    localStorage.setItem('elapsedTime', elapsedTime.toString());
    localStorage.setItem('isRunning', 'false');
    localStorage.removeItem('startTime'); // Remove startTime to freeze the timer
    toggleButton.innerText = "Start";
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  startTime = null;
  elapsedTime = 0;

  timerElement.innerText = "0:00";
  toggleButton.innerText = "Start";

  try {
    localStorage.removeItem('startTime');
    localStorage.removeItem('elapsedTime');
    localStorage.setItem('isRunning', 'false');
  } catch (e) {
    console.warn("Failed to clear local storage.");
  }
}

function toggleTimer() {
  isRunning ? stopTimer() : startTimer();
}

document.addEventListener('DOMContentLoaded', () => {
  loadStoredTimer(); // Load persisted timer on page load
});

// Detect arrow key presses (left or right) to show the timer for 6 sec
document.addEventListener('keydown', (event) => {
  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
    resetFadeTimer(); // Show timer for 6 sec on keypress
  }
});

timerElement.addEventListener('click', () => {
  timerContainer.style.opacity = "1"; // Show everything
  resetFadeTimer(); // Restart fade timer
});

toggleButton.addEventListener('click', toggleTimer);
resetButton.addEventListener('click', resetTimer);