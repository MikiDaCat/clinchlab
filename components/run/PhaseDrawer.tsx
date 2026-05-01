"use client"

import { useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, useReducedMotion, useDragControls } from "framer-motion"
import RingTimer, { type TimerState } from "@/components/RingTimer"
import LevelChip from "@/components/LevelChip"
import { PHASES, getComboById, getGameById, type Phase } from "@/lib/data"

interface PhaseDrawerProps {
  phase:       Phase | undefined
  phaseIdx:    number
  total:       number
  duration:    number
  remaining:   number
  timerState:  TimerState
  onClose:     () => void
  comboId?:    string
  gameId?:     string
}

const STATE_COLOR: Record<TimerState, string> = {
  active:  "var(--flame)",
  rest:    "var(--frost)",
  warning: "var(--amber)",
  pause:   "var(--state-pause)",
  done:    "var(--jade)",
}

const M = "var(--font-num)"
const D = "var(--font-display), system-ui, sans-serif"
const EASE_OUT = [0.22, 1, 0.36, 1] as [number, number, number, number]

function IcoChevronDown() {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function PhaseDots({ phaseIdx, total, timerState }: { phaseIdx: number; total: number; timerState: TimerState }) {
  const color = STATE_COLOR[timerState]
  return (
    <div role="list" aria-label={`Phase ${phaseIdx + 1} sur ${total}`} style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {Array.from({ length: total }, (_, i) => {
        const isCur  = i === phaseIdx
        const isPast = i < phaseIdx
        return (
          <div
            key={i}
            role="listitem"
            aria-current={isCur ? "step" : undefined}
            style={{
              width:        isCur ? 16 : 6,
              height:       6,
              borderRadius: 3,
              background:   isCur ? color : isPast ? "var(--rule-3)" : "var(--rule)",
              transition:   "width 250ms var(--ease-out), background 250ms var(--ease-out)",
              flexShrink:   0,
            }}
          />
        )
      })}
    </div>
  )
}

export default function PhaseDrawer({
  phase, phaseIdx, total, duration, remaining, timerState, onClose,
  comboId, gameId,
}: PhaseDrawerProps) {
  const reduced      = useReducedMotion()
  const dragControls = useDragControls()
  const accentColor  = STATE_COLOR[timerState]

  /* Lock body scroll while drawer is open */
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = prev }
  }, [])

  /* Close on Escape key */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  /* Resolve content based on phase kind */
  const combo = phase?.kind === "combo" ? (getComboById(comboId ?? "") ?? null) : null
  const game  = phase?.kind === "game"  ? (getGameById(gameId ?? "")   ?? null) : null

  if (typeof window === "undefined") return null

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Détails — ${phase?.name ?? "Phase"}`}
      drag="y"
      dragControls={dragControls}
      dragListener={false}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.3 }}
      onDragEnd={(_, info) => {
        if (info.offset.y > 80 || info.velocity.y > 400) onClose()
      }}
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={
        reduced
          ? { duration: 0 }
          : { type: "tween", duration: 0.3, ease: EASE_OUT }
      }
      style={{
        position:      "fixed",
        top:           0,
        left:          0,
        right:         0,
        bottom:        0,
        zIndex:        400,
        background:    "var(--paper-3)",
        display:       "flex",
        flexDirection: "column",
      }}
    >
      {/* Header — swipe zone + bouton fermer */}
      <div
        onPointerDown={(e) => dragControls.start(e)}
        style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          padding:        "12px 20px 14px",
          paddingTop:     "calc(env(safe-area-inset-top, 0px) + 12px)",
          flexShrink:     0,
          touchAction:    "none",
          cursor:         "grab",
          borderBottom:   "1px solid var(--rule)",
        }}
      >
        <div>
          <div style={{ fontFamily: M, fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
            Phase {String(phaseIdx + 1).padStart(2, "0")} · {phase?.short ?? ""}
          </div>
          <div style={{ fontFamily: D, fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", marginTop: 2, color: "var(--ink)" }}>
            {phase?.name ?? "Phase"}
          </div>
        </div>
        <button
          className="tmt-iconbtn"
          aria-label="Fermer le détail de phase"
          onClick={onClose}
          style={{ minWidth: "var(--hit-md)", minHeight: "var(--hit-md)" }}
        >
          <IcoChevronDown />
        </button>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", overscrollBehavior: "contain", touchAction: "pan-y" }}>
        <div style={{ padding: "20px 20px calc(env(safe-area-inset-bottom, 0px) + 32px)", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Mini ring + progression */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ flexShrink: 0, pointerEvents: "none" }}>
              <RingTimer duration={duration} remaining={remaining} state={timerState} size="sm" label={phase?.timerLabel} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <PhaseDots phaseIdx={phaseIdx} total={total} timerState={timerState} />
              <div>
                <div style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: 4 }}>Progression globale</div>
                <div style={{ height: 4, background: "var(--rule)", borderRadius: 2, overflow: "hidden" }}>
                  <motion.div
                    style={{ height: "100%", background: accentColor, borderRadius: 2, transformOrigin: "left center", transition: "background 300ms var(--ease-out)" }}
                    animate={{ scaleX: (phaseIdx + 1) / total }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  />
                </div>
                <div style={{ marginTop: 4, fontSize: 11, fontFamily: M, color: "var(--ink-3)" }}>
                  {phaseIdx + 1} / {total} phases
                </div>
              </div>
            </div>
          </div>

          <div style={{ height: 1, background: "var(--rule)" }} />

          {/* ── Combo enrichi (décomposition + points clés) */}
          {combo ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <LevelChip level={combo.level} />
                <span style={{ fontFamily: M, fontSize: 10, fontWeight: 700, color: "var(--ink-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  {combo.steps.length} étapes · {combo.keyPoints.length} points clés
                </span>
              </div>

              {/* Décomposition */}
              <div>
                <div style={{ fontFamily: M, fontSize: 10, fontWeight: 700, color: "var(--ink-3)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
                  Décomposition
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {combo.steps.map((step, i) => (
                    <motion.div
                      key={step.number}
                      initial={reduced ? false : { opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05, duration: 0.22 }}
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <span style={{
                        flexShrink: 0, width: 26, height: 26, borderRadius: "50%",
                        background: "var(--flame-soft)", border: "1px solid var(--flame-line)",
                        color: "var(--flame)", fontFamily: M, fontSize: 10, fontWeight: 700,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {String(step.number).padStart(2, "0")}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)", lineHeight: 1.4 }}>
                        {step.title}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Points clés */}
              <div>
                <div style={{ fontFamily: M, fontSize: 10, fontWeight: 700, color: "var(--ink-3)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
                  Points clés
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {combo.keyPoints.map((pt, i) => (
                    <motion.div
                      key={i}
                      initial={reduced ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.15 + i * 0.04, duration: 0.2 }}
                      style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
                    >
                      <span style={{ flexShrink: 0, marginTop: 2, color: "var(--flame)", fontWeight: 700, fontSize: 14, lineHeight: 1.4 }}>✓</span>
                      <span style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.65 }}>{pt}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          ) : game ? (
            /* ── Jeu enrichi (déroulement + objectif) */
            <>
              <div>
                <div style={{ fontFamily: M, fontSize: 10, fontWeight: 700, color: "var(--ink-3)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
                  Déroulement
                </div>
                <p style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.75, margin: 0 }}>
                  {game.description}
                </p>
              </div>
              <div>
                <div style={{ fontFamily: M, fontSize: 10, fontWeight: 700, color: "var(--ink-3)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
                  Objectif
                </div>
                <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.6, margin: 0 }}>
                  {game.objective}
                </p>
              </div>
            </>
          ) : (
            /* ── Instruction générique (simple / tech) */
            <div>
              <div style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.10em", fontWeight: 600, marginBottom: 10 }}>
                Instructions
              </div>
              <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.65, margin: 0 }}>
                {phase?.kind === "tech"
                  ? "Petits assauts en contrôle total. Priorité à la technique et à la sécurité."
                  : "Maintenir un rythme calme, respiration contrôlée."}
              </p>
            </div>
          )}

          {/* Toutes les phases */}
          <div>
            <div style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.10em", fontWeight: 600, marginBottom: 10 }}>
              Toutes les phases
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {PHASES.map((p, i) => {
                const isActive = i === phaseIdx
                const isPast   = i < phaseIdx
                return (
                  <div key={p.key} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
                    borderRadius: "var(--r-2)",
                    background: isActive ? "var(--card-2)" : "transparent",
                    border: isActive ? `1px solid ${accentColor}33` : "1px solid transparent",
                    opacity: isPast ? 0.45 : 1,
                    transition: "opacity 200ms var(--ease-out)",
                  }}>
                    <span style={{
                      width: 20, height: 20, borderRadius: 6,
                      background: isActive ? accentColor : "var(--card-3)",
                      color: isActive ? (timerState === "warning" ? "#000" : "white") : "var(--ink-3)",
                      fontFamily: M, fontSize: 9, fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, transition: "background 300ms var(--ease-out), color 300ms var(--ease-out)",
                    }}>
                      {isPast ? "✓" : String(i + 1)}
                    </span>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? "var(--ink)" : "var(--ink-2)" }}>
                      {p.name}
                    </span>
                    <span style={{ fontFamily: M, fontSize: 11, color: "var(--ink-3)" }}>{p.short}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>,
    document.body
  )
}
