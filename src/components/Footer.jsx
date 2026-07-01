import { Link } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/dealership-marketing', label: 'Dealership Marketing' },
  { to: '/car-rental-marketing', label: 'Car Rental Agency Marketing' },
  { to: '/drive-flow-ai', label: 'Drive Flow AI' },
  { to: '/dealer-sync', label: 'Dealer Sync' },
  { to: '/contact', label: 'Contact' },
]

export default function Footer() {
  return (
    <footer className="bg-charcoal border-t border-white/10 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
        <div>
          <div className="text-2xl font-extrabold mb-3">
            JVM<span className="text-gold">.</span>
          </div>
          <p className="text-white/50 text-sm">
            Helping Automotive Businesses Grow Through AI Automation.
          </p>
        </div>

        <div>
          <div className="text-sm font-semibold text-gold mb-4">Navigation</div>
          <ul className="space-y-2">
            {links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-sm text-white/60 hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-sm font-semibold text-gold mb-4">Contact</div>
          <ul className="space-y-2 text-sm text-white/60">
            <li>jonesvisionmedia.sales@gmail.com</li>
            <li>Mon–Fri, 9am–6pm</li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-semibold text-gold mb-4">Follow Us</div>
          <div className="flex gap-3">
            {['Facebook', 'Instagram', 'LinkedIn'].map((s) => (
              <a
                key={s}
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full glass text-xs text-white/70 hover:text-gold hover:border-gold/50"
              >
                {s[0]}
              </a>
            ))}
          </div>
          <Link
            to="/contact"
            className="inline-block mt-6 bg-gold-gradient text-charcoal text-sm font-semibold px-5 py-2.5 rounded-full"
          >
            Book a Demo
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-3 text-center text-xs text-white/40">
        <span>© {new Date().getFullYear()} Jones Vision Media. All rights reserved.</span>
        <span className="hidden sm:inline">·</span>
        <Link to="/privacy-policy" className="hover:text-white/70">
          DealerSync Privacy Policy
        </Link>
      </div>
    </footer>
  )
}
