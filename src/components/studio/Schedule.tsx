'use client'

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import gsap from 'gsap'
import { buildSessions, INSTRUCTORS, LOCATIONS, type Session, type SessionType } from './sessions'
import { prefersReducedMotion } from '@/lib/motion'

/* "Sada" postoji samo u browseru — server renderuje skeleton (null),
   pa nema razlike između serverskog i browserskog HTML-a. */
let clientNow: Date | null = null
const noop = () => () => {}
const getClientNow = () => (clientNow ??= new Date())
const getServerNow = () => null

/* ---------------- pomoćne funkcije za datume ---------------- */
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
  { id: 'Europe/Belgrade', label: 'Belgrade' },
  { id: 'Europe/London', label: 'London' },
  { id: 'America/New_York', label: 'New York' },
] as const

function tzOffsetLabel(tz: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz === 'local' ? undefined : tz,
    timeZoneName: 'shortOffset',
  }).formatToParts(new Date())
  return parts.find((p) => p.type === 'timeZoneName')?.value ?? ''
}

/* ---------------- ikonice ---------------- */
const Chevron = ({ dir = 'down', className = 'size-4' }: { dir?: 'down' | 'left' | 'right'; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    className={`${className} ${dir === 'left' ? 'rotate-90' : dir === 'right' ? '-rotate-90' : ''}`}
  >
    <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const Row = ({ icon, children, muted }: { icon: 'cal' | 'clock' | 'pin'; children: React.ReactNode; muted?: boolean }) => (
  <li className={`flex items-center gap-2.5 ${muted ? 'text-ink/45' : 'text-ink/75'}`}>
    <svg viewBox="0 0 24 24" fill="none" className="size-4 shrink-0 text-ink/45" aria-hidden="true">
      {icon === 'cal' && (
        <>
          <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.4" />
          <path d="M4 10h16M9 3v4m6-4v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </>
      )}
      {icon === 'clock' && (
        <>
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.4" />
          <path d="M12 8v4l2.5 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </>
      )}
      {icon === 'pin' && (
        <>
          <path d="M12 21s6-5.5 6-11a6 6 0 1 0-12 0c0 5.5 6 11 6 11Z" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.4" />
        </>
      )}
    </svg>
    <span>{children}</span>
  </li>
)

/* ---------------- kartica sesije ---------------- */
function SessionCard({ s, tz }: { s: Session; tz: string }) {
  const [more, setMore] = useState(false)
  const [bio, setBio] = useState(false)
  const [booked, setBooked] = useState(false)
  const timeZone = tz === 'local' ? undefined : tz
  const t = (d: Date) =>
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone })
  const end = new Date(s.start.getTime() + s.minutes * 60_000)

  return (
    <article className="grid gap-5 rounded-2xl bg-beige-soft p-5 sm:grid-cols-[auto_1fr_auto] sm:p-6">
      <div
        className="placeholder-grey size-20 rounded-lg sm:size-24"
        role="img"
        aria-label={`${s.title} photo placeholder`}
      />

      <div className="min-w-0">
        <p className="font-serif text-[0.7rem] uppercase tracking-[0.12em] text-ink/55">{s.type}</p>
        <h3 className="t-title mt-1 text-[1.45rem]">{s.title}</h3>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-[0.85rem]">
          <span className="grid size-6 place-items-center rounded-full bg-lilac font-serif text-[0.75rem]">
            {s.instructor[0]}
          </span>
          <span>{s.instructor}</span>
          <span className="text-ink/30">•</span>
          <button
            type="button"
            onClick={() => setBio((v) => !v)}
            aria-expanded={bio}
            className="text-ink/70 underline-offset-4 hover:underline"
          >
            {bio ? 'Hide bio' : 'Show bio'}
          </button>
        </div>
        {bio && (
          <p className="mt-2 rounded-lg bg-white/60 p-3 text-[0.82rem] leading-snug text-ink/75">
            {INSTRUCTORS[s.instructor]}
          </p>
        )}

        <p className={`mt-3 max-w-[28rem] text-[0.82rem] leading-snug text-ink/70 ${more ? '' : 'line-clamp-2'}`}>
          {s.description}
        </p>
        <button
          type="button"
          onClick={() => setMore((v) => !v)}
          aria-expanded={more}
          className="mt-0.5 text-[0.82rem] text-ink hover:underline"
        >
          {more ? 'Show less' : 'Show more'}
        </button>

        <ul className="mt-3 space-y-2 text-[0.82rem]">
          <Row icon="cal" muted={s.cancelled}>
            {s.start.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone })}
          </Row>
          <Row icon="clock" muted={s.cancelled}>
            {t(s.start)} – {t(end)} <span className="mx-1 text-ink/30">•</span> {s.minutes} min
          </Row>
          <Row icon="pin" muted={s.cancelled}>
            {s.location}
          </Row>
        </ul>
      </div>

      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
        <p className="text-[1.6rem] font-medium tracking-tight">${s.price}</p>
        {s.cancelled ? (
          <span className="inline-flex h-10 min-w-30 items-center justify-center rounded-md bg-ink/15 px-5 text-[0.9rem] text-white">
            Cancelled
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setBooked((v) => !v)}
            aria-pressed={booked}
            className={`inline-flex h-10 min-w-30 items-center justify-center rounded-md px-5 text-[0.9rem] font-medium transition-colors duration-300 ${
              booked ? 'bg-ink text-white' : 'bg-lilac-deep text-ink hover:bg-lilac'
            }`}
          >
            {booked ? 'Booked ✓' : 'Book now'}
          </button>
        )}
      </div>
    </article>
  )
}

/* ---------------- styled select ---------------- */
function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <label className="relative flex-1">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full cursor-pointer appearance-none rounded-full border border-line bg-beige-soft px-3 pr-9 text-[0.9rem] outline-none transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-lilac-deep"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <Chevron className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2" />
    </label>
  )
}

/* ---------------- glavni widget ---------------- */
export default function Schedule() {
  const now = useSyncExternalStore(noop, getClientNow, getServerNow)
  const [tab, setTab] = useState<SessionType>('Class')
  const [view, setView] = useState<'week' | 'month'>('week')
  const [weekOffset, setWeekOffset] = useState(0)
  const [monthOffset, setMonthOffset] = useState(0)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [instructor, setInstructor] = useState('all')
  const [location, setLocation] = useState('all')
  const [tz, setTz] = useState('local')
  const listRef = useRef<HTMLDivElement>(null)


  const sessions = useMemo(() => (now ? buildSessions(now) : []), [now])

  const weekDays = useMemo(() => {
    if (!now) return []
    const start = addDays(startOfWeek(now), weekOffset * 7)
    return Array.from({ length: 7 }, (_, i) => addDays(start, i))
  }, [now, weekOffset])

  const monthDays = useMemo(() => {
    if (!now) return { first: new Date(0), cells: [] as (Date | null)[] }
    const first = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1)
    const count = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()
    const cells: (Date | null)[] = Array(first.getDay()).fill(null)
    for (let d = 1; d <= count; d++) cells.push(new Date(first.getFullYear(), first.getMonth(), d))
    return { first, cells }
  }, [now, monthOffset])

  const filtered = useMemo(() => {
    let list = sessions.filter(
      (s) =>
        s.type === tab &&
        (instructor === 'all' || s.instructor === instructor) &&
        (location === 'all' || s.location === location),
    )
    if (selectedDay) list = list.filter((s) => dayKey(s.start) === selectedDay)
    else if (view === 'week' && weekDays.length) list = list.filter((s) => s.start >= weekDays[0])
    else if (view === 'month')
      list = list.filter(
        (s) =>
          s.start.getMonth() === monthDays.first.getMonth() &&
          s.start.getFullYear() === monthDays.first.getFullYear(),
      )
    return list
  }, [sessions, tab, instructor, location, selectedDay, view, weekDays, monthDays])

  const groups = useMemo(() => {
    const map = new Map<string, Session[]>()
    filtered.forEach((s) => {
      const k = dayKey(s.start)
      map.set(k, [...(map.get(k) ?? []), s])
    })
    return [...map.values()]
  }, [filtered])

  const sessionDays = useMemo(
    () => new Set(sessions.filter((s) => s.type === tab).map((s) => dayKey(s.start))),
    [sessions, tab],
  )

  // Blagi fade kad se lista promeni
  useEffect(() => {
    if (!listRef.current || prefersReducedMotion()) return
    gsap.fromTo(
      listRef.current.children,
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.04, ease: 'power2.out', overwrite: true },
    )
  }, [groups])

  const groupLabel = (d: Date, index: number) => {
    if (!now) return ''
    const diff = (startOfDay(d).getTime() - startOfDay(now).getTime()) / 86_400_000
    const md = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    if (diff === 0) return `Today, ${md.split(', ')[1]}`
    if (index === 0 && diff < 7) return `Next ${md}`
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }

  const goToday = () => {
    if (!now) return
    setWeekOffset(0)
    setMonthOffset(0)
    setSelectedDay(dayKey(now))
  }

  return (
    <div className="rounded-xl bg-beige p-4 sm:p-8">
      {/* vremenska zona */}
      <div className="flex justify-center">
        <label className="relative">
          <span className="sr-only">Time zone</span>
          <select
            value={tz}
            onChange={(e) => setTz(e.target.value)}
            className="h-10 cursor-pointer appearance-none rounded-full border border-line bg-beige-soft pl-4 pr-9 text-[0.95rem] outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-lilac-deep"
          >
            {TIMEZONES.map((z) => (
              <option key={z.id} value={z.id}>
                {z.label} {now ? tzOffsetLabel(z.id) : ''}
              </option>
            ))}
          </select>
          <Chevron className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2" />
        </label>
      </div>

      {/* tabovi + prikaz */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div role="tablist" aria-label="Session type" className="flex gap-4">
          {(['Class', 'Workshop'] as const).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => {
                setTab(t)
                setSelectedDay(null)
              }}
              className={`relative pb-2 text-[1.05rem] transition-colors ${tab === t ? 'text-ink' : 'text-ink/55 hover:text-ink'}`}
            >
              {t === 'Class' ? 'Classes' : 'Workshops'}
              <span
                className={`absolute bottom-0 left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-ink transition-transform duration-500 ease-(--ease-soft) ${tab === t ? 'scale-x-100' : 'scale-x-0'}`}
              />
            </button>
          ))}
        </div>
        <div className="flex rounded-full bg-beige-soft p-0.5 text-[0.9rem]">
          {(['week', 'month'] as const).map((v) => (
            <button
              key={v}
              onClick={() => {
                setView(v)
                setSelectedDay(null)
              }}
              aria-pressed={view === v}
              className={`h-9 rounded-full px-4 capitalize transition-colors ${view === v ? 'border border-ink bg-white' : 'text-ink/70 hover:text-ink'}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* nedelja / mesec */}
      {view === 'week' ? (
        <div className="mt-5 flex items-center gap-1">
          <button
            onClick={() => setWeekOffset((w) => Math.max(0, w - 1))}
            disabled={weekOffset === 0}
            aria-label="Previous week"
            className="grid size-8 shrink-0 place-items-center rounded-full bg-beige-soft transition-colors hover:bg-white disabled:opacity-40"
          >
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
                  className={`mx-auto flex w-full max-w-11 flex-col items-center rounded-lg py-1.5 text-[0.72rem] uppercase transition-colors ${
                    isSel ? 'bg-lilac text-ink' : 'text-ink/60 hover:bg-beige-soft'
                  }`}
                >
                  <span>{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                  <span className={`text-[0.95rem] ${isToday ? 'font-semibold text-ink' : ''}`}>{d.getDate()}</span>
                  <span className={`mt-0.5 size-1 rounded-full ${sessionDays.has(k) ? 'bg-ink/50' : 'bg-transparent'}`} />
                </button>
              )
            })}
          </div>
          <button
            onClick={() => setWeekOffset((w) => Math.min(10, w + 1))}
            aria-label="Next week"
            className="grid size-8 shrink-0 place-items-center rounded-full bg-beige-soft transition-colors hover:bg-white"
          >
            <Chevron dir="right" />
          </button>
        </div>
      ) : (
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setMonthOffset((m) => Math.max(0, m - 1))}
              disabled={monthOffset === 0}
              aria-label="Previous month"
              className="grid size-8 place-items-center rounded-full bg-beige-soft hover:bg-white disabled:opacity-40"
            >
              <Chevron dir="left" />
            </button>
            <p className="font-serif text-[1.1rem]">
              {monthDays.first.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
            <button
              onClick={() => setMonthOffset((m) => Math.min(2, m + 1))}
              aria-label="Next month"
              className="grid size-8 place-items-center rounded-full bg-beige-soft hover:bg-white"
            >
              <Chevron dir="right" />
            </button>
          </div>
          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[0.72rem] uppercase text-ink/50">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {monthDays.cells.map((d, i) => {
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
                  className={`flex aspect-square flex-col items-center justify-center rounded-lg text-[0.9rem] transition-colors ${
                    isSel ? 'bg-lilac' : has ? 'bg-beige-soft hover:bg-white' : 'text-ink/30'
                  }`}
                >
                  {d.getDate()}
                  <span className={`mt-0.5 size-1 rounded-full ${has ? 'bg-ink/50' : 'bg-transparent'}`} />
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* filteri */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setSelectedDay(null)
            setInstructor('all')
            setLocation('all')
          }}
          className="h-10 rounded-full border border-line bg-beige-soft px-3 text-[0.8rem] uppercase tracking-wide hover:bg-white"
        >
          Show all
        </button>
        <button
          onClick={goToday}
          className="h-10 rounded-full border border-line bg-beige-soft px-3 text-[0.8rem] uppercase tracking-wide hover:bg-white"
        >
          Today
        </button>
        <div className="flex min-w-[16rem] flex-1 gap-2">
          <Select
            label="Instructor"
            value={instructor}
            onChange={setInstructor}
            options={[
              { value: 'all', label: 'Instructors' },
              ...Object.keys(INSTRUCTORS).map((n) => ({ value: n, label: n })),
            ]}
          />
          <Select
            label="Location"
            value={location}
            onChange={setLocation}
            options={[{ value: 'all', label: 'Locations' }, ...LOCATIONS.map((l) => ({ value: l, label: l }))]}
          />
        </div>
      </div>

      {/* lista */}
      <div ref={listRef} className="mt-7 space-y-7" aria-live="polite">
        {!now && <div className="h-64 animate-pulse rounded-2xl bg-beige-soft/60" />}
        {now && groups.length === 0 && (
          <div className="rounded-2xl bg-beige-soft p-8 text-center">
            <p className="font-serif text-[1.3rem]">Nothing scheduled here yet.</p>
            <button
              onClick={() => {
                setSelectedDay(null)
                setInstructor('all')
                setLocation('all')
              }}
              className="btn btn-lilac mt-5"
            >
              Show all sessions
            </button>
          </div>
        )}
        {groups.map((g, i) => (
          <section key={dayKey(g[0].start)}>
            <h3 className="mb-3 text-[0.8rem] font-medium uppercase tracking-[0.06em] text-ink/70">
              {groupLabel(g[0].start, i)}
            </h3>
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
