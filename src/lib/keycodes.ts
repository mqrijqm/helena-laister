/**
 * Key kodovi — originalne linijske forme izvedene iz arhetipova svete geometrije.
 * (NE kopije MCEO dijagrama; ti su zaštićeni autorskim pravom.)
 *
 * Koordinate su u prostoru -1..1 (y raste naniže). Svaki kod je niz "poteza" (polilinija).
 * Iz istih podataka crtamo:
 *  - neon animaciju (čestice se slože u tačke uzorkovane duž poteza)
 *  - bele SVG ilustracije na lila sekcijama
 */

export type Pt = [number, number]
export type Stroke = Pt[]

export type KeyCode = {
  id: string
  name: string
  line: string // kratka rečenica koja se pojavi pored koda
  strokes: Stroke[]
}

/* ---------------- primitivi ---------------- */
const TAU = Math.PI * 2

function ellipse(cx: number, cy: number, rx: number, ry: number, seg = 72, rot = 0): Stroke {
  const out: Stroke = []
  const c = Math.cos(rot)
  const s = Math.sin(rot)
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * TAU
    const x = Math.cos(a) * rx
    const y = Math.sin(a) * ry
    out.push([cx + x * c - y * s, cy + x * s + y * c])
  }
  return out
}
const circle = (cx: number, cy: number, r: number, seg = 72) => ellipse(cx, cy, r, r, seg)
const line = (a: Pt, b: Pt): Stroke => [a, b]
const poly = (pts: Pt[], closed = true): Stroke => (closed ? [...pts, pts[0]] : pts)
const polar = (r: number, deg: number, cx = 0, cy = 0): Pt => [
  cx + r * Math.cos((deg * Math.PI) / 180),
  cy + r * Math.sin((deg * Math.PI) / 180),
]

/** Kap/plamen: šiljak gore, okrugla dole. */
function teardrop(cx: number, cy: number, w: number, h: number, seg = 90): Stroke {
  const out: Stroke = []
  for (let i = 0; i <= seg; i++) {
    const t = (i / seg) * TAU
    const x = Math.sin(t) * Math.pow(Math.sin(t / 2), 1.15)
    const y = -Math.cos(t)
    out.push([cx + x * w, cy + y * h])
  }
  return out
}

/** Vezica (latica) između dve tačke. */
function petal(a: Pt, b: Pt, bulge = 0.35, seg = 24): Stroke[] {
  const [ax, ay] = a
  const [bx, by] = b
  const dx = bx - ax
  const dy = by - ay
  const nx = -dy * bulge
  const ny = dx * bulge
  const curve = (sign: number): Stroke => {
    const out: Stroke = []
    for (let i = 0; i <= seg; i++) {
      const t = i / seg
      const k = Math.sin(t * Math.PI) * sign
      out.push([ax + dx * t + nx * k, ay + dy * t + ny * k])
    }
    return out
  }
  return [curve(1), curve(-1)]
}

/* ---------------- 6 kodova ---------------- */

function starGate(): Stroke[] {
  const top = -0.74
  const bot = 0.74
  const rx = 0.5
  return [
    ellipse(0, top, rx, 0.11),
    line([-rx, top], [0, 0]),
    line([rx, top], [0, 0]),
    ellipse(0, bot, rx, 0.11),
    line([-rx, bot], [0, 0]),
    line([rx, bot], [0, 0]),
    circle(0, 0, 0.12, 40),
    line([0, -1], [0, 1]),
    poly([[-0.07, -0.9], [0, -1], [0.07, -0.9]], false),
    poly([[-0.07, 0.9], [0, 1], [0.07, 0.9]], false),
  ]
}

function krystalHeart(): Stroke[] {
  // vertikalna osmica
  const eight: Stroke = []
  for (let i = 0; i <= 160; i++) {
    const t = (i / 160) * TAU
    eight.push([0.58 * Math.sin(2 * t) * 0.92, 0.96 * Math.sin(t)])
  }
  return [
    eight,
    teardrop(0, -0.5, 0.26, 0.3),
    teardrop(0, -0.46, 0.16, 0.19),
    teardrop(0, -0.42, 0.07, 0.09),
    poly([[0, -0.13], [0.13, 0], [0, 0.13], [-0.13, 0]]),
    circle(0, 0.52, 0.09, 36),
    circle(0, 0.52, 0.19, 48),
  ]
}

function katharaGrid(): Stroke[] {
  const center: Pt[] = [[0, -0.88], [0, -0.44], [0, 0.0], [0, 0.44], [0, 0.88]]
  const sideL: Pt[] = [[-0.42, -0.66], [-0.42, -0.22], [-0.42, 0.22], [-0.42, 0.66]]
  const sideR: Pt[] = sideL.map(([x, y]) => [-x, y] as Pt)
  const nodes = [...center, ...sideL.slice(0, 3), ...sideR.slice(0, 3), sideL[3]].slice(0, 12)
  const strokes: Stroke[] = []
  // vertikale
  strokes.push(poly(center, false), poly(sideL, false), poly(sideR, false))
  // cik-cak dijagonale
  for (let i = 0; i < 4; i++) {
    strokes.push(line(center[i], sideL[i]), line(center[i], sideR[i]))
    strokes.push(line(sideL[i], center[i + 1]), line(sideR[i], center[i + 1]))
  }
  nodes.forEach(([x, y]) => strokes.push(circle(x, y, 0.065, 28)))
  return strokes
}

function merkaba(): Stroke[] {
  const up = [polar(0.84, -90), polar(0.84, 30), polar(0.84, 150)]
  const down = [polar(0.84, 90), polar(0.84, 210), polar(0.84, 330)]
  return [circle(0, 0, 0.94, 96), poly(up), poly(down), circle(0, 0, 0.42, 64), circle(0, 0, 0.06, 20)]
}

function flowerOfLife(): Stroke[] {
  const r = 0.29
  const s: Stroke[] = [circle(0, 0, r, 64)]
  for (let i = 0; i < 6; i++) {
    const [x, y] = polar(r, i * 60 - 90)
    s.push(circle(x, y, r, 64))
  }
  s.push(circle(0, 0, 0.6, 96), circle(0, 0, 0.92, 96))
  return s
}

function eckasha(): Stroke[] {
  const cy = 0.28
  const s: Stroke[] = [teardrop(0, -0.02, 0.66, 0.98, 120)]
  for (let i = 0; i < 8; i++) {
    const a = i * 45 - 90
    s.push(...petal(polar(0.16, a, 0, cy), polar(0.46, a, 0, cy), 0.18))
  }
  s.push(circle(0, cy, 0.1, 32), line([-0.1, cy], [0.1, cy]), line([0, cy - 0.1], [0, cy + 0.1]))
  s.push(...petal([0, -0.78], [0, -0.3], 0.16))
  return s
}

export const KEY_CODES: KeyCode[] = [
  {
    id: 'star-gate',
    name: 'Star Gate',
    line: 'Opens the vertical axis — a sealed gate between what you were told and what you are.',
    strokes: starGate(),
  },
  {
    id: 'krystal-heart',
    name: 'Krystal Heart',
    line: 'Returns the heart to its original spin. Love that is no longer running on a program.',
    strokes: krystalHeart(),
  },
  {
    id: 'kathara-grid',
    name: 'Kathara Grid',
    line: 'Twelve points of the original blueprint, re-linked. A structure that can finally hold light.',
    strokes: katharaGrid(),
  },
  {
    id: 'merkaba',
    name: 'Merkaba',
    line: 'Your vehicle of light. When it spins forward again, the heaviness you could not explain lifts.',
    strokes: merkaba(),
  },
  {
    id: 'flower-of-life',
    name: 'Flower of Life',
    line: 'The pattern everything grows from — a reminder that nothing in you is random.',
    strokes: flowerOfLife(),
  },
  {
    id: 'eckasha',
    name: 'Eckasha',
    line: 'The seed code. A single drop of source frequency, and the whole field remembers.',
    strokes: eckasha(),
  },
]

/* ---------------- uzorkovanje za animaciju ---------------- */

export type Sampled = { x: Float32Array; y: Float32Array; stroke: Int16Array }

/** Rasporedi `n` tačaka duž svih poteza, proporcionalno dužini, redom potez po potez. */
export function sampleStrokes(strokes: Stroke[], n: number): Sampled {
  const lens = strokes.map((s) => {
    let L = 0
    for (let i = 1; i < s.length; i++) L += Math.hypot(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1])
    return L
  })
  const total = lens.reduce((a, b) => a + b, 0)
  // svaki potez dobija bar 2 tačke
  const counts = lens.map((L) => Math.max(2, Math.round((L / total) * n)))
  let diff = counts.reduce((a, b) => a + b, 0) - n
  // uskladi zbir sa n (oduzmi/dodaj od najdužih)
  const order = lens.map((L, i) => [L, i] as const).sort((a, b) => b[0] - a[0])
  let k = 0
  while (diff !== 0) {
    const i = order[k % order.length][1]
    if (diff > 0 && counts[i] > 2) {
      counts[i]--
      diff--
    } else if (diff < 0) {
      counts[i]++
      diff++
    }
    k++
    if (k > 10000) break
  }

  const x = new Float32Array(n)
  const y = new Float32Array(n)
  const stroke = new Int16Array(n)
  let p = 0
  strokes.forEach((s, si) => {
    const L = lens[si]
    const c = counts[si]
    for (let j = 0; j < c && p < n; j++) {
      const target = c === 1 ? 0 : (j / (c - 1)) * L
      let acc = 0
      let seg = 1
      while (seg < s.length - 1) {
        const d = Math.hypot(s[seg][0] - s[seg - 1][0], s[seg][1] - s[seg - 1][1])
        if (acc + d >= target) break
        acc += d
        seg++
      }
      const a = s[seg - 1]
      const b = s[seg]
      const d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
      const t = Math.min(1, Math.max(0, (target - acc) / d))
      x[p] = a[0] + (b[0] - a[0]) * t
      y[p] = a[1] + (b[1] - a[1]) * t
      stroke[p] = si
      p++
    }
  })
  return { x, y, stroke }
}

/** SVG `d` atribut za statičnu ilustraciju (viewBox -1 -1 2 2). */
export function strokesToPath(strokes: Stroke[]) {
  return strokes
    .map((s) => s.map(([px, py], i) => `${i ? 'L' : 'M'}${px.toFixed(4)} ${py.toFixed(4)}`).join(''))
    .join('')
}
