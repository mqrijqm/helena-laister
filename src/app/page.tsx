import Hero from '@/components/sections/Hero'
import Why from '@/components/sections/Why'
import Paths from '@/components/sections/Paths'
import About from '@/components/sections/About'
import KeyCodes from '@/components/sections/KeyCodes'
import Contact from '@/components/sections/Contact'

// Tok: crna (galaksija) → lila → crna → lila → crna → lila
export default function Home() {
  return (
    <>
      <Hero />
      <Why />
      <Paths />
      <About />
      <KeyCodes />
      <Contact />
    </>
  )
}
