/**
 * ============================================================================
 * TIGER & FRIENDS POMODORO - RENDERER APPLICATION CONTROLLER
 * ============================================================================
 * Orchestrates all application modules:
 * 1. UI Interaction & Frameless Window Controls
 * 2. 5 Animated Pixel Companions (Tiger, Hippo, Pig, Guinea Pig, Avocado)
 * 3. Procedural Alert Synthesizer & Procedural Ambient Soundscapes (Rain, Fire, Wind, Cafe)
 * 4. Precision Pomodoro Countdown & Preset Engine
 * 5. Gamification / Tamagotchi Engine (XP, Levels 1-5, Streaks, Hats, Hydration, Tasks)
 * 6. Multi-Language (i18n) Engine (Norwegian & English)
 * 7. Ultra-Compact Floating Mini-Widget Mode (240x72px)
 * 
 * Written cleanly with thorough comments for easy maintenance and expansion.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // DOM ELEMENT SELECTIONS
  // --------------------------------------------------------------------------

  // Title Bar & Window Action Controls
  const titleIcon = document.getElementById('titleIcon');
  const titleText = document.getElementById('titleText');
  const pinBtn = document.getElementById('pinBtn');
  const soundBtn = document.getElementById('soundBtn');
  const btnMiniMode = document.getElementById('btnMiniMode');
  const settingsBtn = document.getElementById('settingsBtn');
  const minBtn = document.getElementById('minBtn');
  const closeBtn = document.getElementById('closeBtn');

  // Mini-Widget Controls (Visible only in compact 240x72 mode)
  const miniControlsCluster = document.getElementById('miniControlsCluster');
  const btnMiniToggle = document.getElementById('btnMiniToggle');
  const btnMiniExpand = document.getElementById('btnMiniExpand');

  // Quick Skin Switcher Bar
  const quickSkinButtons = document.querySelectorAll('.skin-btn');
  const btnNameTiger = document.getElementById('btnNameTiger');
  const btnNameHippo = document.getElementById('btnNameHippo');
  const btnNamePig = document.getElementById('btnNamePig');
  const btnNameGuineaPig = document.getElementById('btnNameGuineaPig');
  const btnNameAvocado = document.getElementById('btnNameAvocado');

  // Mini Focus Task Banner
  const taskBanner = document.getElementById('taskBanner');
  const taskInput = document.getElementById('taskInput');
  const btnTaskDone = document.getElementById('btnTaskDone');

  // Companion Stage & Canvas
  const canvas = document.getElementById('tigerCanvas');
  const speechBubble = document.getElementById('speechBubble');
  const speechIcon = document.getElementById('speechIcon');
  const speechText = document.getElementById('speechText');
  const pawElements = [
    document.getElementById('paw0'),
    document.getElementById('paw1'),
    document.getElementById('paw2'),
    document.getElementById('paw3')
  ];
  const sessionLabel = document.getElementById('sessionLabel');

  // Gamification & Progression Bar
  const gamificationBar = document.getElementById('gamificationBar');
  const levelBadge = document.getElementById('levelBadge');
  const xpBarFill = document.getElementById('xpBarFill');
  const xpText = document.getElementById('xpText');
  const streakBadge = document.getElementById('streakBadge');
  const streakCount = document.getElementById('streakCount');

  // Timer Digital Display
  const timerDigits = document.getElementById('timerDigits');
  const progressBar = document.getElementById('progressBar');

  // Preset Buttons
  const presetButtons = document.querySelectorAll('.preset-btn');
  const presetFocusBtn = document.getElementById('presetFocusBtn');
  const presetShortBtn = document.getElementById('presetShortBtn');
  const presetLongBtn = document.getElementById('presetLongBtn');
  const presetDeepBtn = document.getElementById('presetDeepBtn');

  // Manual Custom Time Inputs (HH:MM:SS)
  const lblCustomTime = document.getElementById('lblCustomTime');
  const inputHours = document.getElementById('inputHours');
  const inputMinutes = document.getElementById('inputMinutes');
  const inputSeconds = document.getElementById('inputSeconds');
  const lblUnitHour = document.getElementById('lblUnitHour');
  const lblUnitMin = document.getElementById('lblUnitMin');
  const lblUnitSec = document.getElementById('lblUnitSec');
  const btnSetCustom = document.getElementById('btnSetCustom');

  // Main Timer Action Controls
  const btnReset = document.getElementById('btnReset');
  const btnToggle = document.getElementById('btnToggle');
  const btnToggleIcon = document.getElementById('btnToggleIcon');
  const btnToggleText = document.getElementById('btnToggleText');
  const btnSkip = document.getElementById('btnSkip');

  // Footer & Hints
  const lblPetHint = document.getElementById('lblPetHint');
  const btnSoundTest = document.getElementById('btnSoundTest');

  // Settings Modal Elements
  const settingsModal = document.getElementById('settingsModal');
  const btnCloseSettings = document.getElementById('btnCloseSettings');
  const btnDoneSettings = document.getElementById('btnDoneSettings');
  const lblSettingsTitle = document.getElementById('lblSettingsTitle');

  // Language Section
  const lblLangSectionTitle = document.getElementById('lblLangSectionTitle');
  const langButtons = document.querySelectorAll('.lang-btn');

  // Skin Modal Section
  const lblSkinSectionTitle = document.getElementById('lblSkinSectionTitle');
  const modalSkinCards = document.querySelectorAll('.modal-skin-card');
  const cardTitleTiger = document.getElementById('cardTitleTiger');
  const cardDescTiger = document.getElementById('cardDescTiger');
  const cardTitleHippo = document.getElementById('cardTitleHippo');
  const cardDescHippo = document.getElementById('cardDescHippo');
  const cardTitlePig = document.getElementById('cardTitlePig');
  const cardDescPig = document.getElementById('cardDescPig');
  const cardTitleGuineaPig = document.getElementById('cardTitleGuineaPig');
  const cardDescGuineaPig = document.getElementById('cardDescGuineaPig');
  const cardTitleAvocado = document.getElementById('cardTitleAvocado');
  const cardDescAvocado = document.getElementById('cardDescAvocado');

  // Room Theme Section
  const lblThemeSectionTitle = document.getElementById('lblThemeSectionTitle');
  const themeButtons = document.querySelectorAll('.theme-btn');
  const btnThemeCozy = document.getElementById('btnThemeCozy');
  const btnThemeNight = document.getElementById('btnThemeNight');
  const btnThemeSakura = document.getElementById('btnThemeSakura');
  const btnThemeOasis = document.getElementById('btnThemeOasis');

  // Hats & Accessories Section
  const lblHatSectionTitle = document.getElementById('lblHatSectionTitle');
  const hatCards = document.querySelectorAll('.hat-card');
  const hatNameNone = document.getElementById('hatNameNone');
  const hatNameCrown = document.getElementById('hatNameCrown');
  const hatNameWizard = document.getElementById('hatNameWizard');
  const hatNameSunglasses = document.getElementById('hatNameSunglasses');
  const hatNameFlowers = document.getElementById('hatNameFlowers');
  const hatNameBow = document.getElementById('hatNameBow');
  const lockCrown = document.getElementById('lockCrown');
  const lockWizard = document.getElementById('lockWizard');
  const lockSunglasses = document.getElementById('lockSunglasses');
  const lockFlowers = document.getElementById('lockFlowers');
  const lockBow = document.getElementById('lockBow');

  // Sound Alerts Section
  const lblSoundSectionTitle = document.getElementById('lblSoundSectionTitle');
  const selectSound = document.getElementById('selectSound');
  const btnPreviewSound = document.getElementById('btnPreviewSound');

  // Procedural Ambient Soundscapes Section
  const lblAmbientSectionTitle = document.getElementById('lblAmbientSectionTitle');
  const selectAmbient = document.getElementById('selectAmbient');
  const sliderAmbientVolume = document.getElementById('sliderAmbientVolume');
  const lblAmbientVolumePercent = document.getElementById('lblAmbientVolumePercent');

  // Main Volume Section
  const lblVolumeSectionTitle = document.getElementById('lblVolumeSectionTitle');
  const sliderVolume = document.getElementById('sliderVolume');
  const lblVolumePercent = document.getElementById('lblVolumePercent');

  // --------------------------------------------------------------------------
  // INITIALIZE CORE ENGINES
  // --------------------------------------------------------------------------
  const i18n = new I18nManager();
  const tiger = new PixelTiger(canvas);
  const sound = new SoundEngine();

  // Character metadata with multi-language keys
  const characterMeta = {
    tiger: {
      key: 'tiger',
      icon: '🐯',
      title: 'TORA TIMER',
      nameKey: 'tigerName',
      descKey: 'tigerDesc',
      focusKey: 'tigerFocus'
    },
    hippo: {
      key: 'hippo',
      icon: '🦛',
      title: 'PIPPO TIMER',
      nameKey: 'hippoName',
      descKey: 'hippoDesc',
      focusKey: 'hippoFocus'
    },
    pig: {
      key: 'pig',
      icon: '🐷',
      title: 'NØFF TIMER',
      nameKey: 'pigName',
      descKey: 'pigDesc',
      focusKey: 'pigFocus'
    },
    guineapig: {
      key: 'guineapig',
      icon: '🐹',
      title: 'PIP TIMER',
      nameKey: 'guineapigName',
      descKey: 'guineapigDesc',
      focusKey: 'guineapigFocus'
    },
    avocado: {
      key: 'avocado',
      icon: '🥑',
      title: 'AVO TIMER',
      nameKey: 'avocadoName',
      descKey: 'avocadoDesc',
      focusKey: 'avocadoFocus'
    }
  };

  // Gamification Engine Initialization
  const game = new GamificationEngine({
    onXPChange: (levelData) => {
      updateGamificationUI(levelData);
      updateHatsUI();
    },
    onLevelUp: (levelData) => {
      handleLevelUp(levelData);
    },
    onUnlock: (hatId) => {
      handleHatUnlock(hatId);
    }
  });

  // Pomodoro Countdown Timer Initialization
  const timer = new PomodoroTimer({
    onTick: (timeData) => {
      updateTimerDisplay(timeData);
    },
    onStateChange: (state) => {
      updateUIForState(state);
    },
    onComplete: (result) => {
      handleTimerComplete(result);
    }
  });

  // Mini-Widget Mode state
  let isMiniMode = false;

  // --------------------------------------------------------------------------
  // INITIAL STATE SYNC & PREFERENCES
  // --------------------------------------------------------------------------

  // Initial Skin
  const initialSkin = tiger.getSkin() || 'tiger';

  // Initial Hat & Room Theme from Gamification Engine
  tiger.setHat(game.equippedHat || 'none');
  applyTheme(game.roomTheme || 'cozy', false);

  // Initial Focus Task
  if (game.currentTask) {
    taskInput.value = game.currentTask;
    btnTaskDone.classList.add('visible');
  }

  // Initial Sound Dropdown & Volume
  selectSound.value = sound.currentSound || 'chime';
  sliderVolume.value = Math.round(sound.volume * 100);
  lblVolumePercent.textContent = `${sliderVolume.value}%`;
  soundBtn.textContent = sound.isMuted ? '🔇' : '🔔';

  // Initial Ambient Sound Dropdown & Volume
  selectAmbient.value = sound.ambientType || 'none';
  const initAmbVol = sound.ambientVolume !== undefined ? Math.round(sound.ambientVolume * 100) : 40;
  sliderAmbientVolume.value = initAmbVol;
  lblAmbientVolumePercent.textContent = `${initAmbVol}%`;

  // Petting listener connects to Tamagotchi gamification
  tiger.onPet = () => {
    game.recordPet();
    updateHatsUI();
  };

  // --------------------------------------------------------------------------
  // LANGUAGE SWITCHING & LOCALIZATION
  // --------------------------------------------------------------------------
  function applyLanguage(lang) {
    i18n.setLang(lang);
    document.documentElement.lang = lang;

    // Update Language Buttons Active State
    langButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    // Update Window Title Bar Tooltips
    pinBtn.title = i18n.t('pinTitle');
    soundBtn.title = i18n.t('soundToggle');
    btnMiniMode.title = isMiniMode ? i18n.t('fullModeTitle') : i18n.t('miniModeTitle');
    settingsBtn.title = i18n.t('settingsTitle');
    minBtn.title = i18n.t('minimizeTitle');
    closeBtn.title = i18n.t('closeTitle');

    // Update Mini Widget Buttons Tooltips
    btnMiniToggle.title = timer.isRunning ? i18n.t('btnPause') : i18n.t('btnStart');
    btnMiniExpand.title = i18n.t('fullModeTitle');

    // Update Presets HTML
    presetFocusBtn.innerHTML = i18n.t('presetFocus');
    presetShortBtn.innerHTML = i18n.t('presetShort');
    presetLongBtn.innerHTML = i18n.t('presetLong');
    presetDeepBtn.innerHTML = i18n.t('presetDeep');

    // Update Custom Time Inputs
    lblCustomTime.textContent = i18n.t('customLabel');
    lblUnitHour.textContent = i18n.t('unitHour');
    lblUnitMin.textContent = i18n.t('unitMin');
    lblUnitSec.textContent = i18n.t('unitSec');
    btnSetCustom.textContent = i18n.t('btnSet');

    // Update Controls Text & Tooltips
    btnReset.title = i18n.t('btnResetTitle');
    btnSkip.title = i18n.t('btnSkipTitle');
    btnToggleText.textContent = timer.isRunning ? i18n.t('btnPause') : i18n.t('btnStart');

    // Update Footer & Hints
    lblPetHint.textContent = i18n.t('petHint');
    btnSoundTest.textContent = i18n.t('testSoundLink');

    // Update Task Banner
    taskInput.placeholder = i18n.t('taskPlaceholder');
    btnTaskDone.textContent = i18n.t('taskDoneBtn');

    // Update Settings Modal Labels
    lblSettingsTitle.textContent = i18n.t('modalHeader');
    lblLangSectionTitle.textContent = i18n.t('langSectionTitle');
    lblSkinSectionTitle.textContent = i18n.t('skinSectionTitle');
    lblThemeSectionTitle.textContent = i18n.t('themeSectionTitle');
    lblHatSectionTitle.textContent = i18n.t('hatSectionTitle');
    lblSoundSectionTitle.textContent = i18n.t('soundSectionTitle');
    lblAmbientSectionTitle.textContent = i18n.t('ambientSectionTitle');
    lblVolumeSectionTitle.textContent = i18n.t('volumeSectionTitle');

    btnPreviewSound.textContent = i18n.t('btnPreview');
    btnDoneSettings.textContent = i18n.t('btnDone');

    // Update Room Theme Buttons
    btnThemeCozy.textContent = i18n.t('themeCozy');
    btnThemeNight.textContent = i18n.t('themeNight');
    btnThemeSakura.textContent = i18n.t('themeSakura');
    btnThemeOasis.textContent = i18n.t('themeOasis');

    // Update Sound Alert Dropdown Options
    selectSound.options[0].text = i18n.t('soundChime');
    selectSound.options[1].text = i18n.t('soundRetro');
    selectSound.options[2].text = i18n.t('soundMarimba');
    selectSound.options[3].text = i18n.t('soundDigital');
    selectSound.options[4].text = i18n.t('soundHarp');

    // Update Ambient Soundscape Options
    selectAmbient.options[0].text = i18n.t('ambNone');
    selectAmbient.options[1].text = i18n.t('ambRain');
    selectAmbient.options[2].text = i18n.t('ambCampfire');
    selectAmbient.options[3].text = i18n.t('ambWind');
    selectAmbient.options[4].text = i18n.t('ambCafe');

    // Update Companion Names in Quick Bar & Modal
    btnNameTiger.textContent = i18n.t('tigerName');
    btnNameHippo.textContent = i18n.t('hippoName');
    btnNamePig.textContent = i18n.t('pigName');
    btnNameGuineaPig.textContent = i18n.t('guineapigName');
    btnNameAvocado.textContent = i18n.t('avocadoName');

    cardTitleTiger.textContent = i18n.t('tigerName');
    cardDescTiger.textContent = i18n.t('tigerDesc');
    cardTitleHippo.textContent = i18n.t('hippoName');
    cardDescHippo.textContent = i18n.t('hippoDesc');
    cardTitlePig.textContent = i18n.t('pigName');
    cardDescPig.textContent = i18n.t('pigDesc');
    cardTitleGuineaPig.textContent = i18n.t('guineapigName');
    cardDescGuineaPig.textContent = i18n.t('guineapigDesc');
    cardTitleAvocado.textContent = i18n.t('avocadoName');
    cardDescAvocado.textContent = i18n.t('avocadoDesc');

    // Refresh Gamification & Hats UI with updated language strings
    updateGamificationUI(game.getLevelData());
    updateHatsUI();

    // Re-apply skin text in selected language
    applySkin(tiger.getSkin(), false);
  }

  // Language Button Click Handler
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playClick();
      const lang = btn.getAttribute('data-lang');
      applyLanguage(lang);
    });
  });

  // --------------------------------------------------------------------------
  // COMPANION SKIN LOGIC
  // --------------------------------------------------------------------------
  function applySkin(skinKey, playSoundEffect = true) {
    if (!characterMeta[skinKey]) skinKey = 'tiger';

    tiger.setSkin(skinKey);
    const meta = characterMeta[skinKey];

    // Update Title bar
    titleIcon.textContent = meta.icon;
    titleText.textContent = meta.title;

    // Update Speech Bubble
    speechIcon.textContent = meta.icon;
    speechText.textContent = i18n.t(meta.focusKey);

    // Update Quick Skin Buttons
    quickSkinButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-skin') === skinKey);
    });

    // Update Modal Skin Cards
    modalSkinCards.forEach(card => {
      card.classList.toggle('active', card.getAttribute('data-skin') === skinKey);
    });

    if (playSoundEffect) {
      sound.playClick();
    }
  }

  quickSkinButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const skinKey = btn.getAttribute('data-skin');
      applySkin(skinKey, true);
    });
  });

  modalSkinCards.forEach(card => {
    card.addEventListener('click', () => {
      const skinKey = card.getAttribute('data-skin');
      applySkin(skinKey, true);
    });
  });

  // --------------------------------------------------------------------------
  // GAMIFICATION: XP, LEVELS, STREAKS & ACCESSORIES
  // --------------------------------------------------------------------------
  function updateGamificationUI(levelData) {
    const title = i18n.t(levelData.titleKey);
    levelBadge.textContent = `LVL ${levelData.level}: ${title.toUpperCase()}`;
    xpBarFill.style.width = `${levelData.percent}%`;
    xpText.textContent = levelData.isMaxLevel 
      ? `${levelData.currentXP} XP (MAX)` 
      : `${levelData.progressXP} / ${levelData.neededXP} XP`;

    streakCount.textContent = game.streak;
  }

  function handleLevelUp(levelData) {
    sound.init();
    sound.playAlert('harp');
    tiger.setState('timesUp', true);
    tiger.spawnConfetti(45);

    const title = i18n.t('levelUpTitle');
    const titleName = i18n.t(levelData.titleKey);
    const body = i18n.t('levelUpBody', { level: levelData.level, title: titleName });

    updateSpeechBubble(`${title} ${body}`);

    if (window.electronAPI && window.electronAPI.sendNotification) {
      window.electronAPI.sendNotification(title, body);
    }
  }

  function handleHatUnlock(hatId) {
    sound.init();
    sound.playAlert('harp');
    tiger.spawnConfetti(25);
    updateHatsUI();
    updateSpeechBubble(`✨ Ny hatt låst opp: ${hatId}!`);
  }

  function updateHatsUI() {
    hatCards.forEach(card => {
      const hatId = card.getAttribute('data-hat');
      const isUnlocked = game.isHatUnlocked(hatId);
      const isEquipped = game.equippedHat === hatId;

      card.classList.toggle('locked', !isUnlocked);
      card.classList.toggle('active', isEquipped);

      const lockTag = card.querySelector('.hat-lock-tag');
      if (lockTag) {
        lockTag.style.display = isUnlocked ? 'none' : 'block';
      }
    });
  }

  // Hat Card Click Handlers
  hatCards.forEach(card => {
    card.addEventListener('click', () => {
      const hatId = card.getAttribute('data-hat');
      if (game.isHatUnlocked(hatId)) {
        sound.playClick();
        game.equipHat(hatId);
        tiger.setHat(hatId);
        updateHatsUI();
      } else {
        sound.playClick();
        let lvlReq = '2';
        if (hatId === 'wizard') lvlReq = '3';
        if (hatId === 'sunglasses') lvlReq = '4';
        if (hatId === 'flowers') lvlReq = '5';
        if (hatId === 'bow') {
          updateSpeechBubble(i18n.t('hatBow'));
        } else {
          updateSpeechBubble(i18n.t('hatLocked', { lvl: lvlReq }));
        }
      }
    });
  });

  // --------------------------------------------------------------------------
  // ROOM THEMES (Cozy Day, Starry Night, Sakura, Botanical Oasis)
  // --------------------------------------------------------------------------
  function applyTheme(themeKey, playSoundEffect = true) {
    game.setTheme(themeKey);
    document.body.className = themeKey === 'cozy' ? '' : `theme-${themeKey}`;

    themeButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-theme') === themeKey);
    });

    if (playSoundEffect) {
      sound.playClick();
    }
  }

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const themeKey = btn.getAttribute('data-theme');
      applyTheme(themeKey, true);
    });
  });

  // --------------------------------------------------------------------------
  // MINI FOCUS TASK BANNER
  // --------------------------------------------------------------------------
  taskInput.addEventListener('input', () => {
    const val = taskInput.value.trim();
    game.setTask(taskInput.value);
    btnTaskDone.classList.toggle('visible', val.length > 0);
  });

  taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      taskInput.blur();
    }
  });

  btnTaskDone.addEventListener('click', () => {
    const completed = game.completeTask();
    if (completed) {
      sound.init();
      sound.playAlert('chime');
      tiger.petTiger();
      tiger.spawnConfetti(25);
      taskInput.value = '';
      btnTaskDone.classList.remove('visible');
      updateSpeechBubble(i18n.t('taskDoneSpeech'));
    }
  });

  // --------------------------------------------------------------------------
  // HYDRATION INTERACTION (Click bubble to drink water)
  // --------------------------------------------------------------------------
  speechBubble.addEventListener('click', () => {
    if (speechBubble.dataset.waterReminder === 'true') {
      delete speechBubble.dataset.waterReminder;
      game.drinkWater();
      sound.playAlert('harp');
      tiger.petTiger();
      updateSpeechBubble(i18n.t('waterReward'));
    }
  });

  // --------------------------------------------------------------------------
  // PROCEDURAL AMBIENT SOUNDSCAPES
  // --------------------------------------------------------------------------
  selectAmbient.addEventListener('change', () => {
    sound.init();
    sound.setAmbientSound(selectAmbient.value);
  });

  sliderAmbientVolume.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    lblAmbientVolumePercent.textContent = `${val}%`;
    sound.setAmbientVolume(val / 100);
  });

  // --------------------------------------------------------------------------
  // ULTRA-COMPACT MINI WIDGET MODE (240px x 72px)
  // --------------------------------------------------------------------------
  function toggleMiniMode(forceState) {
    isMiniMode = (typeof forceState === 'boolean') ? forceState : !isMiniMode;
    const frame = document.querySelector('.window-frame');
    frame.classList.toggle('mini-mode', isMiniMode);
    btnMiniMode.title = isMiniMode ? i18n.t('fullModeTitle') : i18n.t('miniModeTitle');

    if (window.electronAPI && window.electronAPI.setMiniMode) {
      window.electronAPI.setMiniMode(isMiniMode);
    }
  }

  btnMiniMode.addEventListener('click', () => {
    sound.playClick();
    toggleMiniMode(true);
  });

  btnMiniExpand.addEventListener('click', () => {
    sound.playClick();
    toggleMiniMode(false);
  });

  btnMiniToggle.addEventListener('click', () => {
    sound.init();
    sound.playClick();
    timer.toggle();
  });

  // --------------------------------------------------------------------------
  // SETTINGS MODAL
  // --------------------------------------------------------------------------
  settingsBtn.addEventListener('click', () => {
    sound.init();
    sound.playClick();
    updateHatsUI();
    settingsModal.classList.add('open');
  });

  btnCloseSettings.addEventListener('click', () => {
    sound.playClick();
    settingsModal.classList.remove('open');
  });

  btnDoneSettings.addEventListener('click', () => {
    sound.playClick();
    settingsModal.classList.remove('open');
  });

  // Sound Dropdown change
  selectSound.addEventListener('change', () => {
    sound.init();
    sound.setSound(selectSound.value);
    sound.playAlert();
  });

  // Preview Sound Button
  btnPreviewSound.addEventListener('click', () => {
    sound.init();
    sound.playAlert(selectSound.value);
    tiger.petTiger();
  });

  // Main Volume Slider
  sliderVolume.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    lblVolumePercent.textContent = `${val}%`;
    sound.setVolume(val / 100);
  });

  sliderVolume.addEventListener('change', () => {
    sound.init();
    sound.playClick();
  });

  // --------------------------------------------------------------------------
  // WINDOW CONTROLS (Electron IPC)
  // --------------------------------------------------------------------------
  if (window.electronAPI) {
    minBtn.addEventListener('click', () => {
      sound.playClick();
      window.electronAPI.minimizeWindow();
    });

    closeBtn.addEventListener('click', () => {
      sound.playClick();
      window.electronAPI.closeWindow();
    });

    pinBtn.addEventListener('click', async () => {
      sound.playClick();
      const isPinned = await window.electronAPI.toggleAlwaysOnTop();
      pinBtn.classList.toggle('active', isPinned);
      pinBtn.title = isPinned ? i18n.t('pinOn') : i18n.t('pinOff');
    });

    window.electronAPI.getAlwaysOnTop().then((isPinned) => {
      pinBtn.classList.toggle('active', isPinned);
      pinBtn.title = isPinned ? i18n.t('pinOn') : i18n.t('pinOff');
    });
  } else {
    minBtn.style.display = 'none';
    closeBtn.style.display = 'none';
  }

  // Sound toggle button
  soundBtn.addEventListener('click', () => {
    sound.init();
    const isMuted = sound.toggleMute();
    soundBtn.textContent = isMuted ? '🔇' : '🔔';
    soundBtn.title = i18n.t('soundToggle');
  });

  btnSoundTest.addEventListener('click', () => {
    sound.init();
    sound.playAlert();
    tiger.petTiger();
  });

  // --------------------------------------------------------------------------
  // PRIMARY TIMER CONTROLS
  // --------------------------------------------------------------------------
  btnToggle.addEventListener('click', () => {
    sound.init();
    sound.playClick();
    timer.toggle();
  });

  btnReset.addEventListener('click', () => {
    sound.playClick();
    timer.reset();
    tiger.setState(getCompanionStateForMode(timer.mode), false);
    updateSpeechBubble(i18n.t('timerReset'));
  });

  btnSkip.addEventListener('click', () => {
    sound.playClick();
    timer.skip();
  });

  // --------------------------------------------------------------------------
  // PRESET DURATION BUTTONS
  // --------------------------------------------------------------------------
  presetButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      sound.playClick();
      const presetMode = btn.getAttribute('data-preset');
      setActivePresetButton(btn);
      timer.setMode(presetMode);
      syncInputFieldsWithSeconds(timer.totalDuration);
    });
  });

  function setActivePresetButton(activeBtn) {
    presetButtons.forEach(b => b.classList.remove('active', 'active-break', 'active-long'));
    if (!activeBtn) return;

    const mode = activeBtn.getAttribute('data-preset');
    if (mode === 'shortBreak') {
      activeBtn.classList.add('active-break');
    } else if (mode === 'longBreak') {
      activeBtn.classList.add('active-long');
    } else {
      activeBtn.classList.add('active');
    }
  }

  // --------------------------------------------------------------------------
  // MANUAL CUSTOM TIME (HH:MM:SS)
  // --------------------------------------------------------------------------
  btnSetCustom.addEventListener('click', () => {
    sound.playClick();
    applyCustomTime();
  });

  [inputHours, inputMinutes, inputSeconds].forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        sound.playClick();
        applyCustomTime();
      }
    });
  });

  function applyCustomTime() {
    const h = parseInt(inputHours.value, 10) || 0;
    const m = parseInt(inputMinutes.value, 10) || 0;
    const s = parseInt(inputSeconds.value, 10) || 0;

    if (h === 0 && m === 0 && s === 0) {
      updateSpeechBubble(i18n.t('atLeastOneSec'));
      return;
    }

    presetButtons.forEach(b => b.classList.remove('active', 'active-break', 'active-long'));
    const success = timer.setCustomTime(h, m, s);
    if (success) {
      updateSpeechBubble(i18n.t('customTimerSet', { duration: formatDurationText(h, m, s) }));
    }
  }

  function formatDurationText(h, m, s) {
    const parts = [];
    if (h > 0) parts.push(`${h}${i18n.getLang() === 'no' ? 't' : 'h'}`);
    if (m > 0) parts.push(`${m}m`);
    if (s > 0) parts.push(`${s}s`);
    return parts.join(' ');
  }

  function syncInputFieldsWithSeconds(totalSecs) {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    inputHours.value = String(h).padStart(2, '0');
    inputMinutes.value = String(m).padStart(2, '0');
    inputSeconds.value = String(s).padStart(2, '0');
  }

  // --------------------------------------------------------------------------
  // UI & TIMER STATE UPDATES
  // --------------------------------------------------------------------------
  function updateTimerDisplay(timeData) {
    timerDigits.textContent = timeData.formatted;
    const percent = Math.max(0, Math.min(100, (timeData.remainingSeconds / timeData.totalDuration) * 100));
    progressBar.style.width = `${percent}%`;

    if (timer.mode === 'shortBreak') {
      progressBar.style.backgroundColor = 'var(--matcha-green)';
    } else if (timer.mode === 'longBreak') {
      progressBar.style.backgroundColor = 'var(--periwinkle)';
    } else {
      progressBar.style.backgroundColor = 'var(--tiger-orange)';
    }
  }

  function getCompanionStateForMode(mode) {
    if (mode === 'shortBreak') return 'shortBreak';
    if (mode === 'longBreak') return 'longBreak';
    return 'focus';
  }

  function updateUIForState(state) {
    const isRunning = state.isRunning;
    const mode = state.mode;
    const meta = characterMeta[tiger.getSkin()] || characterMeta.tiger;
    const companionName = i18n.t(meta.nameKey);

    // Toggle button text & icon (both full UI and mini-mode UI)
    if (isRunning) {
      btnToggleIcon.textContent = '⏸';
      btnToggleText.textContent = i18n.t('btnPause');
      btnToggle.classList.remove('paused-state');
      btnMiniToggle.textContent = '⏸';
    } else {
      btnToggleIcon.textContent = '▶';
      btnToggleText.textContent = i18n.t('btnStart');
      btnToggle.classList.add('paused-state');
      btnMiniToggle.textContent = '▶';
    }

    // Companion animation state
    if (!isRunning && state.remainingSeconds < state.totalDuration && state.remainingSeconds > 0) {
      tiger.setState('paused', false);
      updateSpeechBubble(i18n.t('pausedWaiting', { name: companionName }));
    } else {
      tiger.setState(getCompanionStateForMode(mode), isRunning);

      if (isRunning) {
        if (mode === 'focus' || mode === 'deep' || mode === 'custom') {
          updateSpeechBubble(i18n.t('deepFocus', { name: companionName }));
        } else if (mode === 'shortBreak') {
          updateSpeechBubble(i18n.t('teaBreak'));
        } else if (mode === 'longBreak') {
          updateSpeechBubble(i18n.t('longBreak'));
        }
      } else {
        if (mode === 'focus' || mode === 'deep' || mode === 'custom') {
          updateSpeechBubble(`${meta.icon} ${i18n.t(meta.focusKey)}`);
        } else if (mode === 'shortBreak') {
          updateSpeechBubble(i18n.t('teaBreak'));
        } else if (mode === 'longBreak') {
          updateSpeechBubble(i18n.t('longBreak'));
        }
      }
    }

    updateSessionPaws(state.completedSessions);
  }

  function updateSpeechBubble(text) {
    speechText.textContent = text;
  }

  function updateSessionPaws(count) {
    const currentInCycle = count % 4;
    pawElements.forEach((paw, index) => {
      if (index < currentInCycle) {
        paw.classList.add('completed');
      } else {
        paw.classList.remove('completed');
      }
    });
    sessionLabel.textContent = `${currentInCycle}/4 ${i18n.t('completedSuffix')}`;
  }

  function handleTimerComplete(result) {
    sound.init();
    sound.playAlert();

    tiger.setState('timesUp', true);

    const meta = characterMeta[tiger.getSkin()] || characterMeta.tiger;
    const companionName = i18n.t(meta.nameKey);

    let title = `${meta.icon} ${companionName} Pomodoro`;
    let body = "Tiden er ute!";

    const isFocus = (result.finishedMode === 'focus' || result.finishedMode === 'deep' || result.finishedMode === 'custom');

    if (isFocus) {
      // Award +25 XP for completing a focus session!
      game.addXP(25);

      if (result.isLongBreakReady) {
        title = i18n.t('notifLongBreakTitle', { name: companionName });
        body = i18n.t('notifLongBreakBody', { name: companionName });
        updateSpeechBubble(`🎉 ${title}`);
      } else {
        title = i18n.t('notifFocusDoneTitle');
        body = i18n.t('notifFocusDoneBody', { name: companionName });
        updateSpeechBubble(`🎉 ${title}`);
      }

      // Check hydration reminder every 2 focus sessions
      const shouldRemindWater = game.incrementWaterSession();
      if (shouldRemindWater) {
        speechBubble.dataset.waterReminder = 'true';
        setTimeout(() => {
          updateSpeechBubble(i18n.t('waterReminder'));
        }, 4600);
      }
    } else {
      // Award +10 XP for resting properly during break!
      game.addXP(10);
      title = i18n.t('notifBreakDoneTitle');
      body = i18n.t('notifBreakDoneBody', { name: companionName });
      updateSpeechBubble(`✨ ${title}`);
    }

    if (window.electronAPI && window.electronAPI.sendNotification) {
      window.electronAPI.sendNotification(title, body);
    } else if (Notification && Notification.permission === 'granted') {
      new Notification(title, { body });
    } else if (Notification && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, { body });
        }
      });
    }

    setTimeout(() => {
      if (isFocus) {
        if (result.isLongBreakReady) {
          const longBtn = document.querySelector('[data-preset="longBreak"]');
          setActivePresetButton(longBtn);
          timer.setMode('longBreak');
        } else {
          const shortBtn = document.querySelector('[data-preset="shortBreak"]');
          setActivePresetButton(shortBtn);
          timer.setMode('shortBreak');
        }
      } else {
        const focusBtn = document.querySelector('[data-preset="focus"]');
        setActivePresetButton(focusBtn);
        timer.setMode('focus');
      }
      syncInputFieldsWithSeconds(timer.totalDuration);
    }, 4500);
  }

  // --------------------------------------------------------------------------
  // INITIAL SYNCHRONIZATION & BOOTSTRAP
  // --------------------------------------------------------------------------
  applyLanguage(i18n.getLang());
  syncInputFieldsWithSeconds(timer.totalDuration);
  updateTimerDisplay(timer.getTimeData());
  updateGamificationUI(game.getLevelData());
  updateHatsUI();
});
