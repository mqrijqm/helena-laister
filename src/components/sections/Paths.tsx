import Reveal from '@/components/Reveal'
import CodeGlyph from '@/components/CodeGlyph'
import { PATHS } from '@/lib/content'

export default function Paths() {
  return (
    <section id="paths" className="relative px-5 py-[clamp(6rem,12vw,11rem)] md:px-10">
      <Reveal className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <h2 data-reveal className="t-h2 neon max-w-[12ch]">
          {PATHS.title}
        </h2>
        <p data-reveal className="t-lead max-w-[30rem] self-end text-white/75">
          {PATHS.intro}
        </p>
      </Reveal>

      <Reveal as="div" stagger={0.12} className="mt-[clamp(4rem,7vw,7rem)]">
        <ol>
          {PATHS.items.map((p, i) => (
            <li
              key={p.name}
              data-reveal
              className="group grid grid-cols-[auto_1fr] items-start gap-x-6 gap-y-3 border-t border-lilac/20 py-9 transition-colors duration-700 hover:bg-lilac/[0.04] md:grid-cols-[3rem_6rem_1fr_1.5fr_11rem] md:items-center md:gap-x-8 md:px-2"
            >
              <span className="t-code text-lilac/60">{String(i + 1).padStart(2, '0')}</span>
              <CodeGlyph
                code={p.code}
                className="row-span-2 size-16 text-lilac/70 transition-all duration-700 group-hover:text-neon group-hover:drop-shadow-[0_0_10px_rgba(143,124,240,0.8)] md:row-span-1 md:size-20"
                strokeWidth={1}
              />
              <h3 className="t-h3 col-start-2 text-white md:col-start-auto">{p.name}</h3>
              <p className="t-body col-start-2 max-w-[34rem] text-white/70 md:col-start-auto">{p.text}</p>
              <span className="t-code col-start-2 text-neon/70 md:col-start-auto md:text-right">{p.meta}</span>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  )
}
