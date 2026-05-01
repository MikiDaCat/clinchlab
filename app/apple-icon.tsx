import { ImageResponse } from "next/og"

export const size        = { width: 180, height: 180 }
export const contentType = "image/png"

/* Apple Touch Icon 180×180 — C massif ClinchLab + accent or */
export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ background: "#0A0A0A", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg viewBox="0 0 512 512" width={148} height={148}>
        <path d="M 380 145 A 140 140 0 1 0 380 367" fill="none" stroke="#DC2626" strokeWidth="90" strokeLinecap="butt"/>
        <line x1="180" y1="438" x2="332" y2="438" stroke="#FBBF24" strokeWidth="8" strokeLinecap="round"/>
      </svg>
    </div>,
    { ...size }
  )
}
