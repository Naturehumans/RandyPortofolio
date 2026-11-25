import { useRef } from 'react'
import { m, useScroll, useTransform } from 'framer-motion'
import useReducedMotion from '../hooks/useReducedMotion'

/**
 * ParallaxBox — membungkus gambar di dalam slot agar bergeser pelan
 * (berlawanan arah scroll) saat halaman digulir: gambar "hidup"
 * mengikuti gerakan, bukan muncul statis.
 *
 * Hanya menganimasikan `transform: translateY`; `amount` piksel di
 * kedua arah, dan 0 penuh saat prefers-reduced-motion. `overlay`
 * dirender di atas gambar (di luar lapisan bergerak), mis. figcaption.
 */
export default function ParallaxBox({ children, overlay, className = '', variants, amount = 20 }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [amount, -amount])

  return (
    <m.div variants={variants} className={className}>
      <div ref={ref} className="h-full w-full">
        <m.div style={{ y }} className="parallax-inner">
          {children}
        </m.div>
        {overlay}
      </div>
    </m.div>
  )
}
