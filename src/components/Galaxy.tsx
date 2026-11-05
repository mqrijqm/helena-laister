'use client'

import { useEffect, useRef } from 'react'

/**
 * Pikselizovana galaksija — fiksna pozadina celog sajta.
 * Crta se u niskoj rezoluciji (1 "piksel" = PIX × PIX ekranskih) i CSS je razvuče
 * sa image-rendering: pixelated → pixel-art izgled, a GPU radi ~9× manje.
 *
 * - maglina: fbm šum, kvantizovan u 6 nijansi + Bayer dither (izračuna se jednom)
 * - zvezde: trepere; par svetlih u obliku krstića
 * - paralaksa: maglina i zvezde se pomeraju sporije od skrola (bešavno, šum se ponavlja po visini)
 */
const PIX = 3
const FPS = 30

// tamna ljubičasto-lila paleta (od praznine ka svetlu)
const PALETTE: [number, number, number][] = [
  [5, 4, 10],
  [12, 8, 26],
  [22, 14, 48],
  [38, 26, 82],
  [70, 54, 140],
  [128, 112, 210],
]
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => v / 16 - 0.5)

/* periodični value noise (ponavlja se po y sa periodom py ćelija) */
function makeNoise(seed: number) {
  const hash = (x: number, y: number) => {
    const s = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453
    return s - Math.floor(s)
  }
  const smooth = (t: number) => t * t * (3 - 2 * t)
  return (x: number, y: number, py: number) => {
    const xi = Math.floor(x)
    const yi = Math.floor(y)
    const xf = x - xi
    const yf = y - yi
    const y0 = ((yi % py) + py) % py
    const y1 = (y0 + 1) % py
    const a = hash(xi, y0)
    const b = hash(xi + 1, y0)
    const c = hash(xi, y1)
    const d = hash(xi + 1, y1)
    const u = smooth(xf)
    const v = smooth(yf)
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
  }
}

export default function Galaxy() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d', { alpha: false })!
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const noise = makeNoise(7)

    let lw = 0
    let lh = 0
    let nebula: HTMLCanvasElement | null = null
    let stars: { x: number; y: number; ph: number; sp: number; big: boolean; lilac: boolean; depth: number }[] = []
    let raf = 0
    let lastDraw = 0
    let t = 0

    const buildNebula = () => {
      // visina = 2 ekrana; šum je periodičan po y pa se slika bešavno ponavlja
      const W = lw
      const H = lh * 2
      const off = document.createElement('canvas')
      off.width = W
      off.height = H
      const octx = off.getContext('2d')!
      const img = octx.createImageData(W, H)
      const scale = 1 / 70 // veličina oblaka
      const period = Math.max(2, Math.round(H * scale))
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const nx = x * scale
          const ny = (y / H) * period
          let v = 0
          let amp = 0.55
          let f = 1
          for (let o = 0; o < 4; o++) {
            v += amp * noise(nx * f, ny * f, period * f)
            f *= 2
            amp *= 0.5
          }
          // dijagonalna "traka" galaksije
          const band = Math.exp(-Math.pow((x / W - 0.5) * 1.6 - (y / H - 0.5) * 0.9, 2) * 6)
          let d = Math.pow(Math.max(0, v - 0.38) * 1.7, 1.6) * (0.35 + band)
          d += BAYER[(y % 4) * 4 + (x % 4)] * 0.16 // dither
          const level = Math.max(0, Math.min(PALETTE.length - 1, Math.floor(d * PALETTE.length)))
          const [r, g, b] = PALETTE[level]
          const i = (y * W + x) * 4
          img.data[i] = r
          img.data[i + 1] = g
          img.data[i + 2] = b
          img.data[i + 3] = 255
        }
      }
      octx.putImageData(img, 0, 0)
      nebula = off

      const count = Math.round((W * H) / 260)
      stars = Array.from({ length: count }, () => ({
        x: Math.floor(Math.random() * W),
        y: Math.floor(Math.random() * H),
        ph: Math.random() * Math.PI * 2,
        sp: 0.6 + Math.random() * 2.2,
        big: Math.random() < 0.035,
        lilac: Math.random() < 0.35,
        depth: Math.random() < 0.5 ? 0.06 : 0.12,
      }))
    }

    const draw = () => {
      if (!nebula) return
      const H = nebula.height
      const scrollLow = window.scrollY / PIX

      // maglina — sporija paralaksa
      const oy = Math.floor((scrollLow * 0.05) % H)
      ctx.drawImage(nebula, 0, -oy)
      ctx.drawImage(nebula, 0, H - oy)

      // zvezde
      for (const s of stars) {
        let y = Math.floor(s.y - scrollLow * s.depth) % H
        if (y < 0) y += H
        if (y >= lh) continue
        const tw = reduce ? 0.8 : 0.45 + 0.55 * Math.sin(t * s.sp + s.ph)
        if (tw < 0.15) continue
        const a = Math.min(1, tw)
        ctx.fillStyle = s.lilac ? `rgba(206,198,255,${a})` : `rgba(255,255,255,${a})`
        ctx.fillRect(s.x, y, 1, 1)
        if (s.big && a > 0.55) {
          ctx.fillStyle = `rgba(194,190,240,${a * 0.55})`
          ctx.fillRect(s.x - 1, y, 1, 1)
          ctx.fillRect(s.x + 1, y, 1, 1)
          ctx.fillRect(s.x, y - 1, 1, 1)
          ctx.fillRect(s.x, y + 1, 1, 1)
        }
      }
    }

    const resize = () => {
      lw = Math.ceil(window.innerWidth / PIX)
      lh = Math.ceil(window.innerHeight / PIX)
      canvas.width = lw
      canvas.height = lh
      buildNebula()
      draw()
    }

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      if (now - lastDraw < 1000 / FPS) return
      t += (now - lastDraw) / 1000
      lastDraw = now
      draw()
    }

    // promena širine → nova maglina (debounce); visina se menja i od adres-bara na mobilnom
    let rt = 0
    let lastW = window.innerWidth
    const onResize = () => {
      clearTimeout(rt)
      rt = window.setTimeout(() => {
        if (Math.abs(window.innerWidth - lastW) > 40 || Math.ceil(window.innerHeight / PIX) > lh * 1.15) {
          lastW = window.innerWidth
          resize()
        }
      }, 200)
    }
    const onScroll = () => reduce && draw()
    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf)
        raf = 0
      } else if (!reduce && !raf) raf = requestAnimationFrame(loop)
    }

    resize()
    if (!reduce) raf = requestAnimationFrame(loop)
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(rt)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-lvh w-screen [image-rendering:pixelated]"
    />
  )
}
