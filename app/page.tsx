"use client"

import { useState, useEffect } from "react"
import { motion, useReducedMotion } from "framer-motion"
import Link from "next/link"
import Nav from "@/components/Nav"
import LevelChip from "@/components/LevelChip"
import { PHASES } from "@/lib/data"
import { useCompletedSessions } from "@/hooks/useCompletedSessions"

const D = "var(--font-display)"
const N = "var(--font-num)"
const U = "var(--font-ui)"
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

function relativeDate(isoDate: string): string {
  const diff = Math.round((Date.now() - new Date(isoDate + "T12:00:00").getTime()) / 86_400_000)
  if (diff === 0) return "Aujourd'hui"
  if (diff === 1) return "Hier"
  if (diff < 7)  return `${diff}j`
  return `${Math.round(diff / 7)} sem`
}

function Divider({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <div style={{ flex: 1, height: 1, background: "var(--rule)" }} />
      <span style={{ fontFamily: U, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-4)" }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: "var(--rule)" }} />
    </div>
  )
}

const TITLE_WORDS = ["CLINCHLAB"]

export default function Home() {
  const reduced = useReducedMotion()
  const { sessions } = useCompletedSessions()
  const lastSession = sessions[0] ?? null

  const [activePhaseIdx, setActivePhaseIdx] = useState(-1)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("tmt-active-session")
      if (!raw) return
      const snap = JSON.parse(raw) as { phaseIndex: number; savedAt: number }
      if (Date.now() - snap.savedAt < 30 * 60 * 1000) setActivePhaseIdx(snap.phaseIndex)
    } catch { }
    /* Verrou portrait — tentative Android/Chrome PWA */
    try {
      const so = (screen as Screen & { orientation?: { lock?: (o: string) => Promise<void> } }).orientation
      so?.lock?.("portrait").catch(() => {})
    } catch { }
  }, [])

  return (
    <div className="tmt-screen" style={{ background: "var(--paper)" }}>

      <div className="tmt-scroll" style={{ padding: "0 20px 120px" }}>

        {/* ── HERO */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 20, paddingBottom: 28, textAlign: "center" }}>

          {/* Logo */}
          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.72, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.65, ease: EASE }}
            style={{ width: 180, height: 180, marginBottom: 18, flexShrink: 0 }}
          >
            <img src="/logo.webp" alt="DT Muay Siam" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </motion.div>

          {/* "DT MUAY SIAM" — chaque mot ne se coupe jamais */}
          <h1
            aria-label="ClinchLab"
            style={{
              margin:         "0 0 8px",
              lineHeight:     0.95,
              display:        "flex",
              flexWrap:       "wrap",
              justifyContent: "center",
              gap:            "0.24em",
            }}
          >
            {TITLE_WORDS.map((word, wi) => {
              const offset      = TITLE_WORDS.slice(0, wi).join("").length
              const isLastWord  = wi === TITLE_WORDS.length - 1
              return (
                <span key={wi} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
                  {word.split("").map((char, ci) => {
                    const isLastChar = isLastWord && ci === word.length - 1
                    return (
                      <motion.span
                        key={ci}
                        initial={reduced ? false : { opacity: 0, y: 28, filter: "blur(6px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ delay: 0.35 + (offset + ci) * 0.05, duration: 0.32, ease: EASE }}
                        style={{
                          display:       "inline-block",
                          fontFamily:    D,
                          fontSize:      "clamp(48px, 12vw, 80px)",
                          fontWeight:    400,
                          letterSpacing: "-0.02em",
                          color:         isLastChar ? "var(--siam)" : "var(--ink)",
                          textShadow:    isLastChar ? "0 0 30px rgba(220,38,38,0.55)" : "none",
                        }}
                      >
                        {char}
                      </motion.span>
                    )
                  })}
                </span>
              )
            })}
          </h1>

          {/* Sous-titre */}
          <motion.p
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            style={{ fontFamily: U, fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 28 }}
          >
            DT Muay Siam Edition · Enfants 6-10
          </motion.p>

          {/* CTA — Reprendre si session active, sinon Configurer */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.42, ease: EASE }}
            style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}
          >
            {activePhaseIdx >= 0 && (
              <Link href="/run">
                <motion.button
                  whileTap={reduced ? {} : { scale: 0.95 }}
                  style={{
                    width: "100%", minHeight: 66, borderRadius: 12,
                    background: "var(--frost)", border: "none", color: "#050508",
                    fontFamily: U, fontSize: 18, fontWeight: 700,
                    letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    boxShadow: "0 0 32px oklch(0.65 0.18 225 / 0.45)",
                  }}
                >
                  <svg viewBox="0 0 24 24" width={22} height={22} fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
                  Reprendre la séance
                </motion.button>
              </Link>
            )}
            <Link href="/setup">
              <motion.button
                whileHover={reduced ? {} : { scale: 1.025, boxShadow: "0 0 64px rgba(220,38,38,0.60)" }}
                whileTap={reduced ? {} : { scale: 0.95 }}
                style={{
                  width: "100%", minHeight: activePhaseIdx >= 0 ? 52 : 66, borderRadius: 12,
                  background: activePhaseIdx >= 0 ? "transparent" : "var(--siam)",
                  border: activePhaseIdx >= 0 ? "1px solid var(--rule-2)" : "none",
                  color: activePhaseIdx >= 0 ? "var(--ink-2)" : "white",
                  fontFamily: U, fontSize: activePhaseIdx >= 0 ? 15 : 18, fontWeight: 700,
                  letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  boxShadow: activePhaseIdx >= 0 ? "none" : "0 0 40px rgba(220,38,38,0.42)",
                  transition: "box-shadow 200ms ease",
                }}
              >
                <svg viewBox="0 0 24 24" width={activePhaseIdx >= 0 ? 18 : 22} height={activePhaseIdx >= 0 ? 18 : 22} fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
                {activePhaseIdx >= 0 ? "Nouvelle séance" : "Configurer la séance"}
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* ── DERNIÈRE SÉANCE */}
        {lastSession && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.45, duration: 0.38, ease: EASE }}
            style={{ marginBottom: 24 }}
          >
            <Divider label="Dernière séance" />

            <div style={{ background: "var(--paper-3)", border: "1px solid var(--rule)", borderRadius: 14, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontFamily: D, fontSize: 28, color: "var(--ink)", lineHeight: 1 }}>
                  {relativeDate(lastSession.isoDate)}
                </span>
                <LevelChip level={lastSession.lvl} />
              </div>

              <p style={{
                fontFamily: U, fontSize: 14, fontWeight: 600,
                color: "var(--ink-2)", lineHeight: 1.45, marginBottom: 10,
                overflow: "hidden", display: "-webkit-box",
                WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
              } as React.CSSProperties}>
                {lastSession.combo}
              </p>

              <div style={{ display: "flex", gap: 8, fontSize: 13, fontFamily: N, fontWeight: 700, color: "var(--ink-3)", marginBottom: 16 }}>
                <span>{lastSession.dur}</span>
                <span>·</span>
                <span>{lastSession.rounds} rounds</span>
              </div>

              <Link href="/history">
                <motion.span
                  whileHover={reduced ? {} : { x: 4 }}
                  style={{ fontFamily: U, fontSize: 13, fontWeight: 600, color: "var(--siam)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}
                >
                  Voir l&apos;historique →
                </motion.span>
              </Link>
            </div>
          </motion.div>
        )}

        {/* ── STRUCTURE DU JOUR */}
        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: lastSession ? 1.75 : 1.45, duration: 0.4 }}
        >
          <Divider label="Structure du jour" />

          <div style={{ background: "var(--paper-3)", border: "1px solid var(--rule)", borderRadius: 14, overflow: "hidden" }}>
            {PHASES.map((p, i) => {
              const isActive = i === activePhaseIdx
              const d = (lastSession ? 1.9 : 1.6) + i * 0.055
              return (
                <motion.div
                  key={p.key}
                  initial={reduced ? false : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: d, duration: 0.28, ease: EASE }}
                  style={{
                    display:      "flex",
                    alignItems:   "center",
                    gap:          14,
                    padding:      "11px 18px",
                    background:   isActive ? "var(--siam-soft)" : "transparent",
                    borderBottom: i < PHASES.length - 1 ? "1px solid var(--rule)" : "none",
                    transition:   "background 300ms ease",
                  }}
                >
                  <span style={{
                    fontFamily: D, fontSize: 20,
                    color:      isActive ? "var(--siam)" : "var(--ink-4)",
                    width: 32, textAlign: "right", flexShrink: 0, lineHeight: 1,
                    textShadow: isActive ? "0 0 16px rgba(220,38,38,0.5)" : "none",
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span style={{
                    flex: 1, fontFamily: U, fontSize: 13,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "var(--ink)" : "var(--ink-2)",
                    textTransform: "uppercase", letterSpacing: "0.05em",
                  }}>
                    {p.name}
                  </span>

                  <span style={{
                    fontFamily: N, fontSize: 12, fontWeight: 700,
                    color: isActive ? "var(--siam)" : "var(--ink-4)",
                    flexShrink: 0, letterSpacing: "0.02em",
                  }}>
                    {p.short}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>

      <Nav active="home" />
    </div>
  )
}
