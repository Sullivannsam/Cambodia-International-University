export default function AboutUs() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", background: "linear-gradient(135deg, #f8fafc, #e2e8f0)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px" }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, color: "#1e293b", marginBottom: 12, textAlign: "center" }}>
          About Cambodia International University
        </h1>
        <p style={{ fontSize: 16, color: "#64748b", textAlign: "center", marginBottom: 48, lineHeight: 1.7 }}>
          Empowering the next generation of leaders through quality education and innovation since 2005.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 48 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 28, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#2563eb", marginBottom: 12 }}>Our Mission</h3>
            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7 }}>
              To provide accessible, affordable, and high-quality higher education that prepares students 
              to become competent professionals and responsible citizens in a global society.
            </p>
          </div>
          <div style={{ background: "white", borderRadius: 16, padding: 28, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#2563eb", marginBottom: 12 }}>Our Vision</h3>
            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7 }}>
              To be a leading university in the region, recognized for academic excellence, research innovation, 
              and community engagement.
            </p>
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 16, padding: 32, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: "#1e293b", marginBottom: 16 }}>Why Choose CIU?</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              ["🎓", "Experienced Faculty", "Learn from industry experts and experienced professors."],
              ["🌍", "Global Network", "Connect with students and partners worldwide."],
              ["💻", "Modern Facilities", "State-of-the-art labs, libraries, and online resources."],
              ["🏆", "Accredited Programs", "All programs are recognized by the Ministry of Education."],
            ].map(([icon, title, desc]) => (
              <div key={title} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: 16, background: "#f8fafc", borderRadius: 12 }}>
                <span style={{ fontSize: 24 }}>{icon}</span>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", marginBottom: 4 }}>{title}</h4>
                  <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 48, color: "#94a3b8", fontSize: 13 }}>
          <p>Phnom Penh, Cambodia | info@ciu.edu.kh | +855 (0) 23 999 999</p>
        </div>
      </div>
    </div>
  );
}