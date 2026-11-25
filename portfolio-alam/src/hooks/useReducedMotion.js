import { useEffect, useRef, useState } from 'react'

/**
 * useReducedMotion — mendeteksi prefers-reduced-motion dan berlangganan
 * perubahannya. Dipakai untuk mematikan sulur, parallax, dan partikel.
 */
export default function useReducedMotion() {
  const [reduce, setReduce] = useState(false)
  const mqRef = useRef(null)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    mqRef.current = mq
    setReduce(mq.matches)
    const onChange = (event) => setReduce(event.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduce
}
