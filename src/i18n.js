/**
 * Internationalization (i18n) Engine
 * Multi-language support for Tiger & Friends Pomodoro.
 * Supports: Norwegian (Norsk Bokmål 'no') and English ('en').
 */

const translations = {
  no: {
    // Window header & tooltips
    pinTitle: 'Alltid øverst (Pin)',
    pinOn: 'Alltid øverst: PÅ',
    pinOff: 'Alltid øverst: AV',
    soundToggle: 'Lyd Av/På',
    settingsTitle: 'Innstillinger (Språk, Skins & Lyd)',
    minimizeTitle: 'Minimer',
    closeTitle: 'Lukk',

    // Companion Names
    tigerName: 'Tiger',
    tigerDesc: 'Koselig tiger',
    hippoName: 'Flodhest',
    hippoDesc: 'Rolig & chubby',
    pigName: 'Gris',
    pigDesc: 'Søt rosa muntergauk',
    guineapigName: 'Marsvin',
    guineapigDesc: 'Liten lodden potet',
    avocadoName: 'Avokado',
    avocadoDesc: 'Frisk & fokusert',

    // Speech Bubbles (Companion Greetings)
    tigerFocus: 'Klar til fokus med Tiger!',
    hippoFocus: 'Flodhesten holder roen med deg!',
    pigFocus: 'Grisen heier på deg! Nøff!',
    guineapigFocus: 'Marsvinet gomler fokus!',
    avocadoFocus: 'Avokadoen holder hodet friskt!',

    // In-Session Speech
    deepFocus: '🎧 Dyp fokus! {name} er med deg!',
    pausedWaiting: '⏸️ Pauset. {name} venter på deg...',
    teaBreak: '🍵 Tid for en koselig pause! Strekk labbene',
    longBreak: '🌟 Langpause klar! Velfortjent hvile',
    readyToFocus: '🐯 Klar til fokus! Trykk på Start',
    timerReset: '↺ Timer tilbakestilt. Klar når du er!',
    atLeastOneSec: '⚠️ Vennligst sett minst 1 sekund!',
    customTimerSet: '⏱️ Egendefinert: {duration}',

    // Presets
    presetFocus: '25m<br>Fokus',
    presetShort: '5m<br>Kort',
    presetLong: '15m<br>Lang',
    presetDeep: '50m<br>Dyp',

    // Custom Time
    customLabel: 'Egendefinert:',
    unitHour: 'TIME',
    unitMin: 'MIN',
    unitSec: 'SEK',
    btnSet: 'Sett',

    // Action Controls
    btnStart: 'START',
    btnPause: 'PAUSE',
    btnResetTitle: 'Tilbakestill timer',
    btnSkipTitle: 'Hopp til neste runde',

    // Session Tracker & Hints
    completedSuffix: 'Fullført',
    petHint: '🐾 Klikk på vennen for kos',
    testSoundLink: 'Test lyd ♫',

    // Settings Modal
    modalHeader: '⚙️ INNSTILLINGER',
    langSectionTitle: '🌐 Språk / Language:',
    skinSectionTitle: '🎨 Velg Skrivebordsvenn (Skins):',
    soundSectionTitle: '🔔 Velg Timer-Lyd:',
    volumeSectionTitle: '🔊 Lydstyrke:',
    btnPreview: '▶ Test',
    btnDone: '✓ Ferdig & Lagre',

    // Sound Names
    soundChime: '🔔 Melodisk Klokkespill',
    soundRetro: '🕹️ 8-Bit Retro Arkade',
    soundMarimba: '🪵 Varm Marimba / Kalimba',
    soundDigital: '⏰ Digital Klokke (Beep)',
    soundHarp: '✨ Magisk Harpe',

    // Notifications
    notifFocusDoneTitle: '⏰ Fokusrunde fullført!',
    notifFocusDoneBody: 'Tid for en 5-minutters pause sammen med {name}.',
    notifLongBreakTitle: '🎉 4 runder fullført med {name}!',
    notifLongBreakBody: 'Du har fortjent en 15-minutters langpause!',
    notifBreakDoneTitle: '⏰ Pausen er over!',
    notifBreakDoneBody: 'Klar for en ny fokusrunde med {name}?'
  },

  en: {
    // Window header & tooltips
    pinTitle: 'Always on Top (Pin)',
    pinOn: 'Always on Top: ON',
    pinOff: 'Always on Top: OFF',
    soundToggle: 'Toggle Sound',
    settingsTitle: 'Settings (Language, Skins & Sound)',
    minimizeTitle: 'Minimize',
    closeTitle: 'Close',

    // Companion Names
    tigerName: 'Tiger',
    tigerDesc: 'Cozy striped buddy',
    hippoName: 'Hippo',
    hippoDesc: 'Calm & chubby',
    pigName: 'Pig',
    pigDesc: 'Sweet cheerful piggy',
    guineapigName: 'Guinea Pig',
    guineapigDesc: 'Cute furry potato',
    avocadoName: 'Avocado',
    avocadoDesc: 'Fresh & focused',

    // Speech Bubbles (Companion Greetings)
    tigerFocus: 'Ready to focus with Tiger!',
    hippoFocus: 'Hippo is keeping you calm!',
    pigFocus: 'Piggy is rooting for you! Oink!',
    guineapigFocus: 'Guinea Pig is munching on focus!',
    avocadoFocus: 'Avocado keeps your mind fresh!',

    // In-Session Speech
    deepFocus: '🎧 Deep focus! {name} is with you!',
    pausedWaiting: '⏸️ Paused. {name} is waiting for you...',
    teaBreak: '🍵 Cozy tea break! Stretch your paws',
    longBreak: '🌟 Long rest! Well-deserved break',
    readyToFocus: '🐯 Ready to focus! Press Start',
    timerReset: '↺ Timer reset. Ready when you are!',
    atLeastOneSec: '⚠️ Please set at least 1 second!',
    customTimerSet: '⏱️ Custom: {duration}',

    // Presets
    presetFocus: '25m<br>Focus',
    presetShort: '5m<br>Short',
    presetLong: '15m<br>Long',
    presetDeep: '50m<br>Deep',

    // Custom Time
    customLabel: 'Custom:',
    unitHour: 'HR',
    unitMin: 'MIN',
    unitSec: 'SEC',
    btnSet: 'Set',

    // Action Controls
    btnStart: 'START',
    btnPause: 'PAUSE',
    btnResetTitle: 'Reset timer',
    btnSkipTitle: 'Skip to next round',

    // Session Tracker & Hints
    completedSuffix: 'Completed',
    petHint: '🐾 Click friend to pet',
    testSoundLink: 'Test sound ♫',

    // Settings Modal
    modalHeader: '⚙️ SETTINGS',
    langSectionTitle: '🌐 Language / Språk:',
    skinSectionTitle: '🎨 Choose Companion (Skins):',
    soundSectionTitle: '🔔 Select Timer Sound:',
    volumeSectionTitle: '🔊 Volume:',
    btnPreview: '▶ Test',
    btnDone: '✓ Done & Save',

    // Sound Names
    soundChime: '🔔 Melodic Chime',
    soundRetro: '🕹️ 8-Bit Retro Arcade',
    soundMarimba: '🪵 Warm Marimba / Kalimba',
    soundDigital: '⏰ Digital Watch (Beep)',
    soundHarp: '✨ Magical Harp',

    // Notifications
    notifFocusDoneTitle: '⏰ Focus session complete!',
    notifFocusDoneBody: 'Time for a 5-minute break with {name}.',
    notifLongBreakTitle: '🎉 4 rounds completed with {name}!',
    notifLongBreakBody: 'You earned a 15-minute long break!',
    notifBreakDoneTitle: '⏰ Break is over!',
    notifBreakDoneBody: 'Ready for another round with {name}?'
  }
};

class I18nManager {
  constructor() {
    this.currentLang = 'no';
    try {
      const saved = localStorage.getItem('tiger_language');
      if (saved && translations[saved]) {
        this.currentLang = saved;
      }
    } catch (e) {}
  }

  getLang() {
    return this.currentLang;
  }

  setLang(lang) {
    if (translations[lang]) {
      this.currentLang = lang;
      try {
        localStorage.setItem('tiger_language', lang);
      } catch (e) {}
    }
  }

  t(key, replacements = {}) {
    let text = (translations[this.currentLang] && translations[this.currentLang][key]) ||
               translations['en'][key] || key;

    for (const [placeholder, value] of Object.entries(replacements)) {
      text = text.replace(new RegExp(`\\{${placeholder}\\}`, 'g'), value);
    }
    return text;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { translations, I18nManager };
}
