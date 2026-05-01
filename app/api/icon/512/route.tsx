import { ImageResponse } from "next/og"
import { readFileSync } from "fs"
import { join } from "path"

/* Logo chargé une fois au démarrage du module (Node.js runtime) */
let logoB64 = ""
try {
  const buf = readFileSync(join(process.cwd(), "public", "logo.webp"))
  logoB64 = `data:image/webp;base64,${buf.toString("base64")}`
} catch { /* fallback texte si fichier absent */ }

export async function GET() {
  return new ImageResponse(
    <div style={{ width: 512, height: 512, background: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        width: "78%", height: "78%",
        backgroundImage: logoB64 ? `url('${logoB64}')` : "none",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "white", fontSize: 200, fontWeight: 900, fontFamily: "sans-serif",
      }}>
        {!logoB64 && "CL"}
      </div>
    </div>,
    { width: 512, height: 512 }
  )
}
