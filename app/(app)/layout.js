// Layout for the authenticated app surface (dashboard, onboarding, checkout,
// settings, leaderboard, success, admin).
//
// Its only job is metadata. These pages are private, thin, or duplicate-looking
// to a crawler, and one of them is the admin panel, so none of them belong in
// search results. `noindex` is set here rather than per page because almost all
// of them are `'use client'` components, and a client component cannot export
// `metadata`.
//
// Note this pairs with public/robots.txt: those paths are deliberately NOT
// Disallow'd there any more. Disallow blocks crawling, which would stop Google
// ever reading the noindex below and leave the URLs eligible to appear as bare
// links. To deindex a page, the crawler has to be allowed in to see the tag.
export const metadata = {
  robots: { index: false, follow: false },
}

export default function AppLayout({ children }) {
  return children
}
