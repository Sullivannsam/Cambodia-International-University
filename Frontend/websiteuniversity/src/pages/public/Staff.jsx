import { Users } from 'lucide-react';
import InfoPage from '../../components/public/InfoPage';
import { useLanguage } from "../../context/LanguageContext";

const STAFF = [
  { name: "Dr. Chan Dara", role: "Rector", dept: "Executive Office", initial: "CD", color: "#3E5EDB" },
  { name: "Prof. Sok Veasna", role: "Dean of Faculty of Science", dept: "Faculty of Science", initial: "SV", color: "#7A5CDB" },
  { name: "Dr. Chea Maly", role: "Dean of Faculty of Business", dept: "Faculty of Business", initial: "CM", color: "#2E9E6C" },
  { name: "Prof. Nop Piseth", role: "Dean of Faculty of Engineering", dept: "Faculty of Engineering", initial: "NP", color: "#D69A1E" },
  { name: "Dr. Kim Sreyneang", role: "Registrar", dept: "Academic Affairs", initial: "KS", color: "#D2483C" },
  { name: "Mr. Hun Rithy", role: "Head of IT Department", dept: "Information Technology", initial: "HR", color: "#0EA5E9" },
  { name: "Ms. Ly Sokha", role: "Student Affairs Officer", dept: "Student Services", initial: "LS", color: "#EC4899" },
  { name: "Mr. Prak Vireak", role: "Librarian", dept: "University Library", initial: "PV", color: "#8B5CF6" },
];

export default function Staff() {
  const { t } = useLanguage();

  return (
    <InfoPage
      icon={<Users size={30} />}
      title={t("Our Faculty & Staff")}
      subtitle={t("Meet the dedicated team supporting teaching, research, and student life at CIU.")}
    >
      <style>{`
        .staff-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 18px; }
        .staff-card {
          background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px;
          padding: 26px 22px; text-align: center; transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .staff-card:hover { transform: translateY(-4px); box-shadow: 0 14px 34px rgba(0,0,0,0.1); }
        .staff-avatar {
          width: 68px; height: 68px; border-radius: 50%; color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; font-weight: 800; margin: 0 auto 14px;
        }
        .staff-name { font-size: 15.5px; font-weight: 700; color: var(--text-primary); margin: 0 0 4px; }
        .staff-role { font-size: 12.5px; color: #3E5EDB; font-weight: 600; margin: 0; }
        .staff-dept { font-size: 12px; color: var(--text-muted); margin: 6px 0 0; }
      `}</style>

      <div className="staff-grid">
        {STAFF.map((s, i) => (
          <div className="staff-card" key={i}>
            <div className="staff-avatar" style={{ background: s.color }}>{s.initial}</div>
            <h3 className="staff-name">{t(s.name)}</h3>
            <p className="staff-role">{t(s.role)}</p>
            <p className="staff-dept">{t(s.dept)}</p>
          </div>
        ))}
      </div>
    </InfoPage>
  );
}
