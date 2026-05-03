"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { useRouter } from "next/navigation"
import { type TimerState } from "@/components/RingTimer"
import GiantTimer from "@/components/run/GiantTimer"
import Controls from "@/components/run/Controls"
import PhaseDrawer from "@/components/run/PhaseDrawer"
import CountdownOverlay from "@/components/run/CountdownOverlay"
import { PHASES, COMBOS, type Level } from "@/lib/data"
import { useTimerSound } from "@/hooks/useTimerSound"
import { addCompletedSession } from "@/hooks/useCompletedSessions"
import { useVibration } from "@/hooks/useVibration"
import { useWakeLock } from "@/hooks/useWakeLock"
import type { CountdownValue } from "@/components/run/CountdownOverlay"
import { useSessionPersistence } from "@/hooks/useSessionPersistence"

const N    = "var(--font-num)"
const U    = "var(--font-ui)"
const D    = "var(--font-display)"
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

const NEEDS_COUNTDOWN = new Set(["combo", "tech", "rounds"])
const INITIAL_PHASE   = 0

/* ─── State colors V2 ────────────────────────────────────── */
const STATE_COLOR: Record<TimerState, string> = {
  active:  "var(--siam)",
  rest:    "var(--frost)",
  warning: "var(--champion)",
  pause:   "var(--state-pause)",
  done:    "var(--jade-pro)",
}

/* ─── StopDialog (inchangé) ──────────────────────────────── */
function StopDialog({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  const reduced = useReducedMotion()
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onCancel])

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onCancel} aria-hidden="true"
        style={{ position: "absolute", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.80)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
      />
      <motion.div
        role="alertdialog" aria-modal="true"
        aria-labelledby="stop-dlg-title" aria-describedby="stop-dlg-desc"
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.88, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 10 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        style={{
          position: "absolute", bottom: "50%", left: 20, right: 20, zIndex: 301,
          transform: "translateY(50%)",
          background: "var(--paper-3)", borderRadius: 20,
          border: "1px solid var(--rule-siam)", padding: "28px 24px 20px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.90), 0 0 60px rgba(220,38,38,0.15)",
          display: "flex", flexDirection: "column", gap: 20,
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--siam-soft)", border: "1px solid var(--siam-line)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="var(--siam)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.3 3.3L2 19h20L13.7 3.3a2 2 0 0 0-3.4 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <circle cx="12" cy="17" r="0.5" fill="var(--siam)" />
            </svg>
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <p id="stop-dlg-title" style={{ fontFamily: D, fontSize: 22, fontWeight: 400, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 8 }}>
            Arrêter la séance ?
          </p>
          <p id="stop-dlg-desc" style={{ fontFamily: U, fontSize: 14, color: "var(--ink-3)", lineHeight: 1.55 }}>
            La progression de cette séance ne sera pas sauvegardée.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <motion.button
            className="tmt-btn ghost" aria-label="Annuler" whileTap={{ scale: 0.96 }}
            onClick={onCancel} style={{ flex: 1, height: "var(--hit-md)" }}
          >Annuler</motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }} onClick={onConfirm}
            style={{ flex: 1, height: "var(--hit-md)", borderRadius: "var(--r-2)", background: "var(--siam)", color: "white", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", boxShadow: "var(--glow-siam-sm)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: U }}
          >Terminer</motion.button>
        </div>
      </motion.div>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════
   PAGE PRINCIPALE
═══════════════════════════════════════════════════════════ */
export default function RunPage() {
  const router  = useRouter()
  const reduced = useReducedMotion()

  /* ── Config séance ──────────────────────────────────────── */
  const [sessionConfig] = useState(() => {
    const defaults = { comboId: 'combo-025', rounds: 5, game1Id: 'jeu1-001', game2Id: 'jeu2-001' }
    if (typeof window === "undefined") return defaults
    try {
      const raw = localStorage.getItem("tmt-preset-saved")
      if (!raw) return defaults
      const c = JSON.parse(raw) as Record<string, unknown>
      return {
        comboId: (c.comboId as string) ?? 'combo-025',
        rounds:  (c.rounds as number) ?? 5,
        game1Id: (c.game1Id as string) ?? 'jeu1-001',
        game2Id: (c.game2Id as string) ?? 'jeu2-001',
      }
    } catch { return defaults }
  })

  /* ── APIs natives ────────────────────────────────────────── */
  const [soundEnabled] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("tmt-sound-enabled") !== "false" : true
  )
  const [vibEnabled] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("tmt-vibration-enabled") === "true" : false
  )

  const { play: playSound } = useTimerSound(0.7, soundEnabled)
  const { vibrate }         = useVibration(vibEnabled)
  const wakeLock            = useWakeLock()

  /* ── Session state ───────────────────────────────────────── */
  const [phaseIdx,      setPhaseIdx]      = useState(INITIAL_PHASE)
  const [remaining,     setRemaining]     = useState(0)
  const [isPlaying,     setIsPlaying]     = useState(false)
  const [drawerOpen,    setDrawerOpen]    = useState(false)
  const [showStop,      setShowStop]      = useState(false)
  const [showCountdown, setShowCountdown] = useState(true)

  const session      = useSessionPersistence()
  const warningFiredRef = useRef(false)
  const phaseIdxRef     = useRef(phaseIdx)
  useEffect(() => { phaseIdxRef.current = phaseIdx }, [phaseIdx])

  const phase    = PHASES[phaseIdx]
  const phaseDur = phase?.dur ?? 600
  const isDone   = phaseIdx >= PHASES.length

  const timerState: TimerState = useMemo(() => {
    if (isDone)     return "done"
    if (!phase)     return "done"
    if (!isPlaying) return "pause"
    if (remaining <= 10 && remaining > 0) return "warning"
    return phase.timerState
  }, [isDone, phase, remaining, isPlaying])

  const stateColor = STATE_COLOR[timerState]

  /* ── Countdown tick ──────────────────────────────────────── */
  useEffect(() => {
    if (!isPlaying || isDone) return
    const id = setInterval(() => {
      setRemaining(r => {
        if (r === 10 && !warningFiredRef.current) {
          warningFiredRef.current = true
          playSound("warning"); vibrate("warning")
        }
        if (r <= 5 && r > 0) playSound("last_second")
        if (r <= 1) {
          playSound("round_end"); vibrate("round_end")
          warningFiredRef.current = false
          const nextIdx = phaseIdx + 1
          setPhaseIdx(nextIdx)
          setRemaining(PHASES[nextIdx]?.dur ?? 0)
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [isPlaying, isDone, phaseIdx, playSound, vibrate])

  /* ── Resume auto-silencieux (sans bande, paused) ────────── */
  useEffect(() => {
    const snap = session.load()
    if (snap) {
      setPhaseIdx(snap.phaseIndex)
      setRemaining(snap.remaining)
      setShowCountdown(false)
      setIsPlaying(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Sauvegarde toutes les 5s ───────────────────────────── */
  useEffect(() => {
    if (!isPlaying || isDone) return
    const id = setInterval(() => {
      session.save({ phaseIndex: phaseIdx, remaining, phaseName: phase?.name ?? "", sessionConfig: { comboId: sessionConfig.comboId, level: 1, kids: 0 } })
    }, 5000)
    return () => clearInterval(id)
  }, [isPlaying, isDone, phaseIdx, remaining, phase]) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Fin de séance ───────────────────────────────────────── */
  useEffect(() => {
    if (!isDone) return
    session.clear()
    const now     = new Date()
    const isoDate = now.toISOString().split("T")[0]
    const dateStr = now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
    const durMin  = Math.round(PHASES.reduce((a, p) => a + p.dur, 0) / 60)
    const comboObj = COMBOS.find(c => c.id === sessionConfig.comboId)
    addCompletedSession({
      id: now.getTime(), isoDate,
      date: dateStr.charAt(0).toUpperCase() + dateStr.slice(1),
      when: "aujourd'hui", combo: comboObj?.name ?? "",
      lvl: Math.min(comboObj?.level ?? 1, 5) as Level,
      dur: `${durMin} min`, durMin, kids: 0,
      rounds: sessionConfig.rounds, note: "",
    })
  }, [isDone]) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Wake Lock ───────────────────────────────────────────── */
  useEffect(() => {
    if (isPlaying && !isDone) wakeLock.acquire(); else wakeLock.release()
  }, [isPlaying, isDone]) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Handlers ────────────────────────────────────────────── */
  const handleCountdownCount = useCallback((value: CountdownValue) => {
    if (value === 3)    playSound("countdown_3")
    if (value === 2)    playSound("countdown_2")
    if (value === 1)    playSound("countdown_1")
    if (value === "go") playSound("countdown_go")
  }, [playSound])

  const handleCountdownComplete = useCallback(() => {
    setShowCountdown(false)
    const dur = PHASES[phaseIdxRef.current]?.dur ?? 600
    setRemaining(dur); setIsPlaying(true)
    warningFiredRef.current = false
    playSound("round_start"); vibrate("round_start")
  }, [playSound, vibrate])

  const handleToggle = useCallback(() => { if (isDone) return; setIsPlaying(p => !p) }, [isDone])

  const handlePrev = useCallback(() => {
    if (phaseIdx === 0) return
    const prev = phaseIdx - 1; const prevPhase = PHASES[prev]
    setPhaseIdx(prev); setRemaining(prevPhase?.dur ?? 600)
    if (prevPhase && NEEDS_COUNTDOWN.has(prevPhase.kind)) { setIsPlaying(false); setShowCountdown(true) }
    else setIsPlaying(true)
  }, [phaseIdx])

  const handleNext = useCallback(() => {
    const next = phaseIdx + 1; const nextPhase = PHASES[next]
    setPhaseIdx(next); setRemaining(nextPhase?.dur ?? 0)
    if (next >= PHASES.length) return
    if (nextPhase && NEEDS_COUNTDOWN.has(nextPhase.kind)) { setIsPlaying(false); setShowCountdown(true) }
    else setIsPlaying(true)
  }, [phaseIdx])

  const handleStop = useCallback(() => {
    wakeLock.release(); session.clear()
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {})
    router.push("/")
  }, [router]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleLongPress = useCallback(() => {
    setIsPlaying(false); setShowStop(true); vibrate("emergency_stop")
  }, [vibrate])

  /* ── Combo name for drawer trigger ─────────────────────── */
  const comboName = COMBOS.find(c => c.id === sessionConfig.comboId)?.name ?? ""

  /* ═══════════════════════════════════════════════════════════
     JSX — LAYOUT BROADCAST V2
  ═══════════════════════════════════════════════════════════ */
  return (
    <div className="tmt-screen" style={{ background: "var(--paper)", display: "flex", flexDirection: "column", paddingTop: "0" }}>

      {/* ── Header minimal : × + indicateur phase */}
      <div style={{
        display: "flex",
        alignItems: "center", justifyContent: "space-between",
        padding: "12px 20px",
        paddingTop: "max(env(safe-area-inset-top, 0px), 50px)",
        flexShrink: 0,
      }}>
        <motion.button
          className="tmt-iconbtn"
          aria-label="Arrêter la séance"
          whileTap={{ scale: 0.88 }}
          onClick={() => { setIsPlaying(false); setShowStop(true) }}
          style={{ background: "var(--paper-3)", border: "1px solid var(--rule)" }}
        >
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </motion.button>

        {/* Indicateur phase au centre */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontFamily: N, fontSize: 11, fontWeight: 700, color: stateColor, letterSpacing: "0.12em" }}>
            {isDone ? "TERMINÉ" : `PHASE ${String(Math.min(phaseIdx + 1, PHASES.length)).padStart(2, "0")}/${PHASES.length}`}
          </span>
        </div>

      </div>

      {/* ── Phase name + progress bar */}
      <div style={{ padding: "0 24px 16px", flexShrink: 0 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={phaseIdx}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            <p style={{ fontFamily: D, fontSize: "clamp(26px, 7vw, 38px)", fontWeight: 400, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--ink)", lineHeight: 1, marginBottom: 10 }}>
              {isDone ? "SÉANCE TERMINÉE" : (phase?.name ?? "")}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress bar */}
        <div style={{ height: 3, background: "var(--rule)", borderRadius: 0, overflow: "hidden" }}>
          <motion.div
            style={{ height: "100%", background: stateColor, transformOrigin: "left", transition: "background 400ms ease" }}
            animate={{ scaleX: phaseDur > 0 ? Math.max(0, remaining / phaseDur) : 0 }}
            transition={{ type: "tween", duration: 0.9, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* ── GIANT TIMER — zone principale flex:1 */}
      <div
        style={{
          flex:           1,
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          justifyContent: "center",
          position:       "relative",
          padding:        "0 16px",
        }}
      >
        {/* Tap-anywhere overlay (pause/play) */}
        {!isDone && (
          <div
            onClick={handleToggle}
            aria-label={isPlaying ? "Taper pour mettre en pause" : "Taper pour reprendre"}
            role="button"
            tabIndex={-1}
            style={{ position: "absolute", inset: 0, zIndex: 1, cursor: "pointer", touchAction: "manipulation" }}
          />
        )}

        {/* Timer géant */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <GiantTimer remaining={remaining} state={timerState} label={phase?.timerLabel} />
        </div>

        {/* Round indicator — phases multi-rounds seulement */}
        {phase && phase.rounds > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ fontFamily: N, fontSize: 15, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-3)", marginTop: 12, zIndex: 2, position: "relative" }}
          >
            {phase.rounds} × {(() => { const m = Math.floor(phase.workDur / 60); const s = phase.workDur % 60; return s === 0 ? `${m}:00` : `${m}:${String(s).padStart(2, "0")}` })()}
          </motion.div>
        )}

        {/* Status indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 14, zIndex: 2, position: "relative" }}>
          <motion.span
            animate={!reduced && timerState !== "pause" && timerState !== "done" ? { opacity: [1, 0.2, 1] } : { opacity: timerState === "pause" ? 0.4 : 1 }}
            transition={!reduced && timerState !== "pause" && timerState !== "done" ? { repeat: Infinity, duration: timerState === "warning" ? 0.44 : timerState === "rest" ? 1.8 : 1.2, ease: "easeInOut" } : {}}
            style={{ display: "block", width: 7, height: 7, borderRadius: "50%", background: stateColor, flexShrink: 0 }}
          />
          <span style={{ fontFamily: U, fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: stateColor }}>
            {isDone ? "TERMINÉ" : timerState === "pause" ? "PAUSE" : (phase?.timerLabel ?? "")}
          </span>
        </div>
      </div>

      {/* ── Drawer trigger (phases combo/game/tech) */}
      {!isDone && phase && (phase.kind === "combo" || phase.kind === "tech" || phase.kind === "game") && (
        <motion.button
          onClick={() => setDrawerOpen(true)}
          aria-label={`Voir les détails — ${phase.name}`}
          aria-expanded={drawerOpen}
          whileTap={{ scale: 0.98 }}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            width: "100%", minHeight: 50, padding: "0 24px",
            background: "transparent", border: "none",
            borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)",
            cursor: "pointer", flexShrink: 0,
          }}
        >
          <motion.span
            animate={reduced ? {} : { y: [0, 3, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            style={{ color: "var(--siam)", fontSize: 14, lineHeight: 1 }}
          >
            ▼
          </motion.span>
          <span style={{ fontFamily: U, fontSize: 13, fontWeight: 500, color: "var(--ink-3)", flex: 1, textAlign: "left", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
            {phase.kind === "game" ? "Déroulement du jeu" : comboName || "Détails de la phase"}
          </span>
        </motion.button>
      )}

      {/* ── Controls */}
      <div style={{ padding: "12px 20px", paddingBottom: "max(20px, calc(env(safe-area-inset-bottom, 0px) + 16px))", flexShrink: 0 }}>
        <Controls
          isPlaying={isPlaying}
          timerState={timerState}
          onToggle={isDone ? handleStop : handleToggle}
          onPrev={handlePrev}
          onNext={handleNext}
          onLongPress={handleLongPress}
          canPrev={phaseIdx > 0}
          canNext={phaseIdx < PHASES.length}
        />
      </div>

      {/* ── Countdown 3-2-1 ALLEZ */}
      <AnimatePresence>
        {showCountdown && (
          <CountdownOverlay
            active={showCountdown}
            onComplete={handleCountdownComplete}
            onCount={handleCountdownCount}
            duration={3}
          />
        )}
      </AnimatePresence>

      {/* ── Phase Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <PhaseDrawer
            phase={phase}
            phaseIdx={phaseIdx >= PHASES.length ? PHASES.length - 1 : phaseIdx}
            total={PHASES.length}
            duration={phaseDur}
            remaining={remaining}
            timerState={timerState}
            onClose={() => setDrawerOpen(false)}
            comboId={sessionConfig.comboId}
            gameId={sessionConfig.game1Id}
          />
        )}
      </AnimatePresence>

      {/* ── Stop dialog */}
      <AnimatePresence>
        {showStop && (
          <StopDialog
            onCancel={() => { setShowStop(false); setIsPlaying(true) }}
            onConfirm={handleStop}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
