let timerContainer = document.getElementById('timer-container');
  let timerElement = document.getElementById('slide-timer');
  let toggleButton = document.getElementById('toggle-timer');
  let resetButton = document.getElementById('reset-timer');

  let startTime = localStorage.getItem('startTime') ? parseInt(localStorage.getItem('startTime')) : null;
  let isRunning = localStorage.getItem('isRunning') === 'true';
  let timerInterval;
  let fadeTimeout;

  function updateTimer() {
    if (!startTime) return timerElement.innerText = "0:00";

    let elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
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
      startTime = Date.now() - (startTime ? (Date.now() - startTime) : 0);
      localStorage.setItem('startTime', startTime);
      timerInterval = setInterval(updateTimer, 1000);
      isRunning = true;
      localStorage.setItem('isRunning', 'true');
      toggleButton.innerText = "Stop";
    }
  }

  function stopTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    localStorage.setItem('isRunning', 'false');
    toggleButton.innerText = "Start";
  }

  function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    startTime = null;
    timerElement.innerText = "0:00";
    toggleButton.innerText = "Start";
    localStorage.removeItem('startTime');
    localStorage.setItem('isRunning', 'false');
  }

  function toggleTimer() {
    isRunning ? stopTimer() : startTimer();
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (isRunning) startTimer();
    updateTimer();
  });

  // WebSlides slide change event listener
  document.addEventListener('ws:slide-change', () => {
    resetFadeTimer(); // Show timer for 6 sec on slide change
  });

  timerElement.addEventListener('click', () => {
    timerContainer.style.opacity = "1"; // Show everything
    resetFadeTimer(); // Restart fade timer
  });

  toggleButton.addEventListener('click', toggleTimer);
  resetButton.addEventListener('click', resetTimer);

  window.addEventListener('beforeunload', () => {
    localStorage.setItem('startTime', startTime);
    localStorage.setItem('isRunning', isRunning);
  });