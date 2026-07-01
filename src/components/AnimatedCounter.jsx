import { useEffect, useRef, useState } from 'react'

export default function AnimatedCounter({ from = 0, to, suffix = '', prefix = '', duration = 1400 }) {
  const ref = useRef(null)
  const [value, setValue] = useState(from)
  const started = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const animate = (now) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(Math.round(from + (to - from) * eased))
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [from, to, duration])

  return (
    <span ref={ref} className="text-gradient-gold font-extrabold">
      {prefix}{value}{suffix}
    </span>
  )
}
