# Architecture

## Routing (Next.js App Router)

Routes are folders inside `app/`. Folders in parentheses are **route groups**:
they organise code and share a layout without adding to the URL.

| Group | Layout | Contains |
|-------|--------|----------|
| `app/(marketing)` | Adds the call-to-action strip and footer under every page | Home, plans, writing, calculator, statistics, contact, legal |
| `app/(app)` | Sets `noindex` metadata | Onboarding, dashboard, leaderboard, checkout, success, settings |
| top-level folders | Root layout only | Login, signup, password pages, delete account |

The root `app/layout.js` loads the font and global CSS, defines site-wide SEO
metadata, and renders the `Header` and `CookieBanner` on every page.

## Components

- **Page sections** live next to the page that uses them, e.g.
  `app/(marketing)/sections/` for the home page and `app/(marketing)/plans/sections/`
  for the plans page.
- **Dashboard widgets** live in `app/(app)/dashboard/components/`.
- **Shared components** live in `app/components/`.

Each component that needs styling has a matching `*.module.css` file.

## Server vs client components

Marketing pages are **server components** by default. They render to HTML with no
JavaScript cost and can export `metadata` for SEO. Interactive parts (calculator,
FAQ accordion, header menu, dashboard, onboarding, checkout) start with
`'use client'`.

## Data and shared logic

| File | Role |
|------|------|
| `lib/pricing.js` | Prices, formatting (`$9.99`), per-day cost, annual saving % |
| `lib/rank.js` | `RANKS` array and `getRank(mmr)` |
| `lib/platforms.js` | Platform options and day-one missions |
| `app/(app)/onboarding/steps.js` | Onboarding step and question definitions |
| `app/(marketing)/writing/posts.js` | Article content and metadata |
| `app/(marketing)/sections/faqData.js` | Home page FAQ |

## Mocks in this UI-only copy

| File | Replaces |
|------|----------|
| `lib/supabase.js` | Auth and database client. Returns a demo user and empty query results. |
| `lib/paddle-mock.js` | Payment SDK. Checkout does nothing. |
| `lib/observe.js` | Error-monitoring service. Logs to the console. |

Calls to `/api/...` stay in the components, so the code shows how the UI talks to
the backend, but those routes do not exist in this copy.

## Styling conventions

1. Colours come from CSS variables in `app/globals.css`.
2. Desktop styles are written first. Mobile styles are added underneath in
   `@media (max-width: …)` blocks and never change the desktop values.
3. Relative units (`rem`, `%`, `clamp()`) and flex/grid layouts are preferred.
