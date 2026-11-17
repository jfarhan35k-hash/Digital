// ============================================================
//  audio.js  -  Rich synthesized audio engine
//  Replaces the single-oscillator beep system
// ============================================================

const Audio7 = (function() {
  let ctx = null;
  let masterGain = null;
  let reverbNode = null;
  let bgmNodes = null;
  let bgmPlaying = false;

  function init() {
    if (ctx) return ctx;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.7;
      masterGain.connect(ctx.destination);
      // Simple reverb bus via feedback delay
      const delay = ctx.createDelay(0.5);
      delay.delayTime.value = 0.08;
      const fb = ctx.createGain();
      fb.gain.value = 0.25;
      const revGain = ctx.createGain();
      revGain.gain.value = 0.18;
      delay.connect(fb); fb.connect(delay);
      delay.connect(revGain); revGain.connect(masterGain);
      reverbNode = delay;
    } catch(e) { console.warn("Audio init failed", e); }
    return ctx;
  }

  function resume() {
    if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {});
  }

  // Core voice: oscillator + ADSR envelope + optional filter sweep
  function voice(opts) {
    if (!ctx) return;
    const {
      freq = 440, type = "sine", detune = 0,
      attack = 0.005, decay = 0.1, sustain = 0.3, release = 0.15,
      peak = 0.3, dur = 0.2,
      filterFreq = null, filterQ = 1, filterSweep = null,
      sendReverb = 0.15
    } = opts;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.detune.value = detune;
    let last = gain;
    if (filterFreq) {
      const filt = ctx.createBiquadFilter();
      filt.type = "lowpass";
      filt.frequency.value = filterFreq;
      filt.Q.value = filterQ;
      if (filterSweep) {
        filt.frequency.linearRampToValueAtTime(filterSweep, now + dur);
      }
      osc.connect(filt); filt.connect(gain);
    } else {
      osc.connect(gain);
    }
    // ADSR envelope
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(peak, now + attack);
    gain.gain.linearRampToValueAtTime(peak * sustain, now + attack + decay);
    gain.gain.linearRampToValueAtTime(0, now + dur + release);
    gain.connect(masterGain);
    if (sendReverb > 0 && reverbNode) {
      const send = ctx.createGain();
      send.gain.value = sendReverb;
      gain.connect(send); send.connect(reverbNode);
    }
    osc.start(now);
    osc.stop(now + dur + release + 0.1);
  }

  // ----- PRESET SOUNDS -----

  function hover() {
    voice({ freq: 880, type: "sine", peak: 0.08, dur: 0.05, filterFreq: 2000, sendReverb: 0.05 });
  }

  function pickup() {
    voice({ freq: 523, type: "triangle", peak: 0.2, dur: 0.08, attack: 0.002, filterFreq: 3000, sendReverb: 0.1 });
    voice({ freq: 784, type: "sine", peak: 0.12, dur: 0.1, attack: 0.01, filterFreq: 4000, sendReverb: 0.1 });
  }

  // Correct drop: happy C major chord stab
  function dropCorrect() {
    const base = 523;  // C5
    [1, 1.26, 1.5].forEach((ratio, i) => {
      voice({
        freq: base * ratio, type: "triangle",
        peak: 0.22 - i * 0.04, dur: 0.18,
        attack: 0.003, decay: 0.05, sustain: 0.5, release: 0.2,
        filterFreq: 3500, filterSweep: 1800, sendReverb: 0.25
      });
    });
  }

  // Wrong drop: minor dissonance
  function dropWrong() {
    voice({ freq: 196, type: "sawtooth", peak: 0.25, dur: 0.2, attack: 0.005, filterFreq: 800, filterSweep: 300, sendReverb: 0.1 });
    voice({ freq: 207, type: "sawtooth", peak: 0.18, dur: 0.22, attack: 0.005, filterFreq: 800, filterSweep: 300, sendReverb: 0.1 });
  }

  // Submit button: triumphant chord
  function submitGood() {
    const base = 392;  // G4
    [1, 1.26, 1.5, 2].forEach((ratio, i) => {
      setTimeout(() => {
        voice({
          freq: base * ratio, type: "triangle",
          peak: 0.28 - i * 0.03, dur: 0.4,
          attack: 0.005, decay: 0.1, sustain: 0.6, release: 0.3,
          filterFreq: 4000, sendReverb: 0.3
        });
      }, i * 50);
    });
  }

  // Submit timeout: dramatic descending
  function submitBad() {
    [523, 392, 294, 196].forEach((f, i) => {
      setTimeout(() => {
        voice({ freq: f, type: "sawtooth", peak: 0.22, dur: 0.25, filterFreq: 1500, filterSweep: 500, sendReverb: 0.2 });
      }, i * 120);
    });
  }

  // Timer tick (final 10 seconds)
  function tick() {
    voice({ freq: 1200, type: "square", peak: 0.08, dur: 0.04, attack: 0.001, decay: 0.02, release: 0.02, filterFreq: 2000, sendReverb: 0.08 });
  }

  // Combo streak notification
  function combo(level) {
    const base = 523 * Math.pow(1.122, Math.min(level, 8));
    [1, 1.5, 2].forEach((ratio, i) => {
      setTimeout(() => {
        voice({
          freq: base * ratio, type: "triangle",
          peak: 0.2, dur: 0.15,
          attack: 0.003, filterFreq: 4000, sendReverb: 0.35
        });
      }, i * 40);
    });
  }

  // Achievement unlock: magical ascending arpeggio
  function achievement() {
    [392, 523, 659, 784, 1046].forEach((f, i) => {
      setTimeout(() => {
        voice({
          freq: f, type: "triangle",
          peak: 0.22, dur: 0.18,
          attack: 0.003, decay: 0.08, sustain: 0.5, release: 0.25,
          filterFreq: 4500, sendReverb: 0.4
        });
      }, i * 70);
    });
  }

  // Ambient BGM drone - subtle pad
  function startBGM() {
    if (bgmPlaying || !ctx) return;
    bgmPlaying = true;
    const bgmGain = ctx.createGain();
    bgmGain.gain.value = 0;
    bgmGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 3);
    bgmGain.connect(masterGain);
    const freqs = [55, 82.4, 110, 164.8];  // A1, E2, A2, E3
    const oscs = freqs.map((f, i) => {
      const o = ctx.createOscillator();
      o.type = i === 0 ? "sine" : "triangle";
      o.frequency.value = f;
      o.detune.value = (Math.random() - 0.5) * 8;
      const g = ctx.createGain();
      g.gain.value = 0.3 / freqs.length;
      // Slow LFO on gain for breathing
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.08 + i * 0.03;
      lfoGain.gain.value = 0.1 / freqs.length;
      lfo.connect(lfoGain); lfoGain.connect(g.gain);
      lfo.start();
      o.connect(g); g.connect(bgmGain);
      o.start();
      return { o, lfo };
    });
    bgmNodes = { gain: bgmGain, voices: oscs };
  }

  function stopBGM() {
    if (!bgmPlaying || !bgmNodes) return;
    const now = ctx.currentTime;
    bgmNodes.gain.gain.linearRampToValueAtTime(0, now + 1.5);
    setTimeout(() => {
      bgmNodes.voices.forEach(v => { try { v.o.stop(); v.lfo.stop(); } catch(e){} });
      bgmNodes = null;
      bgmPlaying = false;
    }, 1600);
  }

  function setMasterVolume(v) {
    if (masterGain) masterGain.gain.value = Math.max(0, Math.min(1, v));
  }

  return {
    init, resume,
    hover, pickup,
    dropCorrect, dropWrong,
    submitGood, submitBad,
    tick, combo, achievement,
    startBGM, stopBGM,
    setMasterVolume
  };
})();
