import { SITE } from '@/lib/content'

export default function Footer() {
  return (
    <footer className="relative flex flex-col gap-6 px-5 py-10 md:flex-row md:items-end md:justify-between md:px-10">
      <div>
        <p className="font-serif text-[clamp(2rem,4vw,3.6rem)] font-light leading-none text-white">{SITE.name}</p>
        <p className="t-code neon mt-3">stay sovereign</p>
      </div>
      <div className="t-code flex flex-wrap gap-5 text-white/50">
        <a href={SITE.instagram} target="_blank" rel="noreferrer" className="hover:text-white">
          Instagram
        </a>
        <a href={SITE.youtube} className="hover:text-white">
          YouTube
        </a>
        <a href={`mailto:${SITE.email}`} className="hover:text-white">
          E-mail
        </a>
        <span>© {SITE.name}</span>
      </div>
    </footer>
  )
}
