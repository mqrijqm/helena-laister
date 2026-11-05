import type { Metadata } from 'next'
import { Newsreader, Inter_Tight } from 'next/font/google'
import SmoothScroll from '@/components/SmoothScroll'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import './globals.css'

// Varijabilni serif (zamena za Aime) — axis "opsz" daje finiji crtež na velikim veličinama
const newsreader = Newsreader({
  variable: '--font-newsreader',
  subsets: ['latin'],
  axes: ['opsz'],
  style: ['normal', 'italic'],
})

// Grotesk (zamena za Neue Montreal)
const interTight = Inter_Tight({
  variable: '--font-inter-tight',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Helen — Breathwork',
    template: '%s • Helen Breathwork',
  },
  description:
    'Guided breathwork sessions, teacher training and a weekly studio practice for a calmer nervous system.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${newsreader.variable} ${interTight.variable} antialiased`}>
      <body className="min-h-dvh bg-paper text-ink">
        <SmoothScroll>
          <Nav />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  )
}
