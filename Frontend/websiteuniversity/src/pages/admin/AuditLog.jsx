import React, { useState, useEffect } from "react";
import {
  Search, Loader2, Trash2, FileClock, ShieldCheck, FileDown
} from "lucide-react";
import { getAuditLogs, clearAuditLogs } from "../../services/endpoints";
import { useLanguage } from "../../context/LanguageContext";

const ACTION_COLORS = {
  CREATE: "#2E9E6C",
  UPDATE: "#3E5EDB",
  DELETE: "#D2483C",
  SUSPEND: "#D69A1E",
  RESTORE: "#7A5CDB",
  LOGIN: "#0E9488",
};

export default function AuditLog() {
  const { t } = useLanguage();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [query, setQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [confirmClear, setConfirmClear] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAuditLogs();
      setLogs(Array.isArray(data) ? data : Array.isArray(data.logs) ? data.logs : []);
    } catch {
      setError(t("Failed to load audit logs. Make sure the backend server is running."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const actions = Array.from(new Set(logs.map((l) => l.action).filter(Boolean)));

  const q = query.trim().toLowerCase();
  const filtered = logs.filter((l) => {
    const matchesQuery = q
      ? [l.actor, l.username, l.email, l.target, l.details, l.ip, String(l.id || "")]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      : true;
    const matchesAction = actionFilter === "ALL" || (l.action || "").toUpperCase() === actionFilter;
    return matchesQuery && matchesAction;
  });

  const handleClear = async () => {
    setConfirmClear(false);
    setError("");
    try {
      await clearAuditLogs();
      setNotice(t("Audit logs cleared successfully."));
      setLogs([]);
    } catch {
      setError(t("Failed to clear audit logs. Please try again."));
    }
  };

  const formatTime = (v) => {
    if (!v) return "-";
    const d = new Date(v);
    return isNaN(d.getTime())
      ? v
      : d.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
  };

  const exportCSV = () => {
    const header = `${t("Timestamp")},${t("Actor")},${t("Action")},${t("Target")},${t("Details")},${t("IP")}`;
    const rows = filtered.map((l) =>
      `"${l.timestamp || l.createdAt || l.date || ""}","${(l.actor || l.username || l.email || "").replace(/"/g, '""')}","${l.action || ""}","${(l.target || "").replace(/"/g, '""')}","${(l.details || l.message || "").replace(/"/g, '""')}","${l.ip || ""}"`
    ).join("\n");
    const blob = new Blob([`${header}\n${rows}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audit-log.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="al">
      <style>{`
        .al .content-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 22px; gap: 20px; flex-wrap: wrap;
        }
        .al .date-label { color: #6B7280; font-size: 13.5px; }
        .al .search-box {
          display: flex; align-items: center; gap: 8px; background: #EFEBE3;
          border-radius: 10px; padding: 9px 14px; width: 240px; color: #8A8378;
        }
        .al .search-box input { border: none; outline: none; background: transparent; font-size: 13px; width: 100%; color: #1F2430; }
        .al .filter-select {
          border: 1.5px solid #E5E7EB; background: #fff; border-radius: 10px;
          padding: 9px 12px; font-size: 13px; color: #182644; outline: none; cursor: pointer;
        }
        .al .clear-btn {
          background: #FBE3E0; color: #D2483C; border: 1.5px solid #E0665A; padding: 9px 16px;
          border-radius: 9px; font-size: 13px; font-weight: 600; cursor: pointer;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .al .clear-btn:hover { background: #F7D4CF; }
        .al .export-btn {
          background: #3E5EDB; color: #fff; border: none; padding: 9px 16px;
          border-radius: 9px; font-size: 13px; font-weight: 600; cursor: pointer;
          display: inline-flex; align-items: center; gap: 8px;
          box-shadow: 0 6px 16px rgba(62,94,219,0.35);
        }
        .al .export-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .al .error-banner {
          background: #FBE3E0; border: 1px solid #E0665A; color: #D2483C;
          border-radius: 10px; padding: 12px 18px; font-size: 13px; margin-bottom: 20px;
        }
        .al .notice-banner {
          background: #E3F0E7; border: 1px solid #2E9E6C; color: #1E7A4E;
          border-radius: 10px; padding: 12px 18px; font-size: 13px; margin-bottom: 20px;
        }
        .al .log-panel { background: #fff; border-radius: 14px; padding: 22px; box-shadow: 0 4px 16px rgba(24,38,68,0.06); }
        .al .log-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .al .log-table th { text-align: left; color: #3E5EDB; border-bottom: 2px solid #E5E7EB; padding: 10px 12px; }
        .al .log-table td { padding: 10px 12px; border-bottom: 1px solid #F0EEE9; vertical-align: top; }
        .al .action-pill { color: #fff; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 999px; display: inline-block; }
        .al .actor-name { font-weight: 600; color: #182644; }
        .al .al-overlay {
          position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center;
          animation: alFade 0.25s ease;
        }
        .al .al-modal { background: #fff; border-radius: 16px; padding: 26px 28px; width: min(90vw, 420px); text-align: center; animation: alPop 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .al .al-title { font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 16px; color: #182644; }
        .al .al-modal-foot { display: flex; gap: 12px; margin-top: 22px; }
        .al .al-cancel {
          flex: 1; padding: 11px 0; border-radius: 10px; border: 1.5px solid #E5E7EB;
          background: #F6F4EF; color: #6B7280; font-size: 14px; font-weight: 600; cursor: pointer;
        }
        .al .al-danger {
          flex: 1; padding: 11px 0; border-radius: 10px; border: none; background: #D2483C; color: #fff;
          font-size: 14px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center;
          justify-content: center; gap: 8px; box-shadow: 0 6px 16px rgba(210,72,60,0.35);
        }
        .al .al-icon { width: 56px; height: 56px; margin: 0 auto 14px; border-radius: 50%; background: #FBE3E0; color: #D2483C; display: flex; align-items: center; justify-content: center; }
        @keyframes alFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes alPop { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
      `}</style>

      <div className="content-row">
        <div className="date-label">{t("Record of admin actions performed across the system.")}</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div className="search-box">
            <Search size={15} />
            <input
              placeholder={t("Search logs...")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          >
            <option value="ALL">{t("All actions")}</option>
            {actions.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <button className="export-btn" onClick={exportCSV} disabled={filtered.length === 0}>
            <FileDown size={15} /> {t("Export CSV")}
          </button>
          <button className="clear-btn" onClick={() => setConfirmClear(true)} disabled={logs.length === 0}>
            <Trash2 size={15} /> {t("Clear Logs")}
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
        <div className="log-panel">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <FileClock size={18} style={{ color: "#3E5EDB" }} />
            <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, color: "#182644", fontSize: 15 }}>
              {t("Audit Logs (")}{filtered.length}{t(")")}
            </span>
          </div>

          {filtered.length > 0 ? (
            <table className="log-table">
              <thead>
                <tr>
                  <th>{t("Timestamp")}</th>
                  <th>{t("Actor")}</th>
                  <th>{t("Action")}</th>
                  <th>{t("Target")}</th>
                  <th>{t("Details")}</th>
                  <th>{t("IP")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => {
                  const action = (l.action || "UNKNOWN").toUpperCase();
                  const color = ACTION_COLORS[action] || "#6B7280";
                  return (
                    <tr key={l.id || `${l.timestamp}-${l.actor}-${l.action}`}>
                      <td style={{ whiteSpace: "nowrap", color: "#6B7280" }}>{formatTime(l.timestamp || l.createdAt || l.date)}</td>
                      <td className="actor-name">{l.actor || l.username || l.email || "-"}</td>
                      <td><span className="action-pill" style={{ background: color }}>{action}</span></td>
                      <td>{l.target || "-"}</td>
                      <td style={{ color: "#6B7280" }}>{l.details || l.message || "-"}</td>
                      <td style={{ color: "#6B7280" }}>{l.ip || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div style={{ color: "#6B7280", fontSize: 13.5, padding: "20px 0", display: "flex", alignItems: "center", gap: 10 }}>
              <ShieldCheck size={18} style={{ color: "#3E5EDB" }} />
              {q || actionFilter !== "ALL"
                ? t("No logs match your filters.")
                : t("No audit logs recorded yet.")}
            </div>
          )}
        </div>
      )}

      {confirmClear && (
        <div className="al-overlay">
          <div className="al-modal">
            <div className="al-icon"><Trash2 size={26} /></div>
            <div className="al-title">{t("Clear all audit logs?")}</div>
            <p style={{ fontSize: 13.5, color: "#6B7280", margin: "10px 0 0", lineHeight: 1.6 }}>
              {t("This will permanently remove all")} {logs.length} {logs.length === 1 ? t("recorded log entry.") : t("recorded log entries.")} {t("This cannot be undone.")}
            </p>
            <div className="al-modal-foot">
              <button type="button" className="al-cancel" onClick={() => setConfirmClear(false)}>{t("Cancel")}</button>
              <button type="button" className="al-danger" onClick={handleClear}>
                <Trash2 size={15} /> {t("Clear Logs")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
