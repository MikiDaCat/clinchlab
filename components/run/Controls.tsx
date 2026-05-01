"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import type { TimerState } from "@/components/RingTimer"

interface ControlsProps {
  isPlaying:   boolean
  timerState:  TimerState
  onToggle:    () => void
  onPrev:      () => void
  onNext:      () => void
  onLongPress: () => void
  canPrev:     boolean
  canNext:     boolean
}

/* ─── Icônes inline ────────────────────────────────────────── */
function IcoPrev() {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 6 9 12 15 18" />
    </svg>
  )
}
function IcoNext() {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 6 15 12 9 18" />
    </svg>
  )
}
function IcoPlay() {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} fill="currentColor">
      <path d="M7 5v14l12-7z" />
    </svg>
  )
}
function IcoPause() {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="currentColor">
      <rect x="6" y="5" width="4" height="14" rx="1.5" />
      <rect x="14" y="5" width="4" height="14" rx="1.5" />
    </svg>
  )
}
function IcoCheck() {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 12 9 17 20 7" />
    </svg>
  )
}

/* ─── Config couleur par état ──────────────────────────────── */
const STATE_BG: Record<TimerState, string> = {
  active:  "var(--flame)",
  rest:    "var(--frost)",
  warning: "var(--amber)",
  pause:   "var(--card-2)",
  done:    "var(--jade)",
}
const STATE_GLOW: Record<TimerState, string> = {
  active:  "var(--glow-flame)",
  rest:    "var(--glow-frost)",
  warning: "var(--glow-amber)",
  pause:   "none",
  done:    "none",
}
const STATE_RING: Record<TimerState, string> = {
  active:  "oklch(0.58 0.26 15)",
  rest:    "oklch(0.65 0.18 225)",
  warning: "oklch(0.88 0.22 95)",
  pause:   "oklch(0.50 0.01 260)",
  done:    "oklch(0.62 0.16 165)",
}

/* ─── Long press SVG ring ──────────────────────────────────── */
const BTN_SIZE = 64
const RING_R   = BTN_SIZE / 2 + 5          /* cercle légèrement plus grand */
const RING_C   = 2 * Math.PI * RING_R
const RING_VB  = BTN_SIZE + 20              /* viewBox: btn + 10px padding chaque côté */

interface LPRingProps { progress: number; color: string }

function LPRing({ progress, color }: LPRingProps) {
  return (
    <svg
      aria-hidden="true"
      width={RING_VB}
      height={RING_VB}
      viewBox={`0 0 ${RING_VB} ${RING_VB}`}
      style={{
        position:         "absolute",
        inset:            -10,
        pointerEvents:    "none",
        transform:        "rotate(-90deg)",
        overflow:         "visible",
      }}
    >
      <circle
        cx={RING_VB / 2}
        cy={RING_VB / 2}
        r={RING_R}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeDasharray={RING_C}
        strokeDashoffset={RING_C * (1 - progress)}
        style={{ transition: "stroke-dashoffset 16ms linear" }}
      />
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════
   COMPOSANT
═══════════════════════════════════════════════════════════ */
export default function Controls({
  isPlaying,
  timerState,
  onToggle,
  onPrev,
  onNext,
  onLongPress,
  canPrev,
  canNext,
}: ControlsProps) {
  const reduced = useReducedMotion()

  /* ── Long press state */
  const [lpProgress, setLpProgress] = useState(0)
  const [lpActive,   setLpActive]   = useState(false)
  const rafRef     = useRef<number | null>(null)
  const lpFiredRef = useRef(false)
  const startRef   = useRef(0)

  const cancelLP = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    setLpProgress(0)
    setLpActive(false)
  }, [])

  const startLP = useCallback(() => {
    lpFiredRef.current = false
    setLpActive(true)
    startRef.current = performance.now()

    const tick = (now: number) => {
      const p = Math.min((now - startRef.current) / 900, 1) /* 0.9s */
      setLpProgress(p)
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        lpFiredRef.current = true
        setLpActive(false)
        setLpProgress(0)
        onLongPress()
      }
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [onLongPress])

  const handlePointerUp = useCallback(() => {
    const fired = lpFiredRef.current
    cancelLP()
    if (!fired) onToggle()
  }, [cancelLP, onToggle])

  /* ── Derived */
  const isDone    = timerState === "done"
  const btnBg     = STATE_BG[timerState]
  const btnGlow   = STATE_GLOW[timerState]
  const ringColor = STATE_RING[timerState]
  const textColor = timerState === "warning" ? "#000" : "white"

  return (
    <div
      role="group"
      aria-label="Contrôles du timer"
      style={{
        display:       "flex",
        alignItems:    "center",
        gap:           10,
        paddingBottom: 12,
      }}
    >
      {/* ── Prev */}
      <motion.button
        className="tmt-iconbtn lg"
        aria-label="Phase précédente"
        aria-disabled={!canPrev}
        whileTap={!reduced && canPrev ? { scale: 0.88 } : {}}
        onClick={canPrev ? onPrev : undefined}
        style={{
          width:      BTN_SIZE,
          height:     BTN_SIZE,
          opacity:    canPrev ? 1 : 0.28,
          cursor:     canPrev ? "pointer" : "default",
          flexShrink: 0,
        }}
      >
        <IcoPrev />
      </motion.button>

      {/* ── Pause / Play — avec long press */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", display: "inline-flex" }}>

          {/* Cercle de progression long-press */}
          <AnimatePresence>
            {lpActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
              >
                <LPRing progress={lpProgress} color={ringColor} />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            aria-label={
              isDone        ? "Terminer la séance" :
              isPlaying     ? "Pause (maintenir pour arrêter)" :
              "Reprendre"
            }
            whileTap={reduced ? {} : { scale: 0.94 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            onPointerDown={startLP}
            onPointerUp={handlePointerUp}
            onPointerLeave={cancelLP}
            onPointerCancel={cancelLP}
            style={{
              display:       "inline-flex",
              alignItems:    "center",
              justifyContent:"center",
              width:         BTN_SIZE,
              height:        BTN_SIZE,
              borderRadius:  "50%",
              background:    btnBg,
              color:         textColor,
              border:        "none",
              cursor:        "pointer",
              boxShadow:     btnGlow,
              transition:    "background 300ms var(--ease-out), box-shadow 300ms var(--ease-out), color 150ms var(--ease-out)",
              touchAction:   "none",
              userSelect:    "none",
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isDone ? (
                <motion.span
                  key="done"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 24 }}
                >
                  <IcoCheck />
                </motion.span>
              ) : isPlaying ? (
                <motion.span
                  key="pause"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 24 }}
                >
                  <IcoPause />
                </motion.span>
              ) : (
                <motion.span
                  key="play"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 24 }}
                >
                  <IcoPlay />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* ── Next */}
      <motion.button
        className="tmt-iconbtn lg"
        aria-label="Phase suivante"
        aria-disabled={!canNext}
        whileTap={!reduced && canNext ? { scale: 0.88 } : {}}
        onClick={canNext ? onNext : undefined}
        style={{
          width:      BTN_SIZE,
          height:     BTN_SIZE,
          opacity:    canNext ? 1 : 0.28,
          cursor:     canNext ? "pointer" : "default",
          flexShrink: 0,
        }}
      >
        <IcoNext />
      </motion.button>
    </div>
  )
}
