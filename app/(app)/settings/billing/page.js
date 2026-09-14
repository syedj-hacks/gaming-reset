'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '../account/settings.module.css'
import SettingsShell, { SettingsIcon, SettingsNotice } from '../SettingsShell'
import { postJson } from '@/lib/http'

// Whole days of trial left, measured on the user's OWN calendar day (same basis
// the dashboard and get-daily-tasks use), so the countdown flips at their local
// midnight rather than at an absolute UTC instant.
function getDaysLeft(profile) {
  const tz = profile.timezone || 'UTC'
  const endDate = profile.trial_ends_date
    || (profile.trial_ends_at
      ? new Date(profile.trial_ends_at).toLocaleDateString('en-CA', { timeZone: tz })
      : null)
  if (!endDate) return null
  const today = new Date().toLocaleDateString('en-CA', { timeZone: tz })
  const diff = Math.round(
    (new Date(`${endDate}T00:00:00Z`).getTime() - new Date(`${today}T00:00:00Z`).getTime()) / 86400000
  )
  // Inclusive of the last day: today === endDate → 1 day left.
  return Math.max(0, diff + 1)
}

// 'YYYY-MM-DD' → a friendly long date. Parsed as UTC so the calendar day never
// drifts across timezones in display.
function formatDate(dateStr) {
  if (!dateStr) return null
  return new Date(`${dateStr}T00:00:00Z`).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  })
}

function fmtPrice(n) {
  return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`
}
const PER_SHORT = { week: 'wk', month: 'mo', year: 'yr' }
function perShort(per) {
  return PER_SHORT[per] || per
}

export default function BillingPage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(false)

  // Cancel flow: idle → confirming → (busy) → scheduled, mirrored into profile.
  const [confirming, setConfirming] = useState(false)
  const [canceling,  setCanceling]  = useState(false)
  const [cancelErr,  setCancelErr]  = useState('')

  // Upgrade flow: current card plan + available upgrades come from /api/paddle-plan
  // (which reads the live plan from Paddle). upgradeTarget holds the plan awaiting
  // confirmation before we charge.
  const [planInfo,      setPlanInfo]      = useState(null) // { current, upgrades } | null
  const [upgradeTarget, setUpgradeTarget] = useState(null)
  const [upgrading,     setUpgrading]     = useState(false)
  const [upgradeErr,    setUpgradeErr]    = useState('')
  const [upgradeMsg,    setUpgradeMsg]    = useState('')
  const router = useRouter()

  async function handleUpgrade(target) {
    setUpgrading(true)
    setUpgradeErr('')
    try {
      const res = await postJson('/api/paddle-change-plan', { plan: target.id })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setUpgradeErr(data.error || 'Could not upgrade. Please try again.')
        return
      }
      setUpgradeTarget(null)
      setUpgradeMsg(`You’re now on the ${data.plan.name} plan.`)
      // Re-pull the authoritative current plan + remaining upgrades from Paddle.
      const fresh = await fetch('/api/paddle-plan')
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null)
      if (fresh) setPlanInfo(fresh)
    } catch {
      setUpgradeErr('Network error. Please try again.')
    } finally {
      setUpgrading(false)
    }
  }

  async function handleCancel() {
    setCanceling(true)
    setCancelErr('')
    try {
      const res = await postJson('/api/paddle-cancel')
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setCancelErr(data.error || 'Could not cancel. Please try again.')
        return
      }
      // Reflect the scheduled end date immediately; the webhook will confirm it.
      // This lives on planInfo, not on the profile: the cancel state is Paddle's
      // to report, and subscription_period_end may be holding an unrelated
      // preserved crypto grant that we must not overwrite here.
      setPlanInfo((p) => ({
        current: null,
        upgrades: [],
        ...(p || {}),
        scheduledCancelAt: data.scheduledCancelAt,
      }))
      setConfirming(false)
    } catch {
      setCancelErr('Network error. Please try again.')
    } finally {
      setCanceling(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/billing', { signal: controller.signal })
      .then(async (res) => {
        if (res.status === 401) { router.push('/login'); return }
        if (!res.ok) { setError(true); setLoading(false); return }
        setProfile(await res.json())
        setLoading(false)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError(true)
        setLoading(false)
      })
    return () => controller.abort()
  }, [router])

  // Once we know the user is on an auto-renewing card sub, ask the server which
  // plan they're on and what they can upgrade to (read live from Paddle).
  useEffect(() => {
    if (!profile?.autoRenew) return
    const controller = new AbortController()
    fetch('/api/paddle-plan', { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d) setPlanInfo(d) })
      .catch(() => { /* upgrades just won't show; non-critical */ })
    return () => controller.abort()
  }, [profile?.autoRenew])

  if (loading || (!profile && !error)) {
    return <SettingsShell active="billing"><div className={styles.billingSkeleton} role="status" aria-label="Loading membership details"><span className={styles.eyebrow}>GETTING YOUR MEMBERSHIP READY</span><div /><div /><div /><p><span className={styles.spinner} />Loading your plan and billing details…</p></div></SettingsShell>
  }
  if (error) {
    return <SettingsShell active="billing"><section className={styles.loadError} role="alert"><span className={styles.cardIcon}><SettingsIcon name="card" /></span><h2>Your billing details couldn’t load.</h2><p>Try again in a moment, or get in touch if you need a hand.</p><div><button type="button" className={styles.primaryBtn} onClick={() => window.location.reload()}>Try again <SettingsIcon name="arrow" /></button><Link href="/contact" className={styles.textLink}>Contact support</Link></div></section></SettingsShell>
  }
  const isPaid     = profile.subscription_status === 'paid'
  const isTrial    = profile.subscription_status === 'trial'
  const isInactive = profile.subscription_status === 'inactive'
  const daysLeft   = isTrial ? getDaysLeft(profile) : null

  const autoRenew  = isPaid && profile.autoRenew
  // Which rail is paying: 'paddle' | 'crypto' | 'play' | null. Derived server-side
  // in lib/subscription.js so this page and the Android app never disagree.
  const provider = profile.provider

  // Whether a cancel is scheduled comes from PADDLE, via /api/paddle-plan.
  //
  // It must NOT be inferred from subscription_period_end. That column also holds
  // a preserved crypto grant while a card sub is live (the keepCrypto logic in
  // paddle-webhook), so the old `autoRenew && !!subscription_period_end` told a
  // user who paid crypto and then upgraded to a card that their subscription was
  // ending, hid their upgrade options, and removed their cancel button.
  // /api/paddle-cancel already refuses to make that inference server-side.
  const cancelScheduled = autoRenew && !!planInfo?.scheduledCancelAt
  const cancelDate      = formatDate(planInfo?.scheduledCancelAt)
  // End of a fixed access window: a crypto grant, or the current Play period.
  const accessEndDate   = formatDate(profile.subscription_period_end)

  const statusLabel = isPaid ? 'Active' : isTrial ? 'Free Trial' : 'Inactive'

  // Card plan label reflects the live plan from Paddle once /api/paddle-plan
  // resolves; falls back to a generic label while loading or if it's unknown.
  const currentCardPlan = planInfo?.current
  // A non-Paddle paid user is NOT automatically a crypto user. Google Play
  // subscribers also have no paddle_subscription_id, so the old binary
  // card-or-crypto label called every Play subscriber "crypto" and told them
  // their access ran for a fixed period when in fact it auto-renews.
  const planLabel = isPaid
    ? (autoRenew
        ? (currentCardPlan
            ? `Full Access · ${fmtPrice(currentCardPlan.price)}/${perShort(currentCardPlan.per)}`
            : 'Full Access (card)')
        : provider === 'play'   ? 'Full Access (Google Play)'
        : provider === 'crypto' ? 'Full Access (crypto)'
        : 'Full Access')
    : isTrial ? 'Free Trial' : 'No active plan'

  const upgrades = (autoRenew && !cancelScheduled && planInfo?.upgrades) || []

  // Active-subscription copy, matched to the real cadence (not hardcoded weekly).
  // Card: "renews automatically every week/month/year" from the live plan.
  // Crypto: a fixed window — show its end date when we have one.
  // Play: renews on its own, and Google requires we point them at the Play
  // subscription centre to manage it. Crypto: a fixed window that simply lapses.
  const activeAccessText = autoRenew
    ? (currentCardPlan
        ? `Your subscription renews automatically every ${currentCardPlan.per}.`
        : 'Your subscription renews automatically.')
    : provider === 'play'
      ? (accessEndDate
          ? `This subscription is billed through Google Play and renews automatically. Your current period runs until ${accessEndDate}. Change or cancel it in your Google Play subscriptions.`
          : 'This subscription is billed through Google Play and renews automatically. Change or cancel it in your Google Play subscriptions.')
      : (accessEndDate
          ? `Your access is active until ${accessEndDate}. We’ll email you to renew before it ends.`
          : 'Your access runs for a fixed period. We’ll email you to renew before it ends.')

  const busy = upgrading || canceling
  const providerLabel = autoRenew ? 'Paddle' : provider === 'play' ? 'Google Play' : provider === 'crypto' ? 'Crypto' : isTrial ? 'Free trial' : 'Not applicable'
  const renewalLabel = cancelScheduled ? 'Ends at period close' : autoRenew ? 'Automatic renewal' : provider === 'play' ? 'Managed in Google Play' : provider === 'crypto' ? 'One-time payment' : isTrial ? 'No payment yet' : 'No active subscription'

  return (
    <SettingsShell active="billing">
      <div className={styles.billingGrid}>
        <section className={styles.membershipCard} aria-labelledby="membership-title"><div className={styles.passLines} aria-hidden="true" /><div className={styles.passTop}><span><SettingsIcon name="spark" />GAMING RESET</span><span className={`${styles.statusPill} ${!isPaid || cancelScheduled ? styles.statusMuted : ''}`}><i />{cancelScheduled ? 'Ending soon' : statusLabel}</span></div><div className={styles.passBody}><span className={styles.microLabel}>YOUR MEMBERSHIP</span><h2 id="membership-title">{isPaid ? 'Full access.' : isTrial ? 'Your fresh start.' : 'A new chapter awaits.'}</h2><p>{isPaid ? 'A little support for the life you’re building.' : isTrial ? 'Explore the tools. Find your rhythm.' : 'Make room for your next step.'}</p></div><div className={styles.passBottom}><div><span>CURRENT PLAN</span><strong>{planLabel}</strong></div><SettingsIcon name="spark" /></div></section>
        <section className={styles.billingDetails} aria-labelledby="details-title"><span className={styles.eyebrow}>THE DETAILS, SIMPLIFIED</span><h2 id="details-title">Good to know.</h2><dl><div><dt>Billing provider</dt><dd>{providerLabel}</dd></div><div><dt>Renewal</dt><dd>{renewalLabel}</dd></div>{cancelScheduled && cancelDate ? <div><dt>Access until</dt><dd>{cancelDate}</dd></div> : !autoRenew && isPaid && accessEndDate ? <div><dt>Current access until</dt><dd>{accessEndDate}</dd></div> : isTrial && daysLeft !== null ? <div><dt>Trial time left</dt><dd>{daysLeft === 0 ? 'Trial ended' : `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}`}</dd></div> : currentCardPlan ? <div><dt>Billing cycle</dt><dd>{currentCardPlan.name}</dd></div> : null}</dl><div className={styles.detailFoot}><SettingsIcon name="shield" /><span>Your membership follows you across devices.</span></div></section>
      </div>
      {isTrial && <div className={styles.trialBanner}><span className={styles.trialNumber}>{daysLeft === null ? <SettingsIcon name="clock" /> : <>{daysLeft}<small>{daysLeft === 1 ? 'DAY LEFT' : 'DAYS LEFT'}</small></>}</span><div><h2>{daysLeft === 0 ? 'Ready to keep going?' : daysLeft === 1 ? 'Make your next day count.' : 'Find your rhythm, then keep it.'}</h2><p>{daysLeft === 0 ? 'Your trial has ended. Choose a plan to continue using your daily missions and progress tools.' : 'Choose full access to keep using your missions, rating, and progress tools after your trial.'}</p></div><Link href="/checkout" className={styles.primaryBtn}>Explore full access <SettingsIcon name="arrow" /></Link></div>}
      {isInactive && <div className={styles.helpRow}><span className={styles.cardIcon}><SettingsIcon name="spark" /></span><div><h2>Your next step is here.</h2><p>Choose a membership to start using your personalised plan and daily missions.</p></div><Link href="/checkout" className={styles.primaryBtn}>Choose a plan <SettingsIcon name="arrow" /></Link></div>}
      {isPaid && <SettingsNotice tone={cancelScheduled ? 'warning' : 'success'} title={cancelScheduled ? 'Your cancellation is scheduled.' : 'Your full access is active.'}>{cancelScheduled ? <>Your access continues until {cancelDate ? <strong>{cancelDate}</strong> : 'the end of your billing period'}. Your subscription won’t renew after that.</> : activeAccessText}</SettingsNotice>}
      {(upgrades.length > 0 || upgradeMsg) && <section className={styles.card} aria-labelledby="upgrade-title"><div className={styles.cardHeader}><span className={styles.cardIcon}><SettingsIcon name="spark" /></span><div><span className={styles.microLabel}>MORE ROOM TO KEEP GOING</span><h2 id="upgrade-title">Same full access. A longer horizon.</h2><p>Switch your billing cycle. Your updated plan starts right away.</p></div></div>{upgradeMsg && <div role="status"><SettingsNotice tone="success" title="Your plan has been updated.">{upgradeMsg}</SettingsNotice></div>}{upgradeErr && <p className={styles.errorBox} role="alert">{upgradeErr}</p>}<div className={styles.upgradeOptions}>{upgrades.map((option) => <div key={option.id} className={styles.upgradeOption}><div className={styles.upgradeTop}><div><span className={styles.microLabel}>FULL ACCESS</span><h3>{option.name}</h3></div><div className={styles.upgradePrice}><strong>{fmtPrice(option.price)}</strong><span>/ {option.per}</span></div></div>{upgradeTarget?.id === option.id ? <div className={styles.confirmation}><h3>Switch to {option.name}?</h3><p>You’ll be charged the prorated difference now and moved over immediately. Your new recurring price is <strong>{fmtPrice(option.price)} per {option.per}</strong>.</p><div className={styles.actionRow}><button type="button" className={styles.primaryBtn} disabled={busy} onClick={() => handleUpgrade(option)}>{upgrading ? <><span className={styles.spinner} />Updating your plan…</> : <>Confirm upgrade <SettingsIcon name="arrow" /></>}</button><button type="button" className={styles.secondaryBtn} disabled={busy} onClick={() => { setUpgradeTarget(null); setUpgradeErr('') }}>Not now</button></div></div> : <button type="button" className={styles.secondaryBtn} disabled={busy || confirming} onClick={() => { setUpgradeTarget(option); setUpgradeErr(''); setUpgradeMsg('') }}>Switch to {option.name} <SettingsIcon name="arrow" /></button>}</div>)}</div></section>}
      <section className={styles.includedCard} aria-labelledby="included-title"><div><span className={styles.eyebrow}>WHAT YOUR MEMBERSHIP OPENS UP</span><h2 id="included-title">All the tools.<br /><em>One place to reset.</em></h2></div><ul>{['Your personalised daily plan', 'Daily missions & photo check-ins', 'Progress, streaks & rank tracking', 'Windows companion & web access'].map((feature) => <li key={feature}><SettingsIcon name="check" />{feature}</li>)}</ul></section>
      {autoRenew && !cancelScheduled && <section className={styles.manageCard} aria-labelledby="manage-title"><div className={styles.manageHeading}><span className={styles.cardIcon}><SettingsIcon name="card" /></span><div><h2 id="manage-title">Your subscription. Your choice.</h2><p>Cancel renewal whenever you need to. You’ll keep full access until the end of the current billing period.</p></div></div>{cancelErr && <p className={styles.errorBox} role="alert">{cancelErr}</p>}{!confirming ? <button type="button" className={styles.cancelBtn} disabled={busy || Boolean(upgradeTarget)} onClick={() => setConfirming(true)}>Cancel subscription <span aria-hidden="true">↗</span></button> : <div className={styles.confirmation}><h3>Stop renewal at the end of this period?</h3><p>Your rating, missions, and streak stay available until your paid access ends. You can resubscribe later.</p><div className={styles.actionRow}><button type="button" className={styles.cancelConfirmBtn} onClick={handleCancel} disabled={busy}>{canceling ? <><span className={styles.spinner} />Cancelling renewal…</> : 'Yes, cancel at period end'}</button><button type="button" className={styles.secondaryBtn} onClick={() => { setConfirming(false); setCancelErr('') }} disabled={busy}>Keep my subscription</button></div></div>}</section>}
      {cancelScheduled && <div className={styles.helpRow}><span className={styles.cardIcon}><SettingsIcon name="help" /></span><div><h2>Changed your mind?</h2><p>Your subscription is set to end{cancelDate ? ` on ${cancelDate}` : ''}. Get in touch if you’d like help with your next step.</p></div><Link href="/contact" className={styles.textLink}>Talk to us <SettingsIcon name="arrow" /></Link></div>}
      {isPaid && provider === 'play' && <div className={styles.helpRow}><span className={styles.cardIcon}><SettingsIcon name="card" /></span><div><h2>Manage your Google Play subscription.</h2><p>View, change, or cancel your subscription in the account where you purchased it.</p></div><a href="https://play.google.com/store/account/subscriptions" target="_blank" rel="noopener noreferrer" className={styles.textLink}>Open Google Play ↗</a></div>}
      <div className={styles.supportStrip}><SettingsIcon name="help" /><span>Questions about a payment or your plan?</span><Link href="/contact">We’re here to help ↗</Link></div>
    </SettingsShell>
  )
}
