import { Ico } from "@/lib/icons"

export default function StatusBar({ time = "9:41" }: { time?: string }) {
  return (
    <div
      aria-hidden="true"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 24px 4px",
        flexShrink: 0,
      }}
    >
      <span style={{
        fontFamily: "var(--font-mono), monospace",
        fontSize: 15,
        fontWeight: 600,
        letterSpacing: "-0.02em",
      }}>{time}</span>

      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        color: "var(--ink-2)",
      }}>
        <svg viewBox="0 0 24 24" width={15} height={15} fill="currentColor" aria-hidden="true">
          <path d="M1.5 8.5a13 13 0 0 1 21 0M5 12a10 10 0 0 1 14 0M8.5 15.5a6 6 0 0 1 7 0M12 19h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        </svg>
        <Ico.battery />
      </div>
    </div>
  )
}
