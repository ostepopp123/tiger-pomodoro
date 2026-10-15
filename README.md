# 🐯 Tiger & Friends Pomodoro Desk Buddy

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-blue.svg)](#)
[![Language](https://img.shields.io/badge/Languages-Norsk%20%7C%20English-orange.svg)](#)

An adorable, lightweight, standalone desktop Pomodoro timer featuring **5 cozy Pixel Art companions** (Tiger, Hippo, Pig, Guinea Pig, and Avocado). Built as a frameless desk companion widget with procedural animations, custom duration controls (HH:MM:SS), customizable retro soundscapes, multi-language support (English & Norsk), and an **Always-on-Top (📌)** floating pin.

---

## ✨ Features / Funksjoner

### 🐾 5 Pixel Art Companions / Skrivebordsvenner
100% procedurally rendered on an HTML5 canvas pixel matrix—**zero external image assets required**.
- **🐯 Tiger (Tora)**: Warm orange coat, soft charcoal stripes, and white muzzle.
- **🦛 Hippo / Flodhest (Pippo)**: Pastel lavender-blue chubby buddy with cute nostrils and tiny baby teeth.
- **🐷 Pig / Gris (Nøff)**: Sweet baby pink with floppy folded ears, rosy snout, and a curly tail.
- **🐹 Guinea Pig / Marsvin (Pip)**: Fluffy toffee & cream potato shape, munching on a tiny dandelion leaf snack.
- **🥑 Avocado / Avokado (Avo)**: Dark green skin, creamy lime flesh, a round seed tummy, and a perky leaf on top!

### 🎭 Micro-States & Animations
- **Focus Mode**: Headphones on, rhythmic head bobs, floating musical notes (`♪`, `♫`).
- **Paused Mode**: Curious head tilt, waiting ellipsis, and soft tail twitches.
- **Break Mode**: Sipping a warm cup of cocoa (`^ _ ^`) or cozy slumber.
- **Time's Up**: Celebratory raised paws with bursting colorful confetti and star sparkles!
- **Interactive Pet**: Click on your companion anytime to pet them and watch them wink!

### 🔔 5 Customizable Synthesized Sounds
Procedural Web Audio API sound generator (no external audio files needed):
1. **🔔 Melodic Chime / Klokkespill** (Default): Gentle ascending bells (C5–E5–G5–B5–C6).
2. **🕹️ 8-Bit Retro Arcade**: Upbeat Game Boy victory fanfare.
3. **🪵 Warm Marimba / Kalimba**: Soft, calming wooden acoustic tones.
4. **⏰ Digital Watch Beep**: Nostalgic classic wristwatch alarm (`beep-beep beep-beep`).
5. **✨ Magical Harp**: Twinkling fairy glissando.
- Volume slider (0% to 100%) and instant sound preview button.

### 🌐 Multi-Language Support (i18n)
- **🇳🇴 Norsk (Bokmål)** and **🇬🇧 English** supported.
- Switch languages seamlessly with 1-click in the Settings menu (`⚙️`).
- All tooltips, presets, buttons, speech bubbles, and notifications update in real-time.

### ⏱️ Flexible Countdown & Presets
- **Manual Input (HH : MM : SS)**: Set any custom hours, minutes, and seconds.
- **Quick Presets**: 25m Focus, 5m Short Break, 15m Long Break, 50m Deep Work.
- **Controls**: Start ▶, Pause ⏸, Reset ↺, Skip ⏭.
- **Session Tracker**: 4 cute paw markers (`🐾 🐾 ⚪ ⚪`) keep track of your focus sets.

### 📌 Desktop Widget Mode
- **Borderless / Frameless Window**: Clean, rounded pastel aesthetic.
- **Always on Top (📌)**: Pin the timer so it floats over your IDE, browser, or documents.
- **Draggable Window**: Click and drag anywhere on the header to move the widget.

---

## 🚀 How to Run the App / Hvordan kjøre appen

### Option 1: 1-Click Launch (Windows)
Double-click the **`run.bat`** file in the project folder.

### Option 2: Run via Terminal (Node.js & Electron)
```bash
# 1. Install dependencies (only needed the first time)
npm install

# 2. Start the application
npm start
```

### Option 3: Standalone Zero-Dependency Python Script
Run with Python's built-in standard library (`tkinter`):
```bash
python tiger_pomodoro.py
```

---

## 📦 How to Package into an Executable (.exe)

### Windows Executable (.exe):
- **1-Click**: Double-click **`build-exe.bat`**.
- **Or via Terminal**:
  ```bash
  npm run build:exe
  ```
The standalone single-file executable will be generated inside the `dist/` directory:
- `dist/Tiger-Pomodoro-Windows.exe` (Runs on any Windows PC without installation!)

### macOS (.app) or Linux:
```bash
# macOS
npx electron-builder --mac

# Linux
npx electron-builder --linux
```

---

## 🛡️ Security & Privacy (Sikkerhet)

This project has been configured with strict privacy and security practices:
- **No hardcoded secrets or personal paths**: Source files contain zero API keys, passwords, or personal credentials.
- **Comprehensive `.gitignore`**: Automatically prevents committing build folders (`dist/`), packages (`node_modules/`), system caches, logs, or `.env` files to GitHub.
- **100% Offline & Procedural**: All pixel art and sounds are generated locally in code without external network dependencies.

---

## 🐙 Publishing to GitHub (Steg-for-steg for nybegynnere)

Hvis du aldri har lagt ut noe på GitHub før, følg denne enkle veiledningen:

### Metode 1: Via GitHub Desktop (Anbefalt og enklest!)
1. Last ned og installer gratisprogrammet **[GitHub Desktop](https://desktop.github.com/)**.
2. Logg inn med din GitHub-konto (eller lag en gratis konto på [github.com](https://github.com)).
3. I GitHub Desktop: Velg **File** ➔ **Add Local Repository**.
4. Velg mappen til prosjektet (`c:\AI prosjekter\pomodoro`).
5. Hvis den spør om å lage et repository, trykk **Create a Repository**.
6. Trykk på den blå knappen **Publish repository** øverst.
   - Velg et navn (f.eks. `tiger-pomodoro`).
   - Huk av eller på *Keep this code private* (avhuket = offentlig for alle).
7. Trykk **Publish repository**.
8. **Ferdig!** `.gitignore` sørger automatisk for at kun de rene kildekodefilene lastes opp – ingen tunge `node_modules` eller `.exe`-filer blir lastet opp til koden.

---

### Metode 2: Via Git i Terminal
1. Installer Git fra **[git-scm.com](https://git-scm.com/)**.
2. Åpne [github.com](https://github.com) og trykk **New Repository** (la "Add README" og "Add .gitignore" være **uhuket**, da vi allerede har disse filene lokalt).
3. Åpne terminalen i prosjektmappen og kjør:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Tiger & Friends Pomodoro"
   git branch -M main
   git remote add origin https://github.com/DITT-BRUKERNAVN/DITT-REPO-NAVN.git
   git push -u origin main
   ```

---

## 📂 Project Architecture

```
pomodoro/
├── package.json              # Electron & build configuration
├── main.js                   # Frameless window manager, IPC & desktop notifications
├── preload.js                # Secure context bridge between Electron and UI
├── run.bat                   # 1-click Windows launcher
├── build-exe.bat             # 1-click Windows executable builder
├── tiger_pomodoro.py         # Standalone Python Tkinter alternative
├── .gitignore                # Protects sensitive files, node_modules & dist/
├── LICENSE                   # Open-source MIT License
├── README.md                 # Documentation in English & Norwegian
└── src/
    ├── index.html            # UI layout: custom frame, stage, timer, controls, modal
    ├── styles.css            # Pastel aesthetic, pixel typography & animations
    ├── i18n.js               # Multi-language translation engine (Norsk & English)
    ├── tiger.js              # Pixel art companion procedural canvas (5 skins)
    ├── audio.js              # Web Audio API sound synthesizer (5 alert sounds)
    ├── timer.js              # Pomodoro timer engine (presets, countdown, sessions)
    └── app.js                # Application coordinator & event bindings
```

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
