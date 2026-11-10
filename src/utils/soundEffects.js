/**
 * Web Audio API Sound Synthesizer for GESTURE AI
 * Creates pleasant futuristic UI sound effects locally without external assets
 */

class SoundManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.lastSoundTime = 0;

    // Check localStorage for saved mute state
    try {
      const saved = localStorage.getItem('gesture_ai_sound_muted');
      if (saved !== null) {
        this.isMuted = JSON.parse(saved);
      }
    } catch (e) {
      // Ignore
    }
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  setMuted(muted) {
    this.isMuted = Boolean(muted);
    try {
      localStorage.setItem('gesture_ai_sound_muted', JSON.stringify(this.isMuted));
    } catch (e) {}
  }

  toggleMute() {
    this.setMuted(!this.isMuted);
    if (!this.isMuted) {
      this.playClick();
    }
    return this.isMuted;
  }

  /**
   * Subtle harmonic chime when a new gesture is recognized
   */
  playGestureConfirmed(gestureType) {
    if (this.isMuted) return;
    const now = Date.now();
    if (now - this.lastSoundTime < 400) return; // Debounce rapid triggers
    this.lastSoundTime = now;

    this.init();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;

      // Select frequency pair based on gesture
      let f1 = 523.25; // C5
      let f2 = 659.25; // E5
      if (gestureType === 'THUMBS_UP') {
        f1 = 587.33; // D5
        f2 = 880.00; // A5
      } else if (gestureType === 'VICTORY') {
        f1 = 659.25; // E5
        f2 = 1046.50; // C6
      } else if (gestureType === 'OPEN_HAND') {
        f1 = 440.00; // A4
        f2 = 659.25; // E5
      } else if (gestureType === 'FIST') {
        f1 = 392.00; // G4
        f2 = 523.25; // C5
      }

      // Oscillator 1 (Primary Sine)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(f1, t);
      gain1.gain.setValueAtTime(0, t);
      gain1.gain.linearRampToValueAtTime(0.08, t + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(t);
      osc1.stop(t + 0.3);

      // Oscillator 2 (Harmonic)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(f2, t + 0.04);
      gain2.gain.setValueAtTime(0, t);
      gain2.gain.setValueAtTime(0, t + 0.04);
      gain2.gain.linearRampToValueAtTime(0.06, t + 0.06);
      gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(t + 0.04);
      osc2.stop(t + 0.36);
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  /**
   * Subtle UI click sound
   */
  playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.exponentialRampToValueAtTime(200, t + 0.04);
      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.05);
    } catch (e) {}
  }

  /**
   * Camera switch or toggle chime
   */
  playCameraChime(isStarting = true) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      if (isStarting) {
        osc.frequency.setValueAtTime(440, t);
        osc.frequency.exponentialRampToValueAtTime(880, t + 0.12);
      } else {
        osc.frequency.setValueAtTime(880, t);
        osc.frequency.exponentialRampToValueAtTime(440, t + 0.12);
      }
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.16);
    } catch (e) {}
  }
}

export const soundManager = new SoundManager();
