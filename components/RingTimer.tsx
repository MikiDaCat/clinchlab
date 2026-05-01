"use client"

import { motion, useReducedMotion } from "framer-motion"

/* ─── Types exportés (réutilisés dans /run et /timer) ─────── */
export type TimerState = "active" | "rest" | "warning" | "pause" | "done"
export type TimerSize  = "sm" | "md" | "lg" | "xl"

export interface RingTimerProps {
  /** Durée totale du segment en secondes */
  duration:  number
  /** Secondes restantes */
  remaining: number
  /** État sémantique — détermine couleur + glow + animations */
  state:     TimerState
  /** Taille du ring : sm=200 md=280 lg=360 xl=440 */
  size?:     TimerSize
  /** Label sémantique override (pour active/rest) — ex: "TRAVAIL", "JEU" */
  label?:    string
}

/* ─── Dimensions par taille ───────────────────────────────── */
const SIZES = {
  sm: { px: 200, stroke:  7, gap: 11, labelSize: 10 },
  md: { px: 280, stroke: 10, gap: 14, labelSize: 11 },
  lg: { px: 360, stroke: 13, gap: 16, labelSize: 12 },
  xl: { px: 440, stroke: 16, gap: 20, labelSize: 13 },
} as const

/* ─── Config par état ──────────────────────────────────────── */
const STATE_CFG = {
  active: {
    color:    "var(--flame)",
    label:    "ROUND ACTIF",
    dotHz:    1.5,
    glowAnim: "ring-glow-active 1.4s ease-in-out infinite",
    bgTint:   "oklch(0.58 0.26 15 / 0.06)",
  },
  rest: {
    color:    "var(--frost)",
    label:    "REPOS",
    dotHz:    0.7,
    glowAnim: "ring-glow-rest 2.2s ease-in-out infinite",
    bgTint:   "oklch(0.65 0.18 225 / 0.05)",
  },
  warning: {
    color:    "var(--amber)",
    label:    "ATTENTION",
    dotHz:    2.5,
    glowAnim: "ring-glow-warning 0.44s ease-in-out infinite",
    bgTint:   "oklch(0.88 0.22 95 / 0.07)",
  },
  pause: {
    color:    "var(--state-pause)",
    label:    "PAUSE",
    dotHz:    0,
    glowAnim: "none",
    bgTint:   "transparent",
  },
  done: {
    color:    "var(--jade)",
    label:    "TERMINÉ",
    dotHz:    0,
    glowAnim: "none",
    bgTint:   "transparent",
  },
} as const

/* ─── Formattage MM:SS ─────────────────────────────────────── */
function fmt(sec: number): string {
  const s = Math.max(0, Math.floor(sec))
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`
}

/* ═══════════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
═══════════════════════════════════════════════════════════ */
export default function RingTimer({
  duration,
  remaining,
  state = "active",
  size  = "lg",
  label: labelOverride,
}: RingTimerProps) {
  const reduced = useReducedMotion()

  const { px, stroke, gap, labelSize } = SIZES[size]
  const { color, label: stateLabel, dotHz, glowAnim, bgTint } = STATE_CFG[state]
  /* Override label for active/rest states only — warning/pause/done keep their fixed label */
  const label = (state === "active" || state === "rest") && labelOverride ? labelOverride : stateLabel

  const r             = px / 2 - stroke / 2 - gap
  const circumference = 2 * Math.PI * r
  const progress      = duration > 0 ? Math.max(0, Math.min(1, remaining / duration)) : 0
  const dashoffset    = circumference * (1 - progress)
  /* Ratio 0.28 : marge ≥25% entre le texte et le cercle sur tous les formats
     (0.375 était trop grand — "59:59" touchait le bord sur md/lg)       */
  const digitPx       = Math.round(px * 0.28)

  /* Animation dot — conditionné à reduced-motion */
  const dotAnimate =
    !reduced && state !== "pause" && state !== "done"
      ? { opacity: [1, 0.10, 1] as [number, number, number] }
      : { opacity: state === "pause" ? 0.28 : 1 }

  const dotTransition =
    !reduced && state !== "pause" && state !== "done"
      ? { repeat: Infinity, duration: 1 / dotHz, ease: "easeInOut" as const }
      : {}

  return (
    <motion.div
      whileTap={reduced ? {} : { scale: 0.975 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      role="timer"
      aria-label={`${label} — ${fmt(remaining)}`}
      aria-live="off"
      style={{ position: "relative", width: px, height: px, userSelect: "none" }}
    >
      {/* Halo radial ambiant (fond) */}
      <div
        aria-hidden="true"
        style={{
          position:      "absolute",
          inset:         -8,
          borderRadius:  "50%",
          background:    `radial-gradient(circle at center, ${bgTint} 0%, transparent 68%)`,
          pointerEvents: "none",
          transition:    "background 400ms var(--ease-out)",
        }}
      />

      {/* Anneau SVG */}
      <svg
        width={px}
        height={px}
        viewBox={`0 0 ${px} ${px}`}
        style={{ transform: "rotate(-90deg)", display: "block", overflow: "visible" }}
        aria-hidden="true"
      >
        {/* Piste de fond */}
        <circle
          cx={px / 2}
          cy={px / 2}
          r={r}
          fill="none"
          stroke="var(--rule-2)"
          strokeWidth={stroke}
        />

        {/* Arc de progression */}
        <motion.circle
          cx={px / 2}
          cy={px / 2}
          r={r}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: dashoffset }}
          animate={{ strokeDashoffset: dashoffset }}
          transition={
            reduced
              ? { duration: 0 }
              : { type: "tween", duration: 0.45, ease: "easeOut" }
          }
          style={{
            stroke:      color,
            strokeWidth: stroke,
            transition:  "stroke 300ms var(--ease-out)",
            animation:   !reduced ? glowAnim : undefined,
          }}
        />
      </svg>

      {/* Contenu centré */}
      <div
        style={{
          position:       "absolute",
          inset:          0,
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          justifyContent: "center",
          gap:            size === "sm" ? 4 : 8,
          pointerEvents:  "none",
          textAlign:      "center",
        }}
      >
        {/* Digits principaux */}
        <motion.span
          className="tmt-clock"
          animate={
            !reduced && state === "warning"
              ? { opacity: [1, 0.50, 1] }
              : { opacity: 1 }
          }
          transition={
            !reduced && state === "warning"
              ? { repeat: Infinity, duration: 0.44, ease: "easeInOut" as const }
              : {}
          }
          style={{
            fontSize:      digitPx,
            color,
            lineHeight:    1,
            transition:    "color 300ms var(--ease-out)",
            letterSpacing: digitPx > 100 ? "-0.03em" : "-0.02em",
          }}
        >
          {fmt(remaining)}
        </motion.span>

        {/* Ligne d'état : dot animé + label */}
        <div
          style={{
            display:       "flex",
            alignItems:    "center",
            gap:           5,
            fontSize:      labelSize,
            fontWeight:    700,
            fontFamily:    "var(--font-mono)",
            letterSpacing: "0.13em",
            textTransform: "uppercase",
            color,
            transition:    "color 300ms var(--ease-out)",
          }}
        >
          <motion.span
            aria-hidden="true"
            animate={dotAnimate}
            transition={dotTransition}
            style={{
              display:      "block",
              width:        size === "sm" ? 5 : 6,
              height:       size === "sm" ? 5 : 6,
              borderRadius: "50%",
              background:   color,
              flexShrink:   0,
              transition:   "background 300ms var(--ease-out)",
            }}
          />
          {label}
        </div>
      </div>
    </motion.div>
  )
}
