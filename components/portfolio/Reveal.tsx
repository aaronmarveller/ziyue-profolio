// components/portfolio/Reveal.tsx
// Scroll-triggered reveal wrapper. Content is visible in the HTML by
// default (no-JS and reduced-motion readers always see it); once mounted,
// elements below the fold are transitioned into a hidden pre-reveal state
// and animate in when the IntersectionObserver fires. Guarded so it is safe
// in jsdom (no IntersectionObserver / matchMedia) and never flashes
// above-the-fold content.
'use client'

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'

export function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  /** Transition delay in ms — used to stagger sibling reveals. */
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    // Reduced motion, no observer support, or an element already inside the
    // first viewport: leave the content visible (no animation, no flash).
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (reduce || !('IntersectionObserver' in window)) return
    const el = ref.current
    if (!el) return
    if (el.getBoundingClientRect().top < window.innerHeight) return

    setHidden(true)
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHidden(false)
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const style = delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined

  return (
    <div ref={ref} style={style} className={`${hidden ? 'reveal' : 'reveal-visible'} ${className}`}>
      {children}
    </div>
  )
}
