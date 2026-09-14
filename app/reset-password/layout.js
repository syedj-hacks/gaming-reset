// Metadata-only layout. This page is a '\''use client'\'' component, which cannot
// export `metadata`, so the noindex lives here. Auth and account pages are thin
// and near-identical to a crawler, and they should never compete with the
// marketing pages in search. See app/(app)/layout.js for why these paths are no
// longer Disallow'\''d in robots.txt.
export const metadata = {
  robots: { index: false, follow: false },
}

export default function Layout({ children }) {
  return children
}
