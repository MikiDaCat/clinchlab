"use client"

export default function SafeAreaTopMask() {
  return (
    <div
      aria-hidden="true"
      style={{
        position:        "fixed",
        top:             0,
        left:            0,
        right:           0,
        height:          "max(env(safe-area-inset-top, 0px), 50px)",
        backgroundColor: "#0A0A0A",
        zIndex:          9999,
        pointerEvents:   "none",
      }}
    />
  )
}
