'use strict';

// ─── Constants ────────────────────────────────────────────────────────────────

const START_DATE  = '2026-06-02';
const GOAL_DATE   = '2026-09-30';
const START_WEIGHT = 82;
const GOAL_WEIGHT  = 70;

const PHASES = [
  { week: 1,  sets: 3, repsMin: 12, repsMax: 15 },
  { week: 5,  sets: 4, repsMin: 10, repsMax: 12 },
  { week: 10, sets: 4, repsMin: 8,  repsMax: 10 },
];

// Training days definition (Celinas echter Plan)
const TRAINING_DAYS = {
  A: {
    label: 'Po & Beine',
    emoji: '🍑',
    exercises: [
      { name: 'Hip Thrust',                    target: '4×10', tag: 'Po Hauptübung' },
      { name: 'Rumänisches Kreuzheben (RDL)',  target: '4×12', tag: 'Po & Beinrückseite' },
      { name: 'Einbeinige Beinpresse',         target: '3×12', tag: 'Po & Quads' },
      { name: 'Abduktoren-Maschine',           target: '4×15', tag: 'Po (seitlich)' },
      { name: 'Hyperextension',                target: '3×15', tag: 'Po & unterer Rücken' },
    ],
  },
  B: {
    label: 'Brust & Arme',
    emoji: '💪',
    exercises: [
      { name: 'Brustpresse',                   target: '4×12', tag: 'Brust' },
      { name: 'Butterfly',                     target: '3×12', tag: 'Brust Isolierung' },
      { name: 'Schulterdrücken (Kurzhantel)',  target: '3×12', tag: 'Schultern' },
      { name: 'Seitheben',                     target: '3×15', tag: 'Schultern Definition' },
      { name: 'Trizeps Kabelzug (einarmig)',   target: '3×15', tag: 'Arme Definition' },
      { name: 'Trizeps Pushdown',              target: '3×15', tag: 'Arme Definition' },
      { name: 'Around the World',              target: '3×15', tag: 'Schultern/Brust' },
    ],
  },
  C: {
    label: 'Rücken & Bizeps',
    emoji: '🔙',
    exercises: [
      { name: 'Latzug',                        target: '4×12', tag: 'Rücken (breit)' },
      { name: 'Rudern',                        target: '4×12', tag: 'Rücken (Mitte)' },
      { name: 'Face Pulls',                    target: '3×15', tag: 'hintere Schulter' },
      { name: 'Lat Pulldown',                  target: '3×12', tag: 'Rücken (breit)' },
      { name: 'Reverse Butterfly',             target: '3×15', tag: 'hintere Schulter' },
      { name: 'Bizeps Kabelzug',               target: '3×15', tag: 'Arme Definition' },
    ],
  },
  D: {
    label: 'Cardio + Core (optional)',
    emoji: '🏃',
    exercises: [
      { name: 'Laufband (zügig gehen)', target: '20 Min', tag: 'Cardio' },
      { name: 'Fahrrad-Ergometer',      target: '15 Min', tag: 'Cardio' },
      { name: 'Plank',                  target: '3×45 Sek', tag: 'Core' },
      { name: 'Dead Bug',               target: '3×10', tag: 'Core' },
      { name: 'Bird Dog',               target: '3×10', tag: 'Core' },
    ],
  },
};

const ALTERNATIVES = {
  // Tag A — Po & Beine
  'Hip Thrust':                   ['Glute Bridge (Boden)', 'Beinpresse (Po-Fokus)'],
  'Rumänisches Kreuzheben (RDL)': ['Beinbeuger-Maschine', 'Good Mornings'],
  'Einbeinige Beinpresse':        ['Ausfallschritte', 'Bulgarian Split Squat'],
  'Abduktoren-Maschine':          ['Kabel-Abduktion', 'Band Abduktion (seitlich)'],
  'Hyperextension':               ['Glute Bridge', 'Romanian Deadlift (leicht)'],
  // Tag B — Brust & Arme
  'Brustpresse':                  ['Bankdrücken (Kurzhantel)', 'Liegestütze'],
  'Butterfly':                    ['Kabel-Flys', 'Schrägbank-Flys'],
  'Schulterdrücken (Kurzhantel)': ['Schulterpresse (Maschine)', 'Arnold Press'],
  'Seitheben':                    ['Seitheben (Kabel)', 'Seitheben (Maschine)'],
  'Trizeps Kabelzug (einarmig)':  ['Overhead Extension', 'Trizeps Kickback'],
  'Trizeps Pushdown':             ['Dips (assistiert)', 'Overhead Extension'],
  'Around the World':             ['Frontheben', 'Seitheben (leicht)'],
  // Tag C — Rücken & Bizeps
  'Latzug':                       ['Klimmzüge (assistiert)', 'Kabelzug sitzend'],
  'Rudern':                       ['Kurzhantel-Rudern', 'T-Bar-Rudern'],
  'Face Pulls':                   ['Reverse Butterfly', 'Band Pull-Aparts'],
  'Lat Pulldown':                 ['Latzug (eng)', 'Klimmzüge (assistiert)'],
  'Reverse Butterfly':            ['Face Pulls', 'Reverse Flyes (Kurzhantel)'],
  'Bizeps Kabelzug':              ['Hammer Curls', 'Kurzhantel-Curls'],
  // Tag D — Cardio + Core
  'Laufband (zügig gehen)':       ['Ellipsentrainer', 'Stepper'],
  'Fahrrad-Ergometer':            ['Rudermaschine', 'Crosstrainer'],
  'Plank':                        ['Knie-Plank', 'Unterarm-Plank'],
  'Dead Bug':                     ['Hollow Body Hold', 'Beinsenken (geführt)'],
  'Bird Dog':                     ['Quadruped Hip Extension', 'Superman'],
};

// ─── Data Layer ───────────────────────────────────────────────────────────────

function loadData() {
  let d;
  try {
    d = JSON.parse(localStorage.getItem('fitnessData') || 'null');
  } catch { d = null; }
  if (!d) d = {};
  // Defaults / Migration für ältere Datenstände
  if (!Array.isArray(d.weightLog))    d.weightLog = [];
  if (!Array.isArray(d.measurements)) d.measurements = [];
  if (!Array.isArray(d.workouts))     d.workouts = [];
  if (!d.customExercises || typeof d.customExercises !== 'object') {
    d.customExercises = { A: [], B: [], C: [], D: [] };
  }
  ['A', 'B', 'C', 'D'].forEach(k => {
    if (!Array.isArray(d.customExercises[k])) d.customExercises[k] = [];
  });
  return d;
}

// Basis-Übungen + eigene (vom Nutzer hinzugefügte) Übungen eines Tages
function getDayExercises(day, data) {
  const base   = (TRAINING_DAYS[day]?.exercises || []).map(e => ({ ...e, custom: false }));
  const custom = (data.customExercises?.[day] || []).map(e => ({ ...e, custom: true }));
  return [...base, ...custom];
}

// Letzte tatsächlich gemachte Einheit einer Übung (für "vom letzten Mal übernehmen")
function lastSessionInfo(name, data) {
  for (let i = data.workouts.length - 1; i >= 0; i--) {
    const ex = data.workouts[i].exercises.find(e => e.name === name && !e.skipped && e.sets?.length);
    if (ex) {
      const s = ex.sets[ex.sets.length - 1];
      return { weight: s.weight, reps: s.reps, rpe: s.rpe, date: data.workouts[i].date };
    }
  }
  return null;
}

function saveData(data) {
  localStorage.setItem('fitnessData', JSON.stringify(data));
  if (window._fbRef) {
    window._fbRef.set(data).catch(() => {});
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function today() {
  return new Date().toISOString().slice(0, 10);
}

function currentWeek() {
  const start = new Date(START_DATE);
  const now   = new Date();
  return Math.max(1, Math.ceil((now - start) / 86400000 / 7));
}

function currentPhase() {
  const week = currentWeek();
  const phases = [...PHASES].reverse();
  return phases.find(p => week >= p.week) || PHASES[0];
}

function weeksRemaining() {
  const goal = new Date(GOAL_DATE);
  const now  = new Date();
  return Math.max(0, Math.ceil((goal - now) / 86400000 / 7));
}

function latestWeight(data) {
  if (!data.weightLog.length) return START_WEIGHT;
  return data.weightLog[data.weightLog.length - 1].weight;
}

function nextTrainingDay(data) {
  // Rotation: Po → Brust → Rücken → Po → Cardio → wieder von vorn
  const dayOrder = ['A', 'B', 'C', 'A', 'D'];
  if (!data.workouts.length) return 'A';
  const last = data.workouts[data.workouts.length - 1].dayType;
  const idx = dayOrder.indexOf(last);
  return dayOrder[(idx + 1) % dayOrder.length];
}

function calculateNextWeight(exerciseName, data) {
  const sessions = data.workouts
    .filter(w => w.exercises.some(e => e.name === exerciseName && !e.skipped))
    .slice(-2);
  if (!sessions.length) return null;

  const last = sessions[sessions.length - 1];
  const ex = last.exercises.find(e => e.name === exerciseName);
  if (!ex || !ex.sets.length) return null;

  const lastSet = ex.sets[ex.sets.length - 1];
  const avgRPE  = ex.sets.reduce((s, r) => s + r.rpe, 0) / ex.sets.length;
  const phase   = currentPhase();

  if (avgRPE <= 7 && lastSet.reps >= phase.repsMin) return +(lastSet.weight + 2.5).toFixed(1);
  if (avgRPE >= 9 || lastSet.reps < phase.repsMin - 2) return Math.max(+(lastSet.weight - 2.5).toFixed(1), 0);
  return lastSet.weight;
}

function trafficLight(actual, target, lowerIsBetter = false) {
  if (actual === null || actual === undefined || target === null) return '';
  const diff = ((actual - target) / target) * 100;
  if (lowerIsBetter) {
    if (diff <= -1) return '🟢';
    if (diff <= 2)  return '🟡';
    return '🔴';
  }
  if (diff >= 1)  return '🟢';
  if (diff >= -2) return '🟡';
  return '🔴';
}

function showToast(msg, color = '#2e7d32') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.background = color;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ─── Navigation ───────────────────────────────────────────────────────────────

let activeCharts = {};

function navigate(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + pageId).classList.add('active');
  document.querySelector(`.nav-btn[data-page="${pageId}"]`).classList.add('active');

  if (pageId === 'dashboard') renderDashboard();
  if (pageId === 'training')  renderTraining();
  if (pageId === 'stats')     renderStats();
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function renderDashboard() {
  const data    = loadData();
  const current = latestWeight(data);
  const lost    = +(START_WEIGHT - current).toFixed(1);
  const total   = START_WEIGHT - GOAL_WEIGHT;
  const pct     = Math.min(100, Math.max(0, Math.round((lost / total) * 100)));
  const weeks   = weeksRemaining();
  const nextDay = nextTrainingDay(data);

  document.getElementById('current-weight').textContent = current.toFixed(1);
  document.getElementById('weight-lost').textContent    = lost >= 0 ? `-${lost}` : `+${Math.abs(lost)}`;
  document.getElementById('weeks-left').textContent     = weeks;
  document.getElementById('progress-bar').style.width  = pct + '%';
  document.getElementById('progress-pct').textContent  = pct + '%';
  document.getElementById('progress-start').textContent = START_WEIGHT + ' kg';
  document.getElementById('progress-goal').textContent  = GOAL_WEIGHT + ' kg';

  // Weekly target check
  const weeklyTarget = ((START_WEIGHT - GOAL_WEIGHT) / 17).toFixed(2); // 17 weeks total
  document.getElementById('weekly-target').textContent = weeklyTarget + ' kg/Woche Ziel';

  // Measurements
  const lastM = data.measurements[data.measurements.length - 1];
  const prevM = data.measurements[data.measurements.length - 2];
  renderMeasureDelta('hip-value',  'hip-delta',  lastM?.hip,  prevM?.hip,  false);
  renderMeasureDelta('waist-value','waist-delta', lastM?.waist,prevM?.waist,true);
  renderMeasureDelta('arm-value',  'arm-delta',   lastM?.arm,  prevM?.arm,  true);

  // Next workout with weight recommendations
  const day = TRAINING_DAYS[nextDay];
  document.getElementById('nw-title').textContent = `Tag ${nextDay} — ${day.label}`;

  const nwList = document.getElementById('nw-exercises');
  nwList.innerHTML = '';
  getDayExercises(nextDay, data).slice(0, 5).forEach(ex => {
    const rec = calculateNextWeight(ex.name, data);
    const div = document.createElement('div');
    div.className = 'nw-exercise';
    div.innerHTML = `
      <span class="ex-name">${ex.name}</span>
      <span class="ex-arrow">→</span>
      <span class="ex-rec">${rec !== null ? rec + ' kg' : ex.target}</span>
    `;
    nwList.appendChild(div);
  });
}

function renderMeasureDelta(valId, deltaId, curr, prev, lowerIsBetter) {
  const valEl   = document.getElementById(valId);
  const deltaEl = document.getElementById(deltaId);
  if (!valEl) return;
  if (!curr) { valEl.textContent = '—'; deltaEl.textContent = 'noch kein Wert'; return; }
  valEl.textContent = curr + ' cm';
  if (!prev) { deltaEl.textContent = ''; return; }
  const d = (curr - prev).toFixed(1);
  const good = lowerIsBetter ? d <= 0 : d >= 0;
  deltaEl.textContent = (d > 0 ? '+' : '') + d + ' cm';
  deltaEl.className   = 'm-delta ' + (good ? 'up' : 'down');
}

// ─── Training ─────────────────────────────────────────────────────────────────

let selectedDay = null;
let currentExerciseForAlt = null;

function renderTraining() {
  const data = loadData();
  selectedDay = nextTrainingDay(data);
  updateDaySelector();
  renderExercises();
}

function updateDaySelector() {
  document.querySelectorAll('.day-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.day === selectedDay);
  });
  const info = document.getElementById('day-info');
  if (selectedDay) {
    const d = TRAINING_DAYS[selectedDay];
    info.textContent = `${d.emoji} ${d.label}`;
  }
}

function renderExercises() {
  if (!selectedDay) return;
  const phase = currentPhase();
  const data  = loadData();
  const list  = document.getElementById('exercise-list');
  list.innerHTML = '';

  getDayExercises(selectedDay, data).forEach((ex, i) => {
    const rec  = calculateNextWeight(ex.name, data);   // Empfehlung (letztes Gewicht + Progression)
    const last = lastSessionInfo(ex.name, data);        // was beim letzten Mal verwendet wurde
    // Gewicht vom letzten Mal übernehmen: Feld mit empfohlenem Gewicht vorbefüllen
    const prefill = rec !== null ? rec : (last ? last.weight : '');
    const safeName = ex.name.replace(/'/g, "\\'");

    // Hinweiszeile: "Letztes Mal" + Empfehlungsrichtung
    let hint = '';
    if (last) {
      let trend = '→ Gewicht halten';
      if (rec !== null && rec > last.weight) trend = `↑ steigern auf ${rec} kg`;
      else if (rec !== null && rec < last.weight) trend = `↓ reduzieren auf ${rec} kg`;
      hint = `<div class="ex-last">📅 Letztes Mal: <strong>${last.weight} kg × ${last.reps}</strong> · RPE ${last.rpe} &nbsp;<span class="ex-trend">${trend}</span></div>`;
    } else {
      hint = `<div class="ex-last ex-last-new">✨ Erste Einheit — Startgewicht selbst wählen</div>`;
    }

    const div = document.createElement('div');
    div.className = 'exercise-entry' + (ex.custom ? ' custom-ex' : '');
    div.id = 'ex-' + i;
    div.innerHTML = `
      <div class="ex-header">
        <div class="ex-info">
          <h3>${ex.name}${ex.custom ? ' <span class="custom-tag">eigene</span>' : ''}</h3>
          <p>${phase.sets}×${phase.repsMin}–${phase.repsMax} Wdh. · ${ex.tag || 'Übung'}</p>
        </div>
        ${rec !== null ? `<span class="ex-badge">Empfohlen: ${rec} kg</span>` : ''}
        ${ex.custom ? `<button class="btn-remove-ex" title="Übung entfernen" onclick="removeCustomExercise('${safeName}')">✕</button>` : ''}
      </div>
      ${hint}
      <div class="set-inputs">
        <div class="input-group">
          <label>Gewicht (kg)</label>
          <input type="number" inputmode="decimal" step="0.5" min="0" value="${prefill}" placeholder="—" id="w-${i}" />
        </div>
        <div class="input-group">
          <label>Wdh.</label>
          <input type="number" inputmode="numeric" min="1" value="${last ? last.reps : ''}" placeholder="${phase.repsMin}" id="r-${i}" />
        </div>
        <div class="input-group">
          <label>Sätze</label>
          <input type="number" inputmode="numeric" min="1" placeholder="${phase.sets}" id="s-${i}" />
        </div>
      </div>
      <div class="rpe-row">
        <label>Erschöpfung</label>
        <input type="range" min="1" max="10" value="7" class="rpe-slider" id="rpe-${i}"
          oninput="document.getElementById('rpev-${i}').textContent=this.value" />
        <span class="rpe-value" id="rpev-${i}">7</span>
      </div>
      <div class="ex-actions">
        <button class="btn-skip" onclick="openAltModal(${i},'${safeName}')">Nicht machbar</button>
        <button class="btn-done" onclick="markDone(${i},'${safeName}')">✓ Geschafft</button>
      </div>
    `;
    list.appendChild(div);
  });

  // "+ Übung hinzufügen" Button
  const addBtn = document.createElement('button');
  addBtn.className = 'btn-add-ex';
  addBtn.textContent = '+ Eigene Übung hinzufügen';
  addBtn.onclick = addCustomExercise;
  list.appendChild(addBtn);
}

// Eigene Übung zum aktuell gewählten Tag hinzufügen
function addCustomExercise() {
  if (!selectedDay) { showToast('Bitte zuerst einen Tag wählen', '#e65100'); return; }
  const name = prompt('Name der Übung (z. B. "Glute Kickback Maschine"):');
  if (!name || !name.trim()) return;
  const data = loadData();
  const clean = name.trim();
  const exists = getDayExercises(selectedDay, data).some(e => e.name.toLowerCase() === clean.toLowerCase());
  if (exists) { showToast('Übung existiert bereits an diesem Tag', '#e65100'); return; }
  data.customExercises[selectedDay].push({ name: clean, target: '3×12', tag: 'Eigene Übung' });
  saveData(data);
  showToast(`✓ "${clean}" hinzugefügt`, '#c42e86');
  renderExercises();
}

// Eigene Übung entfernen
function removeCustomExercise(name) {
  if (!selectedDay) return;
  if (!confirm(`Übung "${name}" entfernen?`)) return;
  const data = loadData();
  data.customExercises[selectedDay] = data.customExercises[selectedDay].filter(e => e.name !== name);
  saveData(data);
  showToast('Übung entfernt', '#6b6b6b');
  renderExercises();
}

function markDone(idx, name) {
  const card = document.getElementById('ex-' + idx);
  card.classList.add('done');
  card.querySelector('.btn-done').textContent = '✓ Gespeichert';
  card.querySelector('.btn-done').disabled = true;
}

function openAltModal(idx, exerciseName) {
  currentExerciseForAlt = { idx, exerciseName };
  const alts = ALTERNATIVES[exerciseName] || [];
  document.getElementById('alt-ex-name').textContent = exerciseName;
  const optionsEl = document.getElementById('alt-options');
  optionsEl.innerHTML = alts.map((a, i) =>
    `<button class="alt-btn" onclick="chooseAlternative(${i})">${a}</button>`
  ).join('');
  document.getElementById('alt-modal').classList.add('open');
}

function chooseAlternative(altIdx) {
  if (!currentExerciseForAlt) return;
  const { idx, exerciseName } = currentExerciseForAlt;
  const alt = ALTERNATIVES[exerciseName]?.[altIdx];
  const card = document.getElementById('ex-' + idx);
  const header = card.querySelector('.ex-info h3');
  header.textContent = alt || exerciseName;
  card.querySelector('.ex-info p').textContent += ' (Alternativ)';
  card.dataset.altName = alt;
  closeAltModal();
  showToast(`Alternativübung gewählt: ${alt}`, '#c42e86');
}

function skipExercise() {
  if (!currentExerciseForAlt) return;
  const { idx } = currentExerciseForAlt;
  const card = document.getElementById('ex-' + idx);
  card.classList.add('skipped');
  card.querySelector('.btn-done').disabled = true;
  card.querySelector('.btn-skip').disabled = true;
  closeAltModal();
  showToast('Übung übersprungen', '#6b6b6b');
}

function closeAltModal() {
  document.getElementById('alt-modal').classList.remove('open');
  currentExerciseForAlt = null;
}

function saveWorkout() {
  if (!selectedDay) { showToast('Bitte einen Tag wählen', '#e65100'); return; }
  const data    = loadData();
  const phase   = currentPhase();
  const exercises = [];

  getDayExercises(selectedDay, data).forEach((ex, i) => {
    const card     = document.getElementById('ex-' + i);
    const skipped  = card.classList.contains('skipped');
    const altName  = card.dataset.altName || null;
    const name     = altName || ex.name;
    const weight   = parseFloat(document.getElementById('w-' + i)?.value) || 0;
    const reps     = parseInt(document.getElementById('r-' + i)?.value)   || phase.repsMin;
    const sets     = parseInt(document.getElementById('s-' + i)?.value)   || phase.sets;
    const rpe      = parseInt(document.getElementById('rpe-' + i)?.value) || 7;

    exercises.push({
      name, skipped, alternative: altName,
      sets: skipped ? [] : Array(sets).fill({ weight, reps, rpe }),
    });
  });

  data.workouts.push({ date: today(), dayType: selectedDay, exercises });
  saveData(data);
  showToast('🎉 Training gespeichert!');
  setTimeout(() => navigate('dashboard'), 1400);
}

// ─── Check-in ─────────────────────────────────────────────────────────────────

function saveCheckin() {
  const data   = loadData();
  const weight = parseFloat(document.getElementById('ci-weight').value);
  if (weight) {
    data.weightLog.push({ date: today(), weight });
  }
  const hip   = parseFloat(document.getElementById('ci-hip').value)   || null;
  const waist = parseFloat(document.getElementById('ci-waist').value) || null;
  const arm   = parseFloat(document.getElementById('ci-arm').value)   || null;
  if (hip || waist || arm) {
    data.measurements.push({ date: today(), hip, waist, arm });
  }
  saveData(data);
  document.getElementById('ci-weight').value = '';
  document.getElementById('ci-hip').value    = '';
  document.getElementById('ci-waist').value  = '';
  document.getElementById('ci-arm').value    = '';
  showToast('✓ Werte gespeichert!');
}

// ─── Statistiken ──────────────────────────────────────────────────────────────

let activeChart = 'weight';
let chartInstance = null;

function renderStats() {
  document.querySelectorAll('.chart-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.chart === activeChart)
  );
  document.querySelectorAll('.chart-view').forEach(v =>
    v.style.display = v.id === 'chart-' + activeChart ? 'block' : 'none'
  );

  const data = loadData();
  if (chartInstance) { chartInstance.destroy(); chartInstance = null; }

  if (activeChart === 'weight')    renderWeightChart(data);
  if (activeChart === 'measures')  renderMeasureChart(data);
  if (activeChart === 'strength')  renderStrengthChart(data);
  if (activeChart === 'heatmap')   renderHeatmap(data);
  if (activeChart === 'volume')    renderVolumeChart(data);
  if (activeChart === 'month')     renderMonthSummary(data);
}

function switchChart(name) {
  activeChart = name;
  renderStats();
}

function renderWeightChart(data) {
  const ctx = document.getElementById('canvas-weight')?.getContext('2d');
  if (!ctx) return;

  const startMs = new Date(START_DATE).getTime();
  const goalMs  = new Date(GOAL_DATE).getTime();
  const daysTotal = (goalMs - startMs) / 86400000;

  // Ziel-Kurve (linear)
  const goalLabels = [], goalData = [];
  for (let d = 0; d <= daysTotal; d += 7) {
    const dt = new Date(startMs + d * 86400000);
    goalLabels.push(dt.toISOString().slice(0, 10));
    goalData.push(+(START_WEIGHT - (START_WEIGHT - GOAL_WEIGHT) * (d / daysTotal)).toFixed(1));
  }

  const weightLabels = data.weightLog.map(w => w.date);
  const weightVals   = data.weightLog.map(w => w.weight);

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: goalLabels,
      datasets: [
        {
          label: 'Ist-Gewicht',
          data: goalLabels.map(l => {
            const i = weightLabels.indexOf(l);
            return i >= 0 ? weightVals[i] : null;
          }),
          borderColor: '#c42e86',
          backgroundColor: 'rgba(196,46,134,.12)',
          tension: .3,
          fill: false,
          pointRadius: 5,
          spanGaps: true,
        },
        {
          label: 'Ziel-Kurve',
          data: goalData,
          borderColor: '#d8c7d2',
          borderDash: [6, 4],
          pointRadius: 0,
          fill: false,
        },
      ],
    },
    options: chartOptions('Gewicht (kg)'),
  });
}

function renderMeasureChart(data) {
  const ctx = document.getElementById('canvas-measures')?.getContext('2d');
  if (!ctx) return;
  if (!data.measurements.length) return;

  const labels = data.measurements.map(m => m.date);
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: 'Hüfte/Po (cm)', data: data.measurements.map(m => m.hip),   borderColor: '#c42e86', backgroundColor: '#c42e86', tension: .3 },
        { label: 'Taille (cm)',   data: data.measurements.map(m => m.waist), borderColor: '#7a1657', backgroundColor: '#7a1657', tension: .3 },
        { label: 'Oberarm (cm)', data: data.measurements.map(m => m.arm),   borderColor: '#0f9d72', backgroundColor: '#0f9d72', tension: .3 },
      ],
    },
    options: chartOptions('Umfang (cm)'),
  });
}

function renderStrengthChart(data) {
  const ctx    = document.getElementById('canvas-strength')?.getContext('2d');
  const picker = document.getElementById('ex-picker');
  if (!ctx || !picker) return;

  // Populate picker once
  if (!picker.dataset.filled) {
    const allEx = new Set();
    data.workouts.forEach(w => w.exercises.forEach(e => { if (!e.skipped) allEx.add(e.name); }));
    picker.innerHTML = [...allEx].map(e => `<option value="${e}">${e}</option>`).join('');
    picker.dataset.filled = '1';
  }

  const chosen = picker.value;
  const pts = data.workouts
    .filter(w => w.exercises.some(e => e.name === chosen && !e.skipped))
    .map(w => {
      const ex = w.exercises.find(e => e.name === chosen);
      const max = Math.max(...ex.sets.map(s => s.weight));
      return { date: w.date, weight: max };
    });

  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: pts.map(p => p.date),
      datasets: [{ label: chosen + ' (kg)', data: pts.map(p => p.weight), backgroundColor: '#c42e86', borderRadius: 6 }],
    },
    options: chartOptions('Maximalgewicht (kg)'),
  });
}

function renderHeatmap(data) {
  const hm = document.getElementById('heatmap-grid');
  if (!hm) return;
  hm.innerHTML = '';

  const trainedDays = new Set(data.workouts.map(w => w.date));
  const todayStr    = today();
  const start = new Date(START_DATE);
  const end   = new Date();

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const ds  = d.toISOString().slice(0, 10);
    const div = document.createElement('div');
    div.className = 'hm-day' +
      (trainedDays.has(ds) ? ' trained' : '') +
      (ds === todayStr ? ' today' : '');
    div.title = ds;
    hm.appendChild(div);
  }
}

function renderVolumeChart(data) {
  const ctx = document.getElementById('canvas-volume')?.getContext('2d');
  if (!ctx) return;

  const weekMap = {};
  data.workouts.forEach(w => {
    const week = 'W' + Math.ceil((new Date(w.date) - new Date(START_DATE)) / 86400000 / 7);
    const vol = w.exercises.reduce((sum, ex) =>
      sum + ex.sets.reduce((s2, set) => s2 + set.weight * set.reps, 0), 0);
    weekMap[week] = (weekMap[week] || 0) + vol;
  });

  const labels = Object.keys(weekMap).sort();
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{ label: 'Volumen (kg×Wdh.)', data: labels.map(l => weekMap[l]), backgroundColor: 'rgba(196,46,134,.55)', borderColor: '#c42e86', borderWidth: 2, borderRadius: 6 }],
    },
    options: chartOptions('Trainingsvolumen'),
  });
}

function renderMonthSummary(data) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);

  const monthWorkouts = data.workouts.filter(w => w.date >= monthStart);
  const monthWeights  = data.weightLog.filter(w => w.date >= monthStart);

  const wLost = monthWeights.length >= 2
    ? +(monthWeights[0].weight - monthWeights[monthWeights.length - 1].weight).toFixed(1)
    : null;

  const firstM = data.measurements.filter(m => m.date >= monthStart)[0];
  const lastM  = data.measurements.filter(m => m.date >= monthStart).pop();
  const poDelta = firstM && lastM && firstM !== lastM ? +(lastM.hip - firstM.hip).toFixed(1) : null;
  const armDelta= firstM && lastM && firstM !== lastM ? +(lastM.arm - firstM.arm).toFixed(1) : null;

  const el = document.getElementById('month-summary-grid');
  if (!el) return;
  el.innerHTML = `
    <div class="summary-item">
      <div class="s-icon">⚖️</div>
      <div class="s-label">Gewicht verloren</div>
      <div class="s-value">${wLost !== null ? wLost + ' kg' : '—'}</div>
      <div class="s-traffic">${trafficLight(wLost, 3, false)}</div>
    </div>
    <div class="summary-item">
      <div class="s-icon">💪</div>
      <div class="s-label">Trainings absolviert</div>
      <div class="s-value">${monthWorkouts.length}</div>
      <div class="s-traffic">${trafficLight(monthWorkouts.length, 12, false)}</div>
    </div>
    <div class="summary-item">
      <div class="s-icon">🍑</div>
      <div class="s-label">Po-Maß Veränderung</div>
      <div class="s-value">${poDelta !== null ? (poDelta > 0 ? '+' : '') + poDelta + ' cm' : '—'}</div>
      <div class="s-traffic">${poDelta !== null ? (poDelta >= 0 ? '🟢' : '🔴') : ''}</div>
    </div>
    <div class="summary-item">
      <div class="s-icon">💪</div>
      <div class="s-label">Arm Veränderung</div>
      <div class="s-value">${armDelta !== null ? (armDelta > 0 ? '+' : '') + armDelta + ' cm' : '—'}</div>
      <div class="s-traffic">${armDelta !== null ? (armDelta <= 0 ? '🟢' : '🔴') : ''}</div>
    </div>
  `;
}

function chartOptions(yLabel) {
  return {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { labels: { font: { size: 12 }, boxWidth: 14 } } },
    scales: {
      y: {
        title: { display: true, text: yLabel, font: { size: 11 } },
        grid: { color: '#f0e8ee' },
      },
      x: { ticks: { maxTicksLimit: 6, font: { size: 10 } }, grid: { display: false } },
    },
  };
}

// ─── Export ───────────────────────────────────────────────────────────────────

function exportData() {
  const data = loadData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `fitness_data_${today()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('✓ Daten exportiert!');
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const parsed = JSON.parse(e.target.result);
      saveData(parsed);
      showToast('✓ Daten importiert!');
      renderDashboard();
    } catch { showToast('Fehler beim Importieren', '#e65100'); }
  };
  reader.readAsText(file);
}

function resetData() {
  if (confirm('Alle Daten löschen? Das kann nicht rückgängig gemacht werden.')) {
    localStorage.removeItem('fitnessData');
    if (window._fbRef) window._fbRef.delete().catch(() => {});
    showToast('Daten gelöscht', '#6b6b6b');
    renderDashboard();
  }
}

// ─── Firebase Sync ────────────────────────────────────────────────────────────

function setSyncStatus(status) {
  const el = document.getElementById('sync-status');
  if (!el) return;
  const icons = { ok: '☁️', syncing: '🔄', offline: '📴', error: '⚠️' };
  el.textContent = icons[status] || '';
  el.title = { ok: 'Cloud-Sync aktiv', syncing: 'Synchronisiere…', offline: 'Offline — Daten lokal gespeichert', error: 'Sync-Fehler' }[status] || '';
}

function initFirebase() {
  const cfg = window.FIREBASE_CONFIG;
  if (!cfg || cfg.apiKey === 'HIER_EINFÜGEN') return;

  try {
    if (!firebase.apps.length) firebase.initializeApp(cfg);
    const db = firebase.firestore();
    window._fbRef = db.collection('fitness').doc('mama');

    setSyncStatus('syncing');

    // Pull initial data from cloud
    window._fbRef.get().then(snap => {
      if (snap.exists) {
        const cloud = snap.data();
        // Only use cloud data if it has valid structure
        if (cloud && Array.isArray(cloud.weightLog)) {
          localStorage.setItem('fitnessData', JSON.stringify(cloud));
          try { renderDashboard(); } catch(e) {}
        }
      }
      setSyncStatus('ok');
    }).catch(() => setSyncStatus('offline'));

    // Real-time listener — syncs across devices instantly
    window._fbRef.onSnapshot(snap => {
      if (!snap.exists) { setSyncStatus('ok'); return; }
      const cloud = snap.data();
      if (!cloud || !Array.isArray(cloud.weightLog)) return;
      localStorage.setItem('fitnessData', JSON.stringify(cloud));
      const active = document.querySelector('.page.active')?.id;
      try {
        if (active === 'page-dashboard') renderDashboard();
        if (active === 'page-stats')     renderStats();
      } catch(e) {}
      setSyncStatus('ok');
    }, () => setSyncStatus('error'));

  } catch (e) {
    setSyncStatus('error');
  }
}

// ─── Bootstrap ────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  // Navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.page));
  });

  // Day selector
  document.querySelectorAll('.day-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedDay = btn.dataset.day;
      updateDaySelector();
      renderExercises();
    });
  });

  // Chart buttons
  document.querySelectorAll('.chart-btn').forEach(btn => {
    btn.addEventListener('click', () => switchChart(btn.dataset.chart));
  });

  // Exercise picker change
  document.getElementById('ex-picker')?.addEventListener('change', () => {
    if (chartInstance) chartInstance.destroy();
    renderStrengthChart(loadData());
  });

  // Firebase (if configured)
  initFirebase();

  // Initial render
  navigate('dashboard');
});
