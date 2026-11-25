import { useState } from 'react'

/**
 * SmartImage — <img> dengan alt deskriptif, width/height eksplisit
 * (cegah layout shift), loading lazy + decoding async, dan
 * fetchpriority="high" khusus gambar hero.
 *
 * Deteksi placeholder: berkas 1x1 px disembunyikan sehingga slot
 * (.slot) menggambar tint + watermark daun sendiri. Begitu berkas
 * asli (webp) ditaruh, gambar langsung tampil.
 */
export default function SmartImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
}) {
  const [isPlaceholder, setIsPlaceholder] = useState(false)

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      fetchpriority={priority ? 'high' : undefined}
      decoding="async"
      data-placeholder={isPlaceholder || undefined}
      className={className}
      onLoad={(event) => {
        if (event.currentTarget.naturalWidth <= 4) setIsPlaceholder(true)
      }}
    />
  )
}
