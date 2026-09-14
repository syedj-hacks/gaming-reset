// Single source of truth for what Gaming Reset charges.
//
// Every price the product shows or bills is derived from PLAN_PRICING below:
// the /plans hero, the /plans card and its JSON-LD offers, the checkout page,
// the Paddle catalogue (lib/paddle-plans.js) and the crypto catalogue
// (lib/crypto-plans.js).
//
// Before this existed the same numbers were written by hand in six files.
// A price change meant six correct edits, and any one missed left the site
// advertising a price we do not actually charge — a consumer-protection and
// payment-provider problem, not just a bug.
//
// This module is deliberately PURE: no imports, no env vars, no server-only
// code. That is what lets the client bundles ('use client' checkout and
// PlanCard) and the server helpers share it without dragging server code into
// the browser or breaking the NEXT_PUBLIC_* literal-inlining rule. Keep it that
// way — Paddle price ids and anything secret belong in the modules that read
// env, never here.
//
// Two separate time fields, and they are NOT interchangeable:
//   `days`           — length of the access grant, and the divisor for the
//                      "about 33¢ a day" line. Monthly is 30 because that is
//                      the crypto grant we actually hand out.
//   `periodsPerYear` — how often the card is billed in a real calendar year.
//                      Monthly is 12, not 365/30, because a calendar month
//                      averages 30.44 days. Annualising the monthly baseline
//                      from `days` instead OVERSTATES the advertised annual
//                      saving as 43% against the correct 42%. See
//                      lib/pricing.test.mjs.
//
// Prices were cut in September 2026, from $13.99 / $99 to $9.99 / $69. The
// annual price keeps roughly the same discount against monthly as before.
// Card prices are charged by Paddle, so a change here must be matched by the
// Paddle prices behind NEXT_PUBLIC_PADDLE_PRICE_*; crypto payments created at
// the old amounts are still honoured by lib/crypto-plans.js.
//
// `crypto` marks the cadences NOWPayments is allowed to sell, and every cadence
// here currently qualifies. It stays a per-plan flag rather than an assumption
// because NOWPayments cannot auto-renew: a crypto payment is a fixed one-time
// grant, so any cadence short enough that lapsing would sting has to be
// card-only, and this is the switch that enforces it. (It is what kept the old
// $3.50 weekly plan off the crypto rail before that plan was retired.)

export const PLAN_PRICING = [
  {
    id: 'monthly',
    name: 'Monthly',
    amountUsd: 9.99,
    per: 'month',
    days: 30,
    periodsPerYear: 12,
    tier: 0,
    unitCode: 'MON', // UN/CEFACT code for schema.org UnitPriceSpecification
    crypto: true,
  },
  {
    id: 'yearly',
    name: 'Annual',
    amountUsd: 69,
    per: 'year',
    days: 365,
    periodsPerYear: 1,
    tier: 1,
    unitCode: 'ANN',
    crypto: true,
  },
]

/** Look up a cadence by id ('monthly' | 'yearly'); null if unknown. */
export function pricingById(id) {
  return PLAN_PRICING.find((p) => p.id === id) || null
}

/**
 * Display form: "$9.99", "$69".
 * Whole dollars drop the ".00" because that is how the price has always been
 * shown on the card and in the hero.
 */
export function formatUsd(amountUsd) {
  return Number.isInteger(amountUsd) ? `$${amountUsd}` : `$${amountUsd.toFixed(2)}`
}

/**
 * schema.org form: always two decimals ("9.99", "69.00").
 * Google's Offer parser wants a plain decimal string, not a display price, so
 * this deliberately differs from formatUsd.
 */
export function schemaAmount(amountUsd) {
  return amountUsd.toFixed(2)
}

/** Whole cents per day, for the "about 33¢ a day" line. */
export function perDayCents(plan) {
  return Math.round((plan.amountUsd / plan.days) * 100)
}

/**
 * Whole-percent saving against paying monthly for the same span of time, or null
 * for the monthly plan itself (which cannot save against itself).
 *
 * Monthly is the baseline because it is the shortest cadence we sell. (It was
 * weekly until the $3.50 plan was retired; the comparison moved with it, so the
 * "Save N%" line on the plan card always measures against a real plan.)
 *
 * Both sides are annualised via periodsPerYear so the comparison is
 * like-for-like: monthly is 9.99 x 12, annual is 69 x 1.
 */
export function savingsVsMonthlyPct(plan) {
  const monthly = pricingById('monthly')
  if (!monthly || plan.id === monthly.id) return null
  const monthlyAnnual = monthly.amountUsd * monthly.periodsPerYear
  const planAnnual = plan.amountUsd * plan.periodsPerYear
  return Math.round((1 - planAnnual / monthlyAnnual) * 100)
}

/** Money compared as integer cents — never float equality (13.99 isn't exact). */
export function centsOf(amountUsd) {
  return Math.round(Number(amountUsd) * 100)
}
