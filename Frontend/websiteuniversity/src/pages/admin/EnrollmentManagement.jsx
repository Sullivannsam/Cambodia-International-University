import React, { useState, useEffect } from "react";
import {
  Search, Loader2, CheckCircle2, XCircle
} from "lucide-react";
import { getEnrollments, getEnrollment, updateEnrollmentStatus } from "../../services/endpoints";
import { useLanguage } from "../../context/LanguageContext";

export default function EnrollmentManagement({ onPendingChange }) {
  const { t } = useLanguage();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getEnrollments();
      const arr = Array.isArray(data) ? data : Array.isArray(data.enrollments) ? data.enrollments : [];
      setList(arr);
      onPendingChange?.(arr.filter(e => e.status === "PENDING").length);
    } catch {
      setList([]);
      onPendingChange?.(0);
      setError(t("Failed to load enrollments. Make sure the backend server is running."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const setStatus = async (item, status) => {
    setNotice("");
    setError("");
    try {
      await updateEnrollmentStatus(item.id, status);
    } catch {}
    const next = list.map(e => e.id === item.id ? { ...e, status } : e);
    setList(next);
    setSelected(s => s && s.id === item.id ? { ...s, status } : s);
    onPendingChange?.(next.filter(e => e.status === "PENDING").length);
    setNotice(`${t("Enrollment for")} ${item.name} ${status === "APPROVED" ? t("approved") : t("rejected")}${t(".")}`);
    setSelected(null);
  };

  const openDetail = async (row) => {
    setSelected(row);
    try {
      const detail = await getEnrollment(row.id);
      if (detail && typeof detail === "object") setSelected(detail);
    } catch {
      /* fall back to the list row */
    }
  };

  const filtered = list.filter(e =>
    (e.name + e.studentId + e.courseCode + e.course).toLowerCase().includes(query.toLowerCase())
  );

  const badge = (s) => {
    if (s === "APPROVED") return { bg: "#E3F0E7", color: "#1E7A4E", label: t("Approved") };
    if (s === "REJECTED") return { bg: "#FBE3E0", color: "#D2483C", label: t("Rejected") };
    return { bg: "#FDF0D9", color: "#9A6B00", label: t("Pending") };
  };

  const pendingCount = list.filter(e => e.status === "PENDING").length;

  const batchSetStatus = async (status) => {
    setError("");
    setNotice("");
    const pending = list.filter(e => e.status === "PENDING");
    if (!pending.length) return;
    await Promise.all(pending.map(e => updateEnrollmentStatus(e.id, status).catch(() => {})));
    const next = list.map(e => e.status === "PENDING" ? { ...e, status } : e);
    setList(next);
    onPendingChange?.(next.filter(e => e.status === "PENDING").length);
    setNotice(`${t("Batch")} ${status === "APPROVED" ? t("approved") : t("rejected")} ${pending.length} ${t("pending enrollment(s).")}`);
  };

  return (
    <div className="em-wrap">
      <style>{`
        .em-wrap { font-family: 'Inter', system-ui, sans-serif; }
        .em-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 18px; }
        .em-title { font-size: 18px; font-weight: 800; color: #182644; }
        .em-search { display: flex; align-items: center; gap: 8px; background: #F6F4EF; border: 1px solid #E5E7EB; border-radius: 10px; padding: 9px 14px; color: #9CA3AF; }
        .em-search input { border: none; outline: none; background: none; font-size: 13px; width: 220px; color: #1F2430; }
        .em-stats { display: flex; gap: 14px; margin-bottom: 18px; flex-wrap: wrap; }
        .em-stat { background: #fff; border: 1px solid #ECE6DC; border-radius: 12px; padding: 12px 20px; box-shadow: 0 2px 10px rgba(24,38,68,0.05); }
        .em-stat-value { font-size: 22px; font-weight: 800; color: #182644; }
        .em-stat-label { font-size: 12px; color: #9A8F80; }
        .em-table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 16px rgba(24,38,68,0.06); font-size: 13px; }
        .em-table th { text-align: left; background: #F6F4EF; color: #3E5EDB; padding: 12px 16px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
        .em-table td { padding: 12px 16px; border-top: 1px solid #F0EEE9; }
        .em-badge { display: inline-block; font-size: 11.5px; font-weight: 700; padding: 3px 12px; border-radius: 999px; }
        .em-batch {
          display: inline-flex; align-items: center; gap: 6px; border: none; cursor: pointer;
          border-radius: 8px; padding: 8px 14px; font-size: 12.5px; font-weight: 700;
          background: #E3F0E7; color: #1E7A4E;
        }
        .em-batch-danger { background: #FBE3E0; color: #D2483C; }
        .em-btn { display: inline-flex; align-items: center; gap: 6px; border: none; cursor: pointer; border-radius: 8px; padding: 7px 12px; font-size: 12px; font-weight: 700; }
        .em-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .em-actions { display: flex; gap: 8px; }
        .em-banner { background: #E3F0E7; border: 1px solid #2E9E6C; color: #1E7A4E; border-radius: 10px; padding: 12px 16px; font-size: 13px; margin-bottom: 16px; font-weight: 600; }
        .em-error { background: #FBE3E0; border: 1px solid #E0665A; color: #D2483C; border-radius: 10px; padding: 12px 16px; font-size: 13px; margin-bottom: 16px; }
        .em-empty { text-align: center; padding: 40px; color: #9CA3AF; font-size: 13.5px; background: #fff; border-radius: 14px; }
        .em-modal-backdrop { position: fixed; inset: 0; background: rgba(15,23,42,0.45); display: flex; align-items: center; justify-content: center; padding: 20px; z-index: 1000; }
        .em-modal { background: #fff; border-radius: 18px; max-width: 620px; width: 100%; max-height: 88vh; overflow: auto; box-shadow: 0 25px 70px rgba(15,23,42,0.4); }
        .em-modal-head { position: relative; padding: 26px 24px 24px; background: linear-gradient(135deg,#3E5EDB,#6C8CFF); color: #fff; display: flex; align-items: center; gap: 14px; }
        .em-avatar { width: 54px; height: 54px; border-radius: 15px; background: rgba(255,255,255,0.22); border: 1px solid rgba(255,255,255,0.35); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800; color: #fff; letter-spacing: 0.5px; flex-shrink: 0; }
        .em-hero { flex: 1; min-width: 0; }
        .em-hero-name { font-size: 18px; font-weight: 800; color: #fff; margin-bottom: 3px; }
        .em-hero-sub { font-size: 12.5px; color: rgba(255,255,255,0.82); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .em-hero-badge { font-size: 11px; font-weight: 800; padding: 5px 14px; border-radius: 999px; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.12); flex-shrink: 0; }
        .em-modal-close { position: absolute; top: 14px; right: 16px; border: none; background: rgba(255,255,255,0.18); color: #fff; width: 30px; height: 30px; border-radius: 50%; font-size: 16px; line-height: 1; cursor: pointer; }
        .em-modal-close:hover { background: rgba(255,255,255,0.32); }
        .em-body { padding: 4px 0 8px; }
        .em-section { padding: 16px 24px 6px; }
        .em-section + .em-section { border-top: 1px solid #F0EEE9; }
        .em-section-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #9A8F80; margin-bottom: 10px; }
        .em-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .em-field { background: #F9FAFB; border: 1px solid #F0EEE9; border-radius: 12px; padding: 10px 14px; }
        .em-field-label { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.06em; color: #9A8F80; font-weight: 700; margin-bottom: 4px; }
        .em-field-value { font-size: 14px; color: #1F2430; font-weight: 600; word-break: break-word; }
        .em-doc-grid { display: flex; gap: 12px; flex-wrap: wrap; }
        .em-doc { flex: 1 1 120px; max-width: 150px; display: inline-flex; flex-direction: column; gap: 6px; text-decoration: none; background: #F9FAFB; border: 1px solid #F0EEE9; border-radius: 12px; padding: 8px; }
        .em-doc img { width: 100%; height: 110px; object-fit: cover; border-radius: 8px; }
        .em-doc span { font-size: 11px; font-weight: 700; color: #1F2430; text-align: center; }
        .em-doc-empty { min-height: 110px; justify-content: center; align-items: center; border-style: dashed; background: #FDFDFC; }
        .em-doc-ph { font-size: 11px; font-weight: 600; color: #9CA3AF; text-align: center; }
        .em-modal-actions { display: flex; gap: 10px; padding: 18px 24px 22px; justify-content: flex-end; border-top: 1px solid #F0EEE9; }
        .em-approve, .em-reject { display: inline-flex; align-items: center; gap: 6px; border: none; cursor: pointer; border-radius: 10px; padding: 10px 18px; font-size: 13px; font-weight: 700; color: #fff; transition: filter 0.15s; }
        .em-approve { background: linear-gradient(135deg,#2E9E6C,#1E7A4E); }
        .em-reject { background: linear-gradient(135deg,#E0665A,#D2483C); }
        .em-approve:hover, .em-reject:hover { filter: brightness(1.06); }
        .em-approve:disabled, .em-reject:disabled { opacity: 0.45; cursor: not-allowed; filter: none; }
        @media (max-width: 640px) { .em-search { width: 100%; } .em-search input { width: 100%; } .em-modal-head { padding: 22px 18px 20px; } .em-section { padding: 14px 18px 4px; } .em-modal-actions { padding: 16px 18px 20px; } .em-fields { grid-template-columns: 1fr; } }
      `}</style>

      <div className="em-head">
        <div className="em-title">{t("Enrollment Requests")}</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div className="em-search"><Search size={15} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder={t("Search by name, ID, course...")} /></div>
          {pendingCount > 0 && (
            <>
              <button className="em-batch" onClick={() => batchSetStatus("APPROVED")}><CheckCircle2 size={14} /> {t("Approve all")} ({pendingCount})</button>
              <button className="em-batch em-batch-danger" onClick={() => batchSetStatus("REJECTED")}><XCircle size={14} /> {t("Reject all")} ({pendingCount})</button>
            </>
          )}
        </div>
      </div>

      <div className="em-stats">
        <div className="em-stat"><div className="em-stat-value">{list.length}</div><div className="em-stat-label">{t("Total")}</div></div>
        <div className="em-stat"><div className="em-stat-value" style={{ color: "#D69A1E" }}>{pendingCount}</div><div className="em-stat-label">{t("Pending")}</div></div>
        <div className="em-stat"><div className="em-stat-value" style={{ color: "#1E7A4E" }}>{list.filter(e => e.status === "APPROVED").length}</div><div className="em-stat-label">{t("Approved")}</div></div>
        <div className="em-stat"><div className="em-stat-value" style={{ color: "#D2483C" }}>{list.filter(e => e.status === "REJECTED").length}</div><div className="em-stat-label">{t("Rejected")}</div></div>
      </div>

      {notice && <div className="em-banner">{notice}</div>}
      {error && <div className="em-error">{error}</div>}

      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}><Loader2 size={28} className="sp-spin" style={{ color: "#3E5EDB", animation: "emspin 1s linear infinite" }} /></div>
      ) : filtered.length ? (
        <table className="em-table">
          <thead>
            <tr><th>{t("Student")}</th><th>{t("Course")}</th><th>{t("Degree")}</th><th>{t("Start")}</th><th>{t("Status")}</th><th>{t("Actions")}</th></tr>
          </thead>
          <tbody>
            {filtered.map(e => {
              const b = badge(e.status);
              return (
                <tr key={e.id} style={{ cursor: "pointer" }} onClick={() => openDetail(e)}>
                  <td style={{ fontWeight: 600, color: "#182644" }}>{e.name}</td>
                  <td>{e.course}</td>
                  <td style={{ color: "#3E5EDB", fontWeight: 700 }}>{e.courseCode}</td>
                  <td>{e.date}</td>
                  <td><span className="em-badge" style={{ background: b.bg, color: b.color }}>{b.label}</span></td>
                  <td>
                    <div className="em-actions" onClick={(ev) => ev.stopPropagation()}>
                      <button className="em-btn" style={{ background: "#E3F0E7", color: "#1E7A4E" }} disabled={e.status === "APPROVED"} onClick={() => setStatus(e, "APPROVED")}>
                        <CheckCircle2 size={13} /> {t("Approve")}
                      </button>
                      <button className="em-btn" style={{ background: "#FBE3E0", color: "#D2483C" }} disabled={e.status === "REJECTED"} onClick={() => setStatus(e, "REJECTED")}>
                        <XCircle size={13} /> {t("Reject")}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div className="em-empty">{query ? `${t("No enrollments match your search.")} \"${query}\"` : t("No enrollments match your search.")}</div>
      )}

      {selected && (() => {
        const badgeStyle = badge(selected.status);
        const nameParts = [selected.lastNameEN, selected.firstNameEN].filter(Boolean);
        const initials = nameParts.map(p => p[0]).join("").slice(0, 2).toUpperCase() || "?";
        const personal = [
          ["Last Name (EN)", selected.lastNameEN], ["First Name (EN)", selected.firstNameEN],
          ["Last Name (KH)", selected.lastNameKH], ["First Name (KH)", selected.firstNameKH],
          ["Sex", selected.sex], ["Age", selected.age], ["Date of Birth", selected.birthDate],
          ["Nationality", selected.nationality], ["Place of Birth", selected.placeOfBirth],
        ].filter(([, v]) => (v ?? "") !== "");
        const contact = [
          ["Email", selected.email], ["Phone", selected.phone],
        ].filter(([, v]) => (v ?? "") !== "");
        const program = [
          ["Major", selected.course], ["Degree", selected.courseCode],
          ["Year", selected.year], ["Start Date", selected.startDate],
        ].filter(([, v]) => (v ?? "") !== "");
        const section = (title, items) => items.length ? (
          <div className="em-section" key={title}>
            <div className="em-section-title">{t(title)}</div>
            <div className="em-fields">
              {items.map(([k, v]) => (
                <div className="em-field" key={k}>
                  <div className="em-field-label">{t(k)}</div>
                  <div className="em-field-value">{v}</div>
                </div>
              ))}
            </div>
          </div>
        ) : null;
        const docItems = [
          ["Khmer National ID", "khmerNationalIdFile"],
          ["Photo", "photoFile"],
          ["BacII Certificate", "bacIIPhotoFile"],
        ];
        const docSection = (
          <div className="em-section" key="Documents">
            <div className="em-section-title">{t("Documents")}</div>
            <div className="em-doc-grid">
              {docItems.map(([k, field]) => {
                const src = selected[field];
                return src ? (
                  <a className="em-doc" key={field} href={src} target="_blank" rel="noreferrer" title={t(k)}>
                    <img src={src} alt={k} />
                    <span>{t(k)}</span>
                  </a>
                ) : (
                  <div className="em-doc em-doc-empty" key={field}>
                    <div className="em-doc-ph">{t("Not uploaded")}</div>
                    <span>{t(k)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
        return (
          <div className="em-modal-backdrop" onClick={() => setSelected(null)}>
            <div className="em-modal" onClick={(ev) => ev.stopPropagation()}>
              <div className="em-modal-head">
                <div className="em-avatar">{initials}</div>
                <div className="em-hero">
                  <div className="em-hero-name">{nameParts.join(" ") || selected.name}</div>
                  <div className="em-hero-sub">{[selected.course, selected.courseCode].filter(Boolean).join(" · ")}</div>
                </div>
                <span className="em-hero-badge" style={{ color: badgeStyle.color }}>{badgeStyle.label}</span>
                <button className="em-modal-close" onClick={() => setSelected(null)}>×</button>
              </div>
              <div className="em-body">
                {section("Personal Information", personal)}
                {section("Contact", contact)}
                {section("Study Program", program)}
                {docSection}
              </div>
              {selected.status && (
                <div className="em-modal-actions">
                  <button className="em-approve" disabled={selected.status === "APPROVED"} onClick={() => setStatus(selected, "APPROVED")}>
                    <CheckCircle2 size={15} /> {t("Approve")}
                  </button>
                  <button className="em-reject" disabled={selected.status === "REJECTED"} onClick={() => setStatus(selected, "REJECTED")}>
                    <XCircle size={15} /> {t("Reject")}
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      <style>{`@keyframes emspin { from { transform: rotate(0); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
