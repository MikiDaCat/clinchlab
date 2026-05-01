import { ImageResponse } from "next/og"
import { readFileSync } from "fs"
import { join } from "path"

export const size        = { width: 180, height: 180 }
export const contentType = "image/png"

/* Apple Touch Icon 180×180 — fond noir + liseré siam 2px uniforme */
export default async function AppleIcon() {
  const buf     = readFileSync(join(process.cwd(), "public", "logo.png"))
  const logoSrc = `data:image/png;base64,${buf.toString("base64")}`
  return new ImageResponse(
    /* Outer = liseré rouge 2px via padding */
    <div style={{ width: 180, height: 180, background: "#DC2626", display: "flex", padding: 2, alignItems: "stretch" }}>
      {/* Inner = fond noir + logo centré */}
      <div style={{ flex: 1, background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", padding: 22 }}>
        <img src={logoSrc} alt="ClinchLab" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
    </div>,
    { ...size }
  )
}
