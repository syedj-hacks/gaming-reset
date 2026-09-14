import CtaStrip from './sections/CtaStrip'
import Footer from './sections/Footer'

export default function MarketingLayout({ children }) {
  return (
    <div>
      <main>{children}</main>
      <CtaStrip />
      <Footer />
    </div>
  )
}