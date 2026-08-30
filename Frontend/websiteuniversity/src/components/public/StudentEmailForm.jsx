import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import StyledSelect from '../common/StyledSelect';

const departments = [
  "Computer Science",
  "Information Technology",
  "Business Management",
  "Marketing",
  "Accounting & Finance",
  "English Literature",
  "Law",
  "Engineering",
  "Architecture",
  "Other",
];

const StudentEmailForm = () => {
  const { t } = useLanguage();
  const token = sessionStorage.getItem("token");
  const userEmail = sessionStorage.getItem("email") || "";

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    studentId: "",
    department: "",
    year: "",
  });
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setMsg({ type: "", text: "" });
  };

  const validate = () => {
    const errs = {};
    if (!form.studentId.trim()) errs.studentId = t("Student ID is required");
    if (!form.department) errs.department = t("Select your department");
    if (!form.year) errs.year = t("Select your year");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const claimEmail = async () => {
    if (!validate()) return;
    setLoading(true);
    setMsg({ type: "", text: "" });

    const body = {
      email: userEmail,
      studentId: form.studentId,
      department: form.department,
      year: form.year,
    };

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/student/claim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        setEmail(data.email);
        setStep(2);
      } else {
        setMsg({ type: "error", text: data.message || t("No student record found.") });
      }
    } catch {
      setMsg({ type: "error", text: t("Backend not reachable. Make sure the server is running.") });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 border rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition`;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg-secondary)" }}>
        <div className="rounded-2xl shadow-lg p-8 w-full max-w-md text-center" style={{backgroundColor:'var(--bg-card)'}}>
          <p style={{color:'var(--text-primary)'}} className="font-medium">{t("Please log in first to claim your student email.")}</p>
          <a href="/public/login" className="inline-block mt-4 px-6 py-2 text-white rounded-xl text-sm font-semibold transition" style={{backgroundColor:'var(--accent,#2563eb)'}}>{t("Go to Login")}</a>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg-secondary)" }}>
        <div className="rounded-2xl shadow-lg p-8 w-full max-w-md text-center" style={{backgroundColor:'var(--bg-card)'}}>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2" style={{color:'var(--text-primary)'}}>{t("Email Generated!")}</h2>
          <p className="text-sm mb-6" style={{color:'var(--text-secondary)'}}>
            {t("Your student email has been created successfully.")}
          </p>
          <div className="border rounded-xl p-4 mb-6" style={{backgroundColor:'var(--bg-secondary)', borderColor:'var(--border)'}}>
            <p className="text-xs font-medium mb-1" style={{color:'var(--accent,#2563eb)'}}>{t("Your student email:")}</p>
            <p className="text-lg font-bold" style={{color:'var(--text-primary)'}}>{email}</p>
          </div>
          <div className="rounded-xl p-4 mb-6 text-left text-sm space-y-1" style={{backgroundColor:'var(--bg-secondary)'}}>
            <p style={{color:'var(--text-secondary)'}}><span className="font-medium" style={{color:'var(--text-primary)'}}>{t("Account Email:")}</span> {userEmail}</p>
            <p style={{color:'var(--text-secondary)'}}><span className="font-medium" style={{color:'var(--text-primary)'}}>{t("Student ID:")}</span> {form.studentId}</p>
            <p style={{color:'var(--text-secondary)'}}><span className="font-medium" style={{color:'var(--text-primary)'}}>{t("Department:")}</span> {form.department}</p>
            <p style={{color:'var(--text-secondary)'}}><span className="font-medium" style={{color:'var(--text-primary)'}}>{t("Year:")}</span> {form.year}</p>
          </div>
          <button
            onClick={() => { setStep(1); setEmail(""); setMsg({ type: "", text: "" }); }}
            className="w-full py-3 text-white font-semibold rounded-xl transition"
            style={{backgroundColor:'var(--accent,#2563eb)'}}
          >
            {t("Claim Another")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg-secondary)" }}>
      <div className="rounded-2xl shadow-lg p-8 w-full max-w-lg" style={{backgroundColor:'var(--bg-card)'}}>
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold" style={{color:'var(--text-primary)'}}>{t("Claim Your Student Email")}</h2>
          <p className="text-sm mt-1" style={{color:'var(--text-secondary)'}}>{t("Verify your student identity to get a")} <strong>@ciu.std.kh</strong> {t("email")}</p>
        </div>

        <div className="rounded-xl p-4 mb-5 space-y-2 text-sm" style={{backgroundColor:'var(--bg-secondary)'}}>
          <div className="flex justify-between"><span style={{color:'var(--text-muted)'}}>{t("Account Email")}</span><span className="font-medium" style={{color:'var(--text-primary)'}}>{userEmail}</span></div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1" style={{color:'var(--text-secondary)'}}>{t("Student ID")}</label>
            <input name="studentId" value={form.studentId} onChange={handleChange} placeholder={t("e.g. CS-2024-001")}
              className={inputClass("studentId")}
              style={{backgroundColor:'var(--input-bg)', borderColor: errors.studentId ? '#f87171' : 'var(--border)', color:'var(--text-primary)'}} />
            {errors.studentId && <p className="text-xs mt-1" style={{color:'var(--accent,#ef4444)'}}>{errors.studentId}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{color:'var(--text-secondary)'}}>{t("Department")}</label>
              <StyledSelect value={form.department} onChange={(v) => handleChange({ target: { name: "department", value: v } })}
                width="100%" placeholder={t("Select...")}
                buttonStyle={{ borderColor: errors.department ? '#f87171' : 'var(--border)' }}
                options={departments.map((d) => ({ value: d, label: t(d) }))} />
              {errors.department && <p className="text-xs mt-1" style={{color:'var(--accent,#ef4444)'}}>{errors.department}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{color:'var(--text-secondary)'}}>{t("Year")}</label>
              <StyledSelect value={form.year} onChange={(v) => handleChange({ target: { name: "year", value: v } })}
                width="100%" placeholder={t("Select...")}
                buttonStyle={{ borderColor: errors.year ? '#f87171' : 'var(--border)' }}
                options={[1, 2, 3, 4, 5].map((y) => ({ value: `Year ${y}`, label: t(`Year ${y}`) }))} />
              {errors.year && <p className="text-xs mt-1" style={{color:'var(--accent,#ef4444)'}}>{errors.year}</p>}
            </div>
          </div>

          {msg.text && (
            <p className={`text-sm border rounded-lg p-3 text-center`}
              style={{
                color: msg.type === "error" ? 'var(--accent,#ef4444)' : 'var(--accent,#16a34a)',
                backgroundColor: msg.type === "error" ? 'rgba(239,68,68,0.1)' : 'rgba(22,163,74,0.1)',
                borderColor: msg.type === "error" ? 'rgba(239,68,68,0.2)' : 'rgba(22,163,74,0.2)',
              }}>
              {msg.text}
            </p>
          )}

          <button
            onClick={claimEmail}
            disabled={loading}
            className="w-full py-3 text-white font-semibold rounded-xl transition mt-2 disabled:opacity-60"
            style={{backgroundColor:'var(--accent,#2563eb)'}}
          >
            {loading ? t("Verifying...") : t("Claim Email")}
          </button>

          <p className="text-xs text-center mt-3" style={{color:'var(--text-muted)'}}>
            {t("Your email will be:")} <strong style={{color:'var(--text-secondary)'}}>firstname.lastname@ciu.std.kh</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentEmailForm;
