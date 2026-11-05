import Hero from '@/components/sections/Hero'
import Why from '@/components/sections/Why'
import Paths from '@/components/sections/Paths'
import About from '@/components/sections/About'
import Shifts from '@/components/sections/Shifts'
import Circle from '@/components/sections/Circle'
import KeyCodes from '@/components/sections/KeyCodes'
import Contact from '@/components/sections/Contact'

// Tok: crna (galaksija + glavna animacija) ↔ lila, naizmenično
export default function Home() {
  return (
    <>
      <Hero />
      <Why />
      <Paths />
      <About />
      <Shifts />
      <Circle />
      <KeyCodes />
      <Contact />
    </>
  )
}
