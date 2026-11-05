import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import BreathBar from '@/components/about/BreathBar'
import PortalPin from '@/components/about/PortalPin'
import WideImage from '@/components/about/WideImage'
import Reveal from '@/components/Reveal'

export const metadata: Metadata = { title: 'About' }

const VALUES = [
  {
    title: 'Radical welcome',
    text: 'Every body, identity, age and background belongs here. Your freedom to be fully yourself lives alongside the freedom of everyone else in the room — together, our individual rhythms make one shared frequency.',
  },
  {
    title: 'Boundaries',
    text: 'You deserve to hold your boundaries and to have them honored. The studio holds its own, too: discrimination, harassment and unwanted contact of any kind have no place in our physical or virtual spaces.',
  },
  {
    title: 'Shared energy',
    text: 'Connection is an active ingredient. When we breathe together, patterns soften and insight arrives more easily. If you need space, place a hand over your heart; if someone does this to you, answer with the same gesture.',
  },
  {
    title: 'Virtual presence',
    text: 'In online sessions, get comfortable — and bring the same intention and care you would bring into a shared room.',
  },
  {
    title: 'Accessibility',
    text: 'Everyone should be able to practice, whatever their experience or ability. We offer options, adaptations and support that honor different bodies and needs.',
  },
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        lines={['Breath is where', 'your body finds', 'its way back']}
        text="Helen is a space for coming back into the body — through breath, awareness and the quiet intelligence of the nervous system."
      >
        <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center pb-6">
          <BreathBar />
        </div>
      </PageHero>

      {/* Mission */}
      <Reveal as="section" className="grid gap-8 bg-paper px-5 pb-[clamp(6rem,12vw,12rem)] pt-[clamp(6rem,9vw,8.5rem)] md:grid-cols-12 md:px-7">
        <div data-reveal className="md:col-span-4">
          <span className="tag t-tag">Our Mission</span>
        </div>
        <div className="t-para space-y-[1em] text-ink/85 md:col-span-5 lg:col-span-4">
          <p data-reveal>
            We are here to offer a way back into the body — into the quiet, grounded place the
            breath has been keeping for you all along.
          </p>
          <p data-reveal>
            So many of us move through life cut off from our own inner signals. Breath turns
            shallow, the nervous system stays switched on, and the body forgets what safety feels
            like. We want to restore that connection in a way that feels gentle, human and real.
          </p>
          <p data-reveal>
            Our approach blends physiology, sound and somatic awareness so the body can settle,
            soften and find a healthier rhythm. We never force intensity — we support regulation,
            clarity and presence, meeting you exactly where you are.
          </p>
        </div>
      </Reveal>

      <PortalPin />
      <WideImage label="Studio atmosphere — image placeholder" />

      {/* Core values */}
      <section className="bg-beige px-5 pb-[clamp(5rem,10vw,10rem)] pt-[clamp(4rem,5vw,5rem)] md:px-7">
        <Reveal className="grid gap-6 md:grid-cols-12">
          <div data-reveal className="md:col-span-4">
            <span className="tag t-tag bg-beige-soft!">Core Values</span>
          </div>
          <h2 data-reveal className="t-h2 max-w-[14ch] md:col-span-8">
            The principles behind our work
          </h2>
        </Reveal>

        <ol className="mt-[clamp(4rem,7vw,7rem)]">
          {VALUES.map((v, i) => (
            <li key={v.title} className={i ? 'border-t border-line' : ''}>
              <Reveal className="grid gap-4 py-8 md:grid-cols-12">
                <span data-reveal className="font-serif text-[clamp(1.6rem,2.1vw,2.2rem)] font-light md:col-span-4">
                  ({String.fromCharCode(97 + i)})
                </span>
                <div data-reveal className="md:col-span-5 lg:col-span-4">
                  <h3 className="t-h3 text-[clamp(1.6rem,2.3vw,2.4rem)]!">{v.title}</h3>
                  <p className="t-small mt-4 text-ink/85">{v.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        {/* Founder */}
        <div className="mt-[clamp(6rem,12vw,12rem)] grid items-center gap-8 md:grid-cols-[1fr_minmax(260px,25vw)_1fr]">
          <Reveal className="order-1">
            <p data-reveal className="t-h2">About</p>
          </Reveal>
          <div
            className="placeholder-grey order-3 aspect-[3/4.4] w-full rounded-md md:order-2"
            role="img"
            aria-label="Portrait of Helen — image placeholder"
          />
          <Reveal className="order-2 md:order-3 md:text-right">
            <p data-reveal className="t-h2">Helen</p>
          </Reveal>
        </div>

        <Reveal className="mx-auto mt-[clamp(4rem,8vw,8rem)] md:w-[max(260px,25vw)]">
          <div className="t-small space-y-[1.3em] text-ink/85">
            <p data-reveal>
              Helen is the founder and creative force behind the studio. A designer, breathwork
              facilitator and lifelong student of the mind–body connection, she has spent the
              last decade exploring how sound, breath and collective presence can reshape our
              inner landscape.
            </p>
            <p data-reveal>
              Her approach is rooted in both science and intuition — the nervous system,
              neuroplasticity, somatics — but carried through the lens of art. For Helen,
              breathwork is less a technique than a medium: a way to open the body, soften the
              mind and make real change possible.
            </p>
            <p data-reveal>
              Her sessions are known for their rhythm, their tenderness, and the feeling of being
              held inside a shared field rather than practicing alone. Today she leads classes,
              trainings and collaborations that bridge wellness, neuroscience and art.
            </p>
          </div>
        </Reveal>
      </section>
    </>
  )
}
