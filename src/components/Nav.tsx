'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import CodeGlyph from './CodeGlyph'
import { useAmbientSound } from './useAmbientSound'
import { ROUTES } from '@/lib/routes'
import { SITE } from '@/lib/content'
import { EASE } from '@/lib/motion'

gsap.registerPlugin(useGSAP)

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

/** Stari UX (pilula: Sound · znak · Menu, padajući numerisani meni) u tamnom staklu. */
export default function Nav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const sound = useAmbientSound()
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)

  useGSAP(
    () => {
      gsap.set(panelRef.current, { autoAlpha: 0, clipPath: 'inset(0% 0% 100% 0% round 24px)' })
      tl.current = gsap
        .timeline({ paused: true })
        .to(panelRef.current, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0% round 24px)', duration: 0.7, ease: EASE.expo })
        .from('[data-menu-item]', { y: 14, autoAlpha: 0, duration: 0.5, stagger: 0.05, ease: EASE.out }, 0.12)
    },
    { scope: rootRef },
  )

  useEffect(() => {
    if (!tl.current) return
    if (open) tl.current.timeScale(1).play()
    else tl.current.timeScale(1.6).reverse()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onDown = (e: PointerEvent) => !rootRef.current?.contains(e.target as Node) && setOpen(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className="fixed left-1/2 top-4 z-50 w-[min(calc(100vw-24px),400px)] -translate-x-1/2">
      <header className="grid h-[58px] grid-cols-[1fr_auto_1fr] items-center rounded-full border border-lilac/25 bg-void/60 px-4 text-white backdrop-blur-md">
        <button
          type="button"
          onClick={sound.toggle}
          aria-pressed={sound.on}
          className="t-code flex items-center gap-2 justify-self-start text-white/65 transition-colors hover:text-neon"
        >
          <SoundBars on={sound.on} />
          sound
        </button>

        <Link href="/" aria-label={`${SITE.name} — home`} className="text-lilac drop-shadow-[0_0_8px_rgba(143,124,240,0.8)]">
          <CodeGlyph code="merkaba" spin draw={false} strokeWidth={1.1} className="size-9" />
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="site-menu"
          className="t-code flex items-center gap-2 justify-self-end text-white/65 transition-colors hover:text-neon"
        >
          {open ? 'close' : 'menu'}
          <span className="relative block size-3" aria-hidden="true">
            <span className={`absolute left-1/2 top-1/2 size-[4px] rounded-full bg-lilac transition-transform duration-500 ease-(--ease-soft) ${open ? '-translate-x-[6px] -translate-y-1/2' : '-translate-x-1/2 -translate-y-[6px]'}`} />
            <span className={`absolute left-1/2 top-1/2 size-[4px] rounded-full bg-lilac transition-transform duration-500 ease-(--ease-soft) ${open ? 'translate-x-[2px] -translate-y-1/2' : '-translate-x-1/2 translate-y-[2px]'}`} />
          </span>
        </button>
      </header>

      <div ref={panelRef} id="site-menu" className="invisible mt-2 rounded-3xl border border-lilac/25 bg-void/80 backdrop-blur-md">
        <nav aria-label="Main">
          <ul className="px-2 pt-2">
            {ROUTES.map((r, i) => {
              const active = pathname === r.href
              return (
                <li key={r.href} data-menu-item className="border-b border-lilac/15">
                  <Link
                    href={r.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className="group flex items-baseline gap-4 px-3 py-3 text-white"
                  >
                    <span className="t-code w-5 text-lilac/50">{String(i + 1).padStart(2, '0')}</span>
                    <span className="relative font-serif text-[1.35rem] font-light leading-tight">
                      {r.label}
                      <span className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-lilac shadow-[0_0_8px_#8f7cf0] transition-transform duration-500 ease-(--ease-soft) ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div data-menu-item className="flex items-center justify-between p-4 pt-8">
          <Link href="/#contact" onClick={() => setOpen(false)} className="btn btn-lilac min-h-10! px-5!">
            book
          </Link>
          <a href={SITE.instagram} target="_blank" rel="noreferrer" className="t-code text-white/50 hover:text-neon">
            @{SITE.handle}
          </a>
        </div>
      </div>
    </div>
  )
}
