import Link from 'next/link'
import BrandLogo from '../../components/BrandLogo/BrandLogo'
import { getPublishedPosts } from '../writing/posts'
import styles from './Footer.module.css'

// The writing column shows only the newest few posts, not every article. Listing
// all of them made the footer long and cluttered, and a wall of blog links reads
// worse than a tight, current selection plus a link to the full index.
const FOOTER_POST_LIMIT = 3

const writingLinks = [
  ...getPublishedPosts()
    .slice()
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, FOOTER_POST_LIMIT)
    .map((post) => ({
      label: post.navLabel || post.title,
      href: `/writing/${post.slug}`,
    })),
  // Not a /writing blog post, so it does not count toward the 3-post cap; kept
  // because it is a cornerstone page worth a sitewide link.
  //
  // The calculator is deliberately NOT here: it moved to the header nav, which
  // is a stronger internal link than a footer slot anyway. It keeps its sitemap
  // entry and the contextual link from the statistics page.
  { label: 'Gaming Addiction Statistics', href: '/gaming-addiction-statistics' },
  { label: 'All writing →', href: '/writing' },
]

// Dashboard used to be linked here on every page. It is a logged-in-only route
// that is now noindex, it means nothing to a signed-out visitor, and signed-in
// users reach it from the header. "Free Trial" also pointed at /login, which is
// the wrong destination for someone who does not have an account yet.
const LINKS = {
  'Product': [
    { label: 'How It Works',     href: '/#how-it-works' },
    { label: 'Pricing',          href: '/plans' },
    // /signup, not /onboarding — see the note in CtaStrip.js.
    { label: 'Start Free Trial', href: '/signup' },
    { label: 'Contact',          href: '/contact' },
  ],
  'Writing': writingLinks,
  'Legal': [
    { label: 'Privacy Policy',   href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Refund Policy',    href: '/refund' },
  ],
}

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>

          <div className={styles.brand}>
            <Link href="/" className={styles.logo} aria-label="Gaming Reset home">
              <BrandLogo size={24} />
            </Link>
            <p className={styles.desc}>
              A personalised habit-change app for people who play too much. Built around the design that makes games so easy to overplay.
            </p>
            <a
              href="https://www.instagram.com/gamingreset1/"
              className={styles.social}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Gaming Reset on Instagram"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              <span>Follow on Instagram</span>
            </a>
          </div>

          {Object.entries(LINKS).map(([heading, links]) => (
            <div key={heading} className={styles.col}>
              <h3>{heading}</h3>
              {/* next/link, not a raw anchor: these are the most-clicked links
                  on the site and a plain <a> forced a full page reload on each. */}
              {links.map((l) => (
                <Link key={l.label} href={l.href}>{l.label}</Link>
              ))}
            </div>
          ))}
        </div>

        <div className={styles.floor}>
          <p className={styles.disclaimer}>
            Gaming Reset is a self-improvement and habit-building software tool.
            It is not a medical or therapeutic service and is not a substitute
            for professional medical or psychological advice, diagnosis, or
            treatment.
          </p>
          <p className={styles.copy}>© 2026 Gaming Reset. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}