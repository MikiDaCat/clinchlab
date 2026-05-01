"use client"

import { useState, useCallback } from "react"
import type { Session } from "@/lib/data"

const KEY = "tmt-completed-sessions"

function load(): Session[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const data = JSON.parse(raw)
    return Array.isArray(data) ? (data as Session[]) : []
  } catch {
    return []
  }
}

/* Hook React (state réactif) */
export function useCompletedSessions() {
  const [sessions, setSessions] = useState<Session[]>(() => load())

  const addSession = useCallback((session: Session) => {
    setSessions(prev => {
      const next = [session, ...prev]
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const clearAll = useCallback(() => {
    localStorage.removeItem(KEY)
    setSessions([])
  }, [])

  return { sessions, addSession, clearAll }
}

/* Fonction standalone (appelable hors composant) */
export function addCompletedSession(session: Session): void {
  const current = load()
  localStorage.setItem(KEY, JSON.stringify([session, ...current]))
}
