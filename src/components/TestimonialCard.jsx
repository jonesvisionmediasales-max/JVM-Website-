import GlassCard from './GlassCard'

export default function TestimonialCard({ quote, name, role }) {
  return (
    <GlassCard className="text-left flex flex-col gap-4 h-full">
      <div className="text-gold text-2xl leading-none">"</div>
      <p className="text-white/80 text-sm leading-relaxed flex-1">{quote}</p>
      <div>
        <div className="font-semibold text-white">{name}</div>
        <div className="text-xs text-gold">{role}</div>
      </div>
    </GlassCard>
  )
}
