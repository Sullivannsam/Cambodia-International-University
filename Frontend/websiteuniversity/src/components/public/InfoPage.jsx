export default function InfoPage({ icon, title, subtitle, children }) {
  return (
    <div className="ip-page">
      <style>{`
        .ip-page {
          min-height: calc(100vh - 64px); background: var(--bg-secondary);
          font-family: 'Inter', system-ui, sans-serif;
        }
        .ip-hero {
          background: linear-gradient(135deg,#3E5EDB,#7A5CDB); color: #fff;
          padding: 60px 24px 56px; text-align: center; position: relative; overflow: hidden;
        }
        .ip-hero::after {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(circle at 85% 20%, rgba(255,255,255,0.15), transparent 45%);
        }
        .ip-icon {
          width: 64px; height: 64px; border-radius: 20px; margin: 0 auto 18px;
          background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.35);
          display: flex; align-items: center; justify-content: center; position: relative; z-index: 1;
        }
        .ip-title { font-size: clamp(22px, 4vw, 30px); font-weight: 800; margin: 0; position: relative; z-index: 1; }
        .ip-sub { font-size: 14.5px; opacity: 0.9; margin: 10px auto 0; max-width: 620px; line-height: 1.6; position: relative; z-index: 1; }
        .ip-body { max-width: 1000px; margin: 0 auto; padding: 40px 24px 70px; }
      `}</style>

      <div className="ip-hero">
        <div className="ip-icon">{icon}</div>
        <h1 className="ip-title">{title}</h1>
        {subtitle && <p className="ip-sub">{subtitle}</p>}
      </div>

      <div className="ip-body">{children}</div>
    </div>
  );
}
