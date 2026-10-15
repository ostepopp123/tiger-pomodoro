/**
 * Pixel Art Companion Engine
 * Supports 5 adorable pixel-art companion skins:
 * 1. 🐯 Tiger (Tora)
 * 2. 🦛 Flodhest / Hippo (Pippo)
 * 3. 🐷 Gris / Pig (Nøff)
 * 4. 🐹 Marsvin / Guinea Pig (Pip)
 * 5. 🥑 Avokado / Avocado (Avo)
 * 
 * 100% self-contained pixel matrix & procedural animations. No external image assets needed.
 */

class PixelTiger {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    // Grid size (32x32 virtual pixels)
    this.gridSize = 32;
    this.scale = Math.floor(canvas.width / this.gridSize);

    // Current Skin: 'tiger', 'hippo', 'pig', 'guineapig', 'avocado'
    this.skin = 'tiger';
    try {
      const savedSkin = localStorage.getItem('tiger_companion_skin');
      if (savedSkin) this.skin = savedSkin;
    } catch (e) {}

    // Current State: 'focus', 'paused', 'shortBreak', 'longBreak', 'timesUp'
    this.state = 'focus';
    this.isRunning = false;

    // Equipped Accessory (Hat): 'none', 'crown', 'wizard', 'sunglasses', 'flowers', 'bow'
    this.equippedHat = 'none';
    try {
      const savedHat = localStorage.getItem('tiger_equipped_hat');
      if (savedHat) this.equippedHat = savedHat;
    } catch (e) {}

    // Animation Timers & Counters
    this.frame = 0;
    this.blinkTimer = 0;
    this.isBlinking = false;
    this.headBobOffset = 0;
    this.tailFrame = 0;
    this.interactivePetTimer = 0;

    // Floating particles (music notes, steam, zzz, confetti)
    this.particles = [];
    this.lastParticleTime = 0;

    // Color palettes for all 5 characters
    this.palettes = {
      // 1. TIGER
      tiger: {
        primary: '#FFA35C',
        shade: '#E68038',
        light: '#FFBA82',
        belly: '#FFF5E8',
        bellyShade: '#EED9C4',
        stripe: '#3A302E',
        nose: '#FF758F',
        blush: '#FFAAA6',
        pupil: '#241B19',
        white: '#FFFFFF',
        earInner: '#FFB8B8'
      },
      // 2. FLODHEST (HIPPO)
      hippo: {
        primary: '#9AAEC4',       // Soft pastel lavender-blue / slate
        shade: '#8094AA',
        light: '#B4C6DC',
        belly: '#E6EEF8',         // Creamy baby blue belly
        bellyShade: '#D0DEEE',
        snout: '#BDCCE0',         // Big chubby snout
        nostrils: '#576A80',
        teeth: '#FFFFFF',
        nose: '#647A94',
        blush: '#FFAEC0',
        pupil: '#222B36',
        white: '#FFFFFF',
        earInner: '#FFCAD4'
      },
      // 3. GRIS (PIG)
      pig: {
        primary: '#FFB3C1',       // Sweet baby pastel pink
        shade: '#E898A7',
        light: '#FFCCD6',
        belly: '#FFE5EC',         // Soft lighter pink tummy
        bellyShade: '#F7CBD4',
        snout: '#FF8DA1',         // Rosy snout
        nostrils: '#D65D74',
        nose: '#FF758F',
        blush: '#FF6384',
        pupil: '#2A1C20',
        white: '#FFFFFF',
        earInner: '#FF8DA1'
      },
      // 4. MARSVIN (GUINEA PIG)
      guineapig: {
        primary: '#C68B59',       // Toffee caramel fur
        shade: '#AA6E3D',
        light: '#D89E6E',
        patchWhite: '#FFF9F0',    // White blaze / chest patch
        patchDark: '#855831',     // Dark chocolate patch
        belly: '#FFF9F0',
        bellyShade: '#E8DEC8',
        nose: '#FF8E9E',
        blush: '#FFB0B0',
        pupil: '#231815',
        white: '#FFFFFF',
        earInner: '#E8B49B'
      },
      // 5. AVOKADO (AVOCADO)
      avocado: {
        peel: '#2D6A4F',          // Deep forest avocado skin
        peelShade: '#1B4332',
        primary: '#95D5B2',       // Creamy pastel lime flesh
        shade: '#74C69D',
        light: '#D8F3DC',
        pit: '#8B5A2B',           // Warm brown seed tummy
        pitShade: '#6F4518',
        pitLight: '#A47148',
        stem: '#583101',          // Cute leaf stem on top
        leaf: '#52B788',
        blush: '#FF9EA8',
        pupil: '#1B4332',
        white: '#FFFFFF'
      }
    };

    // Shared accessories & effects
    this.accessories = {
      headband: '#7C5CBF',
      headphoneCup: '#A29BFE',
      headphoneAccent: '#55EFC4',
      mugBase: '#74B9FF',
      mugCocoa: '#8D6E63',
      partyPink: '#FF7675',
      starYellow: '#FEEAA7',
      partyMint: '#55EFC4',
      partyBlue: '#74B9FF'
    };

    this.canvas.addEventListener('click', () => this.petTiger());
    this.startLoop();
  }

  setSkin(newSkin) {
    if (this.palettes[newSkin]) {
      this.skin = newSkin;
      try {
        localStorage.setItem('tiger_companion_skin', newSkin);
      } catch (e) {}
      this.petTiger();
    }
  }

  getSkin() {
    return this.skin;
  }

  setHat(newHat) {
    this.equippedHat = newHat;
    try {
      localStorage.setItem('tiger_equipped_hat', newHat);
    } catch (e) {}
    this.petTiger();
  }

  petTiger() {
    this.interactivePetTimer = 45;
    this.spawnConfetti(8);
    if (typeof this.onPet === 'function') {
      this.onPet();
    }
  }

  setState(newState, isRunning = true) {
    if (this.state !== newState || this.isRunning !== isRunning) {
      this.state = newState;
      this.isRunning = isRunning;
      this.particles = [];
      if (newState === 'timesUp') {
        this.spawnConfetti(35);
      }
    }
  }

  startLoop() {
    const loop = (timestamp) => {
      this.update(timestamp);
      this.render();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  update(timestamp) {
    this.frame++;

    // Blinking logic
    this.blinkTimer++;
    if (this.blinkTimer > 200 + Math.sin(this.frame * 0.05) * 50) {
      this.isBlinking = true;
      if (this.blinkTimer > 212) {
        this.isBlinking = false;
        this.blinkTimer = 0;
      }
    }

    // Head bob rhythm
    if (this.state === 'focus' && this.isRunning) {
      this.headBobOffset = Math.sin(this.frame * 0.12) > 0.6 ? 1 : 0;
    } else if (this.state === 'timesUp') {
      this.headBobOffset = Math.sin(this.frame * 0.25) > 0 ? -1 : 1;
    } else {
      this.headBobOffset = Math.sin(this.frame * 0.04) > 0.8 ? 1 : 0;
    }

    this.tailFrame = Math.floor((this.frame % 60) / 30);

    if (this.interactivePetTimer > 0) {
      this.interactivePetTimer--;
    }

    // Spawn ambient particles
    if (timestamp - this.lastParticleTime > 450) {
      this.lastParticleTime = timestamp;
      if (this.state === 'focus' && this.isRunning) {
        this.particles.push({
          type: 'note',
          x: Math.random() > 0.5 ? 4 : 26,
          y: 8,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -0.4 - Math.random() * 0.2,
          char: Math.random() > 0.5 ? '♪' : '♫',
          color: Math.random() > 0.5 ? '#FD79A8' : '#FDCB6E',
          alpha: 1,
          life: 60
        });
      } else if (this.state === 'shortBreak' && this.isRunning) {
        this.particles.push({
          type: 'steam',
          x: 16 + (Math.random() - 0.5) * 3,
          y: 19,
          vx: Math.sin(this.frame * 0.1) * 0.2,
          vy: -0.3,
          alpha: 0.8,
          life: 45
        });
      } else if (this.state === 'longBreak') {
        this.particles.push({
          type: 'zzz',
          x: 23,
          y: 9,
          vx: 0.2,
          vy: -0.3,
          text: 'z',
          scale: 1,
          alpha: 1,
          life: 55
        });
      } else if (this.state === 'paused') {
        if (this.particles.length === 0) {
          this.particles.push({
            type: 'question',
            x: 25,
            y: 8,
            vy: -0.1,
            alpha: 1,
            life: 80
          });
        }
      }
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life--;
      p.x += (p.vx || 0);
      p.y += (p.vy || 0);
      p.alpha = Math.max(0, p.life / 60);
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  spawnConfetti(count) {
    const colors = [
      this.accessories.partyPink,
      this.accessories.starYellow,
      this.accessories.partyMint,
      this.accessories.partyBlue,
      '#FFA35C'
    ];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        type: 'confetti',
        x: 16 + (Math.random() - 0.5) * 8,
        y: 12 + (Math.random() - 0.5) * 6,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -1.2 - Math.random() * 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 50 + Math.floor(Math.random() * 40)
      });
    }
  }

  drawPixel(x, y, color) {
    if (!color) return;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(Math.floor(x * this.scale), Math.floor(y * this.scale), this.scale, this.scale);
  }

  drawRect(x, y, w, h, color) {
    if (!color) return;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(Math.floor(x * this.scale), Math.floor(y * this.scale), Math.floor(w * this.scale), Math.floor(h * this.scale));
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const bob = this.headBobOffset;
    const isPaused = (this.state === 'paused');
    const isTimesUp = (this.state === 'timesUp');
    const isBreak = (this.state === 'shortBreak' || this.state === 'longBreak');
    const isFocus = (this.state === 'focus');
    const isPet = (this.interactivePetTimer > 0);

    // Route rendering based on chosen skin
    switch (this.skin) {
      case 'hippo':
        this.renderHippo(bob, isBreak, isTimesUp, isPet);
        break;
      case 'pig':
        this.renderPig(bob, isBreak, isTimesUp, isPet);
        break;
      case 'guineapig':
        this.renderGuineaPig(bob, isBreak, isTimesUp, isPet);
        break;
      case 'avocado':
        this.renderAvocado(bob, isBreak, isTimesUp, isPet);
        break;
      case 'tiger':
      default:
        this.renderTiger(bob, isBreak, isTimesUp, isPet);
        break;
    }

    // Accessories & micro-state overlays
    const headY = (this.skin === 'avocado' ? 5 : 6) + bob;
    if (isFocus) {
      this.drawHeadphones(headY);
    } else if (isBreak && !isTimesUp) {
      this.drawCozyMug();
    }

    // Celebratory raised paws / hands
    if (isTimesUp) {
      this.drawCelebrationPaws(headY);
    }

    // Draw Equipped Hat / Accessory
    if (this.equippedHat && this.equippedHat !== 'none') {
      this.drawEquippedHat(headY);
    }

    // Particle effects
    this.drawParticles();
  }

  /* -------------------------------------------------------------------------- */
  /* 1. TIGER RENDERER                                                          */
  /* -------------------------------------------------------------------------- */
  renderTiger(bob, isBreak, isTimesUp, isPet) {
    const c = this.palettes.tiger;

    // Tail
    const tailOffset = this.tailFrame === 0 ? 0 : 1;
    this.drawRect(24 + tailOffset, 21, 3, 2, c.primary);
    this.drawRect(26 + tailOffset, 22, 3, 2, c.stripe);
    this.drawRect(27 + tailOffset, 23, 2, 2, c.primary);
    this.drawRect(28, 21 - tailOffset, 2, 3, c.stripe);
    this.drawRect(28, 19 - tailOffset, 2, 2, c.belly);

    // Back Paws
    this.drawRect(6, 26, 4, 3, c.primary);
    this.drawRect(6, 28, 4, 1, c.shade);
    this.drawRect(22, 26, 4, 3, c.primary);
    this.drawRect(22, 28, 4, 1, c.shade);

    // Body
    this.drawRect(9, 18, 14, 9, c.primary);
    this.drawRect(8, 20, 16, 7, c.primary);
    this.drawRect(9, 27, 14, 1, c.shade);
    this.drawRect(8, 21, 2, 2, c.stripe);
    this.drawRect(22, 21, 2, 2, c.stripe);

    // Belly
    this.drawRect(12, 19, 8, 8, c.belly);
    this.drawRect(13, 18, 6, 1, c.belly);
    this.drawRect(13, 27, 6, 1, c.bellyShade);

    // Ears
    const earY = 2 + bob;
    this.drawRect(6, earY + 1, 5, 5, c.primary);
    this.drawRect(7, earY, 3, 2, c.stripe);
    this.drawRect(8, earY + 2, 2, 3, c.belly);
    this.drawPixel(8, earY + 3, c.earInner);

    this.drawRect(21, earY + 1, 5, 5, c.primary);
    this.drawRect(22, earY, 3, 2, c.stripe);
    this.drawRect(22, earY + 2, 2, 3, c.belly);
    this.drawPixel(23, earY + 3, c.earInner);

    // Head
    const headY = 6 + bob;
    this.drawRect(8, headY, 16, 12, c.primary);
    this.drawRect(7, headY + 2, 18, 9, c.primary);
    this.drawRect(6, headY + 4, 20, 6, c.primary);
    this.drawRect(5, headY + 6, 22, 4, c.primary);
    this.drawRect(10, headY, 12, 1, c.light);
    this.drawRect(8, headY + 12, 16, 1, c.shade);

    // Forehead Crest & Stripes
    this.drawRect(15, headY + 1, 2, 4, c.stripe);
    this.drawRect(13, headY + 2, 6, 1, c.stripe);
    this.drawRect(11, headY + 3, 2, 1, c.stripe);
    this.drawRect(19, headY + 3, 2, 1, c.stripe);

    // Cheek Stripes
    this.drawRect(5, headY + 6, 3, 1, c.stripe);
    this.drawRect(6, headY + 8, 3, 1, c.stripe);
    this.drawRect(24, headY + 6, 3, 1, c.stripe);
    this.drawRect(23, headY + 8, 3, 1, c.stripe);

    // Muzzle & Cheeks
    this.drawRect(11, headY + 7, 10, 5, c.belly);
    this.drawRect(10, headY + 8, 12, 4, c.belly);
    this.drawRect(12, headY + 12, 8, 1, c.belly);

    // Nose & Mouth
    this.drawRect(15, headY + 8, 2, 2, c.nose);
    this.drawPixel(14, headY + 10, c.stripe);
    this.drawPixel(17, headY + 10, c.stripe);

    // Blush
    this.drawRect(8, headY + 9, 3, 2, c.blush);
    this.drawRect(21, headY + 9, 3, 2, c.blush);

    // Eyes
    this.drawFaceEyes(headY, 10, 19, c, isBreak, isTimesUp, isPet);

    // Front Paws
    if (!isBreak && !isTimesUp) {
      this.drawRect(10, 23, 3, 4, c.belly);
      this.drawPixel(10, 25, c.blush);
      this.drawPixel(12, 25, c.blush);

      this.drawRect(19, 23, 3, 4, c.belly);
      this.drawPixel(19, 25, c.blush);
      this.drawPixel(21, 25, c.blush);
    }
  }

  /* -------------------------------------------------------------------------- */
  /* 2. FLODHEST (HIPPO) RENDERER                                               */
  /* -------------------------------------------------------------------------- */
  renderHippo(bob, isBreak, isTimesUp, isPet) {
    const c = this.palettes.hippo;

    // Tiny Tail
    this.drawRect(24, 22, 2, 2, c.primary);
    this.drawPixel(25, 21, c.shade);

    // Back Feet
    this.drawRect(5, 26, 5, 3, c.primary);
    this.drawRect(22, 26, 5, 3, c.primary);
    this.drawPixel(6, 28, c.nostrils);
    this.drawPixel(8, 28, c.nostrils);
    this.drawPixel(23, 28, c.nostrils);
    this.drawPixel(25, 28, c.nostrils);

    // Round Hippo Body
    this.drawRect(8, 18, 16, 9, c.primary);
    this.drawRect(7, 20, 18, 7, c.primary);
    this.drawRect(8, 27, 16, 1, c.shade);

    // Light Blue Belly
    this.drawRect(11, 19, 10, 8, c.belly);
    this.drawRect(12, 18, 8, 1, c.belly);
    this.drawRect(12, 27, 8, 1, c.bellyShade);

    // Cute Round Hippo Ears
    const earY = 2 + bob;
    this.drawRect(6, earY + 1, 4, 4, c.primary);
    this.drawRect(7, earY + 2, 2, 2, c.earInner);

    this.drawRect(22, earY + 1, 4, 4, c.primary);
    this.drawRect(23, earY + 2, 2, 2, c.earInner);

    // Head Base
    const headY = 6 + bob;
    this.drawRect(8, headY, 16, 11, c.primary);
    this.drawRect(7, headY + 2, 18, 9, c.primary);
    this.drawRect(6, headY + 4, 20, 6, c.primary);

    // Big Chubby Hippo Muzzle/Snout
    this.drawRect(9, headY + 6, 14, 7, c.snout);
    this.drawRect(8, headY + 7, 16, 5, c.snout);
    this.drawRect(10, headY + 13, 12, 1, c.shade);

    // Nostrils
    this.drawRect(13, headY + 8, 2, 2, c.nostrils);
    this.drawRect(17, headY + 8, 2, 2, c.nostrils);

    // Tiny Cute Teeth peeking out under snout!
    this.drawPixel(11, headY + 13, c.teeth);
    this.drawPixel(20, headY + 13, c.teeth);

    // Rosy Blush
    this.drawRect(7, headY + 9, 3, 2, c.blush);
    this.drawRect(22, headY + 9, 3, 2, c.blush);

    // Hippo Eyes
    this.drawFaceEyes(headY, 9, 20, c, isBreak, isTimesUp, isPet);

    // Front Paws
    if (!isBreak && !isTimesUp) {
      this.drawRect(9, 23, 4, 4, c.primary);
      this.drawPixel(10, 26, c.nostrils);
      this.drawPixel(12, 26, c.nostrils);

      this.drawRect(19, 23, 4, 4, c.primary);
      this.drawPixel(20, 26, c.nostrils);
      this.drawPixel(22, 26, c.nostrils);
    }
  }

  /* -------------------------------------------------------------------------- */
  /* 3. GRIS (PIG) RENDERER                                                     */
  /* -------------------------------------------------------------------------- */
  renderPig(bob, isBreak, isTimesUp, isPet) {
    const c = this.palettes.pig;

    // Curly Tail (spring ~)
    const tailOffset = this.tailFrame === 0 ? 0 : 1;
    this.drawRect(24 + tailOffset, 21, 2, 2, c.primary);
    this.drawPixel(26 + tailOffset, 20, c.snout);
    this.drawPixel(26 + tailOffset, 22, c.primary);
    this.drawPixel(25 + tailOffset, 23, c.shade);

    // Back Feet
    this.drawRect(6, 26, 4, 3, c.primary);
    this.drawRect(22, 26, 4, 3, c.primary);
    this.drawRect(7, 28, 2, 1, c.snout);
    this.drawRect(23, 28, 2, 1, c.snout);

    // Round Pink Body
    this.drawRect(8, 18, 16, 9, c.primary);
    this.drawRect(7, 20, 18, 7, c.primary);
    this.drawRect(8, 27, 16, 1, c.shade);

    // Softer Pink Belly
    this.drawRect(11, 19, 10, 8, c.belly);
    this.drawRect(12, 18, 8, 1, c.belly);
    this.drawRect(12, 27, 8, 1, c.bellyShade);

    // Floppy Pig Ears (One perked, one folded)
    const earY = 2 + bob;
    // Left ear (perked triangle)
    this.drawRect(6, earY + 1, 4, 5, c.primary);
    this.drawRect(7, earY + 2, 2, 3, c.earInner);

    // Right ear (cute folded tip!)
    this.drawRect(22, earY + 2, 4, 4, c.primary);
    this.drawRect(21, earY + 1, 3, 2, c.earInner);
    this.drawPixel(23, earY + 3, c.shade);

    // Head Base
    const headY = 6 + bob;
    this.drawRect(8, headY, 16, 12, c.primary);
    this.drawRect(7, headY + 2, 18, 9, c.primary);
    this.drawRect(6, headY + 4, 20, 6, c.primary);
    this.drawRect(10, headY, 12, 1, c.light);
    this.drawRect(8, headY + 12, 16, 1, c.shade);

    // Piggy Oval Snout
    this.drawRect(11, headY + 7, 10, 5, c.snout);
    this.drawRect(12, headY + 6, 8, 1, c.snout);
    this.drawRect(12, headY + 12, 8, 1, c.snout);
    // Nostrils
    this.drawRect(13, headY + 8, 2, 2, c.nostrils);
    this.drawRect(17, headY + 8, 2, 2, c.nostrils);

    // Rosy Blush
    this.drawRect(7, headY + 8, 3, 2, c.blush);
    this.drawRect(22, headY + 8, 3, 2, c.blush);

    // Piggy Eyes
    this.drawFaceEyes(headY, 9, 20, c, isBreak, isTimesUp, isPet);

    // Front Trotters
    if (!isBreak && !isTimesUp) {
      this.drawRect(10, 23, 3, 4, c.primary);
      this.drawRect(10, 26, 3, 1, c.snout);

      this.drawRect(19, 23, 3, 4, c.primary);
      this.drawRect(19, 26, 3, 1, c.snout);
    }
  }

  /* -------------------------------------------------------------------------- */
  /* 4. MARSVIN (GUINEA PIG) RENDERER                                           */
  /* -------------------------------------------------------------------------- */
  renderGuineaPig(bob, isBreak, isTimesUp, isPet) {
    const c = this.palettes.guineapig;

    // Potato Body (Two-tone Calico patch)
    this.drawRect(7, 18, 18, 9, c.primary);
    this.drawRect(6, 20, 20, 7, c.primary);
    // White chest / belly blaze
    this.drawRect(13, 18, 7, 10, c.patchWhite);
    // Dark brown right hip patch
    this.drawRect(21, 20, 5, 7, c.patchDark);

    // Back paws
    this.drawRect(5, 26, 4, 3, c.primary);
    this.drawRect(23, 26, 4, 3, c.patchDark);

    // Cute Tiny Round Ears
    const earY = 4 + bob;
    this.drawRect(5, earY, 3, 4, c.primary);
    this.drawPixel(6, earY + 1, c.earInner);

    this.drawRect(24, earY, 3, 4, c.patchDark);
    this.drawPixel(25, earY + 1, c.earInner);

    // Chubby Pear Head
    const headY = 6 + bob;
    this.drawRect(8, headY, 16, 12, c.primary);
    this.drawRect(6, headY + 3, 20, 8, c.primary);
    this.drawRect(5, headY + 6, 22, 5, c.primary); // very chubby cheeks

    // Asymmetric Calico Head Patches
    this.drawRect(19, headY + 2, 7, 9, c.patchDark);
    // White blaze down center of forehead to nose
    this.drawRect(14, headY + 1, 4, 11, c.patchWhite);

    // Muzzle & Y-shaped pink nose :3
    this.drawRect(14, headY + 9, 4, 2, c.nose);
    this.drawPixel(15, headY + 11, c.nose);
    this.drawPixel(16, headY + 11, c.nose);

    // Soft Cheeks Blush
    this.drawRect(7, headY + 9, 3, 2, c.blush);
    this.drawRect(22, headY + 9, 3, 2, c.blush);

    // Big Guinea Pig Eyes
    this.drawFaceEyes(headY, 9, 20, c, isBreak, isTimesUp, isPet);

    // Front Paws (Holding a tiny dandelion leaf!)
    if (!isBreak && !isTimesUp) {
      this.drawRect(10, 23, 3, 4, c.patchWhite);
      this.drawRect(19, 23, 3, 4, c.patchWhite);
      // Tiny green snack leaf between paws!
      this.drawRect(14, 23, 4, 2, '#52B788');
      this.drawPixel(13, 24, '#74C69D');
    }
  }

  /* -------------------------------------------------------------------------- */
  /* 5. AVOKADO (AVOCADO) RENDERER                                              */
  /* -------------------------------------------------------------------------- */
  renderAvocado(bob, isBreak, isTimesUp, isPet) {
    const c = this.palettes.avocado;

    // Perky Stem & Green Leaf on Top!
    const stemY = 1 + bob;
    this.drawRect(15, stemY + 1, 2, 3, c.stem);
    this.drawRect(17, stemY, 4, 2, c.leaf);
    this.drawRect(18, stemY + 2, 3, 1, c.leaf);

    // Outer Dark Green Peel (Pear / Egg shape)
    const bodyY = 5 + bob;
    this.drawRect(10, bodyY, 12, 4, c.peel);
    this.drawRect(8, bodyY + 4, 16, 7, c.peel);
    this.drawRect(6, bodyY + 11, 20, 11, c.peel);
    this.drawRect(8, bodyY + 22, 16, 2, c.peelShade);

    // Creamy Lime Green Flesh
    this.drawRect(11, bodyY + 1, 10, 4, c.primary);
    this.drawRect(9, bodyY + 5, 14, 7, c.primary);
    this.drawRect(7, bodyY + 12, 18, 9, c.primary);
    this.drawRect(9, bodyY + 21, 14, 1, c.shade);

    // Inner Cream Glow
    this.drawRect(12, bodyY + 3, 8, 4, c.light);
    this.drawRect(10, bodyY + 7, 12, 6, c.light);

    // Big Round Brown Pit (Tummy Seed)
    const pitY = bodyY + 11;
    this.drawRect(11, pitY + 1, 10, 7, c.pit);
    this.drawRect(12, pitY, 8, 9, c.pit);
    this.drawRect(13, pitY + 1, 2, 2, c.pitLight); // shine reflection on seed
    this.drawRect(12, pitY + 8, 8, 1, c.pitShade);

    // Cute Avocado Face (Eyes on the top flesh above the pit)
    this.drawFaceEyes(bodyY + 1, 10, 19, c, isBreak, isTimesUp, isPet);

    // Cute cat mouth :3 above the pit
    this.drawPixel(15, bodyY + 9, c.pupil);
    this.drawPixel(16, bodyY + 9, c.pupil);

    // Rosy Blush
    this.drawRect(8, bodyY + 8, 3, 2, c.blush);
    this.drawRect(21, bodyY + 8, 3, 2, c.blush);

    // Tiny Avocado Stubby Feet
    this.drawRect(10, 27, 3, 3, c.peel);
    this.drawRect(19, 27, 3, 3, c.peel);

    // Stubby Arms
    if (!isBreak && !isTimesUp) {
      this.drawRect(8, bodyY + 13, 2, 3, c.shade);
      this.drawRect(22, bodyY + 13, 2, 3, c.shade);
    }
  }

  /* -------------------------------------------------------------------------- */
  /* EYE RENDERER FOR ALL CHARACTERS                                            */
  /* -------------------------------------------------------------------------- */
  drawFaceEyes(headY, leftX, rightX, colors, isBreak, isTimesUp, isPet) {
    const eyeY = headY + 5;

    if (this.isBlinking && !isTimesUp) {
      this.drawRect(leftX, eyeY + 1, 3, 1, colors.pupil);
      this.drawRect(rightX, eyeY + 1, 3, 1, colors.pupil);
      return;
    }

    if (isBreak || isTimesUp || isPet) {
      // Joyful ^_^
      this.drawPixel(leftX, eyeY + 1, colors.pupil);
      this.drawPixel(leftX + 1, eyeY, colors.pupil);
      this.drawPixel(leftX + 2, eyeY + 1, colors.pupil);

      this.drawPixel(rightX, eyeY + 1, colors.pupil);
      this.drawPixel(rightX + 1, eyeY, colors.pupil);
      this.drawPixel(rightX + 2, eyeY + 1, colors.pupil);
      return;
    }

    if (this.state === 'paused') {
      this.drawRect(leftX, eyeY, 3, 3, colors.pupil);
      this.drawPixel(leftX, eyeY, colors.white);

      this.drawRect(rightX, eyeY - 1, 3, 3, colors.pupil);
      this.drawPixel(rightX, eyeY - 1, colors.white);
      return;
    }

    // Default Big Shiny Anime Eyes
    this.drawRect(leftX, eyeY, 3, 3, colors.pupil);
    this.drawPixel(leftX, eyeY, colors.white);

    this.drawRect(rightX, eyeY, 3, 3, colors.pupil);
    this.drawPixel(rightX, eyeY, colors.white);
  }

  /* -------------------------------------------------------------------------- */
  /* ACCESSORIES & OVERLAYS                                                     */
  /* -------------------------------------------------------------------------- */
  drawHeadphones(headY) {
    const a = this.accessories;
    this.drawRect(8, headY - 2, 16, 2, a.headband);
    this.drawPixel(7, headY - 1, a.headband);
    this.drawPixel(24, headY - 1, a.headband);

    this.drawRect(4, headY + 2, 3, 6, a.headphoneCup);
    this.drawRect(5, headY + 3, 2, 4, a.headphoneAccent);

    this.drawRect(25, headY + 2, 3, 6, a.headphoneCup);
    this.drawRect(25, headY + 3, 2, 4, a.headphoneAccent);
  }

  drawCelebrationPaws(headY) {
    const color = (this.skin === 'avocado' ? '#95D5B2' : (this.skin === 'hippo' ? '#9AAEC4' : (this.skin === 'pig' ? '#FFB3C1' : '#FFF5E8')));
    this.drawRect(4, headY + 2, 3, 3, color);
    this.drawPixel(5, headY + 3, '#FF758F');

    this.drawRect(25, headY + 2, 3, 3, color);
    this.drawPixel(26, headY + 3, '#FF758F');
  }

  drawCozyMug() {
    const a = this.accessories;
    const mugX = 13;
    const mugY = 22;

    this.drawRect(mugX, mugY, 6, 5, a.mugBase);
    this.drawRect(mugX + 1, mugY, 4, 1, a.mugCocoa);
    this.drawRect(mugX + 6, mugY + 1, 1, 3, a.mugBase);

    // Heart on mug
    this.drawPixel(mugX + 2, mugY + 2, '#FFFFFF');
    this.drawPixel(mugX + 4, mugY + 2, '#FFFFFF');
    this.drawPixel(mugX + 3, mugY + 3, '#FFFFFF');
  }

  drawParticles() {
    for (const p of this.particles) {
      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;

      if (p.type === 'note') {
        this.ctx.fillStyle = p.color;
        this.ctx.font = `${Math.floor(this.scale * 2.2)}px sans-serif`;
        this.ctx.fillText(p.char, Math.floor(p.x * this.scale), Math.floor(p.y * this.scale));
      } else if (p.type === 'steam') {
        this.drawRect(p.x, p.y, 2, 2, 'rgba(255, 255, 255, 0.8)');
      } else if (p.type === 'zzz') {
        this.ctx.fillStyle = '#A29BFE';
        this.ctx.font = `bold ${Math.floor(this.scale * 2.0)}px monospace`;
        this.ctx.fillText('z', Math.floor(p.x * this.scale), Math.floor(p.y * this.scale));
      } else if (p.type === 'question') {
        this.ctx.fillStyle = '#FFA502';
        this.ctx.font = `bold ${Math.floor(this.scale * 2.2)}px monospace`;
        this.ctx.fillText('?', Math.floor(p.x * this.scale), Math.floor(p.y * this.scale));
      } else if (p.type === 'confetti') {
        this.drawRect(p.x, p.y, 2, 2, p.color);
      }

      this.ctx.restore();
    }
  }

  setHat(hatId) {
    this.equippedHat = hatId || 'none';
    this.petTiger();
  }

  getHat() {
    return this.equippedHat;
  }

  drawEquippedHat(headY) {
    switch (this.equippedHat) {
      case 'crown':
        // Golden Crown 👑
        this.drawRect(10, headY - 2, 12, 2, '#F1C40F');
        this.drawRect(10, headY - 5, 2, 3, '#F1C40F');
        this.drawRect(15, headY - 6, 2, 4, '#F1C40F');
        this.drawRect(20, headY - 5, 2, 3, '#F1C40F');
        // Gems
        this.drawPixel(11, headY - 1, '#2ECC71'); // emerald
        this.drawPixel(15, headY - 1, '#E74C3C'); // ruby
        this.drawPixel(16, headY - 1, '#E74C3C');
        this.drawPixel(20, headY - 1, '#3498DB'); // sapphire
        break;

      case 'wizard':
        // Starry Wizard Hat 🧙‍♂️
        this.drawRect(7, headY - 1, 18, 2, '#2C3E50'); // Brim
        this.drawRect(10, headY - 3, 12, 2, '#34495E');
        this.drawRect(12, headY - 5, 8, 2, '#34495E');
        this.drawRect(13, headY - 7, 5, 2, '#2C3E50');
        this.drawRect(15, headY - 9, 3, 2, '#34495E');
        this.drawPixel(18, headY - 10, '#F1C40F'); // Glowing star tip!
        this.drawPixel(17, headY - 9, '#F1C40F');
        // Ribbon band
        this.drawRect(10, headY - 2, 12, 1, '#E67E22');
        break;

      case 'sunglasses':
        // Retro Pixel Sunglasses 🕶️
        this.drawRect(8, headY + 5, 6, 4, '#1E272E');
        this.drawRect(18, headY + 5, 6, 4, '#1E272E');
        this.drawRect(14, headY + 5, 4, 1, '#1E272E'); // Bridge
        // Reflection shine
        this.drawPixel(9, headY + 6, '#FFFFFF');
        this.drawPixel(10, headY + 7, '#FFFFFF');
        this.drawPixel(19, headY + 6, '#FFFFFF');
        this.drawPixel(20, headY + 7, '#FFFFFF');
        break;

      case 'flowers':
        // Flower Crown 🌸
        // Green vine
        this.drawRect(8, headY - 1, 16, 1, '#2ECC71');
        // Flowers
        this.drawRect(9, headY - 2, 2, 2, '#FF80AB'); // Pink
        this.drawRect(13, headY - 3, 2, 2, '#FFE57F'); // Yellow
        this.drawRect(17, headY - 3, 2, 2, '#FFFFFF'); // White
        this.drawRect(21, headY - 2, 2, 2, '#A29BFE'); // Lilac
        break;

      case 'bow':
        // Red Ribbon Bow 🎀 (Tucked beside left ear)
        this.drawRect(6, headY - 1, 4, 3, '#FF3838');
        this.drawPixel(5, headY - 2, '#FF3838');
        this.drawPixel(5, headY, '#FF3838');
        this.drawPixel(7, headY, '#FFEAA7'); // Gold knot
        break;
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PixelTiger;
}
