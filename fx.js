// ============================================================
//  fx.js  -  Visual effects / game juice
// ============================================================

const FX = (function() {

  // ---------- SCREEN SHAKE ----------
  function shake(intensity) {
    intensity = intensity || "medium";
    const map = {
      light:  { amp: 4,  dur: 0.25 },
      medium: { amp: 8,  dur: 0.4  },
      heavy:  { amp: 14, dur: 0.6  }
    };
    const cfg = map[intensity] || map.medium;
    const app = document.getElementById("app");
    if (!app || !window.gsap) return;
    const tl = gsap.timeline();
    const steps = Math.floor(cfg.dur * 30);
    for (let i = 0; i < steps; i++) {
      const decay = 1 - (i / steps);
      tl.to(app, {
        x: (Math.random() - 0.5) * cfg.amp * decay,
         y: (Math.random() - 0.5) * cfg.amp * decay,
        duration: cfg.dur / steps,
        ease: "none"
      });
    }
    tl.to(app, { x: 0, y: 0, duration: 0.1 });
  }

  // ---------- FLASH OVERLAY ----------
  let flashEl = null;
  function ensureFlash() {
    if (flashEl) return flashEl;
    flashEl = document.createElement("div");
    flashEl.className = "fx-flash";
    document.body.appendChild(flashEl);
    return flashEl;
  }

  function flash(color, intensity) {
    intensity = intensity || 0.4;
    const el = ensureFlash();
    el.style.background = color;
    if (!window.gsap) return;
    gsap.killTweensOf(el);
    gsap.set(el, { opacity: intensity });
    gsap.to(el, { opacity: 0, duration: 0.5, ease: "power2.out" });
  }

  function flashGreen() { flash("rgba(0, 255, 136, 1)", 0.3); }
  function flashRed()   { flash("rgba(255, 51, 102, 1)", 0.4); }
  function flashGold()  { flash("rgba(255, 215, 0, 1)", 0.35); }
  function flashCyan()  { flash("rgba(0, 240, 255, 1)", 0.25); }

  // ---------- COMBINED REACTIONS ----------
  function reactCorrect() {
    flashGreen();
  }

  function reactWrong() {
    shake("medium");
    flashRed();
  }

  function reactTimeout() {
    shake("heavy");
    flashRed();
  }

  function reactAchievement() {
    flashGold();
  }

  function reactSubmit() {
    flashCyan();
  }

  // ---------- BUTTON PRESS ----------
  function pressBtn(el) {
    if (!el || !window.gsap) return;
    gsap.fromTo(el,
      { scale: 1 },
      { scale: 0.92, duration: 0.08, yoyo: true, repeat: 1, ease: "power2.inOut" }
    );
  }

  // ---------- SCREEN FADE TRANSITION ----------
  function fadeIn(el) {
    if (!el || !window.gsap) return;
    gsap.fromTo(el,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
  }

  // ---------- PULSE ELEMENT ----------
  function pulse(el, scale) {
    scale = scale || 1.1;
    if (!el || !window.gsap) return;
    gsap.fromTo(el,
      { scale: 1 },
      { scale: scale, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.inOut" }
    );
  }

  // ---------- AUTO-WIRE ALL BUTTONS ----------
  function wireButtons() {
    document.addEventListener("click", function(e) {
      const btn = e.target.closest("button, .flip-card");
      if (btn) pressBtn(btn);
    }, true);
  }


  // ---------- PARTICLE BURST AT POINT ----------
  function burstAt(x, y, opts) {
    opts = opts || {};
    if (!window.confetti) return;
    const colors = opts.colors || ["#00f0ff", "#7c3aed", "#ffd700"];
    const count = opts.count || 40;
    const spread = opts.spread || 60;
    const scalar = opts.scalar || 0.8;
    // canvas-confetti takes origin as % of viewport
    confetti({
      particleCount: count,
      spread: spread,
      startVelocity: 35,
      origin: { x: x / window.innerWidth, y: y / window.innerHeight },
      colors: colors,
      scalar: scalar,
      ticks: 60,
      gravity: 1.2,
      disableForReducedMotion: true
    });
  }

  function burstCorrect(x, y) {
    burstAt(x, y, {
      colors: ["#00ff88", "#00f0ff", "#ffd700"],
      count: 50, spread: 80, scalar: 0.9
    });
  }

  function burstKey(x, y) {
    // Bigger, more spectacular burst for key tools
    burstAt(x, y, {
      colors: ["#ffd700", "#00f0ff", "#7c3aed", "#ff3366"],
      count: 100, spread: 120, scalar: 1.2
    });
    setTimeout(() => burstAt(x, y, {
      colors: ["#ffd700", "#ffffff"], count: 40, spread: 160, scalar: 0.7
    }), 150);
  }

  function burstNeutral(x, y) {
    burstAt(x, y, {
      colors: ["#00f0ff", "#7c3aed"],
      count: 25, spread: 50, scalar: 0.7
    });
  }

  // ---------- FLOATING TEXT ----------
  function floatText(x, y, text, color) {
    color = color || "#00f0ff";
    const el = document.createElement("div");
    el.className = "fx-float-text";
    el.textContent = text;
    el.style.cssText = "position:fixed; left:" + x + "px; top:" + y + "px; " +
      "color:" + color + "; font-weight:900; font-size:1.3rem; " +
      "text-shadow:0 0 15px " + color + ", 0 2px 6px rgba(0,0,0,0.8); " +
      "pointer-events:none; z-index:99999; transform:translate(-50%,-50%); " +
      "letter-spacing:0.1em; text-transform:uppercase;";
    document.body.appendChild(el);
    if (window.gsap) {
      gsap.fromTo(el,
        { y: y, opacity: 0, scale: 0.5 },
        { y: y - 60, opacity: 1, scale: 1.2, duration: 0.35, ease: "back.out(2)" }
      );
      gsap.to(el, {
        y: y - 120, opacity: 0, scale: 0.9,
        duration: 0.6, delay: 0.5, ease: "power2.in",
        onComplete: () => el.remove()
      });
    } else {
      setTimeout(() => el.remove(), 1200);
    }
  }

  return {
    shake, flash, burstAt, burstCorrect, burstKey, burstNeutral, floatText,
    flashGreen, flashRed, flashGold, flashCyan,
    reactCorrect, reactWrong, reactTimeout, reactAchievement, reactSubmit,
    pressBtn, fadeIn, pulse, wireButtons
  };
})();
