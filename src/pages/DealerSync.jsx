import ScrollReveal from '../components/ScrollReveal'
import GlassCard from '../components/GlassCard'
import AnimatedCounter from '../components/AnimatedCounter'
import DashboardMockup from '../components/DashboardMockup'
import CTASection from '../components/CTASection'

const features = [
  'Inventory Scraper',
  'Automatic Marketplace Listings',
  'VIN Recognition',
  'Photo Import',
  'AI Vehicle Descriptions',
  'One-Click Publishing',
  'Compliance Dashboard',
  'Analytics',
  'Listing Performance',
  'Real-Time Manager Dashboard',
]

export default function DealerSync() {
  return (
    <>
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              From Website to Marketplace <span className="text-gradient-gold">in 60 Seconds.</span>
            </h1>
            <p className="text-white/70 text-lg mb-2">
              Dealer Sync automatically scrapes your dealership inventory, imports photos and vehicle information, then publishes professional Facebook Marketplace listings in approximately 60 seconds.
            </p>
            <p className="text-white/50 text-sm mb-8">No copying. No typing. No missed listings. Everything automated.</p>
            <a href="/contact" className="inline-block bg-gold-gradient text-charcoal font-semibold px-7 py-4 rounded-full shadow-gold hover:scale-105 transition-transform">
              Book a Demo
            </a>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <DashboardMockup />
          </ScrollReveal>
        </div>
      </section>

      <section className="py-24 px-6 bg-white/[0.02]">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">Features</h2>
        </ScrollReveal>
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <ScrollReveal key={f} delay={i * 50}>
              <GlassCard className="flex items-center gap-3">
                <span className="text-gold">◆</span>
                <span className="font-medium text-sm">{f}</span>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="py-24 px-6">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">Performance Comparison</h2>
        </ScrollReveal>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <ScrollReveal>
            <GlassCard className="text-center" hover={false}>
              <h3 className="text-white/50 font-semibold mb-6 uppercase text-sm tracking-wide">Without Dealer Sync</h3>
              <ul className="space-y-4 text-white/70 text-sm">
                <li>15 minutes per listing</li>
                <li>Around 8 vehicles listed</li>
                <li>About 11 Marketplace leads/month</li>
                <li>14% staff compliance</li>
              </ul>
            </GlassCard>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <GlassCard className="text-center border-gold/40" hover={false}>
              <h3 className="text-gold font-semibold mb-6 uppercase text-sm tracking-wide">With Dealer Sync</h3>
              <ul className="space-y-4 text-white text-sm">
                <li><AnimatedCounter to={60} suffix=" seconds per listing" /></li>
                <li>Around <AnimatedCounter to={47} /> vehicles listed</li>
                <li>About <AnimatedCounter to={142} /> Marketplace leads/month</li>
                <li><AnimatedCounter to={92} suffix="% staff compliance" /></li>
              </ul>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      <CTASection title="Automate Your Marketplace Listings Today" />
    </>
  )
}
