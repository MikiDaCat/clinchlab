"use client"

import { useCallback } from "react"

/* ════════════════════════════════════════════════════════════
   TMT · useVibration
   Vibration API — patterns retour haptique combat

   Fallback silencieux si non supporté (iOS Safari).
   Le toggle enabled vient du Setup (localStorage).
════════════════════════════════════════════════════════════ */

export type VibrationEvent =
  | "round_start"   /* 80-40-80 */
  | "round_end"     /* 200-80-200-80-200 */
  | "warning"       /* 100-50-100 */
  | "countdown"     /* 60 */
  | "emergency_stop"/* 400 */
  | "tap_feedback"  /* 30 */

const PATTERNS: Record<VibrationEvent, number | number[]> = {
  round_start:    [80, 40, 80],
  round_end:      [200, 80, 200, 80, 200],
  warning:        [100, 50, 100],
  countdown:      60,
  emergency_stop: [400],
  tap_feedback:   30,
}

export interface UseVibrationReturn {
  vibrate:   (event: VibrationEvent) => void
  supported: boolean
}

export function useVibration(enabled = true): UseVibrationReturn {
  const supported = typeof navigator !== "undefined" && "vibrate" in navigator

  const vibrate = useCallback((event: VibrationEvent) => {
    if (!enabled || !supported) return
    try {
      navigator.vibrate(PATTERNS[event])
    } catch {
      /* Silently ignore — iOS/unsupported */
    }
  }, [enabled, supported])

  return { vibrate, supported }
}
