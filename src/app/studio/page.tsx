import type { Metadata } from 'next'
import Schedule from '@/components/studio/Schedule'

export const metadata: Metadata = { title: 'Studio' }

export default function StudioPage() {
  return (
    <section className="grid gap-12 px-5 pb-24 pt-32 md:grid-cols-2 md:px-7 md:pt-[173px]">
      {/* Levo: lepljiv uvod */}
      <div>
        <div className="md:sticky md:top-[100px]">
          <h1 className="t-h2 max-w-[15ch]">Helen Breathwork in the Studio</h1>
          <p className="t-small mt-6 max-w-[28rem] text-ink/80">
            Step into a room built for slowing down — guided breath journeys for release,
            expanded awareness and emotional healing, every week.
          </p>
          <div className="t-small mt-12 flex items-start gap-4">
            <svg viewBox="0 0 24 24" className="mt-0.5 size-5 shrink-0" aria-hidden="true">
              <circle cx="12" cy="8" r="4.5" fill="currentColor" />
              <path d="M12 12.5V22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <p>
              HELEN @ Studio Room
              <br />
              2nd Floor, Main Street 12
            </p>
          </div>
        </div>
      </div>

      {/* Desno: raspored */}
      <Schedule />
    </section>
  )
}
