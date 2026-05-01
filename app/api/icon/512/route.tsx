import { ImageResponse } from "next/og"
import { readFileSync } from "fs"
import { join } from "path"

let logoSrc = ""
try {
  const buf = readFileSync(join(process.cwd(), "public", "logo.png"))
  logoSrc = `data:image/png;base64,${buf.toString("base64")}`
} catch { /* fallback */ }

/* PWA Icon 512×512 — fond noir + liseré siam 4px uniforme */
export async function GET() {
  return new ImageResponse(
    <div style={{ width: 512, height: 512, background: "#DC2626", display: "flex", padding: 4, alignItems: "stretch" }}>
      <div style={{ flex: 1, background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", padding: 62 }}>
        {logoSrc
          ? <img src={logoSrc} alt="ClinchLab" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          : <div style={{ color: "white", fontSize: 200, fontWeight: 900, fontFamily: "sans-serif" }}>CL</div>
        }
      </div>
    </div>,
    { width: 512, height: 512 }
  )
}
