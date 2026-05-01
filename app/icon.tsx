import { ImageResponse } from "next/og"

export const size        = { width: 32, height: 32 }
export const contentType = "image/png"

/* Favicon 32×32 — C massif ClinchLab */
export default function Icon() {
  return new ImageResponse(
    <div style={{ background: "#0A0A0A", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg viewBox="0 0 512 512" width={29} height={29}>
        <path d="M 380 145 A 140 140 0 1 0 380 367" fill="none" stroke="#DC2626" strokeWidth="90" strokeLinecap="butt"/>
      </svg>
    </div>,
    { ...size }
  )
}
