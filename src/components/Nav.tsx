'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import Logo from './Logo'
import { ROUTES } from '@/lib/routes'
import { useAmbientSound } from './useAmbientSound'
import { EASE } from '@/lib/motion'

gsap.registerPlugin(useGSAP)

function HeadphonesIcon({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-6" aria-hidden="true">
      <path
        d="M4 15v-3a8 8 0 0 1 16 0v3"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <rect x="3" y="14" width="4" height="6.5" rx="1.6" stroke="currentColor" strokeWidth="1" />
      <rect x="17" y="14" width="4" height="6.5" rx="1.6" stroke="currentColor" strokeWidth="1" />
      {muted ? (
        <path d="m10 11.5 4 4m0-4-4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      ) : (
        <path
          d="M9.5 13.5c.8-1.6 1.6-1.6 2.5 0s1.7 1.6 2.5 0"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          className="origin-center animate-pulse"
        />
      )}
    </svg>
  )
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const sound = useAmbientSound()
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)

  useGSAP(
    () => {
      const panel = panelRef.current!
      gsap.set(panel, { autoAlpha: 0, clipPath: 'inset(0% 0% 100% 0% round 8px)' })
      tl.current = gsap
        .timeline({ paused: true })
        .to(panel, {
          autoAlpha: 1,
          clipPath: 'inset(0% 0% 0% 0% round 8px)',
          duration: 0.7,
          ease: EASE.expo,
        })
        .from(
          '[data-menu-item]',
          { y: 14, autoAlpha: 0, duration: 0.5, stagger: 0.05, ease: EASE.out },
          0.12,
        )
    },
    { scope: rootRef },
  )

  useEffect(() => {
    if (!tl.current) return
    if (open) tl.current.timeScale(1).play()
    else tl.current.timeScale(1.6).reverse()
  }, [open])

  // Escape i klik van menija
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onClick)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onClick)
    }
  }, [open])

  return (
    <div
      ref={rootRef}
      className="fixed left-1/2 top-4 z-50 w-[clamp(300px,24vw,400px)] -translate-x-1/2"
    >
      <header className="relative grid h-[57px] grid-cols-[1fr_auto_1fr] items-center rounded-lg border border-line bg-beige-soft/95 px-3 text-ink backdrop-blur-md">
        <button
          type="button"
          onClick={sound.toggle}
          aria-pressed={sound.on}
          className="flex items-center gap-2 justify-self-start font-serif text-[0.95rem] text-ink/75 transition-colors hover:text-ink"
        >
          <HeadphonesIcon muted={!sound.on} />
          <span>Sound</span>
        </button>

        <Link href="/" aria-label="Helen — home" className="text-ink/80">
          <Logo className="size-9" />
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="site-menu"
          className="flex items-center gap-2 justify-self-end font-serif text-[0.95rem] text-ink/75 transition-colors hover:text-ink"
        >
          <span>{open ? 'Close' : 'Menu'}</span>
          {/* dve tačke: vertikalno → horizontalno */}
          <span className="relative block size-3" aria-hidden="true">
            <span
              className={`absolute left-1/2 top-1/2 size-[4px] rounded-full bg-ink transition-transform duration-500 ease-(--ease-soft) ${open ? '-translate-x-[6px] -translate-y-1/2' : '-translate-x-1/2 -translate-y-[6px]'}`}
            />
            <span
              className={`absolute left-1/2 top-1/2 size-[4px] rounded-full bg-ink transition-transform duration-500 ease-(--ease-soft) ${open ? 'translate-x-[2px] -translate-y-1/2' : '-translate-x-1/2 translate-y-[2px]'}`}
            />
          </span>
        </button>
      </header>

      <div
        ref={panelRef}
        id="site-menu"
        className="invisible mt-2 rounded-lg border border-line bg-beige-soft/95 backdrop-blur-md"
      >
        <nav aria-label="Main">
          <ul>
            {ROUTES.map((r, i) => {
              const active = pathname === r.href
              return (
                <li key={r.href} data-menu-item className="border-b border-line">
                  <Link
                    href={r.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className="group flex items-baseline gap-4 px-4 py-2.5 font-serif text-ink"
                  >
                    <span className="w-3 text-[0.72rem] text-ink/60">{i + 1}.</span>
                    <span className="relative text-[1.2rem] leading-tight">
                      {r.label}
                      <span
                        className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-lilac-deep transition-transform duration-500 ease-(--ease-soft) ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
                      />
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div data-menu-item className="flex items-end justify-between p-4 pt-10">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="grid size-11 place-items-center rounded-full bg-lilac text-ink transition-colors hover:bg-lilac-deep"
          >
            <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
              <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </a>
          <span className="t-small text-ink/50">Breathwork · Studio · Training</span>
        </div>
      </div>
    </div>
  )
}
