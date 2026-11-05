import Reveal from '@/components/Reveal'

function Spiral() {
  return (
    <svg viewBox="0 0 100 100" fill="none" className="size-[clamp(64px,7vw,104px)] text-ink/55" aria-hidden="true">
      <path
        d="M50 50c0-3 3-5 6-4 4 1 5 6 3 10-3 5-10 6-15 3-6-4-7-13-3-19 5-7 16-9 24-4 9 6 11 19 5 28-7 10-22 13-33 6C25 63 21 46 28 33 36 19 55 14 70 21c16 8 22 28 14 44-9 17-30 24-47 16"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function IntroStrip() {
  return (
    <Reveal as="section" className="grid gap-8 bg-beige px-5 pb-12 pt-4 md:grid-cols-2 md:px-7">
      <div data-reveal>
        <Spiral />
      </div>
      <p data-reveal className="t-para max-w-[34ch] text-ink/85">
        Every session is an invitation back to the present. Rhythm, sound and intention
        loosen what the body has been holding, and the mind follows.
      </p>
    </Reveal>
  )
}
