import { useState } from 'react';
import { Loader2, TrendingUp, Play, CheckCircle2, XCircle, FileText, AlertTriangle } from 'lucide-react';
import { getProgressionPreview, processProgression } from "../../services/endpoints";
import { useLanguage } from "../../context/LanguageContext";

export default function Progression({ onDoneChange }) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [rows, setRows] = useState(null);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const runPreview = async () => {
    setLoading(true);
    setError("");
    setSummary(null);
    try {
      const data = await getProgressionPreview();
      setRows(Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : []);
      onDoneChange?.(false);
    } catch (e) {
      setRows([]);
      setError(e?.status === 404
        ? t("Progression API not available yet. Waiting for backend.")
        : (e?.message || t("Failed to load progression preview.")));
    } finally {
      setLoading(false);
    }
  };

  const runProcess = async () => {
    if (!window.confirm(t("This will promote passing students and create their tuition invoices. Continue?"))) return;
    setProcessing(true);
    setError("");
    try {
      const data = await processProgression();
      const results = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];
      setRows(results);
      setSummary({
        promoted: data.promoted ?? results.filter((r) => r.passed).length,
        repeated: data.repeated ?? results.filter((r) => !r.passed).length,
        invoicesCreated: data.invoicesCreated ?? "—",
      });
      onDoneChange?.(true);
    } catch (e) {
      setError(e?.message || t("Failed to process progression."));
    } finally {
      setProcessing(false);
    }
  };

  const filtered = (rows || []).filter((r) =>
    `${r.name} ${r.studentEmail}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="em-wrap">
      <style>{`
        .pg-chip { display:inline-block; padding:4px 12px; border-radius:999px; font-size:12.5px; font-weight:700; }
        .pg-pass { background:#E3F0E7; color:#1E7A4E; }
        .pg-fail { background:#FBE3E0; color:#D2483C; }
        .pg-head { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; margin-bottom:18px; }
        .pg-btn {
          display:inline-flex; align-items:center; gap:7px;
          padding:9px 16px; border:none; border-radius:10px; cursor:pointer;
          font-weight:600; font-size:13.5px; transition:filter .15s ease, opacity .15s ease;
        }
        .pg-btn:hover:not(:disabled) { filter:brightness(0.95); }
        .pg-btn:disabled { opacity:.55; cursor:not-allowed; }
        .pg-search {
          width:100%; max-width:340px; padding:10px 14px; margin-bottom:16px;
          border:1px solid rgba(0,0,0,0.12); border-radius:10px;
          font-size:14px; background:var(--bg-primary,#fff); color:var(--text-primary,#182644); outline:none;
        }
        .pg-search:focus { border-color:#3E5EDB; }
        .pg-table-wrap { overflow-x:auto; border-radius:12px; border:1px solid rgba(0,0,0,0.08); }
        .pg-table { width:100%; border-collapse:collapse; min-width:640px; font-size:14px; }
        .pg-table th { background:#182644; color:#fff; padding:12px 14px; text-align:left; white-space:nowrap; }
        .pg-table td { padding:11px 14px; border-top:1px solid rgba(0,0,0,0.07); color:var(--text-primary,#182644); }
        .pg-table tr:hover td { background:rgba(62,94,219,0.05); }
      `}</style>

      <div className="pg-head">
        <div>
          <h2 style={{ margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
            <TrendingUp size={20} color="#3E5EDB" /> {t("Academic Progression")}
          </h2>
          <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 14 }}>
            {t("Review final scores, promote students who pass, and auto-create next-semester invoices.")}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="pg-btn" style={{ background: "#E8EDFB", color: "#3E5EDB" }} disabled={loading || processing} onClick={runPreview}>
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Play size={15} />}
            {loading ? t("Checking...") : t("Preview Results")}
          </button>
          <button
            className="pg-btn"
            style={{ background: rows?.length ? "#1E7A4E" : "#c8d6cd", color: "#fff" }}
            disabled={!rows?.length || processing}
            onClick={runProcess}
          >
            {processing ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
            {processing ? t("Processing...") : t("Process Semester")}
          </button>
        </div>
      </div>

      {summary && (
        <div style={{
          display: "flex", gap: 14, flexWrap: "wrap", margin: "16px 0",
          padding: "14px 18px", borderRadius: 12, background: "#E3F0E7", border: "1px solid #1E7A4E33",
        }}>
          <span style={{ fontWeight: 700, color: "#1E7A4E" }}>✓ {t("Done")}</span>
          <span>{t("Promoted")}: <strong>{summary.promoted}</strong></span>
          <span>{t("Repeating")}: <strong>{summary.repeated}</strong></span>
          <span>{t("Invoices created")}: <strong>{summary.invoicesCreated}</strong></span>
        </div>
      )}

      {error && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8, margin: "16px 0",
          padding: "12px 16px", borderRadius: 12, background: "#FBE3E0", color: "#D2483C", fontSize: 14,
        }}>
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {rows !== null && (
        <>
          <input
            className="pg-search"
            placeholder={t("Search by name or email...")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {filtered.length ? (
            <div className="pg-table-wrap">
              <table className="pg-table">
                <thead>
                  <tr>
                    <th>{t("Student")}</th>
                    <th>{t("Email")}</th>
                    <th>{t("Year")}</th>
                    <th>{t("Semester")}</th>
                    <th>{t("Average Score")}</th>
                    <th>{t("Result")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.studentEmail}>
                      <td style={{ fontWeight: 600, color: "#182644" }}>{r.name || "-"}</td>
                      <td>{r.studentEmail}</td>
                      <td>{r.year ?? "-"}</td>
                      <td>{r.semester ?? "-"}</td>
                      <td style={{ fontWeight: 700 }}>{Number(r.avgScore).toFixed(2)}</td>
                      <td>
                        <span className={`pg-chip ${r.passed ? "pg-pass" : "pg-fail"}`}>
                          {r.passed ? `✓ ${t("PASS → promoted")}` : `✗ ${t("FAIL → repeats")}`}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: "#64748b", textAlign: "center", padding: "32px 0" }}>
              {t("No student scores found for this semester.")}
            </p>
          )}

          <p style={{ display: "flex", alignItems: "center", gap: 6, color: "#94a3b8", fontSize: 13, marginTop: 14 }}>
            <FileText size={13} />
            {t("Passing students receive an invoice automatically. Failing students keep their current year and semester.")}
          </p>
        </>
      )}
    </div>
  );
}
