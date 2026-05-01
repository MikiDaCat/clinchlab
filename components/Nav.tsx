"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, useReducedMotion } from "framer-motion"
import { Ico } from "@/lib/icons"

const ITEMS = [
  { key: "home",    label: "Séance",  href: "/",        Icon: Ico.home,    ariaLabel: "Séance du jour" },
  { key: "timer",   label: "Timer",   href: "/timer",   Icon: Ico.timer,   ariaLabel: "Timer libre"    },
  { key: "library", label: "Bibli",   href: "/library", Icon: Ico.book,    ariaLabel: "Bibliothèque"   },
  { key: "history", label: "Histo",   href: "/history", Icon: Ico.history, ariaLabel: "Historique"     },
]

export default function Nav({ active }: { active?: string }) {
  const pathname = usePathname()
  const current  = active ?? ITEMS.find(i => i.href === pathname)?.key ?? "home"
  const reduced  = useReducedMotion()

  return (
    <nav
      aria-label="Navigation principale"
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 430,
        padding: "0 12px 20px",
        background: "linear-gradient(to top, var(--paper) 60%, transparent)",
        zIndex: 100,
        pointerEvents: "none",
      }}
    >
      <div
        className="tmt-glass"
        style={{
          borderRadius: 26,
          border: "1px solid var(--rule)",
          display: "flex",
          padding: "5px",
          gap: 2,
          boxShadow: "var(--shadow-nav)",
          pointerEvents: "all",
        }}
      >
        {ITEMS.map(({ key, label, href, Icon, ariaLabel }) => {
          const isActive = key === current
          return (
            <Link
              key={key}
              href={href}
              aria-label={ariaLabel}
              aria-current={isActive ? "page" : undefined}
              style={{ flex: 1 }}
            >
              <motion.div
                whileTap={{ scale: 0.88 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", gap: 3, padding: "9px 4px",
                  borderRadius: 20, position: "relative", minHeight: 52,
                  overflow: "hidden", transition: "background 250ms var(--ease-out)",
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-bg"
                    style={{ position: "absolute", inset: 0, borderRadius: 20, background: "var(--paper-2)" }}
                    transition={
                      reduced
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 420, damping: 34 }
                    }
                  />
                )}

                <motion.span
                  style={{
                    position: "relative",
                    color: isActive ? "var(--flame)" : "var(--ink-3)",
                    lineHeight: 1,
                    transition: "color 200ms var(--ease-out)",
                  }}
                  animate={{ scale: isActive ? 1.08 : 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                >
                  <Icon />
                </motion.span>

                <span style={{
                  position: "relative",
                  fontSize: 11, fontWeight: 600, letterSpacing: "0.01em",
                  color: isActive ? "var(--ink)" : "var(--ink-4)",
                  transition: "color 200ms var(--ease-out)",
                }}>{label}</span>
              </motion.div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
