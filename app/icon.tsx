import { ImageResponse } from "next/og"
import { readFileSync } from "fs"
import { join } from "path"

export const size        = { width: 512, height: 512 }
export const contentType = "image/png"

/* Favicon 512×512 — fond noir + liseré siam 4px uniforme */
export default async function Icon() {
  const buf     = readFileSync(join(process.cwd(), "public", "logo.png"))
  const logoSrc = `data:image/png;base64,${buf.toString("base64")}`
  return new ImageResponse(
    /* Outer = liseré rouge 4px via padding */
    <div style={{ width: 512, height: 512, background: "#DC2626", display: "flex", padding: 4, alignItems: "stretch" }}>
      {/* Inner = fond noir + logo centré */}
      <div style={{ flex: 1, background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", padding: 62 }}>
        <img src={logoSrc} alt="ClinchLab" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
    </div>,
    { ...size }
  )
}
