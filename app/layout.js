import './globals.css'
import { Plus_Jakarta_Sans } from 'next/font/google'
import Header from './components/Header/Header'
import CookieBanner from './components/CookieBanner/CookieBanner'
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const SITE_URL = 'https://gamingreset.com'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Gaming Reset: Take Control of Your Gaming Habits',
    template: '%s | Gaming Reset',
  },
  // Fallback for any page that doesn't set its own. Kept under ~160 characters
  // so it isn't truncated in search results.
  description:
    'A personalized habit-change app to spend less time gaming: simple daily steps, automated tracking, and a plan built around your routine. 3-day free trial.',
  applicationName: 'Gaming Reset',
  keywords: [
    'gaming habits',
    'spend less time gaming',
    'cut back on gaming',
    'reduce screen time',
    'screen time app',
    'gaming habit tracker',
    'quit gaming',
    'digital wellbeing',
    'build better habits',
    'gaming self improvement',
  ],
  authors: [{ name: 'Gaming Reset' }],
  creator: 'Gaming Reset',
  publisher: 'Gaming Reset',
  category: 'productivity',
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: 'website',
    siteName: 'Gaming Reset',
    title: 'Gaming Reset: Take Control of Your Gaming Habits',
    description:
      'A personalized habit-change app to spend less time gaming: simple daily steps, automated daily tracking, and a 3-day free trial.',
    url: SITE_URL,
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Gaming Reset: take control of your gaming habits',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gaming Reset: Take Control of Your Gaming Habits',
    description:
      'A personalized habit-change app to spend less time gaming: simple daily steps, automated daily tracking, and a 3-day free trial.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.webmanifest',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jakarta.className}>
      <body suppressHydrationWarning>
        <Header />
        {children}
        <CookieBanner />
      </body>
    </html>
  )
}