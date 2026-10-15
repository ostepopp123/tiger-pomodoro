/**
 * ============================================================================
 * POMODORO TIMER CORE ENGINE
 * ============================================================================
 * Manages countdown intervals, presets, custom durations (HH:MM:SS),
 * session cycle counters (4 focus rounds -> 1 long break), and event callbacks.
 */

class PomodoroTimer {
  /**
   * @param {Object} options
   * @param {Function} options.onTick - Invoked every second with updated time formatting & progress
   * @param {Function} options.onStateChange - Invoked when play/pause/reset/mode change occurs
   * @param {Function} options.onComplete - Invoked when timer hits 00:00:00
   */
  constructor(options = {}) {
    this.onTick = options.onTick || (() => {});
    this.onStateChange = options.onStateChange || (() => {});
    this.onComplete = options.onComplete || (() => {});

    // Current timer mode: 'focus', 'shortBreak', 'longBreak', 'deep', 'custom'
    this.mode = 'focus';
    this.isRunning = false;

    // Standard preset durations stored in seconds
    this.presets = {
      focus: 25 * 60,       // 25 minutes
      deep: 50 * 60,        // 50 minutes deep work
      shortBreak: 5 * 60,   // 5 minutes break
      longBreak: 15 * 60    // 15 minutes rest
    };

    // Tracking variables (in seconds)
    this.totalDuration = this.presets.focus;
    this.remainingSeconds = this.presets.focus;

    // Session progress tracking (every 4 focus sessions earns a long break)
    this.completedSessions = 0;
    this.targetSessions = 4;

    // High-precision interval references
    this.timerInterval = null;
    this.lastTimestamp = null;
  }

  /**
   * Switches the active mode (e.g. Focus, Short Break, Long Break).
   * Automatically pauses any ongoing countdown.
   * @param {string} mode - 'focus' | 'shortBreak' | 'longBreak' | 'deep' | 'custom'
   * @param {number|null} customSeconds - Optional custom duration in seconds
   */
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

    this.emitState();
    this.onTick(this.getTimeData());
  }

  /**
   * Configures a manual duration from Hours, Minutes, and Seconds inputs.
   * @param {number} hours
   * @param {number} minutes
   * @param {number} seconds
   * @returns {boolean} true if time is valid (> 0s)
   */
  setCustomTime(hours, minutes, seconds) {
    const total = (parseInt(hours, 10) || 0) * 3600 +
                  (parseInt(minutes, 10) || 0) * 60 +
                  (parseInt(seconds, 10) || 0);

    if (total <= 0) return false;

    this.pause();
    this.mode = 'custom';
    this.totalDuration = total;
    this.remainingSeconds = total;

    this.emitState();
    this.onTick(this.getTimeData());
    return true;
  }

  /**
   * Starts the countdown using high-resolution delta time to prevent drift.
   */
  start() {
    if (this.isRunning) return;
    if (this.remainingSeconds <= 0) {
      this.reset();
    }

    this.isRunning = true;
    this.lastTimestamp = performance.now();

    // Check 4 times per second (250ms) to ensure smooth second transitions without drift
    this.timerInterval = setInterval(() => {
      const now = performance.now();
      const delta = (now - this.lastTimestamp) / 1000;

      if (delta >= 1) {
        const passedSeconds = Math.floor(delta);
        this.remainingSeconds = Math.max(0, this.remainingSeconds - passedSeconds);
        this.lastTimestamp = now - ((delta - passedSeconds) * 1000);

        this.onTick(this.getTimeData());

        // Check if countdown concluded
        if (this.remainingSeconds <= 0) {
          this.handleTimerEnd();
        }
      }
    }, 250);

    this.emitState();
  }

  /**
   * Pauses the countdown and clears the interval.
   */
  pause() {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.emitState();
  }

  /**
   * Toggles between Start and Pause.
   */
  toggle() {
    if (this.isRunning) {
      this.pause();
    } else {
      this.start();
    }
  }

  /**
   * Resets remaining time back to the current preset / custom duration.
   */
  reset() {
    this.pause();
    this.remainingSeconds = this.totalDuration;
    this.onTick(this.getTimeData());
    this.emitState();
  }

  /**
   * Advances to the next logical step in the Pomodoro cycle.
   * Focus -> Break -> Focus -> etc.
   */
  skip() {
    this.pause();
    if (this.mode === 'focus' || this.mode === 'deep' || this.mode === 'custom') {
      this.completedSessions++;
      if (this.completedSessions % this.targetSessions === 0) {
        this.setMode('longBreak');
      } else {
        this.setMode('shortBreak');
      }
    } else {
      this.setMode('focus');
    }
  }

  /**
   * Internal handler when countdown hits 0 seconds.
   */
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

  /**
   * Emits state payload to the onStateChange listener.
   */
  emitState() {
    this.onStateChange({
      mode: this.mode,
      isRunning: this.isRunning,
      remainingSeconds: this.remainingSeconds,
      totalDuration: this.totalDuration,
      completedSessions: this.completedSessions
    });
  }

  /**
   * Calculates formatted strings and progress percentage for UI rendering.
   * @returns {Object} { hours, minutes, seconds, formatted, progress, ... }
   */
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
