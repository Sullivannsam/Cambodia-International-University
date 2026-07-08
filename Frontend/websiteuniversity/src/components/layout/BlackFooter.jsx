export default function BlackFooter() {
  return (
    <footer style={{ background: "#0f172a", padding: "28px 32px", display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "space-between", alignItems: "center" }}>
      <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, margin: 0 }}>
        This contact provided by our University. 🇰🇭
      </p>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 6, fontWeight: 600 }}>Contact us for more information</p>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, margin: 0 }}>✉ Email: CIU.edu.info@gmail.com</p>
      </div>
      <div style={{ textAlign: "right" }}>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 6, fontWeight: 600 }}>Developer System</p>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, margin: 0 }}>⊙ Github: Sullivann Sam.github</p>
      </div>
    </footer>
  );
}