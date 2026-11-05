export type Kind = 'Group' | 'Private'

export type Session = {
  id: string
  kind: Kind
  type: 'Lecture' | 'Circle call' | '1:1 opening'
  title: string
  code: string // koji key code ide uz sesiju (ikonica)
  start: Date
  minutes: number
  cancelled?: boolean
  description: string
}

export const TYPES = ['Lecture', 'Circle call', '1:1 opening'] as const

const DESC = {
  lecture:
    'A live teaching on Zoom. This month: why the merkaba runs in reverse, what it feels like in the body, and how to bring it back to its original spin. Recorded and added to the vault.',
  circle:
    'The monthly call for members of The Circle. Questions, integration, what is moving in the collective — and a key code received together at the end.',
  private:
    'A private 1:1 activation on Zoom. We locate where your field is looping and place the codes that let it run differently. One practice to take with you.',
}

/**
 * Primer rasporeda za demo (narednih ~12 nedelja). Vremena su u UTC,
 * a prikazuju se u vremenskoj zoni posetioca. TODO: pravi termini od Helene.
 */
export function buildSessions(now: Date): Session[] {
  const base = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  base.setUTCDate(base.getUTCDate() - base.getUTCDay()) // nedelja tekuće nedelje

  const at = (dayOffset: number, hUTC: number, m = 0) => {
    const d = new Date(base)
    d.setUTCDate(d.getUTCDate() + dayOffset)
    d.setUTCHours(hUTC, m, 0, 0)
    return d
  }

  const out: Session[] = []
  for (let w = 0; w < 12; w++) {
    const o = w * 7
    // 1:1 otvoreni termini: utorak i petak
    out.push(
      { id: `p-tue-${w}`, kind: 'Private', type: '1:1 opening', title: '1:1 Activation', code: 'merkaba', start: at(o + 2, 16), minutes: 75, description: DESC.private },
      { id: `p-fri-${w}`, kind: 'Private', type: '1:1 opening', title: '1:1 Activation', code: 'merkaba', start: at(o + 5, 9), minutes: 75, cancelled: w === 1, description: DESC.private },
    )
    // predavanje svake druge srede
    if (w % 2 === 0)
      out.push({ id: `l-${w}`, kind: 'Group', type: 'Lecture', title: 'Live Teaching · Merkaba Mechanics', code: 'kathara-grid', start: at(o + 3, 18), minutes: 90, description: DESC.lecture })
    // poziv kruga — prve nedelje u mesecu
    const sunday = at(o, 17)
    if (sunday.getUTCDate() <= 7)
      out.push({ id: `c-${w}`, kind: 'Group', type: 'Circle call', title: 'The Circle · Monthly Call', code: 'flower-of-life', start: sunday, minutes: 60, description: DESC.circle })
  }
  return out.filter((s) => s.start.getTime() > now.getTime()).sort((a, b) => +a.start - +b.start)
}
