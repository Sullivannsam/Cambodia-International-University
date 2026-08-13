import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner';
import { useLanguage } from "../../context/LanguageContext";

export default function LogoutModal({ className, style, children }) {
  const { t } = useLanguage();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const confirmLogout = () => {
    setShowConfirm(false);
    setLoggingOut(true);
    setTimeout(() => {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("role");
      sessionStorage.removeItem("email");
      sessionStorage.removeItem("user");
      navigate("/", { state: { logoutSuccess: true } });
    }, 2000);
  };

  return (
    <>
      <button className={className} style={style} onClick={() => setShowConfirm(true)}>
        {children}
      </button>

      {showConfirm && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9998,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
          animation: "logModalFade 0.25s ease",
        }}>
          <div style={{
            background: "#ffffff", borderRadius: 16,
            padding: "28px 32px", width: "min(90vw, 400px)",
            textAlign: "center", boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
            animation: "logModalPop 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}>
            <div style={{
              width: 56, height: 56, margin: "0 auto 16px",
              borderRadius: "50%",
              background: "#FBE3E0", color: "#ef4444",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1F2430" }}>
              {t("Are you sure you want to logout?")}
            </h3>
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button onClick={() => setShowConfirm(false)} style={{
                flex: 1, padding: "11px 0", borderRadius: 10,
                border: "1.5px solid #E5E7EB", background: "#F3F4F6",
                color: "#4B5563", fontSize: 14, fontWeight: 600, cursor: "pointer",
              }}>
                {t("Cancel")}
              </button>
              <button onClick={confirmLogout} style={{
                flex: 1, padding: "11px 0", borderRadius: 10,
                border: "none", background: "#ef4444", color: "white",
                fontSize: 14, fontWeight: 600, cursor: "pointer",
              }}>
                {t("Logout")}
              </button>
            </div>
          </div>
        </div>
      )}

      {loggingOut && <Spinner text={t("Logging out...")} />}

      <style>{`
        @keyframes logModalFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes logModalPop {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
