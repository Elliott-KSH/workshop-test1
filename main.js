const clock = document.getElementById('clock');
const alarmTimeInput = document.getElementById('alarm-time');
const setAlarmButton = document.getElementById('set-alarm');
const alarmsList = document.getElementById('alarms-list');
const themeToggle = document.getElementById('theme-toggle');

const timerMinutesInput = document.getElementById('timer-minutes');
const timerDisplay = document.getElementById('timer-display');
const startTimerButton = document.getElementById('start-timer');
const pauseTimerButton = document.getElementById('pause-timer');
const resetTimerButton = document.getElementById('reset-timer');

let alarms = [];
let timerInterval;
let timerSeconds = 0;

// Theme switcher
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.checked = true;
}

themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clock.textContent = `${hours}:${minutes}:${seconds}`;
    checkAlarms(now);
}

function setAlarm() {
    const time = alarmTimeInput.value;
    if (time) {
        const [hours, minutes] = time.split(':');
        const alarm = {
            hours: parseInt(hours),
            minutes: parseInt(minutes),
            triggered: false
        };
        alarms.push(alarm);
        renderAlarms();
        alarmTimeInput.value = '';
    }
}

function checkAlarms(now) {
    alarms.forEach((alarm, index) => {
        if (!alarm.triggered && now.getHours() === alarm.hours && now.getMinutes() === alarm.minutes) {
            alert('알람!');
            alarm.triggered = true;
        }
    });
}

function renderAlarms() {
    alarmsList.innerHTML = '';
    alarms.forEach((alarm, index) => {
        const alarmElement = document.createElement('div');
        alarmElement.classList.add('alarm');
        alarmElement.innerHTML = `
            <span>${String(alarm.hours).padStart(2, '0')}:${String(alarm.minutes).padStart(2, '0')}</span>
            <button data-index="${index}">삭제</button>
        `;
        alarmsList.appendChild(alarmElement);
    });
}

function deleteAlarm(index) {
    alarms.splice(index, 1);
    renderAlarms();
}

function startTimer() {
    if (timerSeconds === 0) {
        const minutes = parseInt(timerMinutesInput.value);
        if (isNaN(minutes) || minutes <= 0) {
            alert('유효한 시간을 입력하세요.');
            return;
        }
        timerSeconds = minutes * 60;
    }

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timerSeconds--;
        updateTimerDisplay();
        if (timerSeconds <= 0) {
            clearInterval(timerInterval);
            alert('타이머 종료!');
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    clearInterval(timerInterval);
    timerSeconds = 0;
    updateTimerDisplay();
    timerMinutesInput.value = '';
}

function updateTimerDisplay() {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

setAlarmButton.addEventListener('click', setAlarm);

alarmsList.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        const index = e.target.dataset.index;
        deleteAlarm(index);
    }
});

startTimerButton.addEventListener('click', startTimer);
pauseTimerButton.addEventListener('click', pauseTimer);
resetTimerButton.addEventListener('click', resetTimer);

setInterval(updateClock, 1000);

updateClock();
updateTimerDisplay();