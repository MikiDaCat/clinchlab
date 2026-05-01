import { ImageResponse } from "next/og"
import { readFileSync } from "fs"
import { join } from "path"

export const size        = { width: 512, height: 512 }
export const contentType = "image/png"

/* Favicon 512×512 — fond noir + liseré siam + dragon vs tigre */
export default async function Icon() {
  const buf     = readFileSync(join(process.cwd(), "public", "logo.png"))
  const logoSrc = `data:image/png;base64,${buf.toString("base64")}`
  return new ImageResponse(
    /* Outer = liseré rouge 12px */
    <div style={{ width: 512, height: 512, background: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Inner = fond noir + padding respiration */}
      <div style={{ width: 488, height: 488, background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", padding: 60 }}>
        <img src={logoSrc} alt="ClinchLab" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
    </div>,
    { ...size }
  )
}
