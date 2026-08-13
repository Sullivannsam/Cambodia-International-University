import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

const BASE_URL = process.env.REACT_APP_API_URL || "https://cambodia-international-university.onrender.com";

const majors = ["Computer Science", "Business Administration", "Engineering", "Medicine", "Law", "Architecture", "Education", "Arts & Design"];
const degrees = ["Bachelor's Degree", "Master's Degree", "PhD", "Associate Degree", "Diploma"];
const years = ["Year 1", "Year 2", "Year 3", "Year 4"];
const startDates = ["September 2026", "January 2027", "March 2027", "June 2027"];
const nationalities = ["Cambodian", "Vietnamese", "Chinese", "Korean", "American", "French", "Other"];

const steps = ["Application", "Confirmation", "Success"];

export default function Enrollment() {
  const { t } = useLanguage();
  const [page, setPage] = useState("form");
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    firstNameEN: "", lastNameEN: "", firstNameKH: "", lastNameKH: "",
    age: "", birthDate: "", placeOfBirth: "", sex: "",
    nationality: "", phone: "", email: "",
    startDate: "", major: "", year: "", degree: "",
  });

  const update = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    setErrors(e => ({ ...e, [field]: undefined }));
  };

  const validate = () => {
    const required = ["firstNameEN","lastNameEN","age","birthDate","placeOfBirth","sex","nationality","phone","email","startDate","major","year","degree"];
    const errs = {};
    required.forEach(k => { if (!form[k]) errs[k] = t("Required"); });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = t("Invalid email");
    if (form.age && (isNaN(form.age) || +form.age < 15 || +form.age > 60)) errs.age = t("Must be 15–60");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleConfirm = async () => {
    if (!validate()) return;
    try {
      const res = await fetch(`${BASE_URL}/api/v1/auth/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstNameEN: form.firstNameEN,
          lastNameEN: form.lastNameEN,
          firstNameKH: form.firstNameKH,
          lastNameKH: form.lastNameKH,
          age: parseInt(form.age),
          birthDate: form.birthDate,
          palceOfBirth: form.placeOfBirth,
          sex: form.sex,
          national: form.nationality,
          phoneNumber: form.phone,
          email: form.email,
          startDate: form.startDate,
          major: form.major,
          year: form.year,
          degree: form.degree,
        }),
      });
      if (res.ok) {
        setPage("success");
      } else {
        alert(t("Submission failed. Please try again."));
      }
    } catch {
      alert(t("Server not reachable. Make sure the backend is running."));
    }
  };

  const sharedInputStyle = {
    borderRadius: 10, padding: "10px 14px", width: "100%", fontSize: 14, outline: "none", transition: "border 0.2s",
  };

  const getBorder = (field) => `1px solid ${errors[field] ? "#f87171" : "var(--border)"}`;

  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", minHeight: "100vh", background: "var(--bg-secondary)" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: transparent; }
        .step-bar { display: flex; align-items: center; gap: 8px; }
        .step-item { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 500; }
        .step-dot { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; }
        .step-line { width: 40px; height: 2px; border-radius: 2px; }
        select option { background: var(--bg-card); color: var(--text-primary); }
        input::placeholder { color: var(--text-muted); }
        .radio-group { display: flex; gap: 16px; }
        .radio-item { display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 14px; color: var(--text-secondary); }
        .radio-item input { accent-color: #3b82f6; width: 16px; height: 16px; cursor: pointer; }
        .error-msg { font-size: 11px; color: #f87171; margin-top: 3px; }
        .field-label { font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
        .section-header { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: var(--text-muted); margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid var(--border); }
        .confirm-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 14px; }
        .confirm-key { color: var(--text-muted); font-weight: 500; }
        .confirm-val { color: var(--text-primary); font-weight: 600; }
      `}</style>

      <div style={{ background: "linear-gradient(90deg,#2563eb,#3b82f6)", padding: "32px 40px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, color: "white", marginBottom: 6 }}>
          {t("Application for Enroll Class")}
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
          {t("After you submit the application you will receive an email from our University within 24 hours.")}
        </p>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
          <div className="step-bar">
            {steps.map((s, i) => {
              const pageIdx = page === "form" ? 0 : page === "review" ? 1 : 2;
              const done = i < pageIdx;
              const active = i === pageIdx;
              return (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div className="step-item">
                    <div className="step-dot" style={{ background: active ? "white" : done ? "#22c55e" : "rgba(255,255,255,0.2)", color: active ? "#3b82f6" : done ? "white" : "rgba(255,255,255,0.5)" }}>
                      {done ? "✓" : i + 1}
                    </div>
                    <span style={{ color: active ? "white" : done ? "#bbf7d0" : "rgba(255,255,255,0.5)", fontSize: 13 }}>{t(s)}</span>
                  </div>
                  {i < steps.length - 1 && <div className="step-line" style={{ background: done ? "#22c55e" : "rgba(255,255,255,0.2)" }} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "40px auto", padding: "0 20px 60px" }}>
        <div style={{ background: "#f3f4f6", borderRadius: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.1)", overflow: "hidden" }}>

          <div style={{ background: "var(--bg-secondary)", padding: "20px 32px", borderBottom: "1px solid var(--border)" }}>
            <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
              <strong style={{ color: "var(--text-primary)" }}>{t("Cambodia International University")}</strong> {t("— Official Enrollment Application Form.")}
              {t("Please fill in all required fields marked with")} <span style={{ color: "#ef4444" }}>*</span>.
            </p>
          </div>

          {page === "form" && (
            <div style={{ padding: "32px", background: "#f9fafb" }}>
              <div className="section-header">{t("Student Information")}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
                {[
                  { label: t("First Name (EN) *"), field: "firstNameEN", placeholder: t("e.g. Sophea") },
                  { label: t("Last Name (EN) *"), field: "lastNameEN", placeholder: t("e.g. Chan") },
                  { label: t("First Name (KH)"), field: "firstNameKH", placeholder: "ឈ្មោះ" },
                  { label: t("Last Name (KH)"), field: "lastNameKH", placeholder: "នាមត្រកូល" },
                ].map(({ label, field, placeholder }) => (
                  <div key={field}>
                    <div className="field-label">{label}</div>
                    <input placeholder={placeholder} value={form[field]} onChange={e => update(field, e.target.value)}
                      style={{ ...sharedInputStyle, background: "var(--input-bg)", border: getBorder(field), color: "var(--text-primary)" }} />
                    {errors[field] && <div className="error-msg">{errors[field]}</div>}
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
                <div>
                  <div className="field-label">{t("Age *")}</div>
                  <input placeholder={t("e.g. 20")} type="number" min="15" max="60" value={form.age} onChange={e => update("age", e.target.value)}
                    style={{ ...sharedInputStyle, background: "var(--input-bg)", border: getBorder("age"), color: "var(--text-primary)" }} />
                  {errors.age && <div className="error-msg">{errors.age}</div>}
                </div>
                <div>
                  <div className="field-label">{t("Date of Birth *")}</div>
                  <input type="date" value={form.birthDate} onChange={e => update("birthDate", e.target.value)}
                    style={{ ...sharedInputStyle, background: "var(--input-bg)", border: getBorder("birthDate"), color: form.birthDate ? "var(--text-primary)" : "var(--text-muted)" }} />
                  {errors.birthDate && <div className="error-msg">{errors.birthDate}</div>}
                </div>
                <div>
                  <div className="field-label">{t("Place of Birth *")}</div>
                  <input placeholder={t("City / Province")} value={form.placeOfBirth} onChange={e => update("placeOfBirth", e.target.value)}
                    style={{ ...sharedInputStyle, background: "var(--input-bg)", border: getBorder("placeOfBirth"), color: "var(--text-primary)" }} />
                  {errors.placeOfBirth && <div className="error-msg">{errors.placeOfBirth}</div>}
                </div>
                <div>
                  <div className="field-label">{t("Sex *")}</div>
                  <div className="radio-group" style={{ marginTop: 10 }}>
                    {["Male","Female"].map(s => (
                      <label key={s} className="radio-item" style={{color:'var(--text-secondary)'}}>
                        <input type="radio" name="sex" value={s} checked={form.sex === s} onChange={() => update("sex", s)} />
                        {t(s)}
                      </label>
                    ))}
                  </div>
                  {errors.sex && <div className="error-msg">{errors.sex}</div>}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 36 }}>
                <div>
                  <div className="field-label">{t("Nationality *")}</div>
                  <select value={form.nationality} onChange={e => update("nationality", e.target.value)}
                    style={{ ...sharedInputStyle, background: "var(--input-bg)", border: getBorder("nationality"), color: "var(--text-primary)", cursor: "pointer" }}>
                    <option value="">{t("Select nationality")}</option>
                    {nationalities.map(n => <option key={n} value={n}>{t(n)}</option>)}
                  </select>
                  {errors.nationality && <div className="error-msg">{errors.nationality}</div>}
                </div>
                <div>
                  <div className="field-label">{t("Phone Number *")}</div>
                  <input placeholder="+855 ..." value={form.phone} onChange={e => update("phone", e.target.value)}
                    style={{ ...sharedInputStyle, background: "var(--input-bg)", border: getBorder("phone"), color: "var(--text-primary)" }} />
                  {errors.phone && <div className="error-msg">{errors.phone}</div>}
                </div>
                <div>
                  <div className="field-label">{t("Email Address *")}</div>
                  <input placeholder="you@example.com" type="email" value={form.email} onChange={e => update("email", e.target.value)}
                    style={{ ...sharedInputStyle, background: "var(--input-bg)", border: getBorder("email"), color: "var(--text-primary)" }} />
                  {errors.email && <div className="error-msg">{errors.email}</div>}
                </div>
              </div>

              <div className="section-header">{t("Class Information")}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
                {[
                  { label: t("Start Date *"), field: "startDate", options: startDates, placeholder: t("Select start date") },
                  { label: t("Major *"), field: "major", options: majors, placeholder: t("Select major") },
                  { label: t("Year *"), field: "year", options: years, placeholder: t("Select year") },
                  { label: t("Degree *"), field: "degree", options: degrees, placeholder: t("Select degree") },
                ].map(({ label, field, options, placeholder }) => (
                  <div key={field}>
                    <div className="field-label">{label}</div>
                    <select value={form[field]} onChange={e => update(field, e.target.value)}
                      style={{ ...sharedInputStyle, background: "var(--input-bg)", border: getBorder(field), cursor: "pointer", color: form[field] ? "var(--text-primary)" : "var(--text-muted)" }}>
                      <option value="">{placeholder}</option>
                      {options.map(o => <option key={o} value={o} style={{ color: "#1e293b" }}>{t(o)}</option>)}
                    </select>
                    {errors[field] && <div className="error-msg">{errors[field]}</div>}
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
                <button onClick={() => setForm({ firstNameEN:"",lastNameEN:"",firstNameKH:"",lastNameKH:"",age:"",birthDate:"",placeOfBirth:"",sex:"",nationality:"",phone:"",email:"",startDate:"",major:"",year:"",degree:"" })}
                  style={{ padding: "12px 28px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-secondary)", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                  {t("Cancel")}
                </button>
                <button onClick={handleConfirm}
                  style={{ padding: "12px 32px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#3b82f6,#2563eb)", color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 15px rgba(59,130,246,0.4)", transition: "all 0.2s" }}>
                  {t("Confirm & Submit →")}
                </button>
              </div>
            </div>
          )}

          {page === "success" && (
            <div style={{ padding: "60px 32px", textAlign: "center" }}>
              <div style={{ width: 72, height: 72, background: "linear-gradient(135deg,#22c55e,#16a34a)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 32, boxShadow: "0 8px 25px rgba(34,197,94,0.35)" }}>✓</div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, color: "var(--text-primary)", marginBottom: 12 }}>{t("Submit Successful")}</h2>
              <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 420, margin: "0 auto 16px" }}>
                {t("Your application has been submitted successfully.")}<br />
                {t("You will receive our confirmation email within")} <strong>24 hours</strong>.
              </p>
              <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 12, padding: "14px 24px", display: "inline-block", marginBottom: 36 }}>
                <span style={{ fontSize: 13, color: "var(--accent,#15803d)", fontWeight: 600 }}>📧 {t("Confirmation sent to:")} {form.email || t("your email")}</span>
              </div>

              <div style={{ background: "var(--bg-secondary)", borderRadius: 16, padding: "24px 28px", textAlign: "left", maxWidth: 500, margin: "0 auto 36px" }}>
                <div className="section-header" style={{ marginBottom: 12 }}>{t("Application Summary")}</div>
                {[
                  ["Name", `${form.firstNameEN} ${form.lastNameEN}`],
                  ["Major", form.major],
                  ["Degree", form.degree],
                  ["Start Date", form.startDate],
                  ["Year", form.year],
                ].map(([k, v]) => (
                  <div className="confirm-row" key={k}>
                    <span className="confirm-key">{t(k)}</span>
                    <span className="confirm-val">{v}</span>
                  </div>
                ))}
              </div>

              <button onClick={() => { setPage("form"); setForm({ firstNameEN:"",lastNameEN:"",firstNameKH:"",lastNameKH:"",age:"",birthDate:"",placeOfBirth:"",sex:"",nationality:"",phone:"",email:"",startDate:"",major:"",year:"",degree:"" }); }}
                style={{ padding: "14px 40px", borderRadius: 14, border: "none", background: "linear-gradient(135deg,#3b82f6,#2563eb)", color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 15px rgba(59,130,246,0.35)" }}>
                {t("← Back to Home")}
              </button>
            </div>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "var(--text-muted)" }}>
          {t("This information provided by Cambodia International University")} 🇰🇭
        </p>
      </div>
    </div>
  );
}
