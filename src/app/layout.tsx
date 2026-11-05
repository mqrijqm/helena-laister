import type { Metadata } from 'next'
import { Newsreader, Inter_Tight } from 'next/font/google'
import SmoothScroll from '@/components/SmoothScroll'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Splash from '@/components/Splash'
import Galaxy from '@/components/Galaxy'
import './globals.css'

// Veliki, tanak serif za naslove (varijabilni; axis "opsz" daje finiji crtež na velikim veličinama)
const newsreader = Newsreader({
  variable: '--font-newsreader',
  subsets: ['latin'],
  axes: ['opsz'],
  style: ['normal', 'italic'],
})

// Čist grotesk za tekst
const interTight = Inter_Tight({
  variable: '--font-inter-tight',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Helena Laister — Key Codes, Activation & Guidance',
  description:
    'A home outside the algorithm. 1:1 activations, guidance and live teachings on Krystic ascension mechanics, merkaba and key codes.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${newsreader.variable} ${interTight.variable} antialiased`}>
      <body className="min-h-dvh text-white">
        {/* bez JS-a splash bi ostao zauvek — sakrij ga */}
        <noscript>
          <style>{'#splash{display:none!important}'}</style>
        </noscript>
        <Galaxy />
        <SmoothScroll>
          <Splash />
          <Nav />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  )
}
