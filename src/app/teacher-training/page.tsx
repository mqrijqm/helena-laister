import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import Levels from '@/components/training/Levels'

export const metadata: Metadata = { title: 'Teacher Training' }

export default function TeacherTrainingPage() {
  return (
    <>
      <PageHero
        lines={['The Helen', 'Teacher Training', 'Pathway']}
        text="A three-level pathway — from foundational breathwork skills to group facilitation and, finally, mastery in the medicine of breath."
      />
      <Levels />
    </>
  )
}
