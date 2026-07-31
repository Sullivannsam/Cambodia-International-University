import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNews } from '../../services/endpoints';
import { useLanguage } from '../../context/LanguageContext';
import { SkeletonGrid } from '../common/Skeleton';

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    getNews()
      .then((data) => {
        const list = Array.isArray(data) ? data : Array.isArray(data.news) ? data.news : [];
        const published = list.filter((n) => n.published !== false);
        setNews(published);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && !news.length) return null;

  const formatDate = (v) => {
    if (!v) return "";
    const d = new Date(v);
    return isNaN(d.getTime()) ? v : d.toLocaleDateString("en-US", { dateStyle: "medium" });
  };

  return (
    <section style={{ background: "var(--bg-secondary)", padding: "56px 24px" }}>
      <style>{`
        .news-section {
          max-width: 1200px; margin: 0 auto;
        }
        .news-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        @media (max-width: 640px) {
          .news-grid { grid-template-columns: 1fr; }
        }
        .news-card {
          background: var(--bg-card, #fff);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 6px 20px rgba(0,0,0,0.06);
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease;
          cursor: pointer;
        }
        .news-card:hover { transform: translateY(-4px); box-shadow: 0 14px 34px rgba(0,0,0,0.12); }
        .news-img { width: 100%; height: 160px; object-fit: cover; background: #e2e8f0; display: flex; align-items: center; justify-content: center; color: #94a3b8; }
        .news-body { padding: 16px 18px 20px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .news-meta { font-size: 12px; color: var(--text-muted, #64748b); display: flex; justify-content: space-between; align-items: center; }
        .news-date { font-weight: 600; }
        .news-title { font-size: 16px; font-weight: 700; color: var(--text-primary); line-height: 1.35; font-family: 'Sora','Inter',sans-serif; }
        .news-content { font-size: 13px; color: var(--text-secondary); line-height: 1.65; }
        .news-read { font-size: 12.5px; font-weight: 700; color: #3E5EDB; margin-top: auto; }
      `}</style>

      <div className="news-section">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <h2 style={{ fontSize: "clamp(18px, 4vw, 26px)", fontWeight: 800, color: "var(--text-primary)", margin: 0, fontFamily: "'Sora','Inter',sans-serif" }}>
            {t("latestNews")}
          </h2>
          <span style={{ fontSize: 13, color: "var(--text-muted, #64748b)" }}>
            {loading ? "" : `${news.length} ${news.length === 1 ? t("article") : t("articles")}`}
          </span>
        </div>

        {loading ? (
          <SkeletonGrid count={3} />
        ) : (
          <div className="news-grid">
            {news.map((n) => (
              <article key={n.id} className="news-card" onClick={() => navigate(`/public/news/${n.id}`)}>
                {n.imageUrl || n.image ? (
                  <img className="news-img" src={n.imageUrl || n.image} alt={n.title} />
                ) : (
                  <div className="news-img">📰</div>
                )}
                <div className="news-body">
                  <div className="news-meta">
                    <span className="news-date">{formatDate(n.date || n.publishedAt || n.createdAt)}</span>
                    {n.author && <span>{t("By")} {n.author}</span>}
                  </div>
                  <h3 className="news-title">{n.title || n.headline}</h3>
                  <p className="news-content">{n.content || n.body || n.description}</p>
                  <span className="news-read">{t("Read more")} →</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
