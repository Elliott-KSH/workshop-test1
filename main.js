const clock = document.getElementById('clock');
const alarmTimeInput = document.getElementById('alarm-time');
const setAlarmButton = document.getElementById('set-alarm');
const alarmsList = document.getElementById('alarms-list');

let alarms = [];

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

setAlarmButton.addEventListener('click', setAlarm);

alarmsList.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        const index = e.target.dataset.index;
        deleteAlarm(index);
    }
});

setInterval(updateClock, 1000);

updateClock();