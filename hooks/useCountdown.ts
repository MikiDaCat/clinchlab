"use client"

import { useState, useRef, useCallback, useEffect } from "react"

export type CountdownValue = number | "go" | null

interface UseCountdownOptions {
  /** Chiffre de départ (1–5, défaut 3) */
  from?:       number
  /** Durée affichée pour chaque chiffre en ms (défaut 800) */
  stepMs?:     number
  /** Durée de "ALLEZ !" en ms (défaut 420) */
  goMs?:       number
  /** Appelé quand le décompte se termine (après "ALLEZ !") */
  onComplete?: () => void
}

interface UseCountdownReturn {
  /** Valeur courante affichée : null = inactif */
  current:  CountdownValue
  /** Décompte en cours */
  running:  boolean
  /** Lancer le décompte */
  start:    () => void
  /** Sauter immédiatement (appelle onComplete) */
  skip:     () => void
  /** Réinitialiser sans appeler onComplete */
  reset:    () => void
}

export function useCountdown({
  from      = 3,
  stepMs    = 800,
  goMs      = 420,
  onComplete,
}: UseCountdownOptions = {}): UseCountdownReturn {
  const [current, setCurrent] = useState<CountdownValue>(null)
  const [running, setRunning] = useState(false)

  const timersRef    = useRef<ReturnType<typeof setTimeout>[]>([])
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  /* Nettoyer tous les timers en cours */
  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }, [])

  const start = useCallback(() => {
    clearTimers()
    const n = Math.min(Math.max(Math.floor(from), 1), 5)

    setRunning(true)
    setCurrent(n)

    /* Chaque chiffre décrémenté à intervalles réguliers */
    for (let i = 1; i < n; i++) {
      timersRef.current.push(
        setTimeout(() => setCurrent(n - i), i * stepMs)
      )
    }

    /* "ALLEZ !" */
    timersRef.current.push(
      setTimeout(() => setCurrent("go"), n * stepMs)
    )

    /* Fin du décompte */
    timersRef.current.push(
      setTimeout(() => {
        setCurrent(null)
        setRunning(false)
        onCompleteRef.current?.()
      }, n * stepMs + goMs)
    )
  }, [from, stepMs, goMs, clearTimers])

  const skip = useCallback(() => {
    clearTimers()
    setCurrent(null)
    setRunning(false)
    onCompleteRef.current?.()
  }, [clearTimers])

  const reset = useCallback(() => {
    clearTimers()
    setCurrent(null)
    setRunning(false)
  }, [clearTimers])

  /* Nettoyage au démontage */
  useEffect(() => () => clearTimers(), [clearTimers])

  return { current, running, start, skip, reset }
}
