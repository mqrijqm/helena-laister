import Reveal from '@/components/Reveal'
import CodeGlyph from '@/components/CodeGlyph'
import { CONTACT, SITE } from '@/lib/content'

const CHANNELS = [
  { label: 'WhatsApp', href: SITE.whatsapp },
  { label: 'Instagram', href: SITE.instagram },
  { label: 'YouTube', href: SITE.youtube },
  { label: 'E-mail', href: `mailto:${SITE.email}` },
]

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-lilac px-5 py-[clamp(6rem,12vw,11rem)] text-ink md:px-10">
      <CodeGlyph
        code="star-gate"
        className="pointer-events-none absolute -right-[10%] top-1/2 w-[min(90vw,640px)] -translate-y-1/2 text-white/60"
        strokeWidth={1}
      />
      <Reveal className="relative max-w-[42rem]">
        <h2 data-reveal className="t-h2 text-white">
          {CONTACT.title}
        </h2>
        <p data-reveal className="t-lead mt-8">
          {CONTACT.text}
        </p>
        <ul data-reveal className="mt-10 flex flex-wrap gap-3">
          {CHANNELS.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="btn btn-ink"
              >
                {c.label} <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
        <p data-reveal className="t-code mt-10 text-ink/60">
          @{SITE.handle}
        </p>
      </Reveal>
    </section>
  )
}
