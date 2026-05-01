"use client"

import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import type { TimerState } from "@/components/RingTimer"

interface TopBarProps {
  phaseIdx:     number
  total:        number
  phaseName:    string
  timerState:   TimerState
  isFullscreen: boolean
  onFullscreen: () => void
  onStop:       () => void
}

const STATE_COLOR: Record<TimerState, string> = {
  active:  "var(--flame)",
  rest:    "var(--frost)",
  warning: "var(--amber)",
  pause:   "var(--state-pause)",
  done:    "var(--jade)",
}

const STATE_GLOW: Record<TimerState, string> = {
  active:  "var(--glow-flame-sm)",
  rest:    "var(--glow-frost-sm)",
  warning: "var(--glow-amber-sm)",
  pause:   "none",
  done:    "none",
}

const M = "var(--font-mono), monospace"
const D = "var(--font-display), system-ui, sans-serif"

/* ── Fullscreen icon */
function IcoExpand() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  )
}

function IcoShrink() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7" />
    </svg>
  )
}

function IcoX() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export default function TopBar({
  phaseIdx,
  total,
  phaseName,
  timerState,
  isFullscreen,
  onFullscreen,
  onStop,
}: TopBarProps) {
  const color    = STATE_COLOR[timerState]
  const progress = (phaseIdx + 1) / total
  const reduced  = useReducedMotion()

  return (
    <div style={{ flexShrink: 0 }}>
      {/* Row: phase label + actions */}
      <div style={{
        display:        "flex",
        alignItems:     "center",
        gap:            10,
        padding:        "6px 16px 8px",
        minHeight:      52,
      }}>
        {/* Phase counter + name — animé à chaque changement de phase */}
        <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={phaseIdx}
          initial={reduced ? false : { opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, x: 10 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          style={{ flex: 1, minWidth: 0 }}
          aria-live="polite"
          aria-atomic="true"
        >
          <div style={{
            fontFamily:    M,
            fontSize:      10,
            fontWeight:    700,
            color:         "var(--ink-3)",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            marginBottom:  2,
          }}>
            Phase
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{
              fontFamily:    D,
              fontSize:      22,
              fontWeight:    700,
              color,
              letterSpacing: "-0.02em",
              lineHeight:    1,
              transition:    "color 300ms var(--ease-out)",
            }}>
              {String(phaseIdx + 1).padStart(2, "0")}
            </span>
            <span style={{
              fontFamily:    M,
              fontSize:      13,
              fontWeight:    600,
              color:         "var(--ink-4)",
              letterSpacing: "0.02em",
            }}>
              / {String(total).padStart(2, "0")}
            </span>
            <span style={{
              fontSize:      13,
              fontWeight:    500,
              color:         "var(--ink-2)",
              letterSpacing: "-0.01em",
              overflow:      "hidden",
              whiteSpace:    "nowrap",
              textOverflow:  "ellipsis",
              maxWidth:      160,
            }}>
              {phaseName}
            </span>
          </div>
        </motion.div>
        </AnimatePresence>

        {/* Fullscreen */}
        <motion.button
          className="tmt-iconbtn"
          aria-label={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
          whileTap={{ scale: 0.88 }}
          onClick={onFullscreen}
          style={{ minWidth: "var(--hit-md)", minHeight: "var(--hit-md)" }}
        >
          {isFullscreen ? <IcoShrink /> : <IcoExpand />}
        </motion.button>

        {/* Stop */}
        <motion.button
          className="tmt-iconbtn"
          aria-label="Arrêter la séance"
          whileTap={{ scale: 0.88 }}
          onClick={onStop}
          style={{
            minWidth:    "var(--hit-md)",
            minHeight:   "var(--hit-md)",
            background:  "transparent",
            border:      "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <IcoX />
        </motion.button>
      </div>

      {/* Progress bar — 3px, couleur sémantique */}
      <div style={{
        height:     3,
        background: "var(--rule)",
        position:   "relative",
        overflow:   "hidden",
      }}>
        <motion.div
          style={{
            position:   "absolute",
            inset:      0,
            transformOrigin: "left center",
            background: color,
            boxShadow:  STATE_GLOW[timerState],
            transition: "background 300ms var(--ease-out), box-shadow 300ms var(--ease-out)",
          }}
          animate={{ scaleX: progress }}
          transition={{ type: "spring", stiffness: 80, damping: 18 }}
        />
      </div>
    </div>
  )
}
