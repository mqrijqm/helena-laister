import type { Metadata } from 'next'
import Schedule from '@/components/sessions/Schedule'
import { SESSIONS_PAGE } from '@/lib/content'

export const metadata: Metadata = { title: 'Sessions — Helena Laister' }

export default function SessionsPage() {
  return (
    // data-stage="dim" → glavna animacija tiho iza uvoda
    <section data-stage="dim" className="grid gap-12 px-5 pb-24 pt-32 md:grid-cols-2 md:px-10 md:pt-[173px]">
      <div>
        <div className="md:sticky md:top-[120px]">
          <p className="t-code neon">[ sessions ]</p>
          <h1 className="t-h2 mt-5 max-w-[12ch] text-white">{SESSIONS_PAGE.title}</h1>
          <p className="t-body mt-6 max-w-[28rem] text-white/75">{SESSIONS_PAGE.text}</p>
          <div className="t-small mt-12 flex items-start gap-4 text-white/80">
            <span className="mt-1 size-2.5 shrink-0 rounded-full bg-neon shadow-[0_0_12px_#8f7cf0]" aria-hidden="true" />
            <p>
              {SESSIONS_PAGE.where[0]}
              <br />
              <span className="text-white/50">{SESSIONS_PAGE.where[1]}</span>
            </p>
          </div>
        </div>
      </div>
      <Schedule />
    </section>
  )
}
