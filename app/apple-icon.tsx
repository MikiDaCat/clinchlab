import { ImageResponse } from "next/og"

export const size        = { width: 180, height: 180 }
export const contentType = "image/png"

/* Apple Touch Icon 180×180 — requis pour iOS homescreen */
export default function AppleIcon() {
  return new ImageResponse(
    <div style={{
      background:     "#0A0A0A",
      width:          "100%",
      height:         "100%",
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
    }}>
      <div style={{
        background:     "#DC2626",
        width:          "80%",
        height:         "80%",
        borderRadius:   "22%",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        color:          "white",
        fontSize:       72,
        fontWeight:     900,
        fontFamily:     "sans-serif",
        letterSpacing:  -4,
      }}>
        DT
      </div>
    </div>,
    { ...size }
  )
}
