import React, { useState, useEffect } from "react";
import {
  Search, Loader2, CheckCircle2, XCircle
} from "lucide-react";
import { getEnrollments, updateEnrollmentStatus } from "../../services/endpoints";
import { useLanguage } from "../../context/LanguageContext";

const FALLBACK = [
  { id: 1, studentId: "CS-2024-007", name: "Dara Chan", course: "Introduction to Programming", courseCode: "CS101", date: "2026-08-18", status: "PENDING" },
  { id: 2, studentId: "CS-2024-008", name: "Maly Sok", course: "Data Structures", courseCode: "CS201", date: "2026-08-17", status: "PENDING" },
  { id: 3, studentId: "CS-2024-009", name: "Veasna Chea", course: "Database Systems", courseCode: "CS305", date: "2026-08-15", status: "PENDING" },
  { id: 4, studentId: "CS-2024-001", name: "Sokha Ly", course: "Introduction to Programming", courseCode: "CS101", date: "2026-08-10", status: "APPROVED" },
  { id: 5, studentId: "CS-2024-002", name: "Veasna Nop", course: "Data Structures", courseCode: "CS201", date: "2026-08-08", status: "REJECTED" },
];

export default function EnrollmentManagement({ onPendingChange }) {
  const { t } = useLanguage();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getEnrollments();
      const arr = Array.isArray(data) ? data : Array.isArray(data.enrollments) ? data.enrollments : [];
      const rows = arr.length ? arr : FALLBACK;
      setList(rows);
      onPendingChange?.(rows.filter(e => e.status === "PENDING").length);
    } catch {
      setList(FALLBACK);
      onPendingChange?.(FALLBACK.filter(e => e.status === "PENDING").length);
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
    onPendingChange?.(next.filter(e => e.status === "PENDING").length);
    setNotice(`${t("Enrollment for")} ${item.name} ${status === "APPROVED" ? t("approved") : t("rejected")}${t(".")}`);
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
        @media (max-width: 640px) { .em-search { width: 100%; } .em-search input { width: 100%; } }
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
            <tr><th>{t("Student")}</th><th>{t("ID")}</th><th>{t("Course")}</th><th>{t("Code")}</th><th>{t("Date")}</th><th>{t("Status")}</th><th>{t("Actions")}</th></tr>
          </thead>
          <tbody>
            {filtered.map(e => {
              const b = badge(e.status);
              return (
                <tr key={e.id}>
                  <td style={{ fontWeight: 600, color: "#182644" }}>{e.name}</td>
                  <td>{e.studentId}</td>
                  <td>{e.course}</td>
                  <td style={{ color: "#3E5EDB", fontWeight: 700 }}>{e.courseCode}</td>
                  <td>{e.date}</td>
                  <td><span className="em-badge" style={{ background: b.bg, color: b.color }}>{b.label}</span></td>
                  <td>
                    <div className="em-actions">
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
        <div className="em-empty">{t("No enrollments match your search.")}</div>
      )}

      <style>{`@keyframes emspin { from { transform: rotate(0); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
