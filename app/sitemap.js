import { SITE_URL, AUTHOR, getPublishedPosts } from './(marketing)/writing/posts'

// Real "last significant change" dates for the static routes, as YYYY-MM-DD.
//
// These used to be `new Date()`, i.e. the build timestamp, which meant every
// deploy restamped EVERY static page with a fresh lastmod even when nothing on
// that page had changed. Google's sitemap guidance is explicit: it uses lastmod
// "if it's consistently and verifiably (for example by comparing to the last
// modification of the page) accurate", and says an update that is not a real
// content change should not move it. A sitemap claiming all ten pages changed
// on every deploy teaches Google the value is noise, and it stops using it —
// which throws away the one crawl-scheduling hint a new site actually controls.
//
// MAINTENANCE: bump a date here only when that page's real content changes
// (copy, structured data, or its links). Do not touch them for styling, refactors
// or dependency bumps. Blog posts do not appear here; they carry their own
// publishedAt / updatedAt from posts.js.
const STATIC_LASTMOD = {
  '/': '2026-07-28',
  '/plans': '2026-07-28',
  '/gaming-addiction-statistics': '2026-07-28',
  '/gaming-time-calculator': '2026-07-28',
  '/contact': '2026-07-24',
  // Both bumped for the desktop app: privacy gained section 1.3 (what the app
  // reads, what stays on the machine, what is sent) and terms gained section 08,
  // the desktop licence. Real content changes, which is the bar set above.
  '/privacy': '2026-08-13',
  '/terms': '2026-08-13',
  '/refund': '2026-07-27',
}

// Parsed at UTC midnight so the emitted date is stable regardless of the build
// machine's timezone. A date that shifts by a day depending on where the build
// ran is exactly the kind of inconsistency the note above is about.
function lastmod(path) {
  const d = STATIC_LASTMOD[path]
  return d ? new Date(`${d}T00:00:00Z`) : new Date()
}

export default function sitemap() {
  const posts = getPublishedPosts()

  // Newest published article — used as the /writing index's lastModified so the
  // listing page's freshness reflects real content changes, not deploy time.
  const latestPost = posts.reduce((latest, p) => {
    const d = new Date(p.updatedAt || p.publishedAt)
    return d > latest ? d : latest
  }, new Date(0))

  // The author page lists the same posts, so it changes when they do.
  const listingLastmod = posts.length ? latestPost : lastmod('/')

  const staticRoutes = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly', lastModified: lastmod('/') },
    { path: '/plans', priority: 0.9, changeFrequency: 'monthly', lastModified: lastmod('/plans') },
    {
      path: '/gaming-addiction-statistics',
      priority: 0.7,
      changeFrequency: 'monthly',
      lastModified: lastmod('/gaming-addiction-statistics'),
    },
    // Free interactive tool. Same priority as the statistics page: both are
    // cornerstone, link-earning assets rather than ordinary content.
    {
      path: '/gaming-time-calculator',
      priority: 0.7,
      changeFrequency: 'monthly',
      lastModified: lastmod('/gaming-time-calculator'),
    },
    {
      path: '/writing',
      priority: 0.7,
      changeFrequency: 'weekly',
      lastModified: listingLastmod,
    },
    {
      path: `/writing/author/${AUTHOR.slug}`,
      priority: 0.4,
      changeFrequency: 'monthly',
      lastModified: listingLastmod,
    },
    { path: '/contact', priority: 0.5, changeFrequency: 'yearly', lastModified: lastmod('/contact') },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly', lastModified: lastmod('/privacy') },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly', lastModified: lastmod('/terms') },
    { path: '/refund', priority: 0.3, changeFrequency: 'yearly', lastModified: lastmod('/refund') },
  ]

  // Every published blog post, stamped with its real published/updated date.
  const postRoutes = posts.map((post) => ({
    path: `/writing/${post.slug}`,
    priority: 0.6,
    changeFrequency: 'monthly',
    lastModified: new Date(post.updatedAt || post.publishedAt),
  }))

  return [...staticRoutes, ...postRoutes].map(
    ({ path, priority, changeFrequency, lastModified }) => ({
      url: `${SITE_URL}${path}`,
      lastModified,
      changeFrequency,
      priority,
    })
  )
}
