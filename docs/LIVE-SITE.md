# Gaming Reset: Live Site Documentation

**URL:** https://gamingreset.com/

## 1. What Gaming Reset is

Gaming Reset is a personalised habit-change app for people who want to cut back
on gaming. It is built for people who have already tried "just uninstalling" and
found that willpower alone does not work.

When someone signs up they answer a short questionnaire about their gaming, their
daily routine and their goals. The app uses those answers to generate a small set
of **daily missions** that fit that person's life. It then tracks progress with
streaks, a rank ladder and check-ins, so change comes from structure rather than
willpower.

Gaming Reset is self-improvement software. It is not a medical or therapeutic
service.

### Mission

Help people take back the time, sleep and goals that compulsive gaming has been
taking from them, through small, personalised steps they can actually complete.

### Target audience

- Students and young adults whose gaming is crowding out study, sleep or work
- Players of competitive or live-service games (Valorant, League of Legends, CS2,
  Dota 2, EA FC, World of Warcraft) where the game is designed to keep you playing
- People who want to **moderate** gaming, as well as people who want to quit

---

## 2. User journey

```
Visitor lands on home page
        │
        ▼
Reads plans / articles / uses calculator
        │
        ▼
Sign up (email + password, or Google)  ──►  Confirm email
        │
        ▼
Onboarding questionnaire (multi-step)
        │
        ▼
AI generates personalised daily missions
        │
        ▼
Checkout: start 3-day free trial (card or crypto)
        │
        ▼
Dashboard: complete daily missions, log urges, climb ranks
```

---

## 3. Pages

### Public (marketing) pages

| Path | Page | Purpose |
|------|------|---------|
| `/` | Home | Explains the problem and the product. Sections: interactive "reset" hero, *Mirror* (recognising your own habits), *Life Lost* (hours gaming adds up to), real stories, and a call-to-action strip. |
| `/plans` | Plans & pricing | Monthly and Annual plans, a 3-day free trial, a "first week" preview, how human review works, and an FAQ. |
| `/writing` | Writing (blog) | Articles on gaming habits, with a featured post and a post grid. |
| `/writing/[slug]` | Article | Individual long-form article with illustrations. |
| `/writing/author/saad` | Author page | About the author. |
| `/gaming-time-calculator` | Gaming time calculator | Interactive tool: enter your hours and see how much of your year and life they add up to. |
| `/gaming-addiction-statistics` | Statistics | A sourced reference on how common problem gaming is. |
| `/contact` | Contact | Contact form with a topic picker. |
| `/privacy`, `/terms`, `/refund` | Legal | Privacy policy, terms of service, refund policy. |

### Authentication pages

| Path | Purpose |
|------|---------|
| `/signup` | Create an account (email/password or Google) |
| `/login` | Sign in |
| `/forgot-password` | Request a password-reset email |
| `/reset-password` | Choose a new password |
| `/auth/confirmed` | Shown after the user confirms their email |
| `/delete-account` | Permanently delete an account |

### Signed-in app pages

| Path | Page | Purpose |
|------|------|---------|
| `/onboarding` | Onboarding | Multi-step personalised questionnaire (see §4). |
| `/checkout` | Checkout | Choose a plan and pay by card or crypto (QR code). |
| `/success` | Success | Confirmation after payment. |
| `/dashboard` | Dashboard | The daily home screen (see §5). |
| `/leaderboard` | Leaderboard | Ranked list of users by rating (MMR). |
| `/settings/account` | Account settings | Password change and account security. |
| `/settings/billing` | Billing | Current plan, upgrade, cancel. |

App pages are marked `noindex` so they never appear in search results.

---

## 4. Onboarding questionnaire

Five screens, each with a friendly heading. Ten questions in total:

| # | Screen | Heading | Questions |
|---|--------|---------|-----------|
| 1 | Profile | "First, a little about you." | Name, age |
| 2 | Your gaming | "Let's understand your gaming." | Hours per day; session shape (long evening sessions, long sessions at random times, short bursts all day, or a mix); platforms (PC, console, phone or tablet; pick any) |
| 3 | Your world | "There's a whole life around it." | Plays with friends? Usual time friends call; life situation |
| 4 | Your direction | "What would you make room for?" | A real activity to replace gaming with ("dopamine replacement, not removal") |
| 5 | Your day | "Let's find your everyday rhythm." | What a typical day looks like |

Hours set the daily target, and session shape decides when missions land. If
friends usually call at a set time, a mission is placed in the 15 minutes before
it. Answers are validated before submission. While missions are being generated, the
UI shows reassurance messages instead of a bare spinner.

**Day-one setup missions** are fixed per platform:
- **PC:** appear offline on your game launcher and screenshot it
- **Console:** set your profile to appear offline and screenshot it
- **Mobile:** turn off game notifications and screenshot the settings screen

---

## 5. Dashboard features

| Feature | Description |
|---------|-------------|
| **Daily missions** | Personalised tasks for today. Some need a photo as proof; submitted photos are reviewed. |
| **Custom missions** | Users can propose their own mission and choose how many days it runs. |
| **Daily hours check-in** | Log how many hours you played today. |
| **Streaks** | Consecutive days completed; missed days are detected automatically. |
| **Rating (MMR) & ranks** | Completing missions earns rating that moves you up the rank ladder (§6). |
| **Urge button** | Press it when you feel the urge to play. It starts a short guided moment with a mood picker and suggestions, then records whether you resisted. |
| **Urge chart** | Chart of urge history over time. |
| **Reality check** | A clear-eyed look at how much time gaming is taking. |
| **Books & Watch sections** | Recommended books, films and anime to replace gaming time. |
| **Desktop app banner** | PC players are offered a Windows companion app. |
| **Messages** | Messages from the Gaming Reset team, with a reply box. |
| **Suggestions** | Send feedback or feature ideas. |

---

## 6. Rank ladder

Tiers get wider as you climb, so progression lasts for the months a habit takes
to form. Elite takes roughly 60 to 90 days of consistent effort.

| Rank | Rating range | Colour |
|------|-------------|--------|
| Bronze | 0 – 149 | `#cd7f32` |
| Silver | 150 – 649 | `#94a3b8` |
| Gold | 650 – 1,499 | `#f59e0b` |
| Platinum | 1,500 – 2,799 | `#06b6d4` |
| Diamond | 2,800 – 4,649 | `#3b82f6` |
| Master | 4,650 – 7,149 | `#8b5cf6` |
| Grandmaster | 7,150 – 10,999 | `#ef4444` |
| Elite | 11,000+ | `#f97316` |

---

## 7. Pricing

| Plan | Price | Notes |
|------|-------|-------|
| Monthly | **$9.99 / month** | About 33¢ a day |
| Annual | **$69 / year** | About 42% cheaper than paying monthly |

Both plans start with a **3-day free trial**. Payment by card or cryptocurrency.
All prices in the UI come from one file (`lib/pricing.js`), so the plans page and
the checkout can never show different numbers.

---

## 8. Articles on the Writing page

- Why Dota 2 Is Engineered to Make You Feel Like Quitting Is Impossible
- How Many Hours of Gaming Is Too Much? An Honest Answer
- What to Do Instead of Gaming (When Nothing Else Sounds Fun)
- What Happens When You Stop Playing Video Games: An Honest Timeline
- How to Quit Valorant When "Just Uninstall" Has Never Worked
- Why Video Games Are Not Fun Anymore (And Why You Still Play)
- How to Stop Playing Video Games at Night (It Is Not the Blue Light)
- How to Quit League of Legends (When the Climb Will Not Let Go)
- How to Play Video Games in Moderation (And When It Will Not Work)
- How to Quit CS2 When You Have an Inventory and a Decade In
- How to Quit EA FC When Ultimate Team Wipes Your Club Anyway
- How to Quit World of Warcraft When You Never Really Left

The full, current list is always at https://gamingreset.com/writing.

---

## 9. Design system

The visual direction is **dark and moody**, chosen for a recovery-focused product.
It feels calm and serious rather than like a flashy gaming site, with gold used
sparingly for achievement and progress.

### Colour tokens (`app/globals.css`)

| Token | Value | Use |
|-------|-------|-----|
| `--bg-primary` | `#0a0c10` | Page background |
| `--bg-secondary` | `#0f1218` | Sections |
| `--bg-card` | `#141820` | Cards |
| `--border` | `#1e2433` | Borders and dividers |
| `--text-primary` | `#e8e8e8` | Body text |
| `--text-dim` | `#6b7280` | Secondary text |
| `--gold` | `#c8a84b` | Accent: progress, highlights |
| `--gold-dim` | `#8a6f2e` | Muted accent |
| `--accent-red` | `#e53e3e` | Warnings, relapse |
| `--accent-green` | `#38a169` | Success, completed |

### Typography

**Plus Jakarta Sans** (weights 400 to 800), loaded with `next/font` and `display: swap`.

### Responsive design

- Every page is styled with its own **CSS Module**, so styles are scoped per component.
- Mobile layouts are added with `@media` breakpoints (mainly `max-width: 768px`)
  on top of the desktop layout, tuned for phones 360 to 430px wide.
- Relative units (`rem`, `%`, `clamp()`), flexbox and grid keep layouts fluid.

---

## 10. SEO and accessibility

- Per-page `metadata` (title, description, canonical URL), plus Open Graph and
  Twitter cards with a shared `og-image.png`
- JSON-LD structured data for the organisation, product offers and FAQ
- Auto-generated `sitemap.xml`; `robots.txt` allows crawling, and private pages
  use `noindex`
- `llms.txt` describing the public site for AI crawlers
- Semantic HTML, `aria-label`s on icon links, and keyboard-reachable dropdowns
- Cookie consent banner

---

## 11. Technology (production)

| Area | Technology |
|------|------------|
| User interface | Next.js 16 (App Router), React 19, CSS Modules |
| Hosting | Vercel, auto-deployed from the main branch |
| Auth & database | Supabase (Postgres) |
| Payments | Card checkout provider + crypto payments |
| AI | Large language model generates personalised missions |
| Monitoring | Error monitoring and web analytics |

Only the user interface is included in this repository. See the [README](../README.md).
