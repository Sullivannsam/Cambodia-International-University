import { useState } from "react";

// ── DATA ──────────────────────────────────────────────────────────────────────
const courses = [
  {
    id: 1,
    title: "Computer Science",
    category: "Technology",
    desc: "Computer Science explores computing fundamentals, programming, and problem-solving — preparing students for software development, data-driven decision-making, and innovative tech careers. Enroll to deepen your skills.",
    bg: "linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)",
    accent: "#00d4ff",
    icon: "💻",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80",
  },
  {
    id: 2,
    title: "Cyber Security",
    category: "Security",
    desc: "Computer Science explores computing fundamentals, programming, and problem-solving — preparing students for software development, data-driven decision-making, and innovative tech careers. Enroll to deepen your skills.",
    bg: "linear-gradient(135deg,#0d1b2a 0%,#1b4332 50%,#00b4d8 100%)",
    accent: "#00f5d4",
    icon: "🛡️",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80",
  },
  {
    id: 3,
    title: "Reverse Engineering",
    category: "Security",
    desc: "Computer Science explores computing fundamentals, programming, and problem-solving — preparing students for software development, data-driven decision-making, and innovative tech careers. Enroll to deepen your skills.",
    bg: "linear-gradient(135deg,#10002b 0%,#3c096c 50%,#5a189a 100%)",
    accent: "#e040fb",
    icon: "🔬",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80",
  },
  {
    id: 4,
    title: "White Hat Hacker",
    category: "Security",
    desc: "Computer Science explores computing fundamentals, programming, and problem-solving — preparing students for software development, data-driven decision-making, and innovative tech careers. Enroll to deepen your skills.",
    bg: "linear-gradient(135deg,#1c1c3a 0%,#2d2d6b 50%,#4444aa 100%)",
    accent: "#7c83fd",
    icon: "🤍",
    image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&q=80",
  },
  {
    id: 5,
    title: "Architecture Major",
    category: "Design",
    desc: "Computer Science explores computing fundamentals, programming, and problem-solving — preparing students for software development, data-driven decision-making, and innovative tech careers. Enroll to deepen your skills.",
    bg: "linear-gradient(135deg,#1a1200 0%,#3d2b00 50%,#6b4c00 100%)",
    accent: "#ffd60a",
    icon: "🏛️",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80",
  },
  {
    id: 6,
    title: "Electrical Engineer",
    category: "Engineering",
    desc: "Computer Science explores computing fundamentals, programming, and problem-solving — preparing students for software development, data-driven decision-making, and innovative tech careers. Enroll to deepen your skills.",
    bg: "linear-gradient(135deg,#003300 0%,#1a5c1a 50%,#2d8a2d 100%)",
    accent: "#39ff14",
    icon: "⚡",
    image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80",
  },
  {
    id: 7,
    title: "Software Development",
    category: "Technology",
    desc: "Computer Science explores computing fundamentals, programming, and problem-solving — preparing students for software development, data-driven decision-making, and innovative tech careers. Enroll to deepen your skills.",
    bg: "linear-gradient(135deg,#001233 0%,#023e8a 50%,#0077b6 100%)",
    accent: "#48cae4",
    icon: "🚀",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80",
  },
  {
    id: 8,
    title: "Mobile Development",
    category: "Technology",
    desc: "Computer Science explores computing fundamentals, programming, and problem-solving — preparing students for software development, data-driven decision-making, and innovative tech careers. Enroll to deepen your skills.",
    bg: "linear-gradient(135deg,#1a0533 0%,#4a0080 50%,#7b2fff 100%)",
    accent: "#ff6ef7",
    icon: "📱",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80",
  },
  {
    id: 9,
    title: "Civil Engineering",
    category: "Engineering",
    desc: "Computer Science explores computing fundamentals, programming, and problem-solving — preparing students for software development, data-driven decision-making, and innovative tech careers. Enroll to deepen your skills.",
    bg: "linear-gradient(135deg,#0a0a0a 0%,#1c2b3a 50%,#2e4057 100%)",
    accent: "#00b4d8",
    icon: "🏗️",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80",
  },
];


// ── COURSE CARD ───────────────────────────────────────────────────────────────
function CourseCard({ course }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 16, overflow: "hidden", background: course.bg,
        boxShadow: hovered ? `0 20px 48px rgba(0,0,0,0.5), 0 0 0 1.5px ${course.accent}44` : "0 8px 28px rgba(0,0,0,0.35)",
        transform: hovered ? "translateY(-6px) scale(1.02)" : "none",
        transition: "all 0.28s cubic-bezier(0.34,1.56,0.64,1)",
        cursor: "pointer", display: "flex", flexDirection: "column", minHeight: 320,
        position: "relative",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 160, overflow: "hidden" }}>
        <img src={course.image} alt={course.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.55, filter: "saturate(1.2)" }} />
        <div style={{ position: "absolute", inset: 0, background: course.bg, opacity: 0.45 }} />
        {/* Category badge */}
        <div style={{ position: "absolute", top: 10, right: 10, background: course.accent, color: "#000", fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {course.category}
        </div>
        {/* Title overlay */}
        <div style={{ position: "absolute", bottom: 10, left: 12 }}>
          <h3 style={{ color: "white", fontSize: 18, fontWeight: 800, margin: 0, textShadow: "0 2px 8px rgba(0,0,0,0.6)", fontFamily: "'Sora',sans-serif" }}>{course.title}</h3>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "14px 14px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", lineHeight: 1.65, margin: 0, flex: 1 }}>{course.desc}</p>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button style={{
            flex: 1, padding: "8px 6px", borderRadius: 8, border: `1.5px solid ${course.accent}`,
            background: "transparent", color: course.accent, fontSize: 12, fontWeight: 700,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
            transition: "all 0.18s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = course.accent; e.currentTarget.style.color = "#000"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = course.accent; }}
          >
            Enroll Class →
          </button>
          <button style={{
            flex: 1, padding: "8px 6px", borderRadius: 8, border: "none",
            background: course.accent, color: "#000", fontSize: 12, fontWeight: 700,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
            transition: "opacity 0.18s",
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            Enroll Course →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── HERO BANNER ───────────────────────────────────────────────────────────────
function HeroBanner() {
  return (
    <div style={{
      background: "linear-gradient(120deg,#e8ecf5 0%,#d4dce8 60%,#c8d5e8 100%)",
      minHeight: "clamp(160px, 30vw, 220px)", display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      {/* Decorative triangles */}
      <div style={{ position: "absolute", bottom: 0, right: 0, width: 0, height: 0, borderLeft: "clamp(120px, 20vw, 240px) solid transparent", borderBottom: "clamp(110px, 18vw, 220px) solid rgba(59,130,246,0.13)" }} />
      <div style={{ position: "absolute", top: 0, left: 0, width: 0, height: 0, borderRight: "clamp(90px, 15vw, 180px) solid transparent", borderTop: "clamp(110px, 18vw, 220px) solid rgba(200,210,220,0.5)" }} />
      <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(18px, 4vw, 28px)", fontWeight: 700, color: "#1e293b", zIndex: 1, textAlign: "center", padding: "0 20px" }}>
        Content Slide Display Image
      </h2>
    </div>
  );
}

// ── APP (ROOT) ────────────────────────────────────────────────────────────────
export default function App() {
  const [search, setSearch] = useState("");

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrap" style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif", minHeight: "100vh", background: "#e8ecf5", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100%; overflow-x: hidden; }
        .page-wrap { max-width: 1400px; margin: 0 auto; width: 100%; }
        .course-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          position: relative;
          z-index: 1;
        }
        @media (max-width: 640px) {
          .course-grid { grid-template-columns: 1fr !important; }
          .deco-shape { display: none !important; }
        }
        @media (min-width: 641px) and (max-width: 900px) {
          .course-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (min-width: 901px) and (max-width: 1100px) {
          .course-grid { grid-template-columns: 1fr 1fr 1fr !important; }
        }
      `}</style>

      <HeroBanner />

      {/* Course section */}
      <div style={{ background: "linear-gradient(180deg,#dce3ef 0%,#e8f0e8 100%)", padding: "clamp(24px, 4vw, 36px) clamp(16px, 3vw, 28px) clamp(32px, 5vw, 48px)", position: "relative" }}>
        {/* Decorative teal shapes */}
        <div className="deco-shape" style={{ position: "absolute", top: 0, right: 0, width: 220, height: 220, background: "rgba(20,184,166,0.18)", borderRadius: "0 0 0 100%", pointerEvents: "none" }} />
        <div className="deco-shape" style={{ position: "absolute", bottom: 0, right: 60, width: 140, height: 140, background: "rgba(20,184,166,0.12)", borderRadius: "100% 0 0 0", pointerEvents: "none" }} />

        {/* Header row — responsive */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, gap: 12, position: "relative", zIndex: 1, flexWrap: "wrap" }}>
          {/* School Course badge */}
          <div style={{ background: "white", borderRadius: 10, padding: "8px 16px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", flexShrink: 0 }}>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(16px, 4vw, 26px)", fontWeight: 800, background: "linear-gradient(90deg,#3b82f6,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>
              School Course
            </h2>
          </div>

          {/* Search bar — fills remaining space */}
          <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.85)", borderRadius: 24, padding: "8px 14px", gap: 8, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", flex: "1 1 0", minWidth: 0, maxWidth: 400 }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Searching Courses ..."
              style={{ border: "none", outline: "none", background: "transparent", fontSize: 13, color: "#334155", width: "100%", minWidth: 0 }}
            />
            <span style={{ fontSize: 15, color: "#64748b", flexShrink: 0 }}>🔍</span>
          </div>
        </div>

        {/* Grid */}
        <div className="course-grid">
          {filtered.length > 0
            ? filtered.map(c => <CourseCard key={c.id} course={c} />)
            : (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "48px 0", color: "#64748b", fontSize: 15 }}>
                No courses found for "<strong>{search}</strong>"
              </div>
            )
          }
        </div>
      </div>

    </div>
  );
}
