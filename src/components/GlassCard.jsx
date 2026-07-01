export default function GlassCard({ children, className = '', hover = true }) {
  return (
    <div
      className={`glass rounded-2xl p-6 shadow-glass ${
        hover ? 'transition-all duration-300 hover:border-gold/40 hover:-translate-y-1 hover:shadow-gold' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
