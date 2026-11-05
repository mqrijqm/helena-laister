import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import Levels from '@/components/paths/Levels'
import { PATHS_PAGE } from '@/lib/content'

export const metadata: Metadata = { title: 'Paths — Helena Laister' }

export default function PathsPage() {
  return (
    <>
      <PageHero eyebrow="paths" lines={PATHS_PAGE.hero} text={PATHS_PAGE.heroText} stage="center" />
      <Levels />
    </>
  )
}
