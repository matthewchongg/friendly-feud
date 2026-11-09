/**
 * Family Feud Sound Effects Synthesizer & Audio Engine
 * Features official Philippine Family Feud soundboard:
 * - Theme Song (Jeremiah Tiangco - Ano'ng Sabe)
 * - Correct Ding
 * - Wrong Buzzer (1X, 2X repeated, 3X repeated)
 * - Face-Off Sting
 * - Round Win Fanfare
 * Plus Web Audio API synthesizer fallbacks.
 */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.hasInteracted = false;
    this.soundTheme = 'philippines'; // 'philippines' | 'classic'
    this.themeAudio = null;
    this.isThemePlaying = false;
    this.onThemeStateChange = null;

    // Relative audio paths
    this.audioFiles = {
      ding: 'audio/ph_correct_ding_clean.wav',
      strike: 'audio/ph_wrong_buzzer_clean.wav',
      faceoff: 'audio/ph_faceoff_clean.wav',
      fanfare: 'audio/ph_roundwin_clean.wav',
      theme: 'audio/ph_theme_anongsabe.mp3'
    };

    // Pre-cache Audio instances for low latency
    this.preloaded = {};
    this.preloadSounds();
  }

  preloadSounds() {
    try {
      Object.keys(this.audioFiles).forEach(key => {
        if (key !== 'theme') {
          const a = new Audio();
          a.preload = 'auto';
          a.src = this.audioFiles[key];
          this.preloaded[key] = a;
        }
      });
    } catch (e) {
      console.warn('Audio preloading not permitted in this context', e);
    }
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.hasInteracted = true;
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted && this.isThemePlaying) {
      this.stopTheme();
    }
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  setTheme(themeName) {
    if (themeName === 'classic' || themeName === 'philippines') {
      this.soundTheme = themeName;
    }
    return this.soundTheme;
  }

  getTheme() {
    return this.soundTheme;
  }

  /**
   * Helper to play an audio file with instant overlap capability
   */
  playAudioFile(key, volume = 1.0) {
    if (this.muted) return null;
    this.init();
    try {
      const src = this.audioFiles[key];
      if (!src) return null;
      const audio = new Audio(src);
      audio.volume = Math.max(0, Math.min(1, volume));
      const p = audio.play();
      if (p !== undefined) {
        p.catch(err => {
          console.warn(`[SoundEngine] File playback for ${key} prevented, falling back to synth`, err);
          this._fallbackSynth(key);
        });
      }
      return audio;
    } catch (e) {
      this._fallbackSynth(key);
      return null;
    }
  }

  _fallbackSynth(key) {
    switch (key) {
      case 'ding': this._synthDing(); break;
      case 'strike': this._synthStrike(); break;
      case 'faceoff': this._synthBuzzerHit(); break;
      case 'fanfare': this._synthFanfare(); break;
    }
  }

  /**
   * Theme Song (Jeremiah Tiangco - Ano'ng Sabe)
   */
  playTheme() {
    if (this.muted) return;
    this.stopTheme();
    this.init();
    try {
      this.themeAudio = new Audio(this.audioFiles.theme);
      this.themeAudio.volume = 0.85;
      this.themeAudio.addEventListener('ended', () => {
        this.isThemePlaying = false;
        if (typeof this.onThemeStateChange === 'function') this.onThemeStateChange(false);
      });
      const p = this.themeAudio.play();
      this.isThemePlaying = true;
      if (typeof this.onThemeStateChange === 'function') this.onThemeStateChange(true);
      if (p !== undefined) {
        p.catch(err => {
          console.warn('Theme play error:', err);
          this.isThemePlaying = false;
          if (typeof this.onThemeStateChange === 'function') this.onThemeStateChange(false);
        });
      }
    } catch (e) {
      this.isThemePlaying = false;
      if (typeof this.onThemeStateChange === 'function') this.onThemeStateChange(false);
    }
  }

  stopTheme() {
    if (this.themeAudio) {
      try {
        this.themeAudio.pause();
        this.themeAudio.currentTime = 0;
      } catch (e) {}
      this.themeAudio = null;
    }
    this.isThemePlaying = false;
    if (typeof this.onThemeStateChange === 'function') this.onThemeStateChange(false);
  }

  toggleTheme() {
    if (this.isThemePlaying) {
      this.stopTheme();
      return false;
    } else {
      this.playTheme();
      return true;
    }
  }

  /**
   * Correct Ding
   */
  playDing() {
    if (this.muted) return;
    if (this.soundTheme === 'philippines') {
      this.playAudioFile('ding', 0.95);
    } else {
      this._synthDing();
    }
  }

  /**
   * Single Strike (X) - Wrong Buzzer
   */
  playStrike() {
    if (this.muted) return;
    if (this.soundTheme === 'philippines') {
      this.playAudioFile('strike', 0.95);
    } else {
      this._synthStrike();
    }
  }

  /**
   * Double Strike (XX) - Repeat Wrong Buzzer audio two times
   */
  playDoubleStrike() {
    if (this.muted) return;
    if (this.soundTheme === 'philippines') {
      this.playAudioFile('strike', 0.95);
      setTimeout(() => {
        if (!this.muted) this.playAudioFile('strike', 0.95);
      }, 420);
    } else {
      this._synthStrike();
      setTimeout(() => {
        if (!this.muted) this._synthStrike();
      }, 400);
    }
  }

  /**
   * Triple Strike (XXX) - Repeat Wrong Buzzer audio three times
   */
  playTripleStrike() {
    if (this.muted) return;
    if (this.soundTheme === 'philippines') {
      this.playAudioFile('strike', 0.95);
      setTimeout(() => {
        if (!this.muted) this.playAudioFile('strike', 0.95);
      }, 420);
      setTimeout(() => {
        if (!this.muted) this.playAudioFile('strike', 0.95);
      }, 840);
    } else {
      this._synthTripleStrike();
    }
  }

  /**
   * Face-Off Cue sound (face off)
   */
  playFaceOff() {
    if (this.muted) return;
    if (this.soundTheme === 'philippines') {
      this.playAudioFile('faceoff', 0.95);
    } else {
      this._synthBuzzerHit();
    }
  }

  /**
   * Buzzer hit (when contestant buzzes in)
   */
  playBuzzerHit() {
    if (this.muted) return;
    if (this.soundTheme === 'philippines') {
      this.playAudioFile('strike', 0.75);
    } else {
      this._synthBuzzerHit();
    }
  }

  /**
   * Round Win / Victory Fanfare
   */
  playFanfare() {
    if (this.muted) return;
    if (this.soundTheme === 'philippines') {
      this.playAudioFile('fanfare', 0.95);
    } else {
      this._synthFanfare();
    }
  }

  /**
   * Dramatic Gong for Steal phase
   */
  playStealGong() {
    if (this.muted) return;
    this._synthStealGong();
  }

  /**
   * Timer tick (subtle percussive woodblock)
   */
  playTick() {
    if (this.muted) return;
    this._synthTick();
  }

  /**
   * Timer expired siren
   */
  playTimeOut() {
    if (this.muted) return;
    this._synthTimeOut();
  }

  // =========================================================
  // SYNTHESIZER FALLBACKS (Web Audio API)
  // =========================================================

  _synthDing() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.08);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1318.5, now);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.2);
    osc2.stop(now + 1.2);
  }

  _synthStrike() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this._createBuzzPulse(now, 0.22);
    this._createBuzzPulse(now + 0.26, 0.35);
  }

  _synthTripleStrike() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this._createBuzzPulse(now, 0.2);
    this._createBuzzPulse(now + 0.24, 0.2);
    this._createBuzzPulse(now + 0.48, 0.55);
  }

  _createBuzzPulse(startTime, duration) {
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(115, startTime);

    osc2.type = 'square';
    osc2.frequency.setValueAtTime(120, startTime);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, startTime);
    filter.Q.setValueAtTime(3, startTime);

    gain.gain.setValueAtTime(0.45, startTime);
    gain.gain.linearRampToValueAtTime(0.45, startTime + duration - 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration);
    osc2.stop(startTime + duration);
  }

  _synthBuzzerHit() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.linearRampToValueAtTime(440, now + 0.3);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  _synthTick() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  _synthTimeOut() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(160, now + 0.7);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.75);
  }

  _synthStealGong() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 1.5);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 1.8);
  }

  _synthFanfare() {
    this.init();
    if (!this.ctx) return;
    const notes = [
      { f: 523.25, d: 0.12 },
      { f: 659.25, d: 0.12 },
      { f: 783.99, d: 0.12 },
      { f: 1046.50, d: 0.28 },
      { f: 880.00, d: 0.12 },
      { f: 1046.50, d: 0.6 }
    ];

    let t = this.ctx.currentTime + 0.05;
    notes.forEach(n => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, t);

      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + n.d);
      t += n.d + 0.02;
    });
  }
}

// Global singleton
window.soundEngine = new SoundEngine();
