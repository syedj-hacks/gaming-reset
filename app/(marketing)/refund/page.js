import Link from 'next/link'
import styles from '../privacy/privacy.module.css'

export const metadata = {
  // Root layout appends "| Gaming Reset" via its title template, so don't repeat it.
  title: 'Refund Policy',
  description:
    'How refunds, cancellations, and your statutory rights work at Gaming Reset: the 3 day free trial, card and crypto payments, and how to request a refund.',
  alternates: { canonical: '/refund' },
}

const SECTIONS = [
  { id: 'approach',     num: '01', title: 'Our Approach to Refunds' },
  { id: 'trial',        num: '02', title: 'Try Before You Pay' },
  { id: 'cancel',       num: '03', title: 'Cancelling Your Subscription' },
  { id: 'card',         num: '04', title: 'Card Subscription Refunds' },
  { id: 'crypto',       num: '05', title: 'Cryptocurrency Payments' },
  { id: 'statutory',    num: '06', title: 'Your Statutory Rights' },
  { id: 'processing',   num: '07', title: 'How a Refund Is Processed' },
  { id: 'chargebacks',  num: '08', title: 'Chargebacks and Disputes' },
  { id: 'request',      num: '09', title: 'How to Request a Refund' },
  { id: 'changes',      num: '10', title: 'Changes to This Policy' },
  { id: 'contact',      num: '11', title: 'Contact Us' },
]

export default function RefundPage() {
  return (
    <div className={styles.page}>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroMesh} />
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>Legal · Refunds</p>
          <h1 className={styles.heroTitle}>Refund policy.</h1>
          <p className={styles.heroSub}>
            We want you to start a paid plan only when Gaming Reset is right for
            you. This page explains when refunds apply, how to ask for one, and
            the rights the law already gives you.
          </p>
          <p className={styles.lastUpdated}>Last updated · July 2026</p>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.layout}>

          {/* Sidebar TOC */}
          <aside className={styles.toc}>
            <p className={styles.tocLabel}>Contents</p>
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} className={styles.tocLink}>
                <span className={styles.tocNum}>{s.num}</span>
                {s.title}
              </a>
            ))}
          </aside>

          {/* Content */}
          <div className={styles.content}>

            {/* 01 */}
            <section id="approach" className={styles.section}>
              <div className={styles.sectionNum}>01</div>
              <h2 className={styles.sectionTitle}>Our Approach to Refunds</h2>
              <p className={styles.p}>
                Gaming Reset is a digital subscription. Every account starts with
                a free trial so you can experience the full app before any money
                changes hands, and you can cancel at any time to stop future
                charges.
              </p>
              <p className={styles.p}>
                On top of that, every card purchase comes with a full,
                unconditional 14-day money-back guarantee: if you are not happy
                for any reason within 14 days of a charge, we will refund it in
                full, no questions asked and no conditions. This policy sets out
                exactly how that works for both card and cryptocurrency payments,
                and it should be read together with our{' '}
                <Link href="/terms" className={styles.link}>Terms of Service</Link>.
              </p>
            </section>

            {/* 02 */}
            <section id="trial" className={styles.section}>
              <div className={styles.sectionNum}>02</div>
              <h2 className={styles.sectionTitle}>Try Before You Pay</h2>
              <p className={styles.p}>
                New accounts get a free trial of three days with full access to
                the platform. No card and no payment are needed to begin. The
                trial is the best way to decide whether Gaming Reset fits you, and
                it means you are never charged just to find out what you are
                buying. When the trial ends your access simply pauses until you
                choose a paid plan.
              </p>
            </section>

            {/* 03 */}
            <section id="cancel" className={styles.section}>
              <div className={styles.sectionNum}>03</div>
              <h2 className={styles.sectionTitle}>Cancelling Your Subscription</h2>
              <p className={styles.p}>
                Cancelling and refunding are two different things. Cancelling
                stops your plan from renewing in the future. A refund returns
                money for a charge that has already been made.
              </p>
              <p className={styles.p}>
                You can cancel a card subscription at any time from your billing
                page. When you cancel, your plan stops renewing at the end of the
                period you have already paid for, so you keep full access until
                then and we do not bill you again. Cancelling on its own does not
                trigger a refund, but any charge made in the last 14 days can be
                refunded in full under our money-back guarantee below.
              </p>
            </section>

            {/* 04 */}
            <section id="card" className={styles.section}>
              <div className={styles.sectionNum}>04</div>
              <h2 className={styles.sectionTitle}>Card Subscription Refunds</h2>
              <p className={styles.p}>
                Card payments are handled by our payment provider, Paddle, who
                acts as the merchant of record for these transactions. When you
                pay by card, Paddle processes the payment and any approved refund
                is issued through them.
              </p>

              <h3 className={styles.subTitle}>14-day money-back guarantee</h3>
              <p className={styles.p}>
                You can request a full refund of any card payment, for any reason,
                within 14 days of that charge. There are no conditions and no
                exceptions. If you are not happy, or you simply changed your mind,
                contact us within 14 days and we will refund that payment in full.
              </p>
              <p className={styles.p}>
                To request it, email{' '}
                <a href="mailto:billing@gamingreset.com" className={styles.link}>
                  billing@gamingreset.com
                </a>{' '}
                or use our{' '}
                <Link href="/contact" className={styles.link}>contact form</Link>.
                Customers who paid by card can also request the refund directly
                through Paddle. Approved refunds are returned to your original
                payment method.
              </p>

              <h3 className={styles.subTitle}>After the 14-day window</h3>
              <p className={styles.p}>
                Once 14 days have passed since a charge, refunds are handled case
                by case. We will still refund duplicate charges, a charge made
                after a cancellation that should have stopped billing, and any
                charge made in genuine error. Nothing here limits the statutory
                rights described below.
              </p>
            </section>

            {/* 05 */}
            <section id="crypto" className={styles.section}>
              <div className={styles.sectionNum}>05</div>
              <h2 className={styles.sectionTitle}>Cryptocurrency Payments</h2>
              <p className={styles.p}>
                You can pay for the monthly or annual plan with cryptocurrency
                through our crypto payment provider. A crypto payment buys a fixed
                period of access and does not renew on its own, so there is nothing
                to cancel and you are never charged again automatically.
              </p>
              <p className={styles.p}>
                Cryptocurrency transactions are final and cannot be reversed on the
                blockchain, and exchange rates move constantly. For these reasons
                crypto payments are generally non-refundable once your access has
                been unlocked. If a payment failed, was sent twice, or your access
                did not activate after a confirmed payment, contact us with your
                transaction details and we will investigate and make it right,
                which may include restoring access or arranging a refund where
                appropriate.
              </p>
            </section>

            {/* 06 */}
            <section id="statutory" className={styles.section}>
              <div className={styles.sectionNum}>06</div>
              <h2 className={styles.sectionTitle}>Your Statutory Rights</h2>
              <p className={styles.p}>
                If you are a consumer in the European Union, the United Kingdom, or
                another region with a legal cooling-off period, you may have the
                right to cancel a purchase within fourteen days. Separately, and
                regardless of where you live, we offer our own unconditional
                14-day money-back guarantee on card payments as described above, so
                you are covered either way.
              </p>
              <p className={styles.p}>
                Nothing in this policy removes or limits any refund or cancellation
                right the law gives you. Where local consumer law requires a refund,
                that law takes priority over the general rules above.
              </p>
            </section>

            {/* 07 */}
            <section id="processing" className={styles.section}>
              <div className={styles.sectionNum}>07</div>
              <h2 className={styles.sectionTitle}>How a Refund Is Processed</h2>
              <p className={styles.p}>
                Approved card refunds are issued to your original payment method
                through Paddle. Once we approve a refund it is normally submitted
                within two business days, and the funds typically appear on your
                statement within five to ten business days, depending on your bank
                or card issuer.
              </p>
              <p className={styles.p}>
                A refund of the most recent payment usually ends access for that
                period, since you are being returned the money for it. We will tell
                you what a refund means for your access before we process it.
              </p>
            </section>

            {/* 08 */}
            <section id="chargebacks" className={styles.section}>
              <div className={styles.sectionNum}>08</div>
              <h2 className={styles.sectionTitle}>Chargebacks and Disputes</h2>
              <p className={styles.p}>
                If you see a charge you do not recognise or believe is wrong, please
                contact us first. Almost every billing issue can be solved quickly
                and directly, and that is faster for you than a formal dispute.
              </p>
              <p className={styles.p}>
                Opening a chargeback with your bank before contacting us can lead to
                your account being suspended while the dispute is investigated. We
                would much rather sort it out with you, so reach out and give us the
                chance to fix it.
              </p>
            </section>

            {/* 09 */}
            <section id="request" className={styles.section}>
              <div className={styles.sectionNum}>09</div>
              <h2 className={styles.sectionTitle}>How to Request a Refund</h2>
              <p className={styles.p}>
                Email us at{' '}
                <a href="mailto:billing@gamingreset.com" className={styles.link}>
                  billing@gamingreset.com
                </a>{' '}
                or use our{' '}
                <Link href="/contact" className={styles.link}>contact form</Link>. To help
                us find your payment and respond quickly, please include:
              </p>
              <div className={styles.featureList}>
                {[
                  'The email address on your Gaming Reset account.',
                  'The date and amount of the charge, and your order or receipt number if you have it.',
                  'Whether you paid by card or with cryptocurrency.',
                  'A short note on what went wrong or why you are asking for a refund.',
                ].map((item, i) => (
                  <div key={i} className={styles.featureItem}>
                    <span className={styles.featureDot} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <p className={styles.p}>
                We aim to reply within two to three business days. Customers who paid
                by card can also request a refund directly through Paddle, who may
                contact us as part of their own review.
              </p>
            </section>

            {/* 10 */}
            <section id="changes" className={styles.section}>
              <div className={styles.sectionNum}>10</div>
              <h2 className={styles.sectionTitle}>Changes to This Policy</h2>
              <p className={styles.p}>
                We may update this Refund Policy from time to time as our plans or
                payment providers change. When we make a material change we will
                update the date at the top of this page. The policy that applied at
                the time of your purchase is the one that governs that purchase.
              </p>
            </section>

            {/* 11 */}
            <section id="contact" className={styles.section}>
              <div className={styles.sectionNum}>11</div>
              <h2 className={styles.sectionTitle}>Contact Us</h2>
              <p className={styles.p}>
                For anything about billing, cancellations, or refunds, get in touch
                and a real person will help.
              </p>

              <div className={styles.contactGrid}>
                <div className={styles.contactCard}>
                  <h3 className={styles.contactTitle}>Billing and refunds</h3>
                  <a href="mailto:billing@gamingreset.com" className={styles.contactValue}>
                    billing@gamingreset.com
                  </a>
                  <p className={styles.contactNote}>Response within two to three business days</p>
                </div>
                <div className={styles.contactCard}>
                  <h3 className={styles.contactTitle}>General support</h3>
                  <Link href="/contact" className={styles.contactValue}>
                    Contact form
                  </Link>
                  <p className={styles.contactNote}>Answered by a real person</p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}
