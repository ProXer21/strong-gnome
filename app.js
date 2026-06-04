'use strict';

// ─── Konstanten ─────────────────────────────────────────────────────────────

const START_DATE   = '2026-06-02';
const GOAL_DATE    = '2026-09-30';
const START_WEIGHT = 82;
const GOAL_WEIGHT  = 70;

// Standard-Routinen (Celinas Plan) — werden als bearbeitbare Vorlage angelegt
const DEFAULT_ROUTINES = [
  { id: 'r_po', name: 'Po & Beine', emoji: '🍑', exercises: [
    { name: 'Hip Thrust',                   tag: 'Po Hauptübung',      sets: 4, repsMin: 10, repsMax: 12 },
    { name: 'Rumänisches Kreuzheben (RDL)', tag: 'Po & Beinrückseite', sets: 4, repsMin: 10, repsMax: 12 },
    { name: 'Einbeinige Beinpresse',        tag: 'Po & Quads',         sets: 3, repsMin: 10, repsMax: 12 },
    { name: 'Abduktoren-Maschine',          tag: 'Po (seitlich)',      sets: 4, repsMin: 12, repsMax: 15 },
    { name: 'Hyperextension',               tag: 'Po & unterer Rücken',sets: 3, repsMin: 12, repsMax: 15 },
  ]},
  { id: 'r_brust', name: 'Brust & Arme', emoji: '💪', exercises: [
    { name: 'Brustpresse',                  tag: 'Brust',              sets: 4, repsMin: 10, repsMax: 12 },
    { name: 'Butterfly',                    tag: 'Brust Isolierung',   sets: 3, repsMin: 12, repsMax: 15 },
    { name: 'Schulterdrücken (Kurzhantel)', tag: 'Schultern',          sets: 3, repsMin: 10, repsMax: 12 },
    { name: 'Seitheben',                    tag: 'Schultern Definition',sets: 3, repsMin: 12, repsMax: 15 },
    { name: 'Trizeps Kabelzug (einarmig)',  tag: 'Arme Definition',    sets: 3, repsMin: 12, repsMax: 15 },
    { name: 'Trizeps Pushdown',             tag: 'Arme Definition',    sets: 3, repsMin: 12, repsMax: 15 },
    { name: 'Around the World',             tag: 'Schultern/Brust',    sets: 3, repsMin: 12, repsMax: 15 },
  ]},
  { id: 'r_ruecken', name: 'Rücken & Bizeps', emoji: '🏋️', exercises: [
    { name: 'Latzug',                       tag: 'Rücken (breit)',     sets: 4, repsMin: 10, repsMax: 12 },
    { name: 'Rudern',                       tag: 'Rücken (Mitte)',     sets: 4, repsMin: 10, repsMax: 12 },
    { name: 'Face Pulls',                   tag: 'hintere Schulter',   sets: 3, repsMin: 12, repsMax: 15 },
    { name: 'Lat Pulldown',                 tag: 'Rücken (breit)',     sets: 3, repsMin: 10, repsMax: 12 },
    { name: 'Reverse Butterfly',            tag: 'hintere Schulter',   sets: 3, repsMin: 12, repsMax: 15 },
    { name: 'Bizeps Kabelzug',              tag: 'Arme Definition',    sets: 3, repsMin: 12, repsMax: 15 },
  ]},
  { id: 'r_cardio', name: 'Cardio + Core', emoji: '🏃', exercises: [
    { name: 'Laufband (zügig gehen)', tag: 'Cardio', sets: 1, repsMin: 1, repsMax: 1 },
    { name: 'Fahrrad-Ergometer',      tag: 'Cardio', sets: 1, repsMin: 1, repsMax: 1 },
    { name: 'Plank',                  tag: 'Core',   sets: 3, repsMin: 1, repsMax: 1 },
    { name: 'Dead Bug',               tag: 'Core',   sets: 3, repsMin: 10, repsMax: 12 },
    { name: 'Bird Dog',               tag: 'Core',   sets: 3, repsMin: 10, repsMax: 12 },
  ]},
];

const ALTERNATIVES = {
  'Hip Thrust':                   ['Glute Bridge (Boden)', 'Beinpresse (Po-Fokus)'],
  'Rumänisches Kreuzheben (RDL)': ['Beinbeuger-Maschine', 'Good Mornings'],
  'Einbeinige Beinpresse':        ['Ausfallschritte', 'Bulgarian Split Squat'],
  'Abduktoren-Maschine':          ['Kabel-Abduktion', 'Band Abduktion (seitlich)'],
  'Hyperextension':               ['Glute Bridge', 'Romanian Deadlift (leicht)'],
  'Brustpresse':                  ['Bankdrücken (Kurzhantel)', 'Liegestütze'],
  'Butterfly':                    ['Kabel-Flys', 'Schrägbank-Flys'],
  'Schulterdrücken (Kurzhantel)': ['Schulterpresse (Maschine)', 'Arnold Press'],
  'Seitheben':                    ['Seitheben (Kabel)', 'Seitheben (Maschine)'],
  'Trizeps Kabelzug (einarmig)':  ['Overhead Extension', 'Trizeps Kickback'],
  'Trizeps Pushdown':             ['Dips (assistiert)', 'Overhead Extension'],
  'Around the World':             ['Frontheben', 'Seitheben (leicht)'],
  'Latzug':                       ['Klimmzüge (assistiert)', 'Kabelzug sitzend'],
  'Rudern':                       ['Kurzhantel-Rudern', 'T-Bar-Rudern'],
  'Face Pulls':                   ['Reverse Butterfly', 'Band Pull-Aparts'],
  'Lat Pulldown':                 ['Latzug (eng)', 'Klimmzüge (assistiert)'],
  'Reverse Butterfly':            ['Face Pulls', 'Reverse Flyes (Kurzhantel)'],
  'Bizeps Kabelzug':              ['Hammer Curls', 'Kurzhantel-Curls'],
  'Laufband (zügig gehen)':       ['Ellipsentrainer', 'Stepper'],
  'Fahrrad-Ergometer':            ['Rudermaschine', 'Crosstrainer'],
  'Plank':                        ['Knie-Plank', 'Unterarm-Plank'],
  'Dead Bug':                     ['Hollow Body Hold', 'Beinsenken (geführt)'],
  'Bird Dog':                     ['Quadruped Hip Extension', 'Superman'],
};

// ─── Daten-Layer ────────────────────────────────────────────────────────────

function uid(prefix) {
  return (prefix || 'id') + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function deepClone(o) { return JSON.parse(JSON.stringify(o)); }

function loadData() {
  let d;
  try { d = JSON.parse(localStorage.getItem('fitnessData') || 'null'); } catch { d = null; }
  if (!d) d = {};

  if (!Array.isArray(d.weightLog))    d.weightLog = [];
  if (!Array.isArray(d.measurements)) d.measurements = [];
  if (!Array.isArray(d.workouts))     d.workouts = [];
  if (!d.settings || typeof d.settings !== 'object') d.settings = {};
  if (d.settings.theme !== 'dark' && d.settings.theme !== 'light') {
    d.settings.theme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  }
  if (typeof d.settings.restDefault !== 'number') d.settings.restDefault = 90;

  // Routinen: aus Vorlage anlegen, falls noch keine vorhanden
  if (!Array.isArray(d.routines) || !d.routines.length) {
    d.routines = deepClone(DEFAULT_ROUTINES).map(r => ({
      ...r,
      exercises: r.exercises.map(e => ({ id: uid('e'), ...e })),
    }));
    // Alte „eigene Übungen" pro Tag (A/B/C/D) übernehmen
    const map = { A: 'r_po', B: 'r_brust', C: 'r_ruecken', D: 'r_cardio' };
    if (d.customExercises && typeof d.customExercises === 'object') {
      Object.keys(map).forEach(k => {
        const list = d.customExercises[k];
        const routine = d.routines.find(r => r.id === map[k]);
        if (Array.isArray(list) && routine) {
          list.forEach(ex => routine.exercises.push({
            id: uid('e'), name: ex.name, tag: ex.tag || 'Eigene Übung', sets: 3, repsMin: 10, repsMax: 12,
          }));
        }
      });
    }
  }
  // jede Routine/Übung absichern
  d.routines.forEach(r => {
    if (!r.id) r.id = uid('r');
    if (!Array.isArray(r.exercises)) r.exercises = [];
    r.exercises.forEach(e => {
      if (!e.id) e.id = uid('e');
      if (typeof e.sets !== 'number') e.sets = 3;
      if (typeof e.repsMin !== 'number') e.repsMin = 10;
      if (typeof e.repsMax !== 'number') e.repsMax = 12;
      if (typeof e.restSec !== 'number') e.restSec = d.settings.restDefault || 90;
    });
  });

  // Übungs-Bibliothek (für Autovervollständigung)
  const lib = new Set(Array.isArray(d.exerciseLibrary) ? d.exerciseLibrary : []);
  d.routines.forEach(r => r.exercises.forEach(e => lib.add(e.name)));
  d.workouts.forEach(w => (w.exercises || []).forEach(e => lib.add(e.name)));
  Object.keys(ALTERNATIVES).forEach(n => lib.add(n));
  d.exerciseLibrary = [...lib].sort((a, b) => a.localeCompare(b, 'de'));

  return d;
}

function saveData(data) {
  localStorage.setItem('fitnessData', JSON.stringify(data));
  if (window._fbRef) window._fbRef.set(data).catch(() => {});
}

// ─── Helfer ───────────────────────────────────────────────────────────────────

function today() { return new Date().toISOString().slice(0, 10); }

function formatRest(sec) {
  sec = Math.max(0, Math.round(sec || 0));
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
}

function weeksRemaining() {
  return Math.max(0, Math.ceil((new Date(GOAL_DATE) - new Date()) / 86400000 / 7));
}

function latestWeight(data) {
  if (!data.weightLog.length) return START_WEIGHT;
  return data.weightLog[data.weightLog.length - 1].weight;
}

function getRoutine(data, id) { return data.routines.find(r => r.id === id) || null; }

// Wann wurde eine Routine zuletzt trainiert?
function lastTrainedDate(data, routineId) {
  for (let i = data.workouts.length - 1; i >= 0; i--) {
    if (data.workouts[i].routineId === routineId) return data.workouts[i].date;
  }
  return null;
}

// Vorschlag: am längsten nicht trainierte Routine
function nextRoutine(data) {
  if (!data.routines.length) return null;
  let best = data.routines[0], bestDate = '9999';
  data.routines.forEach(r => {
    const d = lastTrainedDate(data, r.id) || '0000';
    if (d < bestDate) { bestDate = d; best = r; }
  });
  return best;
}

// Letzte tatsächlich geloggte Einheit einer Übung
function lastExercise(name, data) {
  for (let i = data.workouts.length - 1; i >= 0; i--) {
    const ex = (data.workouts[i].exercises || []).find(e => e.name === name && !e.skipped && e.sets && e.sets.length);
    if (ex) return ex;
  }
  return null;
}

// Wert eines bestimmten Satzes der letzten Einheit (für „Letztes Mal" pro Satz)
function previousSet(name, idx, data) {
  const ex = lastExercise(name, data);
  if (!ex || !ex.sets.length) return null;
  return ex.sets[Math.min(idx, ex.sets.length - 1)];
}

function lastSessionInfo(name, data) {
  const ex = lastExercise(name, data);
  if (!ex) return null;
  const s = ex.sets[ex.sets.length - 1];
  const avg = ex.sets.reduce((a, b) => a + (b.rpe || 7), 0) / ex.sets.length;
  return { weight: s.weight, reps: s.reps, rpe: Math.round(avg) };
}

// Gewichtsempfehlung: schwerster Satz letzte Einheit + Progression nach RPE
function calculateNextWeight(name, data) {
  const ex = lastExercise(name, data);
  if (!ex || !ex.sets.length) return null;
  const top = ex.sets.reduce((m, s) => (s.weight > m.weight ? s : m), ex.sets[0]);
  if (top.weight <= 0) return null;
  const avg = ex.sets.reduce((a, b) => a + (b.rpe || 7), 0) / ex.sets.length;
  if (avg <= 7) return +(top.weight + 2.5).toFixed(1);
  if (avg >= 9) return Math.max(0, +(top.weight - 2.5).toFixed(1));
  return top.weight;
}

function trafficLight(actual, target, lowerIsBetter = false) {
  if (actual === null || actual === undefined || target === null) return '';
  const diff = ((actual - target) / target) * 100;
  if (lowerIsBetter) { if (diff <= -1) return '🟢'; if (diff <= 2) return '🟡'; return '🔴'; }
  if (diff >= 1) return '🟢'; if (diff >= -2) return '🟡'; return '🔴';
}

function showToast(msg, color) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.background = color || '';
  t.classList.add('show');
  clearTimeout(window._toastT);
  window._toastT = setTimeout(() => t.classList.remove('show'), 2500);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

// ─── Theme (Hell / Dunkel) ────────────────────────────────────────────────────

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#16121b' : '#fdf6fb');
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.innerHTML = theme === 'dark'
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg>';
}

function toggleTheme() {
  const data = loadData();
  data.settings.theme = data.settings.theme === 'dark' ? 'light' : 'dark';
  saveData(data);
  applyTheme(data.settings.theme);
}

// ─── Navigation ─────────────────────────────────────────────────────────────

function navigate(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + pageId).classList.add('active');
  document.querySelector(`.nav-btn[data-page="${pageId}"]`).classList.add('active');
  window.scrollTo(0, 0);

  if (pageId === 'dashboard') renderDashboard();
  if (pageId === 'training')  renderTraining();
  if (pageId === 'history')   renderHistory();
  if (pageId === 'stats')     renderStats();
}

// ─── Verlauf ──────────────────────────────────────────────────────────────────

function renderHistory() {
  const data = loadData();
  const list = document.getElementById('history-list');
  list.innerHTML = '';
  if (!data.workouts.length) {
    list.innerHTML = '<div class="empty-state"><div class="es-icon">📅</div><p>Noch keine Workouts. Starte dein erstes Training!</p></div>';
    return;
  }
  // neueste zuerst
  data.workouts.map((w, i) => ({ w, i })).reverse().forEach(({ w, i }) => {
    const totalVol = (w.exercises || []).reduce((sum, ex) =>
      sum + (ex.sets || []).reduce((s2, st) => s2 + (st.weight || 0) * (st.reps || 0), 0), 0);
    const dur = w.durationSec ? `${Math.floor(w.durationSec / 60)} Min` : '—';

    const lines = (w.exercises || []).map(ex => {
      if (ex.skipped) return `<div class="hist-ex"><span>${escapeHtml(ex.name)}</span><span class="he-best">ausgelassen</span></div>`;
      const best = (ex.sets || []).reduce((m, s) => (s.weight > (m?.weight ?? -1) ? s : m), null);
      const bestTxt = best ? `${best.weight} kg × ${best.reps}` : '—';
      return `<div class="hist-ex"><span>${ex.sets.length}× ${escapeHtml(ex.name)}</span><span class="he-best">${bestTxt}</span></div>`;
    }).join('');

    const card = document.createElement('div');
    card.className = 'card hist-card';
    card.innerHTML = `
      <div class="hist-head">
        <div>
          <h3>${escapeHtml(w.routineName || 'Training')}</h3>
          <p class="hist-date">${formatDateDE(w.date)}</p>
        </div>
        <button class="hist-del" onclick="deleteWorkout(${i})" aria-label="Workout löschen">✕</button>
      </div>
      <div class="hist-exs">${lines}</div>
      <div class="hist-foot">
        <span>⏱ ${dur}</span>
        <span>🏋️ ${Math.round(totalVol).toLocaleString('de-DE')} kg</span>
        <span>📋 ${(w.exercises || []).length} Übungen</span>
      </div>`;
    list.appendChild(card);
  });
}

function formatDateDE(iso) {
  try {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
  } catch (e) { return iso; }
}

function deleteWorkout(index) {
  const data = loadData();
  if (index < 0 || index >= data.workouts.length) return;
  const w = data.workouts[index];
  if (!confirm(`Workout „${w.routineName || 'Training'}" vom ${formatDateDE(w.date)} löschen?`)) return;
  data.workouts.splice(index, 1);
  saveData(data);
  showToast('Workout gelöscht', '#6d5a67');
  renderHistory();
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function renderDashboard() {
  const data    = loadData();
  const current = latestWeight(data);
  const lost    = +(START_WEIGHT - current).toFixed(1);
  const total   = START_WEIGHT - GOAL_WEIGHT;
  const pct     = Math.min(100, Math.max(0, Math.round((lost / total) * 100)));

  document.getElementById('current-weight').textContent = current.toFixed(1);
  document.getElementById('weight-lost').textContent    = lost >= 0 ? `-${lost}` : `+${Math.abs(lost)}`;
  document.getElementById('weeks-left').textContent     = weeksRemaining();
  document.getElementById('progress-bar').style.width   = pct + '%';
  document.getElementById('progress-pct').textContent   = pct + '%';
  document.getElementById('progress-start').textContent = START_WEIGHT + ' kg';
  document.getElementById('progress-goal').textContent  = GOAL_WEIGHT + ' kg';
  document.getElementById('weekly-target').textContent  = ((START_WEIGHT - GOAL_WEIGHT) / 17).toFixed(2) + ' kg/Woche Ziel';

  const lastM = data.measurements[data.measurements.length - 1];
  const prevM = data.measurements[data.measurements.length - 2];
  renderMeasureDelta('hip-value',  'hip-delta',  lastM?.hip,  prevM?.hip,  false);
  renderMeasureDelta('waist-value','waist-delta', lastM?.waist,prevM?.waist,true);
  renderMeasureDelta('arm-value',  'arm-delta',   lastM?.arm,  prevM?.arm,  true);

  const routine = nextRoutine(data);
  const nwList = document.getElementById('nw-exercises');
  if (routine) {
    document.getElementById('nw-title').textContent = `${routine.emoji || ''} ${routine.name}`.trim();
    nwList.innerHTML = '';
    routine.exercises.slice(0, 5).forEach(ex => {
      const rec = calculateNextWeight(ex.name, data);
      const div = document.createElement('div');
      div.className = 'nw-exercise';
      div.innerHTML = `<span class="ex-name">${escapeHtml(ex.name)}</span>
        <span class="ex-arrow">→</span>
        <span class="ex-rec">${rec !== null ? rec + ' kg' : ex.sets + '×' + ex.repsMin}</span>`;
      nwList.appendChild(div);
    });
  } else {
    document.getElementById('nw-title').textContent = 'Kein Trainingsplan';
    nwList.innerHTML = '<div class="nw-exercise"><span class="ex-name">Lege im Training einen Trainingsplan an</span></div>';
  }
}

function renderMeasureDelta(valId, deltaId, curr, prev, lowerIsBetter) {
  const valEl = document.getElementById(valId), deltaEl = document.getElementById(deltaId);
  if (!valEl) return;
  if (!curr) { valEl.textContent = '—'; deltaEl.textContent = 'noch kein Wert'; return; }
  valEl.textContent = curr + ' cm';
  if (!prev) { deltaEl.textContent = ''; return; }
  const dd = (curr - prev).toFixed(1);
  const good = lowerIsBetter ? dd <= 0 : dd >= 0;
  deltaEl.textContent = (dd > 0 ? '+' : '') + dd + ' cm';
  deltaEl.className = 'm-delta ' + (good ? 'up' : 'down');
}

// ─── Training: Ansichten ──────────────────────────────────────────────────────
// trainingView: 'list' | 'editor' | 'workout'

let trainingView = 'list';
let editorRoutineId = null;
let session = null;             // aktives Workout (im Speicher)
let currentExerciseForAlt = null;

function renderTraining() {
  if (session) trainingView = 'workout';
  document.getElementById('tv-list').style.display    = trainingView === 'list'    ? 'block' : 'none';
  document.getElementById('tv-editor').style.display  = trainingView === 'editor'  ? 'block' : 'none';
  document.getElementById('tv-workout').style.display = trainingView === 'workout' ? 'block' : 'none';
  if (trainingView === 'list')    renderRoutineList();
  if (trainingView === 'editor')  renderPlanEditor();
  if (trainingView === 'workout') renderActiveWorkout();
}

function showTrainingView(v) { trainingView = v; renderTraining(); }

// ── Routinen-Liste ──
function renderRoutineList() {
  const data = loadData();
  const list = document.getElementById('routine-list');
  list.innerHTML = '';
  if (!data.routines.length) {
    list.innerHTML = '<div class="empty-state"><div class="es-icon">📋</div><p>Noch kein Trainingsplan. Lege deinen ersten an!</p></div>';
  }
  data.routines.forEach(r => {
    const last = lastTrainedDate(data, r.id);
    const card = document.createElement('div');
    card.className = 'routine-card';
    card.innerHTML = `
      <div class="rc-main" onclick="startWorkout('${r.id}')">
        <div class="rc-emoji">${r.emoji || '🏋️'}</div>
        <div class="rc-info">
          <h3>${escapeHtml(r.name)}</h3>
          <p>${r.exercises.length} Übungen${last ? ' · zuletzt ' + last : ' · noch nie'}</p>
        </div>
      </div>
      <div class="rc-actions">
        <button class="rc-edit" onclick="openEditor('${r.id}')" aria-label="Bearbeiten">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
        </button>
        <button class="rc-start" onclick="startWorkout('${r.id}')">▶ Starten</button>
      </div>`;
    list.appendChild(card);
  });
}

function createRoutine() {
  const name = prompt('Name des neuen Trainingsplans (z. B. „Oberkörper"):');
  if (!name || !name.trim()) return;
  const data = loadData();
  const r = { id: uid('r'), name: name.trim(), emoji: '🏋️', exercises: [] };
  data.routines.push(r);
  saveData(data);
  openEditor(r.id);
}

// ── Routine-Editor ──
function openEditor(id) { editorRoutineId = id; showTrainingView('editor'); }

function renderPlanEditor() {
  const data = loadData();
  const r = getRoutine(data, editorRoutineId);
  if (!r) { showTrainingView('list'); return; }

  const title = document.getElementById('editor-title');
  title.textContent = `${r.emoji || '🏋️'} ${r.name}`;

  const body = document.getElementById('editor-body');
  body.innerHTML = '';

  r.exercises.forEach((ex, i) => {
    const row = document.createElement('div');
    row.className = 'editor-ex';
    row.innerHTML = `
      <div class="ee-reorder">
        <button onclick="moveExercise('${ex.id}',-1)" ${i === 0 ? 'disabled' : ''} aria-label="nach oben">▲</button>
        <button onclick="moveExercise('${ex.id}',1)" ${i === r.exercises.length - 1 ? 'disabled' : ''} aria-label="nach unten">▼</button>
      </div>
      <div class="ee-info">
        <h4>${escapeHtml(ex.name)}</h4>
        <div class="ee-fields">
          <label>Sätze<input type="number" min="1" max="10" value="${ex.sets}" onchange="updateExField('${ex.id}','sets',this.value)"></label>
          <label>Wdh<input type="number" min="1" max="50" value="${ex.repsMin}" onchange="updateExField('${ex.id}','repsMin',this.value)"></label>
          <span class="ee-dash">–</span>
          <label class="ee-nolabel"><input type="number" min="1" max="50" value="${ex.repsMax}" onchange="updateExField('${ex.id}','repsMax',this.value)"></label>
        </div>
      </div>
      <button class="ee-remove" onclick="removeExercise('${ex.id}')" aria-label="entfernen">✕</button>`;
    body.appendChild(row);
  });

  const add = document.createElement('button');
  add.className = 'btn-add-ex';
  add.textContent = '+ Übung hinzufügen';
  add.onclick = () => openExModal();
  body.appendChild(add);
}

function updateExField(exId, field, value) {
  const data = loadData();
  const r = getRoutine(data, editorRoutineId);
  const ex = r?.exercises.find(e => e.id === exId);
  if (!ex) return;
  ex[field] = Math.max(1, parseInt(value) || 1);
  if (ex.repsMax < ex.repsMin) ex.repsMax = ex.repsMin;
  saveData(data);
}

function moveExercise(exId, dir) {
  const data = loadData();
  const r = getRoutine(data, editorRoutineId);
  const i = r.exercises.findIndex(e => e.id === exId);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= r.exercises.length) return;
  [r.exercises[i], r.exercises[j]] = [r.exercises[j], r.exercises[i]];
  saveData(data);
  renderPlanEditor();
}

function removeExercise(exId) {
  const data = loadData();
  const r = getRoutine(data, editorRoutineId);
  r.exercises = r.exercises.filter(e => e.id !== exId);
  saveData(data);
  renderPlanEditor();
}

function renameRoutine() {
  const data = loadData();
  const r = getRoutine(data, editorRoutineId);
  if (!r) return;
  const name = prompt('Trainingsplan umbenennen:', r.name);
  if (name && name.trim()) { r.name = name.trim(); saveData(data); renderPlanEditor(); }
}

function deleteRoutine() {
  const data = loadData();
  const r = getRoutine(data, editorRoutineId);
  if (!r) return;
  if (!confirm(`Trainingsplan „${r.name}" wirklich löschen?`)) return;
  data.routines = data.routines.filter(x => x.id !== editorRoutineId);
  saveData(data);
  showToast('Trainingsplan gelöscht', '#6d5a67');
  showTrainingView('list');
}

function duplicateRoutine() {
  const data = loadData();
  const r = getRoutine(data, editorRoutineId);
  if (!r) return;
  const copy = deepClone(r);
  copy.id = uid('r');
  copy.name = r.name + ' (Kopie)';
  copy.exercises.forEach(e => e.id = uid('e'));
  data.routines.push(copy);
  saveData(data);
  showToast('Trainingsplan dupliziert', '#c42e86');
  openEditor(copy.id);
}

// ── Übung-hinzufügen-Modal ──
// mode: 'routine' (Editor) | 'sessionAdd' (Workout) | 'sessionReplace' (Übung ersetzen)
let exModalMode = 'routine';
let exModalTarget = null;

function openExModal(mode, target) {
  exModalMode = mode || 'routine';
  exModalTarget = (target === undefined || target === null) ? null : target;
  const data = loadData();
  const dl = document.getElementById('ex-datalist');
  dl.innerHTML = data.exerciseLibrary.map(n => `<option value="${escapeHtml(n)}"></option>`).join('');
  document.getElementById('ex-input').value = '';
  document.getElementById('ex-sets').value = 3;
  document.getElementById('ex-rmin').value = 10;
  document.getElementById('ex-rmax').value = 12;
  // Felder (Sätze/Wdh) nur bei Neu-Anlage zeigen, beim Ersetzen ausblenden
  const fields = document.querySelector('#ex-modal .modal-fields');
  if (fields) fields.style.display = exModalMode === 'sessionReplace' ? 'none' : 'flex';
  const h = document.querySelector('#ex-modal h3');
  if (h) h.textContent = exModalMode === 'sessionReplace' ? 'Übung ersetzen' : 'Übung hinzufügen';
  document.getElementById('ex-modal').classList.add('open');
  setTimeout(() => document.getElementById('ex-input').focus(), 100);
}
function closeExModal() { document.getElementById('ex-modal').classList.remove('open'); }

function confirmAddExercise() {
  const name = document.getElementById('ex-input').value.trim();
  if (!name) { showToast('Bitte einen Namen eingeben', '#c46a04'); return; }
  const sets    = Math.max(1, parseInt(document.getElementById('ex-sets').value) || 3);
  const repsMin = Math.max(1, parseInt(document.getElementById('ex-rmin').value) || 10);
  const repsMax = Math.max(repsMin, parseInt(document.getElementById('ex-rmax').value) || 12);

  if (exModalMode === 'sessionReplace' && session && exModalTarget !== null) {
    session.exercises[exModalTarget].name = name;
    session.exercises[exModalTarget].alternative = null;
    session.exercises[exModalTarget].skipped = false;
    closeExModal();
    renderActiveWorkout();
    showToast(`Übung ersetzt: ${name}`, '#c42e86');
    return;
  }

  if (exModalMode === 'sessionAdd' && session) {
    const data = loadData();
    const rec = calculateNextWeight(name, data);
    const arr = [];
    for (let i = 0; i < sets; i++) {
      const prev = previousSet(name, i, data);
      arr.push({ weight: rec !== null ? rec : (prev ? prev.weight : ''), reps: prev ? prev.reps : repsMin, done: false });
    }
    session.exercises.push({ exId: null, name, tag: ALTERNATIVES[name] ? '' : 'Eigene Übung', repsMin, repsMax, restSec: data.settings.restDefault || 90, note: '', rpe: 7, skipped: false, alternative: null, sets: arr });
    closeExModal();
    renderActiveWorkout();
    showToast(`✓ „${name}" hinzugefügt`, '#c42e86');
    return;
  }

  // mode 'routine'
  const data = loadData();
  const r = getRoutine(data, editorRoutineId);
  if (!r) return;
  r.exercises.push({ id: uid('e'), name, tag: ALTERNATIVES[name] ? '' : 'Eigene Übung', sets, repsMin, repsMax, restSec: data.settings.restDefault || 90 });
  saveData(data);
  closeExModal();
  renderPlanEditor();
  showToast(`✓ „${name}" hinzugefügt`, '#c42e86');
}

// ─── Aktives Workout (Satz-für-Satz) ───────────────────────────────────────────

function startWorkout(routineId) {
  const data = loadData();
  const r = getRoutine(data, routineId);
  if (!r) return;
  if (!r.exercises.length) { showToast('Dieser Trainingsplan hat noch keine Übungen', '#c46a04'); openEditor(routineId); return; }

  session = {
    routineId: r.id,
    routineName: r.name,
    startTs: null,                 // startet erst nach dem Countdown
    exercises: r.exercises.map(ex => {
      const rec = calculateNextWeight(ex.name, data);
      const sets = [];
      for (let i = 0; i < ex.sets; i++) {
        const prev = previousSet(ex.name, i, data);
        sets.push({
          weight: rec !== null ? rec : (prev ? prev.weight : ''),
          reps:   prev ? prev.reps : ex.repsMin,
          done:   false,
        });
      }
      return { exId: ex.id, name: ex.name, tag: ex.tag, repsMin: ex.repsMin, repsMax: ex.repsMax, restSec: ex.restSec || (data.settings.restDefault || 90), note: '', rpe: 7, skipped: false, alternative: null, sets };
    }),
  };
  showWorkoutIntro(r);
}

// ── Start-Bildschirm („Bereit?") — gibt dem Trainingsstart Gewicht ──
function showWorkoutIntro(r) {
  const totalSets = session.exercises.reduce((a, e) => a + e.sets.length, 0);
  document.getElementById('intro-emoji').textContent = r.emoji || '🏋️';
  document.getElementById('intro-name').textContent = r.name;
  document.getElementById('intro-meta').textContent =
    `${r.exercises.length} Übungen · ${totalSets} Sätze · ca. ${Math.max(15, Math.round(totalSets * 2.5))} Min`;
  document.getElementById('workout-intro').classList.add('show');
}

function cancelIntro() {
  document.getElementById('workout-intro').classList.remove('show');
  session = null;
}

function beginWorkout() {
  document.getElementById('workout-intro').classList.remove('show');
  if (!session) return;
  // Audio im User-Gesture entsperren (für die Countdown-Sounds)
  try { const c = audioCtx(); if (c && c.state === 'suspended') c.resume(); } catch (e) {}
  navigate('training');
  showTrainingView('workout');
  runCountdown(() => {
    session.startTs = Date.now();
    startSessionTimer();
  });
}

// 3 · 2 · 1 · LOS — cinematischer Countdown (antippen = überspringen)
function runCountdown(cb) {
  const el    = document.getElementById('countdown');
  const num   = document.getElementById('countdown-num');
  const ring  = el.querySelector('.cd-ring');
  const flash = el.querySelector('.cd-flash');
  let n = 3, done = false;

  const resetNum = () => num.classList.remove('slam', 'is-force', 'force-anim');

  const finish = () => {
    if (done) return;
    done = true;
    clearTimeout(window._cdT);
    el.onclick = null;
    el.classList.add('exit');         // Overlay zoomt weg
    revealWorkout();                  // Trainingsplan steigt gestaffelt ein
    cb();                             // Timer startet
    window._cdEnd = setTimeout(() => { el.classList.remove('show', 'shake', 'exit'); }, 640);
  };
  el.onclick = finish;
  el.classList.add('show');

  const tick = () => {
    if (done) return;

    if (n <= 0) {
      // Finale: fitness-Star-Wars-Spruch statt „LOS!"
      resetNum();
      num.textContent = 'MÖGE DIE KRAFT MIT DIR SEIN';
      ring.classList.remove('go'); el.classList.remove('shake');
      void num.offsetWidth;
      num.classList.add('is-force', 'force-anim');
      ring.classList.add('go'); el.classList.add('shake');
      flash.classList.remove('on'); void flash.offsetWidth; flash.classList.add('on');
      playGo();
      try { if (navigator.vibrate) navigator.vibrate([0, 110, 60, 110, 60, 320]); } catch (e) {}
      window._cdT = setTimeout(finish, 1700);
      return;
    }

    // Countdown-Zahl
    resetNum();
    num.textContent = String(n);
    ring.classList.remove('go'); el.classList.remove('shake');
    void num.offsetWidth;
    num.classList.add('slam'); ring.classList.add('go'); el.classList.add('shake');
    playThud(140 + (3 - n) * 28);
    try { if (navigator.vibrate) navigator.vibrate(130 + (3 - n) * 45); } catch (e) {}
    n--;
    window._cdT = setTimeout(tick, 820);
  };
  tick();
}

// Trainingsplan gestaffelt einblenden (coole Transition nach dem Countdown)
function revealWorkout() {
  const w = document.getElementById('tv-workout');
  if (!w) return;
  w.classList.remove('reveal');
  void w.offsetWidth;
  w.classList.add('reveal');
  setTimeout(() => w.classList.remove('reveal'), 1400);
}

// ─── Sound-Effekte (Web Audio) ────────────────────────────────────────────────

function audioCtx() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  window._ac = window._ac || new AC();
  return window._ac;
}

// tiefer Impact-„Boom" pro Countdown-Zahl
function playThud(freq) {
  const c = audioCtx(); if (!c) return;
  const t = c.currentTime;
  const o = c.createOscillator(), g = c.createGain();
  o.type = 'triangle';
  o.frequency.setValueAtTime(freq, t);
  o.frequency.exponentialRampToValueAtTime(Math.max(40, freq * 0.4), t + 0.35);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.55, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
  o.connect(g); g.connect(c.destination);
  o.start(t); o.stop(t + 0.45);
}

// triumphaler Akkord beim „LOS!"
function playGo() {
  const c = audioCtx(); if (!c) return;
  const t = c.currentTime;
  [392, 523, 659, 784, 1047].forEach((f, i) => {
    const o = c.createOscillator(), g = c.createGain();
    o.type = 'sawtooth';
    o.frequency.value = f;
    const st = t + i * 0.025;
    g.gain.setValueAtTime(0.0001, st);
    g.gain.exponentialRampToValueAtTime(0.3, st + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
    o.connect(g); g.connect(c.destination);
    o.start(st); o.stop(t + 0.75);
  });
}

function startSessionTimer() {
  clearInterval(window._sessTimer);
  window._sessTimer = setInterval(() => {
    const el = document.getElementById('wb-timer');
    if (!el || !session) return;
    const s = Math.floor((Date.now() - session.startTs) / 1000);
    el.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }, 1000);
}

function renderActiveWorkout() {
  if (!session) { showTrainingView('list'); return; }
  const data = loadData();
  document.getElementById('wb-title').textContent = session.routineName;

  const body = document.getElementById('workout-body');
  body.innerHTML = '';

  session.exercises.forEach((ex, ei) => {
    const card = document.createElement('div');
    card.className = 'exercise-entry workout-ex' + (ex.skipped ? ' skipped' : '');

    const restLine = ex.restSec > 0
      ? `<div class="rest-line"><span>⏱ ${formatRest(ex.restSec)}</span></div>` : '';

    const rows = ex.sets.map((set, si) => {
      const prev = previousSet(ex.name, si, data);
      const prevTxt = prev ? `${prev.weight}kg × ${prev.reps}` : '—';
      return `
        <div class="set-wrap">
          <button class="set-delete" onclick="removeSet(${ei},${si})" aria-label="Satz löschen">Löschen</button>
          <div class="set-row${set.done ? ' done' : ''}" id="set-${ei}-${si}">
            <span class="sr-num">${si + 1}</span>
            <span class="sr-prev">${prevTxt}</span>
            <input class="sr-input" type="number" inputmode="decimal" step="0.5" min="0" value="${set.weight}"
              placeholder="kg" oninput="setVal(${ei},${si},'weight',this.value)" aria-label="Gewicht Satz ${si + 1}">
            <input class="sr-input" type="number" inputmode="numeric" min="0" value="${set.reps}"
              placeholder="Wdh" oninput="setVal(${ei},${si},'reps',this.value)" aria-label="Wiederholungen Satz ${si + 1}">
            <button class="sr-check" onclick="toggleSet(${ei},${si})" aria-label="Satz erledigt">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </button>
          </div>
        </div>${restLine}`;
    }).join('');

    card.innerHTML = `
      <div class="ex-header">
        <div class="ex-info">
          <h3>${escapeHtml(ex.name)}${ex.alternative ? ' <span class="custom-tag">Alt</span>' : ''}</h3>
          <p>Ziel: ${ex.repsMin}–${ex.repsMax} Wdh.${ex.tag ? ' · ' + escapeHtml(ex.tag) : ''}</p>
        </div>
        <button class="ex-menu-btn" onclick="openExMenu(${ei})" aria-label="Übungs-Menü">
          <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
        </button>
      </div>
      ${ex.note ? `<div class="ex-note">📝 ${escapeHtml(ex.note)}</div>` : ''}
      <div class="set-head"><span>Satz</span><span>Letztes&nbsp;Mal</span><span>kg</span><span>Wdh</span><span></span></div>
      <div class="set-rows">${rows}</div>
      <button class="btn-add-set" onclick="addSet(${ei})">+ Satz</button>
      <div class="rpe-row">
        <label>Anstrengung</label>
        <input type="range" min="1" max="10" value="${ex.rpe}" class="rpe-slider" id="wrpe-${ei}"
          oninput="session.exercises[${ei}].rpe=+this.value; document.getElementById('wrpev-${ei}').textContent=this.value">
        <span class="rpe-value" id="wrpev-${ei}">${ex.rpe}</span>
      </div>`;
    body.appendChild(card);
  });

  // "+ Übung hinzufügen" am Ende der Session
  const addEx = document.createElement('button');
  addEx.className = 'btn-add-ex';
  addEx.textContent = '+ Übung hinzufügen';
  addEx.onclick = () => openExModal('sessionAdd');
  body.appendChild(addEx);

  attachSetSwipe();
}

// ─── Übungs-Menü („…") im aktiven Workout ─────────────────────────────────────

let exMenuTarget = null;

function openExMenu(ei) {
  if (!session) return;
  exMenuTarget = ei;
  const ex = session.exercises[ei];
  document.getElementById('exmenu-title').textContent = ex.name;
  document.getElementById('exmenu-modal').classList.add('open');
}
function closeExMenu() { document.getElementById('exmenu-modal').classList.remove('open'); exMenuTarget = null; }

function menuReplace() {
  const ei = exMenuTarget; closeExMenu();
  openExModal('sessionReplace', ei);
}
function menuAlternative() {
  const ei = exMenuTarget; closeExMenu();
  openAltModal(ei, session.exercises[ei].name);
}
function menuNote() {
  const ei = exMenuTarget;
  const ex = session.exercises[ei];
  closeExMenu();
  const note = prompt('Notiz zur Übung:', ex.note || '');
  if (note === null) return;
  ex.note = note.trim();
  renderActiveWorkout();
}
function menuRemove() {
  const ei = exMenuTarget; closeExMenu();
  if (!confirm(`„${session.exercises[ei].name}" aus diesem Training entfernen?`)) return;
  session.exercises.splice(ei, 1);
  renderActiveWorkout();
}
function menuRest() {
  // wechselt zum Pausenzeit-Auswahl-Sheet
  document.getElementById('exmenu-modal').classList.remove('open');
  const ex = session.exercises[exMenuTarget];
  document.getElementById('rest-sheet-title').textContent = `Pause · ${ex.name}`;
  document.querySelectorAll('#rest-sheet .rest-opt').forEach(b =>
    b.classList.toggle('sel', parseInt(b.dataset.sec) === ex.restSec));
  document.getElementById('rest-sheet').classList.add('open');
}
function closeRestSheet() { document.getElementById('rest-sheet').classList.remove('open'); }

function setExerciseRest(sec) {
  if (exMenuTarget === null || !session) { closeRestSheet(); return; }
  const ex = session.exercises[exMenuTarget];
  ex.restSec = sec;
  // dauerhaft in der Routine merken (falls aus Routine gestartet)
  if (session.routineId && ex.exId) {
    const data = loadData();
    const r = getRoutine(data, session.routineId);
    const re = r?.exercises.find(e => e.id === ex.exId);
    if (re) { re.restSec = sec; saveData(data); }
  }
  closeRestSheet();
  exMenuTarget = null;
  renderActiveWorkout();
}

// Satz-Zeilen: nach links wischen → roter „Löschen"-Button
function closeAllSwipes(except) {
  document.querySelectorAll('.set-wrap.open').forEach(w => {
    if (w === except) return;
    w.classList.remove('open');
    const r = w.querySelector('.set-row');
    if (r) r.style.transform = '';
  });
}

function attachSetSwipe() {
  const OPEN = -88;
  document.querySelectorAll('.set-wrap').forEach(wrap => {
    const row = wrap.querySelector('.set-row');
    if (!row) return;
    let sx = 0, sy = 0, dx = 0, decided = false, horiz = false, active = false;

    row.addEventListener('touchstart', e => {
      const t = e.touches[0];
      sx = t.clientX; sy = t.clientY; dx = 0;
      decided = false; horiz = false; active = true;
      row.style.transition = 'none';
      closeAllSwipes(wrap);
    }, { passive: true });

    row.addEventListener('touchmove', e => {
      if (!active) return;
      const t = e.touches[0];
      const mx = t.clientX - sx, my = t.clientY - sy;
      if (!decided && (Math.abs(mx) > 8 || Math.abs(my) > 8)) {
        decided = true; horiz = Math.abs(mx) > Math.abs(my);
      }
      if (horiz) {
        e.preventDefault();
        dx = Math.max(-110, Math.min(0, mx));
        row.style.transform = `translateX(${dx}px)`;
      }
    }, { passive: false });

    const end = () => {
      if (!active) return;
      active = false;
      row.style.transition = 'transform .2s ease';
      if (horiz && dx < OPEN / 2) {
        row.style.transform = `translateX(${OPEN}px)`;
        wrap.classList.add('open');
      } else {
        row.style.transform = '';
        wrap.classList.remove('open');
      }
    };
    row.addEventListener('touchend', end);
    row.addEventListener('touchcancel', end);
  });
}

function removeSet(ei, si) {
  if (!session) return;
  session.exercises[ei].sets.splice(si, 1);
  renderActiveWorkout();
}

function setVal(ei, si, field, value) {
  if (!session) return;
  session.exercises[ei].sets[si][field] = field === 'weight' ? (parseFloat(value) || 0) : (parseInt(value) || 0);
}

function toggleSet(ei, si) {
  if (!session) return;
  const ex = session.exercises[ei];
  const set = ex.sets[si];
  set.done = !set.done;
  const row = document.getElementById(`set-${ei}-${si}`);
  if (row) row.classList.toggle('done', set.done);
  if (set.done && ex.restSec > 0) startRest(ex.restSec);
}

function addSet(ei) {
  if (!session) return;
  const ex = session.exercises[ei];
  const last = ex.sets[ex.sets.length - 1];
  ex.sets.push({ weight: last ? last.weight : '', reps: last ? last.reps : ex.repsMin, done: false });
  renderActiveWorkout();
}

function finishWorkout() {
  if (!session) return;
  const data = loadData();
  const exercises = [];
  session.exercises.forEach(ex => {
    if (ex.skipped) { exercises.push({ name: ex.name, tag: ex.tag, skipped: true, alternative: ex.alternative, note: ex.note || '', sets: [] }); return; }
    const doneSets = ex.sets.filter(s => s.done).map(s => ({ weight: s.weight || 0, reps: s.reps || 0, rpe: ex.rpe }));
    if (doneSets.length) exercises.push({ name: ex.name, tag: ex.tag, skipped: false, alternative: ex.alternative, note: ex.note || '', sets: doneSets });
  });

  if (!exercises.some(e => !e.skipped && e.sets.length)) {
    if (!confirm('Du hast noch keinen Satz abgehakt. Training trotzdem beenden (wird nicht gespeichert)?')) return;
    session = null;
    clearInterval(window._sessTimer);
    showTrainingView('list');
    return;
  }

  data.workouts.push({
    date: today(),
    durationSec: Math.floor((Date.now() - session.startTs) / 1000),
    routineId: session.routineId,
    routineName: session.routineName,
    exercises,
  });
  saveData(data);
  session = null;
  clearInterval(window._sessTimer);
  stopRest(false);
  showToast('🎉 Training gespeichert!');
  setTimeout(() => navigate('dashboard'), 1200);
}

function cancelWorkout() {
  if (!session) { showTrainingView('list'); return; }
  if (!confirm('Training abbrechen? Eingaben gehen verloren.')) return;
  session = null;
  clearInterval(window._sessTimer);
  stopRest(false);
  showTrainingView('list');
}

// Leeres Workout ohne Plan starten — Übungen werden während des Trainings hinzugefügt
function startEmptyWorkout() {
  session = { routineId: null, routineName: 'Freies Training', startTs: Date.now(), exercises: [] };
  startSessionTimer();
  showTrainingView('workout');
  openExModal('sessionAdd');
}

// ── Alternativen-Modal ──
function openAltModal(ei, exerciseName) {
  currentExerciseForAlt = { ei, exerciseName };
  const alts = ALTERNATIVES[exerciseName] || [];
  document.getElementById('alt-ex-name').textContent = exerciseName;
  document.getElementById('alt-options').innerHTML = alts.length
    ? alts.map((a, i) => `<button class="alt-btn" onclick="chooseAlternative(${i})">${escapeHtml(a)}</button>`).join('')
    : '<p style="color:var(--text-muted);font-size:14px">Keine Alternative hinterlegt.</p>';
  document.getElementById('alt-modal').classList.add('open');
}
function chooseAlternative(altIdx) {
  if (!currentExerciseForAlt) return;
  const { ei, exerciseName } = currentExerciseForAlt;
  const alt = ALTERNATIVES[exerciseName]?.[altIdx];
  if (alt && session) {
    session.exercises[ei].alternative = exerciseName;
    session.exercises[ei].name = alt;
    session.exercises[ei].skipped = false;
  }
  closeAltModal();
  renderActiveWorkout();
  showToast(`Alternative: ${alt}`, '#c42e86');
}
function skipExercise() {
  if (!currentExerciseForAlt || !session) return;
  session.exercises[currentExerciseForAlt.ei].skipped = true;
  closeAltModal();
  renderActiveWorkout();
  showToast('Übung übersprungen', '#6d5a67');
}
function closeAltModal() { document.getElementById('alt-modal').classList.remove('open'); currentExerciseForAlt = null; }

// ─── Rest-Timer ─────────────────────────────────────────────────────────────

let rest = { id: null, remaining: 0 };

function startRest(sec) {
  rest.remaining = sec || loadData().settings.restDefault || 90;
  document.getElementById('rest-timer').classList.add('show');
  updateRestBar();
  clearInterval(rest.id);
  rest.id = setInterval(() => {
    rest.remaining--;
    updateRestBar();
    if (rest.remaining <= 0) stopRest(true);
  }, 1000);
}
function updateRestBar() {
  const m = Math.max(0, Math.floor(rest.remaining / 60));
  const s = Math.max(0, rest.remaining % 60);
  const el = document.getElementById('rest-time');
  if (el) el.textContent = `${m}:${String(s).padStart(2, '0')}`;
}
function adjustRest(delta) { rest.remaining = Math.max(5, rest.remaining + delta); updateRestBar(); }
function skipRest() { stopRest(false); }
function stopRest(finished) {
  clearInterval(rest.id); rest.id = null;
  const bar = document.getElementById('rest-timer');
  if (bar) bar.classList.remove('show');
  if (finished) {
    try { if (navigator.vibrate) navigator.vibrate(400); } catch (e) {}
    beep();
  }
}
function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = 'sine'; o.frequency.value = 880;
    g.gain.setValueAtTime(0.001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    o.start(); o.stop(ctx.currentTime + 0.42);
  } catch (e) {}
}

// ─── Check-in ─────────────────────────────────────────────────────────────────

function saveCheckin() {
  const data = loadData();
  const weight = parseFloat(document.getElementById('ci-weight').value);
  if (weight) data.weightLog.push({ date: today(), weight });
  const hip   = parseFloat(document.getElementById('ci-hip').value)   || null;
  const waist = parseFloat(document.getElementById('ci-waist').value) || null;
  const arm   = parseFloat(document.getElementById('ci-arm').value)   || null;
  if (hip || waist || arm) data.measurements.push({ date: today(), hip, waist, arm });
  saveData(data);
  ['ci-weight', 'ci-hip', 'ci-waist', 'ci-arm'].forEach(id => document.getElementById(id).value = '');
  showToast('✓ Werte gespeichert!');
}

// ─── Statistiken ──────────────────────────────────────────────────────────────

let activeChart = 'weight';
let chartInstance = null;

function renderStats() {
  document.querySelectorAll('.chart-btn').forEach(b => b.classList.toggle('active', b.dataset.chart === activeChart));
  document.querySelectorAll('.chart-view').forEach(v => v.style.display = v.id === 'chart-' + activeChart ? 'block' : 'none');
  const data = loadData();
  if (chartInstance) { chartInstance.destroy(); chartInstance = null; }
  if (activeChart === 'weight')   renderWeightChart(data);
  if (activeChart === 'measures') renderMeasureChart(data);
  if (activeChart === 'strength') renderStrengthChart(data);
  if (activeChart === 'heatmap')  renderHeatmap(data);
  if (activeChart === 'volume')   renderVolumeChart(data);
  if (activeChart === 'month')    renderMonthSummary(data);
}
function switchChart(name) { activeChart = name; renderStats(); }

function renderWeightChart(data) {
  const ctx = document.getElementById('canvas-weight')?.getContext('2d');
  if (!ctx) return;
  const startMs = new Date(START_DATE).getTime(), goalMs = new Date(GOAL_DATE).getTime();
  const daysTotal = (goalMs - startMs) / 86400000;
  const goalLabels = [], goalData = [];
  for (let d = 0; d <= daysTotal; d += 7) {
    goalLabels.push(new Date(startMs + d * 86400000).toISOString().slice(0, 10));
    goalData.push(+(START_WEIGHT - (START_WEIGHT - GOAL_WEIGHT) * (d / daysTotal)).toFixed(1));
  }
  const wl = data.weightLog.map(w => w.date), wv = data.weightLog.map(w => w.weight);
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: { labels: goalLabels, datasets: [
      { label: 'Ist-Gewicht', data: goalLabels.map(l => { const i = wl.indexOf(l); return i >= 0 ? wv[i] : null; }),
        borderColor: '#c42e86', backgroundColor: 'rgba(196,46,134,.12)', tension: .3, fill: false, pointRadius: 5, spanGaps: true },
      { label: 'Ziel-Kurve', data: goalData, borderColor: '#d8c7d2', borderDash: [6, 4], pointRadius: 0, fill: false },
    ]},
    options: chartOptions('Gewicht (kg)'),
  });
}
function renderMeasureChart(data) {
  const ctx = document.getElementById('canvas-measures')?.getContext('2d');
  if (!ctx || !data.measurements.length) return;
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: { labels: data.measurements.map(m => m.date), datasets: [
      { label: 'Hüfte/Po (cm)', data: data.measurements.map(m => m.hip),   borderColor: '#c42e86', backgroundColor: '#c42e86', tension: .3 },
      { label: 'Taille (cm)',   data: data.measurements.map(m => m.waist), borderColor: '#7a1657', backgroundColor: '#7a1657', tension: .3 },
      { label: 'Oberarm (cm)',  data: data.measurements.map(m => m.arm),   borderColor: '#0f9d72', backgroundColor: '#0f9d72', tension: .3 },
    ]},
    options: chartOptions('Umfang (cm)'),
  });
}
function renderStrengthChart(data) {
  const ctx = document.getElementById('canvas-strength')?.getContext('2d');
  const picker = document.getElementById('ex-picker');
  if (!ctx || !picker) return;
  const allEx = new Set();
  data.workouts.forEach(w => (w.exercises || []).forEach(e => { if (!e.skipped && e.sets?.length) allEx.add(e.name); }));
  const names = [...allEx];
  picker.innerHTML = names.map(e => `<option value="${escapeHtml(e)}">${escapeHtml(e)}</option>`).join('');
  if (!names.length) { return; }
  const chosen = picker.value || names[0];
  const pts = data.workouts
    .filter(w => (w.exercises || []).some(e => e.name === chosen && !e.skipped && e.sets?.length))
    .map(w => { const ex = w.exercises.find(e => e.name === chosen); return { date: w.date, weight: Math.max(...ex.sets.map(s => s.weight)) }; });
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: { labels: pts.map(p => p.date), datasets: [{ label: chosen + ' (kg)', data: pts.map(p => p.weight), backgroundColor: '#c42e86', borderRadius: 6 }] },
    options: chartOptions('Maximalgewicht (kg)'),
  });
}
function renderHeatmap(data) {
  const hm = document.getElementById('heatmap-grid');
  if (!hm) return;
  hm.innerHTML = '';
  const trained = new Set(data.workouts.map(w => w.date));
  const todayStr = today(), start = new Date(START_DATE), end = new Date();
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const ds = d.toISOString().slice(0, 10);
    const div = document.createElement('div');
    div.className = 'hm-day' + (trained.has(ds) ? ' trained' : '') + (ds === todayStr ? ' today' : '');
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
    const vol = (w.exercises || []).reduce((sum, ex) => sum + (ex.sets || []).reduce((s2, set) => s2 + (set.weight || 0) * (set.reps || 0), 0), 0);
    weekMap[week] = (weekMap[week] || 0) + vol;
  });
  const labels = Object.keys(weekMap).sort();
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Volumen (kg×Wdh.)', data: labels.map(l => weekMap[l]), backgroundColor: 'rgba(196,46,134,.55)', borderColor: '#c42e86', borderWidth: 2, borderRadius: 6 }] },
    options: chartOptions('Trainingsvolumen'),
  });
}
function renderMonthSummary(data) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const monthWorkouts = data.workouts.filter(w => w.date >= monthStart);
  const monthWeights  = data.weightLog.filter(w => w.date >= monthStart);
  const wLost = monthWeights.length >= 2 ? +(monthWeights[0].weight - monthWeights[monthWeights.length - 1].weight).toFixed(1) : null;
  const ms = data.measurements.filter(m => m.date >= monthStart);
  const firstM = ms[0], lastM = ms[ms.length - 1];
  const poDelta  = firstM && lastM && firstM !== lastM ? +(lastM.hip - firstM.hip).toFixed(1) : null;
  const armDelta = firstM && lastM && firstM !== lastM ? +(lastM.arm - firstM.arm).toFixed(1) : null;
  const el = document.getElementById('month-summary-grid');
  if (!el) return;
  el.innerHTML = `
    <div class="summary-item"><div class="s-icon">⚖️</div><div class="s-label">Gewicht verloren</div><div class="s-value">${wLost !== null ? wLost + ' kg' : '—'}</div><div class="s-traffic">${trafficLight(wLost, 3, false)}</div></div>
    <div class="summary-item"><div class="s-icon">💪</div><div class="s-label">Trainings absolviert</div><div class="s-value">${monthWorkouts.length}</div><div class="s-traffic">${trafficLight(monthWorkouts.length, 12, false)}</div></div>
    <div class="summary-item"><div class="s-icon">🍑</div><div class="s-label">Po-Maß Veränderung</div><div class="s-value">${poDelta !== null ? (poDelta > 0 ? '+' : '') + poDelta + ' cm' : '—'}</div><div class="s-traffic">${poDelta !== null ? (poDelta >= 0 ? '🟢' : '🔴') : ''}</div></div>
    <div class="summary-item"><div class="s-icon">💪</div><div class="s-label">Arm Veränderung</div><div class="s-value">${armDelta !== null ? (armDelta > 0 ? '+' : '') + armDelta + ' cm' : '—'}</div><div class="s-traffic">${armDelta !== null ? (armDelta <= 0 ? '🟢' : '🔴') : ''}</div></div>`;
}
function chartOptions(yLabel) {
  const grid = getComputedStyle(document.documentElement).getPropertyValue('--chart-grid').trim() || '#f0e8ee';
  const tick = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#6d5a67';
  return {
    responsive: true, maintainAspectRatio: true,
    plugins: { legend: { labels: { color: tick, font: { size: 12 }, boxWidth: 14 } } },
    scales: {
      y: { title: { display: true, text: yLabel, color: tick, font: { size: 11 } }, grid: { color: grid }, ticks: { color: tick } },
      x: { ticks: { maxTicksLimit: 6, color: tick, font: { size: 10 } }, grid: { display: false } },
    },
  };
}

// ─── Export / Import ────────────────────────────────────────────────────────

function exportData() {
  const blob = new Blob([JSON.stringify(loadData(), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `fitness_data_${today()}.json`; a.click();
  URL.revokeObjectURL(url);
  showToast('✓ Daten exportiert!');
}
function importData(file) {
  const reader = new FileReader();
  reader.onload = e => {
    try { saveData(JSON.parse(e.target.result)); showToast('✓ Daten importiert!'); renderDashboard(); }
    catch { showToast('Fehler beim Importieren', '#c46a04'); }
  };
  reader.readAsText(file);
}

// ─── Firebase Sync ────────────────────────────────────────────────────────────

function setSyncStatus(status) {
  const el = document.getElementById('sync-status');
  if (!el) return;
  el.textContent = { ok: '☁️', syncing: '🔄', offline: '📴', error: '⚠️' }[status] || '';
  el.title = { ok: 'Cloud-Sync aktiv', syncing: 'Synchronisiere…', offline: 'Offline — lokal gespeichert', error: 'Sync-Fehler' }[status] || '';
}
function initFirebase() {
  const cfg = window.FIREBASE_CONFIG;
  if (!cfg || cfg.apiKey === 'HIER_EINFÜGEN') return;
  try {
    if (!firebase.apps.length) firebase.initializeApp(cfg);
    const db = firebase.firestore();
    window._fbRef = db.collection('fitness').doc('mama');
    setSyncStatus('syncing');
    window._fbRef.get().then(snap => {
      if (snap.exists) {
        const cloud = snap.data();
        if (cloud && Array.isArray(cloud.weightLog)) {
          localStorage.setItem('fitnessData', JSON.stringify(cloud));
          try { renderDashboard(); } catch (e) {}
        }
      }
      setSyncStatus('ok');
    }).catch(() => setSyncStatus('offline'));
    window._fbRef.onSnapshot(snap => {
      if (!snap.exists) { setSyncStatus('ok'); return; }
      const cloud = snap.data();
      if (!cloud || !Array.isArray(cloud.weightLog)) return;
      localStorage.setItem('fitnessData', JSON.stringify(cloud));
      const active = document.querySelector('.page.active')?.id;
      try {
        if (active === 'page-dashboard') renderDashboard();
        if (active === 'page-stats') renderStats();
        if (active === 'page-history') renderHistory();
        if (active === 'page-training' && trainingView === 'list') renderRoutineList();
      } catch (e) {}
      setSyncStatus('ok');
    }, () => setSyncStatus('error'));
  } catch (e) { setSyncStatus('error'); }
}

// ─── Bootstrap ────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  applyTheme(loadData().settings.theme);

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});

  document.querySelectorAll('.nav-btn').forEach(btn =>
    btn.addEventListener('click', () => navigate(btn.dataset.page)));

  document.querySelectorAll('.chart-btn').forEach(btn =>
    btn.addEventListener('click', () => switchChart(btn.dataset.chart)));

  document.getElementById('ex-picker')?.addEventListener('change', () => {
    if (chartInstance) chartInstance.destroy();
    renderStrengthChart(loadData());
  });

  const tt = document.getElementById('theme-toggle');
  if (tt) tt.addEventListener('click', toggleTheme);

  initFirebase();
  navigate('dashboard');
});
