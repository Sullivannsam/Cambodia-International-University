import { useEffect, useState } from 'react';
import { Loader2, Search, IdCard, Upload, Save, X, UserCircle2 } from 'lucide-react';
import { getStudentAccounts, updateStudentCard, uploadStudentPhoto } from "../../services/endpoints";
import StudentIdCard from "../../components/common/StudentIdCard";
import { useLanguage } from "../../context/LanguageContext";

export default function StudentCardManager() {
  const { t } = useLanguage();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getStudentAccounts()
      .then((d) => setStudents(Array.isArray(d) ? d : []))
      .catch(() => setError(t("Failed to load students. Make sure the backend is running.")))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!editing) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [editing]);

  const filtered = students.filter((s) =>
    `${s.username} ${s.email} ${s.id} ${s.cardCode || ""}`.toLowerCase().includes(query.toLowerCase())
  );

  const openEdit = (s) => {
    setEditing(s);
    setForm({
      fullName: s.fullName || s.username || "",
      major: s.major || "",
      phone: s.phone || "",
      address: s.address || "",
      cardCode: s.cardCode || "",
    });
    setPhotoFile(null);
    setNotice("");
    setError("");
  };

  const save = async (e) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setNotice("");
    setError("");
    try {
      await updateStudentCard(editing.id, form);
      if (photoFile) {
        await uploadStudentPhoto(editing.id, photoFile);
        setForm((f) => ({ ...f }));
      }
      setStudents((list) => list.map((s) => (s.id === editing.id ? { ...s, ...form } : s)));
      setNotice(t("Card updated successfully."));
      setPhotoFile(null);
    } catch (err) {
      setError(err?.status === 404
        ? t("Card API not available yet. Waiting for backend.")
        : (err?.message || t("Failed to update card.")));
    } finally {
      setSaving(false);
    }
  };

  const previewData = editing ? {
    id: editing.id,
    cardCode: form.cardCode,
    fullName: form.fullName,
    username: form.fullName,
    email: editing.email,
    major: form.major,
    yearNumber: editing.year,
    phone: form.phone,
    address: form.address,
    photoUrl: photoFile ? URL.createObjectURL(photoFile) : editing.photoUrl,
  } : null;

  return (
    <div>
      <style>{`
        .scm-table-wrap { overflow-x:auto; border-radius:12px; border:1px solid rgba(0,0,0,0.08); }
        .scm-table { width:100%; border-collapse:collapse; min-width:600px; font-size:14px; }
        .scm-table th { background:#182644; color:#fff; padding:12px 14px; text-align:left; white-space:nowrap; }
        .scm-table td { padding:11px 14px; border-top:1px solid rgba(0,0,0,0.07); }
        .scm-table tr:hover td { background:rgba(62,94,219,0.05); }
        .scm-btn { display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border:none;
          border-radius:10px; background:#3E5EDB; color:#fff; font-weight:600; font-size:13px; cursor:pointer; }
        .scm-btn:hover { filter:brightness(0.95); }
        .scm-input { width:100%; padding:9px 12px; border:1px solid rgba(0,0,0,0.15); border-radius:10px;
          font-size:13.5px; background:var(--bg-primary,#fff); color:var(--text-primary,#182644); outline:none; }
        .scm-input:focus { border-color:#3E5EDB; }
        .scm-label { display:block; font-size:12px; font-weight:700; color:#64748b; margin-bottom:5px; }
        .scm-file-btn { display:inline-flex; align-items:center; gap:8px; padding:9px 14px; cursor:pointer;
          border:1.5px dashed #3E5EDB; border-radius:10px; background:rgba(62,94,219,0.06);
          color:#3E5EDB; font-weight:600; font-size:13px; max-width:260px; white-space:nowrap;
          overflow:hidden; text-overflow:ellipsis; }
        .scm-file-btn:hover { background:rgba(62,94,219,0.12); border-style:solid; }
        .scm-file-clear { margin-left:8px; padding:4px 9px; border:none; border-radius:8px;
          background:rgba(239,68,68,0.12); color:#ef4444; font-size:12px; cursor:pointer; }
        .scm-overlay { position:fixed; inset:0; background:rgba(15,23,42,0.55); z-index:60;
          display:flex; align-items:flex-start; justify-content:center; padding:36px 16px; overflow:auto; }
        .scm-modal { background:var(--bg-primary,#fff); border-radius:18px; max-width:900px; width:100%;
          padding:22px; box-shadow:0 20px 50px rgba(0,0,0,0.3); }
        .code-chip { padding:2px 10px; border-radius:999px; background:rgba(62,94,219,0.1);
          color:#3E5EDB; font-weight:700; font-size:12.5px; letter-spacing:1px; }
      `}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
        <h2 style={{ margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
          <IdCard size={20} color="#3E5EDB" /> {t("Student Cards")}
        </h2>
        <div className="search-box" style={{ maxWidth: 320 }}>
          <Search size={15} />
          <input placeholder={t("Search by name, email, code...")} value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      {error && !editing && (
        <p style={{ color: "#D2483C", fontSize: 14 }}>{error}</p>
      )}

      {loading ? (
        <p style={{ color: "#64748b" }}><Loader2 size={15} className="animate-spin" /> {t("Loading...")}</p>
      ) : (
        <div className="scm-table-wrap">
          <table className="scm-table">
            <thead>
              <tr><th>{t("Photo")}</th><th>{t("Name")}</th><th>{t("Email")}</th><th>{t("Card Code")}</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td>
                    {s.photoUrl ? (
                      <img src={s.photoUrl} alt="" style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover" }} />
                    ) : (
                      <UserCircle2 size={32} color="#94a3b8" />
                    )}
                  </td>
                  <td style={{ fontWeight: 600 }}>{s.fullName || s.username}</td>
                  <td>{s.email}</td>
                  <td><span className="code-chip">{s.cardCode || String(s.id).padStart(6, "0")}</span></td>
                  <td><button className="scm-btn" onClick={() => openEdit(s)}><IdCard size={14} /> {t("Edit Card")}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="scm-overlay" onClick={() => setEditing(null)}>
          <form className="scm-modal" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <style>{`
              @media (max-width: 800px) { .scm-grid { grid-template-columns: 1fr !important; } }
            `}</style>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>{t("Edit Student Card")}</h3>
              <button type="button" onClick={() => setEditing(null)} aria-label={t("Close")}
                style={{ border: "none", background: "none", cursor: "pointer" }}><X size={18} /></button>
            </div>

            {notice && <p style={{ color: "#1E7A4E", fontWeight: 600, fontSize: 14 }}>✓ {notice}</p>}
            {error && <p style={{ color: "#D2483C", fontWeight: 600, fontSize: 14 }}>{error}</p>}

            <div className="scm-grid" style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24, alignItems: "start" }}>
              <StudentIdCard fallback={previewData} />

              <div style={{ display: "grid", gap: 12 }}>
                <div>
                  <label className="scm-label">{t("Full name")}</label>
                  <input className="scm-input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label className="scm-label">{t("Major")}</label>
                    <input className="scm-input" value={form.major} onChange={(e) => setForm({ ...form, major: e.target.value })} placeholder={t("e.g. Computer Science")} />
                  </div>
                  <div>
                    <label className="scm-label">{t("Phone")}</label>
                    <input className="scm-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+855 ..." />
                  </div>
                </div>
                <div>
                  <label className="scm-label">{t("Address")}</label>
                  <input className="scm-input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder={t("Your current address")} />
                </div>
                <div>
                  <label className="scm-label">{t("Card Code")} ({t("unique, 000001–999999")})</label>
                  <input className="scm-input" value={form.cardCode}
                    onChange={(e) => setForm({ ...form, cardCode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                    placeholder="000001" maxLength={6} />
                </div>
                <div>
                  <label className="scm-label">{t("Profile photo")}</label>
                  <input type="file" accept="image/*" id="scm-photo-input"
                    onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                    style={{ display: "none" }} />
                  <label htmlFor="scm-photo-input" className="scm-file-btn">
                    <Upload size={14} />
                    {photoFile ? photoFile.name : t("Choose a photo")}
                  </label>
                  {photoFile && (
                    <button type="button" className="scm-file-clear" onClick={() => {
                      setPhotoFile(null);
                      const el = document.getElementById("scm-photo-input");
                      if (el) el.value = "";
                    }}>✕</button>
                  )}
                </div>
                <button type="submit" className="scm-btn" disabled={saving}>
                  {saving ? <Loader2 size={14} className="animate-spin" /> : photoFile ? <Upload size={14} /> : <Save size={14} />}
                  {saving ? t("Saving...") : photoFile ? t("Save + Upload Photo") : t("Save Changes")}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
