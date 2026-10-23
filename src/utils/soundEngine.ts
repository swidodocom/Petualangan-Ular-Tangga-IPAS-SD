/**
 * Procedural Web Audio API sound and music engine for IPAS Snakes & Ladders game.
 * Uses zero external assets, plays reliably on any browser without 404s.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicVolume: number = 0.35;
  private sfxVolume: number = 0.6;
  private isMusicPlaying: boolean = false;
  private musicTimer: number | null = null;
  private musicGainNode: GainNode | null = null;
  private sfxGainNode: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.musicGainNode = this.ctx.createGain();
      this.musicGainNode.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
      this.musicGainNode.connect(this.ctx.destination);

      this.sfxGainNode = this.ctx.createGain();
      this.sfxGainNode.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
      this.sfxGainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.musicGainNode && this.ctx) {
      this.musicGainNode.gain.setValueAtTime(muted ? 0 : this.musicVolume, this.ctx.currentTime);
    }
    if (this.sfxGainNode && this.ctx) {
      this.sfxGainNode.gain.setValueAtTime(muted ? 0 : this.sfxVolume, this.ctx.currentTime);
    }
  }

  public setMasterVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol * 0.4));
    this.sfxVolume = Math.max(0, Math.min(1, vol * 0.8));
    if (this.musicGainNode && this.ctx && !this.isMuted) {
      this.musicGainNode.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    }
    if (this.sfxGainNode && this.ctx && !this.isMuted) {
      this.sfxGainNode.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
    }
  }

  public startMusic() {
    this.initContext();
    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;
    this.playMusicLoop();
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicTimer !== null) {
      window.clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  private playMusicLoop() {
    if (!this.isMusicPlaying || !this.ctx || !this.musicGainNode) return;

    // Cheerful, upbeat educational motif in C Major (C4, E4, G4, A4, C5, D5)
    // Plays a 16-step lively loop with light marimba chime timbre and gentle bass
    const tempo = 124;
    const stepDuration = 60 / tempo / 2; // 16th note
    const now = this.ctx.currentTime;

    const melodyNotes = [
      523.25, 0, 659.25, 523.25, 783.99, 0, 659.25, 0,
      880.00, 783.99, 659.25, 587.33, 523.25, 659.25, 783.99, 0,
      523.25, 659.25, 783.99, 880.00, 783.99, 0, 659.25, 587.33,
      523.25, 0, 587.33, 659.25, 523.25, 0, 0, 0
    ];

    const bassNotes = [
      130.81, 0, 130.81, 0, 174.61, 0, 174.61, 0,
      196.00, 0, 196.00, 0, 130.81, 0, 196.00, 0,
      130.81, 0, 130.81, 0, 174.61, 0, 174.61, 0,
      196.00, 0, 196.00, 0, 130.81, 0, 130.81, 0
    ];

    const totalSteps = melodyNotes.length;

    for (let i = 0; i < totalSteps; i++) {
      const time = now + i * stepDuration;

      // Melody marimba note
      const mFreq = melodyNotes[i];
      if (mFreq > 0 && !this.isMuted) {
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(mFreq, time);

        noteGain.gain.setValueAtTime(0.001, time);
        noteGain.gain.exponentialRampToValueAtTime(0.08, time + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.001, time + stepDuration * 0.9);

        osc.connect(noteGain);
        noteGain.connect(this.musicGainNode);

        osc.start(time);
        osc.stop(time + stepDuration);
      }

      // Bass note
      const bFreq = bassNotes[i];
      if (bFreq > 0 && !this.isMuted) {
        const bOsc = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();
        bOsc.type = 'sine';
        bOsc.frequency.setValueAtTime(bFreq, time);

        bGain.gain.setValueAtTime(0.001, time);
        bGain.gain.exponentialRampToValueAtTime(0.12, time + 0.03);
        bGain.gain.exponentialRampToValueAtTime(0.001, time + stepDuration * 1.5);

        bOsc.connect(bGain);
        bGain.connect(this.musicGainNode);

        bOsc.start(time);
        bOsc.stop(time + stepDuration * 1.6);
      }
    }

    const totalLoopMs = totalSteps * stepDuration * 1000;
    this.musicTimer = window.setTimeout(() => {
      this.playMusicLoop();
    }, totalLoopMs - 50);
  }

  // --- Sound Effects ---

  public playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  public playDiceRoll() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    // Series of rattling clicks simulating dice tumbling on wood
    const now = this.ctx.currentTime;
    for (let i = 0; i < 7; i++) {
      const clickTime = now + i * 0.08 + Math.random() * 0.03;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150 + Math.random() * 200, clickTime);

      gain.gain.setValueAtTime(0.2, clickTime);
      gain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.04);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      osc.start(clickTime);
      osc.stop(clickTime + 0.05);
    }
  }

  public playPawnStep() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  public playLadderClimb() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    // Upward joyful arpeggio
    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGainNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = now + idx * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.exponentialRampToValueAtTime(0.25, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      osc.start(time);
      osc.stop(time + 0.22);
    });
  }

  public playSnakeSlide() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    // Downward descending slide
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.55);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.55);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    osc.start(now);
    osc.stop(now + 0.56);
  }

  public playCorrect() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    // Brilliant C major chord fanfare (C5, E5, G5, C6)
    const now = this.ctx.currentTime;
    const chord = [523.25, 659.25, 783.99, 1046.50];
    chord.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGainNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = now + idx * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.exponentialRampToValueAtTime(0.3, time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      osc.start(time);
      osc.stop(time + 0.45);
    });
  }

  public playIncorrect() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    // Gentle low buzz
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.setValueAtTime(130, now + 0.15);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    osc.start(now);
    osc.stop(now + 0.36);
  }

  public playVictory() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    // Grand victory fanfare: G4 -> C5 -> E5 -> G5 -> C6!
    const notes = [
      { f: 392.00, d: 0.15 },
      { f: 523.25, d: 0.15 },
      { f: 659.25, d: 0.15 },
      { f: 783.99, d: 0.25 },
      { f: 1046.50, d: 0.6 }
    ];

    let t = this.ctx.currentTime;
    notes.forEach(note => {
      if (!this.ctx || !this.sfxGainNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(0.35, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      osc.start(t);
      osc.stop(t + note.d + 0.05);

      t += note.d * 0.9;
    });
  }
}

export const sound = new SoundEngine();
