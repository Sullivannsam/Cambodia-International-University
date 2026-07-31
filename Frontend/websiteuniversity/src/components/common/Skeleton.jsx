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
