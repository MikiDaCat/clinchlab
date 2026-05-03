"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import type { TimerState } from "@/components/RingTimer"

interface GiantTimerProps {
  remaining: number
  state:     TimerState
  label?:    string
  size?:     "default" | "compact"
}

const FONT_SIZE = {
  default: "clamp(130px, 38vw, 250px)",
  compact: "clamp(80px, 24vw, 140px)",
} as const

function fmt(sec: number): string {
  const s = Math.max(0, Math.floor(sec))
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`
}

const COLORS: Record<TimerState, string> = {
  active:  "var(--siam)",
  rest:    "var(--frost)",
  warning: "var(--champion)",
  pause:   "var(--ink-2)",
  done:    "var(--jade-pro)",
}

const GLOWS: Record<TimerState, string> = {
  active:  "var(--glow-timer-active)",
  rest:    "0 0 60px oklch(0.65 0.18 225 / 0.42)",
  warning: "0 0 80px rgba(251,191,36,0.60)",
  pause:   "none",
  done:    "0 0 60px rgba(16,185,129,0.40)",
}

export default function GiantTimer({ remaining, state, label, size = "default" }: GiantTimerProps) {
  const reduced      = useReducedMotion()
  const color        = COLORS[state]
  const glow         = reduced ? "none" : GLOWS[state]
  const digits       = fmt(remaining)
  const [mm, ss]     = digits.split(":")
  const prevStateRef = useRef<TimerState>(state)
  const [flash, setFlash] = useState(false)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const prev = prevStateRef.current
    prevStateRef.current = state
    if (reduced) return
    if (prev === "active" && state === "warning") {
      setFlash(true)
      setTimeout(() => setFlash(false), 300)
    }
    if ((prev === "active" || prev === "warning") && state === "rest") {
      setPulse(true)
      setTimeout(() => setPulse(false), 250)
    }
  }, [state, reduced])

  return (
    <>
      {/* Touche 2 — Flash overlay rouge plein écran sur entrée warning */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: flash ? 0.85 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position:      "fixed",
          inset:         0,
          zIndex:        9999,
          background:    "var(--siam)",
          mixBlendMode:  "screen",
          pointerEvents: "none",
          willChange:    "opacity",
        } as React.CSSProperties}
      />

      {/* Touche 1 (glow active) + Touche 3 (pulse scale sur entrée rest) */}
      <motion.span
        animate={
          !reduced && state === "warning"
            ? { opacity: [1, 0.65, 1], scale: 1 }
            : !reduced && pulse
              ? { opacity: 1, scale: [1, 1.05, 1] }
              : { opacity: 1, scale: 1 }
        }
        transition={
          !reduced && state === "warning"
            ? { repeat: Infinity, duration: 0.48, ease: "easeInOut" }
            : !reduced && pulse
              ? { duration: 0.25, ease: [0.22, 1, 0.36, 1] }
              : {}
        }
        aria-label={`Temps restant : ${digits}`}
        aria-live="off"
        role="timer"
        style={{
          display:            "block",
          fontFamily:         "var(--font-display)",
          fontSize:           FONT_SIZE[size],
          fontWeight:         400,
          letterSpacing:      "-0.03em",
          lineHeight:         0.88,
          color,
          textShadow:         glow,
          fontVariantNumeric: "tabular-nums",
          textAlign:          "center",
          animation:          !reduced && state === "active"
            ? "timer-pulse-siam 2.6s ease-in-out infinite"
            : "none",
          transition:         "color 350ms ease, text-shadow 350ms ease",
          userSelect:         "none",
          WebkitUserSelect:   "none",
          willChange:         state === "active" ? "text-shadow" : "auto",
        } as React.CSSProperties}
      >
        {mm}<span style={{ padding: "0 0.04em", letterSpacing: 0 }}>:</span>{ss}
      </motion.span>
    </>
  )
}
