import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/dealership-marketing', label: 'Dealership Marketing' },
  { to: '/car-rental-marketing', label: 'Car Rental Agency Marketing' },
  { to: '/drive-flow-ai', label: 'Drive Flow AI' },
  { to: '/dealer-sync', label: 'Dealer Sync' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-glass' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-extrabold tracking-tight">
          JVM<span className="text-gold">.</span>
        </Link>

        <div className="hidden lg:flex items-center gap-7">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-gold' : 'text-white/75 hover:text-white'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-white/75 hover:text-white">
            Log In
          </Link>
          <Link
            to="/contact"
            className="bg-gold-gradient text-charcoal text-sm font-semibold px-5 py-2.5 rounded-full shadow-gold hover:scale-105 transition-transform"
          >
            Book a Demo
          </Link>
        </div>

        <button
          className="lg:hidden text-white"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="lg:hidden glass px-6 pb-6 flex flex-col gap-4">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? 'text-gold' : 'text-white/80'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="text-sm font-medium text-white/80"
          >
            Log In
          </Link>
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="bg-gold-gradient text-charcoal text-sm font-semibold px-5 py-2.5 rounded-full text-center"
          >
            Book a Demo
          </Link>
        </div>
      )}
    </header>
  )
}
