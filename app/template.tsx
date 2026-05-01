"use client"

import { motion, useReducedMotion } from "framer-motion"

/* ── Template Next.js App Router
   Contrairement à layout.tsx, template.tsx se re-rend à chaque navigation.
   Il fournit la transition de page (fade-in) sans rompre le layout.     */

export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: "100%" }}
    >
      {children}
    </motion.div>
  )
}
