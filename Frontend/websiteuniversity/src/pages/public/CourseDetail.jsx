import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourses } from '../../services/endpoints';
import { BookOpen, Users, Clock, Award, ArrowLeft, GraduationCap, ShieldCheck } from 'lucide-react';
import Skeleton from '../../components/common/Skeleton';
import { useLanguage } from "../../context/LanguageContext";

const GRADIENTS = [
  "linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)",
  "linear-gradient(135deg,#0d1b2a 0%,#1b4332 50%,#00b4d8 100%)",
  "linear-gradient(135deg,#10002b 0%,#3c096c 50%,#5a189a 100%)",
];

export default function CourseDetail() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getCourses()
      .then((data) => {
        const list = Array.isArray(data) ? data : Array.isArray(data.courses) ? data.courses : [];
        const found = list.find((c) =>
          String(c.id) === String(id) ||
          c.courseCode === id || c.code === id ||
          c.title === decodeURIComponent(id || "")
        );
        setCourse(found || null);
        setNotFound(!found);
      })
      .catch(() => {
        setCourse(null);
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const meta = (icon, label, value) => (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
      <div style={{ color: "#3E5EDB", marginTop: 2 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginTop: 2 }}>{value}</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", background: "var(--bg-secondary)", fontFamily: "'Inter',system-ui,sans-serif" }}>
      <style>{`
        .cd-wrap { max-width: 1000px; margin: 0 auto; padding: 40px 24px 70px; }
        .cd-back {
          display: inline-flex; align-items: center; gap: 8px; background: none; border: none;
          color: #3E5EDB; font-size: 14px; font-weight: 600; cursor: pointer; margin-bottom: 22px;
          padding: 0; font-family: inherit;
        }
        .cd-hero {
          border-radius: 20px; overflow: hidden; color: #fff; margin-bottom: 26px;
          box-shadow: 0 18px 44px rgba(0,0,0,0.3); position: relative;
        }
        .cd-hero-body { padding: 34px 34px 30px; position: relative; z-index: 1; }
        .cd-badge {
          display: inline-block; font-size: 11px; font-weight: 800; letter-spacing: 0.08em;
          text-transform: uppercase; padding: 4px 12px; border-radius: 999px;
          background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.35); margin-bottom: 14px;
        }
        .cd-title { font-size: clamp(24px, 5vw, 34px); font-weight: 800; margin: 0 0 12px; line-height: 1.2; }
        .cd-desc { font-size: 14.5px; line-height: 1.75; opacity: 0.9; margin: 0; max-width: 720px; }
        .cd-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; }
        .cd-card {
          background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 22px;
        }
        .cd-section-title { font-size: 18px; font-weight: 800; color: var(--text-primary); margin: 30px 0 16px; }
        .cd-list { display: flex; flex-direction: column; gap: 10px; }
        .cd-li {
          display: flex; gap: 10px; font-size: 14px; color: var(--text-secondary);
          background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 13px 16px; line-height: 1.6;
        }
        .cd-li svg { color: #2E9E6C; flex-shrink: 0; margin-top: 2px; }
        .cd-cta { margin-top: 32px; text-align: center; }
        .cd-cta-btn {
          display: inline-flex; align-items: center; gap: 8px; padding: 14px 36px; border: none; cursor: pointer;
          border-radius: 12px; font-size: 15px; font-weight: 700; color: #fff;
          background: linear-gradient(135deg,#3E5EDB,#7A5CDB); box-shadow: 0 10px 24px rgba(62,94,219,0.35);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .cd-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(62,94,219,0.45); }
      `}</style>

      <div className="cd-wrap">
        <button className="cd-back" onClick={() => navigate("/public/course")}><ArrowLeft size={16} /> {t("Back to Courses")}</button>

        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Skeleton height={220} radius={20} />
            <Skeleton height={40} />
            <Skeleton height={160} radius={16} />
          </div>
        )}

        {!loading && notFound && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 72, marginBottom: 10 }}>🔍</div>
            <h2 style={{ color: "var(--text-primary)", margin: 0 }}>{t("Course not found")}</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>{t("The course you're looking for doesn't exist or may have been removed.")}</p>
            <Link to="/public/course" className="cd-cta-btn" style={{ textDecoration: "none", marginTop: 20 }}>
              <GraduationCap size={17} /> {t("Browse Courses")}
            </Link>
          </div>
        )}

        {!loading && course && (
          <>
            <div className="cd-hero" style={{ background: GRADIENTS[Number(course.id || 0) % GRADIENTS.length] }}>
              <div className="cd-hero-body">
                <span className="cd-badge">{course.category || course.faculty || t("Course")}</span>
                <h1 className="cd-title">{course.title || course.courseName || course.name}</h1>
                <p className="cd-desc">{course.description || t("An in-depth program offered at Cambodia International University.")}</p>
              </div>
            </div>

            <div className="cd-grid">
              <div className="cd-card">
                {meta(<BookOpen size={18} />, t("Code"), course.code || course.courseCode || "-")}
              </div>
              <div className="cd-card">
                {meta(<Users size={18} />, t("Instructor"), course.instructor || course.teacher || t("TBA"))}
              </div>
              <div className="cd-card">
                {meta(<Award size={18} />, t("Credits"), `${course.credits ?? course.credit ?? 3} ${t("credits")}`)}
              </div>
              <div className="cd-card">
                {meta(<Clock size={18} />, t("Duration"), course.duration || t("1 semester"))}
              </div>
            </div>

            <h2 className="cd-section-title">{t("Course Overview")}</h2>
            <div className="cd-card" style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
              {course.overview || course.details || course.description || t("This course provides students with foundational and advanced knowledge in the subject area. Through lectures, practical sessions, and assessments, students will develop the skills needed to excel in their field.")}
            </div>

            <h2 className="cd-section-title">{t("What You Will Learn")}</h2>
            <div className="cd-list">
              {(course.outcomes && course.outcomes.map
                ? course.outcomes
                : [
                    t("Core concepts and principles of the subject"),
                    t("Hands-on practical skills and real-world applications"),
                    t("Critical thinking and problem-solving techniques"),
                    t("Teamwork and professional communication"),
                  ]
              ).map((o, i) => (
                <div className="cd-li" key={i}><ShieldCheck size={16} /> {o}</div>
              ))}
            </div>

            <div className="cd-cta">
              <button className="cd-cta-btn" onClick={() => navigate("/public/content/enroll")}>
                <GraduationCap size={17} /> {t("Enroll in this Course")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
