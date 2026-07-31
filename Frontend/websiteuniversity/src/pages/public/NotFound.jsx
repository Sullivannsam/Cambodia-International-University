import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="err-page">
      <style>{`
        .err-page {
          min-height: 100vh; background: var(--bg-secondary); position: relative;
          overflow: hidden; display: flex; flex-direction: column;
          align-items: center; justify-content: center; text-align: center;
          padding: 40px 20px; font-family: 'Inter', system-ui, sans-serif;
        }
        .err-blob { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
        .err-blob-1 { width: 360px; height: 360px; background: #3E5EDB; top: -110px; left: -80px; opacity: 0.3; }
        .err-blob-2 { width: 320px; height: 320px; background: #7A5CDB; bottom: -100px; right: -60px; opacity: 0.26; }
        .err-content { position: relative; z-index: 1; }
        .err-code {
          font-size: 140px; font-weight: 900; line-height: 1; letter-spacing: -0.04em;
          background: linear-gradient(135deg,#3E5EDB,#7A5CDB); -webkit-background-clip: text;
          background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 14px;
        }
        .err-title { font-size: 24px; font-weight: 800; color: var(--text-primary); margin: 0 0 10px; }
        .err-desc { font-size: 14px; color: var(--text-secondary); line-height: 1.65; margin: 0 0 28px; }
        .err-btn {
          display: inline-flex; align-items: center; gap: 8px; padding: 12px 22px;
          border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer;
          background: none; border: 1.5px solid #3E5EDB; color: #3E5EDB;
          transition: all 0.2s ease;
        }
        .err-btn:hover { background: rgba(62,94,219,0.1); transform: translateY(-2px); }
        @media (max-width: 480px) { .err-code { font-size: 100px; } }
      `}</style>

      <div className="err-blob err-blob-1" />
      <div className="err-blob err-blob-2" />

      <div className="err-content">
        <div className="err-code">404</div>
        <h1 className="err-title">{t("pageNotFound")}</h1>
        <p className="err-desc">{t("pageNotFoundDesc")}</p>
        <button onClick={() => navigate(-1)} className="err-btn"><ArrowLeft size={17} /> {t("goBack")}</button>
      </div>
    </div>
  );
}
