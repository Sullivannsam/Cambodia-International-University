import { useState } from 'react';
import { Award, Loader2, Send } from 'lucide-react';
import InfoPage from '../../components/public/InfoPage';
import { useLanguage } from "../../context/LanguageContext";
import { submitApplication } from "../../services/endpoints";
import StyledSelect from "../../components/common/StyledSelect";

const SCHOLARSHIPS = [
  {
    title: "Merit Scholarship",
    desc: "Awarded to students with outstanding academic performance in their final year of high school.",
    value: "Up to 100% tuition",
    requirements: ["Top 5% of graduating class", "Minimum GPA 3.6", "Pass entrance interview"],
  },
  {
    title: "Need-Based Scholarship",
    desc: "Financial support for talented students facing economic hardship.",
    value: "50% tuition + allowance",
    requirements: ["Proof of financial need", "Minimum GPA 3.0", "Recommendation letter"],
  },
  {
    title: "Sports Scholarship",
    desc: "For student-athletes representing the university in national competitions.",
    value: "Up to 70% tuition",
    requirements: ["National-level achievement", "Minimum GPA 2.8", "Trial performance"],
  },
  {
    title: "Women in STEM Scholarship",
    desc: "Encouraging female students to pursue science, technology, engineering and mathematics.",
    value: "60% tuition",
    requirements: ["Female applicant", "STEM program enrollment", "Minimum GPA 3.2"],
  },
  {
    title: "Sibling Scholarship",
    desc: "Discount for families with two or more siblings enrolled at CIU.",
    value: "20% tuition per sibling",
    requirements: ["Sibling already enrolled", "Minimum GPA 2.5"],
  },
];

export default function Scholarships() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", program: "", scholarship: SCHOLARSHIPS[0].title, message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSent(false);
    if (!form.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setFormError(t("Please fill in your name and a valid email address."));
      return;
    }
    setSending(true);
    try {
      await submitApplication({
        type: "SCHOLARSHIP",
        name: form.name.trim(),
        email: form.email.trim(),
        program: form.program.trim(),
        scholarship: form.scholarship,
        message: form.message.trim(),
      });
      setSent(true);
      setForm({ name: "", email: "", program: "", scholarship: SCHOLARSHIPS[0].title, message: "" });
    } catch {
      setFormError(t("Application not submitted. Make sure the backend server is running."));
    } finally {
      setSending(false);
    }
  };

  return (
    <InfoPage
      icon={<Award size={30} />}
      title={t("Scholarships")}
      subtitle={t("We believe talent and hard work should never be blocked by financial barriers.")}
    >
      <style>{`
        .sch-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 18px; }
        .sch-card {
          background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px;
          padding: 24px; display: flex; flex-direction: column; gap: 12px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.05);
        }
        .sch-title { font-size: 16.5px; font-weight: 800; color: var(--text-primary); margin: 0; }
        .sch-value {
          display: inline-block; align-self: flex-start; font-size: 12px; font-weight: 800;
          color: #fff; background: linear-gradient(135deg,#3E5EDB,#7A5CDB);
          padding: 4px 12px; border-radius: 999px;
        }
        .sch-desc { font-size: 13px; color: var(--text-secondary); line-height: 1.65; margin: 0; }
        .sch-req { font-size: 12.5px; color: var(--text-muted); margin: 0; padding-left: 16px; }
        .sch-req li { margin-bottom: 4px; }
        .sch-note {
          margin-top: 28px; background: rgba(62,94,219,0.08); border: 1px dashed rgba(62,94,219,0.35);
          border-radius: 12px; padding: 16px 20px; font-size: 13.5px; color: var(--text-secondary); line-height: 1.6;
        }
        .sch-label {
          display: block; font-size: 12.5px; font-weight: 600; color: var(--text-primary); margin-bottom: 6px;
        }
        .sch-input {
          width: 100%; box-sizing: border-box; padding: 11px 14px; font-size: 13.5px;
          border: 1.5px solid var(--border); border-radius: 10px;
          background: var(--input-bg); color: var(--text-primary); outline: none;
        }
        .sch-input:focus { border-color: #3E5EDB; }
        @media (max-width: 640px) { .sch-grid2 { grid-template-columns: 1fr !important; } }
      `}</style>

      <div className="sch-grid">
        {SCHOLARSHIPS.map((s, i) => (
          <div className="sch-card" key={i}>
            <h3 className="sch-title">{t(s.title)}</h3>
            <span className="sch-value">{t(s.value)}</span>
            <p className="sch-desc">{t(s.desc)}</p>
            <ul className="sch-req">
              {s.requirements.map((r, j) => <li key={j}>{t(r)}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <div className="sch-note">
        {t("To apply for a scholarship, submit your application through the ")}<strong>{t("Enroll")}</strong>{t(" page and mention the scholarship you're applying for in the notes. The scholarship committee reviews applications twice a year.")}
      </div>

      <div style={{ marginTop: 32 }}>
        <h3 style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 6px" }}>{t("Apply for a Scholarship")}</h3>
        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 16px" }}>{t("Fill in the form below and our admissions team will contact you with the next steps.")}</p>

        {sent && (
          <div style={{ background: "#E3F0E7", border: "1px solid #2E9E6C", color: "#1E7A4E", borderRadius: 10, padding: "12px 16px", fontSize: 13, marginBottom: 16, fontWeight: 600 }}>
            {t("Application submitted successfully. Our team will contact you soon.")}
          </div>
        )}
        {formError && (
          <div style={{ background: "#FBE3E0", border: "1px solid #E0665A", color: "#D2483C", borderRadius: 10, padding: "12px 16px", fontSize: 13, marginBottom: 16 }}>
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: 22, boxShadow: "0 6px 20px rgba(0,0,0,0.05)" }}>
          <div className="sch-grid2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label className="sch-label">{t("Full name")}</label>
              <input className="sch-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t("e.g. Sokha Ly")} required />
            </div>
            <div>
              <label className="sch-label">{t("Email")}</label>
              <input className="sch-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t("e.g. you@example.com")} required />
            </div>
            <div>
              <label className="sch-label">{t("Intended program")}</label>
              <input className="sch-input" value={form.program} onChange={(e) => setForm({ ...form, program: e.target.value })} placeholder={t("e.g. Computer Science")} />
            </div>
            <div>
              <label className="sch-label">{t("Scholarship")}</label>
              <StyledSelect value={form.scholarship} onChange={(v) => setForm({ ...form, scholarship: v })}
                width="100%" placeholder={t("Select a scholarship")}
                options={SCHOLARSHIPS.map((s) => ({ value: s.title, label: t(s.title) }))} />
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <label className="sch-label">{t("Message")}</label>
            <textarea className="sch-input" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={t("Tell us about your academic background and why you qualify...")} style={{ resize: "vertical", fontFamily: "inherit" }} />
          </div>
          <button type="submit" disabled={sending} style={{ marginTop: 18, border: "none", borderRadius: 10, padding: "12px 22px", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer", background: "linear-gradient(135deg,#3E5EDB,#7A5CDB)", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "0 6px 16px rgba(62,94,219,0.35)" }}>
            {sending ? <Loader2 size={16} style={{ animation: "schSpin 1s linear infinite" }} /> : <Send size={16} />}
            {sending ? t("Submitting...") : t("Submit Application")}
          </button>
        </form>
      </div>

      <style>{`@keyframes schSpin { from { transform: rotate(0); } to { transform: rotate(360deg); } }`}</style>
    </InfoPage>
  );
}
