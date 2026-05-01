"use client"

import { useRef, useEffect, useCallback, useState } from "react"

/* ════════════════════════════════════════════════════════════
   TMT · useWakeLock (renforcé Phase 5)

   Améliorations vs Phase 3b inline :
   - Re-acquire automatique si visibilitychange (l'utilisateur
     revient dans l'app après avoir switché)
   - isActive state exposé pour l'indicateur visuel
   - Release propre au unmount
   - Fallback silencieux sur navigateurs sans support
════════════════════════════════════════════════════════════ */

type Sentinel = { release(): Promise<void>; addEventListener(t: string, cb: () => void): void }
type WLNav    = Navigator & { wakeLock?: { request(t: "screen"): Promise<Sentinel> } }

export interface UseWakeLockReturn {
  isActive: boolean
  acquire:  () => Promise<void>
  release:  () => void
}

export function useWakeLock(): UseWakeLockReturn {
  const sentinelRef  = useRef<Sentinel | null>(null)
  const [isActive, setIsActive] = useState(false)

  /* ── Acquérir le verrou ──────────────────────────────── */
  const acquire = useCallback(async () => {
    const nav = navigator as WLNav
    if (!nav.wakeLock) return
    try {
      const sentinel = await nav.wakeLock.request("screen")
      sentinelRef.current = sentinel
      setIsActive(true)

      /* Écouter la libération externe (ex: batterie faible) */
      sentinel.addEventListener("release", () => {
        sentinelRef.current = null
        setIsActive(false)
      })
    } catch {
      /* Silently ignore (permission denied, unsupported) */
    }
  }, [])

  /* ── Libérer le verrou ───────────────────────────────── */
  const release = useCallback(() => {
    sentinelRef.current?.release().catch(() => {})
    sentinelRef.current = null
    setIsActive(false)
  }, [])

  /* ── Re-acquire si l'utilisateur revient dans l'app ───── */
  useEffect(() => {
    if (!isActive) return
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && !sentinelRef.current) {
        acquire()
      }
    }
    document.addEventListener("visibilitychange", handleVisibility)
    return () => document.removeEventListener("visibilitychange", handleVisibility)
  }, [isActive, acquire])

  /* ── Nettoyage au démontage ──────────────────────────── */
  useEffect(() => () => { sentinelRef.current?.release().catch(() => {}) }, [])

  return { isActive, acquire, release }
}
