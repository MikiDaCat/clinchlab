import { ImageResponse } from "next/og"

export const runtime = "edge"

function DTIcon({ size }: { size: number }) {
  const r     = Math.round(size * 0.225)
  const inner = Math.round(size * 0.80)
  const ri    = Math.round(inner * 0.20)
  const fs    = Math.round(size * 0.38)
  return (
    <div style={{ background: "#0A0A0A", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: r }}>
      <div style={{ background: "#DC2626", width: inner, height: inner, borderRadius: ri, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: fs, fontWeight: 900, fontFamily: "sans-serif", letterSpacing: -4 }}>
        DT
      </div>
    </div>
  )
}

export async function GET() {
  return new ImageResponse(<DTIcon size={512} />, { width: 512, height: 512 })
}
