import React, { useState, useEffect } from "react";
import {
  Search, Loader2, FileBarChart, FileDown, CheckCircle2, RotateCcw
} from "lucide-react";
import { getReports, updateReport } from "../../services/endpoints";
import { useLanguage } from "../../context/LanguageContext";

export default function ReportPage() {
  const { t } = useLanguage();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [notice, setNotice] = useState("");

  const load = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    setError("");
    try {
      const data = await getReports();
      const arr = Array.isArray(data) ? data : Array.isArray(data.reports) ? data.reports : [];
      setReports(arr);
    } catch {
      if (showSpinner) {
        setReports([]);
        setError(t("Failed to load reports. Make sure the backend server is running."));
      }
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const id = setInterval(() => load(false), 10000);
    return () => clearInterval(id);
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = reports.filter((r) => {
    const matchesQuery = q
      ? [r.name, r.subjectName, r.category, r.description, r.email, r.subjectEmail]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      : true;
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "UNREAD" && !r.read) ||
      (statusFilter === "READ" && !!r.read);
    return matchesQuery && matchesStatus;
  });

  const toggleRead = async (r) => {
    try {
      await updateReport(r.id, { read: !r.read });
      const next = reports.map((x) => x.id === r.id ? { ...x, read: !x.read } : x);
      setReports(next);
      setNotice(r.read ? t("Report marked as unread.") : t("Report marked as resolved."));
    } catch {
      setNotice(t("Failed to update the report. Make sure the backend server is running."));
    }
  };

  const exportCSV = () => {
    const header = `${t("ID")},${t("Reporter")},${t("Reported")},${t("Category")},${t("Description")},${t("Status")},${t("Date")}`;
    const rows = filtered.map((r) =>
      `"${r.id}","${r.name || ""}","${r.subjectName || ""}","${r.category || ""}","${(r.description || "").replace(/"/g, '""')}","${r.read ? t("Resolved") : t("Pending")}","${r.date || ""}"`
    ).join("\n");
    const blob = new Blob([`${header}\n${rows}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reports.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const typeColor = (type) => {
    const map = { Academic: "#3E5EDB", Financial: "#2E9E6C", Facility: "#D69A1E", Other: "#7A5CDB" };
    return map[type] || "#6B7280";
  };

  return (
    <div className="rp">
      <style>{`
        .rp { font-family: 'Inter', system-ui, sans-serif; }
        .rp .content-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 22px; gap: 20px; flex-wrap: wrap;
        }
        .rp .date-label { color: #6B7280; font-size: 13.5px; }
        .rp .rp-toolbar { display: flex; gap: 12px; flex-wrap: wrap; }
        .rp .search-box {
          display: flex; align-items: center; gap: 8px; background: #EFEBE3;
          border-radius: 10px; padding: 9px 14px; width: 240px; color: #8A8378;
        }
        .rp .search-box input { border: none; outline: none; background: transparent; font-size: 13px; width: 100%; color: #1F2430; }
        .rp .filter-select {
          border: 1.5px solid #E5E7EB; background: #fff; border-radius: 10px;
          padding: 9px 12px; font-size: 13px; color: #182644; outline: none; cursor: pointer;
        }
        .rp .export-btn {
          background: #3E5EDB; color: #fff; border: none; padding: 9px 16px;
          border-radius: 9px; font-size: 13px; font-weight: 600; cursor: pointer;
          display: inline-flex; align-items: center; gap: 8px;
          box-shadow: 0 6px 16px rgba(62,94,219,0.35);
        }
        .rp .error-banner {
          background: #FBE3E0; border: 1px solid #E0665A; color: #D2483C;
          border-radius: 10px; padding: 12px 18px; font-size: 13px; margin-bottom: 20px;
        }
        .rp .notice-banner {
          background: #E3F0E7; border: 1px solid #2E9E6C; color: #1E7A4E;
          border-radius: 10px; padding: 12px 18px; font-size: 13px; margin-bottom: 20px;
        }
        .rp .rp-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-bottom: 20px; }
        .rp .rp-stat { background: #fff; border-radius: 14px; padding: 16px 20px; box-shadow: 0 4px 16px rgba(24,38,68,0.06); }
        .rp .rp-stat-value { font-size: 24px; font-weight: 800; color: #182644; }
        .rp .rp-stat-label { font-size: 12px; color: #9A8F80; margin-top: 2px; }
        .rp .rp-panel { background: #fff; border-radius: 14px; padding: 22px; box-shadow: 0 4px 16px rgba(24,38,68,0.06); }
        .rp .rp-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .rp .rp-table th { text-align: left; color: #3E5EDB; border-bottom: 2px solid #E5E7EB; padding: 10px 12px; white-space: nowrap; }
        .rp .rp-table td { padding: 10px 12px; border-bottom: 1px solid #F0EEE9; vertical-align: top; }
        .rp .type-pill { color: #fff; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 999px; display: inline-block; }
        .rp .rp-report-title { font-weight: 600; color: #182644; max-width: 320px; }
        .rp .rp-report-body { color: #6B7280; max-width: 380px; line-height: 1.5; }
        .rp .rp-btn {
          border: none; border-radius: 7px; font-size: 11.5px; font-weight: 700;
          padding: 6px 12px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;
        }
        .rp .rp-resolve { background: #E3F0E7; color: #1E7A4E; margin-right: 6px; }
        .rp .rp-reopen { background: #E7E3F7; color: #3E5EDB; margin-right: 6px; }
      `}</style>

      <div className="content-row">
        <div className="date-label">{t("Student- and teacher-submitted reports from across the university.")}</div>
        <div className="rp-toolbar">
          <div className="search-box">
            <Search size={15} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("Search reports...")} />
          </div>
          <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">{t("All reports")}</option>
            <option value="UNREAD">{t("Pending")}</option>
            <option value="READ">{t("Resolved")}</option>
          </select>
          <button className="export-btn" onClick={exportCSV} disabled={filtered.length === 0}>
            <FileDown size={15} /> {t("Export CSV")}
          </button>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {notice && <div className="notice-banner">{notice}</div>}

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
          <Loader2 size={30} className="animate-spin" style={{ color: "#3E5EDB" }} />
        </div>
      ) : (
        <>
          <div className="rp-stats">
            <div className="rp-stat"><div className="rp-stat-value">{reports.length}</div><div className="rp-stat-label">{t("Total reports")}</div></div>
            <div className="rp-stat"><div className="rp-stat-value" style={{ color: "#D69A1E" }}>{reports.filter((r) => !r.read).length}</div><div className="rp-stat-label">{t("Pending")}</div></div>
            <div className="rp-stat"><div className="rp-stat-value" style={{ color: "#2E9E6C" }}>{reports.filter((r) => r.read).length}</div><div className="rp-stat-label">{t("Resolved")}</div></div>
          </div>

          <div className="rp-panel">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <FileBarChart size={18} style={{ color: "#3E5EDB" }} />
              <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, color: "#182644", fontSize: 15 }}>
                {t("Reports (")}{filtered.length}{t(")")}
              </span>
            </div>

            {filtered.length > 0 ? (
              <table className="rp-table">
                <thead>
                  <tr>
                    <th>{t("Reporter")}</th>
                    <th>{t("Reported")}</th>
                    <th>{t("Category")}</th>
                    <th>{t("Report")}</th>
                    <th>{t("Date")}</th>
                    <th>{t("Status")}</th>
                    <th>{t("Actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id} style={!r.read ? { background: "#FBF7EE" } : undefined}>
                      <td style={{ whiteSpace: "nowrap" }}>
                        <div style={{ fontWeight: 600, color: "#182644" }}>{r.name || "-"}</div>
                        <div style={{ color: "#3E5EDB", fontSize: 11.5, fontWeight: 700 }}>{r.email || ""}</div>
                        <div style={{ fontSize: 11, color: "#9A8F80" }}>{r.role || ""}</div>
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        <div style={{ fontWeight: 600, color: "#182644" }}>{r.subjectName || "-"}</div>
                        <div style={{ fontSize: 11, color: "#6B7280" }}>{r.subjectEmail || ""} {r.subjectRole || ""}</div>
                      </td>
                      <td><span className="type-pill" style={{ background: typeColor(r.category) }}>{r.category || t("Other")}</span></td>
                      <td>
                        <div className="rp-report-body">{r.description || ""}</div>
                      </td>
                      <td style={{ whiteSpace: "nowrap", color: "#6B7280" }}>{r.date || r.createdAt?.slice?.(0, 10) || "-"}</td>
                      <td>
                        <span className="type-pill" style={{ background: r.read ? "#2E9E6C" : "#D69A1E" }}>
                          {r.read ? t("Resolved") : t("Pending")}
                        </span>
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        <button
                          className={"rp-btn " + (r.read ? "rp-reopen" : "rp-resolve")}
                          onClick={() => toggleRead(r)}
                        >
                          {r.read ? <><RotateCcw size={13} /> {t("Reopen")}</> : <><CheckCircle2 size={13} /> {t("Resolve")}</>}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ color: "#6B7280", fontSize: 13.5, padding: "20px 0" }}>
                {q || statusFilter !== "ALL" ? t("No reports match your filters.") : t("No reports submitted yet.")}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
