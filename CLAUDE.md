# PERICORE TechStack

> **Pflicht-Read vor Session-Start:**
> ~/Projects/pericore-agents/shared/conventions/OPERATIONAL-CONVENTIONS.md
>
> Enthaelt die destillierte stabile Schicht der Pericore-Workspace-
> Conventions. Verbindlich, ueberschreibt repo-spezifische Defaults.

Interactive technology stack registry for the PERICORE multi-agent system.

## Architecture

- **Framework:** React 18 + Vite
- **Hosting:** GitHub Pages (static, auto-deployed via GitHub Actions)
- **PWA:** Installable on iOS/Android homescreen, offline-capable
- **Data:** All tool entries live in `src/App.jsx` as CATEGORIES constant. Future: extract to `src/data/techstack.json`.

## Development

```bash
npm install
npm run dev      # localhost:5173
npm run build    # dist/
```

## Deployment

Push to `main` triggers GitHub Actions → builds → deploys to GitHub Pages.

URL: `https://<github-user>.github.io/pericore-techstack/`

## Data Model

Each tool entry has:
- `name`, `variant`, `status` (aktiv/tentativ/evaluiert/abgeloest/ausgeschlossen)
- `reason` (why this tool), `techDesc`, `noviceDesc` (dual explanations)
- `openSource`, `license`, `country`, `countryFlag`, `gdprNote`
- `provider`, `released`, `links`

## Maintenance

- **TEK** owns technical content (tool evaluations, status changes)
- **HUB** owns structural decisions (categories, schema)
- Update via: edit data → commit → push → auto-deploy
- Bi-weekly review via TEK review prompt

## PWA

- `public/manifest.json` for install prompt
- `public/sw.js` for offline caching (stale-while-revalidate)
- Icons: `public/icon-192.png`, `public/icon-512.png`
