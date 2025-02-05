  let timerElement = document.getElementById('slide-timer');
  let startTime = localStorage.getItem('startTime') ? parseInt(localStorage.getItem('startTime')) : Date.now();
  let timerInterval;
  let fadeTimeout;

  function updateTimer() {
    let elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    let minutes = Math.floor(elapsedSeconds / 60);
    let seconds = elapsedSeconds % 60;
    timerElement.innerText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  function resetFadeTimer() {
    clearTimeout(fadeTimeout);
    timerElement.style.opacity = "1";
    fadeTimeout = setTimeout(() => {
      timerElement.style.opacity = "0";
    }, 6000);
  }

  function initTimer() {
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
    resetFadeTimer();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTimer();
  });

  document.addEventListener('ws:slide-change', () => {
    resetFadeTimer();
  });

  timerElement.addEventListener('click', () => {
    let isVisible = timerElement.style.opacity === "1";
    timerElement.style.opacity = isVisible ? "0" : "1";
    if (!isVisible) resetFadeTimer();
  });

  window.addEventListener('beforeunload', () => {
    localStorage.setItem('startTime', startTime);
  });