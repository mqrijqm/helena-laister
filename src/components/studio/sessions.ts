export type SessionType = 'Class' | 'Workshop'

export type Session = {
  id: string
  type: SessionType
  title: string
  instructor: string
  location: string
  start: Date
  minutes: number
  price: number
  cancelled?: boolean
  description: string
}

export const INSTRUCTORS: Record<string, string> = {
  Helen:
    'Founder of the studio. Helen has guided breathwork for over a decade, weaving somatic awareness, sound and a lot of warmth into every session.',
  Ana: 'Ana is a trauma-aware facilitator with a background in dance and somatic therapy. Her sessions are slow, spacious and deeply grounding.',
  Theo: 'Theo blends breath with live sound — handpan, voice and field recordings — to create journeys that feel like a long exhale.',
}

export const LOCATIONS = ['Studio Room', 'Online'] as const

const DESCRIPTIONS = {
  class:
    'Join us for a guided breathwork journey designed to support emotional and mental wellbeing. Through conscious, connected breathing and a carefully built soundscape, the body is invited to release held tension and return to a steadier rhythm. No experience needed — mats, blankets and eye pillows are provided.',
  sound:
    'A gentler evening practice combining slow nasal breathing with live sound. Ideal after a long day, or if you are new to breathwork and want to start somewhere soft.',
  workshop:
    'A longer, deeper journey with time for intention setting, an extended breath session and integration afterwards. We close with tea and an optional sharing circle.',
}

function at(base: Date, dayOffset: number, h: number, m = 0) {
  const d = new Date(base)
  d.setDate(d.getDate() + dayOffset)
  d.setHours(h, m, 0, 0)
  return d
}

/** Generiše raspored za narednih ~12 nedelja, počevši od nedelje (Sunday) tekuće nedelje. */
export function buildSessions(now: Date): Session[] {
  const sunday = new Date(now)
  sunday.setHours(0, 0, 0, 0)
  sunday.setDate(sunday.getDate() - sunday.getDay())

  const out: Session[] = []
  for (let w = 0; w < 12; w++) {
    const o = w * 7
    out.push({
      id: `tue-${w}`,
      type: 'Class',
      title: 'Breath & Sound',
      instructor: 'Theo',
      location: 'Online',
      start: at(sunday, o + 2, 18, 30),
      minutes: 45,
      price: 25,
      description: DESCRIPTIONS.sound,
    })
    out.push({
      id: `thu-${w}`,
      type: 'Class',
      title: 'Helen Breathwork',
      instructor: 'Helen',
      location: 'Studio Room',
      start: at(sunday, o + 4, 19, 0),
      minutes: 60,
      price: 44,
      cancelled: w === 2,
      description: DESCRIPTIONS.class,
    })
    if (w % 2 === 0) {
      out.push({
        id: `sat-${w}`,
        type: 'Workshop',
        title: 'Full Moon Breath Journey',
        instructor: w % 4 === 0 ? 'Helen' : 'Ana',
        location: 'Studio Room',
        start: at(sunday, o + 6, 11, 0),
        minutes: 120,
        price: 75,
        description: DESCRIPTIONS.workshop,
      })
    }
  }
  // Prikazujemo samo ono što još nije počelo
  return out.filter((s) => s.start.getTime() > now.getTime()).sort((a, b) => +a.start - +b.start)
}
