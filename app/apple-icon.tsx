import { ImageResponse } from "next/og"

export const size        = { width: 180, height: 180 }
export const contentType = "image/png"

/* Apple Touch Icon 180×180 — fond siam rouge + initiales ClinchLab */
export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ background: "#DC2626", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "rgba(0,0,0,0.18)", width: "72%", height: "72%", borderRadius: "22%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 72, fontWeight: 900, fontFamily: "sans-serif", letterSpacing: -4 }}>
        CL
      </div>
    </div>,
    { ...size }
  )
}
