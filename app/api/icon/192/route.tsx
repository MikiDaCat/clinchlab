import { ImageResponse } from "next/og"
import { readFileSync } from "fs"
import { join } from "path"

let logoSrc = ""
try {
  const buf = readFileSync(join(process.cwd(), "public", "logo.png"))
  logoSrc = `data:image/png;base64,${buf.toString("base64")}`
} catch { /* fallback */ }

/* PWA Icon 192×192 — fond noir + liseré siam + dragon vs tigre */
export async function GET() {
  return new ImageResponse(
    <div style={{ width: 192, height: 192, background: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 172, height: 172, background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", padding: 22 }}>
        {logoSrc
          ? <img src={logoSrc} alt="ClinchLab" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          : <div style={{ color: "white", fontSize: 64, fontWeight: 900, fontFamily: "sans-serif" }}>CL</div>
        }
      </div>
    </div>,
    { width: 192, height: 192 }
  )
}
