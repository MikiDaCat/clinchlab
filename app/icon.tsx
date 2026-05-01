import { ImageResponse } from "next/og"
import { readFileSync } from "fs"
import { join } from "path"

export const size        = { width: 512, height: 512 }
export const contentType = "image/png"

/* Favicon 512×512 — dragon vs tigre sur fond siam */
export default async function Icon() {
  const buf     = readFileSync(join(process.cwd(), "public", "logo.png"))
  const logoSrc = `data:image/png;base64,${buf.toString("base64")}`
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", background: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center", padding: "12%" }}>
      <img src={logoSrc} alt="ClinchLab" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    </div>,
    { ...size }
  )
}
