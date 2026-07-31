import { Building2 } from 'lucide-react';
import InfoPage from '../../components/public/InfoPage';
import { useLanguage } from "../../context/LanguageContext";

const FACILITIES = [
  {
    title: "Modern Library",
    icon: "📚",
    desc: "A five-floor library with over 200,000 books, quiet study zones, group rooms, and a digital resource center open from 7am to 9pm.",
  },
  {
    title: "Computer Labs",
    icon: "💻",
    desc: "24/7 access labs equipped with high-performance machines and industry-standard software for programming and design students.",
  },
  {
    title: "Science Laboratories",
    icon: "🔬",
    desc: "Fully equipped physics, chemistry, and biology labs with modern safety standards for hands-on learning.",
  },
  {
    title: "Sports Complex",
    icon: "🏟️",
    desc: "An indoor gym, football field, basketball courts, and swimming pool available to all students and staff.",
  },
  {
    title: "Student Center",
    icon: "🎭",
    desc: "A vibrant hub with cafeterias, lounge areas, meeting rooms, and space for student clubs and events.",
  },
  {
    title: "Wi-Fi Everywhere",
    icon: "📡",
    desc: "High-speed campus-wide Wi-Fi with secure access for students and faculty in every building and dormitory.",
  },
];

export default function Facilities() {
  const { t } = useLanguage();

  return (
    <InfoPage
      icon={<Building2 size={30} />}
      title={t("Campus Facilities")}
      subtitle={t("Everything you need to learn, create, and grow — all on one campus.")}
    >
      <style>{`
        .fac-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 18px; }
        .fac-card {
          background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px;
          padding: 26px; transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .fac-card:hover { transform: translateY(-4px); box-shadow: 0 14px 34px rgba(0,0,0,0.1); }
        .fac-icon {
          width: 54px; height: 54px; border-radius: 16px; display: flex; align-items: center; justify-content: center;
          font-size: 24px; background: var(--hover-bg); margin-bottom: 16px;
        }
        .fac-title { font-size: 16.5px; font-weight: 800; color: var(--text-primary); margin: 0 0 8px; }
        .fac-desc { font-size: 13px; color: var(--text-secondary); line-height: 1.7; margin: 0; }
      `}</style>

      <div className="fac-grid">
        {FACILITIES.map((f, i) => (
          <div className="fac-card" key={i}>
            <div className="fac-icon">{f.icon}</div>
            <h3 className="fac-title">{t(f.title)}</h3>
            <p className="fac-desc">{t(f.desc)}</p>
          </div>
        ))}
      </div>
    </InfoPage>
  );
}
