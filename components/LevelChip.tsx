import { LEVEL_STYLES } from "@/lib/data"

export default function LevelChip({ level }: { level: 1|2|3|4|5|6 }) {
  const s = LEVEL_STYLES[level as 1|2|3|4|5|6]
  if (!s) return null
  return (
    <span
      role="img"
      aria-label={`Niveau ${level}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 8px",
        height: 22,
        borderRadius: 6,
        background: s.bg,
        color: s.text,
        border: `1px solid ${s.ring}`,
        fontFamily: "var(--font-display), system-ui",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.04em",
        flexShrink: 0,
        whiteSpace: "nowrap",
      }}
    >
      N{level}
    </span>
  )
}
