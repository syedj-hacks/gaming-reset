import Link from 'next/link'
import styles from './privacy.module.css'

export const metadata = {
  // No "| Gaming Reset" suffix here: the root layout's title template appends
  // it already, and including it produced "Privacy Policy | Gaming Reset | Gaming Reset".
  title: 'Privacy Policy',
  description:
    'What Gaming Reset collects, why we collect it, who we share it with, and how we protect it. Your rights, data retention, and how your plan is generated.',
  alternates: { canonical: '/privacy' },
}

const SECTIONS = [
  { id: 'information', num: '01', title: 'Information We Collect' },
  { id: 'use',         num: '02', title: 'How We Use Your Information' },
  { id: 'sharing',     num: '03', title: 'How We Share Your Information' },
  { id: 'processors',  num: '04', title: 'Our Service Providers' },
  { id: 'cookies',     num: '05', title: 'Cookies and Local Storage' },
  { id: 'transfers',   num: '06', title: 'International Data Transfers' },
  { id: 'security',    num: '07', title: 'Data Security' },
  { id: 'retention',   num: '08', title: 'Data Retention' },
  { id: 'rights',      num: '09', title: 'Your Rights and Choices' },
  { id: 'ai',          num: '10', title: 'How We Generate Your Plan' },
  { id: 'children',    num: '11', title: "Children's Privacy" },
  { id: 'changes',     num: '12', title: 'Changes to This Policy' },
  { id: 'contact',     num: '13', title: 'Contact Us' },
]

export default function PrivacyPage() {
  return (
    <div className={styles.page}>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroMesh} />
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>Legal · Privacy</p>
          <h1 className={styles.heroTitle}>Privacy policy.</h1>
          <p className={styles.heroSub}>
            Your data belongs to you. This policy explains what we collect, why
            we collect it, who we share it with, and how we protect it.
          </p>
          <div className={styles.badges}>
            <span className={styles.badge}>GDPR aware</span>
            <span className={styles.badge}>No data selling</span>
            <span className={styles.badge}>Human reviewed</span>
          </div>
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
            <section id="information" className={styles.section}>
              <div className={styles.sectionNum}>01</div>
              <h2 className={styles.sectionTitle}>Information We Collect</h2>

              <h3 className={styles.subTitle}>Who we are</h3>
              <p className={styles.p}>
                Gaming Reset (&quot;we&quot;, &quot;us&quot;, the operator of
                gamingreset.com, the Gaming Reset mobile app, and the Gaming Reset
                desktop app for Windows) provides this
                platform and is the controller responsible for your personal data.
                This policy applies to all three: our website, our mobile app, and
                our desktop app. You can
                reach the operator at{' '}
                <a href="mailto:privacy@gamingreset.com" className={styles.link}>
                  privacy@gamingreset.com
                </a>
                . If you are in the EU, UK, or another region with data
                protection law, this policy and the rights below apply to you.
              </p>

              <h3 className={styles.subTitle}>1.1 Information You Provide</h3>
              <p className={styles.p}>
                When you create an account we collect your email address. During
                onboarding we collect more detail that you choose to share,
                including your name, your age, daily gaming hours, how your
                gaming usually happens, whether you play with friends and when,
                your life situation, a description of your typical day, and what
                you would like to do with your time instead of gaming. We use
                this only to build your personalised daily plan.
              </p>
              <p className={styles.p}>
                As you use the dashboard we collect the photo proof you upload for
                completed tasks, the daily gaming hours you log, the custom mission
                text you write, your urge check-in outcomes, and any
                suggestions or feedback you send. On our mobile app, adding photo
                proof uses your device&apos;s camera or photo library, which the
                app accesses only at the moment you choose to attach a photo.
              </p>
              <p className={styles.p}>
                Our team may also send you a direct message inside the app. If you
                write a reply, we collect and store that reply so we can read it
                and support you. These messages are private between you and our
                team.
              </p>

              <div className={styles.highlight}>
                Some of what you share (details about your gaming habits,
                your state of mind, and your personal circumstances) is sensitive
                information. By choosing to provide it during onboarding, you
                explicitly consent to us processing it, and to sharing the
                relevant parts with our AI provider, for the single purpose of
                building and maintaining your personalised daily plan. You can
                withdraw this consent at any time by deleting your account.
              </div>

              <h3 className={styles.subTitle}>1.2 Information Collected Automatically</h3>
              <p className={styles.p}>
                We collect your device timezone so your daily missions appear on
                the correct calendar day. Our hosting and security providers
                process basic technical data such as your IP address, browser
                type, and the pages you open, in order to deliver the site and
                protect it from abuse.
              </p>
              <p className={styles.p}>
                To keep the service stable, our diagnostics provider records
                technical error and crash reports when something goes wrong. These
                can include your IP address, your device or browser type, the app
                version, and the technical details of the error. On our mobile app
                we also process the basic device information needed to run the app
                and to schedule the daily reminder notifications you choose to turn
                on, which are generated locally on your device. For traffic
                measurement we use Vercel Web Analytics, a privacy-friendly,
                cookieless tool that counts aggregate page views and visits. It
                sets no cookies, does not identify you, does not track you across
                other websites, and is never used for advertising.
              </p>

              <h3 className={styles.subTitle}>1.3 The Desktop App for Windows</h3>
              <p className={styles.p}>
                Our optional desktop app runs on your Windows PC and starts with
                Windows, so it can step in at the moment you open a game rather
                than waiting for you to open something. Because it runs on your
                machine instead of in a browser, it is worth being exact about
                what it looks at, what never leaves your computer, and what is
                actually sent to us.
              </p>

              <div className={styles.cardGrid}>
                {[
                  {
                    title: 'What it reads on your PC',
                    body: 'The names of the programs currently running, so it can tell when a game launcher or a game starts and stops, and the entries game launchers create in the Windows registry, so it knows which launchers are installed and can name the game you opened. It reads names only. It does not read your files, your screen, your keystrokes, your browsing, your microphone, or anything inside any other program.',
                  },
                  {
                    title: 'What stays on your computer',
                    body: 'Your measured play sessions are written to a file in the app’s own folder and are not sent to us. Your app settings are stored the same way, including your daily limit and any block you have running, which is why a block survives a restart. Your sign-in token is stored encrypted using Windows’ own encryption, tied to your Windows account. Removing the app and its data folder removes all of it.',
                  },
                  {
                    title: 'What is sent to us',
                    body: 'When the app steps in, it records that an interrupt happened: which launcher or game it was about, and whether you chose an alternative or chose to play. It also loads your missions, streak, and daily target from your account, which is the same data the website and the mobile app load. Nothing else about your PC is transmitted.',
                  },
                  {
                    title: 'Diagnostics',
                    body: 'If the desktop app hits an error, our diagnostics provider records the technical details of it, the app version, and your account identifier, so we can find and fix it. File paths have your Windows user folder stripped out before they are sent, and we have switched off the memory snapshots and local variable capture that this kind of tool can otherwise collect.',
                  },
                ].map((card) => (
                  <div key={card.title} className={styles.infoCard}>
                    <h3 className={styles.infoCardTitle}>{card.title}</h3>
                    <p className={styles.infoCardBody}>{card.body}</p>
                  </div>
                ))}
              </div>

              <p className={styles.p}>
                The desktop app also acts on your PC, but only in the ways you ask
                it to: it can briefly pause a game while its window is on screen,
                it can close that game or launcher for you when you choose to do
                something else instead, and it can hold your game launchers shut
                for the length of a block you started or once a daily limit you set
                is reached. None of that is data collection. A block is decided and
                stored entirely on your own machine, so switching one on tells us
                nothing about you. All of it is described in full in our{' '}
                <Link href="/terms#desktop" className={styles.link}>
                  Terms of Service
                </Link>
                .
              </p>

              <h3 className={styles.subTitle}>1.4 Payment Information</h3>
              <p className={styles.p}>
                Payments are handled by established payment providers. When you
                subscribe with a card, the provider processes the charge and we
                never see or store your full card number. When you pay with crypto,
                the transaction is handled by a crypto payment provider. We keep
                only the minimal record needed to confirm your access, such as your
                plan status and renewal date.
              </p>
            </section>

            {/* 02 */}
            <section id="use" className={styles.section}>
              <div className={styles.sectionNum}>02</div>
              <h2 className={styles.sectionTitle}>How We Use Your Information</h2>

              <div className={styles.cardGrid}>
                {[
                  {
                    title: 'Daily Plan Generation',
                    body: 'Your onboarding answers are sent to our third party AI provider to build a personalised starting rank, primary quest, daily missions, and a first daily message for your situation.',
                  },
                  {
                    title: 'Daily Mission Delivery',
                    body: 'Your profile data, timezone, and past task history are used to generate and schedule daily missions that match your progress and difficulty.',
                  },
                  {
                    title: 'Photo Task Check-in',
                    body: 'Photos you upload as proof for a task are checked by our AI provider against the task they are for, so the task can count toward your rating in the app. Any photo it cannot confirm is checked by a person on our team. It is one feature of the product, alongside the automated plan, missions, and tracking.',
                  },
                  {
                    title: 'Progress Tracking',
                    body: 'We store your rating history, task records, streak counts, and gaming hours so you can see your progress over time and so we can work out your rank.',
                  },
                  {
                    title: 'Account and Service Management',
                    body: 'Your email and subscription status let us manage your account, send important service messages, and set your access level.',
                  },
                  {
                    title: 'Platform Improvement',
                    body: 'Aggregated and anonymised patterns help us learn which missions work, what completion looks like, and how to make the system better.',
                  },
                ].map((card) => (
                  <div key={card.title} className={styles.infoCard}>
                    <h3 className={styles.infoCardTitle}>{card.title}</h3>
                    <p className={styles.infoCardBody}>{card.body}</p>
                  </div>
                ))}
              </div>

              <h3 className={styles.subTitle}>Our legal bases</h3>
              <p className={styles.p}>
                Where data protection law such as the GDPR applies, we rely on the
                following legal bases: your explicit consent for your onboarding
                answers and any sensitive information; the performance of our
                contract with you to run your account and subscription; and our
                legitimate interest in keeping the platform secure and improving
                the service. Where we rely on consent, you can withdraw it at any
                time.
              </p>
            </section>

            {/* 03 */}
            <section id="sharing" className={styles.section}>
              <div className={styles.sectionNum}>03</div>
              <h2 className={styles.sectionTitle}>How We Share Your Information</h2>

              <div className={styles.highlight}>
                We do not sell your personal information. We never have and we never will.
              </div>

              <h3 className={styles.subTitle}>Service providers</h3>
              <p className={styles.p}>
                We share the minimum information needed with the trusted companies
                that run our infrastructure, generate your plan, and process your
                payments. Each is listed by name in the next section, along with
                what it does and why. These providers act on our instructions and
                may not use your data for their own purposes.
              </p>

              <h3 className={styles.subTitle}>Legal requirements</h3>
              <p className={styles.p}>
                We may share your information if the law, a valid court order, or a
                government authority requires it. Where we are legally allowed, we
                will tell you about such requests.
              </p>

              <h3 className={styles.subTitle}>Business transfers</h3>
              <p className={styles.p}>
                If Gaming Reset is acquired by or merges with another company, your
                information may move as part of that deal. We will tell you before
                any such transfer takes effect.
              </p>
            </section>

            {/* 04 */}
            <section id="processors" className={styles.section}>
              <div className={styles.sectionNum}>04</div>
              <h2 className={styles.sectionTitle}>Our Service Providers</h2>

              <p className={styles.p}>
                These are the third party companies (sub-processors) that help us
                run Gaming Reset. We share only the data each one needs for its
                specific role.
              </p>

              <div className={styles.cardGrid}>
                {[
                  {
                    title: 'Supabase',
                    body: 'Our database, account authentication, and file storage. It holds your profile, your progress, and the photo proof you upload. Data is hosted on managed cloud infrastructure.',
                  },
                  {
                    title: 'AI Provider',
                    body: 'Our third party AI provider generates your daily plan and daily missions from your onboarding answers and first name, and checks the photo proof you upload against the task it is for. Your email, payment details, and account identifiers are never sent. Our AI provider does not use data sent through its API to train its models.',
                  },
                  {
                    title: 'Paddle',
                    body: 'Our card payment processor and Merchant of Record. Paddle is the seller of record for card subscriptions and handles your card details under its own security and privacy terms. We never see your full card number.',
                  },
                  {
                    title: 'NOWPayments',
                    body: 'Our cryptocurrency payment processor. When you choose to pay with crypto, NOWPayments handles the transaction under its own terms.',
                  },
                  {
                    title: 'Vercel',
                    body: 'Hosts and delivers the website, and provides Vercel Web Analytics. It processes basic request data such as your IP address and browser type to serve pages and keep the platform online. Web Analytics is a privacy-friendly, cookieless measurement of aggregate page views and visits: it sets no cookies, does not identify you, and is never used to track you across other websites or for advertising.',
                  },
                  {
                    title: 'Upstash',
                    body: 'Provides rate limiting that protects the platform from abuse. It may briefly process your IP address or account identifier for that purpose.',
                  },
                  {
                    title: 'Sentry',
                    body: 'Our error and crash monitoring provider for the website, the mobile app, and the desktop app. When something breaks, Sentry records the technical details of the error, which can include your IP address, device or browser type, and the app version, so we can find and fix it. It is used for diagnostics only, never for advertising or analytics.',
                  },
                ].map((card) => (
                  <div key={card.title} className={styles.infoCard}>
                    <h3 className={styles.infoCardTitle}>{card.title}</h3>
                    <p className={styles.infoCardBody}>{card.body}</p>
                  </div>
                ))}
              </div>

              <h3 className={styles.subTitle}>Third-party content</h3>
              <p className={styles.p}>
                The dashboard includes optional &quot;instead of gaming&quot;
                sections that suggest things to watch and read. The titles,
                posters, and book covers shown there are fetched from third party
                catalogue services, including Google Books for books and public
                film, series, and anime databases. We do not send these services
                your name, email, or account details.
              </p>
              <p className={styles.p}>
                When your browser or our app loads an image from one of these
                services, your device connects to that provider
                directly. This means your IP address and basic technical data, such
                as your device or browser type, are visible to them, in the same
                way they would be if you opened their own website. That data is
                handled under each provider&apos;s own privacy policy. These
                sections are optional, and you can simply choose not to use them.
              </p>
            </section>

            {/* 05 */}
            <section id="cookies" className={styles.section}>
              <div className={styles.sectionNum}>05</div>
              <h2 className={styles.sectionTitle}>Cookies and Local Storage</h2>

              <p className={styles.p}>
                We keep our use of cookies and browser storage to the minimum
                needed to run the service. We do not use advertising cookies,
                marketing pixels, or cross-site tracking. Our traffic analytics
                (Vercel Web Analytics) is cookieless and stores nothing on your
                device.
              </p>

              <div className={styles.cardGrid}>
                {[
                  {
                    title: 'Authentication',
                    body: 'When you log in, our authentication provider stores a secure session so you stay signed in between visits. Clearing it will simply log you out.',
                  },
                  {
                    title: 'Consent preference',
                    body: 'A small value in your browser remembers that you have seen our privacy notice, so we do not show it on every visit.',
                  },
                  {
                    title: 'No tracking',
                    body: 'We do not set cookies to follow you across other websites or to build an advertising profile. Our traffic analytics is cookieless and measures only aggregate, anonymous visits.',
                  },
                  {
                    title: 'Desktop app files',
                    body: 'The desktop app is not a browser and sets no cookies. It keeps three things in its own folder on your PC: your settings, your measured play sessions, and your sign-in token, which is encrypted with Windows’ own encryption. Uninstalling the app and deleting that folder clears all of it.',
                  },
                ].map((card) => (
                  <div key={card.title} className={styles.infoCard}>
                    <h3 className={styles.infoCardTitle}>{card.title}</h3>
                    <p className={styles.infoCardBody}>{card.body}</p>
                  </div>
                ))}
              </div>

              <p className={styles.p}>
                Because the storage we use is strictly necessary to deliver the
                service, it does not require tracking consent. You can clear
                cookies and local storage at any time through your browser
                settings, though doing so will sign you out.
              </p>
            </section>

            {/* 06 */}
            <section id="transfers" className={styles.section}>
              <div className={styles.sectionNum}>06</div>
              <h2 className={styles.sectionTitle}>International Data Transfers</h2>

              <p className={styles.p}>
                Gaming Reset serves members around the world, and the providers
                listed above operate from different countries, including the
                United States. This means your personal information may be
                transferred to, stored in, or processed in countries outside the
                one where you live, including countries whose data protection laws
                differ from your own.
              </p>
              <p className={styles.p}>
                Where we transfer personal data out of the EU, the UK, or another
                region with transfer rules, we rely on appropriate safeguards such
                as the European Commission&apos;s Standard Contractual Clauses, or
                an equivalent mechanism offered by the provider, to keep your data
                protected to the same standard.
              </p>
            </section>

            {/* 07 */}
            <section id="security" className={styles.section}>
              <div className={styles.sectionNum}>07</div>
              <h2 className={styles.sectionTitle}>Data Security</h2>

              <p className={styles.p}>
                We take security seriously because what you share with us is personal.
              </p>

              <div className={styles.cardGrid}>
                {[
                  {
                    title: 'Row Level Security',
                    body: 'Every table in our database enforces Row Level Security. Your records are reachable only by you and our admin team. Other members cannot read your data even with a valid account.',
                  },
                  {
                    title: 'Encrypted in Transit',
                    body: 'All traffic between your browser and our servers uses HTTPS. Data sent to our storage and processing providers is encrypted while in transit.',
                  },
                  {
                    title: 'Server Side Secrets',
                    body: 'API keys, service credentials, and admin passwords are never exposed to the browser. Every sensitive action runs through server side routes only.',
                  },
                  {
                    title: 'Authenticated Access',
                    body: 'Your account is protected by a managed authentication system with secure session handling. We support password reset and ask you to use a strong password.',
                  },
                ].map((card) => (
                  <div key={card.title} className={styles.infoCard}>
                    <h3 className={styles.infoCardTitle}>{card.title}</h3>
                    <p className={styles.infoCardBody}>{card.body}</p>
                  </div>
                ))}
              </div>

              <p className={styles.p}>
                If a data breach ever affects your personal information, we will
                notify the people affected and, where required, the relevant
                authority within seventy two hours, and explain what happened and
                what we are doing about it.
              </p>
            </section>

            {/* 08 */}
            <section id="retention" className={styles.section}>
              <div className={styles.sectionNum}>08</div>
              <h2 className={styles.sectionTitle}>Data Retention</h2>

              <p className={styles.p}>
                We keep your data for as long as your account is active and for a
                short time afterwards so you can return or so we can meet legal
                duties.
              </p>

              <div className={styles.retentionGrid}>
                {[
                  { label: 'Account data', period: '30 days after closure', note: 'Kept so you can return, then permanently deleted.' },
                  { label: 'Task and rating history', period: 'Duration of account', note: 'Deleted permanently when your account is removed.' },
                  { label: 'Photo submissions', period: '7 days after upload', note: 'The photo file is deleted 7 days after upload once it has been checked. The record of the check (the task, the result, and a fingerprint of the photo that stops it being submitted again) is kept until your account is removed.' },
                  { label: 'Onboarding answers', period: 'Duration of account', note: 'Deleted when your account is removed.' },
                  { label: 'Support messages', period: 'Duration of account', note: 'Messages with our team are deleted with your account.' },
                  { label: 'Desktop app data on your PC', period: 'Until you remove it', note: 'Measured play sessions, settings, and your encrypted sign-in token never reach our servers, so deleting them means uninstalling the app and clearing its data folder.' },
                ].map((row) => (
                  <div key={row.label} className={styles.retentionRow}>
                    <div>
                      <span className={styles.retentionLabel}>{row.label}</span>
                      <span className={styles.retentionNote}>{row.note}</span>
                    </div>
                    <span className={styles.retentionPeriod}>{row.period}</span>
                  </div>
                ))}
              </div>

              <p className={styles.p}>
                You can ask us to delete your account and all of its data at any
                time. We will finish the deletion within thirty days of your request.
              </p>
            </section>

            {/* 09 */}
            <section id="rights" className={styles.section}>
              <div className={styles.sectionNum}>09</div>
              <h2 className={styles.sectionTitle}>Your Rights and Choices</h2>

              <p className={styles.p}>
                Depending on where you live, you have the following rights over
                your personal information.
              </p>

              <div className={styles.rightsList}>
                {[
                  { right: 'Access', desc: 'Ask for a copy of all the personal information we hold about you.' },
                  { right: 'Correction', desc: 'Ask us to fix anything inaccurate in your profile.' },
                  { right: 'Deletion', desc: 'Ask us to delete your account and all of its data.' },
                  { right: 'Portability', desc: 'Ask for an export of your data in a readable format.' },
                  { right: 'Withdraw consent', desc: 'Withdraw your consent to processing your onboarding and sensitive data at any time.' },
                  { right: 'Opt out', desc: 'Unsubscribe from any marketing or optional messages at any time.' },
                  { right: 'Restriction', desc: 'Ask us to limit how we process your information.' },
                  { right: 'Complain', desc: 'Lodge a complaint with your local data protection authority if you believe we have mishandled your data.' },
                ].map((item) => (
                  <div key={item.right} className={styles.rightItem}>
                    <span className={styles.rightLabel}>{item.right}</span>
                    <span className={styles.rightDesc}>{item.desc}</span>
                  </div>
                ))}
              </div>

              <p className={styles.p}>
                To use any of these rights, email us at{' '}
                <a href="mailto:privacy@gamingreset.com" className={styles.link}>
                  privacy@gamingreset.com
                </a>
                . We will reply within thirty days.
              </p>
            </section>

            {/* 10 */}
            <section id="ai" className={styles.section}>
              <div className={styles.sectionNum}>10</div>
              <h2 className={styles.sectionTitle}>How We Generate Your Plan</h2>

              <p className={styles.p}>
                Gaming Reset uses a third party AI provider to create your
                personalised plan during onboarding and to build your daily
                missions over time. We want to be clear about how this works.
              </p>

              <h3 className={styles.subTitle}>What the AI receives</h3>
              <p className={styles.p}>
                During onboarding, your answers about your gaming habits, life
                situation, goals, and typical day are sent to our AI provider.
                Your first name is included so the plan feels personal.
                Your email, your payment details, and your account identifiers are
                never part of this. Our AI provider does not use data sent through
                its API to train its models.
              </p>
              <p className={styles.p}>
                When you upload photo proof for a task, the photo and the text of
                that task are sent to our AI provider once a day so it can check
                that the photo matches the task. Nothing else about you is
                included. Any photo the AI cannot confirm is checked by a person
                on our team instead.
              </p>
              <p className={styles.p}>
                To keep missions relevant, your life situation, goals, recent task
                history, and completion rates are processed when new missions are
                built. Identifying contact details are never included.
              </p>

              <h3 className={styles.subTitle}>Model limitations</h3>
              <p className={styles.p}>
                Generated content, including your starting rank, your missions, and
                your daily message, is built from patterns, not from knowledge of
                you as a person. It may not always be perfectly accurate or suited
                to your exact situation.
              </p>

              <div className={styles.highlight}>
                Gaming Reset is not a mental health service or a substitute for
                professional support. If you are facing serious mental health
                difficulties, please seek qualified professional help.
              </div>
            </section>

            {/* 11 */}
            <section id="children" className={styles.section}>
              <div className={styles.sectionNum}>11</div>
              <h2 className={styles.sectionTitle}>Children&apos;s Privacy</h2>

              <p className={styles.p}>
                Gaming Reset is built to help people of many ages spend less time
                gaming, including teenagers. We do not knowingly collect personal
                information from children under the age of 13, and the platform is
                not intended for them.
              </p>
              <p className={styles.p}>
                Because onboarding asks for personal and sensitive information,
                younger members deserve extra protection. If you are between 13 and
                18, you should use Gaming Reset with the knowledge and involvement
                of a parent or guardian. In some countries the law sets a higher
                minimum age for giving consent to online services on your own
                (for example 16 in parts of the European Union). Where that
                applies, a parent or guardian must review this policy and give
                consent on the young person&apos;s behalf before the account is
                used.
              </p>
              <p className={styles.p}>
                Parents and guardians can contact us at any time to review, correct,
                or delete the information held about a child in their care, or to
                withdraw consent. If you believe a child under 13, or a minor
                without the required parental consent, has given us personal
                information, please contact{' '}
                <a href="mailto:privacy@gamingreset.com" className={styles.link}>
                  privacy@gamingreset.com
                </a>{' '}
                and we will delete it promptly.
              </p>
            </section>

            {/* 12 */}
            <section id="changes" className={styles.section}>
              <div className={styles.sectionNum}>12</div>
              <h2 className={styles.sectionTitle}>Changes to This Policy</h2>

              <p className={styles.p}>
                We may update this Privacy Policy from time to time. When we do, we
                will update the date at the top of this page. For important changes
                that affect how we handle your data, we will email you at least
                fourteen days before they take effect.
              </p>
              <p className={styles.p}>
                If you keep using Gaming Reset after a policy update, that counts as
                accepting the revised policy. If you disagree with a change, you can
                delete your account before it takes effect.
              </p>
            </section>

            {/* 13 */}
            <section id="contact" className={styles.section}>
              <div className={styles.sectionNum}>13</div>
              <h2 className={styles.sectionTitle}>Contact Us</h2>

              <p className={styles.p}>
                If you have questions about this Privacy Policy or how we handle
                your data, please reach out.
              </p>

              <div className={styles.contactGrid}>
                <div className={styles.contactCard}>
                  <h3 className={styles.contactTitle}>Privacy questions</h3>
                  <a href="mailto:privacy@gamingreset.com" className={styles.contactValue}>
                    privacy@gamingreset.com
                  </a>
                  <p className={styles.contactNote}>Response within 30 days</p>
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
