import { useState, useEffect } from "react";
import { getCourses } from "../../services/endpoints";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { SkeletonGrid } from "../common/Skeleton";

// ── COURSE VISUALS ────────────────────────────────────────────────────────────
const GRADIENTS = [
  "linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)",
  "linear-gradient(135deg,#0d1b2a 0%,#1b4332 50%,#00b4d8 100%)",
  "linear-gradient(135deg,#10002b 0%,#3c096c 50%,#5a189a 100%)",
  "linear-gradient(135deg,#1c1c3a 0%,#2d2d6b 50%,#4444aa 100%)",
  "linear-gradient(135deg,#1a1200 0%,#3d2b00 50%,#6b4c00 100%)",
  "linear-gradient(135deg,#003300 0%,#1a5c1a 50%,#2d8a2d 100%)",
  "linear-gradient(135deg,#001233 0%,#023e8a 50%,#0077b6 100%)",
  "linear-gradient(135deg,#1a0533 0%,#4a0080 50%,#7b2fff 100%)",
  "linear-gradient(135deg,#0a0a0a 0%,#1c2b3a 50%,#2e4057 100%)",
];
const ACCENTS = ["#00d4ff", "#00f5d4", "#e040fb", "#7c83fd", "#ffd60a", "#39ff14", "#48cae4", "#ff6ef7", "#00b4d8"];
const IMAGES = [
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80",
  "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&q=80",
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80",
  "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80",
  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80",
];

function toCourseCard(c, index) {
  return {
    id: c.id ?? index,
    title: c.title || c.courseName || c.name || `Course ${index + 1}`,
    category: c.category || "Course",
    desc: c.description || "Course offered at Cambodia International University. Enroll to deepen your skills.",
    bg: GRADIENTS[index % GRADIENTS.length],
    accent: ACCENTS[index % ACCENTS.length],
    icon: c.icon || "🎓",
    image: c.image || IMAGES[index % IMAGES.length],
    active: c.active !== false && c.status !== "INACTIVE",
    featured: !!c.featured,
  };
}

function Highlight({ text, query, accent }) {
  const q = (query || "").trim();
  if (!q) return <>{text}</>;
  const lower = text.toLowerCase();
  const idx = lower.indexOf(q.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ background: accent, color: "#000", borderRadius: 4, padding: "0 3px" }}>{text.slice(idx, idx + q.length)}</span>
      {text.slice(idx + q.length)}
    </>
  );
}

// ── COURSE CARD ───────────────────────────────────────────────────────────────
function CourseCard({ course, search }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const openDetail = () => {
    const id = course.id ?? encodeURIComponent(course.title);
    navigate(`/public/course/${id}`);
  };

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
        {/* Featured badge */}
        {course.featured && (
          <div style={{ position: "absolute", top: 10, left: 10, background: "#ffd60a", color: "#000", fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.08em", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
            ★ {t("Featured")}
          </div>
        )}
        {/* Title overlay */}
        <div style={{ position: "absolute", bottom: 10, left: 12 }}>
          <h3 style={{ color: "white", fontSize: 18, fontWeight: 800, margin: 0, textShadow: "0 2px 8px rgba(0,0,0,0.6)", fontFamily: "'Sora',sans-serif" }}>
            <Highlight text={course.title} query={search} accent={course.accent} />
          </h3>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "14px 14px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", lineHeight: 1.65, margin: 0, flex: 1 }}>{course.desc}</p>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={openDetail} style={{
            flex: 1, padding: "8px 6px", borderRadius: 8, border: `1.5px solid ${course.accent}`,
            background: "transparent", color: course.accent, fontSize: 12, fontWeight: 700,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
            transition: "all 0.18s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = course.accent; e.currentTarget.style.color = "#000"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = course.accent; }}
          >
            {t("enrollClass")} →
          </button>
          <button onClick={openDetail} style={{
            flex: 1, padding: "8px 6px", borderRadius: 8, border: "none",
            background: course.accent, color: "#000", fontSize: 12, fontWeight: 700,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
            transition: "opacity 0.18s",
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            {t("enrollCourse")} →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── HERO BANNER ───────────────────────────────────────────────────────────────
function HeroBanner() {
  const { t } = useLanguage();
  return (
    <div style={{
      background: "var(--public-hero-bg)",
      minHeight: "clamp(160px, 30vw, 220px)", display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      {/* Decorative triangles */}
      <div style={{ position: "absolute", bottom: 0, right: 0, width: 0, height: 0, borderLeft: "clamp(120px, 20vw, 240px) solid transparent", borderBottom: "clamp(110px, 18vw, 220px) solid rgba(59,130,246,0.13)" }} />
      <div style={{ position: "absolute", top: 0, left: 0, width: 0, height: 0, borderRight: "clamp(90px, 15vw, 180px) solid transparent", borderTop: "clamp(110px, 18vw, 220px) solid rgba(200,210,220,0.5)" }} />
      <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(18px, 4vw, 28px)", fontWeight: 700, color: "var(--public-hero-text)", zIndex: 1, textAlign: "center", padding: "0 20px" }}>
        {t("Content Slide Display Image")}
      </h2>
    </div>
  );
}

// ── APP (ROOT) ────────────────────────────────────────────────────────────────
export default function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    getCourses()
      .then((data) => {
        const list = Array.isArray(data) ? data : Array.isArray(data.courses) ? data.courses : [];
        setCourses(list.map(toCourseCard));
      })
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  const visible = courses.filter((c) => c.active !== false);
  const categories = ["All", ...Array.from(new Set(visible.map((c) => c.category))).sort()];

  const filtered = visible
    .filter(c =>
      (category === "All" || c.category === category) &&
      (c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase()) ||
        (c.desc || "").toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  const showFilters = categories.length > 1;

  return (
    <div className="page-wrap" style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif", minHeight: "100vh", background: "var(--public-page-bg)", overflowX: "hidden" }}>
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
      <div style={{ background: "var(--public-section-bg)", padding: "clamp(24px, 4vw, 36px) clamp(16px, 3vw, 28px) clamp(32px, 5vw, 48px)", position: "relative" }}>
        {/* Decorative teal shapes */}
        <div className="deco-shape" style={{ position: "absolute", top: 0, right: 0, width: 220, height: 220, background: "rgba(20,184,166,0.18)", borderRadius: "0 0 0 100%", pointerEvents: "none" }} />
        <div className="deco-shape" style={{ position: "absolute", bottom: 0, right: 60, width: 140, height: 140, background: "rgba(20,184,166,0.12)", borderRadius: "100% 0 0 0", pointerEvents: "none" }} />

        {/* Header row — responsive */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, gap: 12, position: "relative", zIndex: 1, flexWrap: "wrap" }}>
          {/* School Course badge */}
          <div style={{ background: "white", borderRadius: 10, padding: "8px 16px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", flexShrink: 0 }}>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(16px, 4vw, 26px)", fontWeight: 800, background: "linear-gradient(90deg,#3b82f6,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>
              {t("schoolCourse")}
            </h2>
          </div>

          {/* Search bar — fills remaining space */}
          <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.85)", borderRadius: 24, padding: "8px 14px", gap: 8, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", flex: "1 1 0", minWidth: 0, maxWidth: 400 }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t("searchCourses")}
              style={{ border: "none", outline: "none", background: "transparent", fontSize: 13, color: "#334155", width: "100%", minWidth: 0 }}
            />
            <span style={{ fontSize: 15, color: "#64748b", flexShrink: 0 }}>🔍</span>
          </div>
        </div>

        {/* Category filter chips */}
        {showFilters && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20, position: "relative", zIndex: 1 }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  border: category === cat ? "none" : "1.5px solid #cbd5e1",
                  background: category === cat ? "linear-gradient(90deg,#3b82f6,#8b5cf6)" : "rgba(255,255,255,0.85)",
                  color: category === cat ? "#fff" : "#334155",
                  fontSize: 12, fontWeight: 700, padding: "7px 16px", borderRadius: 999,
                  cursor: "pointer", transition: "all 0.18s",
                }}
              >
                {cat === "All" ? t("allCourses") : cat}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        <div className="course-grid">
          {loading
            ? <div style={{ gridColumn: "1/-1" }}><SkeletonGrid count={6} /></div>
            : filtered.length > 0
            ? filtered.map(c => <CourseCard key={c.id} course={c} search={search} />)
            : (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "48px 0", color: "#64748b", fontSize: 15 }}>
                {t("noCourses")} "<strong>{search}</strong>" {category !== "All" ? `(${t("inCategory")} ${category})` : ""}
              </div>
            )
          }
        </div>
      </div>

    </div>
  );
}
