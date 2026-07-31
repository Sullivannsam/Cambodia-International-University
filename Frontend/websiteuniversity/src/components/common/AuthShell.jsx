const AuthShell = ({ icon, title, subtitle, children, footer, navbarOffset }) => {
  return (
    <div className="auth-shell" style={{ minHeight: navbarOffset ? "calc(100vh - 64px)" : "100vh" }}>
      <style>{`
        .auth-shell {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 20px;
          position: relative;
          overflow: hidden;
          background: var(--bg-secondary);
          font-family: 'Inter', system-ui, sans-serif;
        }
        .auth-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          pointer-events: none;
        }
        .auth-blob-1 { width: 340px; height: 340px; background: #3E5EDB; top: -90px; left: -70px; opacity: 0.4; }
        .auth-blob-2 { width: 300px; height: 300px; background: #7A5CDB; bottom: -80px; right: -50px; opacity: 0.35; }
        .auth-blob-3 { width: 210px; height: 210px; background: #F2C14E; top: 28%; right: 10%; opacity: 0.18; }
        .auth-card {
          position: relative;
          z-index: 1;
          width: min(100%, 460px);
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 22px;
          padding: 38px 36px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.14);
          animation: authPop 0.45s cubic-bezier(0.34,1.56,0.64,1);
        }
        .auth-brand {
          width: 58px; height: 58px; border-radius: 18px;
          background: linear-gradient(135deg,#3E5EDB,#7A5CDB);
          color: #fff; display: flex; align-items: center; justify-content: center;
          margin: 0 auto 18px;
          box-shadow: 0 10px 24px rgba(62,94,219,0.4);
        }
        .auth-title { text-align: center; font-size: 22px; font-weight: 800; color: var(--text-primary); margin: 0; }
        .auth-subtitle { text-align: center; font-size: 13.5px; color: var(--text-secondary); margin: 8px 0 24px; line-height: 1.55; }
        .auth-field { margin-bottom: 16px; }
        .auth-label { display: block; font-size: 12.5px; font-weight: 600; color: var(--text-primary); margin-bottom: 7px; }
        .auth-input-wrap { position: relative; }
        .auth-input-wrap .auth-input { padding-right: 46px; }
        .auth-input {
          width: 100%; padding: 12px 15px; border-radius: 12px;
          border: 1.5px solid var(--border); background: var(--input-bg);
          font-size: 14px; color: var(--text-primary); outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .auth-input::placeholder { color: var(--text-muted); }
        .auth-input:focus { border-color: #3E5EDB; box-shadow: 0 0 0 3px rgba(62,94,219,0.15); }
        .auth-toggle-pw {
          position: absolute; right: 5px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: var(--text-muted); padding: 8px; display: flex;
          transition: color 0.2s;
        }
        .auth-toggle-pw:hover { color: #3E5EDB; }
        .auth-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
        .auth-check { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-secondary); cursor: pointer; user-select: none; }
        .auth-check input { accent-color: #3E5EDB; width: 15px; height: 15px; cursor: pointer; }
        .auth-link { color: #3E5EDB; text-decoration: none; font-size: 13px; font-weight: 600; transition: color 0.2s; }
        .auth-link:hover { color: #3049B0; text-decoration: underline; }
        .auth-btn {
          width: 100%; padding: 13px 0; border: none; border-radius: 12px;
          background: linear-gradient(135deg,#3E5EDB,#7A5CDB); color: #fff;
          font-size: 15px; font-weight: 700; cursor: pointer;
          box-shadow: 0 10px 24px rgba(62,94,219,0.35);
          transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
        }
        .auth-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(62,94,219,0.45); }
        .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .auth-error {
          background: rgba(210,72,60,0.1); border: 1px solid rgba(210,72,60,0.35);
          color: #D2483C; border-radius: 10px; padding: 10px 14px;
          font-size: 13px; margin-bottom: 16px; text-align: center; font-weight: 600;
        }
        .auth-success {
          background: rgba(46,158,108,0.1); border: 1px solid rgba(46,158,108,0.35);
          color: #2E9E6C; border-radius: 10px; padding: 12px 14px;
          font-size: 13px; margin-bottom: 16px; text-align: center; font-weight: 600; line-height: 1.6;
        }
        .auth-divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; }
        .auth-divider::before, .auth-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
        .auth-divider span { font-size: 11.5px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; }
        .auth-social { display: flex; justify-content: center; gap: 12px; margin-bottom: 4px; }
        .auth-social-btn {
          width: 46px; height: 46px; border-radius: 12px; border: 1.5px solid var(--border);
          background: var(--bg-card); display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: var(--text-secondary); transition: all 0.2s ease;
        }
        .auth-social-btn:hover { border-color: #3E5EDB; color: #3E5EDB; transform: translateY(-2px); box-shadow: 0 6px 14px rgba(62,94,219,0.18); }
        .auth-footer { margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border); text-align: center; }
        .auth-footer-text { font-size: 13.5px; color: var(--text-secondary); line-height: 1.7; }
        .auth-footer-links { display: flex; gap: 10px; margin-top: 14px; }
        .auth-footer-link {
          flex: 1; text-align: center; padding: 10px 8px; font-size: 13px; font-weight: 600;
          border-radius: 10px; background: var(--hover-bg); color: #3E5EDB;
          text-decoration: none; transition: all 0.2s ease;
        }
        .auth-footer-link:hover { background: rgba(62,94,219,0.12); transform: translateY(-1px); }
        @keyframes authPop {
          from { opacity: 0; transform: translateY(18px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (max-width: 480px) {
          .auth-card { padding: 28px 22px; }
        }
      `}</style>

      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />
      <div className="auth-blob auth-blob-3" />

      <div className="auth-card">
        {icon && <div className="auth-brand">{icon}</div>}
        <h1 className="auth-title">{title}</h1>
        {subtitle && <p className="auth-subtitle">{subtitle}</p>}
        {children}
        {footer && <div className="auth-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default AuthShell;
