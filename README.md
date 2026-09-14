# Gaming Reset

This is the user interface of **Gaming Reset**, a habit-change web app that helps
people spend less time gaming.

- **Live site:** https://gamingreset.com/
- **Full site documentation:** [docs/LIVE-SITE.md](docs/LIVE-SITE.md)
- **How the code is organised:** [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

> **UI-only copy.** This repository contains only the user interface: pages, components,
> styles and static assets. The backend (API routes, database, payments, AI mission
> generation, auth server logic) and all credentials are **not** included. Where
> the UI would call a backend service, it uses a small mock in `lib/` instead. Pages
> that load user data will show empty or loading states. That is expected.

---

## Tech stack

| Layer      | Technology                                   |
|------------|----------------------------------------------|
| Framework  | Next.js 16 (App Router)                      |
| Language   | JavaScript / TypeScript, React 19            |
| Styling    | CSS Modules + global CSS variables           |
| Charts     | Recharts                                     |
| Fonts      | Plus Jakarta Sans via `next/font`            |
| Hosting    | Vercel (production site)                     |

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

No `.env` file is needed. Marketing pages (home, plans, writing, calculator,
statistics, legal) render fully. App pages (dashboard, onboarding, checkout,
settings) render their layout, but any action that would reach the server fails
because there is no backend.

## Folder structure

```
app/
  (marketing)/       Public pages: home, plans, writing (blog), contact,
                     gaming-time calculator, statistics, privacy/terms/refund
  (app)/             Signed-in app: onboarding, dashboard, leaderboard,
                     checkout, success, settings
  components/        Shared UI: Header, BrandLogo, Auth shell, CookieBanner,
                     Google sign-in button
  login/ signup/ forgot-password/ reset-password/ delete-account/
  auth/confirmed/    Email-confirmed screen
  globals.css        Colour tokens and base styles
  layout.js          Root layout, SEO metadata, header and cookie banner
lib/
  pricing.js         Plan prices (single source of truth for the UI)
  rank.js            Rank ladder (Bronze → Elite)
  platforms.js       PC / console / mobile options for onboarding
  http.js            Small fetch helper
  supabase.js        MOCK: stand-in for the auth/database client
  observe.js         MOCK: logs errors to the console
  paddle-mock.js     MOCK: stand-in for the payment SDK
public/              Images, icons, article illustrations, robots.txt
docs/                Documentation
```

## What was removed from the production codebase

| Removed                          | Why                                         |
|----------------------------------|---------------------------------------------|
| `app/(app)/api/**` API routes    | Backend logic                               |
| Server helpers in `lib/`         | Backend logic, database access              |
| Database migrations              | Database schema                             |
| Payment, error-monitoring and analytics SDK setup | Needed keys and accounts   |
| Admin panel                      | Private                                     |
| Middleware / proxy, cron config  | Server-side only                            |
| `.env` files                     | Secrets (never part of any repo)            |
