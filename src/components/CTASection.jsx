import { Link } from 'react-router-dom'
import ScrollReveal from './ScrollReveal'

export default function CTASection({ title, subtitle, buttonText = 'Book a Demo' }) {
  return (
    <section className="py-24 px-6">
      <ScrollReveal>
        <div className="max-w-3xl mx-auto text-center glass rounded-3xl p-12 shadow-gold">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          {subtitle && <p className="text-white/70 mb-8 max-w-xl mx-auto">{subtitle}</p>}
          <Link
            to="/contact"
            className="inline-block bg-gold-gradient text-charcoal font-semibold px-8 py-4 rounded-full shadow-gold hover:scale-105 transition-transform"
          >
            {buttonText}
          </Link>
        </div>
      </ScrollReveal>
    </section>
  )
}
