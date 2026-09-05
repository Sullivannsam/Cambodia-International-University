import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileCheck2 } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import StyledSelect from "../common/StyledSelect";

const BASE_URL = process.env.REACT_APP_API_URL || "https://cambodia-international-university.onrender.com";

const majors = ["Computer Science", "Business Administration", "Engineering", "Medicine", "Law", "Architecture", "Education", "Arts & Design"];
const degrees = ["Bachelor's Degree", "Master's Degree", "PhD", "Associate Degree", "Diploma"];
const years = ["Year 1", "Year 2", "Year 3", "Year 4"];
const startDates = ["September 2026", "January 2027", "March 2027", "June 2027"];
const nationalities = ["Cambodian", "Vietnamese", "Chinese", "Korean", "American", "French", "Other"];

const steps = ["Application", "Confirmation", "Success"];

export default function Enrollment() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [page, setPage] = useState("form");
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    firstNameEN: "", lastNameEN: "", firstNameKH: "", lastNameKH: "",
    age: "", birthDate: "", placeOfBirth: "", sex: "",
    nationality: "", phone: "", email: "",
    startDate: "", major: "", year: "", degree: "",
    khmerNationalIdFile: "", photoFile: "", bacIIPhotoFile: "",
  });

  const update = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    setErrors(e => ({ ...e, [field]: undefined }));
  };

  const handleFile = (field, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update(field, reader.result);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const required = ["firstNameEN","lastNameEN","age","birthDate","placeOfBirth","sex","nationality","phone","email","startDate","major","year","degree","khmerNationalIdFile","photoFile","bacIIPhotoFile"];
    const errs = {};
    required.forEach(k => { if (!form[k]) errs[k] = t("Required"); });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = t("Invalid email");
    if (form.age && (isNaN(form.age) || +form.age < 15 || +form.age > 60)) errs.age = t("Must be 15–60");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goReview = () => {
    if (!validate()) return;
    setPage("review");
  };

  const handleSubmit = async () => {
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
          khmerNationalIdFile: form.khmerNationalIdFile,
          photoFile: form.photoFile,
          bacIIPhotoFile: form.bacIIPhotoFile,
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

  const docBoxStyle = (error) => ({
    position: "relative", width: "100%", height: 140, borderRadius: 12, display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", overflow: "hidden",
    background: "var(--input-bg)", color: "var(--text-muted)", fontSize: 12, textAlign: "center",
    border: `1.5px dashed ${error ? "#f87171" : "var(--border)"}`,
    transition: "border-color 0.2s, background 0.2s",
  });

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
        .radio-item { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px; color: var(--text-secondary); }
        .radio-item input { position: absolute; opacity: 0; width: 0; height: 0; pointer-events: none; }
        .radio-mark { width: 18px; height: 18px; border-radius: 50%; border: 2px solid #c7cdd6; display: inline-flex; align-items: center; justify-content: center; transition: border-color 0.15s; flex-shrink: 0; }
        .radio-mark::after { content: ""; width: 8px; height: 8px; border-radius: 50%; background: var(--text-primary); transform: scale(0); transition: transform 0.15s; }
        .radio-item:hover .radio-mark { border-color: #3b82f6; }
        .radio-item input:checked + .radio-mark { border-color: #3b82f6; }
        .radio-item input:checked + .radio-mark::after { transform: scale(1); }
        .radio-item input:focus-visible + .radio-mark { outline: 2px solid #3b82f6; outline-offset: 2px; }
        .radio-item.sel { color: var(--text-primary); font-weight: 600; }
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
              const done = i < pageIdx || page === "success";
              const active = page !== "success" && i === pageIdx;
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
        <div style={{ background: "#f3f4f6", borderRadius: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.1)" }}>

          <div style={{ background: "var(--bg-secondary)", padding: "20px 32px", borderBottom: "1px solid var(--border)", borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
            <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
              <strong style={{ color: "var(--text-primary)" }}>{t("Cambodia International University")}</strong> {t("— Official Enrollment Application Form.")}
              {t("Please fill in all required fields marked with")} <span style={{ color: "#ef4444" }}>*</span>.
            </p>
          </div>

          {page === "form" && (
            <div style={{ padding: "32px", background: "#f9fafb", borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
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
                      <label key={s} className={`radio-item${form.sex === s ? " sel" : ""}`} style={{color:'var(--text-secondary)'}}>
                        <input type="radio" name="sex" value={s} checked={form.sex === s} onChange={() => update("sex", s)} />
                        <span className="radio-mark" />
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
                  <StyledSelect value={form.nationality} onChange={(v) => update("nationality", v)}
                    width="100%" placeholder={t("Select nationality")}
                    buttonStyle={{ padding: "10px 14px", borderRadius: 10, border: getBorder("nationality") }}
                    options={nationalities.map(n => ({ value: n, label: t(n) }))} />
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
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, marginBottom: 32 }}>
                {[
                  { label: t("Start Date *"), field: "startDate", options: startDates, placeholder: t("Select start date") },
                  { label: t("Major *"), field: "major", options: majors, placeholder: t("Select major") },
                  { label: t("Year *"), field: "year", options: years, placeholder: t("Select year") },
                  { label: t("Degree *"), field: "degree", options: degrees, placeholder: t("Select degree") },
                ].map(({ label, field, options, placeholder }) => (
                  <div key={field}>
                    <div className="field-label">{label}</div>
                    <StyledSelect value={form[field]} onChange={(v) => update(field, v)}
                      width="100%" placeholder={placeholder}
                      buttonStyle={{ padding: "10px 14px", borderRadius: 10, border: getBorder(field) }}
                      options={options.map(o => ({ value: o, label: t(o) }))} />
                    {errors[field] && <div className="error-msg">{errors[field]}</div>}
                  </div>
                ))}
              </div>

              <div className="section-header">{t("Documents (required)")}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 36 }}>
                {[
                  { label: t("Khmer National ID *"), field: "khmerNationalIdFile", hint: t("ID card / Passport") },
                  { label: t("Photo *"), field: "photoFile", hint: t("2x3 portrait photo") },
                  { label: t("BacII Certificate *"), field: "bacIIPhotoFile", hint: t("BacII diploma/result") },
                ].map(({ label, field, hint }) => (
                  <div key={field}>
                    <div className="field-label">{label}</div>
                    <label className="doc-box" style={docBoxStyle(errors[field])}>
                      {form[field] ? (
                        <>
                          <img src={form[field]} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <span style={{ position: "absolute", bottom: 8, right: 8, display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(30,122,78,0.92)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 999 }}>
                            <FileCheck2 size={12} /> {t("Uploaded")}
                          </span>
                        </>
                      ) : (
                        <>
                          <Upload size={22} />
                          <span style={{ fontWeight: 600 }}>{t("Click to upload")}</span>
                          <span style={{ fontSize: 11, opacity: 0.7 }}>{hint}</span>
                        </>
                      )}
                      <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFile(field, e.target.files[0])} />
                    </label>
                    {errors[field] && <div className="error-msg">{errors[field]}</div>}
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
                <button onClick={() => setForm({ firstNameEN:"",lastNameEN:"",firstNameKH:"",lastNameKH:"",age:"",birthDate:"",placeOfBirth:"",sex:"",nationality:"",phone:"",email:"",startDate:"",major:"",year:"",degree:"",khmerNationalIdFile:"",photoFile:"",bacIIPhotoFile:"" })}
                  style={{ padding: "12px 28px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-secondary)", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                  {t("Cancel")}
                </button>
                <button onClick={goReview}
                  style={{ padding: "12px 32px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#3b82f6,#2563eb)", color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 15px rgba(59,130,246,0.4)", transition: "all 0.2s" }}>
                  {t("Confirm & Submit →")}
                </button>
              </div>
            </div>
          )}

          {page === "review" && (
            <div style={{ padding: "32px", background: "#f9fafb", borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
              <div className="section-header">{t("Confirmation")}</div>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24, lineHeight: 1.6 }}>
                {t("Please review all the information below before submitting your application.")}
              </p>
              {[
                {
                  title: t("Student Information"),
                  items: [
                    [t("First Name (EN)"), form.firstNameEN], [t("Last Name (EN)"), form.lastNameEN],
                    [t("First Name (KH)"), form.firstNameKH], [t("Last Name (KH)"), form.lastNameKH],
                    [t("Age"), form.age], [t("Sex"), form.sex], [t("Date of Birth"), form.birthDate],
                    [t("Place of Birth"), form.placeOfBirth], [t("Nationality"), form.nationality],
                  ],
                },
                {
                  title: t("Contact"),
                  items: [[t("Email"), form.email], [t("Phone"), form.phone]],
                },
                {
                  title: t("Study Program"),
                  items: [[t("Start Date"), form.startDate], [t("Major"), form.major], [t("Year"), form.year], [t("Degree"), form.degree]],
                },
              ].map(({ title, items }) => (
                <div key={title} style={{ marginBottom: 24 }}>
                  <div className="section-header" style={{ marginBottom: 4 }}>{title}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
                    {items.map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "11px 0", borderBottom: "1px solid var(--border)", fontSize: 14 }}>
                        <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>{k}</span>
                        <span style={{ color: "var(--text-primary)", fontWeight: 600, textAlign: "right", wordBreak: "break-word" }}>{v || "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div style={{ marginBottom: 28 }}>
                <div className="section-header" style={{ marginBottom: 12 }}>{t("Documents")}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                  {[
                    [t("Khmer National ID"), "khmerNationalIdFile"],
                    [t("Photo"), "photoFile"],
                    [t("BacII Certificate"), "bacIIPhotoFile"],
                  ].map(([k, field]) => form[field] ? (
                    <div key={field} style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)" }}>
                      <img src={form[field]} alt={k} style={{ width: "100%", height: 120, objectFit: "cover", display: "block" }} />
                      <div style={{ fontSize: 12, fontWeight: 700, textAlign: "center", padding: "8px 4px", background: "var(--bg-card)", color: "var(--text-primary)" }}>{k}</div>
                    </div>
                  ) : null)}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
                <button onClick={() => setPage("form")}
                  style={{ padding: "12px 28px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-secondary)", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                  {t("← Back to Edit")}
                </button>
                <button onClick={handleSubmit}
                  style={{ padding: "12px 32px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#3b82f6,#2563eb)", color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 15px rgba(59,130,246,0.4)", transition: "all 0.2s" }}>
                  {t("Submit Application →")}
                </button>
              </div>
            </div>
          )}

          {page === "success" && (
            <div style={{ padding: "60px 32px", textAlign: "center", borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
              <div style={{ width: 72, height: 72, background: "linear-gradient(135deg,#22c55e,#16a34a)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 32, boxShadow: "0 8px 25px rgba(34,197,94,0.35)" }}>✓</div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, color: "var(--text-primary)", marginBottom: 12 }}>{t("Submit Successful")}</h2>
              <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 420, margin: "0 auto 16px" }}>
                {t("Your application has been submitted successfully.")}<br />
                {t("You will receive our confirmation email within")} <strong>24 hours</strong>.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 32, alignItems: "center", marginBottom: 8 }}>
                <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 12, padding: "14px 24px" }}>
                  <span style={{ fontSize: 13, color: "var(--accent,#15803d)", fontWeight: 600 }}>📧 {t("Confirmation sent to:")} {form.email || t("your email")}</span>
                </div>

                <button onClick={() => { setPage("form"); setForm({ firstNameEN:"",lastNameEN:"",firstNameKH:"",lastNameKH:"",age:"",birthDate:"",placeOfBirth:"",sex:"",nationality:"",phone:"",email:"",startDate:"",major:"",year:"",degree:"",khmerNationalIdFile:"",photoFile:"",bacIIPhotoFile:"" }); navigate("/"); }}
                  style={{ padding: "14px 40px", borderRadius: 14, border: "none", background: "linear-gradient(135deg,#3b82f6,#2563eb)", color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 15px rgba(59,130,246,0.35)" }}>
                  {t("← Back to Home")}
                </button>
              </div>
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
