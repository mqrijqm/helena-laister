'use client'

import { useEffect, useState } from 'react'
import { useAmbientSound } from './useAmbientSound'
import { SITE } from '@/lib/content'

const LINKS = [
  { href: '#why', label: 'why' },
  { href: '#paths', label: 'paths' },
  { href: '#who', label: 'who i am' },
  { href: '#codes', label: 'key codes' },
  { href: '#contact', label: 'contact' },
]

function SoundBars({ on }: { on: boolean }) {
  return (
    <span className="flex h-3 items-end gap-[2px]" aria-hidden="true">
      {[0.5, 1, 0.7, 0.9].map((h, i) => (
        <span
          key={i}
          className={`w-[2px] rounded-full bg-current ${on ? 'animate-pulse' : ''}`}
          style={{ height: on ? `${h * 100}%` : '20%', animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  )
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  const sound = useAmbientSound()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 md:top-4 md:px-6">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-4 rounded-full border border-lilac/20 bg-void/55 pl-5 pr-2 backdrop-blur-md">
        <a href="#top" className="font-serif text-[1.15rem] font-light tracking-tight text-white">
          {SITE.name.toLowerCase()}
        </a>

        <nav aria-label="Sections" className="hidden lg:block">
          <ul className="flex gap-7">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="t-code text-white/60 transition-colors hover:text-neon">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={sound.toggle}
            aria-pressed={sound.on}
            className="t-code flex h-10 items-center gap-2 rounded-full px-3 text-white/60 transition-colors hover:text-neon"
          >
            <SoundBars on={sound.on} />
            <span className="hidden sm:inline">sound</span>
          </button>
          <a href="#contact" className="btn btn-lilac hidden min-h-10! px-5! sm:inline-flex">
            book
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="t-code h-10 rounded-full px-4 text-white lg:hidden"
          >
            {open ? 'close' : 'menu'}
          </button>
        </div>
      </div>

      {/* mobilni meni */}
      <div
        id="mobile-menu"
        className={`mx-auto mt-2 max-w-[1400px] overflow-hidden rounded-3xl border border-lilac/20 bg-void/85 backdrop-blur-md transition-all duration-500 ease-(--ease-soft) lg:hidden ${open ? 'max-h-96 opacity-100' : 'pointer-events-none max-h-0 opacity-0'}`}
      >
        <ul className="p-3">
          {LINKS.map((l, i) => (
            <li key={l.href} className="border-b border-lilac/10 last:border-0">
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4 px-3 py-3 font-serif text-[1.4rem] font-light text-white"
              >
                <span className="t-code text-lilac/50">{String(i + 1).padStart(2, '0')}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
