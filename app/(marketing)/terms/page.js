import Link from 'next/link'
import styles from '../privacy/privacy.module.css'
import { pricingById, formatUsd } from '@/lib/pricing'

// These terms are a contract, so the prices stated in them are derived from the
// same source that bills the customer. A hand-typed price here that drifted from
// what Paddle actually charges would be a live misrepresentation.
const MONTHLY_PRICE = formatUsd(pricingById('monthly').amountUsd)
const YEARLY_PRICE = formatUsd(pricingById('yearly').amountUsd)

export const metadata = {
  // Root layout appends "| Gaming Reset" via its title template, so don't repeat it.
  title: 'Terms of Service',
  description:
    'The terms governing your use of Gaming Reset: accounts and access, the free trial and subscriptions, acceptable use, how your plan is created, the desktop app licence, termination.',
  alternates: { canonical: '/terms' },
}

const SECTIONS = [
  { id: 'acceptance',   num: '01', title: 'Acceptance of Terms' },
  { id: 'description',  num: '02', title: 'What Gaming Reset Is' },
  { id: 'accounts',     num: '03', title: 'Accounts and Access' },
  { id: 'trial',        num: '04', title: 'Free Trial and Subscriptions' },
  { id: 'acceptable',   num: '05', title: 'Acceptable Use' },
  { id: 'ip',           num: '06', title: 'Intellectual Property' },
  { id: 'ai',           num: '07', title: 'How Your Plan Is Created' },
  { id: 'desktop',      num: '08', title: 'The Desktop App' },
  { id: 'disclaimer',   num: '09', title: 'Disclaimers and Liability' },
  { id: 'termination',  num: '10', title: 'Termination' },
  { id: 'changes',      num: '11', title: 'Changes to These Terms' },
  { id: 'governing',    num: '12', title: 'Governing Law' },
  { id: 'contact',      num: '13', title: 'Contact Us' },
]

export default function TermsPage() {
  return (
    <div className={styles.page}>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroMesh} />
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>Legal · Terms</p>
          <h1 className={styles.heroTitle}>Terms of service.</h1>
          <p className={styles.heroSub}>
            Please read these terms before using Gaming Reset. By creating an
            account you agree to be bound by them.
          </p>
          <p className={styles.lastUpdated}>Last updated · September 2026</p>
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
            <section id="acceptance" className={styles.section}>
              <div className={styles.sectionNum}>01</div>
              <h2 className={styles.sectionTitle}>Acceptance of Terms</h2>
              <p className={styles.p}>
                By accessing or using Gaming Reset you agree to be bound by these
                Terms of Service. If you do not agree with any part of these terms
                you may not use the platform. If you are using Gaming Reset on
                behalf of someone else you confirm that you have the authority to
                accept these terms for them.
              </p>
              <p className={styles.p}>
                These terms apply to everyone who uses the platform, including
                visitors, free trial users, and paying subscribers.
              </p>
            </section>

            {/* 02 */}
            <section id="description" className={styles.section}>
              <div className={styles.sectionNum}>02</div>
              <h2 className={styles.sectionTitle}>What Gaming Reset Is</h2>
              <p className={styles.p}>
                Gaming Reset is a habit-change and self-improvement software app
                for gamers who want to spend less time gaming, sold as a digital
                subscription. The app works like a game: it gives you a starting
                rank based on your situation and automatically raises your rating
                as you complete daily missions. Gaming Reset is available as a
                website, as a mobile app, and as an optional desktop app for
                Windows, all sharing the same account.
              </p>
              <p className={styles.p}>The platform provides the following:</p>

              <div className={styles.featureList}>
                {[
                  'A personalised onboarding flow that builds your starting rank, primary quest, and first daily missions from your answers using a third party AI provider',
                  'Daily missions created with that same AI provider and tailored to your goals, your progress, and your recent history',
                  'In-app photo submission for tasks that need proof, checked once a day by our AI provider (with a person on our team reviewing anything it cannot confirm) before they count toward your rating',
                  'A daily gaming hours check in that adjusts your rating based on how much you played',
                  'A rating and rank system that tracks your real life progress like a competitive ladder',
                  'A leaderboard that shows your rank among other members',
                  'An in the moment urge tool that offers healthier actions when the pull to play hits',
                  'A progress tracker that shows how often you resisted the urge over time',
                  'The ability to submit your own custom missions and suggestions for review',
                  'Optional "instead of gaming" sections that suggest things to watch and read when the urge to play hits, drawn from third party catalogues',
                  'Occasional direct messages from our team that you can reply to inside the app',
                  'An optional desktop app for Windows that notices when you open a game launcher or a game, steps in before the session starts, measures how long you actually play, and closes the game or launcher for you when you choose to do something else instead',
                  'Optional self-imposed blocks in that desktop app, which hold your game launchers shut for a number of hours you choose, or once your own daily limit is reached',
                ].map((item, i) => (
                  <div key={i} className={styles.featureItem}>
                    <span className={styles.featureDot} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className={styles.highlight}>
                Gaming Reset is a self-improvement and habit-change tool. It is
                not a medical or psychological treatment service and it is not a
                substitute for professional care. If you are facing serious
                difficulties, please seek qualified professional support.
              </div>
            </section>

            {/* 03 */}
            <section id="accounts" className={styles.section}>
              <div className={styles.sectionNum}>03</div>
              <h2 className={styles.sectionTitle}>Accounts and Access</h2>

              <h3 className={styles.subTitle}>Creating an account</h3>
              <p className={styles.p}>
                You create your own account by signing up with your email address.
                We send a verification step to confirm the address belongs to you
                before you gain full access. This keeps accounts genuine and helps
                protect your data.
              </p>

              <h3 className={styles.subTitle}>Your responsibilities</h3>
              <p className={styles.p}>
                You are responsible for keeping your login credentials private and
                for all activity that happens under your account. If you think
                someone has reached your account without permission, tell us right
                away. You agree to give accurate information and to keep your
                account details current.
              </p>

              <h3 className={styles.subTitle}>One account per person</h3>
              <p className={styles.p}>
                Each account belongs to one individual. You may not share your
                account or run more than one account. Doing so may lead to
                immediate closure of every account involved.
              </p>

              <h3 className={styles.subTitle}>Age and parental consent</h3>
              <p className={styles.p}>
                Gaming Reset is not for children under 13. If you are between 13
                and 18, you may use the platform only with the knowledge and
                involvement of a parent or guardian. In some countries the law
                sets a higher age for agreeing to online services on your own, and
                where that applies a parent or guardian must give consent on your
                behalf before you use the platform. By creating an account you
                confirm that you meet these requirements. Our{' '}
                <Link href="/privacy" className={styles.link}>Privacy Policy</Link>{' '}
                explains how we protect younger members.
              </p>
            </section>

            {/* 04 */}
            <section id="trial" className={styles.section}>
              <div className={styles.sectionNum}>04</div>
              <h2 className={styles.sectionTitle}>Free Trial and Subscriptions</h2>

              <h3 className={styles.subTitle}>Free trial</h3>
              <p className={styles.p}>
                New accounts start with a free trial of three days with full
                access to the platform. No card or payment is needed to begin.
                When the trial ends your access pauses until you move to a paid
                plan.
              </p>

              <h3 className={styles.subTitle}>Paid subscription</h3>
              <p className={styles.p}>
                When your trial ends you can subscribe by card on the plan that
                suits you: monthly at {MONTHLY_PRICE} per month, or annually at{' '}
                {YEARLY_PRICE} per year.
                Card plans renew automatically through
                our secure payment provider until you cancel. Every plan unlocks
                the full app, including your AI personalised plan, automated daily
                missions, photo task check-ins, progress tracking, custom mission
                submissions, and priority support. Prices may change in future, and we will give existing
                subscribers notice before any change applies to them.
              </p>

              <h3 className={styles.subTitle}>Paying with crypto</h3>
              <p className={styles.p}>
                You can also pay with cryptocurrency on either plan. A crypto
                payment buys a fixed period of full access: thirty days for the
                monthly plan at {MONTHLY_PRICE}, or a year for the annual plan at{' '}
                {YEARLY_PRICE}, at the same prices as the card plans, and it does
                not renew on its own, because a crypto payment cannot auto-renew.
                We will remind you by email when your access is close to ending
                so you can renew if you wish.
              </p>

              <h3 className={styles.subTitle}>Buying through the mobile app</h3>
              <p className={styles.p}>
                Subscriptions are purchased and managed on our website. Our mobile
                app is a companion to your account: once your subscription is
                active, the app unlocks automatically. The app itself does not sell
                subscriptions.
              </p>

              <h3 className={styles.subTitle}>What your subscription supports</h3>
              <p className={styles.p}>
                Your payment keeps the platform running and improving. It funds
                the checks on your photo submissions, the people who handle
                support, and the ongoing work that keeps your missions relevant.
                Without paying members the service could not exist.
              </p>

              <h3 className={styles.subTitle}>Cancellation</h3>
              <p className={styles.p}>
                You can cancel your subscription at any time from your billing
                page. Your card plan stops renewing at the end of the period you
                already paid for, so you keep access until then. We do not bill
                you again after you cancel.
              </p>

              <h3 className={styles.subTitle}>Refunds</h3>
              <p className={styles.p}>
                Every card purchase comes with a full, unconditional 14-day
                money-back guarantee. If you request a refund within 14 days of a
                charge, for any reason and with no conditions, we will refund that
                payment in full. After 14 days, refunds are handled case by case,
                and we will still refund duplicate charges, a charge made after a
                cancellation that should have stopped billing, and any charge made
                in genuine error. Full details are in our{' '}
                <Link href="/refund" className={styles.link}>Refund Policy</Link>.
              </p>
              <p className={styles.p}>
                If you are a consumer in the European Union, the United Kingdom, or
                another region with a legal cooling-off period, you may also have a
                statutory right to cancel a purchase within fourteen days. Nothing
                in these terms removes any refund or cancellation right the law
                gives you, and our payment provider may also offer its own refund
                process.
              </p>
            </section>

            {/* 05 */}
            <section id="acceptable" className={styles.section}>
              <div className={styles.sectionNum}>05</div>
              <h2 className={styles.sectionTitle}>Acceptable Use</h2>

              <p className={styles.p}>
                You agree to use Gaming Reset honestly and in good faith. The
                platform runs on trust between you and our team. The following are
                not allowed:
              </p>

              <div className={styles.prohibitedList}>
                {[
                  'Submitting photo proof that does not honestly represent the task you completed, including reusing a photo that was already submitted',
                  'Creating fake accounts or misrepresenting who you are',
                  'Sharing your login details with anyone else',
                  'Trying to inflate your rating by any means other than completing genuine tasks',
                  'Using the platform to harm, harass, or deceive other members or our team',
                  'Trying to access, copy, reverse engineer, or interfere with any part of our systems',
                  'Uploading content that is illegal, offensive, or that violates the rights of others',
                  'Using the platform for any purpose other than your own progress',
                ].map((item, i) => (
                  <div key={i} className={styles.prohibitedItem}>
                    <span className={styles.prohibitedIcon}>×</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <p className={styles.p}>
                Breaking any of the above may lead to immediate closure of your
                account without a refund.
              </p>
            </section>

            {/* 06 */}
            <section id="ip" className={styles.section}>
              <div className={styles.sectionNum}>06</div>
              <h2 className={styles.sectionTitle}>Intellectual Property</h2>

              <h3 className={styles.subTitle}>Our platform</h3>
              <p className={styles.p}>
                Everything that makes up Gaming Reset, including the software, the
                design, our habit-change system, the rank structure, the scoring
                system, and the content our team creates, remains the property of
                Gaming Reset. While your subscription is active you receive a limited
                licence to use the platform that you cannot transfer or share.
              </p>

              <h3 className={styles.subTitle}>Your content</h3>
              <p className={styles.p}>
                You keep ownership of what you submit, including your onboarding
                answers, your photo submissions, and your custom mission text. By
                submitting it you allow us to store it, have it processed by our
                AI provider (for example to check a photo against its task), show
                it to our internal team, and use it to run and improve the
                platform. We will not publish or share your personal content
                without your consent.
              </p>

              <h3 className={styles.subTitle}>Third-party content</h3>
              <p className={styles.p}>
                The &quot;instead of gaming&quot; sections show titles, posters,
                and book covers that belong to their respective owners and to the
                third party services that provide them, including Google Books and
                public film, series, and anime databases. That content is not ours. It is shown for your
                convenience under those providers&apos; terms, and all rights in it
                remain with its owners.
              </p>

              <h3 className={styles.subTitle}>Feedback</h3>
              <p className={styles.p}>
                Any ideas, suggestions, or feedback you send us about the platform
                may be used to improve the service with no obligation to pay you or
                credit you.
              </p>
            </section>

            {/* 07 */}
            <section id="ai" className={styles.section}>
              <div className={styles.sectionNum}>07</div>
              <h2 className={styles.sectionTitle}>How Your Plan Is Created</h2>

              <p className={styles.p}>
                Gaming Reset uses a third party AI provider to build your plan
                during onboarding and to generate your daily missions over time.
                By using the platform you understand the following:
              </p>

              <p className={styles.p}>
                Your starting rank, your missions, your main quest, and your daily
                message are produced by that AI from the information you give us.
                They may not always be perfectly accurate, perfectly suited to your
                situation, or aligned with professional guidance.
              </p>

              <p className={styles.p}>
                Our team reviews and adjusts what the model produces, but we cannot
                promise that every mission or suggestion will be right for you. You
                are responsible for using your own judgement about whether a given
                mission fits your circumstances.
              </p>

              <p className={styles.p}>
                We are not liable for decisions you make based on content the
                platform generates.
              </p>
            </section>

            {/* 08 */}
            <section id="desktop" className={styles.section}>
              <div className={styles.sectionNum}>08</div>
              <h2 className={styles.sectionTitle}>The Desktop App</h2>

              <p className={styles.p}>
                Gaming Reset offers an optional desktop app for Windows. It is
                software you install on your own computer, so this section sets
                out the licence it is given to you under and exactly what it does
                to your machine. If you install it, this section applies to you in
                addition to the rest of these terms. If you do not install it,
                nothing here affects you.
              </p>

              <h3 className={styles.subTitle}>Your licence</h3>
              <p className={styles.p}>
                While your trial or subscription is active we grant you a personal,
                non-exclusive, non-transferable, revocable licence to install and
                use the desktop app on computers you own or control, for your own
                use. The app is licensed, not sold. We keep ownership of it and of
                every part of it. There is no separate charge for it and it is not
                sold separately; it is part of what your subscription already
                covers. When your access ends, the app stops watching, tracking,
                and interrupting, and this licence ends with it.
              </p>
              <p className={styles.p}>
                You may not copy or redistribute the app, sell or sublicense it,
                reverse engineer, decompile or disassemble it except where the law
                expressly allows that despite this restriction, remove or alter any
                notice in it, or modify it or work around it in order to keep
                features running without an active subscription.
              </p>

              <h3 className={styles.subTitle}>What it does on your computer</h3>
              <p className={styles.p}>
                It installs for your Windows user account only and does not ask for
                administrator rights. Once installed, and while your access is
                active, it does the following and nothing beyond it:
              </p>

              <div className={styles.featureList}>
                {[
                  'Starts with Windows and runs quietly in the system tray',
                  'Reads the names of the programs currently running, and the entries game launchers create in the Windows registry, so it can tell when a launcher or a game starts and stops',
                  'Opens its window at the moment a launcher or game starts, and holds the "I’ll play anyway" button for a few seconds so the moment does not pass unnoticed',
                  'Briefly pauses the game while that window is on screen, so it is not still loading while you decide, and always resumes it afterwards',
                  'Closes the game, or the launcher, when you choose to do something else instead',
                  'Closes your game launchers repeatedly, and keeps closing them, for as long as a block you started is running, including a block your own daily limit starts on your behalf',
                  'Measures how long you actually play, and keeps that measurement on your computer',
                ].map((item, i) => (
                  <div key={i} className={styles.featureItem}>
                    <span className={styles.featureDot} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <p className={styles.p}>
                It does not read your files, your screen, your keystrokes, or
                anything inside any other program. What it collects, what stays on
                your machine, and what is sent to us is set out in our{' '}
                <Link href="/privacy" className={styles.link}>Privacy Policy</Link>.
              </p>

              <h3 className={styles.subTitle}>Closing your game, and unsaved progress</h3>
              <p className={styles.p}>
                Closing the game for you is the feature, not a side effect. A
                decision to do something else does not survive alt-tabbing back to
                a game that is still running, which is why the app acts on it. It
                asks the game to close normally first and gives it time to save,
                and only forces it if the game does not respond.
              </p>

              <div className={styles.highlight}>
                Games do not all save the same way. A game closed part way through
                a match, a level, a download, or an update can lose progress that
                had not been saved, and being closed mid-match may carry a penalty
                inside that game. By installing the desktop app and choosing an
                alternative when it appears, you are asking us to do this, and you
                accept that risk. If losing unsaved progress would not be
                acceptable to you, do not install the desktop app.
              </div>

              <h3 className={styles.subTitle}>Blocks you set yourself</h3>
              <p className={styles.p}>
                The desktop app can hold your game launchers shut for a period you
                choose. This is the one part of Gaming Reset that restricts you
                rather than prompting you, so it is worth being exact about it. It
                is entirely optional, it is off until you switch it on, and only
                you can start it. There are two ways it starts.
              </p>
              <p className={styles.p}>
                The first is a block you start by hand, for one to twelve hours.
                While it runs, the app closes your game launchers as soon as they
                open, and keeps closing them until the time you set runs out. You
                can ask to end it early, and that request takes fifteen minutes to
                take effect. Those fifteen minutes are the point of the feature:
                the promise you made earlier is meant to outlast the urge you are
                having now. You can withdraw the request at any time before it
                lands.
              </p>
              <p className={styles.p}>
                The second is a daily limit you set in advance. You choose a number
                of hours, and once the app has measured more than that much play in
                a single day, it starts a block on its own and holds it until
                midnight in your own time zone, which is the moment the daily count
                resets. A limit you set for yourself cannot be ended early, and
                that is deliberate. A cap you can lift the moment it bites is not a
                cap, and the person best placed to overrule it is the person least
                able to judge it fairly at that exact moment. Set it while you are
                calm, and change it when you are calm.
              </p>
              <p className={styles.p}>
                A block never closes a game you are already playing. It closes
                launchers, so it stops the next session rather than ending the one
                in progress, and the daily limit will not pull you out of a match
                you are in the middle of. Closing a launcher can still interrupt a
                download, an update, or an install that launcher was running at the
                time.
              </p>

              <div className={styles.highlight}>
                A block is a commitment device, not a security control. The app
                installs for your Windows account only, without administrator
                rights, and it does not install a service or a driver, so quitting
                it from the system tray stops it acting on your PC. A block does
                survive closing the window, restarting the app, and rebooting: it
                is stored on your machine and restored on the next launch. We do
                not promise that a block cannot be defeated by someone determined
                to defeat it on their own computer, and you should not rely on it
                as though we did. It is friction you asked us to add, and that is
                all it is meant to be.
              </div>

              <h3 className={styles.subTitle}>Pausing a game, and anti-cheat</h3>
              <p className={styles.p}>
                While its window is open the app may pause the game so it does not
                carry on loading while you decide, and it resumes the game as soon
                as you answer. That resume does not depend on the app staying
                alive: it is scheduled to happen on its own even if the app is
                closed or crashes in the meantime.
              </p>
              <p className={styles.p}>
                The app deliberately never pauses a game when a kernel level
                anti-cheat is present, or when any anti-cheat we recognise is
                running on your PC. We do this because we take it seriously, but we
                cannot test every game and we cannot promise how any third party
                anti-cheat system will treat other software on your machine.
                Launchers, games, and anti-cheat systems are operated by companies
                we are not affiliated with, under their own terms, and we are not
                responsible for any action any of them takes against your account
                with them.
              </p>

              <h3 className={styles.subTitle}>Updates</h3>
              <p className={styles.p}>
                The desktop app checks for updates and can download and install
                them automatically, so that everyone is running a version we
                support and can fix. By installing it you consent to that. We may
                also stop supporting older versions.
              </p>

              <h3 className={styles.subTitle}>Requirements and uninstalling</h3>
              <p className={styles.p}>
                The desktop app requires Windows 10 or Windows 11 and an active
                Gaming Reset account. It depends on how third party launchers and
                games behave on your particular machine, and those change without
                notice, so we cannot promise that it will detect every game or work
                on every configuration.
              </p>
              <p className={styles.p}>
                You can quit it at any time from the tray, and uninstall it at any
                time from Windows Settings under Apps. Uninstalling it does not
                touch your account, your subscription, or anything you have done on
                the website or the mobile app.
              </p>
            </section>

            {/* 09 */}
            <section id="disclaimer" className={styles.section}>
              <div className={styles.sectionNum}>09</div>
              <h2 className={styles.sectionTitle}>Disclaimers and Liability</h2>

              <h3 className={styles.subTitle}>Service disclaimer</h3>
              <p className={styles.p}>
                Gaming Reset is provided as is and as available. We do not promise
                that the platform will always be online, that it will be free of
                errors, or that it will deliver the outcome you hope for.
                Results vary widely based on your effort, your consistency, and
                your circumstances.
              </p>

              <h3 className={styles.subTitle}>Not a medical service</h3>
              <p className={styles.p}>
                Gaming Reset is not a medical service, a therapy service, or a
                mental health treatment. Nothing on the platform is medical advice.
                Our team members are not licensed therapists, counsellors, or
                medical professionals. If you are dealing with any challenge that
                needs professional support, please seek proper care.
              </p>

              <h3 className={styles.subTitle}>Third-party content and links</h3>
              <p className={styles.p}>
                The &quot;instead of gaming&quot; sections rely on third party
                services to suggest things to watch and read, and may
                link out to those services. We do not control this content and do
                not guarantee that it will always be available, accurate, or
                suitable for you, and showing it is not an endorsement. When you
                follow a link to a third party service, that visit is governed by
                that service&apos;s own terms and privacy policy, and we are not
                responsible for it.
              </p>

              <h3 className={styles.subTitle}>Software on your own machine</h3>
              <p className={styles.p}>
                The desktop app is provided as is, on the same basis as the rest of
                the platform. To the fullest extent the law allows, we are not
                liable for unsaved game progress, in-game penalties, interrupted
                downloads or updates, or anything else lost when a game or launcher
                is closed at your request or under a block or daily limit you set,
                nor for time you could not play because a block you set was
                running, nor for the behaviour of third party launchers, games, or
                anti-cheat systems.
                Section 08 sets out what the app does and the risks you accept by
                installing it. Nothing in this paragraph limits any right you have
                as a consumer that cannot be limited by agreement.
              </p>

              <h3 className={styles.subTitle}>Limitation of liability</h3>
              <p className={styles.p}>
                To the fullest extent the law allows, Gaming Reset is not liable
                for any indirect, incidental, special, or consequential damage that
                arises from your use of or inability to use the platform. Our total
                liability in any case will never exceed what you paid us in the
                twelve months before the claim.
              </p>
            </section>

            {/* 10 */}
            <section id="termination" className={styles.section}>
              <div className={styles.sectionNum}>10</div>
              <h2 className={styles.sectionTitle}>Termination</h2>

              <h3 className={styles.subTitle}>Closing your account</h3>
              <p className={styles.p}>
                You can close your account at any time by contacting us. Your data
                is kept for thirty days and then permanently deleted.
              </p>

              <h3 className={styles.subTitle}>Termination by us</h3>
              <p className={styles.p}>
                We may suspend or permanently close your access if you break these
                terms, act dishonestly such as submitting false photo proof, fail
                to pay for your subscription, or behave in a way that harms the
                platform or other members. In serious cases the closure is immediate
                and without a refund.
              </p>

              <h3 className={styles.subTitle}>After termination</h3>
              <p className={styles.p}>
                Once your access ends your right to use the platform stops
                immediately. Parts of these terms that should naturally survive,
                such as the liability limits and the intellectual property clauses,
                stay in effect.
              </p>
            </section>

            {/* 11 */}
            <section id="changes" className={styles.section}>
              <div className={styles.sectionNum}>11</div>
              <h2 className={styles.sectionTitle}>Changes to These Terms</h2>
              <p className={styles.p}>
                We may update these Terms of Service at any time. For important
                changes we will email you at least fourteen days before they take
                effect. Smaller updates will show in the date at the top of this
                page.
              </p>
              <p className={styles.p}>
                If you keep using the platform after the effective date of any
                change, that counts as accepting the updated terms. If you disagree
                with a change you can close your account before it takes effect.
              </p>
            </section>

            {/* 12 */}
            <section id="governing" className={styles.section}>
              <div className={styles.sectionNum}>12</div>
              <h2 className={styles.sectionTitle}>Governing Law</h2>
              <p className={styles.p}>
                These terms follow applicable law. Any dispute about your use of
                Gaming Reset that cannot be settled by talking with us directly
                should be brought to the appropriate courts in your jurisdiction.
              </p>
              <p className={styles.p}>
                We encourage you to reach out to us before starting any formal
                legal action. Most issues can be solved through an honest
                conversation.
              </p>
            </section>

            {/* 13 */}
            <section id="contact" className={styles.section}>
              <div className={styles.sectionNum}>13</div>
              <h2 className={styles.sectionTitle}>Contact Us</h2>
              <p className={styles.p}>
                If you have questions about these terms or need to report a
                problem, please reach out.
              </p>

              <div className={styles.contactGrid}>
                <div className={styles.contactCard}>
                  <h3 className={styles.contactTitle}>Legal questions</h3>
                  <a href="mailto:legal@gamingreset.com" className={styles.contactValue}>
                    legal@gamingreset.com
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

              <p className={styles.p} style={{ marginTop: '28px', fontStyle: 'italic' }}>
                By using Gaming Reset you confirm that you have read, understood,
                and agree to be bound by these Terms of Service.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}
