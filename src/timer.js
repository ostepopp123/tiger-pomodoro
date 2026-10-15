/**
 * Pomodoro Timer Logic Engine
 * Manages countdowns, custom HH:MM:SS durations, presets, intervals, sessions, and events.
 */

class PomodoroTimer {
  constructor(options = {}) {
    this.onTick = options.onTick || (() => {});
    this.onStateChange = options.onStateChange || (() => {});
    this.onComplete = options.onComplete || (() => {});

    // Modes: 'focus', 'shortBreak', 'longBreak', 'custom'
    this.mode = 'focus';
    this.isRunning = false;

    // Presets in seconds
    this.presets = {
      focus: 25 * 60,       // 25 mins
      deep: 50 * 60,        // 50 mins
      shortBreak: 5 * 60,   // 5 mins
      longBreak: 15 * 60    // 15 mins
    };

    // Current durations
    this.totalDuration = this.presets.focus;
    this.remainingSeconds = this.presets.focus;

    // Completed focus sessions
    this.completedSessions = 0;
    this.targetSessions = 4;

    this.timerInterval = null;
    this.lastTimestamp = null;
  }

  setMode(mode, customSeconds = null) {
    this.pause();
    this.mode = mode;

    if (customSeconds !== null && customSeconds > 0) {
      this.totalDuration = customSeconds;
      this.remainingSeconds = customSeconds;
    } else if (this.presets[mode]) {
      this.totalDuration = this.presets[mode];
      this.remainingSeconds = this.presets[mode];
    }

    this.onStateChange({
      mode: this.mode,
      isRunning: this.isRunning,
      remainingSeconds: this.remainingSeconds,
      totalDuration: this.totalDuration,
      completedSessions: this.completedSessions
    });
    this.onTick(this.getTimeData());
  }

  setCustomTime(hours, minutes, seconds) {
    const total = (parseInt(hours, 10) || 0) * 3600 +
                  (parseInt(minutes, 10) || 0) * 60 +
                  (parseInt(seconds, 10) || 0);

    if (total <= 0) return false;

    this.pause();
    this.mode = 'custom';
    this.totalDuration = total;
    this.remainingSeconds = total;

    this.onStateChange({
      mode: this.mode,
      isRunning: this.isRunning,
      remainingSeconds: this.remainingSeconds,
      totalDuration: this.totalDuration,
      completedSessions: this.completedSessions
    });
    this.onTick(this.getTimeData());
    return true;
  }

  start() {
    if (this.isRunning) return;
    if (this.remainingSeconds <= 0) {
      this.reset();
    }

    this.isRunning = true;
    this.lastTimestamp = performance.now();

    this.timerInterval = setInterval(() => {
      const now = performance.now();
      const delta = (now - this.lastTimestamp) / 1000;

      if (delta >= 1) {
        const passedSeconds = Math.floor(delta);
        this.remainingSeconds = Math.max(0, this.remainingSeconds - passedSeconds);
        this.lastTimestamp = now - ((delta - passedSeconds) * 1000);

        this.onTick(this.getTimeData());

        if (this.remainingSeconds <= 0) {
          this.handleTimerEnd();
        }
      }
    }, 250);

    this.onStateChange({
      mode: this.mode,
      isRunning: this.isRunning,
      remainingSeconds: this.remainingSeconds,
      totalDuration: this.totalDuration,
      completedSessions: this.completedSessions
    });
  }

  pause() {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    this.onStateChange({
      mode: this.mode,
      isRunning: this.isRunning,
      remainingSeconds: this.remainingSeconds,
      totalDuration: this.totalDuration,
      completedSessions: this.completedSessions
    });
  }

  toggle() {
    if (this.isRunning) {
      this.pause();
    } else {
      this.start();
    }
  }

  reset() {
    this.pause();
    this.remainingSeconds = this.totalDuration;
    this.onTick(this.getTimeData());
    this.onStateChange({
      mode: this.mode,
      isRunning: this.isRunning,
      remainingSeconds: this.remainingSeconds,
      totalDuration: this.totalDuration,
      completedSessions: this.completedSessions
    });
  }

  skip() {
    this.pause();
    // Transition to next cycle step
    if (this.mode === 'focus' || this.mode === 'deep' || this.mode === 'custom') {
      this.completedSessions++;
      if (this.completedSessions % this.targetSessions === 0) {
        this.setMode('longBreak');
      } else {
        this.setMode('shortBreak');
      }
    } else {
      // Returning from break -> back to Focus
      this.setMode('focus');
    }
  }

  handleTimerEnd() {
    this.pause();
    const finishedMode = this.mode;

    if (finishedMode === 'focus' || finishedMode === 'deep' || finishedMode === 'custom') {
      this.completedSessions++;
    }

    this.onComplete({
      finishedMode,
      completedSessions: this.completedSessions,
      isLongBreakReady: (this.completedSessions % this.targetSessions === 0)
    });
  }

  getTimeData() {
    const totalSecs = Math.max(0, this.remainingSeconds);
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;

    const pad = (n) => String(n).padStart(2, '0');
    const formattedHHMMSS = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    const formattedMMSS = `${pad(minutes)}:${pad(seconds)}`;

    const progress = this.totalDuration > 0
      ? (1 - this.remainingSeconds / this.totalDuration)
      : 0;

    return {
      hours,
      minutes,
      seconds,
      formattedHHMMSS,
      formattedMMSS,
      formatted: hours > 0 ? formattedHHMMSS : formattedMMSS,
      progress: Math.min(1, Math.max(0, progress)),
      remainingSeconds: this.remainingSeconds,
      totalDuration: this.totalDuration
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PomodoroTimer;
}
