'use client'

import { useState, useEffect, useRef } from 'react'
import { initializePaddle } from '@/lib/paddle-mock'
import { useRouter } from 'next/navigation'
import styles from './checkout.module.css'
import { QRCodeSVG } from 'qrcode.react'
import { reportClientError } from '@/lib/observe'
import { PLAN_PRICING, formatUsd } from '@/lib/pricing'
import { postJson } from '@/lib/http'

// ── Plans ───────────────────────────────────────────────────
// One source of truth for what the page offers: monthly and annual, on card or
// crypto. The `crypto` flag still gates the crypto rail per plan (NOWPayments
// cannot auto-renew), and both current cadences pass it.
//
// IMPORTANT: NEXT_PUBLIC_* must be referenced by its LITERAL name to be inlined
// into the client bundle at build time — never via a computed key. So each price
// id is read here, statically, and carried on the plan object.
const PRICE_MONTHLY = process.env.NEXT_PUBLIC_PADDLE_PRICE_MONTHLY
const PRICE_YEARLY  = process.env.NEXT_PUBLIC_PADDLE_PRICE_YEARLY

// Amounts, cadences, grant lengths and the crypto flag are derived from
// lib/pricing.js — the same source /plans renders from — so the page someone
// decides on and the page they pay on can never quote different numbers. Only
// the price ids (which must stay literal, above) and the checkout-specific
// blurbs live here.
const PRICE_IDS = {
  monthly: PRICE_MONTHLY,
  yearly: PRICE_YEARLY,
}

const BLURBS = {
  monthly: 'Billed monthly · cancel anytime',
  yearly: 'Billed once a year · best value',
}

const TOP_TIER = Math.max(...PLAN_PRICING.map((plan) => plan.tier))

const PLANS = PLAN_PRICING.map((plan) => ({
  id: plan.id,
  name: plan.name,
  price: plan.amountUsd,
  per: plan.per,
  days: plan.days,
  blurb: BLURBS[plan.id],
  crypto: plan.crypto, // false would mean card-only — crypto can't auto-renew
  priceId: PRICE_IDS[plan.id],
  best: plan.tier === TOP_TIER,
}))

const planById = (id) => PLANS.find((p) => p.id === id) || PLANS[0]

// Cheapest cadence, and the fallback the crypto tab lands on if the selected
// plan is ever card-only. Derived, so adding or removing a cadence in
// lib/pricing.js can't leave a dead plan id hardcoded here.
const DEFAULT_PLAN_ID = PLANS[0].id
const DEFAULT_CRYPTO_PLAN_ID = (PLANS.find((p) => p.crypto) || PLANS[0]).id

// Shared formatter, so checkout and /plans round and punctuate money identically.
const fmtPrice = formatUsd
function perDay(plan) {
  return `≈ $${(plan.price / plan.days).toFixed(2)}/day`
}

const CRYPTO_NETWORKS = [
  {
    id:          'usdtbsc',
    label:       'USDT',
    network:     'BNB Smart Chain',
    networkShort:'BSC',
    fee:         '~$0.20',
    time:        '2–5 min',
    color:       '#F0B90B', // Binance yellow
  },
  {
    id:          'usdttrc20',
    label:       'USDT',
    network:     'Tron Network',
    networkShort:'TRC-20',
    fee:         '~$1.00',
    time:        '1–3 min',
    color:       '#FF060A', // Tron red
  },
]

// ── Paddle card / Apple Pay / Google Pay panel ──────────────
// Auto-renewing subscription for the selected plan, rendered with Paddle's INLINE
// checkout so it sits inside our own styled card instead of a generic overlay.
// We bind it to a server-created customer and let the webhook (and
// /paddle-confirm) grant access — nothing here can unlock the app on its own.
//
// NOTE: the payment fields themselves live in Paddle's cross-origin iframe and
// cannot be restyled with our CSS. Their colours/logo/font are set in the Paddle
// dashboard (Checkout settings → Branding); here we control the frame + theme.
//
// This component is REMOUNTED (via `key={plan.id}` from the parent) whenever the
// plan changes, so Paddle re-initialises cleanly against the new price id.
const PADDLE_FRAME_CLASS = 'paddle-checkout-frame' // non-module class Paddle targets

function CardPanel({ plan, onSuccess }) {
  // init → ready (inline mounted) → confirming → error
  const [status,   setStatus]   = useState('init')
  const [errorMsg, setErrorMsg] = useState(null)
  const paddleRef = useRef(null)
  const dataRef   = useRef({ customerId: null, userId: null })

  // Stable ref so Paddle's event callback always calls the latest onSuccess
  // without re-initialising Paddle.
  const onSuccessRef = useRef(onSuccess)
  useEffect(() => { onSuccessRef.current = onSuccess }, [onSuccess])

  // A request cancelled because the user left mid-flight throws the exact same
  // "Failed to fetch" TypeError as a genuine outage, and we cannot tell them
  // apart from the error alone. Without this, every visitor who opens checkout
  // and navigates away before it resolves files a Sentry issue — which is how
  // `checkout-init` becomes a tag you learn to ignore, right when it is also
  // where a genuinely broken API key would surface. React's effect cleanup
  // covers in-app navigation (`cancelled`); this covers a real page unload
  // (refresh, tab close, following a link out), where cleanup may never run.
  const unloadingRef = useRef(false)
  useEffect(() => {
    const onHide = () => { unloadingRef.current = true }
    window.addEventListener('pagehide', onHide)
    return () => window.removeEventListener('pagehide', onHide)
  }, [])

  // 1. Bind the customer + initialise Paddle.js once. Skipped entirely if this
  //    plan has no price id configured yet (handled in the render guard below).
  useEffect(() => {
    if (!plan.priceId) return
    let cancelled = false

    async function setup() {
      try {
        // Bind the Paddle customer. Nothing on this page renders until this
        // lands, so a single blip used to dead-end the whole checkout at
        // "please refresh" — on the one screen whose entire job is taking money.
        // Retry it, the same treatment loadDashboard already gives its reads.
        //
        // Only a NETWORK failure is retried: once fetch resolves we have a real
        // answer and stop, even on a non-2xx. Replaying a 409 "you already have
        // active access" or a 401 would be wrong, and would multiply the load on
        // a route that talks to the Paddle API.
        let res = null
        let lastErr = null
        for (let attempt = 1; attempt <= 3 && !res; attempt++) {
          if (cancelled) return
          try {
            res = await postJson('/api/paddle-checkout')
          } catch (err) {
            lastErr = err
            if (attempt < 3) await new Promise((r) => setTimeout(r, attempt * 400))
          }
        }
        if (cancelled) return

        if (!res) throw lastErr ?? new Error('paddle-checkout unreachable')

        const data = await res.json()
        if (!res.ok) {
          if (!cancelled) { setErrorMsg(data.error || 'Could not start checkout.'); setStatus('error') }
          return
        }
        if (cancelled) return
        dataRef.current = { customerId: data.customerId, userId: data.userId }

        const p = await initializePaddle({
          // Pinned to live, not read from an env var: the previous
          // `NEXT_PUBLIC_PADDLE_ENV || 'sandbox'` meant a missing or misspelled
          // variable silently put real customers on sandbox, where the card is
          // accepted and no money ever moves.
          environment: 'production',
          token:       process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
          eventCallback: async (ev) => {
            // Paddle renders the payment fields in a cross-origin iframe, so
            // failures in there can never reach Sentry's global handler — these
            // events are the ONLY signal we get. Surface them or they vanish.
            if (ev?.name === 'checkout.error' || ev?.name === 'checkout.payment.error') {
              reportClientError(
                'checkout-paddle',
                new Error(`Paddle ${ev.name}: ${ev?.detail || 'no detail'}`),
                { code: ev?.code, type: ev?.type, priceId: plan.priceId, planId: plan.id }
              )
              return
            }

            if (ev?.name === 'checkout.completed') {
              setStatus('confirming')
              // Ask our server to verify with Paddle and flip access on now;
              // the webhook is the backstop if this is briefly too early.
              //
              // The user has ALREADY PAID by this point, so neither branch below
              // may stay silent. "The webhook will reconcile" holds only while
              // the webhook is healthy — and during a key/environment change a
              // broken confirm and a broken webhook are correlated failures, not
              // independent ones. That combination is a customer who paid and
              // got nothing, which we must hear about from the first occurrence.
              try {
                const res = await postJson('/api/paddle-confirm')
                if (!res.ok) {
                  reportClientError(
                    'checkout-confirm',
                    new Error(`paddle-confirm returned ${res.status} after checkout.completed`),
                    { userId: dataRef.current.userId, priceId: plan.priceId }
                  )
                }
              } catch (err) {
                reportClientError('checkout-confirm', err, {
                  userId: dataRef.current.userId,
                  priceId: plan.priceId,
                  note: 'paid, but confirm was unreachable; webhook is the only remaining path',
                })
              }
              onSuccessRef.current()
            }
          },
        })
        if (cancelled) return

        paddleRef.current = p
        setStatus('ready')
      } catch (err) {
        // Where a bad client token lands (a test_ key against live Paddle), and
        // where all three network attempts above give up. The user sees a
        // friendly message; we need the real reason — but NOT when the failure
        // is just the user leaving mid-request, which is indistinguishable from
        // a real outage at the error level and would otherwise bury the signal.
        if (!cancelled && !unloadingRef.current) {
          reportClientError('checkout-init', err, {
            priceId: plan.priceId,
            planId: plan.id,
          })
        }
        if (!cancelled) { setErrorMsg('Could not start checkout. Please refresh.'); setStatus('error') }
      }
    }

    setup()
    return () => {
      cancelled = true
      try { paddleRef.current?.Checkout?.close?.() } catch { /* noop */ }
    }
    // plan.id is only read for error-report context. It moves in lockstep with
    // plan.priceId and the parent remounts on plan change (key={plan.id}), so
    // listing it adds no extra runs — it just keeps the dep array honest.
  }, [plan.priceId, plan.id])

  // 2. Mount the inline checkout into our framed container once Paddle is ready.
  useEffect(() => {
    if (status !== 'ready' || !paddleRef.current) return
    try {
      paddleRef.current.Checkout.open({
        items: [{ priceId: plan.priceId, quantity: 1 }],
        customer: { id: dataRef.current.customerId },
        // Echoed back in the webhook so it can bind the payment to this user.
        customData: { user_id: dataRef.current.userId },
        settings: {
          displayMode:        'inline',
          theme:              'dark',
          frameTarget:        PADDLE_FRAME_CLASS,
          frameInitialHeight: 450,
          // Transparent so our card shows through; Paddle owns the inner fields.
          frameStyle:         'width:100%; min-width:0; background-color:transparent; border:none;',
          successUrl:         `${window.location.origin}/success`,
        },
      })
    } catch (err) {
      // Where a price id from the wrong environment lands: a leftover sandbox
      // pri_... looks identical to a live one, so this is the first place that
      // mistake becomes observable.
      reportClientError('checkout-open', err, {
        priceId: plan.priceId,
        planId: plan.id,
      })
      // open() threw synchronously — surface it on the next frame rather than
      // calling setState synchronously inside the effect body.
      requestAnimationFrame(() => {
        setErrorMsg('Could not load the payment form. Please refresh.')
        setStatus('error')
      })
    }
  }, [status, plan.priceId, plan.id])

  // Plan exists but no Paddle price id wired up yet (e.g. monthly/annual before
  // you paste the pri_... ids). Don't try to open Paddle — tell the user kindly.
  if (!plan.priceId) {
    return (
      <div className={styles.unavailableBox}>
        <span className={styles.unavailableIcon}>⌛</span>
        <div>
          <p className={styles.unavailableTitle}>{plan.name} card billing is coming online</p>
          <p className={styles.unavailableText}>
            This plan isn’t available by card just yet. Pick a different plan, or
            pay with crypto.
          </p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className={styles.errorBox}>
        <span className={styles.errorIcon}>!</span>
        {errorMsg}
      </div>
    )
  }

  if (status === 'confirming') {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.loadingSpinner} />
        <p className={styles.loadingText}>Activating your account…</p>
      </div>
    )
  }

  return (
    <div className={styles.form}>
      <p className={styles.formSub}>
        Card, Apple Pay &amp; Google Pay, billed {fmtPrice(plan.price)}/{plan.per}, cancel anytime.
      </p>

      {/* Paddle injects its inline iframe into this framed container. The
          loading overlay sits on top until the frame paints. */}
      <div className={styles.paddleFrameOuter}>
        {status !== 'ready' && (
          <div className={styles.paddleFrameLoading}>
            <div className={styles.loadingSpinner} />
            <p className={styles.loadingText}>Preparing secure checkout…</p>
          </div>
        )}
        <div className={`${styles.paddleFrame} ${PADDLE_FRAME_CLASS}`} />
      </div>

      <p className={styles.securityNote}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
        </svg>
        Secured by Paddle. Your card details never touch our servers.
      </p>
    </div>
  )
}

function CryptoPanel({ plan, onSuccess }) {
  const [step,        setStep]        = useState('select') // select | pending | done | expired
  const [selected,    setSelected]    = useState(null)     // CRYPTO_NETWORKS entry
  const [payment,     setPayment]     = useState(null)
  const [error,       setError]       = useState(null)
  const [loading,     setLoading]     = useState(false)
  const [copied,      setCopied]      = useState(false)
  const [timeLeft,    setTimeLeft]    = useState(null)
  const pollRef  = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (pollRef.current)  clearInterval(pollRef.current)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  async function createPayment() {
    if (!selected) return
    setLoading(true)
    setError(null)

    try {
      // Only the plan id travels — the server sets the real price + days.
      const res = await postJson('/api/create-crypto-payment', {
        plan: plan.id,
        currency: selected.id,
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Could not create payment. Try again.')
        return
      }

      setPayment(data)
      setStep('pending')

      if (data.expiresAt) {
        timerRef.current = setInterval(() => {
          const remaining = Math.max(0, new Date(data.expiresAt) - Date.now())
          setTimeLeft(remaining)
          if (remaining === 0) {
            clearInterval(timerRef.current)
            setStep('expired')
          }
        }, 1000)
      }

      pollRef.current = setInterval(() => checkStatus(data.paymentId), 15000)

    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function checkStatus(paymentId) {
    try {
      const res  = await fetch(`/api/crypto-payment-status?id=${paymentId}`)
      const data = await res.json()
      if (data.status === 'finished' || data.status === 'confirmed') {
        clearInterval(pollRef.current)
        clearInterval(timerRef.current)
        setStep('done')
        setTimeout(onSuccess, 1500)
      } else if (data.status === 'failed' || data.status === 'expired') {
        clearInterval(pollRef.current)
        clearInterval(timerRef.current)
        setStep('expired')
      }
    } catch { /* keep polling */ }
  }

  function copyAddress() {
    navigator.clipboard.writeText(payment.payAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function formatTime(ms) {
    if (!ms) return ''
    const m = Math.floor(ms / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    return `${m}:${String(s).padStart(2, '0')}`
  }

  function reset() {
    clearInterval(pollRef.current)
    clearInterval(timerRef.current)
    setStep('select')
    setSelected(null)
    setPayment(null)
    setError(null)
    setTimeLeft(null)
  }

  // ── Done ──
  if (step === 'done') {
    return (
      <div className={styles.cryptoSuccess}>
        <div className={styles.cryptoSuccessIcon}>✓</div>
        <p className={styles.cryptoSuccessText}>Payment confirmed. Activating your account...</p>
      </div>
    )
  }

  // ── Expired ──
  if (step === 'expired') {
    return (
      <div className={styles.cryptoExpired}>
        <p className={styles.cryptoExpiredText}>Payment expired or failed.</p>
        <button className={styles.cryptoRetryBtn} onClick={reset}>Try again</button>
      </div>
    )
  }

  // ── Pending ──
  if (step === 'pending' && payment) {
    return (
      <div className={styles.cryptoPending}>
        <div className={styles.cryptoPendingHeader}>
          <span className={styles.cryptoStatusDot} />
          <span className={styles.cryptoStatusText}>Waiting for payment</span>
          {timeLeft !== null && (
            <span className={styles.cryptoTimer}>{formatTime(timeLeft)}</span>
          )}
        </div>

        {/* Selected network reminder */}
        <div className={styles.cryptoNetworkPill} style={{ borderColor: `${selected.color}40` }}>
          <span className={styles.cryptoNetworkPillDot} style={{ background: selected.color }} />
          <span>{selected.label} · {selected.network}</span>
          <span className={styles.cryptoNetworkPillTag}>{selected.networkShort}</span>
        </div>

        <div className={styles.cryptoAmountRow}>
          <span className={styles.cryptoAmount}>{payment.payAmount}</span>
          <span className={styles.cryptoCurrency}>{payment.payCurrency.toUpperCase()}</span>
            <button
              className={styles.cryptoCopyBtn}
              onClick={() => {
                navigator.clipboard.writeText(String(payment.payAmount))
              }}
            >
              Copy
            </button>
        </div>
        <p className={styles.cryptoAmountNote}>Send exactly this amount to the address below</p>

        {/* QR Code */}
        <div className={styles.cryptoQrWrap}>
          <QRCodeSVG
            value={payment.payAddress}
            size={160}
            bgColor="transparent"
            fgColor="#f1f5f9"
            level="M"
          />
          <p className={styles.cryptoQrLabel}>Scan with Binance or any crypto wallet</p>
        </div>

        <div className={styles.cryptoAddressBlock}>
          <label className={styles.cryptoAddressLabel}>Payment address</label>
          <div className={styles.cryptoAddressRow}>
            <span className={styles.cryptoAddress}>{payment.payAddress}</span>
            <button
              className={`${styles.cryptoCopyBtn} ${copied ? styles.cryptoCopied : ''}`}
              onClick={copyAddress}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <div className={styles.cryptoNotes}>
          <p>• Send only <strong>{selected.networkShort} {selected.label}</strong> to this address. Other networks will be lost</p>
          <p>• Confirmation takes {selected.time} after sending</p>
          <p>• This page updates automatically when payment arrives</p>
          <p>• Do not close this tab until confirmed</p>
        </div>
      </div>
    )
  }

  // ── Select network ──
  return (
    <div className={styles.cryptoInit}>

      {/* Billing notice — crypto can't auto-renew, so it's a fixed one-time grant */}
      <div className={styles.cryptoBenefits}>
        <p className={styles.cryptoBenefitsTitle}>Paying with crypto? Read this first</p>
        <div className={styles.cryptoBenefitsList}>
          <div className={styles.cryptoBenefit}>
            <div>
              <span className={styles.cryptoBenefitLabel}>
                One-time {fmtPrice(plan.price)} for {plan.days} days of access
              </span>
              <span className={styles.cryptoBenefitDesc}>
                Crypto can&apos;t auto-renew like a card, so you pay {fmtPrice(plan.price)} once
                for {plan.days} days instead of a recurring subscription.
              </span>
            </div>
          </div>
          <div className={styles.cryptoBenefit}>
            <div>
              <span className={styles.cryptoBenefitLabel}>No auto-renewal</span>
              <span className={styles.cryptoBenefitDesc}>We email you when it&apos;s time to renew, and you pay again to continue.</span>
            </div>
          </div>
          <div className={styles.cryptoBenefit}>
            <div>
              <span className={styles.cryptoBenefitLabel}>No card info needed</span>
              <span className={styles.cryptoBenefitDesc}>Your bank details never enter the picture.</span>
            </div>
          </div>
          <div className={styles.cryptoBenefit}>
            <div>
              <span className={styles.cryptoBenefitLabel}>Instant access</span>
              <span className={styles.cryptoBenefitDesc}>Account unlocks within minutes of confirmation.</span>
            </div>
          </div>
        </div>
      </div>

      <p className={styles.cryptoSelectLabel}>Select your network</p>

      <div className={styles.cryptoNetworkGrid}>
        {CRYPTO_NETWORKS.map((net) => (
          <button
            key={net.id}
            className={`${styles.cryptoNetworkCard} ${selected?.id === net.id ? styles.cryptoNetworkCardActive : ''}`}
            style={selected?.id === net.id ? { borderColor: `${net.color}60`, boxShadow: `0 0 0 3px ${net.color}18` } : {}}
            onClick={() => setSelected(net)}
          >
            <div className={styles.cryptoNetworkCardTop}>
              <span className={styles.cryptoNetworkLabel}>{net.label}</span>
              <span
                className={styles.cryptoNetworkTag}
                style={{ color: net.color, background: `${net.color}18`, borderColor: `${net.color}30` }}
              >
                {net.networkShort}
              </span>
            </div>
            <span className={styles.cryptoNetworkName}>{net.network}</span>
            <div className={styles.cryptoNetworkMeta}>
              <span>Fee {net.fee}</span>
              <span>·</span>
              <span>{net.time}</span>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div className={styles.cryptoInitInfo}>
          <div className={styles.cryptoInitRow}>
            <span className={styles.cryptoInitLabel}>Amount</span>
            <span className={styles.cryptoInitValue}>{fmtPrice(plan.price)} USDT · {plan.days} days</span>
          </div>
          <div className={styles.cryptoInitRow}>
            <span className={styles.cryptoInitLabel}>Network</span>
            <span className={styles.cryptoInitValue}>{selected.network}</span>
          </div>
          <div className={styles.cryptoInitRow}>
            <span className={styles.cryptoInitLabel}>Network fee</span>
            <span className={styles.cryptoInitValue}>{selected.fee} (from your wallet)</span>
          </div>
          <div className={styles.cryptoInitRow}>
            <span className={styles.cryptoInitLabel}>Confirmation</span>
            <span className={styles.cryptoInitValue}>{selected.time}</span>
          </div>
        </div>
      )}

      {error && (
        <div className={styles.errorBox}>
          <span className={styles.errorIcon}>!</span>
          {error}
        </div>
      )}

      <button
        className={`${styles.submitBtn} ${styles.cryptoPayBtn}`}
        onClick={createPayment}
        disabled={loading || !selected}
      >
        {loading ? (
          <span className={styles.btnInner}><span className={styles.btnSpinner} />Creating payment...</span>
        ) : (
          <span className={styles.btnInner}>
            {selected ? `Pay with ${selected.networkShort} →` : 'Select a network above'}
            {selected && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
          </span>
        )}
      </button>

      <p className={styles.cryptoNote}>
        Payments are irreversible. Access granted immediately after confirmation.
      </p>
    </div>
  )
}

// ── Plan selector ───────────────────────────────────────────
// Segmented control. In crypto mode any card-only plan is disabled (crypto can't
// auto-renew), with a small hint instead of a hard removal so the layout stays
// stable. No current cadence is card-only, so this path is dormant today.
function PlanSelector({ planId, onSelect, payMethod }) {
  return (
    <div className={styles.planSelect} role="radiogroup" aria-label="Billing plan">
      {PLANS.map((p) => {
        const disabled = payMethod === 'crypto' && !p.crypto
        const active   = planId === p.id
        return (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={disabled}
            className={`${styles.planOption} ${active ? styles.planOptionActive : ''} ${disabled ? styles.planOptionDisabled : ''}`}
            onClick={() => !disabled && onSelect(p.id)}
          >
            {p.best && <span className={styles.planOptionBest}>Best value</span>}
            <span className={styles.planOptionName}>{p.name}</span>
            <span className={styles.planOptionPrice}>
              {fmtPrice(p.price)}<span className={styles.planOptionPer}>/{p.per}</span>
            </span>
            <span className={styles.planOptionDay}>
              {disabled ? 'Card only' : perDay(p)}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ── Page shell ─────────────────────────────────────────────
export default function CheckoutPage() {
  const [done,      setDone]      = useState(false)
  const [payMethod, setPayMethod] = useState('card')   // 'card' | 'crypto'
  const [planId,    setPlanId]    = useState(DEFAULT_PLAN_ID)  // 'monthly' | 'yearly'
  const router = useRouter()

  // Crypto can't sell a card-only plan. Switching to crypto while on one bumps
  // the selection to the first crypto-capable cadence here (not in an effect —
  // React 19 disallows setState inside effects), and we also derive defensively
  // below so the panel never receives a plan its method can't handle.
  function selectMethod(method) {
    setPayMethod(method)
    if (method === 'crypto' && !planById(planId).crypto) setPlanId(DEFAULT_CRYPTO_PLAN_ID)
  }

  let plan = planById(planId)
  if (payMethod === 'crypto' && !plan.crypto) plan = planById(DEFAULT_CRYPTO_PLAN_ID)

  function handleSuccess() {
    setDone(true)
    setTimeout(() => router.push('/dashboard'), 2200)
  }

  if (done) {
    return (
      <div className={styles.page}>
        <div className={styles.successState}>
          <div className={styles.successIcon}>✓</div>
          <h2 className={styles.successTitle}>You&apos;re in.</h2>
          <p className={styles.successSub}>Redirecting to your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageBg} />
      <div className={styles.pageMesh} />

      <div className={styles.container}>

        {/* Left — plan summary */}
        <div className={styles.left}>
          <div className={styles.planCard}>
            <div className={styles.planCardGlow} />

            <div className={styles.planTopRow}>
              <div className={styles.planBadge}>{'// GAMING RESET'}</div>
              <span className={styles.liveStrip}>
                <span className={styles.liveDot} />
                Secure · Live
              </span>
            </div>

            <h1 className={styles.planTitle}>Full Access</h1>

            {/* Price reflects the selected plan */}
            <div className={styles.planPrice}>
              <span className={styles.planAmount}>{fmtPrice(plan.price)}</span>
              <span className={styles.planPer}>/{plan.per}</span>
            </div>
            <p className={styles.planPriceSub}>
              {plan.blurb} · {perDay(plan)}
            </p>

            {/* Accepted payment methods */}
            <p className={styles.payMethodsLabel}>Pay your way</p>
            <div className={styles.payMethods}>
              {['Apple Pay', 'Google Pay', 'PayPal', 'USDT'].map((m) => (
                <span key={m} className={styles.payBadge}>{m}</span>
              ))}
            </div>

            <div className={styles.planDivider} />
            <ul className={styles.planFeatures}>
              {[
                'Personalised daily plan built for you',
                'Daily missions tailored to your life',
                'Full Rating & rank progression system',
                'Photo task verification',
                'Human admin support',
                'Access to leaderboard',
                'Suggestion & feedback channel',
                'Cancel anytime',
              ].map((f, i) => (
                <li key={i} className={styles.planFeature}>
                  <span className={styles.featureCheck}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right — payment form */}
        <div className={styles.right}>
          <div className={styles.formCard}>
            <div className={styles.formCardTop}>
              <h2 className={styles.formTitle}>Choose your plan</h2>
              <p className={styles.formSub}>Pick a billing period, then how you’d like to pay.</p>
            </div>

            {/* Plan selector */}
            <PlanSelector planId={planId} onSelect={setPlanId} payMethod={payMethod} />

            {/* Payment method tabs */}
            <div className={styles.methodTabs}>
              <button
                className={`${styles.methodTab} ${payMethod === 'card' ? styles.methodTabActive : ''}`}
                onClick={() => selectMethod('card')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                </svg>
                Card
              </button>
              <button
                className={`${styles.methodTab} ${payMethod === 'crypto' ? styles.methodTabActive : ''}`}
                onClick={() => selectMethod('crypto')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.546zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.328-.526 2.106c-.345-.087-.705-.167-1.064-.25l.529-2.12-1.32-.33-.54 2.157c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.974.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.236-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084z"/>
                </svg>
                Crypto
                <span className={styles.cryptoBadge}>No fees</span>
              </button>
            </div>

            {/* Keyed by plan so each panel re-initialises cleanly on plan change */}
            {payMethod === 'card' ? (
              <CardPanel key={plan.id} plan={plan} onSuccess={handleSuccess} />
            ) : (
              <CryptoPanel key={plan.id} plan={plan} onSuccess={handleSuccess} />
            )}

            {/* Point-of-sale legal — shown for both card and crypto */}
            <p
              style={{
                marginTop: '18px',
                textAlign: 'center',
                fontSize: '12.5px',
                lineHeight: 1.6,
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              By subscribing you agree to our{' '}
              <a href="/terms" style={{ color: 'rgba(255,255,255,0.62)', textDecoration: 'underline' }}>Terms</a>,{' '}
              <a href="/privacy" style={{ color: 'rgba(255,255,255,0.62)', textDecoration: 'underline' }}>Privacy Policy</a>, and{' '}
              <a href="/refund" style={{ color: 'rgba(255,255,255,0.62)', textDecoration: 'underline' }}>Refund Policy</a>.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
