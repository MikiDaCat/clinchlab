"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import Link from "next/link"
import Nav from "@/components/Nav"
import RingTimer, { type TimerState } from "@/components/RingTimer"
import CountdownOverlay from "@/components/run/CountdownOverlay"
import type { CountdownValue } from "@/components/run/CountdownOverlay"
import { useTimerSound } from "@/hooks/useTimerSound"
import { useVibration } from "@/hooks/useVibration"
import { useWakeLock } from "@/hooks/useWakeLock"

type TimerMode    = "simple" | "intervals"
type SessionPhase = "idle" | "countdown" | "work" | "rest" | "done"

const D    = "var(--font-display), system-ui, sans-serif"
const M    = "var(--font-num)"
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

const WORK_STEPS   = [15, 20, 30, 45, 60, 90, 120, 180, 240]
const REST_STEPS   = [0, 10, 15, 20, 30, 45, 60, 90]
const SIMPLE_STEPS = [20, 30, 45, 60, 90, 120, 180, 300, 600]
const QUICK_SIMPLE = [60, 120, 180, 300]

const STATE_COLOR: Record<TimerState, string> = {
  active: "var(--flame)", rest: "var(--frost)", warning: "var(--amber)",
  pause: "var(--state-pause)", done: "var(--jade)",
}

function fmt(sec: number): string {
  const s = Math.max(0, Math.floor(sec))
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`
}

interface StepperProps {
  value: number; values: number[]
  format: (v: number) => string
  onDec: () => void; onInc: () => void; label: string
}
function Stepper({ value, values, format, onDec, onInc, label }: StepperProps) {
  const reduced = useReducedMotion()
  const atMin = value <= values[0]
  const atMax = value >= values[values.length - 1]
  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--rule-2)", borderRadius: "var(--r-2)", padding: "12px 8px 10px", textAlign: "center" }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--ink-3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
        {label}
      </div>
      <motion.div
        key={value}
        initial={reduced ? false : { scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 420, damping: 26 }}
        style={{ fontFamily: M, fontSize: 24, fontWeight: 700, letterSpacing: "0.01em", lineHeight: 1, color: "var(--ink)", marginBottom: 10, fontVariantNumeric: "tabular-nums" }}
      >
        {format(value)}
      </motion.div>
      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
        {(["minus", "plus"] as const).map((op, i) => {
          const disabled = i === 0 ? atMin : atMax
          return (
            <motion.button
              key={op}
              whileTap={disabled ? {} : { scale: 0.88 }}
              onClick={i === 0 ? onDec : onInc}
              aria-label={i === 0 ? `Diminuer ${label}` : `Augmenter ${label}`}
              style={{ minWidth: 40, minHeight: 40, borderRadius: "var(--r-1)", background: "var(--card-2)", border: "1px solid var(--rule)", color: disabled ? "var(--ink-4)" : "var(--ink)", fontSize: 18, fontWeight: 600, cursor: disabled ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: disabled ? 0.38 : 1 }}
            >
              {i === 0 ? "−" : "+"}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

function IcoReset() {
  return <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>
}
function IcoSkip() {
  return <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18"/><line x1="17" y1="6" x2="17" y2="18"/></svg>
}
function IcoPause() {
  return <svg viewBox="0 0 24 24" width={22} height={22} fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1.5"/><rect x="14" y="5" width="4" height="14" rx="1.5"/></svg>
}
function IcoPlay() {
  return <svg viewBox="0 0 24 24" width={24} height={24} fill="currentColor"><path d="M7 5v14l12-7z"/></svg>
}
function IcoExpand() {
  return <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
}
function IcoSave() {
  return <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="5 12 10 17 19 7"/></svg>
}
function IcoClose() {
  return <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
}
function IcoBackChevron() {
  return <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
}

export default function TimerPage() {
  const reduced = useReducedMotion()

  /* ── APIs natives — lazy pour éviter SSR crash */
  const [soundEnabled] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("tmt-sound-enabled") !== "false"
      : true
  )
  const [vibEnabled] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("tmt-vibration-enabled") === "true"
      : false
  )

  const { play: playSound, unlock: unlockAudio } = useTimerSound(0.7, soundEnabled)
  const { vibrate }                              = useVibration(vibEnabled)
  const wakeLock                                 = useWakeLock()

  const [mode,          setMode]          = useState<TimerMode>("intervals")
  const [workIdx,       setWorkIdx]       = useState(WORK_STEPS.indexOf(60))
  const [restIdx,       setRestIdx]       = useState(REST_STEPS.indexOf(30))
  const [rounds,        setRounds]        = useState(5)
  const [simpleIdx,     setSimpleIdx]     = useState(SIMPLE_STEPS.indexOf(180))
  const [savedFeedback, setSavedFeedback] = useState(false)
  const [phase,         setPhase]         = useState<SessionPhase>("idle")
  const [currentRound,  setCurrentRound]  = useState(1)
  const [remaining,     setRemaining]     = useState(0)
  const [isPaused,      setIsPaused]      = useState(false)
  const [showCountdown, setShowCountdown] = useState(false)
  const [isFullscreen,  setIsFullscreen]  = useState(false)

  const workDuration   = WORK_STEPS[workIdx]
  const restDuration   = REST_STEPS[restIdx]
  const simpleDuration = SIMPLE_STEPS[simpleIdx]
  const totalRounds    = rounds

  const stateRef   = useRef({ phase, currentRound, mode, totalRounds, workDuration, restDuration, simpleDuration })
  const warnedRef  = useRef(false)
  useEffect(() => {
    stateRef.current = { phase, currentRound, mode, totalRounds, workDuration, restDuration, simpleDuration }
  })

  const timerState: TimerState = useMemo(() => {
    if (phase === "idle" || phase === "countdown") return "active"
    if (phase === "done") return "done"
    if (isPaused) return "pause"
    if (remaining <= 10 && remaining > 0) return "warning"
    if (phase === "rest") return "rest"
    return "active"
  }, [phase, isPaused, remaining])

  const ringDuration  = phase === "rest" ? restDuration : (mode === "simple" ? simpleDuration : workDuration)
  const ringRemaining = (phase === "idle" || phase === "countdown") ? ringDuration : remaining

  const totalTime   = mode === "simple" ? simpleDuration
    : totalRounds * workDuration + totalRounds * restDuration
  const elapsedTime = mode === "simple" ? simpleDuration - remaining
    : (currentRound - 1) * (workDuration + restDuration) +
      (phase === "rest" ? workDuration + (restDuration - remaining) : workDuration - remaining)
  const progress = totalTime > 0 && phase !== "idle" && phase !== "countdown"
    ? Math.max(0, Math.min(1, elapsedTime / totalTime)) : 0

  useEffect(() => {
    if ((phase !== "work" && phase !== "rest") || isPaused) return
    const id = setInterval(() => {
      setRemaining(r => {
        /* Sons warning + last 5 secondes */
        if (r === 10 && !warnedRef.current) {
          warnedRef.current = true
          playSound("warning"); vibrate("warning")
        }
        if (r <= 5 && r > 0) playSound("last_second")

        if (r > 1) return r - 1
        const { phase: p, currentRound: cr, mode: m, totalRounds: tr, workDuration: wd, restDuration: rd, simpleDuration: sd } = stateRef.current
        /* Fin de round */
        playSound("round_end"); vibrate("round_end")
        warnedRef.current = false

        if (p === "work") {
          if (m === "intervals" && rd > 0) { setPhase("rest"); return rd }
          const maxR = m === "simple" ? 1 : tr
          if (cr >= maxR) { setPhase("done"); return 0 }
          setCurrentRound(c => c + 1); return m === "simple" ? sd : wd
        } else if (p === "rest") {
          if (cr >= tr) { setPhase("done"); return 0 }
          setCurrentRound(c => c + 1); setPhase("work"); return wd
        }
        return 0
      })
    }, 1000)
    return () => clearInterval(id)
  }, [phase, isPaused, playSound, vibrate])

  /* ── Wake Lock via hook centralisé */
  useEffect(() => {
    const active = (phase === "work" || phase === "rest") && !isPaused
    if (active) wakeLock.acquire()
    else        wakeLock.release()
  }, [phase, isPaused]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener("fullscreenchange", onChange)
    document.addEventListener("webkitfullscreenchange", onChange)
    return () => {
      document.removeEventListener("fullscreenchange", onChange)
      document.removeEventListener("webkitfullscreenchange", onChange)
    }
  }, [])

  const toggleFullscreen = useCallback(() => {
    type FSEl = HTMLElement & { webkitRequestFullscreen?(): Promise<void> }
    const el = document.documentElement as FSEl
    if (!document.fullscreenElement) {
      ;(el.requestFullscreen?.() ?? el.webkitRequestFullscreen?.())?.catch(() => {})
    } else { document.exitFullscreen?.().catch(() => {}) }
  }, [])

  const handleStart = useCallback(() => {
    unlockAudio()
    setCurrentRound(1); setIsPaused(false); setShowCountdown(true); setPhase("countdown")
  }, [unlockAudio])

  const handleCountdownCount = useCallback((value: CountdownValue) => {
    if (value === 3)    playSound("countdown_3")
    if (value === 2)    playSound("countdown_2")
    if (value === 1)    playSound("countdown_1")
    if (value === "go") playSound("countdown_go")
  }, [playSound])

  const handleCountdownDone = useCallback(() => {
    setShowCountdown(false)
    const { mode: m, simpleDuration: sd, workDuration: wd } = stateRef.current
    setRemaining(m === "simple" ? sd : wd)
    setPhase("work")
    warnedRef.current = false
    playSound("round_start"); vibrate("round_start")
  }, [playSound, vibrate])

  const handlePauseToggle = useCallback(() => setIsPaused(p => !p), [])

  const handleReset = useCallback(() => {
    setPhase("idle"); setCurrentRound(1); setRemaining(0); setIsPaused(false); setShowCountdown(false)
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {})
  }, [])

  const handleSkip = useCallback(() => {
    const { phase: p, currentRound: cr, mode: m, totalRounds: tr, workDuration: wd, restDuration: rd } = stateRef.current
    if (p === "work") {
      if (m === "intervals" && rd > 0) { setPhase("rest"); setRemaining(rd) }
      else {
        if (cr >= (m === "simple" ? 1 : tr)) { setPhase("done") }
        else { setCurrentRound(c => c + 1); setRemaining(wd) }
      }
    } else if (p === "rest") {
      if (cr >= tr) { setPhase("done") }
      else { setCurrentRound(c => c + 1); setPhase("work"); setRemaining(wd) }
    }
  }, [])


  const handleSavePreset = useCallback(() => {
    localStorage.setItem("tmt-timer-saved", JSON.stringify({ mode, workDuration, restDuration, totalRounds, simpleDuration }))
    setSavedFeedback(true); setTimeout(() => setSavedFeedback(false), 1500)
  }, [mode, workDuration, restDuration, totalRounds, simpleDuration])

  const isRunning   = phase !== "idle"
  const accentColor = STATE_COLOR[timerState]

  return (
    <div className="tmt-screen" style={{ background: "var(--paper)" }}>

      {/* ── Header adaptatif */}
      {isRunning ? (
        <div style={{ flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 16px 8px", minHeight: 52 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              {mode === "intervals" && phase !== "done" ? (
                <div>
                  <div style={{ fontFamily: M, fontSize: 10, fontWeight: 700, color: "var(--ink-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>Round</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                    <span style={{ fontFamily: M, fontSize: 22, fontWeight: 700, color: accentColor, letterSpacing: "0.01em", transition: "color 300ms var(--ease-out)" }}>
                      {String(currentRound).padStart(2, "0")}
                    </span>
                    <span style={{ fontFamily: M, fontSize: 13, color: "var(--ink-4)" }}>/ {String(totalRounds).padStart(2, "0")}</span>
                    <span style={{ fontSize: 13, color: "var(--ink-3)", fontWeight: 500 }}>
                      {phase === "rest" ? "Repos" : "Travail"}
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ fontFamily: D, fontSize: 18, fontWeight: 700, color: phase === "done" ? "var(--jade)" : "var(--ink)" }}>
                  {phase === "done" ? "Séance terminée" : "Timer libre"}
                </div>
              )}
            </div>
            <motion.button className="tmt-iconbtn" aria-label={isFullscreen ? "Quitter le plein écran" : "Plein écran"} whileTap={{ scale: 0.88 }} onClick={toggleFullscreen}>
              <IcoExpand />
            </motion.button>
            <motion.button className="tmt-iconbtn" aria-label="Réinitialiser le timer" whileTap={{ scale: 0.88 }} onClick={handleReset} style={{ background: "transparent", border: "1px solid var(--rule-2)" }}>
              <IcoClose />
            </motion.button>
          </div>
          {/* Progress bar */}
          <div style={{ height: 3, background: "var(--rule)", position: "relative", overflow: "hidden" }}>
            <motion.div
              style={{ position: "absolute", inset: 0, transformOrigin: "left center", background: accentColor, transition: "background 300ms var(--ease-out)" }}
              animate={{ scaleX: progress }}
              transition={{ type: "spring", stiffness: 80, damping: 18 }}
            />
          </div>
          {/* Round dots */}
          {mode === "intervals" && phase !== "done" && (
            <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: "10px 0 4px" }}>
              {Array.from({ length: totalRounds }, (_, i) => (
                <motion.div
                  key={i}
                  animate={{ width: i + 1 === currentRound ? 16 : 6 }}
                  transition={{ duration: 0.25 }}
                  style={{ height: 6, borderRadius: 3, background: i + 1 < currentRound ? "var(--jade)" : i + 1 === currentRound ? accentColor : "var(--rule-2)", transition: "background 300ms var(--ease-out)" }}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="tmt-hdr">
          <Link href="/">
            <motion.button className="tmt-iconbtn" aria-label="Retour" whileTap={{ scale: 0.88 }}>
              <IcoBackChevron />
            </motion.button>
          </Link>
          <h1 style={{ fontFamily: D }}>Timer libre</h1>
          <motion.button
            className="tmt-iconbtn"
            aria-label="Sauvegarder la configuration"
            whileTap={{ scale: 0.88 }}
            onClick={handleSavePreset}
            style={{ color: savedFeedback ? "var(--jade)" : "var(--ink-3)", transition: "color 200ms var(--ease-out)" }}
          >
            <IcoSave />
          </motion.button>
        </div>
      )}

      {/* ── Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
        <AnimatePresence mode="wait" initial={false}>
          {!isRunning ? (
            /* CONFIG VIEW */
            <motion.div
              key="config"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25, ease: EASE }}
              style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}
            >
              <div className="tmt-scroll" style={{ padding: "8px 20px 12px" }}>
                {/* Mode tabs */}
                <div className="tmt-tabs" style={{ marginBottom: 18 }}>
                  {(["intervals", "simple"] as TimerMode[]).map(m => (
                    <motion.button
                      key={m}
                      className={`tmt-tab${mode === m ? " on" : ""}`}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setMode(m)}
                    >
                      {m === "intervals" ? "Intervalles" : "Round simple"}
                    </motion.button>
                  ))}
                </div>

                <AnimatePresence mode="wait" initial={false}>
                  {mode === "intervals" ? (
                    <motion.div key="iv" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.18 }}>
                      {/* Steppers */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
                        <Stepper label="Travail" value={workDuration} values={WORK_STEPS} format={fmt} onDec={() => setWorkIdx(i => Math.max(0, i - 1))} onInc={() => setWorkIdx(i => Math.min(WORK_STEPS.length - 1, i + 1))} />
                        <Stepper label="Repos"   value={restDuration}  values={REST_STEPS}  format={fmt} onDec={() => setRestIdx(i => Math.max(0, i - 1))} onInc={() => setRestIdx(i => Math.min(REST_STEPS.length - 1, i + 1))} />
                        <Stepper label="Rounds"  value={totalRounds}   values={Array.from({ length: 12 }, (_, i) => i + 1)} format={v => String(v)} onDec={() => setRounds(r => Math.max(1, r - 1))} onInc={() => setRounds(r => Math.min(12, r + 1))} />
                      </div>
                      <div style={{ textAlign: "center", fontSize: 12, color: "var(--ink-3)" }}>
                        Durée estimée ·{" "}
                        <span style={{ fontFamily: M, fontWeight: 700, color: "var(--ink-2)" }}>
                          {fmt(totalRounds * workDuration + totalRounds * restDuration)}
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="sm" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.18 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 18 }}>
                        {QUICK_SIMPLE.map(t => {
                          const isOn = simpleDuration === t
                          return (
                            <motion.button
                              key={t}
                              whileTap={{ scale: 0.92 }}
                              onClick={() => setSimpleIdx(SIMPLE_STEPS.indexOf(t))}
                              style={{ height: 48, borderRadius: "var(--r-2)", background: isOn ? "var(--flame)" : "var(--card)", border: `1px solid ${isOn ? "transparent" : "var(--rule)"}`, boxShadow: isOn ? "var(--glow-flame-sm)" : "none", fontFamily: M, fontWeight: 700, fontSize: 16, color: isOn ? "white" : "var(--ink)", cursor: "pointer", transition: "all 150ms var(--ease-out)" }}
                            >
                              {fmt(t)}
                            </motion.button>
                          )
                        })}
                      </div>
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <div style={{ width: 180 }}>
                          <Stepper label="Durée" value={simpleDuration} values={SIMPLE_STEPS} format={fmt} onDec={() => setSimpleIdx(i => Math.max(0, i - 1))} onInc={() => setSimpleIdx(i => Math.min(SIMPLE_STEPS.length - 1, i + 1))} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Ring preview + START */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 20px 0", gap: 16 }}>
                <div style={{ pointerEvents: "none" }}>
                  <RingTimer duration={ringDuration} remaining={ringDuration} state="pause" size="md" />
                </div>
                <div className="tmt-above-nav" style={{ width: "100%" }}>
                  <motion.button
                    className="tmt-btn flame lg"
                    whileTap={{ scale: 0.96 }}
                    onClick={handleStart}
                    style={{ gap: 10, fontSize: 17 }}
                  >
                    <IcoPlay />
                    {mode === "intervals" ? `Démarrer ${totalRounds} rounds` : `Démarrer ${fmt(simpleDuration)}`}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* RUNNING VIEW */
            <motion.div
              key="running"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.28, ease: EASE }}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 0 }}
            >
              {phase !== "done" && (
                <div
                  onClick={handlePauseToggle}
                  role="button" tabIndex={-1}
                  aria-label={isPaused ? "Reprendre" : "Pause"}
                  style={{ position: "absolute", inset: 0, cursor: "pointer", zIndex: 1, touchAction: "manipulation" }}
                />
              )}
              <motion.div
                style={{ position: "relative", zIndex: 2, pointerEvents: "none" }}
                initial={reduced ? false : { scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 24 }}
              >
                <RingTimer duration={ringDuration} remaining={ringRemaining} state={timerState} size="lg" />
              </motion.div>
              <AnimatePresence>
                {phase === "done" && (
                  <motion.p
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    style={{ position: "absolute", bottom: 130, fontSize: 13, fontWeight: 700, color: "var(--jade)", letterSpacing: "0.08em", textTransform: "uppercase", zIndex: 2, pointerEvents: "none" }}
                  >
                    {mode === "intervals" ? `${totalRounds} rounds terminés` : "Timer terminé"}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Controls (running only) */}
      {isRunning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35, ease: EASE }}
          style={{ padding: "0 20px 20px", flexShrink: 0 }}
        >
          {phase === "done" ? (
            <motion.button className="tmt-btn paper lg" whileTap={{ scale: 0.96 }} onClick={handleReset}>
              Recommencer
            </motion.button>
          ) : (
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <motion.button
                className="tmt-iconbtn lg"
                aria-label="Réinitialiser"
                whileTap={{ scale: 0.88 }}
                onClick={handleReset}
                style={{ minWidth: 60, minHeight: 60 }}
              >
                <IcoReset />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={handlePauseToggle}
                aria-label={isPaused ? "Reprendre" : "Pause"}
                style={{
                  flex: 1, height: 60, borderRadius: "50px",
                  background: accentColor,
                  color: timerState === "warning" ? "#000" : "white",
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  fontFamily: D, fontSize: 15, fontWeight: 700,
                  boxShadow: isPaused ? "none" : `0 0 20px color-mix(in oklch, ${accentColor} 55%, transparent)`,
                  transition: "background 300ms var(--ease-out), box-shadow 300ms var(--ease-out)",
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isPaused ? (
                    <motion.span key="play" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ type: "spring", stiffness: 420, damping: 24 }}>
                      <IcoPlay />
                    </motion.span>
                  ) : (
                    <motion.span key="pause" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ type: "spring", stiffness: 420, damping: 24 }}>
                      <IcoPause />
                    </motion.span>
                  )}
                </AnimatePresence>
                {isPaused ? "Reprendre" : "Pause"}
              </motion.button>

              {mode === "intervals" && (
                <motion.button
                  className="tmt-iconbtn lg"
                  aria-label="Passer à la prochaine phase"
                  whileTap={{ scale: 0.88 }}
                  onClick={handleSkip}
                  style={{ minWidth: 60, minHeight: 60 }}
                >
                  <IcoSkip />
                </motion.button>
              )}
            </div>
          )}
        </motion.div>
      )}

      {!isRunning && <Nav active="timer" />}

      <AnimatePresence>
        {showCountdown && (
          <CountdownOverlay
            active={showCountdown}
            onComplete={handleCountdownDone}
            onCount={handleCountdownCount}
            duration={3}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
