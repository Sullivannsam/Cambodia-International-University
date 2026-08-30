import { useState } from "react";
import { Search, Loader2, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import InfoPage from "../../components/public/InfoPage";
import { useLanguage } from "../../context/LanguageContext";
import { getApplicationStatus } from "../../services/endpoints";

const STATUS_STYLES = {
  APPROVED: { bg: "#E3F0E7", color: "#1E7A4E", icon: CheckCircle2, labelKey: "Approved" },
  REJECTED: { bg: "#FBE3E0", color: "#D2483C", icon: XCircle, labelKey: "Rejected" },
  PENDING: { bg: "#FDF0D9", color: "#9A6B00", icon: Clock, labelKey: "Pending" },
};

export default function ApplicationStatus() {
  const { t } = useLanguage();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const lookup = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    if (!code.trim()) {
      setError(t("Please enter your application code."));
      return;
    }
    setLoading(true);
    try {
      const res = await getApplicationStatus(code.trim());
      if (res && res.error) throw new Error(res.error);
      if (!res || (!res.status && !res.applicationStatus && !res.id)) {
        setResult(null);
        setError(t("No application found with that code."));
      } else {
        setResult(res);
      }
    } catch (err) {
      setError(err?.message || t("Backend lookup failed — make sure the backend server is running."));
    } finally {
      setLoading(false);
    }
  };

  const status = (result?.status || result?.applicationStatus || "").toUpperCase();
  const style = STATUS_STYLES[status] || { bg: "#EEF2F7", color: "#6B7280", icon: AlertCircle, labelKey: "Unknown" };
  const StatusIcon = style.icon;

  return (
    <InfoPage
      icon={<Search size={30} />}
      title={t("Check Application Status")}
      subtitle={t("Enter the application code you received when you submitted your enrollment or scholarship application.")}
    >
      <style>{`
        .as-wrap { max-width: 560px; }
        .as-form {
          display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;
        }
        .as-input {
          flex: 1; min-width: 220px; padding: 12px 16px; font-size: 14px;
          border: 1.5px solid var(--border); border-radius: 10px;
          background: var(--input-bg); color: var(--text-primary); outline: none;
          font-family: inherit;
        }
        .as-input:focus { border-color: #3E5EDB; }
        .as-btn {
          border: none; border-radius: 10px; padding: 12px 22px; font-size: 14px;
          font-weight: 700; color: #fff; cursor: pointer;
          background: linear-gradient(135deg,#3E5EDB,#7A5CDB);
          display: inline-flex; align-items: center; gap: 8px;
          box-shadow: 0 6px 16px rgba(62,94,219,0.35);
        }
        .as-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .as-error {
          background: #FBE3E0; border: 1px solid #E0665A; color: #D2483C;
          border-radius: 10px; padding: 12px 16px; font-size: 13px; margin-bottom: 16px;
          display: flex; align-items: center; gap: 8px;
        }
        .as-card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: 16px; padding: 24px; box-shadow: 0 6px 20px rgba(0,0,0,0.05);
        }
        .as-status {
          display: inline-flex; align-items: center; gap: 8px; font-size: 13px;
          font-weight: 800; padding: 6px 14px; border-radius: 999px; margin-bottom: 16px;
        }
        .as-row {
          display: flex; justify-content: space-between; gap: 12px;
          font-size: 13.5px; padding: 9px 0; border-bottom: 1px solid var(--border);
        }
        .as-row:last-child { border-bottom: none; }
        .as-row-label { color: var(--text-muted); font-weight: 600; }
        .as-row-value { color: var(--text-primary); font-weight: 700; text-align: right; }
        .as-note {
          margin-top: 18px; font-size: 12.5px; color: var(--text-muted);
          background: rgba(62,94,219,0.07); border-radius: 10px; padding: 12px 16px; line-height: 1.6;
        }
      `}</style>

      <div className="as-wrap">
        <form className="as-form" onSubmit={lookup}>
          <input
            className="as-input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={t("e.g. APP-2026-0042")}
            aria-label={t("Application code")}
          />
          <button className="as-btn" type="submit" disabled={loading}>
            {loading ? <Loader2 size={16} style={{ animation: "asSpin 1s linear infinite" }} /> : <Search size={16} />}
            {loading ? t("Checking...") : t("Check Status")}
          </button>
        </form>

        {error && (
          <div className="as-error">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {result && (
          <div className="as-card">
            <span className="as-status" style={{ background: style.bg, color: style.color }}>
              <StatusIcon size={15} /> {t(style.labelKey)}
            </span>
            <div className="as-row">
              <span className="as-row-label">{t("Application code")}</span>
              <span className="as-row-value">{result.code || result.applicationCode || code.trim()}</span>
            </div>
            <div className="as-row">
              <span className="as-row-label">{t("Applicant")}</span>
              <span className="as-row-value">{result.name || result.studentName || "-"}</span>
            </div>
            <div className="as-row">
              <span className="as-row-label">{t("Program")}</span>
              <span className="as-row-value">{result.program || result.course || result.major || "-"}</span>
            </div>
            {result.type && (
              <div className="as-row">
                <span className="as-row-label">{t("Application type")}</span>
                <span className="as-row-value">{result.type}</span>
              </div>
            )}
            {(result.date || result.createdAt) && (
              <div className="as-row">
                <span className="as-row-label">{t("Submitted")}</span>
                <span className="as-row-value">{(result.date || result.createdAt || "").slice(0, 10)}</span>
              </div>
            )}
            {result.message && (
              <div className="as-note">{result.message}</div>
            )}
          </div>
        )}
      </div>

      <style>{`@keyframes asSpin { from { transform: rotate(0); } to { transform: rotate(360deg); } }`}</style>
    </InfoPage>
  );
}
