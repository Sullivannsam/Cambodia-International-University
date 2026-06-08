import { useState } from "react";

const majors = ["Computer Science", "Business Administration", "Engineering", "Medicine", "Law", "Architecture", "Education", "Arts & Design"];
const degrees = ["Bachelor's Degree", "Master's Degree", "PhD", "Associate Degree", "Diploma"];
const years = ["Year 1", "Year 2", "Year 3", "Year 4"];
const startDates = ["September 2026", "January 2027", "March 2027", "June 2027"];
const nationalities = ["Cambodian", "Thai", "Vietnamese", "Chinese", "Korean", "American", "French", "Other"];

const steps = ["Application", "Confirmation", "Success"];

export default function Enrollment() {
  const [page, setPage] = useState("form"); // form | success
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
    required.forEach(k => { if (!form[k]) errs[k] = "Required"; });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email";
    if (form.age && (isNaN(form.age) || +form.age < 15 || +form.age > 60)) errs.age = "Must be 15–60";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleConfirm = () => {
    if (validate()) setPage("success");
  };

  const inputClass = (field) =>
    `w-full bg-white/10 border ${errors[field] ? "border-red-400" : "border-white/20"} rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all`;

  const selectClass = (field) =>
    `w-full bg-white/10 border ${errors[field] ? "border-red-400" : "border-white/20"} rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all appearance-none cursor-pointer`;

  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", minHeight: "100vh", background: "linear-gradient(135deg, #e8edf5 0%, #dde4f0 100%)" }}>

      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: transparent; }
        .step-bar { display: flex; align-items: center; gap: 8px; }
        .step-item { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 500; }
        .step-dot { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; }
        .step-line { width: 40px; height: 2px; border-radius: 2px; }
        select option { background: white; color: #334155; }
        .radio-group { display: flex; gap: 16px; }
        .radio-item { display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 14px; color: #475569; }
        .radio-item input { accent-color: #3b82f6; width: 16px; height: 16px; cursor: pointer; }
        .error-msg { font-size: 11px; color: #f87171; margin-top: 3px; }
        .field-label { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
        .section-header { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #94a3b8; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0; }
        .confirm-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .confirm-key { color: #64748b; font-weight: 500; }
        .confirm-val { color: #1e293b; font-weight: 600; }
      `}</style>

            {/* Hero band */}
      <div style={{ background: "linear-gradient(90deg,#2563eb,#3b82f6)", padding: "32px 40px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, color: "white", marginBottom: 6 }}>
          Application for Enroll Class
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
          After you submit the application you will receive an email from our University within 24 hours.
        </p>

        {/* Step indicator */}
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
                    <span style={{ color: active ? "white" : done ? "#bbf7d0" : "rgba(255,255,255,0.5)", fontSize: 13 }}>{s}</span>
                  </div>
                  {i < steps.length - 1 && <div className="step-line" style={{ background: done ? "#22c55e" : "rgba(255,255,255,0.2)" }} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main card */}
      <div style={{ maxWidth: 860, margin: "40px auto", padding: "0 20px 60px" }}>
        <div style={{ background: "white", borderRadius: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.1)", overflow: "hidden" }}>

          {/* Card header */}
          <div style={{ background: "linear-gradient(135deg,#f8fafc,#f1f5f9)", padding: "20px 32px", borderBottom: "1px solid #e2e8f0" }}>
            <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>
              <strong style={{ color: "#1e293b" }}>Cambodia International University</strong> — Official Enrollment Application Form.
              Please fill in all required fields marked with <span style={{ color: "#ef4444" }}>*</span>.
            </p>
          </div>

          {page === "form" && (
            <div style={{ padding: "32px" }}>
              {/* Student Info */}
              <div className="section-header">Student Information</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
                {[
                  { label: "First Name (EN) *", field: "firstNameEN", placeholder: "e.g. Sophea" },
                  { label: "Last Name (EN) *", field: "lastNameEN", placeholder: "e.g. Chan" },
                  { label: "First Name (KH)", field: "firstNameKH", placeholder: "ឈ្មោះ" },
                  { label: "Last Name (KH)", field: "lastNameKH", placeholder: "នាមត្រកូល" },
                ].map(({ label, field, placeholder }) => (
                  <div key={field}>
                    <div className="field-label">{label}</div>
                    <input className={inputClass(field)} placeholder={placeholder} value={form[field]} onChange={e => update(field, e.target.value)} style={{ background: "#f8fafc", border: `1px solid ${errors[field] ? "#f87171" : "#e2e8f0"}`, borderRadius: 10, padding: "10px 14px", width: "100%", fontSize: 14, outline: "none", transition: "border 0.2s" }} />
                    {errors[field] && <div className="error-msg">{errors[field]}</div>}
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
                <div>
                  <div className="field-label">Age *</div>
                  <input className={inputClass("age")} placeholder="e.g. 20" type="number" min="15" max="60" value={form.age} onChange={e => update("age", e.target.value)} style={{ background: "#f8fafc", border: `1px solid ${errors.age ? "#f87171" : "#e2e8f0"}`, borderRadius: 10, padding: "10px 14px", width: "100%", fontSize: 14, outline: "none" }} />
                  {errors.age && <div className="error-msg">{errors.age}</div>}
                </div>
                <div>
                  <div className="field-label">Date of Birth *</div>
                  <input type="date" value={form.birthDate} onChange={e => update("birthDate", e.target.value)} style={{ background: "#f8fafc", border: `1px solid ${errors.birthDate ? "#f87171" : "#e2e8f0"}`, borderRadius: 10, padding: "10px 14px", width: "100%", fontSize: 14, outline: "none", color: form.birthDate ? "#1e293b" : "#94a3b8" }} />
                  {errors.birthDate && <div className="error-msg">{errors.birthDate}</div>}
                </div>
                <div>
                  <div className="field-label">Place of Birth *</div>
                  <input placeholder="City / Province" value={form.placeOfBirth} onChange={e => update("placeOfBirth", e.target.value)} style={{ background: "#f8fafc", border: `1px solid ${errors.placeOfBirth ? "#f87171" : "#e2e8f0"}`, borderRadius: 10, padding: "10px 14px", width: "100%", fontSize: 14, outline: "none" }} />
                  {errors.placeOfBirth && <div className="error-msg">{errors.placeOfBirth}</div>}
                </div>
                <div>
                  <div className="field-label">Sex *</div>
                  <div className="radio-group" style={{ marginTop: 10 }}>
                    {["Male","Female"].map(s => (
                      <label key={s} className="radio-item">
                        <input type="radio" name="sex" value={s} checked={form.sex === s} onChange={() => update("sex", s)} />
                        {s}
                      </label>
                    ))}
                  </div>
                  {errors.sex && <div className="error-msg">{errors.sex}</div>}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 36 }}>
                <div>
                  <div className="field-label">Nationality *</div>
                  <select value={form.nationality} onChange={e => update("nationality", e.target.value)} style={{ background: "#f8fafc", border: `1px solid ${errors.nationality ? "#f87171" : "#e2e8f0"}`, borderRadius: 10, padding: "10px 14px", width: "100%", fontSize: 14, outline: "none", cursor: "pointer" }}>
                    <option value="">Select nationality</option>
                    {nationalities.map(n => <option key={n}>{n}</option>)}
                  </select>
                  {errors.nationality && <div className="error-msg">{errors.nationality}</div>}
                </div>
                <div>
                  <div className="field-label">Phone Number *</div>
                  <input placeholder="+855 ..." value={form.phone} onChange={e => update("phone", e.target.value)} style={{ background: "#f8fafc", border: `1px solid ${errors.phone ? "#f87171" : "#e2e8f0"}`, borderRadius: 10, padding: "10px 14px", width: "100%", fontSize: 14, outline: "none" }} />
                  {errors.phone && <div className="error-msg">{errors.phone}</div>}
                </div>
                <div>
                  <div className="field-label">Email Address *</div>
                  <input placeholder="you@example.com" type="email" value={form.email} onChange={e => update("email", e.target.value)} style={{ background: "#f8fafc", border: `1px solid ${errors.email ? "#f87171" : "#e2e8f0"}`, borderRadius: 10, padding: "10px 14px", width: "100%", fontSize: 14, outline: "none" }} />
                  {errors.email && <div className="error-msg">{errors.email}</div>}
                </div>
              </div>

              {/* Class Info */}
              <div className="section-header">Class Information</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
                {[
                  { label: "Start Date *", field: "startDate", options: startDates, placeholder: "Select start date" },
                  { label: "Major *", field: "major", options: majors, placeholder: "Select major" },
                  { label: "Year *", field: "year", options: years, placeholder: "Select year" },
                  { label: "Degree *", field: "degree", options: degrees, placeholder: "Select degree" },
                ].map(({ label, field, options, placeholder }) => (
                  <div key={field}>
                    <div className="field-label">{label}</div>
                    <select value={form[field]} onChange={e => update(field, e.target.value)} style={{ background: "#f8fafc", border: `1px solid ${errors[field] ? "#f87171" : "#e2e8f0"}`, borderRadius: 10, padding: "10px 14px", width: "100%", fontSize: 14, outline: "none", cursor: "pointer", color: form[field] ? "#1e293b" : "#94a3b8" }}>
                      <option value="">{placeholder}</option>
                      {options.map(o => <option key={o} style={{ color: "#1e293b" }}>{o}</option>)}
                    </select>
                    {errors[field] && <div className="error-msg">{errors[field]}</div>}
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 40, paddingTop: 24, borderTop: "1px solid #f1f5f9" }}>
                <button onClick={() => setForm({ firstNameEN:"",lastNameEN:"",firstNameKH:"",lastNameKH:"",age:"",birthDate:"",placeOfBirth:"",sex:"",nationality:"",phone:"",email:"",startDate:"",major:"",year:"",degree:"" })}
                  style={{ padding: "12px 28px", borderRadius: 12, border: "1px solid #e2e8f0", background: "white", color: "#64748b", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                  Cancel
                </button>
                <button onClick={handleConfirm}
                  style={{ padding: "12px 32px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#3b82f6,#2563eb)", color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 15px rgba(59,130,246,0.4)", transition: "all 0.2s" }}>
                  Confirm & Submit →
                </button>
              </div>
            </div>
          )}

          {page === "success" && (
            <div style={{ padding: "60px 32px", textAlign: "center" }}>
              <div style={{ width: 72, height: 72, background: "linear-gradient(135deg,#22c55e,#16a34a)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 32, boxShadow: "0 8px 25px rgba(34,197,94,0.35)" }}>✓</div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, color: "#1e293b", marginBottom: 12 }}>Submit Successful</h2>
              <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.7, maxWidth: 420, margin: "0 auto 16px" }}>
                Your application has been submitted successfully.<br />
                You will receive our confirmation email within <strong>24 hours</strong>.
              </p>
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "14px 24px", display: "inline-block", marginBottom: 36 }}>
                <span style={{ fontSize: 13, color: "#15803d", fontWeight: 600 }}>📧 Confirmation sent to: {form.email || "your email"}</span>
              </div>

              {/* Summary */}
              <div style={{ background: "#f8fafc", borderRadius: 16, padding: "24px 28px", textAlign: "left", maxWidth: 500, margin: "0 auto 36px" }}>
                <div className="section-header" style={{ marginBottom: 12 }}>Application Summary</div>
                {[
                  ["Name", `${form.firstNameEN} ${form.lastNameEN}`],
                  ["Major", form.major],
                  ["Degree", form.degree],
                  ["Start Date", form.startDate],
                  ["Year", form.year],
                ].map(([k, v]) => (
                  <div className="confirm-row" key={k}>
                    <span className="confirm-key">{k}</span>
                    <span className="confirm-val">{v}</span>
                  </div>
                ))}
              </div>

              <button onClick={() => { setPage("form"); setForm({ firstNameEN:"",lastNameEN:"",firstNameKH:"",lastNameKH:"",age:"",birthDate:"",placeOfBirth:"",sex:"",nationality:"",phone:"",email:"",startDate:"",major:"",year:"",degree:"" }); }}
                style={{ padding: "14px 40px", borderRadius: 14, border: "none", background: "linear-gradient(135deg,#3b82f6,#2563eb)", color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 15px rgba(59,130,246,0.35)" }}>
                ← Back to Home
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "#94a3b8" }}>
          This information provided by Cambodia International University 🇰🇭
        </p>
      </div>
    </div>
  );
}
