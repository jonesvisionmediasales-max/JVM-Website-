import { useState } from 'react'
import ScrollReveal from '../components/ScrollReveal'
import GlassCard from '../components/GlassCard'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="pt-40 pb-24 px-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal>
          <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4">
            Book Your <span className="text-gradient-gold">Demo</span>
          </h1>
          <p className="text-white/70 text-center mb-12">
            Tell us about your business and we'll show you how Jones Vision Media can help you grow.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <GlassCard hover={false} className="p-10">
            {submitted ? (
              <div className="text-center py-10">
                <div className="text-gold text-3xl mb-4">✔</div>
                <h2 className="text-2xl font-bold mb-2">Thank you!</h2>
                <p className="text-white/70">We'll be in touch shortly to schedule your demo.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <input required placeholder="Full Name" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-gold/60" />
                  <input required placeholder="Business Name" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-gold/60" />
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <input required type="email" placeholder="Email Address" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-gold/60" />
                  <input required type="tel" placeholder="Phone Number" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-gold/60" />
                </div>
                <select required defaultValue="" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/60">
                  <option value="" disabled>I'm interested in...</option>
                  <option>Dealership Marketing</option>
                  <option>Car Rental Agency Marketing</option>
                  <option>Drive Flow AI</option>
                  <option>Dealer Sync</option>
                  <option>All of the above</option>
                </select>
                <textarea placeholder="Tell us about your business" rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-gold/60" />
                <button type="submit" className="w-full bg-gold-gradient text-charcoal font-semibold px-7 py-4 rounded-full shadow-gold hover:scale-[1.02] transition-transform">
                  Schedule Your Demo
                </button>
              </form>
            )}
          </GlassCard>
        </ScrollReveal>
      </div>
    </section>
  )
}
