'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Tihi ambijentalni zvuk napravljen u browseru (Web Audio) — bez audio fajla.
 * Smeđi šum (kao daleki talasi) + dva niska tona koja "dišu".
 * Kad dobiješ pravi audio fajl, ovo se menja jednim <audio> elementom.
 */
export function useAmbientSound() {
  const [on, setOn] = useState(false)
  const ctxRef = useRef<AudioContext | null>(null)
  const masterRef = useRef<GainNode | null>(null)

  const build = useCallback(() => {
    const ctx = new AudioContext()
    const master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)

    // Smeđi šum
    const len = ctx.sampleRate * 4
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let last = 0
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1
      last = (last + 0.02 * white) / 1.02
      data[i] = last * 3.2
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    noise.loop = true
    const lowpass = ctx.createBiquadFilter()
    lowpass.type = 'lowpass'
    lowpass.frequency.value = 420
    const noiseGain = ctx.createGain()
    noiseGain.gain.value = 0.55
    noise.connect(lowpass).connect(noiseGain).connect(master)

    // "Disanje" — spori LFO na glasnoći šuma (ciklus ~10 s)
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.1
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 0.3
    lfo.connect(lfoGain).connect(noiseGain.gain)

    // Dva niska tona
    ;[110, 164.8].forEach((f) => {
      const o = ctx.createOscillator()
      o.type = 'sine'
      o.frequency.value = f
      const g = ctx.createGain()
      g.gain.value = 0.05
      o.connect(g).connect(master)
      o.start()
    })

    noise.start()
    lfo.start()
    ctxRef.current = ctx
    masterRef.current = master
  }, [])

  const toggle = useCallback(async () => {
    if (!ctxRef.current) build()
    const ctx = ctxRef.current!
    const master = masterRef.current!
    if (ctx.state === 'suspended') await ctx.resume()
    const now = ctx.currentTime
    master.gain.cancelScheduledValues(now)
    master.gain.setValueAtTime(master.gain.value, now)
    if (on) {
      master.gain.linearRampToValueAtTime(0, now + 0.8)
    } else {
      master.gain.linearRampToValueAtTime(0.22, now + 1.6)
    }
    setOn(!on)
  }, [on, build])

  useEffect(() => () => void ctxRef.current?.close(), [])

  return { on, toggle }
}
