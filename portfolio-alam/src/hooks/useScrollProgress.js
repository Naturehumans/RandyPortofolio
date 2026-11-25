import { useScroll, useSpring } from 'framer-motion'

/**
 * useScrollProgress — progres scroll dokumen (0..1) yang dihaluskan spring,
 * untuk mengikat panjang sulur (stroke pathLength) ke scroll.
 */
export default function useScrollProgress() {
  const { scrollYProgress } = useScroll()
  return useSpring(scrollYProgress, { stiffness: 90, damping: 25, mass: 0.4 })
}
