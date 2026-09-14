import ContactForm from './ContactForm'

const SITE_URL = 'https://gamingreset.com'

export const metadata = {
  title: 'Contact: Talk to a Real Person',
  description:
    'Questions about your plan, billing, or anything else? Send Gaming Reset a message and a real human on our team will get back to you, usually within a few hours.',
  alternates: { canonical: '/contact' },
  openGraph: {
    type: 'website',
    siteName: 'Gaming Reset',
    title: 'Contact: Talk to a Real Person | Gaming Reset',
    description:
      'Send us a message and a real human on our team will get back to you, usually within a few hours.',
    url: `${SITE_URL}/contact`,
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Contact Gaming Reset',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact: Talk to a Real Person | Gaming Reset',
    description: 'Send us a message and a real human will get back to you.',
    images: ['/og-image.png'],
  },
}

const contactSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ContactPage',
      '@id': `${SITE_URL}/contact#webpage`,
      url: `${SITE_URL}/contact`,
      name: 'Contact | Gaming Reset',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en',
      breadcrumb: { '@id': `${SITE_URL}/contact#breadcrumb` },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${SITE_URL}/contact#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Contact', item: `${SITE_URL}/contact` },
      ],
    },
  ],
}

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <ContactForm />
    </>
  )
}
