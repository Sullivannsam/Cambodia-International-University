export default function Skeleton({ width = "100%", height = 16, radius = 8, style, className }) {
  return (
    <div
      className={className || "sk"}
      style={{
        width,
        height,
        borderRadius: radius,
        background: "linear-gradient(90deg, var(--hover-bg) 25%, var(--border) 50%, var(--hover-bg) 75%)",
        backgroundSize: "200% 100%",
        animation: "skShimmer 1.4s ease-in-out infinite",
        ...style,
      }}
    >
      <style>{`
        @keyframes skShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", background: "var(--bg-card)" }}>
      <Skeleton height={160} radius={0} />
      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        <Skeleton height={16} width="60%" />
        <Skeleton height={13} />
        <Skeleton height={13} width="80%" />
        <Skeleton height={32} radius={8} />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}

// Drop-in placeholder for a data table while it loads — pass the same
// number of columns as the real <thead> so the shimmering bars line up.
export function SkeletonTable({ rows = 5, cols = 5 }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <tbody>
        {Array.from({ length: rows }).map((_, r) => (
          <tr key={r}>
            {Array.from({ length: cols }).map((_, c) => (
              <td key={c} style={{ padding: "10px 12px" }}>
                <Skeleton height={13} width={c === 0 ? "70%" : "85%"} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Small inline placeholder for a stat/summary card while its number loads.
export function SkeletonStat() {
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 14, padding: 18, background: "var(--bg-card)", display: "flex", flexDirection: "column", gap: 10 }}>
      <Skeleton height={11} width="50%" />
      <Skeleton height={22} width="35%" />
    </div>
  );
}
