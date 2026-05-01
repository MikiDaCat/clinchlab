# TMT — Tonton Muay Thai

Application d'entraînement Muay Thaï avec timer, séances structurées,
bibliothèque de combos et historique. PWA installable avec audio,
vibrations et wake lock.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript 6**
- **Framer Motion 12** — animations et micro-interactions
- **PWA** — manifest + service worker (installable iOS/Android)
- **Web Audio API** — 8 sons de combat générés par oscillateurs
- **Vibration API** — 6 patterns haptiques
- **Wake Lock API** — écran allumé pendant la session

## Setup local

```bash
npm install --legacy-peer-deps
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Variables d'environnement

Créer un fichier `.env.local` à la racine :

```
API_KEY_21ST=ta_cle_ici   # Clé API 21st.dev — pour le coach IA (optionnel en V1)
```

## Build production

```bash
npm run build
npm run start
```

## PWA

L'app est installable sur mobile (iOS Safari, Chrome Android) via le
bouton "Installer" qui apparaît automatiquement, ou via le menu du navigateur.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Accueil — séance du jour, stats, bibliothèque preview |
| `/run` | Session en cours — timer plein écran, countdown 3-2-1, drawer phases |
| `/setup` | Configuration séance — presets, niveau, combo, rounds |
| `/timer` | Timer libre — Tabata, EMOM, intervalles ou round simple |
| `/library` | Bibliothèque — 16 combos avec filtres niveau et recherche |
| `/history` | Historique — 16 sessions, chart 12 semaines, drawer détail |
| `/coach` | Coach IA — interface chat (backend en configuration V2) |

## Features

- Timer multi-rounds avec 5 états sémantiques (combat / repos / warning / pause / done)
- Countdown 3-2-1 plein écran Barlow Condensed avant chaque round
- 8 sons de combat via Web Audio API (oscillateurs, zéro MP3)
- 6 patterns de vibration haptique
- Wake Lock robuste avec re-acquire automatique (`visibilitychange`)
- Mode plein écran natif (avec fallback webkit)
- Reprise automatique de session après crash (localStorage, 30 min)
- Bibliothèque filtrée en temps réel (debounce 200ms)
- Historique avec chart 12 semaines, grouping mensuel, sticky headers
- Long press emergency stop avec dialog de confirmation
- Tap-anywhere pause/play
- `prefers-reduced-motion` respecté sur toutes les animations
- Accessibilité WCAG AA/AAA (contrastes, 49 attributs ARIA, keyboard nav)
- Install prompt PWA (`beforeinstallprompt`)

## Design

Direction artistique **"ONE Championship Digital"** :
- Palette cold : noir pur `#050508` + rouge électrique + bleu glacé + ambre
- Typographie : **Bricolage Grotesque** (UI) + **Barlow Condensed** (timer broadcast) + **JetBrains Mono** (données)
- États sémantiques : `--flame` round actif · `--frost` repos · `--amber` warning · `--jade` terminé

## Structure

```
app/           Next.js pages (App Router)
components/    Composants UI partagés
  run/         Composants spécifiques à la session
hooks/         Hooks métier (useTimerSound, useVibration, useWakeLock, useSessionPersistence)
lib/           Données statiques (combos, séances, historique)
public/        Assets statiques (icons, manifest, service worker)
```
