'use client'

import { useSyncExternalStore } from 'react'
import type { MorphApi, MorphPhase } from '@/components/KeyCodeMorph'

/**
 * "Magistrala" glavne animacije: jedna KeyCodeMorph instanca živi u layoutu,
 * a sekcije čitaju njeno stanje (koji kod, koja faza) i mogu da traže drugi kod.
 */
type State = { i: number; phase: MorphPhase }

let state: State = { i: 0, phase: 'chaos' }
let api: MorphApi | null = null
const subs = new Set<() => void>()

export const morphBus = {
  get: () => state,
  set(next: State) {
    if (next.i === state.i && next.phase === state.phase) return
    state = next
    subs.forEach((f) => f())
  },
  subscribe(f: () => void) {
    subs.add(f)
    return () => subs.delete(f)
  },
  register(a: MorphApi | null) {
    api = a
  },
  goTo(i: number) {
    api?.goTo(i)
  },
}

const SERVER: State = { i: 0, phase: 'chaos' }
export function useMorphState() {
  return useSyncExternalStore(morphBus.subscribe, morphBus.get, () => SERVER)
}
