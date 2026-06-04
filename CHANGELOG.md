# Changelog — Strong Gnome

Format: angelehnt an [Keep a Changelog](https://keepachangelog.com).
Anzeige-Version = SemVer; in Klammern die interne Cache-Build-Nummer.

---

## v1.0.0 (Build 40) — Erstes vollständiges Release 🎉

Erster runder, voll funktionsfähiger Stand. Highlights der Entwicklung bis hierher:

### Training & Tracking
- Strong-artiges, satz-basiertes Tracking; frei anlegbare/umsortierbare Trainingspläne
- Klassischer Push/Pull/Legs als Standard-Plan für neue Nutzer
- Rest-Timer (Vibration + Sound), Übung ersetzen/Alternative/Notiz, leeres Workout
- Einzelne Sätze löschen (Swipe), „+ Satz", RPE-Slider
- Cinematischer Trainingsstart: 3·2·1-Countdown, „Möge die Kraft mit dir sein", Blitz-Button
- Verlauf-Karten antippbar → Detailansicht (Sätze, geschätztes 1RM, Dauer/Volumen/PRs), „Erneut ausführen"

### Check-in & Statistik
- Gewicht + 9 Körpermaße, Frequenz frei wählbar (täglich/wöchentlich/monatlich), 2 Nachkommastellen
- Charts: Gewicht vs. Zielkurve, Maße, Kraft, Konsistenz-Heatmap, Volumen, Monatscheck

### Design
- 3 Themes: Rosé hell, Rosé dunkel, Maskulin (düster + Stahlblau-Aura) — Umschalter im Header & Profil
- Theme-bewusster Trainingsstart, flackerfreier Theme-Boot, neutrale Login-/Onboarding-Screens
- Eigenes Wichtel-Logo als App-Icon

### Konten & Cloud
- Login per E-Mail/Passwort **und** Google; Daten pro Konto in Firestore, Live-Sync
- Profil-/Einstellungsseite; Design-Wahl beim Onboarding; „Konto zurücksetzen"
- Registrierungs-Benachrichtigung per E-Mail (EmailJS)

### Social
- Freunde per Code verbinden; letztes Training + Monatsfortschritt sehen
- Trainingspläne teilen — **nur mit Bestätigung des Besitzers** (Anfrage → Senden → Posteingang → Übernehmen)
- Gruppentraining: gemeinsame Live-Session, einer trägt für beide ein (getrennte Spalten), landet im Verlauf beider

### Plattform & Betrieb
- PWA: iPhone + Android, Network-first Service Worker mit Auto-Update
- Gehostet kostenlos auf GitHub Pages
- Repo & URL auf **strong-gnome** umbenannt; Status-Bar-Farbe neutralisiert (kein rosa Rand)

### Wichtige Fixes auf dem Weg zu 1.0.0
- Theme bleibt nach Reload erhalten (uid-unabhängiger `themePref`)
- Neue Konten erben **keine** Alt-Daten mehr (Auto-Migration entfernt); Onboarding hängt an echtem Profil
- Maskuline Status-Bar-Linie (statisches Manifest-`theme_color`) auf neutrales Dunkel gesetzt

---

*Versionierung: Anzeige = SemVer (`APP_VERSION`), Cache-Buster = separate Build-Nummer
(`?v=N` / `CACHE_NAME`). Beide Konzepte sind in der README dokumentiert.*
