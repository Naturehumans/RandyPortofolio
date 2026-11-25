import { useEffect, useRef } from 'react'
import useReducedMotion from '../hooks/useReducedMotion'
import { createScene } from './pondScene'

/**
 * Kolam koi — interaksi hidup andalan halaman ini (taste-skill: satu
 * "live thing"): ikan berenang, riak air saat diklik/tap, dan kursor
 * berubah menjadi jari yang dicelupkan ke air.
 *
 * Ringan & sopan: murni canvas 2D tanpa dependency baru; loop berhenti
 * saat tab tersembunyi atau kolam keluar layar (IntersectionObserver);
 * `prefers-reduced-motion` mendapat satu frame kolam yang tenang.
 */
export default function Pond() {
  const canvasRef = useRef(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const prefersStatis = reduce || (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    const scene = createScene(canvas)
    let isOnScreen = false

    // Kolam hanya "hidup" kalau terlihat dan tab aktif.
    const syncPlay = () => {
      if (prefersStatis) return
      if (document.hidden || !isOnScreen) scene.stop()
      else scene.start()
    }
    const ro = new ResizeObserver(() => scene.resize())
    ro.observe(canvas)
    scene.resize() // ukuran awal + gambar frame pertama

    const io = new IntersectionObserver(
      (entries) => {
        isOnScreen = entries[0].isIntersecting
        syncPlay()
      },
      { rootMargin: '90px' },
    )
    io.observe(canvas)
    document.addEventListener('visibilitychange', syncPlay)

    const bersih = () => {
      scene.destroy()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', syncPlay)
    }

    if (prefersStatis) return bersih // kolam statis, tanpa interaksi

    // Kursor sistem disembunyikan; jari digambar canvas yang menggantikan.
    canvas.dataset.live = 'true'
    const toLocal = (event) => {
      const rect = canvas.getBoundingClientRect()
      return [event.clientX - rect.left, event.clientY - rect.top]
    }
    const onMove = (event) => {
      const [x, y] = toLocal(event)
      scene.movePointer(x, y)
    }
    const onDown = (event) => {
      const [x, y] = toLocal(event)
      scene.movePointer(x, y)
      scene.tap(x, y)
    }
    const onLeave = () => scene.leavePointer()
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointerleave', onLeave)

    return () => {
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointerleave', onLeave)
      delete canvas.dataset.live
      bersih()
    }
  }, [reduce])

  return (
    <section aria-hidden="true" className="relative h-[clamp(420px,66vh,690px)] overflow-hidden bg-forest">
      <canvas ref={canvasRef} aria-hidden="true" className="pond-canvas absolute inset-0 block h-full w-full" />
    </section>
  )
}
