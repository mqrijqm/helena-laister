import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import BreathBar from '@/components/about/BreathBar'
import PortalPin from '@/components/about/PortalPin'
import WideImage from '@/components/about/WideImage'
import Reveal from '@/components/Reveal'
import CodeGlyph from '@/components/CodeGlyph'
import { ABOUT_PAGE } from '@/lib/content'

export const metadata: Metadata = { title: 'About — Helena Laister' }

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="about" lines={ABOUT_PAGE.hero} text={ABOUT_PAGE.heroText} stage="center" code="krystal-heart">
        <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center pb-6">
          <BreathBar />
        </div>
      </PageHero>

      {/* misija */}
      <Reveal as="section" className="grid gap-8 bg-lilac px-5 pb-[clamp(6rem,12vw,12rem)] pt-[clamp(6rem,9vw,8.5rem)] text-ink md:grid-cols-12 md:px-10">
        <div data-reveal className="md:col-span-4">
          <span className="tag t-code text-ink/70">my mission</span>
        </div>
        <div className="t-lead space-y-[1em] md:col-span-6 lg:col-span-5">
          {ABOUT_PAGE.mission.map((p) => (
            <p key={p} data-reveal>
              {p}
            </p>
          ))}
        </div>
      </Reveal>

      <PortalPin />
      <WideImage label="Helena — image placeholder" />

      {/* principi + osnivač */}
      <section className="relative overflow-hidden bg-lilac px-5 pb-[clamp(5rem,10vw,10rem)] pt-[clamp(4rem,5vw,5rem)] text-ink md:px-10">
        <Reveal className="grid gap-6 md:grid-cols-12">
          <div data-reveal className="md:col-span-4">
            <span className="tag t-code text-ink/70">principles</span>
          </div>
          <h2 data-reveal className="t-h2 max-w-[13ch] text-white md:col-span-8">
            {ABOUT_PAGE.principlesTitle}
          </h2>
        </Reveal>

        <ol className="mt-[clamp(4rem,7vw,7rem)]">
          {ABOUT_PAGE.principles.map((v, i) => (
            <li key={v.title} className={i ? 'border-t border-white/60' : ''}>
              <Reveal className="grid gap-4 py-8 md:grid-cols-12">
                <span data-reveal className="font-serif text-[clamp(1.6rem,2.1vw,2.2rem)] font-light text-white md:col-span-4">
                  ({String.fromCharCode(97 + i)})
                </span>
                <div data-reveal className="md:col-span-6 lg:col-span-5">
                  <h3 className="t-h3">{v.title}</h3>
                  <p className="t-body mt-4 text-ink/80">{v.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        {/* osnivač */}
        <div className="mt-[clamp(6rem,12vw,12rem)] grid items-center gap-8 md:grid-cols-[1fr_minmax(260px,25vw)_1fr]">
          <Reveal className="order-1">
            <p data-reveal className="t-h2 text-white">
              About
            </p>
          </Reveal>
          <div
            role="img"
            aria-label="Portrait of Helena — photo placeholder"
            className="photo-placeholder relative order-3 aspect-[3/4.4] w-full overflow-hidden rounded-[999px_999px_12px_12px] md:order-2"
          >
            <CodeGlyph code="star-gate" className="absolute inset-[16%] text-white/70" strokeWidth={1} />
          </div>
          <Reveal className="order-2 md:order-3 md:text-right">
            <p data-reveal className="t-h2 italic text-white">
              Helena
            </p>
          </Reveal>
        </div>

        <Reveal className="mx-auto mt-[clamp(4rem,8vw,8rem)] md:w-[max(280px,28vw)]">
          <div className="t-body space-y-[1.2em] text-ink/85">
            {ABOUT_PAGE.bio.map((p) => (
              <p key={p} data-reveal>
                {p}
              </p>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  )
}
