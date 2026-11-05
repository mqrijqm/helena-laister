'use client'

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import gsap from 'gsap'
import CodeGlyph from '@/components/CodeGlyph'
import { buildSessions, TYPES, type Kind, type Session } from './sessions'
import { prefersReducedMotion } from '@/lib/motion'

/* "Sada" postoji samo u browseru — server renderuje skeleton (null). */
let clientNow: Date | null = null
const noop = () => () => {}
const getClientNow = () => (clientNow ??= new Date())
const getServerNow = () => null

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
const startOfDay = (d: Date) => {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}
const addDays = (d: Date, n: number) => {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}
const startOfWeek = (d: Date) => addDays(startOfDay(d), -d.getDay())

const TIMEZONES = [
  { id: 'local', label: 'Your time' },
  { id: 'Europe/London', label: 'London' },
  { id: 'Europe/Berlin', label: 'Berlin' },
  { id: 'America/New_York', label: 'New York' },
  { id: 'America/Los_Angeles', label: 'Los Angeles' },
] as const

function tzOffsetLabel(tz: string, at: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz === 'local' ? undefined : tz,
    timeZoneName: 'shortOffset',
  }).formatToParts(at)
  return parts.find((p) => p.type === 'timeZoneName')?.value ?? ''
}

const Chevron = ({ dir = 'down', className = 'size-4' }: { dir?: 'down' | 'left' | 'right'; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`${className} ${dir === 'left' ? 'rotate-90' : dir === 'right' ? '-rotate-90' : ''}`}>
    <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function SessionCard({ s, tz }: { s: Session; tz: string }) {
  const [more, setMore] = useState(false)
  const [requested, setRequested] = useState(false)
  const timeZone = tz === 'local' ? undefined : tz
  const t = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone })
  const end = new Date(s.start.getTime() + s.minutes * 60_000)

  return (
    <article className="grid gap-5 rounded-2xl bg-white/35 p-5 sm:grid-cols-[auto_1fr_auto] sm:p-6">
      <div className="grid size-20 place-items-center rounded-xl bg-ink text-lilac sm:size-24" aria-hidden="true">
        <CodeGlyph code={s.code} className="size-[62%]" strokeWidth={1} draw={false} />
      </div>

      <div className="min-w-0">
        <p className="t-code text-ink/55">{s.type}</p>
        <h3 className="t-title mt-1">{s.title}</h3>
        <p className={`t-small mt-3 max-w-[30rem] text-ink/75 ${more ? '' : 'line-clamp-2'}`}>{s.description}</p>
        <button type="button" onClick={() => setMore((v) => !v)} aria-expanded={more} className="t-small mt-0.5 underline-offset-4 hover:underline">
          {more ? 'Show less' : 'Show more'}
        </button>
        <ul className={`t-small mt-3 space-y-1.5 ${s.cancelled ? 'text-ink/45' : 'text-ink/80'}`}>
          <li>{s.start.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone })}</li>
          <li>
            {t(s.start)} – {t(end)} <span className="text-ink/40">· {s.minutes} min · {tzOffsetLabel(tz, s.start)}</span>
          </li>
          <li>Online · Zoom</li>
        </ul>
      </div>

      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
        <p className="t-code text-ink/60">exchange on request</p>
        {s.cancelled ? (
          <span className="t-code inline-flex h-10 items-center rounded-full bg-ink/15 px-5 text-ink/50">Full</span>
        ) : (
          <button
            type="button"
            onClick={() => setRequested((v) => !v)}
            aria-pressed={requested}
            className={`btn min-h-10! px-5! ${requested ? 'bg-white text-ink' : 'btn-ink'}`}
          >
            {requested ? 'Requested ✓' : 'Request a place'}
          </button>
        )}
      </div>
    </article>
  )
}

export default function Schedule() {
  const now = useSyncExternalStore(noop, getClientNow, getServerNow)
  const [kind, setKind] = useState<Kind>('Group')
  const [view, setView] = useState<'week' | 'month'>('week')
  const [weekOffset, setWeekOffset] = useState(0)
  const [monthOffset, setMonthOffset] = useState(0)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [type, setType] = useState('all')
  const [tz, setTz] = useState('local')
  const listRef = useRef<HTMLDivElement>(null)

  const sessions = useMemo(() => (now ? buildSessions(now) : []), [now])

  const weekDays = useMemo(() => {
    if (!now) return []
    const start = addDays(startOfWeek(now), weekOffset * 7)
    return Array.from({ length: 7 }, (_, i) => addDays(start, i))
  }, [now, weekOffset])

  const month = useMemo(() => {
    if (!now) return { first: new Date(0), cells: [] as (Date | null)[] }
    const first = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1)
    const count = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()
    const cells: (Date | null)[] = Array(first.getDay()).fill(null)
    for (let d = 1; d <= count; d++) cells.push(new Date(first.getFullYear(), first.getMonth(), d))
    return { first, cells }
  }, [now, monthOffset])

  const filtered = useMemo(() => {
    let list = sessions.filter((s) => s.kind === kind && (type === 'all' || s.type === type))
    if (selectedDay) list = list.filter((s) => dayKey(s.start) === selectedDay)
    else if (view === 'week' && weekDays.length) list = list.filter((s) => s.start >= weekDays[0])
    else if (view === 'month')
      list = list.filter((s) => s.start.getMonth() === month.first.getMonth() && s.start.getFullYear() === month.first.getFullYear())
    return list
  }, [sessions, kind, type, selectedDay, view, weekDays, month])

  const groups = useMemo(() => {
    const map = new Map<string, Session[]>()
    filtered.forEach((s) => map.set(dayKey(s.start), [...(map.get(dayKey(s.start)) ?? []), s]))
    return [...map.values()]
  }, [filtered])

  const sessionDays = useMemo(() => new Set(sessions.filter((s) => s.kind === kind).map((s) => dayKey(s.start))), [sessions, kind])

  useEffect(() => {
    if (!listRef.current || prefersReducedMotion()) return
    gsap.fromTo(listRef.current.children, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.04, ease: 'power2.out', overwrite: true })
  }, [groups])

  const groupLabel = (d: Date, index: number) => {
    if (!now) return ''
    const diff = (startOfDay(d).getTime() - startOfDay(now).getTime()) / 86_400_000
    const md = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    if (diff === 0) return `Today · ${md}`
    if (index === 0 && diff < 7) return `Next · ${md}`
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }

  const resetFilters = () => {
    setSelectedDay(null)
    setType('all')
  }
  const pill = 't-code h-10 rounded-full border border-ink/20 bg-white/30 px-4 transition-colors hover:bg-white/60'

  return (
    <div className="rounded-3xl bg-lilac p-4 text-ink sm:p-8">
      {/* vremenska zona */}
      <div className="flex justify-center">
        <label className="relative">
          <span className="sr-only">Time zone</span>
          <select
            value={tz}
            onChange={(e) => setTz(e.target.value)}
            className="t-code h-10 cursor-pointer appearance-none rounded-full border border-ink/20 bg-white/30 pl-4 pr-9 outline-none hover:bg-white/60"
          >
            {TIMEZONES.map((z) => (
              <option key={z.id} value={z.id}>
                {z.label} {now ? tzOffsetLabel(z.id, now) : ''}
              </option>
            ))}
          </select>
          <Chevron className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2" />
        </label>
      </div>

      {/* tabovi + prikaz */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div role="tablist" aria-label="Session kind" className="flex gap-5">
          {(['Group', 'Private'] as const).map((k) => (
            <button
              key={k}
              role="tab"
              aria-selected={kind === k}
              onClick={() => {
                setKind(k)
                resetFilters()
              }}
              className={`relative pb-2 font-serif text-[1.25rem] transition-colors ${kind === k ? 'text-ink' : 'text-ink/50 hover:text-ink'}`}
            >
              {k === 'Group' ? 'Group' : 'Private 1:1'}
              <span className={`absolute bottom-0 left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-ink transition-transform duration-500 ease-(--ease-soft) ${kind === k ? 'scale-x-100' : 'scale-x-0'}`} />
            </button>
          ))}
        </div>
        <div className="flex rounded-full bg-white/30 p-0.5">
          {(['week', 'month'] as const).map((v) => (
            <button
              key={v}
              onClick={() => {
                setView(v)
                setSelectedDay(null)
              }}
              aria-pressed={view === v}
              className={`t-code h-9 rounded-full px-4 transition-colors ${view === v ? 'bg-ink text-white' : 'text-ink/70 hover:text-ink'}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* nedelja / mesec */}
      {view === 'week' ? (
        <div className="mt-5 flex items-center gap-1">
          <button onClick={() => setWeekOffset((w) => Math.max(0, w - 1))} disabled={weekOffset === 0} aria-label="Previous week" className="grid size-8 shrink-0 place-items-center rounded-full bg-white/30 hover:bg-white/60 disabled:opacity-40">
            <Chevron dir="left" />
          </button>
          <div className="grid flex-1 grid-cols-7">
            {weekDays.map((d) => {
              const k = dayKey(d)
              const isSel = selectedDay === k
              const isToday = now && k === dayKey(now)
              return (
                <button
                  key={k}
                  onClick={() => setSelectedDay(isSel ? null : k)}
                  aria-pressed={isSel}
                  className={`mx-auto flex w-full max-w-11 flex-col items-center rounded-xl py-1.5 text-[0.72rem] uppercase transition-colors ${isSel ? 'bg-ink text-white' : 'text-ink/60 hover:bg-white/40'}`}
                >
                  <span>{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                  <span className={`text-[0.95rem] ${isToday ? 'font-semibold' : ''}`}>{d.getDate()}</span>
                  <span className={`mt-0.5 size-1 rounded-full ${sessionDays.has(k) ? (isSel ? 'bg-lilac' : 'bg-ink/60') : 'bg-transparent'}`} />
                </button>
              )
            })}
          </div>
          <button onClick={() => setWeekOffset((w) => Math.min(10, w + 1))} aria-label="Next week" className="grid size-8 shrink-0 place-items-center rounded-full bg-white/30 hover:bg-white/60">
            <Chevron dir="right" />
          </button>
        </div>
      ) : (
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <button onClick={() => setMonthOffset((m) => Math.max(0, m - 1))} disabled={monthOffset === 0} aria-label="Previous month" className="grid size-8 place-items-center rounded-full bg-white/30 hover:bg-white/60 disabled:opacity-40">
              <Chevron dir="left" />
            </button>
            <p className="font-serif text-[1.2rem]">{month.first.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            <button onClick={() => setMonthOffset((m) => Math.min(2, m + 1))} aria-label="Next month" className="grid size-8 place-items-center rounded-full bg-white/30 hover:bg-white/60">
              <Chevron dir="right" />
            </button>
          </div>
          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[0.72rem] uppercase text-ink/50">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {month.cells.map((d, i) => {
              if (!d) return <span key={`e${i}`} />
              const k = dayKey(d)
              const has = sessionDays.has(k)
              const isSel = selectedDay === k
              return (
                <button
                  key={k}
                  disabled={!has}
                  onClick={() => setSelectedDay(isSel ? null : k)}
                  aria-pressed={isSel}
                  className={`flex aspect-square flex-col items-center justify-center rounded-xl text-[0.9rem] transition-colors ${isSel ? 'bg-ink text-white' : has ? 'bg-white/35 hover:bg-white/60' : 'text-ink/30'}`}
                >
                  {d.getDate()}
                  <span className={`mt-0.5 size-1 rounded-full ${has ? (isSel ? 'bg-lilac' : 'bg-ink/60') : 'bg-transparent'}`} />
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* filteri */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={resetFilters} className={pill}>
          show all
        </button>
        <button
          onClick={() => {
            if (!now) return
            setWeekOffset(0)
            setMonthOffset(0)
            setSelectedDay(dayKey(now))
          }}
          className={pill}
        >
          today
        </button>
        <label className="relative min-w-[12rem] flex-1">
          <span className="sr-only">Type</span>
          <select value={type} onChange={(e) => setType(e.target.value)} className={`${pill} w-full cursor-pointer appearance-none pr-9 outline-none`}>
            <option value="all">All types</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <Chevron className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2" />
        </label>
      </div>

      {/* lista */}
      <div ref={listRef} className="mt-7 space-y-7" aria-live="polite">
        {!now && <div className="h-64 animate-pulse rounded-2xl bg-white/30" />}
        {now && groups.length === 0 && (
          <div className="rounded-2xl bg-white/35 p-8 text-center">
            <p className="t-title">Nothing scheduled here yet.</p>
            <button onClick={resetFilters} className="btn btn-ink mt-5">
              show all sessions
            </button>
          </div>
        )}
        {groups.map((g, i) => (
          <section key={dayKey(g[0].start)}>
            <h3 className="t-code mb-3 text-ink/70">{groupLabel(g[0].start, i)}</h3>
            <div className="space-y-3">
              {g.map((s) => (
                <SessionCard key={s.id} s={s} tz={tz} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
