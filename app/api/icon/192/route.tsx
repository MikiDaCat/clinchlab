import { ImageResponse } from "next/og"
import { readFileSync } from "fs"
import { join } from "path"

let logoSrc = ""
try {
  const buf = readFileSync(join(process.cwd(), "public", "logo.png"))
  logoSrc = `data:image/png;base64,${buf.toString("base64")}`
} catch { /* fallback */ }

/* PWA Icon 192×192 — fond noir + liseré siam 2px uniforme */
export async function GET() {
  return new ImageResponse(
    <div style={{ width: 192, height: 192, background: "#DC2626", display: "flex", padding: 2, alignItems: "stretch" }}>
      <div style={{ flex: 1, background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        {logoSrc
          ? <img src={logoSrc} alt="ClinchLab" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          : <div style={{ color: "white", fontSize: 64, fontWeight: 900, fontFamily: "sans-serif" }}>CL</div>
        }
      </div>
    </div>,
    { width: 192, height: 192 }
  )
}
