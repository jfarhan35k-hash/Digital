// ============================================================
//  scoring.js  -  Digital Awareness Day  (clean build)
// ============================================================
//
//  Final score = weighted average of 5 dimensions (0-100)
//                + speed bonus (0-10 extra points)
//                capped at 100.
//
//  Dimensions:
//    coverage   - % of optimal tools the player picked
//    efficiency - % time remaining when submitted
//    cost       - penalty for wrong/expensive tool choices
//    creativity - % of required workflow stages covered
//    keyTools   - % of key tool categories represented
// ============================================================

function calcScore(sc, dropped, elapsed, timedOut) {
  const w     = GAME_SETTINGS.weights;
  const total = GAME_SETTINGS.timerSeconds;

  // ---- Coverage ----
  const optSet   = new Set(sc.optimal);
  const dropIds  = dropped.map(t => t.id);
  const hits     = dropIds.filter(id => optSet.has(id)).length;
  const coverage = sc.optimal.length
    ? Math.round((hits / sc.optimal.length) * 100)
    : 0;

  // ---- Efficiency (0 if timed out) ----
  const efficiency = timedOut
    ? 0
    : Math.round(Math.max(0, 100 - (elapsed / total) * 100));

  // ---- Cost: penalise wrong-tool spend ----
  const wrongCost = dropped
    .filter(t => !optSet.has(t.id))
    .reduce((sum, t) => sum + (t.cost || 0), 0);
  const cost = Math.max(0, 100 - wrongCost * 8);

  // ---- Creativity: required stages covered ----
  const stageCats = new Set(dropped.flatMap(t => t.stages || []));
  const reqCats   = new Set(sc.requiredStages || []);
  const catHits   = [...reqCats].filter(c => stageCats.has(c)).length;
  const creativity = reqCats.size
    ? Math.round((catHits / reqCats.size) * 100)
    : 0;

  // ---- Key tools: key categories represented ----
  const keySet     = new Set(sc.keyToolCategories || []);
  const playerCats = new Set(dropped.map(t => t.category));
  const keyHits    = [...keySet].filter(c => playerCats.has(c)).length;
  const keyTools   = keySet.size
    ? Math.round((keyHits / keySet.size) * 100)
    : 0;

  // ---- Weighted average (0-100) ----
  const weighted =
    coverage   * w.coverage   +
    efficiency * w.efficiency +
    cost       * w.cost       +
    creativity * w.creativity +
    keyTools   * w.keyTools;

  // ---- Speed bonus (0 if timed out, up to speedBonusMax, scaled to +10 pts) ----
  const speedBonus = timedOut
    ? 0
    : Math.round((GAME_SETTINGS.speedBonusMax * Math.max(0, total - elapsed)) / total);
  const speedPoints = Math.round(speedBonus / 5);  // max ~10 pts on top

  // ---- Final: weighted + bonus, capped at 100 ----
  const finalTotal = Math.min(100, Math.round(weighted) + speedPoints);

  return {
    total:      finalTotal,
    coverage:   coverage,
    efficiency: efficiency,
    cost:       cost,
    creativity: creativity,
    keyTools:   keyTools,
    speedBonus: speedPoints,
    hits:       hits,
    elapsed:    elapsed
  };
}
