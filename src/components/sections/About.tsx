import Image from 'next/image'
import Reveal from '@/components/Reveal'
import CodeGlyph from '@/components/CodeGlyph'
import { ABOUT } from '@/lib/content'

export default function About() {
  return (
    <section id="who" className="relative overflow-hidden bg-lilac px-5 py-[clamp(6rem,12vw,11rem)] text-ink md:px-10">
      <div className="grid items-start gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        {/* fotografija — placeholder dok Helena ne pošalje materijal */}
        <div className="relative lg:sticky lg:top-28">
          <div className="relative aspect-[4/5] w-full max-w-[460px] overflow-hidden rounded-[999px_999px_12px_12px] bg-ink">
            <Image
              src="/images/helena-tattoo.webp"
              alt="Helena from behind, wrapped in orange silk, a large Buddha and lotus tattoo across her back"
              fill
              sizes="(min-width: 1024px) 460px, 90vw"
              className="object-cover object-[50%_35%]"
            />
            <CodeGlyph code="eckasha" className="pointer-events-none absolute inset-[14%] text-white/30" strokeWidth={1} />
          </div>
          <p className="t-code mt-4 text-ink/60">helena · the lotus & the buddha</p>
        </div>

        <Reveal stagger={0.1}>
          <h2 data-reveal className="t-h2 text-white">
            {ABOUT.title}
          </h2>
          <ol className="mt-12 space-y-7">
            {ABOUT.sentences.map((s, i) => (
              <li key={s} data-reveal className="grid grid-cols-[2.5rem_1fr] gap-4 border-t border-white/50 pt-6">
                <span className="t-code pt-2 text-ink/50">{String(i + 1).padStart(2, '0')}</span>
                <p className="t-lead">{s}</p>
              </li>
            ))}
          </ol>
          <p data-reveal className="t-h3 mt-10 italic text-white">
            {ABOUT.signature}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
