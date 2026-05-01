"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { TimerState } from "@/components/RingTimer"

interface GiantTimerProps {
  remaining: number
  state:     TimerState
  label?:    string
}

function fmt(sec: number): string {
  const s = Math.max(0, Math.floor(sec))
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`
}

const COLORS: Record<TimerState, string> = {
  active:  "var(--siam)",
  rest:    "var(--frost)",
  warning: "var(--champion)",
  pause:   "var(--ink-3)",
  done:    "var(--jade-pro)",
}

const GLOWS: Record<TimerState, string> = {
  active:  "0 0 80px rgba(220,38,38,0.50), 0 0 160px rgba(220,38,38,0.18)",
  rest:    "0 0 60px oklch(0.65 0.18 225 / 0.42)",
  warning: "0 0 80px rgba(251,191,36,0.60)",
  pause:   "none",
  done:    "0 0 60px rgba(16,185,129,0.40)",
}

export default function GiantTimer({ remaining, state, label }: GiantTimerProps) {
  const reduced = useReducedMotion()
  const color   = COLORS[state]
  const glow    = reduced ? "none" : GLOWS[state]
  const digits  = fmt(remaining)

  return (
    <motion.span
      animate={
        !reduced && state === "warning"
          ? { opacity: [1, 0.65, 1] }
          : { opacity: 1 }
      }
      transition={
        !reduced && state === "warning"
          ? { repeat: Infinity, duration: 0.48, ease: "easeInOut" }
          : {}
      }
      aria-label={`Temps restant : ${digits}`}
      aria-live="off"
      role="timer"
      style={{
        display:            "block",
        fontFamily:         "var(--font-display)",
        fontSize:           "clamp(130px, 38vw, 250px)",
        fontWeight:         400,
        letterSpacing:      "-0.03em",
        lineHeight:         0.88,
        color,
        textShadow:         state === "active" && !reduced ? glow : glow,
        fontVariantNumeric: "tabular-nums",
        textAlign:          "center",
        animation:          !reduced && state === "active"
          ? "timer-pulse-siam 2.6s ease-in-out infinite"
          : "none",
        transition:         "color 350ms ease, text-shadow 350ms ease",
        userSelect:         "none",
        WebkitUserSelect:   "none",
      } as React.CSSProperties}
    >
      {digits}
    </motion.span>
  )
}
