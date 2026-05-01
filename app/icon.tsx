import { ImageResponse } from "next/og"

export const size         = { width: 32, height: 32 }
export const contentType  = "image/png"

/* Favicon 32×32 — utilisé par les navigateurs desktop */
export default function Icon() {
  return new ImageResponse(
    <div style={{
      background:     "#0A0A0A",
      width:          "100%",
      height:         "100%",
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
      borderRadius:   "22%",
    }}>
      <div style={{
        background:     "#DC2626",
        width:          "80%",
        height:         "80%",
        borderRadius:   "16%",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        color:          "white",
        fontSize:       12,
        fontWeight:     900,
        fontFamily:     "sans-serif",
        letterSpacing:  -1,
      }}>
        DT
      </div>
    </div>,
    { ...size }
  )
}
