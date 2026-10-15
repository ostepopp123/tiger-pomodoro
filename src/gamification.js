/**
 * ============================================================================
 * GAMIFICATION & TAMAGOTCHI ENGINE
 * ============================================================================
 * Manages XP, Levels, Daily Streaks, Unlockable Accessories (Hats),
 * "Current Focus Task", and Hydration/Health reminders.
 */

class GamificationEngine {
  constructor(options = {}) {
    this.onXPChange = options.onXPChange || (() => {});
    this.onLevelUp = options.onLevelUp || (() => {});
    this.onUnlock = options.onUnlock || (() => {});

    // Level thresholds
    this.levels = [
      { level: 1, minXP: 0, titleKey: 'lvl1Title', rewardHat: 'none' },
      { level: 2, minXP: 50, titleKey: 'lvl2Title', rewardHat: 'crown' },
      { level: 3, minXP: 150, titleKey: 'lvl3Title', rewardHat: 'wizard' },
      { level: 4, minXP: 300, titleKey: 'lvl4Title', rewardHat: 'sunglasses' },
      { level: 5, minXP: 500, titleKey: 'lvl5Title', rewardHat: 'flowers' }
    ];

    // Load persisted state
    this.loadState();
    this.checkDailyStreak();
  }

  loadState() {
    try {
      this.xp = parseInt(localStorage.getItem('tiger_xp') || '0', 10);
      this.streak = parseInt(localStorage.getItem('tiger_streak') || '1', 10);
      this.lastDate = localStorage.getItem('tiger_last_date') || '';
      this.petCount = parseInt(localStorage.getItem('tiger_pet_count') || '0', 10);
      this.equippedHat = localStorage.getItem('tiger_equipped_hat') || 'none';
      this.currentTask = localStorage.getItem('tiger_current_task') || '';
      this.sessionsSinceWater = parseInt(localStorage.getItem('tiger_sessions_water') || '0', 10);
      this.roomTheme = localStorage.getItem('tiger_room_theme') || 'cozy';
    } catch (e) {
      this.xp = 0;
      this.streak = 1;
      this.lastDate = '';
      this.petCount = 0;
      this.equippedHat = 'none';
      this.currentTask = '';
      this.sessionsSinceWater = 0;
      this.roomTheme = 'cozy';
    }
  }

  saveState() {
    try {
      localStorage.setItem('tiger_xp', String(this.xp));
      localStorage.setItem('tiger_streak', String(this.streak));
      localStorage.setItem('tiger_last_date', this.lastDate);
      localStorage.setItem('tiger_pet_count', String(this.petCount));
      localStorage.setItem('tiger_equipped_hat', this.equippedHat);
      localStorage.setItem('tiger_current_task', this.currentTask);
      localStorage.setItem('tiger_sessions_water', String(this.sessionsSinceWater));
      localStorage.setItem('tiger_room_theme', this.roomTheme);
    } catch (e) {}
  }

  checkDailyStreak() {
    const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
    if (!this.lastDate) {
      this.lastDate = today;
      this.streak = 1;
    } else if (this.lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      if (this.lastDate === yesterday) {
        this.streak += 1; // Consecutive day!
      } else {
        this.streak = 1; // Streak broken, restart at 1
      }
      this.lastDate = today;
    }
    this.saveState();
  }

  getLevelData() {
    let currentLvl = this.levels[0];
    let nextLvl = this.levels[1];

    for (let i = 0; i < this.levels.length; i++) {
      if (this.xp >= this.levels[i].minXP) {
        currentLvl = this.levels[i];
        nextLvl = this.levels[i + 1] || null;
      }
    }

    const currentBase = currentLvl.minXP;
    const nextTarget = nextLvl ? nextLvl.minXP : (currentBase + 300);
    const progressXP = this.xp - currentBase;
    const neededXP = nextTarget - currentBase;
    const percent = Math.min(100, Math.max(0, Math.round((progressXP / neededXP) * 100)));

    return {
      level: currentLvl.level,
      titleKey: currentLvl.titleKey,
      currentXP: this.xp,
      progressXP,
      neededXP,
      percent,
      nextTarget,
      isMaxLevel: !nextLvl
    };
  }

  addXP(amount) {
    const prevLevel = this.getLevelData().level;
    this.xp += amount;
    this.saveState();

    const newLevelData = this.getLevelData();
    this.onXPChange(newLevelData);

    if (newLevelData.level > prevLevel) {
      this.onLevelUp(newLevelData);
    }
    return newLevelData;
  }

  recordPet() {
    this.petCount++;
    this.saveState();
    if (this.petCount === 10) {
      this.onUnlock('bow'); // Special unlock!
    }
  }

  isHatUnlocked(hatId) {
    if (hatId === 'none') return true;
    if (hatId === 'bow') return this.petCount >= 10;
    if (hatId === 'crown') return this.xp >= 50;
    if (hatId === 'wizard') return this.xp >= 150;
    if (hatId === 'sunglasses') return this.xp >= 300;
    if (hatId === 'flowers') return this.xp >= 500;
    return false;
  }

  equipHat(hatId) {
    if (this.isHatUnlocked(hatId)) {
      this.equippedHat = hatId;
      this.saveState();
      return true;
    }
    return false;
  }

  setTask(taskText) {
    this.currentTask = taskText.trim();
    this.saveState();
  }

  completeTask() {
    if (!this.currentTask) return null;
    const completed = this.currentTask;
    this.currentTask = '';
    this.saveState();
    this.addXP(20); // +20 bonus XP for completing task
    return completed;
  }

  incrementWaterSession() {
    this.sessionsSinceWater++;
    this.saveState();
    return this.sessionsSinceWater >= 2;
  }

  drinkWater() {
    this.sessionsSinceWater = 0;
    this.saveState();
    this.addXP(5); // +5 hydration health bonus
  }

  setTheme(themeId) {
    this.roomTheme = themeId;
    this.saveState();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GamificationEngine;
}
