const nodes = [
  { label: 'Facebook Ads', top: '6%', left: '4%' },
  { label: 'CRM Pipeline', top: '6%', left: '70%' },
  { label: 'AI Conversations', top: '40%', left: '0%' },
  { label: 'Appointment Calendar', top: '74%', left: '6%' },
  { label: 'Vehicle Inventory', top: '78%', left: '66%' },
  { label: 'Marketplace', top: '42%', left: '78%' },
  { label: 'Review Requests', top: '10%', left: '38%' },
]

export default function DashboardMockup({ className = '' }) {
  return (
    <div className={`relative w-full aspect-[16/10] ${className}`}>
      <div className="absolute inset-0 glass rounded-3xl shadow-gold overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10">
          <span className="w-3 h-3 rounded-full bg-red-400/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
          <span className="w-3 h-3 rounded-full bg-green-400/70" />
          <span className="ml-3 text-xs text-white/40">Jones Vision Media — Live Dashboard</span>
        </div>
        <div className="p-6 grid grid-cols-3 gap-4 h-full">
          <div className="col-span-2 glass rounded-xl p-4 flex flex-col gap-3">
            <div className="text-xs text-white/50 uppercase tracking-wide">Marketing Performance</div>
            <div className="flex-1 flex items-end gap-2">
              {[40, 65, 50, 80, 60, 95, 72].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gold-gradient rounded-t-md animate-float"
                  style={{ height: `${h}%`, animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
          <div className="glass rounded-xl p-4 flex flex-col justify-between">
            <div className="text-xs text-white/50 uppercase tracking-wide">AI Conversations</div>
            <div className="space-y-2">
              <div className="h-2 rounded bg-gold/60 w-4/5" />
              <div className="h-2 rounded bg-white/20 w-3/5" />
              <div className="h-2 rounded bg-gold/40 w-2/3" />
            </div>
          </div>
          <div className="glass rounded-xl p-4">
            <div className="text-xs text-white/50 uppercase tracking-wide mb-2">Pipeline</div>
            <div className="text-3xl font-bold text-gradient-gold">142</div>
            <div className="text-xs text-white/40">Active Leads</div>
          </div>
          <div className="glass rounded-xl p-4">
            <div className="text-xs text-white/50 uppercase tracking-wide mb-2">Appointments</div>
            <div className="text-3xl font-bold text-gradient-gold">38</div>
            <div className="text-xs text-white/40">Booked This Week</div>
          </div>
          <div className="glass rounded-xl p-4">
            <div className="text-xs text-white/50 uppercase tracking-wide mb-2">Reviews</div>
            <div className="text-3xl font-bold text-gradient-gold">4.9★</div>
            <div className="text-xs text-white/40">Avg Rating</div>
          </div>
        </div>
      </div>
      {nodes.map((n, i) => (
        <div
          key={n.label}
          className="hidden lg:block absolute glass rounded-full px-4 py-2 text-xs font-medium text-gold shadow-gold animate-float"
          style={{ top: n.top, left: n.left, animationDelay: `${i * 0.4}s` }}
        >
          {n.label}
        </div>
      ))}
    </div>
  )
}
