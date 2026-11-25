const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function cleanText(value, maxLen) {
  if (typeof value !== 'string') return ''
  return value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim().slice(0, maxLen)
}

function parseBody(body) {
  if (!body) return {}
  if (typeof body === 'string') {
    try {
      return JSON.parse(body)
    } catch {
      return null
    }
  }
  return typeof body === 'object' ? body : {}
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Metode tidak diizinkan.' })
  }

  const body = parseBody(req.body)
  if (!body) {
    return res.status(400).json({ error: 'Format data tidak valid.' })
  }

  // Honeypot anti-bot: diam-diam sukses tanpa mengirim email
  if (cleanText(body.company, 120)) {
    return res.status(200).json({ ok: true })
  }

  const nama = cleanText(body.nama, 80)
  const email = cleanText(body.email, 120)
  const pesan = cleanText(body.pesan, 1000)

  if (!nama || !EMAIL_RE.test(email) || pesan.length < 10) {
    return res.status(400).json({
      error: 'Periksa kembali: nama wajib diisi, email valid, pesan minimal 10 karakter.',
    })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('RESEND_API_KEY belum dikonfigurasi di environment server.')
    return res.status(503).json({ error: 'Layanan pengiriman pesan sedang tidak tersedia.' })
  }

  const toEmail = process.env.CONTACT_TO_EMAIL || 'randy021104@gmail.com'
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Portofolio <onboarding@resend.dev>'

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: `Pesan Portofolio dari ${nama}`,
        text: `Nama: ${nama}\nEmail: ${email}\n\nPesan:\n${pesan}`,
      }),
    })

    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      console.error('Resend API error:', response.status, detail)
      return res.status(502).json({ error: 'Pengiriman pesan gagal. Silakan coba lagi nanti.' })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Contact handler error:', err)
    return res.status(502).json({ error: 'Pengiriman pesan gagal. Silakan coba lagi nanti.' })
  }
}
