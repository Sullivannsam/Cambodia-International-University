import { useState } from 'react';
import { Wallet, GraduationCap, FileText, Info } from 'lucide-react';
import InfoPage from '../../components/public/InfoPage';
import { useLanguage } from "../../context/LanguageContext";

const DEGREES = [
  {
    id: "bachelor",
    label: "Bachelor's Degree",
    years: ["Year 1", "Year 2", "Year 3", "Year 4"],
    programs: [
      { program: "Computer Science", icon: "💻", fees: ["450", "450", "480", "500"] },
      { program: "Business Administration", icon: "📊", fees: ["400", "420", "440", "460"] },
      { program: "Civil Engineering", icon: "🏗️", fees: ["480", "500", "520", "550"] },
      { program: "English Literature", icon: "📚", fees: ["350", "360", "380", "400"] },
      { program: "International Relations", icon: "🌍", fees: ["380", "400", "420", "440"] },
    ],
  },
  {
    id: "associate",
    label: "Associate Degree",
    years: ["Year 1", "Year 2"],
    programs: [
      { program: "Computer Science", icon: "💻", fees: ["420", "440"] },
      { program: "Business Administration", icon: "📊", fees: ["380", "400"] },
      { program: "English Literature", icon: "📚", fees: ["330", "350"] },
    ],
  },
  {
    id: "master",
    label: "Master's Degree",
    years: ["Year 1", "Year 2"],
    programs: [
      { program: "Business Administration (MBA)", icon: "📊", fees: ["750", "800"] },
      { program: "Information Technology (MIT)", icon: "💻", fees: ["780", "820"] },
      { program: "Education (M.Ed)", icon: "🎓", fees: ["700", "740"] },
    ],
  },
  {
    id: "phd",
    label: "Doctoral Degree (PhD)",
    years: ["Year 1", "Year 2", "Year 3"],
    programs: [
      { program: "Business Administration (PhD)", icon: "📊", fees: ["1100", "1100", "1200"] },
      { program: "Computer Science (PhD)", icon: "💻", fees: ["1150", "1150", "1250"] },
      { program: "Education (Ed.D)", icon: "🎓", fees: ["1050", "1050", "1150"] },
      { program: "Public Policy (PhD)", icon: "🏛️", fees: ["1000", "1000", "1100"] },
    ],
  },
];

const OTHER_FEES = [
  { item: "Registration fee (one time)", price: "20" },
  { item: "Exam fee (per semester)", price: "10" },
  { item: "Library & lab access", price: "Included" },
  { item: "Graduation ceremony", price: "50" },
];

export default function Tuition() {
  const { t } = useLanguage();
  const [degreeId, setDegreeId] = useState(DEGREES[0].id);
  const degree = DEGREES.find((d) => d.id === degreeId);

  return (
    <InfoPage
      icon={<Wallet size={28} />}
      title={t("Tuition & Fees")}
      subtitle={t("Choose your degree to see the price. All fees in USD, per semester.")}
    >
      <style>{`
        .tuition-tabs { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; }
        .tuition-tab {
          padding: 9px 18px; border-radius: 999px; cursor: pointer;
          border: 1.5px solid rgba(62,94,219,0.35); background: transparent;
          color: var(--text-primary, #182644); font-weight: 600; font-size: 14px;
          transition: all .15s ease;
        }
        .tuition-tab:hover { border-color: #3E5EDB; background: rgba(62,94,219,0.08); }
        .tuition-tab.active { background: #3E5EDB; border-color: #3E5EDB; color: #fff; box-shadow: 0 4px 12px rgba(62,94,219,0.3); }
        .tuition-table-wrap { overflow-x: auto; border-radius: 14px; border: 1px solid rgba(0,0,0,0.08); background: var(--bg-primary, #fff); }
        .tuition-table { width: 100%; border-collapse: collapse; min-width: 560px; font-size: 15px; }
        .tuition-table th { background: #182644; color: #fff; padding: 14px 16px; text-align: left; font-weight: 600; white-space: nowrap; }
        .tuition-table th:not(:first-child), .tuition-table td:not(:first-child) { text-align: center; }
        .tuition-table td { padding: 13px 16px; border-top: 1px solid rgba(0,0,0,0.07); color: var(--text-primary, #182644); }
        .tuition-table tr:hover td { background: rgba(37,99,235,0.05); }
        .tuition-program { display: flex; align-items: center; gap: 10px; font-weight: 600; white-space: nowrap; }
        .fee-badge { display: inline-block; padding: 4px 12px; border-radius: 999px; background: rgba(30,122,78,0.1); color: #1E7A4E; font-weight: 700; }
        .tuition-cta {
          display: inline-flex; align-items: center; gap: 10px; padding: 14px 34px; border: none; cursor: pointer;
          border-radius: 12px; font-size: 15px; font-weight: 700; color: #fff; text-decoration: none;
          background: linear-gradient(135deg,#3E5EDB,#7A5CDB); box-shadow: 0 10px 24px rgba(62,94,219,0.35);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .tuition-cta:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(62,94,219,0.45); }
        .tuition-cta svg { display: inline-flex; flex-shrink: 0; }
      `}</style>

      <div className="tuition-tabs">
        {DEGREES.map((d) => (
          <button
            key={d.id}
            className={`tuition-tab ${d.id === degreeId ? "active" : ""}`}
            onClick={() => setDegreeId(d.id)}
          >
            {t(d.label)}
          </button>
        ))}
      </div>

      <div className="tuition-table-wrap">
        <table className="tuition-table">
          <thead>
            <tr>
              <th>{t("Program")}</th>
              {degree.years.map((y) => (
                <th key={y}>{t(y)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {degree.programs.map((row) => (
              <tr key={row.program}>
                <td><span className="tuition-program">{row.icon} {t(row.program)}</span></td>
                {row.fees.map((f, i) => (
                  <td key={i}><span className="fee-badge">${f}</span></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{
        marginTop: 32,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 16,
      }}>
        <div style={{
          borderRadius: 14,
          border: "1px solid rgba(0,0,0,0.08)",
          padding: 20,
          background: "var(--bg-primary, #fff)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, marginBottom: 12 }}>
            <FileText size={18} color="#3E5EDB" /> {t("Other Fees")}
          </div>
          {OTHER_FEES.map((f) => (
            <div key={f.item} style={{
              display: "flex", justifyContent: "space-between",
              padding: "8px 0", borderBottom: "1px dashed rgba(0,0,0,0.08)",
              fontSize: 14,
            }}>
              <span>{t(f.item)}</span>
              <strong>{!isNaN(f.price) ? `$${f.price}` : t(f.price)}</strong>
            </div>
          ))}
        </div>

        <div style={{
          borderRadius: 14,
          border: "1px solid rgba(62,94,219,0.25)",
          padding: 20,
          background: "rgba(62,94,219,0.06)",
          fontSize: 14,
          lineHeight: 1.7,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, marginBottom: 12 }}>
            <Info size={18} color="#3E5EDB" /> {t("Good to know")}
          </div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li>{t("Fees are billed automatically at the start of each semester after you pass.")}</li>
            <li>{t("Payments can be made at the campus cashier or via bank transfer.")}</li>
            <li>{t("Scholarships are applied to your invoice automatically.")}</li>
            <li>{t("Questions? Contact the finance office via the contact page.")}</li>
          </ul>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 32 }}>
        <a href="/public/content/enroll" className="tuition-cta">
          <GraduationCap size={20} style={{ verticalAlign: "middle" }} /> {t("Ready? Start your enrollment — click here")}
        </a>
      </div>
    </InfoPage>
  );
}
