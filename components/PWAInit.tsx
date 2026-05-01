"use client"

import { useEffect } from "react"

/* Enregistre le service worker au mount.
   Silencieux si non supporté ou en erreur.        */
export default function PWAInit() {
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!("serviceWorker" in navigator)) return

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .catch(() => { /* SW non-critique, silencieux */ })
  }, [])

  return null
}
