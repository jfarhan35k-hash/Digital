// ============================================================
//  game.js  -  Digital Awareness Day  (clean build v2)
// ============================================================

const state = {
  playerName: "",
  playerDept: "",
  currentScenario: null,
  droppedTools: [],
  timeLeft: GAME_SETTINGS.timerSeconds,
  timerInterval: null,
  startTime: 0,
  soundOn: true,
  voiceOn: true
};

// ---------- PERSISTENT PROFILE ----------
function loadProfile() {
  try {
    const p = JSON.parse(localStorage.getItem("dad_profile") || "{}");
    if (p.name) state.playerName = p.name;
    if (p.dept) state.playerDept = p.dept;
  } catch {}
}
function saveProfile() {
  localStorage.setItem("dad_profile", JSON.stringify({
    name: state.playerName,
    dept: state.playerDept
  }));
}
function clearProfile() {
  localStorage.removeItem("dad_profile");
  state.playerName = "";
  state.playerDept = "";
}

// ---------- LEADERBOARD ----------
function getBoard() {
  try { return JSON.parse(localStorage.getItem("dad_board") || "[]"); } catch { return []; }
}
function saveBoard(b) {
  localStorage.setItem("dad_board", JSON.stringify(b.slice(0, 15)));
}
function addToBoard(entry) {
  const b = getBoard();
  b.push(entry);
  b.sort((a, b) => b.score - a.score);
  saveBoard(b);
}

// ---------- SFX (single reusable AudioContext) ----------
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch(e) { return null; }
  }
  // Browsers suspend context until a user gesture resumes it
  if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
  return audioCtx;
}
function playSFX(name) {
  if (!state.soundOn) return;
  Audio7.init();
  Audio7.resume();
  const map = {
    hover:       Audio7.hover,
    pickup:      Audio7.pickup,
    drop:        Audio7.dropCorrect,
    dropCorrect: Audio7.dropCorrect,
    dropWrong:   Audio7.dropWrong,
    submit:      Audio7.submitGood,
    error:       Audio7.submitBad,
    tick:        Audio7.tick,
    combo:       Audio7.combo,
    achievement: Audio7.achievement
  };
  const fn = map[name];
  if (fn) try { fn(); } catch(e) { console.warn("SFX error", name, e); }
}

// ---------- VOICE (manual-only; no auto-play) ----------
let cachedVoices = [];
function loadVoices() {
  if (!("speechSynthesis" in window)) return;
  cachedVoices = speechSynthesis.getVoices();
}
function pickBestVoice() {
  if (!cachedVoices.length) loadVoices();
  const priority = [/Aria.*Online/i,/Jenny.*Online/i,/Guy.*Online/i,/Natural/i,/Microsoft.*Zira/i,/Google.*US.*English/i,/Microsoft.*David/i];
  for (const pat of priority) {
    const v = cachedVoices.find(v => pat.test(v.name) && /en/i.test(v.lang));
    if (v) return v;
  }
  return cachedVoices.find(v => /en-US|en-GB/i.test(v.lang)) || cachedVoices[0] || null;
}
function speakBriefing(sc) {
  if (!state.voiceOn || !("speechSynthesis" in window)) return;
  stopVoice();
  const btn = document.getElementById("btnVoiceReplay");
  if (btn) btn.classList.add("playing");
  const text = sc.text + " Key pain points: " + sc.pains.join(". ") + ".";
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = 0.95; utt.pitch = 1.05; utt.volume = 0.9;
  const v = pickBestVoice();
  if (v) utt.voice = v;
  utt.onend = utt.onerror = () => { if (btn) btn.classList.remove("playing"); };
  speechSynthesis.speak(utt);
}
function stopVoice() {
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  const btn = document.getElementById("btnVoiceReplay");
  if (btn) btn.classList.remove("playing");
}
if ("speechSynthesis" in window) {
  loadVoices();
  speechSynthesis.onvoiceschanged = loadVoices;
}

// ---------- SCREEN SWITCHING ----------
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const el = document.getElementById(id);
  if (el) el.classList.add("active");
  document.body.classList.toggle("allow-scroll", id === "screen-dashboard");
  stopVoice();
  hideTooltip();
}

// ---------- AUDIO TOGGLES ----------
function initAudioToggles() {
  const btnMute  = document.getElementById("btnMute");
  const btnVoice = document.getElementById("btnVoice");
  btnMute.addEventListener("click", () => {
    state.soundOn = !state.soundOn;
    btnMute.textContent = state.soundOn ? "ðŸ”Š" : "ðŸ”‡";
    btnMute.classList.toggle("off", !state.soundOn);
  });
  btnVoice.addEventListener("click", () => {
    state.voiceOn = !state.voiceOn;
    btnVoice.textContent = state.voiceOn ? "ðŸ—£ï¸" : "ðŸ¤";
    btnVoice.classList.toggle("off", !state.voiceOn);
    if (!state.voiceOn) stopVoice();
  });
}

// ---------- SPLASH ----------
function initSplash() {
  setTimeout(() => {
    loadProfile();
    if (state.playerName && state.playerDept) {
      buildCards();
      showScreen("screen-cards");
    } else {
      showScreen("screen-welcome");
    }
  }, 2300);
}

// ---------- WELCOME ----------
function initWelcome() {
  const btn     = document.getElementById("btnStart");
  const inpName = document.getElementById("inpName");
  const inpDept = document.getElementById("inpDept");

  if (state.playerName) inpName.value = state.playerName;
  if (state.playerDept) inpDept.value = state.playerDept;

  const submit = () => {
    const name = inpName.value.trim();
    const dept = inpDept.value.trim();
    if (!name || !dept) {
      inpName.style.borderColor = name ? "" : "var(--red)";
      inpDept.style.borderColor = dept ? "" : "var(--red)";
      return;
    }
    state.playerName = name;
    state.playerDept = dept;
    saveProfile();
    playSFX("submit");
    buildCards();
    showScreen("screen-cards");
  };
  btn.addEventListener("click", submit);
  [inpName, inpDept].forEach(inp => {
    inp.addEventListener("keydown", e => { if (e.key === "Enter") submit(); });
    inp.addEventListener("input", () => { inp.style.borderColor = ""; });
  });
}

// ---------- FLIP CARDS ----------
function buildCards() {
  const container = document.getElementById("cardsContainer");
  container.innerHTML = "";
  const shuffled = [...SCENARIOS].sort(() => Math.random() - 0.5);
  shuffled.forEach(sc => {
    const card = document.createElement("div");
    card.className = "flip-card flipped";
    card.innerHTML =
      '<div class="flip-card-inner">' +
        '<div class="flip-card-front">?</div>' +
        '<div class="flip-card-back">' + sc.badge + '<br/><br/>' + sc.title + '</div>' +
      '</div>';
    card.addEventListener("click", () => {
      if (card.classList.contains("disabled")) return;
      document.querySelectorAll(".flip-card").forEach(c => {
        if (c !== card) c.classList.add("disabled");
      });
      card.classList.add("flipped");
      playSFX("pickup");
      playSFX("submit"); startScenario(sc);
    });
    container.appendChild(card);
  });
}

// ---------- SCENARIO BRIEFING ----------
function startScenario(sc) {
  state.currentScenario = sc;
  const titleEl = document.getElementById("scenarioTitle");
  titleEl.innerHTML = sc.title +
    '<button id="btnVoiceReplay" class="voice-replay-btn" title="Play narration">ðŸ”Š</button>';
  document.getElementById("scenarioBadge").textContent = sc.badge;
  document.getElementById("scenarioScene").innerHTML = SCENARIO_SCENES[sc.id] || "";
  const painList = document.getElementById("scenarioPains");
  painList.innerHTML = "";
  sc.pains.forEach(p => {
    const li = document.createElement("li");
    li.textContent = p;
    painList.appendChild(li);
  });
  const textEl = document.getElementById("scenarioText");
  textEl.innerHTML = "";
  typewrite(textEl, sc.text, 18);
  document.getElementById("btnVoiceReplay").addEventListener("click", () => speakBriefing(sc));
  document.getElementById("btnBeginMission").onclick = () => beginMission(sc);
  showScreen("screen-scenario");
  // Auto-play narration ~900ms after reveal (lets screen transition finish + keeps user-gesture context)
  setTimeout(() => {
    if (state.voiceOn && window.speechSynthesis) {
      speechSynthesis.cancel();
      setTimeout(() => speakBriefing(sc), 100);
    }
  }, 900);
}

function typewrite(el, text, speed) {
  let i = 0;
  const cursor = '<span class="typewriter-cursor"></span>';
  const tick = () => {
    if (i <= text.length) {
      el.innerHTML = text.substring(0, i) + cursor;
      i++;
      setTimeout(tick, speed);
    } else {
      el.innerHTML = text;
    }
  };
  tick();
}

// ---------- BEGIN MISSION ----------
function beginMission(sc) {
  stopVoice();
  state.droppedTools = [];
  state.startTime    = Date.now();
  state.timeLeft     = GAME_SETTINGS.timerSeconds;

  document.getElementById("hudName").textContent    = state.playerName;
  document.getElementById("hudDept").textContent    = state.playerDept;
  document.getElementById("hudMission").textContent = sc.badge;
  document.getElementById("hudRound").textContent   = "R1";

  buildToolbox();
  buildDropZone();
  updateTileCounter();
  startTimer();
  showScreen("screen-game");
  playSFX("submit");
}

// ---------- TOOLBOX ----------
function buildToolbox() {
  const list = document.getElementById("toolboxList");
  list.innerHTML = "";
  const cats = [...new Set(TOOLS.map(t => t.category))];
  cats.forEach(cat => {
    const h = document.createElement("div");
    h.className = "toolbox-cat";
    h.textContent = cat;
    list.appendChild(h);
    TOOLS.filter(t => t.category === cat).forEach(tool => {
      const el = document.createElement("div");
      el.className = "tool-tile";
      el.draggable = true;
      el.dataset.id = tool.id;
      el.innerHTML =
        '<span class="tile-emoji">' + tool.emoji + '</span>' +
        '<span class="tile-label">' + tool.label + '</span>' +
        '<button class="tile-info-btn" type="button" aria-label="Info"></button>';

      el.addEventListener("dragstart", e => {
        if (el.classList.contains("used")) { e.preventDefault(); return; }
        e.dataTransfer.setData("toolId", tool.id);
        el.classList.add("dragging");
        playSFX("pickup");
      });
      el.addEventListener("dragend", () => el.classList.remove("dragging"));
      el.addEventListener("mouseenter", () => playSFX("hover"));

      const infoBtn = el.querySelector(".tile-info-btn");
      infoBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        e.preventDefault();
        toggleTooltip(this, tool);
      });
      list.appendChild(el);
    });
  });
}

function setToolboxUsed(toolId, used) {
  const tile = document.querySelector('.tool-tile[data-id="' + toolId + '"]');
  if (tile) tile.classList.toggle("used", used);
}

// ---------- TOOLTIP (toggle on same-button click; positioned next to button) ----------
function toggleTooltip(btn, tool) {
  const existing = document.getElementById("activeTooltip");
  // If the same button owns the tooltip -> close it
  if (existing && existing.dataset.ownerId === tool.id) {
    hideTooltip();
    return;
  }
  showTooltip(btn, tool);
}

function showTooltip(btn, tool) {
  hideTooltip();
  const tip = document.createElement("div");
  tip.className = "tool-tooltip visible";
  tip.id = "activeTooltip";
  tip.dataset.ownerId = tool.id;
  tip.innerHTML = "<strong>" + tool.label + "</strong>" + (tool.desc || tool.category);
  document.body.appendChild(tip);

  const btnRect = btn.getBoundingClientRect();
  const tipRect = tip.getBoundingClientRect();
  const margin  = 12;

  let left = btnRect.right + margin;
  if (left + tipRect.width > window.innerWidth - 10) {
    left = btnRect.left - tipRect.width - margin;
  }
  if (left < 10) left = 10;

  let top = btnRect.top + (btnRect.height / 2) - (tipRect.height / 2);
  if (top < 10) top = 10;
  if (top + tipRect.height > window.innerHeight - 10) {
    top = window.innerHeight - tipRect.height - 10;
  }

  tip.style.left = left + "px";
  tip.style.top  = top + "px";
}

function hideTooltip() {
  const existing = document.getElementById("activeTooltip");
  if (existing) existing.remove();
}

// Close tooltip on outside click, scroll, drag, resize
document.addEventListener("click", function(e) {
  if (!e.target.closest(".tile-info-btn") && !e.target.closest(".tool-tooltip")) {
    hideTooltip();
  }
});
document.addEventListener("scroll", hideTooltip, true);
document.addEventListener("dragstart", hideTooltip);
window.addEventListener("resize", hideTooltip);

// ---------- DROP ZONE ----------
function buildDropZone() {
  state.droppedTools = [];
  state.phaseFills = {};  // now { detect: [tool, tool], analyze: [...], ... }
  const boxes = document.querySelectorAll(".phase-box");
  if (!boxes.length) { console.warn("phase-box elements not found"); return; }

  boxes.forEach((box) => {
    const phaseId = box.dataset.phase;
    const phase = PHASES.find(p => p.id === phaseId);
    const slot = box.querySelector(".phase-slot");
    const status = box.querySelector(".phase-status");

    // All boxes active, no locking
    box.classList.remove("filled", "drag-over", "shake", "locked");
    box.classList.add("active");
    status.textContent = "OPEN";
    state.phaseFills[phaseId] = [];
    slot.innerHTML = '<div class="phase-hint">Drop ' + phase.label + ' tools here</div>';

    slot.ondragover = e => { e.preventDefault(); box.classList.add("drag-over"); };
    slot.ondragleave = () => box.classList.remove("drag-over");
    slot.ondrop = e => {
      e.preventDefault();
      box.classList.remove("drag-over");
      const id = e.dataTransfer.getData("toolId");
      if (!id) return;
      if (state.droppedTools.find(t => t.id === id)) return;  // same tool can't be dropped twice anywhere
      const tool = TOOLS.find(t => t.id === id);
      if (!tool) return;
      const toolPhase = getToolPhase(tool);
      if (toolPhase !== phaseId) { shakePhase(box); try{playSFX("error");}catch(_){} return; }
      acceptPhaseDrop(box, phase, tool);
    };
  });
  updateTileCounter();
  updateSubmitBtn();
  renderPainSidebar();
}

function acceptPhaseDrop(box, phase, tool) {
  state.droppedTools.push(tool);
  state.phaseFills[phase.id].push(tool);
  try { setToolboxUsed(tool.id, true); } catch(_) {}

  const slot = box.querySelector(".phase-slot");
  // Remove hint if present
  const hint = slot.querySelector(".phase-hint");
  if (hint) hint.remove();
  // Ensure a container exists
  let container = slot.querySelector(".phase-tool-list");
  if (!container) {
    container = document.createElement("div");
    container.className = "phase-tool-list";
    slot.appendChild(container);
  }
  // Add the tool pill
  const pill = document.createElement("div");
  pill.className = "phase-tool";
  pill.dataset.toolId = tool.id;
  pill.innerHTML = '<span>' + (tool.emoji || "ðŸ”§") + '</span><span>' + tool.label + '</span><button class="tile-remove" title="Remove">âœ•</button>';
  pill.querySelector(".tile-remove").onclick = () => removePhaseDrop(box, phase, tool);
  container.appendChild(pill);

  box.classList.add("filled");
  box.querySelector(".phase-status").textContent = "FILLED (" + state.phaseFills[phase.id].length + ")";
  try { playSFX("drop"); } catch(_){}
  updateTileCounter();
  updateSubmitBtn();
}

function removePhaseDrop(box, phase, tool) {
  // Remove only this tool
  state.phaseFills[phase.id] = state.phaseFills[phase.id].filter(t => t.id !== tool.id);
  state.droppedTools = state.droppedTools.filter(t => t.id !== tool.id);
  try { setToolboxUsed(tool.id, false); } catch(_){}

  const slot = box.querySelector(".phase-slot");
  const pill = slot.querySelector('.phase-tool[data-tool-id="' + tool.id + '"]');
  if (pill) pill.remove();

  const remaining = state.phaseFills[phase.id].length;
  if (remaining === 0) {
    box.classList.remove("filled");
    box.querySelector(".phase-status").textContent = "OPEN";
    slot.innerHTML = '<div class="phase-hint">Drop ' + phase.label + ' tools here</div>';
  } else {
    box.querySelector(".phase-status").textContent = "FILLED (" + remaining + ")";
  }
  updateTileCounter();
  updateSubmitBtn();
}

function shakePhase(box) {
  box.classList.add("shake");
  setTimeout(() => box.classList.remove("shake"), 500);
}

function renderPainSidebar() {
  const ul = document.getElementById("painSidebarList");
  if (!ul || !state.currentScenario) return;
  ul.innerHTML = "";
  (state.currentScenario.pains || []).forEach(p => {
    const li = document.createElement("li");
    li.textContent = p;
    ul.appendChild(li);
  });
}

function updateTileCounter() {
  const total = state.droppedTools.length;
  const el = document.getElementById("tileCounter");
  if (el) el.textContent = total + " tools placed";
}

function updateSubmitBtn() {
  const btn = document.getElementById("btnSubmit");
  if (!btn) return;
  const phases = Object.keys(state.phaseFills || {});
  const filledPhases = phases.filter(p => state.phaseFills[p].length > 0).length;
  const done = filledPhases >= 4;
  btn.disabled = !done;
  btn.textContent = done ? "Submit Solution" : "Fill all 4 phases (" + filledPhases + "/4)";
}



// ---------- TIMER ----------
function startTimer() {
  clearInterval(state.timerInterval);
  const total = GAME_SETTINGS.timerSeconds;
  const ring  = document.getElementById("timerProgress");
  const circ  = 2 * Math.PI * 40;
  if (ring) ring.style.strokeDasharray = circ;
  let lastShownCountdown = -1;

  state.timerInterval = setInterval(() => {
    state.timeLeft--;
    const txt = document.getElementById("timerText");
    const m = Math.floor(state.timeLeft / 60);
    const s = String(state.timeLeft % 60).padStart(2, "0");
    if (txt) txt.textContent = m + ":" + s;
    if (ring) ring.style.strokeDashoffset = circ * (1 - state.timeLeft / total);

    const wrap = document.getElementById("timerWrapper");
    const body = document.body;
    if (wrap) {
      wrap.classList.toggle("warning",  state.timeLeft <= 60 && state.timeLeft > 30);
      wrap.classList.toggle("danger",   state.timeLeft <= 30 && state.timeLeft > 10);
      wrap.classList.toggle("critical", state.timeLeft <= 10);
    }
    body.classList.toggle("timer-danger",   state.timeLeft <= 30 && state.timeLeft > 10);
    body.classList.toggle("timer-critical", state.timeLeft <= 10);

    // Audible tick every second in final 10
    if (state.timeLeft > 0 && state.timeLeft <= 10) {
      if (state.soundOn && window.Audio7) Audio7.tick();
      if (window.FX && state.timeLeft <= 5) FX.shake("light");
    }

    // Giant countdown overlay for final 3
    if (state.timeLeft <= 3 && state.timeLeft > 0 && state.timeLeft !== lastShownCountdown) {
      lastShownCountdown = state.timeLeft;
      showCountdownNumber(state.timeLeft);
    }

    if (state.timeLeft <= 0) {
      clearInterval(state.timerInterval);
      body.classList.remove("timer-danger", "timer-critical");
      playSFX("error");
      if (window.FX) FX.reactTimeout();
      submitSolution(true);
    }
  }, 1000);
}

// ---------- GIANT COUNTDOWN OVERLAY (final 3s) ----------
function showCountdownNumber(n) {
  const el = document.createElement("div");
  el.className = "countdown-flash";
  el.textContent = n;
  document.body.appendChild(el);
  if (window.gsap) {
    gsap.fromTo(el,
      { scale: 0.3, opacity: 0 },
      { scale: 1.3, opacity: 1, duration: 0.25, ease: "back.out(3)" }
    );
    gsap.to(el, {
      scale: 2, opacity: 0, duration: 0.5, delay: 0.3,
      ease: "power2.in",
      onComplete: () => el.remove()
    });
  } else {
    setTimeout(() => el.remove(), 900);
  }
}

// ---------- SUBMIT ----------
function submitSolution(timedOut) {
  clearInterval(state.timerInterval);
  stopVoice();
  if (!timedOut) { playSFX("submit"); if (window.FX) FX.reactSubmit(); }
  const elapsed = Math.round((Date.now() - state.startTime) / 1000);
  const result  = calcScore(state.currentScenario, state.droppedTools, elapsed, timedOut);
  showDashboard(result, timedOut);
}

// ---------- DASHBOARD ----------
function showDashboard(result, timedOut) {
  showScreen("screen-dashboard");
  const sc = state.currentScenario;

  document.getElementById("finalPlayerName").textContent = state.playerName + "  .  " + state.playerDept;

  // Start score at 0, count up with GSAP
  const scoreEl = document.getElementById("finalScore");
  scoreEl.textContent = "0";

  // Rank badge: start invisible, scale in later
  const badge = document.getElementById("rankBadge");
  badge.textContent = "";
  if (window.gsap) gsap.set(badge, { scale: 0, opacity: 0 });

  // Breakdown bars: start at 0 width
  const breakdown = document.getElementById("scoreBreakdown");
  breakdown.innerHTML = "";
  const dims = [
    { label:"Coverage",   val: result.coverage   },
    { label:"Efficiency", val: result.efficiency },
    { label:"Cost",       val: result.cost       },
    { label:"Creativity", val: result.creativity },
    { label:"Key Tools",  val: result.keyTools   }
  ];
  dims.forEach(d => {
    const row = document.createElement("div");
    row.className = "breakdown-row";
    row.innerHTML =
      '<span class="bd-label">' + d.label + '</span>' +
      '<div class="bd-bar-wrap"><div class="bd-bar" style="width:0%"></div></div>' +
      '<span class="bd-val">0</span>';
    breakdown.appendChild(row);
  });

  // Optimal tools chips
  const optEl = document.getElementById("optimalTools");
  optEl.innerHTML = "";
  const optSet = new Set(sc.optimal);
  sc.optimal.forEach(id => {
    const t = TOOLS.find(t => t.id === id);
    if (!t) return;
    const chip = document.createElement("span");
    chip.className = "opt-chip" + (state.droppedTools.find(d => d.id === id) ? " got-it" : "");
    chip.textContent = t.emoji + " " + t.label;
    optEl.appendChild(chip);
  });

  // Wrong picks
  const wrongEl = document.getElementById("wrongTools");
  const wrongSection = document.getElementById("wrongSection");
  if (wrongEl && wrongSection) {
    wrongEl.innerHTML = "";
    const wrongs = state.droppedTools.filter(t => !optSet.has(t.id));
    if (wrongs.length) {
      wrongs.forEach(t => {
        const chip = document.createElement("span");
        chip.className = "opt-chip wrong-pick";
        chip.textContent = t.emoji + " " + t.label;
        wrongEl.appendChild(chip);
      });
      wrongSection.style.display = "";
    } else {
      wrongSection.style.display = "none";
    }
  }

  addToBoard({ name: state.playerName, dept: state.playerDept, score: result.total, scenario: sc.badge });
  renderLeaderboard();

  // Check achievements (delay so dashboard renders first)
  if (window.Achievements) {
    const elapsedSec = Math.round((Date.now() - state.startTime) / 1000);
    setTimeout(() => Achievements.checkAll(result, {
      scenario: sc, droppedTools: state.droppedTools,
      maxStreak: state.maxStreak || 0, elapsed: elapsedSec, timedOut: false
    }), 2800);
    Achievements.renderTrophyCase("trophyCase");
  }

  // ----- CINEMATIC REVEAL SEQUENCE -----
  setTimeout(() => runScoreReveal(result), 400);

  document.getElementById("btnReplay").onclick = () => {
    buildCards();
    showScreen("screen-cards");
  };
  document.getElementById("btnChangePlayer").onclick = () => {
    clearProfile();
    document.getElementById("inpName").value = "";
    document.getElementById("inpDept").value = "";
    showScreen("screen-welcome");
  };
  document.getElementById("btnResetBoard").onclick = () => {
    if (confirm("Reset leaderboard?")) { localStorage.removeItem("dad_board"); renderLeaderboard(); }
  };
}

// ---------- CINEMATIC SCORE REVEAL ----------
function runScoreReveal(result) {
  const scoreEl = document.getElementById("finalScore");
  const badge   = document.getElementById("rankBadge");
  const target  = result.total;
  const counter = { val: 0 };
  let lastTick = 0;

  if (window.gsap) {
    gsap.to(counter, {
      val: target,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        const v = Math.round(counter.val);
        scoreEl.textContent = v;
        // Tick sound every 5 points
        if (v - lastTick >= 5) {
          lastTick = v;
          if (state.soundOn && window.Audio7) Audio7.tick();
        }
      },
      onComplete: () => {
        scoreEl.textContent = target;
        // Score pulse on finish
        gsap.fromTo(scoreEl, { scale: 1 }, { scale: 1.3, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.inOut" });
        revealRank(result);
      }
    });
  } else {
    scoreEl.textContent = target;
    revealRank(result);
  }

  // Animate breakdown bars staggered
  const rows = document.querySelectorAll(".breakdown-row");
  const dims = [result.coverage, result.efficiency, result.cost, result.creativity, result.keyTools];
  rows.forEach((row, i) => {
    const bar = row.querySelector(".bd-bar");
    const val = row.querySelector(".bd-val");
    const target = dims[i];
    const obj = { v: 0 };
    if (window.gsap) {
      gsap.to(obj, {
        v: target,
        duration: 1.2,
        delay: 0.3 + i * 0.15,
        ease: "power2.out",
        onUpdate: () => {
          bar.style.width = obj.v + "%";
          val.textContent = Math.round(obj.v);
        }
      });
    } else {
      bar.style.width = target + "%";
      val.textContent = target;
    }
  });
}

function revealRank(result) {
  const badge = document.getElementById("rankBadge");
  badge.textContent =
    result.total >= 90 ? "ðŸ†" :
    result.total >= 75 ? "ðŸ¥‡" :
    result.total >= 55 ? "ðŸ¥ˆ" :
    result.total >= 35 ? "ðŸ¥‰" : "ðŸŽ“";

  if (window.gsap) {
    gsap.to(badge, {
      scale: 1, opacity: 1,
      duration: 0.6,
      ease: "back.out(2)",
      onStart: () => { if (state.soundOn && window.Audio7) Audio7.achievement(); if (window.FX) FX.reactAchievement(); }
    });
  } else {
    badge.style.opacity = 1; badge.style.transform = "scale(1)";
  }

  // Confetti!
  if (window.confetti) {
    if (result.total >= 90) celebrateBig();
    else if (result.total >= 70) celebrateMedium();
    else if (result.total >= 50) celebrateSmall();
  }
}

function celebrateSmall() {
  confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 }, colors: ["#00f0ff","#7c3aed","#ffd700"] });
}
function celebrateMedium() {
  confetti({ particleCount: 120, spread: 100, startVelocity: 45, origin: { y: 0.55 }, colors: ["#00f0ff","#7c3aed","#ffd700","#ff3366"] });
  setTimeout(() => confetti({ particleCount: 80, spread: 120, origin: { y: 0.4, x: 0.3 } }), 250);
  setTimeout(() => confetti({ particleCount: 80, spread: 120, origin: { y: 0.4, x: 0.7 } }), 400);
}
function celebrateBig() {
  const colors = ["#00f0ff","#7c3aed","#ffd700","#ff3366","#00ff88"];
  confetti({ particleCount: 200, spread: 160, startVelocity: 55, origin: { y: 0.6 }, colors });
  let shots = 0;
  const barrage = setInterval(() => {
    confetti({ particleCount: 60, spread: 80, origin: { y: Math.random() * 0.4 + 0.2, x: Math.random() }, colors });
    shots++;
    if (shots > 6) clearInterval(barrage);
  }, 200);
}

function renderLeaderboard() {
  const list = document.getElementById("leaderList");
  list.innerHTML = "";
  getBoard().forEach((e, i) => {
    const li = document.createElement("li");
    li.className = i < 3 ? "top-" + (i + 1) : "";
    li.innerHTML =
      '<span class="lb-rank">' + (i + 1) + '</span>' +
      '<span class="lb-name">' + e.name + '</span>' +
      '<span class="lb-dept">' + e.dept + '</span>' +
      '<span class="lb-scenario">' + e.scenario + '</span>' +
      '<span class="lb-score">' + e.score + '</span>';
    list.appendChild(li);
  });
}

// ---------- BOOTSTRAP ----------
document.addEventListener("DOMContentLoaded", () => {
  initAudioToggles();
  if (window.FX) FX.wireButtons();
  loadProfile();
  initWelcome();
  initSplash();
  document.getElementById("btnSubmit").addEventListener("click", () => submitSolution(false));
});

// ---------- STREAK / COMBO HELPERS ----------
function updateStreakHUD() {
  const el = document.getElementById("hudStreak");
  if (!el) return;
  if (state.streak >= 2) {
    el.textContent = "x" + state.streak;
    el.style.display = "";
    if (window.gsap) gsap.fromTo(el, { scale: 0.6 }, { scale: 1, duration: 0.3, ease: "back.out(2.5)" });
  } else {
    el.textContent = "";
    el.style.display = "none";
  }
}

function showComboToast(level) {
  const labels = {
    2: { text: "DOUBLE!",    color: "#00f0ff" },
    3: { text: "TRIPLE!",    color: "#7c3aed" },
    4: { text: "ON FIRE!",   color: "#ff6a00" },
    5: { text: "LEGENDARY!", color: "#ffd700" }
  };
  const key = level >= 5 ? 5 : level;
  const cfg = labels[key] || labels[5];

  const toast = document.createElement("div");
  toast.className = "combo-toast";
  toast.innerHTML = cfg.text + '<span class="combo-x">x' + level + '</span>';
  toast.style.color = cfg.color;
  toast.style.textShadow = "0 0 30px " + cfg.color + ", 0 0 60px " + cfg.color;
  document.body.appendChild(toast);

  if (window.gsap) {
    gsap.fromTo(toast,
      { scale: 0.3, opacity: 0, y: 20 },
      { scale: 1.1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(2.5)" }
    );
    gsap.to(toast, {
      opacity: 0, y: -30, duration: 0.5, delay: 1,
      onComplete: () => toast.remove()
    });
  } else {
    setTimeout(() => toast.remove(), 1200);
  }

  // Combo sound - pitch rises with level
  if (state.soundOn && window.Audio7) Audio7.combo(level);

  // LEGENDARY gets confetti
  if (level >= 5 && window.confetti) {
    confetti({
      particleCount: 80, spread: 140, startVelocity: 55,
      origin: { y: 0.3 },
      colors: ["#ffd700", "#00f0ff", "#7c3aed"]
    });
  }
}


// ---------- CINEMATIC SCENE RENDERER ----------
function renderScenarioScene(scenario) {
  var mount = document.getElementById("scenarioScene");
  if (!mount || typeof SCENARIO_SCENES === "undefined") return;
  var key = (scenario && (scenario.scene || scenario.id) || "").toLowerCase();
  var svg = SCENARIO_SCENES[key];
  if (!svg) {
    var title = (scenario && scenario.title || "").toLowerCase();
    if (title.indexOf("qualit") >= 0) svg = SCENARIO_SCENES.quality;
    else if (title.indexOf("prod") >= 0 || title.indexOf("manufact") >= 0) svg = SCENARIO_SCENES.production;
    else if (title.indexOf("mainten") >= 0 || title.indexOf("safety") >= 0) svg = SCENARIO_SCENES.maintenance;
    else svg = SCENARIO_SCENES.quality;
  }
  mount.innerHTML = svg || "";
}

// Hook: call this on briefing open
document.addEventListener("DOMContentLoaded", function() {
  // Patch startScenario if it exists, to also render the scene
  if (typeof startScenario === "function" && !startScenario._scenePatched) {
    var _orig = startScenario;
    window.startScenario = function(sc) {
      var r = _orig.apply(this, arguments);
      try { renderScenarioScene(sc); } catch(e) { console.warn("scene render failed", e); }
      return r;
    };
    window.startScenario._scenePatched = true;
  }
});


// ---------- UNIVERSAL RESTART ----------
function wireRestartButton() {
  var btn    = document.getElementById("btnRestart");
  var modal  = document.getElementById("restartConfirm");
  var cancel = document.getElementById("restartCancel");
  var yes    = document.getElementById("restartConfirmYes");
  if (!btn || !modal) return;

  btn.addEventListener("click", function() { modal.hidden = false; });
  cancel.addEventListener("click", function() { modal.hidden = true; });
  modal.addEventListener("click", function(e) { if (e.target === modal) modal.hidden = true; });
  yes.addEventListener("click", function() {
    modal.hidden = true;
    doRestart();
  });

  // Visibility: hide on splash/welcome, show elsewhere
  var mo = new MutationObserver(function() { updateRestartVisibility(); });
  document.querySelectorAll(".screen").forEach(function(s) {
    mo.observe(s, { attributes: true, attributeFilter: ["class"] });
  });
  updateRestartVisibility();
}

function updateRestartVisibility() {
  var btn = document.getElementById("btnRestart");
  if (!btn) return;
  var active = document.querySelector(".screen.active");
  var id = active ? active.id : "";
  btn.hidden = (id === "screen-splash" || id === "screen-welcome" || id === "");
}

function doRestart() {
  try { if (state && state.timerInterval) clearInterval(state.timerInterval); } catch(e) {}
  try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch(e) {}
  if (window.state) {
    state.droppedTools = [];
    state.currentScenario = null;
    state.score = 0;
    state.combo = 0;
    state.timeLeft = 0;
  }
  if (typeof buildCards === "function") buildCards();
  if (typeof showScreen === "function") showScreen("screen-cards");
}

document.addEventListener("DOMContentLoaded", wireRestartButton);
