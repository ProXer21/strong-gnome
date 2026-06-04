# 🧙‍♂️ Strong Gnome — Fitness Tracker PWA

> Klein, aber bärenstark. Ein kostenloser, mehrbenutzerfähiger Fitness-Tracker als
> installierbare Progressive Web App (PWA). Trainingspläne, Satz-für-Satz-Tracking,
> Statistiken, Freunde, Gruppentraining — alles ohne laufende Kosten.

**Live:** https://proxer21.github.io/strong-gnome/
**Version:** v1.0.0 (Build 40)
**Stack:** Vanilla JS · Firebase (Auth + Firestore) · Chart.js · EmailJS · GitHub Pages

---

## ✨ Features (v1.0.0)

| Bereich | Was es kann |
|---------|-------------|
| 🏋️ **Training** | Eigene Trainingspläne (frei anlegen, umsortieren), Satz-für-Satz-Tracking (Gewicht/Wdh/erledigt), Rest-Timer mit Vibration + Sound, Übung ersetzen/Alternative/Notiz, leeres Workout |
| 📊 **Statistiken** | Gewichtsverlauf vs. Zielkurve, Körpermaße, Kraftentwicklung pro Übung, Konsistenz-Heatmap, Wochenvolumen, Monatscheck |
| 📅 **Verlauf** | Alle Workouts, antippbar → Detailansicht (Sätze, geschätztes 1RM, Dauer/Volumen/PRs) + „Erneut ausführen" |
| ⚖️ **Check-in** | Gewicht + 9 Körpermaße, Frequenz frei wählbar (täglich/wöchentlich/monatlich), 2 Nachkommastellen |
| 👤 **Profil** | Name/Start-/Zielgewicht/-datum, Design- & Pausenzeit-Wahl, Freundes-Code, Daten-Export/Import, Konto zurücksetzen |
| 🎨 **3 Designs** | Rosé hell · Rosé dunkel · Maskulin (düster mit Stahlblau-Aura). Cinematischer Trainingsstart (Countdown + „Möge die Kraft mit dir sein" + Blitz-Button), Theme-bewusst |
| 👥 **Social** | Freunde per Code verbinden, letztes Training + Fortschritt sehen, **Pläne teilen mit Besitzer-Bestätigung** |
| 🤝 **Gruppentraining** | Gemeinsame Live-Session, einer trägt für beide ein (getrennte Spalten), landet im Verlauf beider |
| 🔐 **Login** | E-Mail/Passwort + Google, Cloud-Sync pro Konto (Firestore) |
| 📬 **Benachrichtigung** | E-Mail an den Betreiber bei jeder neuen Registrierung (EmailJS, nur Name + Zeitpunkt) |
| 📱 **PWA** | Installierbar auf iPhone + Android, Offline-fähig, Auto-Update |

---

## 🗂️ Projektstruktur

```
tracker/                  ← dieses Repo (auf GitHub Pages deployed)
├── index.html            App-Markup (alle Screens als .page-Sections, body[data-state])
├── app.js                Komplette Logik (Daten, Auth, Training, Social, Themes …)
├── style.css             Design-System (CSS-Variablen + 3 Theme-Blöcke)
├── sw.js                 Service Worker (Network-first, Auto-Update)
├── manifest.json         PWA-Manifest (Name, Icons, Theme-Farbe)
├── firebase-config.js    Firebase-Web-Config + EMAILJS_CONFIG
├── firestore.rules       Sicherheitsregeln (in der Firebase-Konsole zu deployen)
├── logo.png              Wichtel-Logo (App-Logo)
├── icon-192/512.png      PWA-Icons
└── apple-touch-icon.png  iOS-Icon
```

---

## 🧠 Architektur (Kurzüberblick)

### App-Zustände
`document.body.dataset.state` steuert die Ansicht: `loading` → `auth` → `onboarding` → `app`.
Login/Onboarding werden **neutral** (grau) dargestellt; das gewählte Design greift erst in der App.

### Navigation
`navigate(pageId)` toggelt `.page`-Sections. Tabs: `dashboard`, `training`, `history`,
`checkin`, `stats`. Ohne Nav-Button erreichbar: `profile`, `friends`, `workout-detail`, `group`.

### Datenmodell (pro Konto)
- **localStorage** `fitnessData_<uid>` (Cache) ⇄ **Firestore** `fitness/<uid>` (Cloud, live `onSnapshot`).
- Felder: `profile{name,startWeight,goalWeight,startDate,goalDate,friendCode}`,
  `routines[]` (mit `exercises[]`), `workouts[].exercises[].sets[{weight,reps,rpe}]`,
  `weightLog[]`, `measurements[]`, `settings{theme,femMode,restDefault,weightFreq,measureFreq}`,
  `exerciseLibrary[]`.
- **Themes:** `APP_VERSION` (Anzeige, SemVer) ist getrennt vom Cache-Buster (Build-Integer in
  `?v=N` / `CACHE_NAME`). Theme persistiert zusätzlich nutzerunabhängig in `themePref` (flackerfreier Boot).

### Social-Datenmodell (Firestore)
- `users/<uid>` — **öffentliches** Profil (Name, friendCode, lastWorkout, workoutsThisMonth,
  Plan-Namen). **Kein Gewicht/Maße.**
- `users/<uid>/incoming/<fromUid>` — Freundschaftsanfragen
- `users/<uid>/friends/<friendUid>` — bestätigte Freunde
- `users/<uid>/planRequests/<id>` — Plan-Kopier-Anfragen (Besitzer bestätigt → Plan landet …)
- `users/<uid>/inbox/<id>` — … im Posteingang des Anfragers (oder Gruppen-Einladung)
- `groupSessions/<id>` — geteilte Live-Session (`members[]`, `exercises[].sets[uid][]`)

---

## 🔧 Setup von Null (für einen eigenen Klon)

### 1. Firebase-Projekt
1. [console.firebase.google.com](https://console.firebase.google.com) → Projekt erstellen.
2. Web-App (`</>`) hinzufügen → die `firebaseConfig`-Werte nach `firebase-config.js` (`window.FIREBASE_CONFIG`) kopieren.
3. **Authentication** → Sign-in method → **E-Mail/Passwort** und **Google** aktivieren.
4. Authentication → Settings → **Authorized domains** → deine Pages-Domain hinzufügen (z. B. `proxer21.github.io`).
5. **Firestore Database** erstellen (Region z. B. `europe-west3`).
6. Firestore → **Rules** → kompletten Inhalt von [`firestore.rules`](./firestore.rules) einfügen → **Veröffentlichen**.
   (Enthält private Daten + Social-Collections `users` und `groupSessions`.)

### 2. Registrierungs-Benachrichtigung (optional, EmailJS)
1. Konto auf [emailjs.com](https://www.emailjs.com) (Free: 200 Mails/Monat).
2. **Email Service** verbinden (z. B. Gmail) → **Service ID**.
3. **Email Template** anlegen, Platzhalter `{{name}}`, `{{time}}`, `{{app}}`; „To Email" = deine Adresse → **Template ID**.
4. **Account → Public Key**.
5. Die drei Werte in `firebase-config.js` → `window.EMAILJS_CONFIG` eintragen.
   (Solange `HIER_*` drinsteht, ist die Benachrichtigung inaktiv — die App läuft trotzdem.)

### 3. Deployment (GitHub Pages)
1. Repo anlegen, Inhalt von `tracker/` pushen.
2. Settings → Pages → Branch `main` → live unter `https://<user>.github.io/<repo>/`.
3. Da alle Pfade **relativ** sind, läuft die App unter jedem Pfad/Domain.

---

## 🚀 Lokal entwickeln & testen

```bash
python3 -m http.server 8181 --directory tracker
# → http://localhost:8181
```

---

## 🔁 Release-Disziplin (WICHTIG)

Zwei getrennte Nummern:
- **`APP_VERSION`** in `app.js` = **SemVer** für die Anzeige (`v1.0.0`). Semantisch erhöhen:
  Bugfix → Patch (`1.0.1`), Feature → Minor (`1.1.0`), großer Umbau → Major (`2.0.0`).
- **Cache-Buster Build-Nummer** = Integer in `index.html` (`app.js?v=N`, `style.css?v=N`)
  **und** `sw.js` (`CACHE_NAME = fitness-trainer-vN`). Aktuell **N = 40**.
  Bei **jeder** JS/CSS/HTML-Änderung **alle hochzählen**, sonst lädt das Handy die alte Version.

Der Service Worker ist **Network-first** + lädt bei Update automatisch neu.

---

## 🗺️ Ideen für später

- „Mit Google" auch im Konto-erstellen-Screen
- Fortschrittsfotos, Wasser-/Schlaf-Tracking
- Eigenes App-Logo im Google-Login (OAuth-Branding-Verifizierung)
- Gruppentraining: mehr als 2 Teilnehmer

---

*Strong Gnome · v1.0.0 · gebaut mit 💜 als kostenlose PWA.*
