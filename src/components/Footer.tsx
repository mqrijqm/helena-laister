import Link from 'next/link'
import { ROUTES } from '@/lib/routes'

export default function Footer() {
  return (
    <footer className="relative z-10 flex min-h-[36rem] flex-col justify-between bg-lilac px-5 pb-6 pt-10 text-ink md:px-7">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <h2 className="t-h2 max-w-[13ch]">Take your practice with you</h2>
          <a
            href="#"
            className="mt-7 inline-flex items-center gap-4 rounded-md bg-paper px-4 py-3 transition-colors hover:bg-white"
          >
            <svg viewBox="0 0 24 24" className="size-7" fill="currentColor" aria-hidden="true">
              <path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.8-.8-3-.8-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.8-2.3.9-1.3 1.3-2.6 1.3-2.6s-2.5-1-2.5-3.8ZM14.1 5.8c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1 .1 2.1-.5 2.7-1.3Z" />
            </svg>
            <span className="leading-tight">
              <span className="block text-[0.8rem] text-ink/70">Download on the</span>
              <span className="block text-[1.15rem] font-medium">App Store</span>
            </span>
          </a>
        </div>

        <div className="t-body md:col-span-2">
          <p className="mb-3 text-ink/55">Navigate</p>
          <ul className="space-y-1">
            {ROUTES.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="transition-opacity hover:opacity-60">
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="t-body md:col-span-3">
          <p className="mb-3 text-ink/55">Contact</p>
          <ul className="space-y-1">
            <li>
              <a href="mailto:hello@example.com" className="transition-opacity hover:opacity-60">
                hello@example.com
              </a>
            </li>
            <li>Studio Room, 2nd Floor</li>
          </ul>
        </div>

        <div className="md:col-span-2 md:justify-self-end">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="grid size-11 place-items-center rounded-full bg-paper transition-colors hover:bg-white"
          >
            <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
              <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </a>
        </div>
      </div>

      <div className="t-small mt-16 flex flex-col gap-3 text-ink/60 md:grid md:grid-cols-12">
        <p className="md:col-span-5">© Helen Breathwork</p>
        <p className="flex gap-4 md:col-span-5">
          <a href="#" className="hover:text-ink">Privacy Policy</a>
          <a href="#" className="hover:text-ink">Cookie Policy</a>
        </p>
      </div>
    </footer>
  )
}
