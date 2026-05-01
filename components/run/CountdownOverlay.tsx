"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { useCountdown } from "@/hooks/useCountdown"

export type CountdownValue = number | "go" | null

export interface CountdownOverlayProps {
  /** Déclenche ou arrête l'overlay */
  active:     boolean
  /** Appelé quand "ALLEZ !" se termine */
  onComplete: () => void
  /** Chiffre de départ, 3 par défaut (max 5) */
  duration?:  number
  /** Appelé à chaque changement de valeur (pour les sons) */
  onCount?:   (value: CountdownValue) => void
}

/* ─── Couleurs par valeur ──────────────────────────────────── */
type CV = number | "go"

const TEXT_COLOR: Partial<Record<string, string>> & { go: string } = {
  go:  "var(--flame)",
  "1": "var(--amber)",
}
const BG_TINT: Partial<Record<string, string>> & { go: string } = {
  go:  "oklch(0.58 0.26 15 / 0.16)",
  "1": "oklch(0.88 0.22 95 / 0.08)",
}
const GLOW: Partial<Record<string, string>> & { go: string } = {
  go:  "0 0 60px oklch(0.58 0.26 15 / 0.80), 0 0 120px oklch(0.58 0.26 15 / 0.35)",
  "1": "0 0 48px oklch(0.88 0.22 95 / 0.65), 0 0 96px oklch(0.88 0.22 95 / 0.25)",
}

function colorOf(v: CV): string {
  return TEXT_COLOR[String(v)] ?? "oklch(0.90 0.005 260)"
}
function bgOf(v: CV): string {
  return BG_TINT[String(v)] ?? "transparent"
}
function glowOf(v: CV): string {
  return GLOW[String(v)] ?? "none"
}

/* ═══════════════════════════════════════════════════════════
   COMPOSANT
═══════════════════════════════════════════════════════════ */
export default function CountdownOverlay({
  active,
  onComplete,
  duration = 3,
  onCount,
}: CountdownOverlayProps) {
  const reduced    = useReducedMotion()
  const onCountRef = useRef(onCount)
  onCountRef.current = onCount

  const { current, running, start, skip } = useCountdown({
    from: duration,
    onComplete,
    stepMs: 800,
    goMs:   440,
  })

  /* Lance le décompte dès que l'overlay devient actif */
  useEffect(() => {
    if (active && !running) start()
  }, [active]) // eslint-disable-line react-hooks/exhaustive-deps

  /* Notifie le parent à chaque changement (pour les sons) */
  useEffect(() => {
    onCountRef.current?.(current)
  }, [current])

  /* Ne rien rendre si inactif ET décompte terminé */
  if (!active && current === null) return null

  const cv = current as CV | null
  const isGo  = cv === "go"
  const color = cv !== null ? colorOf(cv) : "transparent"
  const tint  = cv !== null ? bgOf(cv)   : "transparent"
  const glow  = cv !== null ? glowOf(cv) : "none"

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={skip}
      onKeyDown={e => (e.key === "Enter" || e.key === " ") && skip()}
      role="button"
      tabIndex={0}
      aria-label="Décompte avant le début — taper pour passer"
      aria-live="assertive"
      style={{
        position:        "absolute",
        inset:           0,
        zIndex:          500,
        background:      "var(--paper)",
        display:         "flex",
        flexDirection:   "column",
        alignItems:      "center",
        justifyContent:  "center",
        overflow:        "hidden",
        cursor:          "pointer",
        userSelect:      "none",
        WebkitUserSelect:"none",
      }}
    >
      {/* ── Radial ambiant tint */}
      <motion.div
        aria-hidden="true"
        animate={{
          background: `radial-gradient(ellipse 75% 60% at center, ${tint}, transparent)`,
        }}
        transition={{ duration: 0.25 }}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      />

      {/* ── Flash flamme au passage sur "ALLEZ !" */}
      <AnimatePresence>
        {isGo && (
          <motion.div
            aria-hidden="true"
            key="flash"
            initial={{ opacity: 0.22 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.38, ease: "easeOut" }}
            style={{
              position:      "absolute",
              inset:         0,
              background:    "var(--flame)",
              pointerEvents: "none",
              zIndex:        0,
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Chiffre / "ALLEZ !" */}
      <AnimatePresence mode="popLayout">
        {cv !== null && (
          <motion.div
            key={String(cv)}
            aria-hidden="true"
            initial={
              reduced
                ? { opacity: 0 }
                : { opacity: 0, scale: 1.65, y: 16 }
            }
            animate={
              reduced
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            exit={
              reduced
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.52, y: -12 }
            }
            transition={
              reduced
                ? { duration: 0.15 }
                : {
                    type:      "spring",
                    stiffness: 320,
                    damping:   26,
                    mass:      0.9,
                  }
            }
            style={{
              fontWeight:    400,
              lineHeight:    1,
              letterSpacing: isGo ? "0.06em" : "-0.05em",
              textTransform: "uppercase",
              fontFamily:    "var(--font-display)",
              fontSize:      isGo
                ? "clamp(64px, 18vw, 96px)"
                : "clamp(200px, 55vw, 320px)",
              color,
              textShadow:    reduced ? "none" : glow,
              position:      "relative",
              zIndex:        1,
              transition:    "color 150ms var(--ease-out), text-shadow 150ms var(--ease-out)",
            }}
          >
            {isGo ? "ALLEZ !" : String(cv)}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Indicateur de progression (dots) */}
      {!isGo && typeof cv === "number" && (
        <div
          aria-hidden="true"
          style={{
            display:  "flex",
            gap:      10,
            marginTop: 40,
            position: "relative",
            zIndex:   1,
          }}
        >
          {Array.from({ length: duration }, (_, i) => {
            const dotIdx = duration - 1 - i  /* 0 = dernier (actif) */
            const isActive = dotIdx === cv - 1
            const isPast   = dotIdx < cv - 1
            return (
              <motion.div
                key={i}
                animate={{
                  width:      isActive ? 20 : 6,
                  background: isActive ? color
                            : isPast   ? "var(--rule-3)"
                            :            "var(--rule)",
                }}
                transition={{ duration: 0.25 }}
                style={{
                  height:       6,
                  borderRadius: 3,
                  boxShadow:    isActive && !reduced ? glow : "none",
                }}
              />
            )
          })}
        </div>
      )}

      {/* ── Hint "Taper pour passer" */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        style={{
          position:      "absolute",
          bottom:        44,
          fontSize:      11,
          fontWeight:    600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color:         "var(--ink-4)",
          zIndex:        1,
          pointerEvents: "none",
        }}
      >
        Taper pour passer
      </motion.p>
    </motion.div>
  )
}
