"use client"

import { useState, useMemo } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import LevelChip from "@/components/LevelChip"
import { Ico } from "@/lib/icons"
import { COMBOS, GAMES, LEVEL_STYLES, PHASES, type Game, type ComboLevel } from "@/lib/data"

/* ── Constantes ──────────────────────────────────────────── */
const D    = "var(--font-display)"
const N    = "var(--font-num)"
const U    = "var(--font-ui)"
const M    = N  /* alias backward-compat */
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]
const TODAY = new Date().toISOString().split("T")[0]

const WORK_STEPS = [20, 30, 45, 60, 90, 120, 180]
const REST_STEPS = [10, 15, 20, 30, 45, 60]


function fmtTime(sec: number): string {
  if (sec < 60) return `0:${String(sec).padStart(2, "0")}`
  const m = Math.floor(sec / 60); const s = sec % 60
  return s === 0 ? `${m}:00` : `${m}:${String(s).padStart(2, "0")}`
}

/* ── Composants UI ───────────────────────────────────────── */
function SectionLabel({ children, num }: { children: React.ReactNode; num?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div style={{ flex: 1, height: 1, background: "var(--rule)" }} />
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        {num && (
          <span style={{ fontFamily: D, fontSize: 22, color: "var(--siam)", lineHeight: 1 }}>{num}</span>
        )}
        <span style={{ fontFamily: U, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ink-3)" }}>
          {num ? `· ${children}` : children}
        </span>
      </div>
      <div style={{ flex: 1, height: 1, background: "var(--rule)" }} />
    </div>
  )
}

function FormField({ label, id, helper, children }: { label: string; id: string; helper?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink-2)", marginBottom: 7, letterSpacing: "0.02em" }}>
        {label}
      </label>
      {children}
      {helper && <div style={{ fontSize: 12, color: "var(--ink-4)", marginTop: 6 }}>{helper}</div>}
    </div>
  )
}

interface StepperProps { value: number; values: number[]; format: (v: number) => string; onDec: () => void; onInc: () => void; label: string }
function Stepper({ value, values, format, onDec, onInc, label }: StepperProps) {
  const reduced = useReducedMotion()
  const atMin = value <= values[0]; const atMax = value >= values[values.length - 1]
  return (
    <div style={{ background: "var(--paper-3)", border: "1px solid var(--rule)", borderRadius: 12, padding: "14px 8px 12px", textAlign: "center" }}>
      <div style={{ fontFamily: N, fontSize: 9, fontWeight: 700, color: "var(--ink-4)", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 10 }}>
        {label}
      </div>
      <motion.div
        key={value}
        initial={reduced ? false : { scale: 0.84, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 440, damping: 28 }}
        style={{ fontFamily: N, fontSize: 30, fontWeight: 700, letterSpacing: "0.02em", lineHeight: 1, color: "var(--ink)", marginBottom: 12, fontVariantNumeric: "tabular-nums" }}
      >
        {format(value)}
      </motion.div>
      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
        {(["−", "+"] as const).map((op, i) => {
          const disabled = i === 0 ? atMin : atMax
          return (
            <motion.button
              key={op}
              aria-label={i === 0 ? `Diminuer ${label}` : `Augmenter ${label}`}
              whileTap={disabled ? {} : { scale: 0.88 }}
              onClick={i === 0 ? onDec : onInc}
              style={{
                minWidth: 40, minHeight: 40, borderRadius: "var(--r-1)",
                background: "var(--card-2)", border: "1px solid var(--rule)",
                color: disabled ? "var(--ink-4)" : "var(--ink)",
                fontSize: 18, fontWeight: 600, cursor: disabled ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: disabled ? 0.38 : 1,
              }}
            >
              {op}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

function ToggleRow({ label, sublabel, checked, onChange, icon }: { label: string; sublabel: string; checked: boolean; onChange: (v: boolean) => void; icon: React.ReactNode }) {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: "1px solid var(--rule)", cursor: "pointer" }}
      onClick={() => onChange(!checked)}
      role="switch" aria-checked={checked} aria-label={label} tabIndex={0}
      onKeyDown={e => (e.key === "Enter" || e.key === " ") && onChange(!checked)}
    >
      <div style={{
        width: 38, height: 38, borderRadius: "var(--r-1)", flexShrink: 0,
        background: checked ? "var(--flame-soft)" : "var(--card-2)",
        border: `1px solid ${checked ? "var(--flame-line)" : "var(--rule)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: checked ? "var(--flame)" : "var(--ink-3)",
        transition: "all 200ms var(--ease-out)",
      }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{label}</div>
        <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>{sublabel}</div>
      </div>
      <div className={`tmt-toggle-track${checked ? " on" : ""}`} aria-hidden="true">
        <div className="tmt-toggle-thumb" />
      </div>
    </div>
  )
}

function IcoCountdown() {
  return <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/></svg>
}
function IcoVibrate() {
  return <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M2 8v8M22 8v8"/></svg>
}
function IcoSound() {
  return <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/></svg>
}

/* ═══════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════ */
export default function SetupPage() {
  const router  = useRouter()
  const reduced = useReducedMotion()

  const [date,           setDate]           = useState(TODAY)
  const [comboId,        setComboId]        = useState('combo-025')
  const [comboSearch,    setComboSearch]    = useState("")
  const [comboLvlFilter, setComboLvlFilter] = useState<ComboLevel | null>(null)
  const [detailCombo,    setDetailCombo]    = useState<typeof COMBOS[0] | null>(null)
  const [game1Id,        setGame1Id]        = useState('jeu1-001')
  const [game2Id,        setGame2Id]        = useState('jeu2-001')
  const [detailGame,     setDetailGame]     = useState<{ game: Game; onSelect: (id: string) => void } | null>(null)
  const [game1Search,    setGame1Search]    = useState("")
  const [game2Search,    setGame2Search]    = useState("")
  const [workIdx,      setWorkIdx]      = useState(WORK_STEPS.indexOf(60))
  const [restIdx,      setRestIdx]      = useState(REST_STEPS.indexOf(30))
  const [rounds,       setRounds]       = useState(5)
  const [countdownOn,  setCountdownOn]  = useState(true)
  const [vibrationsOn, setVibrationsOn] = useState(false)
  const [soundOn,      setSoundOn]      = useState(false)



  const decWork   = () => setWorkIdx(i => Math.max(0, i - 1))
  const incWork   = () => setWorkIdx(i => Math.min(WORK_STEPS.length - 1, i + 1))
  const decRest   = () => setRestIdx(i => Math.max(0, i - 1))
  const incRest   = () => setRestIdx(i => Math.min(REST_STEPS.length - 1, i + 1))
  const decRounds = () => setRounds(r => Math.max(1, r - 1))
  const incRounds = () => setRounds(r => Math.min(12, r + 1))

  const workDur  = WORK_STEPS[workIdx]
  const restDur  = REST_STEPS[restIdx]

  const totalMin = useMemo(() => {
    const assaultsSec = rounds * workDur + Math.max(0, rounds - 1) * restDur
    const fixedSec    = PHASES.filter(p => p.key !== "assauts").reduce((acc, p) => acc + p.dur, 0)
    return Math.round((fixedSec + assaultsSec) / 60)
  }, [rounds, workDur, restDur])

  const section = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } } }

  return (
    <div className="tmt-screen">

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 20px 12px", flexShrink: 0, borderBottom: "1px solid var(--rule)" }}>
        <Link href="/">
          <motion.button className="tmt-iconbtn" aria-label="Retour" whileTap={{ scale: 0.88 }}>
            <Ico.back />
          </motion.button>
        </Link>
        <h1 style={{ flex: 1, fontFamily: D, fontSize: 26, fontWeight: 400, letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1 }}>
          Nouvelle séance
        </h1>
      </div>

      <div className="tmt-scroll" style={{ padding: "4px 20px 110px" }}>

        {/* ENCHAÎNEMENT */}
        <motion.div variants={section} initial="hidden" animate="visible" transition={{ delay: 0.13 }} style={{ marginBottom: 18 }}>
          <SectionLabel num="01">Enchaînement du jour</SectionLabel>

          {/* Level filter pills */}
          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 6, scrollbarWidth: "none" }}>
            {[null, 1, 2, 3, 4, 5, 6].map(n => {
              const isAll = n === null
              const isOn  = isAll ? !comboLvlFilter : comboLvlFilter === n
              const s     = !isAll ? LEVEL_STYLES[n as ComboLevel] : null
              return (
                <motion.button
                  key={n ?? "all"}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setComboLvlFilter(isAll ? null : (comboLvlFilter === n ? null : n as ComboLevel))}
                  aria-pressed={isOn}
                  style={{
                    flexShrink: 0, height: 30, padding: "0 12px", borderRadius: 999,
                    background: isOn ? (isAll ? "var(--flame-soft)" : s!.bg) : "var(--card)",
                    border: `1px solid ${isOn ? (isAll ? "var(--flame-line)" : s!.ring) : "var(--rule)"}`,
                    color: isOn ? (isAll ? "var(--flame)" : s!.text) : "var(--ink-3)",
                    fontSize: 12, fontWeight: 700, cursor: "pointer",
                    transition: "all 200ms var(--ease-out)",
                  }}
                >
                  {isAll ? "Tous" : `N${n}`}
                </motion.button>
              )
            })}
          </div>

          {/* Search */}
          <div style={{ position: "relative", margin: "8px 0" }}>
            <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--ink-3)", pointerEvents: "none" }}>
              <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
            </div>
            <input
              type="search" className="tmt-input" value={comboSearch}
              onChange={e => setComboSearch(e.target.value)}
              placeholder="Rechercher un combo…"
              style={{ paddingLeft: 36, paddingTop: 10, paddingBottom: 10, fontSize: 13 }}
            />
          </div>

          {/* Scrollable combo list */}
          {(() => {
            const q  = comboSearch.trim().toLowerCase()
            const list = COMBOS.filter(c =>
              (!comboLvlFilter || c.level === comboLvlFilter) &&
              (!q || c.name.toLowerCase().includes(q) || c.steps.some(s => s.title.toLowerCase().includes(q)))
            )
            return (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 280, overflowY: "auto", overscrollBehavior: "contain" }}>
                {list.length === 0 && (
                  <div style={{ padding: "18px 0", textAlign: "center", fontSize: 13, color: "var(--ink-3)" }}>Aucun combo trouvé</div>
                )}
                {list.map(c => {
                  const isOn = c.id === comboId
                  const s    = LEVEL_STYLES[c.level]
                  return (
                    <div
                      key={c.id}
                      role="button" tabIndex={0} aria-pressed={isOn}
                      onClick={() => setComboId(c.id)}
                      onKeyDown={e => (e.key === "Enter" || e.key === " ") && setComboId(c.id)}
                      style={{
                        display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px",
                        borderRadius: "var(--r-2)",
                        background: isOn ? "var(--flame-soft)" : "var(--card)",
                        border: `1px solid ${isOn ? "var(--flame-line)" : "var(--rule)"}`,
                        cursor: "pointer",
                        transition: "background 150ms var(--ease-out), border-color 150ms var(--ease-out)",
                      }}
                    >
                      <div style={{
                        flexShrink: 0, width: 34, height: 34, borderRadius: "var(--r-1)",
                        background: s.bg, border: `1px solid ${s.ring}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: N, fontSize: 9, fontWeight: 700, color: s.text,
                      }}>N{c.level}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4, color: isOn ? "var(--flame)" : "var(--ink)", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" } as React.CSSProperties}>
                          {c.name}
                        </div>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); setDetailCombo(c) }}
                        aria-label={`Détails — ${c.name}`}
                        style={{ flexShrink: 0, width: 30, height: 30, borderRadius: "var(--r-1)", background: "var(--card-2)", border: "1px solid var(--rule)", color: "var(--ink-3)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                        </svg>
                      </button>
                    </div>
                  )
                })}
              </div>
            )
          })()}
        </motion.div>

        {/* JEUX */}
        <motion.div variants={section} initial="hidden" animate="visible" transition={{ delay: 0.19 }} style={{ marginBottom: 18 }}>
          <SectionLabel num="02">Jeux de la séance</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { num: 1, value: game1Id, set: setGame1Id, base: "jeu1" as const, search: game1Search, setSearch: setGame1Search },
              { num: 2, value: game2Id, set: setGame2Id, base: "jeu2" as const, search: game2Search, setSearch: setGame2Search },
            ].map(({ num, value, set, base, search, setSearch }) => {
              const q = search.trim().toLowerCase()
              const games = GAMES.filter(g =>
                (g.moment === base || g.moment === "bonus") &&
                (!q || g.name.toLowerCase().includes(q))
              )
              return (
                <div key={num}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--ink-3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 7 }}>
                    Jeu {num}
                  </div>

                  {/* Search */}
                  <div style={{ position: "relative", marginBottom: 8 }}>
                    <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--ink-3)", pointerEvents: "none" }}>
                      <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
                    </div>
                    <input
                      type="search"
                      className="tmt-input"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Rechercher un jeu…"
                      style={{ paddingLeft: 36, paddingTop: 10, paddingBottom: 10, fontSize: 13 }}
                    />
                  </div>

                  {/* Scrollable game list */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 280, overflowY: "auto", overscrollBehavior: "contain" }}>
                    {games.length === 0 && (
                      <div style={{ padding: "18px 0", textAlign: "center", fontSize: 13, color: "var(--ink-3)" }}>
                        Aucun jeu trouvé
                      </div>
                    )}
                    {games.map(g => {
                      const isOn    = g.id === value
                      const isBonus = g.moment === "bonus"
                      return (
                        <div
                          key={g.id}
                          role="button"
                          tabIndex={0}
                          aria-pressed={isOn}
                          onClick={() => set(g.id)}
                          onKeyDown={e => (e.key === "Enter" || e.key === " ") && set(g.id)}
                          style={{
                            display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px",
                            borderRadius: "var(--r-2)",
                            background: isOn ? "var(--frost-soft)" : "var(--card)",
                            border: `1px solid ${isOn ? "var(--frost-line)" : "var(--rule)"}`,
                            cursor: "pointer",
                            transition: "background 150ms var(--ease-out), border-color 150ms var(--ease-out)",
                          }}
                        >
                          {/* Badge */}
                          <div style={{
                            flexShrink: 0, width: 34, height: 34, borderRadius: "var(--r-1)",
                            background: isBonus ? "var(--amber-soft)" : isOn ? "var(--frost-soft)" : "var(--card-2)",
                            border: `1px solid ${isBonus ? "var(--amber-line)" : isOn ? "var(--frost-line)" : "var(--rule)"}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontFamily: N, fontSize: 9, fontWeight: 700,
                            color: isBonus ? "var(--amber)" : isOn ? "var(--frost)" : "var(--ink-3)",
                          }}>
                            {isBonus ? "BON" : `J${num}`}
                          </div>

                          {/* Text */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3, marginBottom: 2, color: isOn ? "var(--frost)" : "var(--ink)" }}>
                              {g.name}
                            </div>
                            <div style={{ fontSize: 11, color: "var(--ink-3)", lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" } as React.CSSProperties}>
                              {g.objective}
                            </div>
                          </div>

                          {/* Info button */}
                          <button
                            onClick={e => { e.stopPropagation(); setDetailGame({ game: g, onSelect: set }) }}
                            aria-label={`Détails — ${g.name}`}
                            style={{
                              flexShrink: 0, width: 30, height: 30, borderRadius: "var(--r-1)",
                              background: "var(--card-2)", border: "1px solid var(--rule)",
                              color: "var(--ink-3)", cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                          >
                            <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                            </svg>
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* TIMER ASSAUTS */}
        <motion.div variants={section} initial="hidden" animate="visible" transition={{ delay: 0.22 }} style={{ marginBottom: 18 }}>
          <SectionLabel num="03">Timer Assauts</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            <Stepper label="Travail" value={WORK_STEPS[workIdx]} values={WORK_STEPS} format={fmtTime} onDec={decWork} onInc={incWork} />
            <Stepper label="Repos"   value={REST_STEPS[restIdx]} values={REST_STEPS} format={fmtTime} onDec={decRest} onInc={incRest} />
            <Stepper label="Rounds"  value={rounds} values={Array.from({ length: 12 }, (_, i) => i + 1)} format={v => String(v)} onDec={decRounds} onInc={incRounds} />
          </div>
        </motion.div>

        {/* PARAMÈTRES */}
        <motion.div variants={section} initial="hidden" animate="visible" transition={{ delay: 0.25 }} style={{ marginBottom: 8 }}>
          <SectionLabel>Paramètres</SectionLabel>
          <div style={{ background: "var(--card)", borderRadius: "var(--r-3)", border: "1px solid var(--rule)", padding: "0 16px" }}>
            <ToggleRow label="Countdown 3-2-1" sublabel="Décompte avant chaque round" checked={countdownOn} onChange={setCountdownOn} icon={<IcoCountdown />} />
            <ToggleRow label="Vibrations" sublabel="Retour haptique (Phase 5)" checked={vibrationsOn} onChange={setVibrationsOn} icon={<IcoVibrate />} />
            <div style={{ borderBottom: "none" }}>
              <ToggleRow label="Sons" sublabel="Bip de fin de round (Phase 5)" checked={soundOn} onChange={setSoundOn} icon={<IcoSound />} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* STICKY FOOTER */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4, ease: EASE }}
        style={{
          paddingTop:    "12px",
          paddingLeft:   "20px",
          paddingRight:  "20px",
          paddingBottom: "max(20px, calc(env(safe-area-inset-bottom, 0px) + 16px))",
          flexShrink:    0,
          borderTop:     "1px solid var(--rule)",
          background:    "var(--paper)",
        }}
      >
        <motion.button
          whileHover={undefined}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            localStorage.setItem("tmt-preset-saved", JSON.stringify({
              comboId, rounds, game1Id, game2Id,
              workDur: WORK_STEPS[workIdx], restDur: REST_STEPS[restIdx],
              countdownOn,
            }))
            router.push("/run")
          }}
          aria-label="Lancer la séance avec ces paramètres"
          style={{
            width:          "100%",
            minHeight:      72,
            borderRadius:   12,
            background:     "var(--siam)",
            border:         "none",
            color:          "white",
            cursor:         "pointer",
            display:        "flex",
            flexDirection:  "column",
            alignItems:     "center",
            justifyContent: "center",
            gap:            3,
            boxShadow:      "0 0 48px rgba(220,38,38,0.45)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: U, fontSize: 18, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
            Lancer la séance
          </div>
          <div style={{ fontFamily: N, fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.70)", letterSpacing: "0.06em" }}>
            {totalMin} min · {PHASES.length} phases
          </div>
        </motion.button>
      </motion.div>

      {/* ── Combo Detail Drawer (portal) */}
      {typeof window !== "undefined" && createPortal(
        <AnimatePresence>
          {detailCombo && (
            <>
              <motion.div
                key="cd-scrim"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setDetailCombo(null)}
                aria-hidden="true"
                style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", zIndex: 502, cursor: "pointer" }}
              />
              <motion.div
                key="cd-sheet"
                role="dialog" aria-modal="true" aria-label={detailCombo.name}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "tween", duration: 0.28, ease: EASE }}
                style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 503, background: "var(--paper-3)", display: "flex", flexDirection: "column" }}
              >
                {/* Header */}
                <div style={{ padding: "16px 20px 12px", paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)", flexShrink: 0, borderBottom: "1px solid var(--rule)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <LevelChip level={detailCombo.level} />
                      <span style={{ fontFamily: M, fontSize: 10, fontWeight: 700, color: "var(--ink-3)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                        {detailCombo.steps.length} étapes · {detailCombo.keyPoints.length} points clés
                      </span>
                    </div>
                    <button className="tmt-iconbtn" aria-label="Fermer" onClick={() => setDetailCombo(null)}>
                      <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                  <div style={{ fontFamily: D, fontSize: 19, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--ink)", lineHeight: 1.25 }}>
                    {detailCombo.name}
                  </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px calc(env(safe-area-inset-bottom, 0px) + 28px)", display: "flex", flexDirection: "column", gap: 20 }}>
                  {/* Décomposition */}
                  <div>
                    <div style={{ fontFamily: M, fontSize: 10, fontWeight: 700, color: "var(--ink-3)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
                      Décomposition
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {detailCombo.steps.map((step, i) => (
                        <motion.div
                          key={step.number}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 + i * 0.05, duration: 0.22 }}
                          style={{ display: "flex", alignItems: "center", gap: 12 }}
                        >
                          <span style={{ flexShrink: 0, width: 26, height: 26, borderRadius: "50%", background: "var(--flame-soft)", border: "1px solid var(--flame-line)", color: "var(--flame)", fontFamily: M, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
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
                      {detailCombo.keyPoints.map((pt, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 + i * 0.04, duration: 0.2 }}
                          style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
                        >
                          <span style={{ flexShrink: 0, marginTop: 1, color: "var(--flame)", fontWeight: 700, fontSize: 14, lineHeight: 1.5 }}>✓</span>
                          <span style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.65 }}>{pt}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <motion.button
                    className="tmt-btn flame lg"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setComboId(detailCombo.id); setDetailCombo(null) }}
                  >
                    Choisir ce combo
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ── Game Detail Drawer (portal) */}
      {typeof window !== "undefined" && createPortal(
        <AnimatePresence>
          {detailGame && (
            <>
              {/* Scrim */}
              <motion.div
                key="gd-scrim"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setDetailGame(null)}
                aria-hidden="true"
                style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", zIndex: 500, cursor: "pointer" }}
              />

              {/* Sheet */}
              <motion.div
                key="gd-sheet"
                role="dialog"
                aria-modal="true"
                aria-label={detailGame.game.name}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "tween", duration: 0.28, ease: EASE }}
                style={{
                  position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 501,
                  background: "var(--paper-3)", display: "flex", flexDirection: "column",
                }}
              >
                {/* Header */}
                <div style={{ padding: "16px 20px 12px", paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)", flexShrink: 0, borderBottom: "1px solid var(--rule)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{
                      fontFamily: M, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
                      color: detailGame.game.moment === "bonus" ? "var(--amber)" : "var(--frost)",
                    }}>
                      {detailGame.game.moment === "jeu1" ? "Jeu d'entrée · 5 min"
                        : detailGame.game.moment === "jeu2" ? "Jeu de transition · 5 min"
                        : "Bonus · Selon temps"}
                    </span>
                    <button className="tmt-iconbtn" aria-label="Fermer" onClick={() => setDetailGame(null)}>
                      <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                  <div style={{ fontFamily: D, fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--ink)", lineHeight: 1.2 }}>
                    {detailGame.game.name}
                  </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px calc(env(safe-area-inset-bottom, 0px) + 28px)", display: "flex", flexDirection: "column", gap: 18 }}>
                  <div>
                    <div style={{ fontFamily: M, fontSize: 10, fontWeight: 700, color: "var(--ink-3)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>
                      Déroulement
                    </div>
                    <p style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.75, margin: 0 }}>
                      {detailGame.game.description}
                    </p>
                  </div>
                  <div>
                    <div style={{ fontFamily: M, fontSize: 10, fontWeight: 700, color: "var(--ink-3)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>
                      Objectif
                    </div>
                    <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.6, margin: 0 }}>
                      {detailGame.game.objective}
                    </p>
                  </div>
                  <motion.button
                    className="tmt-btn lg"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      detailGame.onSelect(detailGame.game.id)
                      setDetailGame(null)
                    }}
                    style={{ background: "var(--frost)", color: "#050508", boxShadow: "var(--glow-frost-sm)", marginTop: 4 }}
                  >
                    Choisir ce jeu
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}
