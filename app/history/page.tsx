"use client"

import { useState, useRef, useMemo, useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence, useInView, useReducedMotion, useDragControls } from "framer-motion"
import { useRouter } from "next/navigation"
import Nav from "@/components/Nav"
import { type Session } from "@/lib/data"
import { useCompletedSessions } from "@/hooks/useCompletedSessions"

/* ── Font / ease aliases ─────────────────────────────────── */
const FD   = "var(--font-display)"
const FU   = "var(--font-ui)"
const FN   = "var(--font-num)"
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]
const TODAY = new Date()

/* ── Helpers date ────────────────────────────────────────── */
function daysBefore(iso: string): number {
  return Math.round((TODAY.getTime() - new Date(iso + "T00:00:00").getTime()) / 86_400_000)
}
function isoToMonth(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
}
function isoToMonthKey(iso: string): string {
  return iso.slice(0, 7)
}
function isoToDay(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("fr-FR", { day: "2-digit" })
}
function isoToMonthShort(iso: string): string {
  return new Date(iso + "T00:00:00")
    .toLocaleDateString("fr-FR", { month: "short" })
    .toUpperCase()
    .replace(".", "")
}

/* ── CountUp animé ───────────────────────────────────────── */
function CountUp({ to, suffix = "", duration = 1200 }: { to: number; suffix?: string; duration?: number }) {
  const ref     = useRef<HTMLSpanElement>(null)
  const inView  = useInView(ref, { once: true, amount: 0.8 })
  const reduced = useReducedMotion()
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduced) { setVal(to); return }
    let id: number
    const start = performance.now()
    const tick = (now: number) => {
      const t    = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      setVal(Math.round(to * ease))
      if (t < 1) id = requestAnimationFrame(tick)
      else setVal(to)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [inView, to, duration, reduced])

  return <span ref={ref}>{val}{suffix}</span>
}

/* ── Icônes ──────────────────────────────────────────────── */
function IcoX() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}
function IcoPlay() {
  return <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor"><path d="M7 5v14l12-7z"/></svg>
}
function IcoChevRight() {
  return (
    <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6l6 6-6 6"/>
    </svg>
  )
}

/* ── ActivityChart (barres siam) ─────────────────────────── */
const MONTH_SHORT: Record<string, string> = {
  "01": "Jan", "02": "Fév", "03": "Mar", "04": "Avr",
  "05": "Mai", "06": "Jun", "07": "Jul", "08": "Aoû",
  "09": "Sep", "10": "Oct", "11": "Nov", "12": "Déc",
}

function ActivityChart({ sessions }: { sessions: Session[] }) {
  const ref     = useRef<HTMLDivElement>(null)
  const inView  = useInView(ref, { once: true, amount: 0.5 })
  const reduced = useReducedMotion()

  const bars = useMemo(() => {
    const N = 12
    return Array.from({ length: N }, (_, i) => {
      const weekOffset = N - 1 - i
      const weekEnd    = new Date(TODAY.getTime() - weekOffset * 7 * 86_400_000)
      const weekStart  = new Date(weekEnd.getTime() - 7 * 86_400_000)
      const count      = sessions.filter(s => {
        const d = new Date(s.isoDate + "T00:00:00")
        return d >= weekStart && d <= weekEnd
      }).length
      return { count, monthKey: weekEnd.toISOString().slice(5, 7), isCurrent: weekOffset === 0, weekEnd }
    })
  }, [sessions])

  const maxCount = Math.max(...bars.map(b => b.count), 1)

  const monthLabels = useMemo(() => bars.map((b, i) => {
    const prev = i > 0 ? bars[i - 1].monthKey : null
    return b.monthKey !== prev ? MONTH_SHORT[b.monthKey] ?? "" : ""
  }), [bars])

  return (
    <div ref={ref} style={{ background: "var(--paper-3)", borderRadius: 12, border: "1px solid var(--rule)", padding: "18px 16px 14px" }}>
      <div style={{ fontFamily: FN, fontSize: 10, fontWeight: 700, color: "var(--ink-3)", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 3, height: 12, borderRadius: 2, background: "var(--siam)", display: "block" }} />
        Activité · 12 semaines
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 72 }}>
        {bars.map((b, i) => {
          const heightPct = b.count === 0 ? 8 : Math.round((b.count / maxCount) * 100)
          const bg = b.count === 0
            ? "var(--rule-2)"
            : b.isCurrent
              ? "var(--siam)"
              : "oklch(0.58 0.26 15 / 0.45)"
          return (
            <motion.div
              key={i}
              role="img"
              aria-label={`Semaine ${i + 1} : ${b.count} séance${b.count !== 1 ? "s" : ""}`}
              initial={reduced ? false : { scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4, ease: "easeOut" }}
              style={{
                flex:           1,
                height:         `${heightPct}%`,
                minHeight:      4,
                background:     bg,
                borderRadius:   3,
                transformOrigin:"bottom",
                boxShadow:      b.isCurrent && !reduced ? "0 0 12px oklch(0.58 0.26 15 / 0.50)" : "none",
              }}
            />
          )
        })}
      </div>

      <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
        {monthLabels.map((label, i) => (
          <div key={i} style={{ flex: 1, fontSize: 9, fontFamily: FN, fontWeight: 700, color: label ? "var(--ink-4)" : "transparent", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            {label || "·"}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── KPI Scoreboard (2×2) ────────────────────────────────── */
function KpiScoreboard({ sessions }: { sessions: Session[] }) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  const currentMonth  = new Date().toISOString().slice(0, 7)
  const totalSessions = sessions.length
  const totalHours    = Math.round(sessions.reduce((a, s) => a + s.durMin, 0) / 60)
  const monthSessions = sessions.filter(s => s.isoDate.startsWith(currentMonth)).length
  const avgLevel      = sessions.length
    ? Math.round(sessions.reduce((a, s) => a + s.lvl, 0) / sessions.length)
    : 0

  const kpis = [
    { label: "COMBATS",     value: totalSessions, suffix: "",  sub: "total"          },
    { label: "HEURES",      value: totalHours,    suffix: "h", sub: "d'entraînement" },
    { label: "CE MOIS",     value: monthSessions, suffix: "",  sub: "séances"        },
    { label: "NIVEAU MOY.", value: avgLevel,      suffix: "",  sub: "sur 6"          },
  ]

  return (
    <div ref={ref} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
      {kpis.map((k, i) => (
        <motion.div
          key={k.label}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.07, duration: 0.4, ease: EASE }}
          style={{ background: "var(--paper-3)", border: "1px solid var(--rule)", borderRadius: 12, padding: "16px 18px" }}
        >
          <div style={{ fontFamily: FN, fontSize: 9, fontWeight: 700, color: "var(--siam)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>
            {k.label}
          </div>
          <div style={{ fontFamily: FD, fontSize: 52, lineHeight: 1, letterSpacing: "-0.03em", color: "var(--ink)", marginBottom: 4 }}>
            {inView ? <CountUp to={k.value} suffix={k.suffix} /> : <span>0{k.suffix}</span>}
          </div>
          <div style={{ fontFamily: FU, fontSize: 11, fontWeight: 500, color: "var(--ink-4)" }}>
            {k.sub}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

/* ── SessionCard (fight record) ──────────────────────────── */
function SessionCard({
  session, index, combatN, onTap,
}: {
  session: Session; index: number; combatN: number; onTap: () => void
}) {
  const reduced = useReducedMotion()
  const day     = isoToDay(session.isoDate)
  const mon     = isoToMonthShort(session.isoDate)

  return (
    <motion.div
      layout
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ delay: Math.min(index * 0.045, 0.28), duration: 0.3, ease: EASE }}
      whileTap={{ scale: 0.985 }}
      onClick={onTap}
      role="button"
      tabIndex={0}
      aria-label={`Voir le combat du ${session.date}`}
      onKeyDown={e => (e.key === "Enter" || e.key === " ") && onTap()}
      style={{
        background:   "var(--paper-3)",
        border:       "1px solid var(--rule)",
        borderRadius: 12,
        padding:      "14px 14px",
        cursor:       "pointer",
        display:      "flex",
        alignItems:   "center",
        gap:          12,
      }}
    >
      {/* Date bloc */}
      <div style={{ flexShrink: 0, textAlign: "center", width: 40 }}>
        <div style={{ fontFamily: FD, fontSize: 30, lineHeight: 1, letterSpacing: "-0.03em", color: "var(--siam)" }}>
          {day}
        </div>
        <div style={{ fontFamily: FN, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: "var(--ink-4)", textTransform: "uppercase", marginTop: 2 }}>
          {mon}
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 40, background: "var(--rule-2)", flexShrink: 0 }} />

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: FN, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "var(--ink-4)", textTransform: "uppercase", marginBottom: 3 }}>
          COMBAT #{combatN} · N{session.lvl} · {session.dur}
        </div>
        <p style={{
          fontFamily:      FU,
          fontSize:        13,
          fontWeight:      600,
          lineHeight:      1.35,
          color:           "var(--ink)",
          margin:          0,
          overflow:        "hidden",
          display:         "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        } as React.CSSProperties}>
          {session.combo}
        </p>
      </div>

      {/* Arrow */}
      <div style={{ color: "var(--ink-4)", flexShrink: 0, opacity: 0.4 }}>
        <IcoChevRight />
      </div>
    </motion.div>
  )
}

/* ── SessionDetail (fullscreen portal) ───────────────────── */
function SessionDetail({
  session, combatN, onClose, onRedo,
}: {
  session: Session; combatN: number; onClose: () => void; onRedo: () => void
}) {
  const reduced      = useReducedMotion()
  const dragControls = useDragControls()
  const steps        = session.combo.split(/\s*[·—,]\s*/).filter(Boolean)

  const content = (
    <>
      <motion.div
        key="bd"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        aria-hidden="true"
        style={{ position: "fixed", inset: 0, zIndex: 800, background: "rgba(0,0,0,0.80)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
      />

      <motion.div
        key="panel"
        role="dialog"
        aria-modal="true"
        aria-label={`Combat #${combatN}`}
        drag="y"
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.2 }}
        onDragEnd={(_, info) => { if (info.offset.y > 90 || info.velocity.y > 600) onClose() }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "110%" }}
        transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 32 }}
        style={{
          position:      "fixed",
          top:           0,
          left:          0,
          right:         0,
          bottom:        0,
          zIndex:        801,
          background:    "var(--paper)",
          display:       "flex",
          flexDirection: "column",
          overflow:      "hidden",
        }}
      >
        {/* Drag handle zone */}
        <div
          onPointerDown={e => dragControls.start(e)}
          style={{ padding: "12px 20px 0", flexShrink: 0, cursor: "grab", touchAction: "none" }}
        >
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--rule-3)", margin: "0 auto 16px" }} />
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <div style={{ fontFamily: FN, fontSize: 10, fontWeight: 700, letterSpacing: "0.20em", color: "var(--siam)", textTransform: "uppercase", marginBottom: 4 }}>
                COMBAT #{combatN}
              </div>
              <div style={{ fontFamily: FD, fontSize: "clamp(32px, 9vw, 44px)", lineHeight: 0.9, letterSpacing: "-0.03em", color: "var(--ink)" }}>
                {session.date}
              </div>
            </div>
            <button
              className="tmt-iconbtn"
              aria-label="Fermer"
              onClick={onClose}
              style={{ color: "var(--ink-3)", marginTop: 4 }}
            >
              <IcoX />
            </button>
          </div>
        </div>

        <div style={{ overflowY: "auto", flex: 1, padding: "0 20px 48px", touchAction: "pan-y" }}>
          {/* KPI row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 24 }}>
            {[
              { lbl: "DURÉE",  val: session.dur },
              { lbl: "NIVEAU", val: `N${session.lvl}` },
              { lbl: "ROUNDS", val: String(session.rounds) },
            ].map(k => (
              <div key={k.lbl} style={{ background: "var(--paper-3)", border: "1px solid var(--rule)", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                <div style={{ fontFamily: FN, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "var(--ink-4)", textTransform: "uppercase", marginBottom: 4 }}>
                  {k.lbl}
                </div>
                <div style={{ fontFamily: FD, fontSize: 24, lineHeight: 1, letterSpacing: "-0.02em", color: "var(--ink)" }}>
                  {k.val}
                </div>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: "var(--rule)", marginBottom: 24 }} />

          {/* Combo steps */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: FN, fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", color: "var(--ink-3)", textTransform: "uppercase", marginBottom: 16 }}>
              Enchaînement
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {steps.map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    fontFamily: FD,
                    fontSize:   20,
                    lineHeight: 1,
                    color:      i === steps.length - 1 ? "var(--siam)" : "var(--ink-4)",
                    width:      28,
                    flexShrink: 0,
                    textAlign:  "right",
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div style={{ width: 1, height: 20, background: "var(--rule-2)", flexShrink: 0 }} />
                  <span style={{ fontFamily: FU, fontSize: 14, fontWeight: 500, color: "var(--ink)", lineHeight: 1.4 }}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Note coach */}
          {session.note && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: FN, fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", color: "var(--ink-3)", textTransform: "uppercase", marginBottom: 12 }}>
                Note coach
              </div>
              <div style={{ background: "oklch(0.58 0.26 15 / 0.08)", border: "1px solid oklch(0.58 0.26 15 / 0.20)", borderRadius: 10, padding: "12px 16px" }}>
                <p style={{ fontFamily: FU, fontSize: 13, fontWeight: 500, color: "var(--ink-2)", lineHeight: 1.65, margin: 0, fontStyle: "italic" }}>
                  « {session.note} »
                </p>
              </div>
            </div>
          )}

          {/* CTA */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onRedo}
            style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              gap:            10,
              width:          "100%",
              height:         56,
              borderRadius:   12,
              background:     "var(--siam)",
              color:          "white",
              border:         "none",
              cursor:         "pointer",
              fontFamily:     FD,
              fontSize:       16,
              letterSpacing:  "0.06em",
              textTransform:  "uppercase",
              boxShadow:      "0 0 24px oklch(0.58 0.26 15 / 0.28)",
            }}
          >
            <IcoPlay /> Refaire ce combat
          </motion.button>
        </div>
      </motion.div>
    </>
  )

  if (typeof window === "undefined") return null
  return createPortal(content, document.body)
}

/* ═══════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════ */
const PERIODS = [
  { label: "7 j",    days: 7        },
  { label: "30 j",   days: 30       },
  { label: "3 mois", days: 90       },
  { label: "Tout",   days: Infinity },
]

export default function HistoryPage() {
  const router = useRouter()
  const { sessions } = useCompletedSessions()

  const [period,     setPeriod]     = useState(Infinity)
  const [detailSess, setDetailSess] = useState<Session | null>(null)
  const [detailN,    setDetailN]    = useState(0)

  const filtered = useMemo(() =>
    sessions
      .filter(s => period === Infinity || daysBefore(s.isoDate) <= period)
      .sort((a, b) => b.isoDate.localeCompare(a.isoDate))
  , [sessions, period])

  /* Group by month, attach combatN (global rank, oldest = 1) */
  const grouped = useMemo(() => {
    const total = filtered.length
    const map   = new Map<string, { label: string; items: Array<{ s: Session; combatN: number }> }>()
    filtered.forEach((s, idx) => {
      const key  = isoToMonthKey(s.isoDate)
      if (!map.has(key)) map.set(key, { label: isoToMonth(s.isoDate), items: [] })
      map.get(key)!.items.push({ s, combatN: total - idx })
    })
    return Array.from(map.entries()).map(([key, val]) => ({ key, ...val }))
  }, [filtered])

  const handleRedo = () => {
    if (!detailSess) return
    setDetailSess(null)
    router.push(`/setup?sessionId=${detailSess.id}`)
  }

  return (
    <div className="tmt-screen" style={{ background: "var(--paper)" }}>

      {/* ── Header ── */}
      <div style={{
        padding:     "max(env(safe-area-inset-top, 0px), 20px) 20px 0",
        flexShrink:  0,
      }}>
        <div style={{ fontFamily: FN, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", color: "var(--siam)", textTransform: "uppercase", marginBottom: 2 }}>
          HALL OF FAME
        </div>
        <h1 style={{ fontFamily: FD, fontSize: "clamp(32px, 8vw, 44px)", lineHeight: 0.9, letterSpacing: "-0.02em", color: "var(--ink)", margin: "0 0 6px" }}>
          MES COMBATS
        </h1>
        <div style={{ fontFamily: FU, fontSize: 12, fontWeight: 500, color: "var(--ink-4)", marginBottom: 16 }}>
          {sessions.length} séance{sessions.length !== 1 ? "s" : ""} enregistrée{sessions.length !== 1 ? "s" : ""}
        </div>

        {/* Period filter pills */}
        <div style={{ display: "flex", gap: 6, paddingBottom: 16 }}>
          {PERIODS.map(p => {
            const isOn = period === p.days
            return (
              <motion.button
                key={p.label}
                whileTap={{ scale: 0.92 }}
                onClick={() => setPeriod(p.days)}
                aria-pressed={isOn}
                style={{
                  flex:          1,
                  height:        32,
                  borderRadius:  999,
                  background:    isOn ? "var(--siam)" : "var(--paper-3)",
                  border:        `1px solid ${isOn ? "transparent" : "var(--rule)"}`,
                  color:         isOn ? "white" : "var(--ink-4)",
                  fontFamily:    FN,
                  fontSize:      11,
                  fontWeight:    700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor:        "pointer",
                  transition:    "all 200ms var(--ease-out)",
                  boxShadow:     isOn ? "0 0 16px oklch(0.58 0.26 15 / 0.28)" : "none",
                }}
              >
                {p.label}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* ── Scroll content ── */}
      <div className="tmt-scroll" style={{ padding: "0 20px 110px" }}>

        <KpiScoreboard sessions={filtered} />

        <div style={{ marginBottom: 20 }}>
          <ActivityChart sessions={sessions} />
        </div>

        {/* Fight record section header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ fontFamily: FD, fontSize: "clamp(18px, 5vw, 22px)", lineHeight: 1, letterSpacing: "-0.01em", color: "var(--ink)", whiteSpace: "nowrap" }}>
            FIGHT RECORD
          </div>
          <div style={{ flex: 1, height: 1, background: "var(--rule)" }} />
          <div style={{ fontFamily: FN, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "var(--ink-4)", whiteSpace: "nowrap" }}>
            {filtered.length} combat{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>

        <AnimatePresence mode="popLayout" initial={false}>
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              style={{ textAlign: "center", padding: "48px 24px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}
            >
              <div style={{ fontSize: 48, lineHeight: 1, marginBottom: 6 }}>🥊</div>
              <div style={{ fontFamily: FD, fontSize: "clamp(18px, 5vw, 22px)", letterSpacing: "0.02em", color: "var(--ink)" }}>
                PREMIER COMBAT EN ATTENTE
              </div>
              <p style={{ fontFamily: FU, fontSize: 13, color: "var(--ink-3)", lineHeight: 1.6, margin: 0, maxWidth: 240 }}>
                Lance ta première séance pour commencer ton fight record.
              </p>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => router.push("/setup")}
                style={{
                  display:        "flex",
                  alignItems:     "center",
                  gap:            8,
                  marginTop:      10,
                  height:         52,
                  paddingInline:  28,
                  borderRadius:   12,
                  background:     "var(--siam)",
                  color:          "white",
                  border:         "none",
                  cursor:         "pointer",
                  fontFamily:     FD,
                  fontSize:       15,
                  letterSpacing:  "0.06em",
                  textTransform:  "uppercase",
                }}
              >
                <IcoPlay /> Lancer une séance
              </motion.button>
            </motion.div>
          ) : (
            grouped.map((group, gi) => (
              <motion.div key={group.key} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                {/* Sticky month header */}
                <div style={{
                  position:     "sticky",
                  top:          0,
                  zIndex:       10,
                  background:   "var(--paper)",
                  padding:      "8px 0",
                  marginBottom: 8,
                  borderBottom: "1px solid var(--rule)",
                  display:      "flex",
                  alignItems:   "center",
                  gap:          8,
                }}>
                  <div style={{ fontFamily: FD, fontSize: 14, letterSpacing: "0.04em", color: "var(--ink-2)", textTransform: "uppercase" }}>
                    {group.label}
                  </div>
                  <div style={{ fontFamily: FN, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "var(--ink-4)", textTransform: "uppercase" }}>
                    · {group.items.length} combat{group.items.length > 1 ? "s" : ""}
                  </div>
                </div>

                {/* Session cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: gi < grouped.length - 1 ? 20 : 0 }}>
                  {group.items.map(({ s, combatN }, idx) => (
                    <SessionCard
                      key={s.id}
                      session={s}
                      index={idx}
                      combatN={combatN}
                      onTap={() => { setDetailSess(s); setDetailN(combatN) }}
                    />
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <Nav active="history" />

      <AnimatePresence>
        {detailSess && (
          <SessionDetail
            session={detailSess}
            combatN={detailN}
            onClose={() => setDetailSess(null)}
            onRedo={handleRedo}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
