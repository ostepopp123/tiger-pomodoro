/**
 * Tiger & Friends Pomodoro Application Controller
 * Connects the UI, Companions (Tiger, Hippo, Pig, Guinea Pig, Avocado),
 * Procedural Sound Engine, Pomodoro timer, and Multi-Language (i18n) Engine.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const canvas = document.getElementById('tigerCanvas');
  const timerDigits = document.getElementById('timerDigits');
  const progressBar = document.getElementById('progressBar');
  const speechBubble = document.getElementById('speechBubble');
  const speechIcon = document.getElementById('speechIcon');
  const speechText = document.getElementById('speechText');

  const titleIcon = document.getElementById('titleIcon');
  const titleText = document.getElementById('titleText');

  const btnToggle = document.getElementById('btnToggle');
  const btnToggleIcon = document.getElementById('btnToggleIcon');
  const btnToggleText = document.getElementById('btnToggleText');
  const btnReset = document.getElementById('btnReset');
  const btnSkip = document.getElementById('btnSkip');

  const presetButtons = document.querySelectorAll('.preset-btn');
  const presetFocusBtn = document.getElementById('presetFocusBtn');
  const presetShortBtn = document.getElementById('presetShortBtn');
  const presetLongBtn = document.getElementById('presetLongBtn');
  const presetDeepBtn = document.getElementById('presetDeepBtn');

  const inputHours = document.getElementById('inputHours');
  const inputMinutes = document.getElementById('inputMinutes');
  const inputSeconds = document.getElementById('inputSeconds');
  const btnSetCustom = document.getElementById('btnSetCustom');
  const lblCustomTime = document.getElementById('lblCustomTime');
  const lblUnitHour = document.getElementById('lblUnitHour');
  const lblUnitMin = document.getElementById('lblUnitMin');
  const lblUnitSec = document.getElementById('lblUnitSec');

  const pawElements = [
    document.getElementById('paw0'),
    document.getElementById('paw1'),
    document.getElementById('paw2'),
    document.getElementById('paw3')
  ];
  const sessionLabel = document.getElementById('sessionLabel');
  const lblPetHint = document.getElementById('lblPetHint');

  const pinBtn = document.getElementById('pinBtn');
  const soundBtn = document.getElementById('soundBtn');
  const settingsBtn = document.getElementById('settingsBtn');
  const minBtn = document.getElementById('minBtn');
  const closeBtn = document.getElementById('closeBtn');
  const btnSoundTest = document.getElementById('btnSoundTest');

  // Skin Elements
  const quickSkinButtons = document.querySelectorAll('.skin-btn');
  const modalSkinCards = document.querySelectorAll('.modal-skin-card');

  // Settings Modal Elements
  const settingsModal = document.getElementById('settingsModal');
  const btnCloseSettings = document.getElementById('btnCloseSettings');
  const btnDoneSettings = document.getElementById('btnDoneSettings');
  const selectSound = document.getElementById('selectSound');
  const btnPreviewSound = document.getElementById('btnPreviewSound');
  const sliderVolume = document.getElementById('sliderVolume');
  const lblVolumePercent = document.getElementById('lblVolumePercent');

  const lblSettingsTitle = document.getElementById('lblSettingsTitle');
  const lblLangSectionTitle = document.getElementById('lblLangSectionTitle');
  const lblSkinSectionTitle = document.getElementById('lblSkinSectionTitle');
  const lblSoundSectionTitle = document.getElementById('lblSoundSectionTitle');
  const lblVolumeSectionTitle = document.getElementById('lblVolumeSectionTitle');
  const langButtons = document.querySelectorAll('.lang-btn');

  // Quick skin button labels
  const btnNameTiger = document.getElementById('btnNameTiger');
  const btnNameHippo = document.getElementById('btnNameHippo');
  const btnNamePig = document.getElementById('btnNamePig');
  const btnNameGuineaPig = document.getElementById('btnNameGuineaPig');
  const btnNameAvocado = document.getElementById('btnNameAvocado');

  // Modal card labels
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

  // Initialize Engines
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

  // Set active skin from saved state
  const initialSkin = tiger.getSkin() || 'tiger';

  // Set active sound & volume in UI from sound engine
  selectSound.value = sound.currentSound || 'chime';
  sliderVolume.value = Math.round(sound.volume * 100);
  lblVolumePercent.textContent = `${sliderVolume.value}%`;
  soundBtn.textContent = sound.isMuted ? '🔇' : '🔔';

  // Initialize Timer
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

  // --- LANGUAGE SWITCHING (i18n) ---
  function applyLanguage(lang) {
    i18n.setLang(lang);
    document.documentElement.lang = lang;

    // Update Language Buttons Active State
    langButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    // Update Window Tooltips
    pinBtn.title = i18n.t('pinTitle');
    soundBtn.title = i18n.t('soundToggle');
    settingsBtn.title = i18n.t('settingsTitle');
    minBtn.title = i18n.t('minimizeTitle');
    closeBtn.title = i18n.t('closeTitle');

    // Update Presets HTML
    presetFocusBtn.innerHTML = i18n.t('presetFocus');
    presetShortBtn.innerHTML = i18n.t('presetShort');
    presetLongBtn.innerHTML = i18n.t('presetLong');
    presetDeepBtn.innerHTML = i18n.t('presetDeep');

    // Update Custom Time Labels
    lblCustomTime.textContent = i18n.t('customLabel');
    lblUnitHour.textContent = i18n.t('unitHour');
    lblUnitMin.textContent = i18n.t('unitMin');
    lblUnitSec.textContent = i18n.t('unitSec');
    btnSetCustom.textContent = i18n.t('btnSet');

    // Update Controls Tooltips & Text
    btnReset.title = i18n.t('btnResetTitle');
    btnSkip.title = i18n.t('btnSkipTitle');
    btnToggleText.textContent = timer.isRunning ? i18n.t('btnPause') : i18n.t('btnStart');

    // Update Footer & Hints
    lblPetHint.textContent = i18n.t('petHint');
    btnSoundTest.textContent = i18n.t('testSoundLink');

    // Update Settings Modal Labels
    lblSettingsTitle.textContent = i18n.t('modalHeader');
    lblLangSectionTitle.textContent = i18n.t('langSectionTitle');
    lblSkinSectionTitle.textContent = i18n.t('skinSectionTitle');
    lblSoundSectionTitle.textContent = i18n.t('soundSectionTitle');
    lblVolumeSectionTitle.textContent = i18n.t('volumeSectionTitle');
    btnPreviewSound.textContent = i18n.t('btnPreview');
    btnDoneSettings.textContent = i18n.t('btnDone');

    // Update Sound Dropdown Options
    selectSound.options[0].text = i18n.t('soundChime');
    selectSound.options[1].text = i18n.t('soundRetro');
    selectSound.options[2].text = i18n.t('soundMarimba');
    selectSound.options[3].text = i18n.t('soundDigital');
    selectSound.options[4].text = i18n.t('soundHarp');

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

    // Re-apply skin text in selected language
    applySkin(tiger.getSkin(), false);
  }

  // Language Button Clicks
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playClick();
      const lang = btn.getAttribute('data-lang');
      applyLanguage(lang);
    });
  });

  // --- COMPANION SKIN LOGIC ---
  function applySkin(skinKey, playSound = true) {
    if (!characterMeta[skinKey]) skinKey = 'tiger';

    tiger.setSkin(skinKey);
    const meta = characterMeta[skinKey];
    const name = i18n.t(meta.nameKey);

    // Update Title bar
    titleIcon.textContent = meta.icon;
    titleText.textContent = meta.title;

    // Update speech
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

    if (playSound) {
      sound.playClick();
    }
  }

  // Quick Bar clicks
  quickSkinButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const skinKey = btn.getAttribute('data-skin');
      applySkin(skinKey, true);
    });
  });

  // Modal Card clicks
  modalSkinCards.forEach(card => {
    card.addEventListener('click', () => {
      const skinKey = card.getAttribute('data-skin');
      applySkin(skinKey, true);
    });
  });

  // --- SETTINGS MODAL LOGIC ---
  settingsBtn.addEventListener('click', () => {
    sound.init();
    sound.playClick();
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

  // Volume Slider
  sliderVolume.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    lblVolumePercent.textContent = `${val}%`;
    sound.setVolume(val / 100);
  });

  sliderVolume.addEventListener('change', () => {
    sound.init();
    sound.playClick();
  });

  // --- WINDOW CONTROLS (Electron IPC) ---
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

  // --- SOUND TOGGLE & QUICK PREVIEW ---
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

  // --- PRIMARY CONTROLS ---
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

  // --- PRESETS ---
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

  // --- MANUAL CUSTOM TIME (HH:MM:SS) ---
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

  // --- UI STATE UPDATES ---
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

    // Toggle button text & icon
    if (isRunning) {
      btnToggleIcon.textContent = '⏸';
      btnToggleText.textContent = i18n.t('btnPause');
      btnToggle.classList.remove('paused-state');
    } else {
      btnToggleIcon.textContent = '▶';
      btnToggleText.textContent = i18n.t('btnStart');
      btnToggle.classList.add('paused-state');
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

    if (result.finishedMode === 'focus' || result.finishedMode === 'deep' || result.finishedMode === 'custom') {
      if (result.isLongBreakReady) {
        title = i18n.t('notifLongBreakTitle', { name: companionName });
        body = i18n.t('notifLongBreakBody', { name: companionName });
        updateSpeechBubble(`🎉 ${title}`);
      } else {
        title = i18n.t('notifFocusDoneTitle');
        body = i18n.t('notifFocusDoneBody', { name: companionName });
        updateSpeechBubble(`🎉 ${title}`);
      }
    } else {
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
      if (result.finishedMode === 'focus' || result.finishedMode === 'deep' || result.finishedMode === 'custom') {
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

  // Initial Sync & Language Activation
  applyLanguage(i18n.getLang());
  syncInputFieldsWithSeconds(timer.totalDuration);
  updateTimerDisplay(timer.getTimeData());
});
