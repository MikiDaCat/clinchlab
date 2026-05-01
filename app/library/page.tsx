"use client"

import { useState, useRef, useMemo, useCallback, useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence, useReducedMotion, useDragControls } from "framer-motion"
import { useRouter } from "next/navigation"
import Nav from "@/components/Nav"
import { COMBOS, GAMES, LEVEL_STYLES, type Combo, type Game, type ComboLevel } from "@/lib/data"

const D    = "var(--font-display)"
const N    = "var(--font-num)"
const U    = "var(--font-ui)"
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

function getSteps(c: Combo): string[] { return c.steps.map(s => s.title) }

/* ── Simple favorites hook ──────────────────────────────── */
function useFavorites(key: string) {
  const [favs, setFavs] = useState<string[]>(() => {
    if (typeof window === "undefined") return []
    try { return JSON.parse(localStorage.getItem(key) ?? "[]") } catch { return [] }
  })
  const toggle = useCallback((id: string) => {
    setFavs(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
      localStorage.setItem(key, JSON.stringify(next))
      return next
    })
  }, [key])
  return { favs, toggle }
}

/* ── Helpers ─────────────────────────────────────────────── */
function SectionDivider({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0" }}>
      <div style={{ flex: 1, height: 1, background: "var(--rule)" }} />
      <span style={{ fontFamily: N, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-4)" }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: "var(--rule)" }} />
    </div>
  )
}

const GAME_BADGE: Record<string, { bg: string; border: string; color: string; label: string }> = {
  jeu1:  { bg: "var(--siam-soft)",           border: "var(--siam-line)",              color: "var(--siam)",        label: "J1"  },
  jeu2:  { bg: "var(--jade-soft)",            border: "var(--jade-line)",              color: "var(--jade-pro)",    label: "J2"  },
  bonus: { bg: "rgba(251,191,36,0.12)",       border: "rgba(251,191,36,0.30)",         color: "var(--champion)",    label: "BON" },
}

/* ════════════════════════
   COMBO COMPONENTS
════════════════════════ */
function ComboCard({ combo, onTap, index }: { combo: Combo; onTap: () => void; index: number }) {
  const reduced = useReducedMotion()
  const s = LEVEL_STYLES[combo.level]
  return (
    <motion.div
      layout
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ delay: Math.min(index * 0.025, 0.18), duration: 0.28, ease: EASE }}
      whileTap={{ scale: 0.98 }}
      onClick={onTap}
      role="button" tabIndex={0}
      aria-label={`Fiche — ${combo.name}`}
      onKeyDown={e => (e.key === "Enter" || e.key === " ") && onTap()}
      style={{
        display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
        background: "var(--paper-3)", border: "1px solid var(--rule)", borderRadius: 10,
        cursor: "pointer", transition: "background 150ms ease",
      }}
    >
      {/* Level badge 44×44 */}
      <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 10, background: s.bg, border: `1px solid ${s.ring}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: D, fontSize: 16, fontWeight: 400, color: s.text }}>
        N{combo.level}
      </div>
      {/* Name */}
      <p style={{ flex: 1, fontFamily: U, fontSize: 13, fontWeight: 700, color: "var(--ink)", lineHeight: 1.35, margin: 0, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", textTransform: "uppercase", letterSpacing: "0.02em" } as React.CSSProperties}>
        {combo.name}
      </p>
      {/* ⓘ */}
      <div style={{ flexShrink: 0, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-4)" }}>
        <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
      </div>
    </motion.div>
  )
}

function ComboDetail({ combo, onClose, onUse, isFav, onFavToggle }: {
  combo: Combo; onClose: () => void; onUse: (c: Combo) => void; isFav: boolean; onFavToggle: () => void
}) {
  const reduced      = useReducedMotion()
  const dragControls = useDragControls()
  const steps        = getSteps(combo)
  const s            = LEVEL_STYLES[combo.level]

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", h)
    return () => window.removeEventListener("keydown", h)
  }, [onClose])

  if (typeof window === "undefined") return null
  return createPortal(
    <motion.div
      role="dialog" aria-modal="true" aria-label={combo.name}
      drag="y" dragControls={dragControls} dragListener={false}
      dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.3 }}
      onDragEnd={(_, info) => { if (info.offset.y > 80 || info.velocity.y > 400) onClose() }}
      initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }}
      transition={reduced ? { duration: 0 } : { type: "tween", duration: 0.3, ease: EASE }}
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 400, background: "var(--paper-2)", display: "flex", flexDirection: "column" }}
    >
      {/* Header */}
      <div onPointerDown={e => dragControls.start(e)}
        style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)", flexShrink: 0, touchAction: "none", cursor: "grab", borderBottom: "1px solid var(--rule)" }}
      >
        <div style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, background: s.bg, border: `1px solid ${s.ring}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: D, fontSize: 16, color: s.text }}>
          N{combo.level}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: N, fontSize: 10, fontWeight: 700, color: "var(--ink-3)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 3 }}>
            Combo · {combo.steps.length} étapes
          </div>
          <div style={{ fontFamily: D, fontSize: 20, fontWeight: 400, color: "var(--ink)", letterSpacing: "0.02em", textTransform: "uppercase", lineHeight: 1.1, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
            {combo.name}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button onClick={e => { e.stopPropagation(); onFavToggle() }}
            aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
            style={{ width: 40, height: 40, borderRadius: "var(--r-2)", background: isFav ? "rgba(251,191,36,0.15)" : "var(--paper-3)", border: `1px solid ${isFav ? "rgba(251,191,36,0.40)" : "var(--rule)"}`, color: isFav ? "var(--champion)" : "var(--ink-4)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <svg viewBox="0 0 24 24" width={17} height={17} fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </button>
          <button className="tmt-iconbtn" aria-label="Fermer" onClick={onClose}>
            <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px calc(env(safe-area-inset-bottom, 0px) + 28px)" }}>
        <SectionDivider label="Décomposition" />
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          {steps.map((step, i) => (
            <motion.div key={i}
              initial={reduced ? false : { opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 + i * 0.05, duration: 0.25 }}
              style={{ display: "flex", alignItems: "center", gap: 14 }}
            >
              <span style={{ fontFamily: D, fontSize: 28, fontWeight: 400, color: "var(--siam)", width: 44, textAlign: "right", flexShrink: 0, lineHeight: 1, textShadow: "0 0 12px rgba(220,38,38,0.30)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ fontFamily: U, fontSize: 14, fontWeight: 600, color: "var(--ink)", textTransform: "uppercase", letterSpacing: "0.03em", lineHeight: 1.35 }}>
                {step}
              </span>
            </motion.div>
          ))}
        </div>

        <SectionDivider label="Points clés" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
          {combo.keyPoints.map((pt, i) => (
            <motion.div key={i}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12 + i * 0.04, duration: 0.22 }}
              style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
            >
              <span style={{ flexShrink: 0, marginTop: 2, fontFamily: U, fontSize: 15, fontWeight: 700, color: "var(--siam)", lineHeight: 1.35 }}>✓</span>
              <span style={{ fontFamily: U, fontSize: 14, color: "var(--ink-2)", lineHeight: 1.65 }}>{pt}</span>
            </motion.div>
          ))}
        </div>

        <motion.button className="tmt-btn flame lg" whileTap={{ scale: 0.97 }} onClick={() => onUse(combo)}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          Utiliser ce combo
        </motion.button>
      </div>
    </motion.div>,
    document.body
  )
}

/* ════════════════════════
   JEU COMPONENTS
════════════════════════ */
function GameCard({ game, onTap, index }: { game: Game; onTap: () => void; index: number }) {
  const reduced = useReducedMotion()
  const badge = GAME_BADGE[game.moment]
  return (
    <motion.div
      layout
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ delay: Math.min(index * 0.025, 0.18), duration: 0.28, ease: EASE }}
      whileTap={{ scale: 0.98 }}
      onClick={onTap}
      role="button" tabIndex={0}
      aria-label={`Fiche — ${game.name}`}
      onKeyDown={e => (e.key === "Enter" || e.key === " ") && onTap()}
      style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", background: "var(--paper-3)", border: "1px solid var(--rule)", borderRadius: 10, cursor: "pointer", transition: "background 150ms ease" }}
    >
      <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 10, background: badge.bg, border: `1px solid ${badge.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: N, fontSize: 13, fontWeight: 700, color: badge.color }}>
        {badge.label}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: U, fontSize: 13, fontWeight: 700, color: "var(--ink)", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.02em", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
          {game.name}
        </p>
        <p style={{ fontFamily: U, fontSize: 12, color: "var(--ink-3)", margin: 0, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
          {game.objective}
        </p>
      </div>
      <div style={{ flexShrink: 0, marginTop: 2, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-4)" }}>
        <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
      </div>
    </motion.div>
  )
}

function GameDetail({ game, onClose }: { game: Game; onClose: () => void }) {
  const reduced      = useReducedMotion()
  const dragControls = useDragControls()
  const badge        = GAME_BADGE[game.moment]

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", h)
    return () => window.removeEventListener("keydown", h)
  }, [onClose])

  if (typeof window === "undefined") return null
  return createPortal(
    <motion.div
      role="dialog" aria-modal="true" aria-label={game.name}
      drag="y" dragControls={dragControls} dragListener={false}
      dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.3 }}
      onDragEnd={(_, info) => { if (info.offset.y > 80 || info.velocity.y > 400) onClose() }}
      initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }}
      transition={reduced ? { duration: 0 } : { type: "tween", duration: 0.3, ease: EASE }}
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 400, background: "var(--paper-2)", display: "flex", flexDirection: "column" }}
    >
      {/* Header */}
      <div onPointerDown={e => dragControls.start(e)}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)", flexShrink: 0, touchAction: "none", cursor: "grab", borderBottom: "1px solid var(--rule)" }}
      >
        <div>
          <div style={{ fontFamily: N, fontSize: 10, fontWeight: 700, color: badge.color, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 4 }}>
            {game.moment === "jeu1" ? "Jeu 1 · Entrée" : game.moment === "jeu2" ? "Jeu 2 · Transition" : "Bonus"}
          </div>
          <div style={{ fontFamily: D, fontSize: 22, fontWeight: 400, color: "var(--ink)", letterSpacing: "0.03em", textTransform: "uppercase", lineHeight: 1.1, maxWidth: 260 }}>
            {game.name}
          </div>
        </div>
        <button className="tmt-iconbtn" aria-label="Fermer" onClick={onClose}>
          <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px calc(env(safe-area-inset-bottom, 0px) + 32px)" }}>
        <SectionDivider label="Déroulement" />
        <p style={{ fontFamily: U, fontSize: 15, color: "var(--ink-2)", lineHeight: 1.78, marginBottom: 24 }}>
          {game.description}
        </p>

        <SectionDivider label="Objectif technique" />
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="var(--siam)" strokeWidth="1.8" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2 }}>
            <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2" fill="var(--siam)"/>
          </svg>
          <p style={{ fontFamily: U, fontSize: 15, fontWeight: 600, color: "var(--ink)", lineHeight: 1.6, margin: 0 }}>
            {game.objective}
          </p>
        </div>
      </div>
    </motion.div>,
    document.body
  )
}

/* ════════════════════════
   PAGE
════════════════════════ */
export default function LibraryPage() {
  const router  = useRouter()
  const reduced = useReducedMotion()

  const [tab,           setTab]           = useState<"combos" | "jeux">("combos")
  const [levelFilter,   setLevelFilter]   = useState<ComboLevel | null>(null)
  const [searchInput,   setSearchInput]   = useState("")
  const [searchQuery,   setSearchQuery]   = useState("")
  const [detailCombo,   setDetailCombo]   = useState<Combo | null>(null)
  const [gameSearch,    setGameSearch]    = useState("")
  const [detailGame,    setDetailGame]    = useState<Game | null>(null)
  const { favs: favIds, toggle: toggleFav } = useFavorites("tmt-fav-combos")

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleSearch = useCallback((val: string) => {
    setSearchInput(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setSearchQuery(val), 180)
  }, [])

  const filteredCombos = useMemo(() => {
    return COMBOS.filter(c => {
      if (levelFilter && c.level !== levelFilter) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return c.name.toLowerCase().includes(q) || c.keyPoints.some(k => k.toLowerCase().includes(q))
      }
      return true
    }).sort((a, b) => a.level - b.level)
  }, [levelFilter, searchQuery])

  const filteredGames = useMemo(() => {
    if (!gameSearch.trim()) return GAMES
    const q = gameSearch.toLowerCase()
    return GAMES.filter(g => g.name.toLowerCase().includes(q) || g.objective.toLowerCase().includes(q))
  }, [gameSearch])

  const handleUseCombo = (c: Combo) => {
    setDetailCombo(null); router.push(`/setup?comboId=${c.id}`)
  }

  return (
    <div className="tmt-screen" style={{ background: "var(--paper)" }}>

      {/* Header */}
      <div style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)", padding: "14px 20px 0", textAlign: "center", flexShrink: 0 }}>
        <h1 style={{ fontFamily: D, fontSize: "clamp(28px, 7vw, 38px)", fontWeight: 400, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--ink)", lineHeight: 1, marginBottom: 4 }}>
          Bibliothèque
        </h1>
        <p style={{ fontFamily: U, fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-3)" }}>
          Encyclopédie technique
        </p>
      </div>

      {/* Sticky tabs */}
      <div role="tablist" aria-label="Contenu de la bibliothèque" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", flexShrink: 0, borderBottom: "2px solid var(--rule)", marginTop: 14, position: "sticky", top: 0, zIndex: 20, background: "var(--paper)" }}>
        {(["combos", "jeux"] as const).map(t => {
          const isActive = tab === t
          return (
            <motion.button key={t} role="tab" aria-selected={isActive} onClick={() => setTab(t)} whileTap={{ scale: 0.97 }}
              style={{ height: 52, fontFamily: D, fontSize: 17, fontWeight: 400, letterSpacing: "0.04em", textTransform: "uppercase", color: isActive ? "var(--ink)" : "var(--ink-3)", background: isActive ? "var(--paper-3)" : "transparent", border: "none", borderBottom: isActive ? "2px solid var(--siam)" : "2px solid transparent", marginBottom: -2, cursor: "pointer", transition: "all 200ms ease" }}
            >
              {t === "combos" ? `Combos (${COMBOS.length})` : `Jeux (${GAMES.length})`}
            </motion.button>
          )
        })}
      </div>

      {/* Scroll content */}
      <div className="tmt-scroll" style={{ padding: "0 20px 110px" }}>

        {tab === "combos" ? (
          <>
            {/* Search */}
            <div style={{ position: "relative", padding: "14px 0 10px" }}>
              <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--ink-3)", pointerEvents: "none" }}>
                <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
              </div>
              <input type="search" className="tmt-input" value={searchInput} onChange={e => handleSearch(e.target.value)}
                placeholder="Rechercher un combo…" aria-label="Rechercher dans les combos"
                style={{ paddingLeft: 38, paddingRight: searchInput ? 40 : 16, fontSize: 14 }}
              />
              <AnimatePresence>
                {searchInput && (
                  <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.12 }}
                    aria-label="Effacer" onClick={() => handleSearch("")}
                    style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "var(--paper-4)", border: "none", borderRadius: 6, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ink-3)" }}
                  >
                    <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Level filter */}
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 12, scrollbarWidth: "none" }}>
              {[null, 1, 2, 3, 4, 5, 6].map(n => {
                const isAll = n === null
                const isOn  = isAll ? !levelFilter : levelFilter === n
                const s     = !isAll ? LEVEL_STYLES[n as ComboLevel] : null
                const count = !isAll ? COMBOS.filter(c => c.level === n).length : COMBOS.length
                return (
                  <motion.button key={n ?? "all"} whileTap={{ scale: 0.92 }}
                    onClick={() => setLevelFilter(isAll ? null : levelFilter === n ? null : n as ComboLevel)}
                    aria-pressed={isOn}
                    style={{
                      flexShrink: 0, height: 36, padding: "0 14px", borderRadius: 999,
                      background: isOn ? (isAll ? "var(--siam-soft)" : s!.bg) : "var(--paper-3)",
                      border: `1px solid ${isOn ? (isAll ? "var(--siam-line)" : s!.ring) : "var(--rule)"}`,
                      color: isOn ? (isAll ? "var(--siam)" : s!.text) : "var(--ink-3)",
                      fontFamily: N, fontSize: 12, fontWeight: 700, cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 6, transition: "all 180ms ease",
                    }}
                  >
                    {isAll ? "Tous" : `N${n}`}
                    <span style={{ opacity: 0.65, fontSize: 10 }}>{count}</span>
                  </motion.button>
                )
              })}
            </div>

            <SectionDivider label={levelFilter ? `${filteredCombos.length} combos · Niveau ${levelFilter}` : `${filteredCombos.length} combos · 6 niveaux`} />

            <AnimatePresence mode="popLayout">
              {filteredCombos.length === 0 ? (
                <motion.div key="empty" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ textAlign: "center", padding: "48px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}
                >
                  <div style={{ fontFamily: D, fontSize: 56, color: "var(--siam)", textShadow: "0 0 30px rgba(220,38,38,0.3)" }}>?</div>
                  <p style={{ fontFamily: U, fontSize: 16, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>Aucun combo trouvé</p>
                  <p style={{ fontFamily: U, fontSize: 13, color: "var(--ink-3)", lineHeight: 1.55 }}>
                    {searchQuery ? `Aucun résultat pour "${searchQuery}".` : "Ces filtres ne correspondent à rien."}
                  </p>
                  <motion.button className="tmt-btn ghost" whileTap={{ scale: 0.96 }}
                    onClick={() => { setLevelFilter(null); handleSearch("") }} style={{ maxWidth: 200 }}
                  >Réinitialiser</motion.button>
                </motion.div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {filteredCombos.map((c, idx) => (
                    <ComboCard key={c.id} combo={c} index={idx} onTap={() => setDetailCombo(c)} />
                  ))}
                </div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <>
            {/* Jeux search */}
            <div style={{ position: "relative", padding: "14px 0 10px" }}>
              <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--ink-3)", pointerEvents: "none" }}>
                <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
              </div>
              <input type="search" className="tmt-input" value={gameSearch} onChange={e => setGameSearch(e.target.value)}
                placeholder="Rechercher un jeu…" aria-label="Rechercher dans les jeux"
                style={{ paddingLeft: 38, fontSize: 14 }}
              />
            </div>

            <SectionDivider label={`${filteredGames.length} jeux · J1 / J2 / Bonus`} />

            <AnimatePresence mode="popLayout">
              {filteredGames.length === 0 ? (
                <motion.div key="empty-g" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ textAlign: "center", padding: "48px 20px" }}
                >
                  <p style={{ fontFamily: U, fontSize: 16, fontWeight: 700, color: "var(--ink)" }}>Aucun jeu trouvé</p>
                </motion.div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {filteredGames.map((g, idx) => (
                    <GameCard key={g.id} game={g} index={idx} onTap={() => setDetailGame(g)} />
                  ))}
                </div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      <Nav active="library" />

      <AnimatePresence>
        {detailCombo && (
          <ComboDetail combo={detailCombo} onClose={() => setDetailCombo(null)} onUse={handleUseCombo}
            isFav={favIds.includes(detailCombo.id)} onFavToggle={() => toggleFav(detailCombo.id)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {detailGame && <GameDetail game={detailGame} onClose={() => setDetailGame(null)} />}
      </AnimatePresence>
    </div>
  )
}
