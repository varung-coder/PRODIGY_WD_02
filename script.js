// DOM Elements
const timeDisplay = document.getElementById('time-display');
const startPauseBtn = document.getElementById('start-pause-btn');
const lapBtn = document.getElementById('lap-btn');
const resetBtn = document.getElementById('reset-btn');
const lapsList = document.getElementById('laps-list');

// Variables
let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let isRunning = false;
let laps = [];
let lastLapTime = 0;

// Format time to HH:MM:SS.ms
function formatTime(time) {
    const date = new Date(time);
    
    // We use UTC methods to avoid timezone offsets
    const hours = Math.floor(time / 3600000).toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    const milliseconds = Math.floor(date.getUTCMilliseconds() / 10).toString().padStart(2, '0');

    if (hours > 0) {
        return `${hours}:${minutes}:${seconds}<span class="milliseconds">.${milliseconds}</span>`;
    }
    return `${minutes}:${seconds}<span class="milliseconds">.${milliseconds}</span>`;
}

// Return formatted time string without HTML for laps
function formatTimeText(time) {
    const date = new Date(time);
    const hours = Math.floor(time / 3600000).toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    const milliseconds = Math.floor(date.getUTCMilliseconds() / 10).toString().padStart(2, '0');

    if (hours > 0) {
        return `${hours}:${minutes}:${seconds}.${milliseconds}`;
    }
    return `${minutes}:${seconds}.${milliseconds}`;
}

// Update the display
function updateDisplay() {
    timeDisplay.innerHTML = formatTime(elapsedTime);
}

// Start or Pause the stopwatch
function toggleStartPause() {
    if (isRunning) {
        // Pause
        clearInterval(timerInterval);
        isRunning = false;
        
        startPauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
        startPauseBtn.classList.remove('btn-danger');
        startPauseBtn.classList.add('btn-primary');
        
        lapBtn.disabled = true;
    } else {
        // Start
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            updateDisplay();
        }, 10); // Update every 10ms for smooth UI
        
        isRunning = true;
        
        startPauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        startPauseBtn.classList.remove('btn-primary');
        startPauseBtn.classList.add('btn-danger');
        
        lapBtn.disabled = false;
        resetBtn.disabled = false;
    }
}

// Record a lap
function recordLap() {
    if (!isRunning) return;
    
    const currentTotalTime = elapsedTime;
    const lapDuration = currentTotalTime - lastLapTime;
    
    laps.unshift({
        number: laps.length + 1,
        duration: lapDuration,
        total: currentTotalTime
    });
    
    lastLapTime = currentTotalTime;
    
    renderLaps();
}

// Render laps to the DOM
function renderLaps() {
    lapsList.innerHTML = '';
    
    laps.forEach(lap => {
        const li = document.createElement('li');
        li.className = 'lap-item';
        
        li.innerHTML = `
            <span class="lap-number">Lap ${lap.number}</span>
            <span class="lap-diff">+${formatTimeText(lap.duration)}</span>
            <span class="lap-total">${formatTimeText(lap.total)}</span>
        `;
        
        lapsList.appendChild(li);
    });
}

// Reset the stopwatch
function resetStopwatch() {
    clearInterval(timerInterval);
    isRunning = false;
    elapsedTime = 0;
    laps = [];
    lastLapTime = 0;
    
    updateDisplay();
    lapsList.innerHTML = '';
    
    startPauseBtn.innerHTML = '<i class="fas fa-play"></i> Start';
    startPauseBtn.classList.remove('btn-danger');
    startPauseBtn.classList.add('btn-primary');
    
    lapBtn.disabled = true;
    resetBtn.disabled = true;
}

// Event Listeners
startPauseBtn.addEventListener('click', toggleStartPause);
lapBtn.addEventListener('click', recordLap);
resetBtn.addEventListener('click', resetStopwatch);

// Initial setup
updateDisplay();
