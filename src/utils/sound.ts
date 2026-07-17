// Sound synthesizer using Web Audio API for Valorant-like sounds
// This avoids any copyright issues while providing high-quality, zero-latency spatial audio.

class SoundManager {
  private ctx: AudioContext | null = null;
  private masterVolume: number = 0.6;

  init() {
    if (this.ctx) {
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      return;
    }
    try {
      // @ts-ignore
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    } catch (e) {
      console.error("Web Audio API not supported", e);
    }
  }

  setVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  getVolume() {
    return this.masterVolume;
  }

  // Synthesizes a punchy gunshot sound based on chosen weapon
  playShoot(weapon: "vandal" | "phantom" | "sheriff" | "operator" = "vandal") {
    this.init();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Create a main output gain node for master volume control
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.masterVolume, now);
    masterGain.connect(ctx.destination);

    if (weapon === "phantom") {
      // Phantom: Quieter, suppressed, higher frequency sizzle
      const osc = ctx.createOscillator();
      const gainOsc = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);
      
      gainOsc.gain.setValueAtTime(0.25, now);
      gainOsc.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(350, now);

      osc.connect(gainOsc);
      gainOsc.connect(lp);
      lp.connect(masterGain);

      // Noise sizzle
      const bufferSize = ctx.sampleRate * 0.08;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.setValueAtTime(1400, now);
      bp.Q.setValueAtTime(3.0, now);

      const gainNoise = ctx.createGain();
      gainNoise.gain.setValueAtTime(0.25, now);
      gainNoise.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      noise.connect(bp);
      bp.connect(gainNoise);
      gainNoise.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.12);
      noise.start(now);
      noise.stop(now + 0.09);

    } else if (weapon === "sheriff") {
      // Sheriff: Loud metallic crack
      const osc = ctx.createOscillator();
      const gainOsc = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.18);
      
      gainOsc.gain.setValueAtTime(0.45, now);
      gainOsc.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

      osc.connect(gainOsc);
      gainOsc.connect(masterGain);

      // Cyber crack noise
      const bufferSize = ctx.sampleRate * 0.12;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const hp = ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.setValueAtTime(1500, now);

      const gainNoise = ctx.createGain();
      gainNoise.gain.setValueAtTime(0.4, now);
      gainNoise.gain.exponentialRampToValueAtTime(0.01, now + 0.11);

      noise.connect(hp);
      hp.connect(gainNoise);
      gainNoise.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.2);
      noise.start(now);
      noise.stop(now + 0.12);

    } else if (weapon === "operator") {
      // Operator: Huge low end boom, heavy rumble, slightly delayed ringing
      const osc = ctx.createOscillator();
      const gainOsc = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.4);
      
      gainOsc.gain.setValueAtTime(0.7, now);
      gainOsc.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(120, now);

      osc.connect(gainOsc);
      gainOsc.connect(lp);
      lp.connect(masterGain);

      // Massive splash noise
      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.setValueAtTime(600, now);
      bp.Q.setValueAtTime(1.2, now);

      const gainNoise = ctx.createGain();
      gainNoise.gain.setValueAtTime(0.6, now);
      gainNoise.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      noise.connect(bp);
      bp.connect(gainNoise);
      gainNoise.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.45);
      noise.start(now);
      noise.stop(now + 0.3);

    } else {
      // Default / Vandal: Solid punchy, medium-bass pop
      const osc = ctx.createOscillator();
      const gainOsc = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.14);
      
      gainOsc.gain.setValueAtTime(0.35, now);
      gainOsc.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
      
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(200, now);

      osc.connect(gainOsc);
      gainOsc.connect(lp);
      lp.connect(masterGain);

      // Sizzling rattle noise
      const bufferSize = ctx.sampleRate * 0.1;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.setValueAtTime(1000, now);
      bp.Q.setValueAtTime(2.5, now);

      const gainNoise = ctx.createGain();
      gainNoise.gain.setValueAtTime(0.4, now);
      gainNoise.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

      noise.connect(bp);
      bp.connect(gainNoise);
      gainNoise.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.15);
      noise.start(now);
      noise.stop(now + 0.11);
    }
  }

  // Synthesizes a spatial warning/traveling sound for a flashbang
  playSpawn(type: string, panValue: number = 0) {
    this.init();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.masterVolume, now);
    masterGain.connect(ctx.destination);

    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    const destination = panner ? panner : masterGain;
    
    if (panner) {
      panner.pan.setValueAtTime(Math.max(-1, Math.min(1, panValue)), now);
      panner.connect(masterGain);
    }

    if (type === "phoenix") {
      // Curveball: Sizzling/crackling fire sound with rapid sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.8);

      // Sizzle modulation
      const mod = ctx.createOscillator();
      const modGain = ctx.createGain();
      mod.type = "sawtooth";
      mod.frequency.setValueAtTime(50, now);
      modGain.gain.setValueAtTime(90, now);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

      mod.connect(modGain);
      modGain.connect(osc.frequency);
      osc.connect(gain);
      gain.connect(destination);

      mod.start(now);
      mod.stop(now + 0.8);
      osc.start(now);
      osc.stop(now + 0.8);
    } else if (type === "kayo") {
      // FLASH/drive: Robot/digital sweep beeps
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(1200, now + 1.2);

      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.setValueAtTime(500, now);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(destination);

      osc.start(now);
      osc.stop(now + 1.2);
    } else if (type === "reyna") {
      // Reyna: Dark, ethereal, spooky eye whisper
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 1.5);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(250, now);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(destination);

      osc.start(now);
      osc.stop(now + 1.5);
    } else {
      // Breach/others: Earth-rumbling charge up
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(70, now);
      osc.frequency.linearRampToValueAtTime(260, now + 1.0);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(180, now);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.0);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(destination);

      osc.start(now);
      osc.stop(now + 1.0);
    }
  }

  // Synthesizes a loud explosion pop for the flashbang
  playPop(panValue: number = 0) {
    this.init();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.masterVolume, now);
    masterGain.connect(ctx.destination);

    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    const destination = panner ? panner : masterGain;
    
    if (panner) {
      panner.pan.setValueAtTime(Math.max(-1, Math.min(1, panValue)), now);
      panner.connect(masterGain);
    }

    // 1. Deep sub blast
    const boom = ctx.createOscillator();
    const gainBoom = ctx.createGain();
    boom.type = "triangle";
    boom.frequency.setValueAtTime(160, now);
    boom.frequency.exponentialRampToValueAtTime(40, now + 0.45);
    
    gainBoom.gain.setValueAtTime(0.9, now);
    gainBoom.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

    boom.connect(gainBoom);
    gainBoom.connect(destination);

    // 2. High-frequency explosive splash (Noise burst)
    const bufferSize = ctx.sampleRate * 0.35;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(1400, now);
    bp.Q.setValueAtTime(1.8, now);

    const gainNoise = ctx.createGain();
    gainNoise.gain.setValueAtTime(0.7, now);
    gainNoise.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

    noise.connect(bp);
    bp.connect(gainNoise);
    gainNoise.connect(destination);

    boom.start(now);
    boom.stop(now + 0.5);
    noise.start(now);
    noise.stop(now + 0.32);
  }

  // Synthesizes a high-pitched tinnitus ring when blinded
  playBlind() {
    this.init();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.masterVolume, now);
    masterGain.connect(ctx.destination);

    // Tinnitus Ringing
    const ring = ctx.createOscillator();
    const gainRing = ctx.createGain();
    ring.type = "sine";
    ring.frequency.setValueAtTime(3200, now);
    
    // Safety check - make it atmospheric rather than painful
    gainRing.gain.setValueAtTime(0.12, now);
    gainRing.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

    ring.connect(gainRing);
    gainRing.connect(masterGain);

    // Disorienting low-frequency hum
    const hum = ctx.createOscillator();
    const gainHum = ctx.createGain();
    hum.type = "sine";
    hum.frequency.setValueAtTime(55, now);
    
    gainHum.gain.setValueAtTime(0.3, now);
    gainHum.gain.exponentialRampToValueAtTime(0.01, now + 1.4);

    hum.connect(gainHum);
    gainHum.connect(masterGain);

    ring.start(now);
    ring.stop(now + 1.9);
    hum.start(now);
    hum.stop(now + 1.5);
  }

  // Satisfying audio confirmation of a successful dodge
  playDodge() {
    this.init();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.masterVolume, now);
    masterGain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(580, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.19);
  }

  // Double high pitch beep when achieving high streaks
  playStreakBonus() {
    this.init();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.masterVolume, now);
    masterGain.connect(ctx.destination);

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "sine";
    osc2.type = "sine";

    osc1.frequency.setValueAtTime(880, now);
    osc1.frequency.setValueAtTime(1320, now + 0.08);

    osc2.frequency.setValueAtTime(1100, now);
    osc2.frequency.setValueAtTime(1760, now + 0.08);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.22);
    osc2.stop(now + 0.22);
  }

  // A very crisp, high-pitch metallic "ding" sound on hitting a target
  playHit() {
    this.init();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.masterVolume * 0.9, now);
    masterGain.connect(ctx.destination);

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "sine";
    osc2.type = "sine";

    // 1950Hz + 2450Hz gives that perfect satisfying bullet-hitting-metal-plate "clink"
    osc1.frequency.setValueAtTime(1950, now);
    osc2.frequency.setValueAtTime(2450, now);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.08);
    osc2.stop(now + 0.08);
  }
}

export const soundManager = new SoundManager();
