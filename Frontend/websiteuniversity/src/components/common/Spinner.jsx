export default function Spinner({ text = "Loading..." }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.4)",
      backdropFilter: "blur(4px)",
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: "50%",
        border: "4px solid rgba(255,255,255,0.2)",
        borderTopColor: "white",
        animation: "spin 0.7s linear infinite",
      }} />
      <p style={{ color: "white", fontSize: 15, marginTop: 16, fontWeight: 500 }}>
        {text}
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}
