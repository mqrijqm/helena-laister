import Link from 'next/link'
import { ROUTES } from '@/lib/routes'
import { SITE } from '@/lib/content'

export default function Footer() {
  return (
    <footer data-stage="dim" className="relative flex min-h-[30rem] flex-col justify-between border-t border-lilac/15 px-5 pb-8 pt-12 md:px-10">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="t-code neon">[ stay sovereign ]</p>
          <p className="t-h2 mt-5 max-w-[11ch] text-white">take the codes with you</p>
          <Link href="/#circle" className="btn btn-lilac mt-8">
            join the circle
          </Link>
        </div>
        <div className="md:col-span-2">
          <p className="t-code mb-4 text-lilac/50">navigate</p>
          <ul className="t-body space-y-1.5">
            {ROUTES.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="text-white/80 transition-colors hover:text-neon">
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-3">
          <p className="t-code mb-4 text-lilac/50">contact</p>
          <ul className="t-body space-y-1.5 text-white/80">
            <li>
              <a href={SITE.instagram} target="_blank" rel="noreferrer" className="hover:text-neon">
                Instagram
              </a>
            </li>
            <li>
              <a href={SITE.youtube} className="hover:text-neon">
                YouTube
              </a>
            </li>
            <li>
              <a href={SITE.whatsapp} className="hover:text-neon">
                WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="hover:text-neon">
                {SITE.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="t-code mt-16 flex flex-col gap-3 text-white/40 md:flex-row md:justify-between">
        <p className="font-serif text-[clamp(2rem,4vw,3.6rem)] normal-case tracking-normal text-white/90">{SITE.name}</p>
        <p className="md:self-end">© {SITE.name} · all rights reserved</p>
      </div>
    </footer>
  )
}
