// ============================================================
//  achievements.js  -  Progression hooks
// ============================================================

const ACHIEVEMENTS = [
  { id:"first_mission",  icon:"🎓", title:"First Mission",      desc:"Complete your first mission" },
  { id:"perfect_score",  icon:"💎", title:"Perfect Score",      desc:"Score 95 or higher" },
  { id:"speed_demon",    icon:"⚡", title:"Speed Demon",         desc:"Submit with 3+ minutes left and score 70+" },
  { id:"combo_master",   icon:"🔥", title:"Combo Master",        desc:"Achieve a streak of 5 or more" },
  { id:"minimalist",     icon:"🎯", title:"Minimalist",          desc:"Score 75+ using 3 or fewer tools" },
  { id:"explorer",       icon:"🧭", title:"Explorer",            desc:"Try every scenario at least once" },
  { id:"veteran",        icon:"🎖️", title:"Veteran",             desc:"Complete 10 missions" },
  { id:"legendary",      icon:"🏆", title:"Legendary",           desc:"Earn all other achievements" }
];

const Achievements = (function() {
  const KEY = "dad_achievements";
  const PLAY_KEY = "dad_play_stats";

  function getEarned() {
    try { return new Set(JSON.parse(localStorage.getItem(KEY) || "[]")); }
    catch { return new Set(); }
  }
  function saveEarned(set) {
    localStorage.setItem(KEY, JSON.stringify([...set]));
  }
  function getStats() {
    try { return JSON.parse(localStorage.getItem(PLAY_KEY) || "{}"); }
    catch { return {}; }
  }
  function saveStats(s) { localStorage.setItem(PLAY_KEY, JSON.stringify(s)); }

  function unlock(id) {
    const earned = getEarned();
    if (earned.has(id)) return false;
    const ach = ACHIEVEMENTS.find(a => a.id === id);
    if (!ach) return false;
    earned.add(id);
    saveEarned(earned);
    showToast(ach);
    // Check for legendary meta-achievement
    const required = ACHIEVEMENTS.filter(a => a.id !== "legendary").map(a => a.id);
    if (!earned.has("legendary") && required.every(r => earned.has(r))) {
      setTimeout(() => unlock("legendary"), 1500);
    }
    return true;
  }

  function showToast(ach) {
    const toast = document.createElement("div");
    toast.className = "achievement-toast";
    toast.innerHTML =
      '<div class="ach-icon">' + ach.icon + '</div>' +
      '<div class="ach-body"><div class="ach-title">ACHIEVEMENT UNLOCKED</div>' +
      '<div class="ach-name">' + ach.title + '</div>' +
      '<div class="ach-desc">' + ach.desc + '</div></div>';
    document.body.appendChild(toast);
    if (window.gsap) {
      gsap.fromTo(toast,
        { x: 400, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
      gsap.to(toast, {
        x: 400, opacity: 0, duration: 0.5, delay: 4,
        ease: "power2.in",
        onComplete: () => toast.remove()
      });
    } else {
      setTimeout(() => toast.remove(), 5000);
    }
    if (window.Audio7) Audio7.achievement();
    if (window.FX) FX.flashGold();
    if (window.confetti) confetti({
      particleCount: 80, spread: 100, startVelocity: 45,
      origin: { y: 0.3, x: 0.9 },
      colors: ["#ffd700", "#00f0ff", "#ff6a00"]
    });
  }

  // ----- CHECK CONDITIONS AFTER MISSION -----
  function checkAll(result, ctx) {
    // ctx: { scenario, droppedTools, maxStreak, elapsed, timedOut }
    const stats = getStats();
    stats.plays = (stats.plays || 0) + 1;
    stats.scenariosPlayed = stats.scenariosPlayed || [];
    if (ctx.scenario && !stats.scenariosPlayed.includes(ctx.scenario.id)) {
      stats.scenariosPlayed.push(ctx.scenario.id);
    }
    saveStats(stats);

    // first_mission - always on first play
    if (stats.plays >= 1) unlock("first_mission");

    // perfect_score - score 95+
    if (result.total >= 95) unlock("perfect_score");

    // speed_demon - 3+ min left and score 70+
    const timeLeft = (GAME_SETTINGS.timerSeconds - ctx.elapsed);
    if (!ctx.timedOut && timeLeft >= 180 && result.total >= 70) unlock("speed_demon");

    // combo_master - streak of 5+
    if (ctx.maxStreak >= 5) unlock("combo_master");

    // minimalist - score 75+ with 3 or fewer tools
    if (result.total >= 75 && ctx.droppedTools.length <= 3 && ctx.droppedTools.length > 0) {
      unlock("minimalist");
    }

    // explorer - played every scenario
    if (window.SCENARIOS && stats.scenariosPlayed.length >= SCENARIOS.length) {
      unlock("explorer");
    }

    // veteran - 10 plays
    if (stats.plays >= 10) unlock("veteran");
  }

  function renderTrophyCase(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const earned = getEarned();
    el.innerHTML = "";
    ACHIEVEMENTS.forEach(ach => {
      const slot = document.createElement("div");
      const isEarned = earned.has(ach.id);
      slot.className = "trophy-slot" + (isEarned ? " earned" : " locked");
      slot.title = isEarned ? (ach.title + " - " + ach.desc) : ("Locked: " + ach.desc);
      slot.innerHTML =
        '<div class="trophy-icon">' + (isEarned ? ach.icon : "🔒") + '</div>' +
        '<div class="trophy-name">' + ach.title + '</div>';
      el.appendChild(slot);
    });
  }

  return { unlock, checkAll, renderTrophyCase, getEarned };
})();
