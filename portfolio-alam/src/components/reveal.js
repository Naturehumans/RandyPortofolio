/**
 * Variants Framer Motion bersama untuk entrance section:
 * fade + translateY + stagger antar anak. Hanya transform & opacity
 * (aturan performa). Bila prefers-reduced-motion aktif: fade sederhana.
 *
 * - `item`   : blok teks/kartu (naik ke posisi)
 * - `media`  : gambar (settle dari skala 1.04 — reveal editorial)
 */
export function revealVariants(reduce) {
  if (reduce) {
    return {
      container: {
        hidden: {},
        show: { transition: { staggerChildren: 0.05 } },
      },
      item: {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.3 } },
      },
      media: {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.3 } },
      },
    }
  }
  return {
    container: {
      hidden: {},
      show: { transition: { staggerChildren: 0.12, delayChildren: 0.06 } },
    },
    item: {
      hidden: { opacity: 0, y: 34 },
      show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
    },
    media: {
      hidden: { opacity: 0, y: 28, scale: 1.04 },
      show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
      },
    },
  }
}

/** Opsi viewport standar: sekali saja, mulai saat masuk layar. */
export const onceViewport = { once: true, margin: '-70px 0px' }
