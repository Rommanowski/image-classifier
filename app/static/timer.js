let timeLeft = 10;
let timerId = null;
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

function startTimer() {
    if (timerId) return;
    startBtn.disabled = true;
    timerDisplay.classList.remove('completed');

    timerId = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = formatTime(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(timerId);
            timerId = null;
            timerDisplay.classList.add('completed', 'animate__animated', 'animate__bounce');
            startBtn.disabled = false;
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    timeLeft = 10;
    timerDisplay.textContent = formatTime(timeLeft);
    timerDisplay.classList.remove('completed', 'animate__animated', 'animate__bounce');
    startBtn.disabled = false;
}

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);