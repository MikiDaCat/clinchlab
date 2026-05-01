import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  return new ImageResponse(
    <div style={{ background: "#0A0A0A", width: 512, height: 512, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg viewBox="0 0 512 512" width={420} height={420}>
        <path d="M 380 145 A 140 140 0 1 0 380 367" fill="none" stroke="#DC2626" strokeWidth="90" strokeLinecap="butt"/>
        <line x1="180" y1="438" x2="332" y2="438" stroke="#FBBF24" strokeWidth="8" strokeLinecap="round"/>
      </svg>
    </div>,
    { width: 512, height: 512 }
  )
}
