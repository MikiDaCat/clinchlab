"use client"

import { useRef, useCallback } from "react"

/* ════════════════════════════════════════════════════════════
   TMT · useTimerSound
   Web Audio API — sons de combat générés par code (no MP3)

   Profil sonore :
   ┌──────────────────┬──────────────────┬────────────────┐
   │ Événement        │ Fréquence / forme│ Durée          │
   ├──────────────────┼──────────────────┼────────────────┤
   │ round_start      │ 880Hz+440Hz sine │ 0.8s + 0.5s   │
   │ round_end        │ 880+440+220Hz    │ 0.7+0.5+1.0s  │
   │ countdown_3/2    │ 600Hz square     │ 80ms           │
   │ countdown_1/go   │ 900Hz square     │ 100ms          │
   │ last_second      │ 660Hz square     │ 60ms           │
   │ warning          │ 550Hz triangle   │ 200ms          │
   └──────────────────┴──────────────────┴────────────────┘
════════════════════════════════════════════════════════════ */

export type SoundEvent =
  | "round_start"
  | "round_end"
  | "countdown_3"
  | "countdown_2"
  | "countdown_1"
  | "countdown_go"
  | "last_second"
  | "warning"

interface BeepOptions {
  freq:    number           /* Hz */
  dur:     number           /* secondes */
  when:    number           /* ctx.currentTime offset */
  gain?:   number           /* 0.0 – 1.0 */
  type?:   OscillatorType
}

export interface UseTimerSoundReturn {
  play:     (event: SoundEvent) => void
  unlock:   () => void      /* à appeler lors du premier geste utilisateur */
}

export function useTimerSound(volume = 0.7, enabled = true): UseTimerSoundReturn {
  const ctxRef = useRef<AudioContext | null>(null)

  /* ── Obtenir / créer l'AudioContext ─────────────────── */
  const getCtx = useCallback((): AudioContext | null => {
    if (typeof window === "undefined" || typeof AudioContext === "undefined") return null
    if (!ctxRef.current) {
      try { ctxRef.current = new AudioContext() }
      catch { return null }
    }
    return ctxRef.current
  }, [])

  /* ── Débloquer le contexte (user gesture required) ──── */
  const unlock = useCallback(() => {
    const ctx = getCtx()
    if (ctx?.state === "suspended") ctx.resume().catch(() => {})
  }, [getCtx])

  /* ── Générer un son élémentaire ─────────────────────── */
  const beep = useCallback(({ freq, dur, when, gain = 0.5, type = "sine" }: BeepOptions) => {
    const ctx = getCtx()
    if (!ctx) return

    /* Resume silencieux si suspendu (iOS, autoplay policy) */
    if (ctx.state === "suspended") ctx.resume().catch(() => {})

    const osc      = ctx.createOscillator()
    const gainNode = ctx.createGain()
    const masterGain = ctx.createGain()

    osc.connect(gainNode)
    gainNode.connect(masterGain)
    masterGain.connect(ctx.destination)

    osc.frequency.setValueAtTime(freq, when)
    osc.type = type

    const vol = Math.max(0, Math.min(1, gain * volume))
    gainNode.gain.setValueAtTime(0, when)
    gainNode.gain.linearRampToValueAtTime(vol, when + Math.min(0.015, dur * 0.1))
    gainNode.gain.exponentialRampToValueAtTime(0.0001, when + dur - 0.01)

    masterGain.gain.setValueAtTime(1, when)

    osc.start(when)
    osc.stop(when + dur + 0.05)
  }, [getCtx, volume])

  /* ── Séquences sonores par événement ────────────────── */
  const play = useCallback((event: SoundEvent) => {
    if (!enabled) return
    const ctx = getCtx()
    if (!ctx) return
    const t = ctx.currentTime

    switch (event) {

      /* ─ Double DING montant → descendant (début round) */
      case "round_start":
        beep({ freq: 880, dur: 0.8, when: t,      type: "sine",  gain: 0.55 })
        beep({ freq: 440, dur: 0.5, when: t + 1.1, type: "sine",  gain: 0.50 })
        break

      /* ─ Triple DING descendant (fin round / gong boxe) */
      case "round_end":
        beep({ freq: 880, dur: 0.70, when: t,      type: "sine",  gain: 0.60 })
        beep({ freq: 440, dur: 0.50, when: t + 0.9, type: "sine",  gain: 0.55 })
        beep({ freq: 220, dur: 1.00, when: t + 1.5, type: "sine",  gain: 0.45 })
        break

      /* ─ Bip countdown 3 et 2 (court, neutre) */
      case "countdown_3":
      case "countdown_2":
        beep({ freq: 600, dur: 0.08, when: t, type: "square",   gain: 0.40 })
        break

      /* ─ Bip countdown 1 et GO (plus aigu, annonce l'action) */
      case "countdown_1":
      case "countdown_go":
        beep({ freq: 900, dur: 0.10, when: t,      type: "square",   gain: 0.50 })
        beep({ freq: 900, dur: 0.06, when: t + 0.16, type: "square", gain: 0.30 })
        break

      /* ─ Tic de la dernière seconde (bip sec, discret) */
      case "last_second":
        beep({ freq: 660, dur: 0.06, when: t, type: "square",   gain: 0.35 })
        break

      /* ─ Alerte warning 10s (bip grave plus insistant) */
      case "warning":
        beep({ freq: 550, dur: 0.20, when: t,      type: "triangle", gain: 0.40 })
        beep({ freq: 550, dur: 0.12, when: t + 0.32, type: "triangle", gain: 0.25 })
        break
    }
  }, [enabled, getCtx, beep])

  return { play, unlock }
}
