/**
 * Cozy Web Audio API Sound Generator & Synthesizer
 * Generates sweet retro chimes, 8-bit arcade fanfares, marimba/kalimba,
 * digital watch beeps, and magical harp glissandos procedurally.
 * No external audio files needed!
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.volume = 0.6;
    this.currentSound = 'chime'; // 'chime', 'retro', 'marimba', 'digital', 'harp'

    // Load saved sound preference
    try {
      const saved = localStorage.getItem('tiger_sound_type');
      if (saved) this.currentSound = saved;
      const savedVol = localStorage.getItem('tiger_sound_volume');
      if (savedVol !== null) this.volume = parseFloat(savedVol);
      const savedMute = localStorage.getItem('tiger_sound_muted');
      if (savedMute !== null) this.isMuted = (savedMute === 'true');
    } catch (e) {}
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  getSoundList() {
    return [
      { id: 'chime', name: '🔔 Melodisk Klokkespill (Melodic Chime)' },
      { id: 'retro', name: '🕹️ 8-Bit Retro Arkade (Arcade Fanfare)' },
      { id: 'marimba', name: '🪵 Varm Marimba / Kalimba' },
      { id: 'digital', name: '⏰ Digital Klokke (Wristwatch Beep)' },
      { id: 'harp', name: '✨ Magisk Harpe (Sparkle Harp)' }
    ];
  }

  setSound(soundId) {
    this.currentSound = soundId;
    try {
      localStorage.setItem('tiger_sound_type', soundId);
    } catch (e) {}
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('tiger_sound_muted', String(this.isMuted));
    } catch (e) {}
    return this.isMuted;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('tiger_sound_volume', String(this.volume));
    } catch (e) {}
  }

  // Play soft tactile button click
  playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(160, this.ctx.currentTime + 0.035);

    gain.gain.setValueAtTime(this.volume * 0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.035);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  // Master method to play current alert sound
  playAlert(soundOverride = null) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const sound = soundOverride || this.currentSound;

    switch (sound) {
      case 'retro':
        this.playRetro8bit();
        break;
      case 'marimba':
        this.playMarimba();
        break;
      case 'digital':
        this.playDigitalWatch();
        break;
      case 'harp':
        this.playHarp();
        break;
      case 'chime':
      default:
        this.playMelodicChime();
        break;
    }
  }

  // 1. Melodic Chime (Warm bells)
  playMelodicChime() {
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.50]; // C5, E5, G5, B5, C6
    const now = this.ctx.currentTime;

    notes.forEach((freq, index) => {
      const startTime = now + index * 0.12;
      const duration = 1.6;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(this.volume * 0.28, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);

      // Sub harmonic
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(freq / 2, startTime);
      subGain.gain.setValueAtTime(0.0001, startTime);
      subGain.gain.linearRampToValueAtTime(this.volume * 0.12, startTime + 0.03);
      subGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.7);

      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(startTime);
      sub.stop(startTime + duration * 0.7);
    });
  }

  // 2. 8-Bit Retro Arkade (Upbeat Game Boy Victory)
  playRetro8bit() {
    const notes = [
      { f: 392.00, d: 0.10 }, // G4
      { f: 523.25, d: 0.10 }, // C5
      { f: 659.25, d: 0.10 }, // E5
      { f: 783.99, d: 0.15 }, // G5
      { f: 1046.50, d: 0.35 } // C6
    ];

    let t = this.ctx.currentTime;
    notes.forEach(note => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(note.f, t);

      gain.gain.setValueAtTime(this.volume * 0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + note.d);
      t += note.d * 1.05;
    });
  }

  // 3. Warm Marimba / Kalimba (Organic wooden tones)
  playMarimba() {
    const notes = [349.23, 440.00, 523.25, 659.25, 880.00]; // F4, A4, C5, E5, A5
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const t = now + idx * 0.14;
      const duration = 0.8;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      // Fast percussive strike
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(this.volume * 0.35, t + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + duration);

      // Wood knock transient
      const knock = this.ctx.createOscillator();
      const knockGain = this.ctx.createGain();
      knock.type = 'triangle';
      knock.frequency.setValueAtTime(freq * 3.5, t);
      knockGain.gain.setValueAtTime(this.volume * 0.15, t);
      knockGain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

      knock.connect(knockGain);
      knockGain.connect(this.ctx.destination);
      knock.start(t);
      knock.stop(t + 0.04);
    });
  }

  // 4. Digital Klokke (Classic Wristwatch Beep-Beep)
  playDigitalWatch() {
    const freq = 2048; // Classic quartz watch crystal frequency
    const now = this.ctx.currentTime;

    const pulses = [0, 0.12, 0.32, 0.44]; // Beep-beep ... beep-beep

    pulses.forEach(offset => {
      const t = now + offset;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(this.volume * 0.20, t);
      gain.gain.setValueAtTime(this.volume * 0.20, t + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.08);
    });
  }

  // 5. Magisk Harpe (Twinkling Fairy Cascade)
  playHarp() {
    const notes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51];
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const t = now + idx * 0.07;
      const duration = 1.2;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(this.volume * 0.22, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + duration);
    });
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SoundEngine;
}
