import Reveal from '@/components/Reveal'
import CodeGlyph from '@/components/CodeGlyph'
import { WHY } from '@/lib/content'

export default function Why() {
  return (
    <section id="why" className="relative overflow-hidden bg-lilac px-5 py-[clamp(6rem,12vw,11rem)] text-ink md:px-10">
      <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <CodeGlyph code="merkaba" spin className="mx-auto w-[min(78vw,520px)] text-white" strokeWidth={1.1} />

        <Reveal>
          <h2 data-reveal className="t-h2 text-white">
            {WHY.title}
          </h2>
          <div className="t-lead mt-10 max-w-[34rem] space-y-6">
            {WHY.paragraphs.map((p) => (
              <p key={p} data-reveal>
                {p}
              </p>
            ))}
          </div>
          <p data-reveal className="t-h3 mt-12 italic text-white">
            {WHY.quote}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
