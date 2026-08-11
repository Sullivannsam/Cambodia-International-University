import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getNews } from '../../services/endpoints';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';
import Skeleton from '../../components/common/Skeleton';
import { useLanguage } from "../../context/LanguageContext";

export default function NewsDetail() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getNews()
      .then((data) => {
        const list = Array.isArray(data) ? data : Array.isArray(data.news) ? data.news : [];
        const found = list.find((n) =>
          String(n.id) === String(id) ||
          (n.slug && n.slug === id) ||
          encodeURIComponent(n.title || "") === id
        );
        setNews(found || null);
        setNotFound(!found);
      })
      .catch(() => {
        setNews(null);
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const formatDate = (v) => {
    if (!v) return "";
    const d = new Date(v);
    return isNaN(d.getTime()) ? v : d.toLocaleDateString("en-US", { dateStyle: "long" });
  };

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/public/news");
  };

  const share = () => {
    if (navigator.share) {
      navigator.share({ title: news?.title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", background: "var(--bg-secondary)", fontFamily: "'Inter',system-ui,sans-serif" }}>
      <style>{`
        .nd-wrap { max-width: 780px; margin: 0 auto; padding: 40px 24px 70px; }
        .nd-back {
          display: inline-flex; align-items: center; gap: 8px; background: none; border: none;
          color: #3E5EDB; font-size: 14px; font-weight: 600; cursor: pointer; margin-bottom: 22px; padding: 0; font-family: inherit;
        }
        .nd-img {
          width: 100%; height: 320px; object-fit: cover; border-radius: 20px;
          background: linear-gradient(135deg,#3E5EDB,#7A5CDB); display: flex; align-items: center; justify-content: center;
          font-size: 64px; margin-bottom: 26px; box-shadow: 0 16px 40px rgba(0,0,0,0.15);
        }
        .nd-meta { display: flex; gap: 18px; flex-wrap: wrap; font-size: 12.5px; color: var(--text-muted); margin-bottom: 14px; }
        .nd-meta span { display: inline-flex; align-items: center; gap: 6px; }
        .nd-title { font-size: clamp(22px, 5vw, 32px); font-weight: 800; color: var(--text-primary); line-height: 1.25; margin: 0 0 24px; }
        .nd-body { font-size: 15px; color: var(--text-secondary); line-height: 1.9; white-space: pre-wrap; }
        .nd-share {
          display: inline-flex; align-items: center; gap: 8px; margin-top: 30px;
          padding: 10px 18px; border-radius: 10px; border: 1.5px solid var(--border);
          background: none; color: #3E5EDB; font-weight: 600; font-size: 13.5px; cursor: pointer;
        }
      `}</style>

      <div className="nd-wrap">
        <button className="nd-back" onClick={goBack}><ArrowLeft size={16} /> {t("Back")}</button>

        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Skeleton height={320} radius={20} />
            <Skeleton height={36} width="80%" />
            <Skeleton height={16} width="40%" />
            <Skeleton height={200} radius={12} />
          </div>
        )}

        {!loading && notFound && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 72, marginBottom: 10 }}>📰</div>
            <h2 style={{ color: "var(--text-primary)", margin: 0 }}>{t("Article not found")}</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>{t("This article doesn't exist or may have been removed.")}</p>
            <Link to="/" className="nd-back" style={{ marginTop: 16 }}>{t("Back to Home")}</Link>
          </div>
        )}

        {!loading && news && (
          <>
            {news.imageUrl || news.image ? (
              <img className="nd-img" src={news.imageUrl || news.image} alt={news.title} />
            ) : (
              <div className="nd-img">📰</div>
            )}

            <div className="nd-meta">
              <span><Calendar size={14} /> {formatDate(news.date || news.publishedAt || news.createdAt)}</span>
              {news.author && <span><User size={14} /> {t("By")} {news.author}</span>}
            </div>

            <h1 className="nd-title">{news.title || news.headline}</h1>
            <div className="nd-body">{news.content || news.body || news.description}</div>

            <button className="nd-share" onClick={share}><Share2 size={15} /> {t("Share")}</button>
          </>
        )}
      </div>
    </div>
  );
}
