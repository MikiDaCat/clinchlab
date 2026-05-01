"use client"

import { useCallback } from "react"

/* ════════════════════════════════════════════════════════════
   TMT · useSessionPersistence

   Sauvegarde toutes les X secondes pendant le timer.
   Permet la reprise si l'app crash ou est fermée.

   Structure : {
     phaseIndex:    number
     remaining:     number   (secondes)
     savedAt:       number   (timestamp ms)
     phaseName:     string
     sessionConfig: { comboId, level, kids }
   }

   Politique : expire après 30 minutes. Après ça, ignoré.
════════════════════════════════════════════════════════════ */

const STORAGE_KEY = "tmt-active-session"
const MAX_AGE_MS  = 30 * 60 * 1000   /* 30 min */

export interface SessionSnapshot {
  phaseIndex:    number
  remaining:     number
  savedAt:       number
  phaseName:     string
  sessionConfig: {
    comboId: string
    level:   number
    kids:    number
  }
}

export interface UseSessionPersistenceReturn {
  save:  (data: Omit<SessionSnapshot, "savedAt">) => void
  load:  () => SessionSnapshot | null
  clear: () => void
}

export function useSessionPersistence(): UseSessionPersistenceReturn {

  const save = useCallback((data: Omit<SessionSnapshot, "savedAt">) => {
    try {
      const snapshot: SessionSnapshot = { ...data, savedAt: Date.now() }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
    } catch {
      /* Quota exceeded ou privé — silencieux */
    }
  }, [])

  const load = useCallback((): SessionSnapshot | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      const data = JSON.parse(raw) as SessionSnapshot
      if (Date.now() - data.savedAt > MAX_AGE_MS) {
        localStorage.removeItem(STORAGE_KEY)
        return null
      }
      return data
    } catch {
      return null
    }
  }, [])

  const clear = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }, [])

  return { save, load, clear }
}
