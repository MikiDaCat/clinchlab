"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

/* Typage manuel — beforeinstallprompt est non-standard */
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

const D = "var(--font-display), system-ui, sans-serif"
const M = "var(--font-mono), monospace"

function IcoDownload() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

export default function InstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed,   setDismissed]   = useState(false)
  const [installed,   setInstalled]   = useState(false)

  useEffect(() => {
    /* Vérifier si déjà installée (display: standalone) */
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true)
      return
    }

    /* Vérifier si déjà rejeté par l'utilisateur */
    if (localStorage.getItem("tmt-install-dismissed")) {
      setDismissed(true)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setPromptEvent(e as BeforeInstallPromptEvent)
    }
    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstall = async () => {
    if (!promptEvent) return
    await promptEvent.prompt()
    const { outcome } = await promptEvent.userChoice
    if (outcome === "accepted") setInstalled(true)
    setPromptEvent(null)
    setDismissed(true)
  }

  const handleDismiss = () => {
    localStorage.setItem("tmt-install-dismissed", "1")
    setDismissed(true)
    setPromptEvent(null)
  }

  const show = !!promptEvent && !dismissed && !installed

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          style={{
            position:  "fixed",
            bottom:    100,                /* au-dessus de la Nav */
            left:      "50%",
            transform: "translateX(-50%)",
            width:     "calc(100% - 32px)",
            maxWidth:  398,
            zIndex:    150,
            background:   "var(--card-2)",
            borderRadius: "var(--r-3)",
            border:       "1px solid var(--rule-2)",
            boxShadow:    "var(--shadow-lg)",
            padding:      "14px 16px",
            display:      "flex",
            alignItems:   "center",
            gap:          14,
          }}
        >
          {/* Logo */}
          <div style={{
            width: 40, height: 40, borderRadius: 12, flexShrink: 0,
            background: "#DC2626",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden",
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.webp" alt="" aria-hidden={true} style={{ width: "82%", height: "82%", objectFit: "contain" }} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: D, fontSize: 14, fontWeight: 700, color: "var(--ink)", marginBottom: 2 }}>
              Installer ClinchLab
            </div>
            <div style={{ fontSize: 12, color: "var(--ink-3)", fontFamily: M }}>
              Accès rapide · Hors ligne · Plein écran
            </div>
          </div>

          {/* Dismiss */}
          <button
            aria-label="Ignorer"
            onClick={handleDismiss}
            style={{
              background: "none", border: "none", color: "var(--ink-4)",
              cursor: "pointer", padding: 4, flexShrink: 0,
              fontSize: 18, lineHeight: 1,
            }}
          >
            ×
          </button>

          {/* Install */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handleInstall}
            aria-label="Installer l'application"
            style={{
              display:    "flex",
              alignItems: "center",
              gap:        6,
              padding:    "8px 14px",
              borderRadius: "var(--r-2)",
              background: "var(--flame)",
              color:      "white",
              border:     "none",
              cursor:     "pointer",
              fontFamily: D,
              fontSize:   13,
              fontWeight: 700,
              boxShadow:  "var(--glow-flame-sm)",
              flexShrink: 0,
            }}
          >
            <IcoDownload />
            Installer
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
