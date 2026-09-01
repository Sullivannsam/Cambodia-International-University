import React, { useState, useEffect } from "react";
import {
  Search, Loader2, Pencil, Trash2, X, Plus, Newspaper, Upload
} from "lucide-react";
import { getNews, createNews, updateNews, deleteNews } from "../../services/endpoints";
import { useLanguage } from "../../context/LanguageContext";

const emptyForm = () => ({
  title: "",
  content: "",
  author: "",
  imageUrl: "",
  published: true,
  scheduleAt: "",
});

export default function NewsManagement() {
  const { t } = useLanguage();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null); // { mode: "add" } | { mode: "edit", item }
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getNews();
      setNews(Array.isArray(data) ? data : Array.isArray(data.news) ? data.news : []);
    } catch {
      setError(t("Failed to load news. Make sure the backend server is running."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm(emptyForm());
    setError("");
    setModal({ mode: "add" });
  };

  const openEdit = (n) => {
    setForm({
      title: n.title || n.headline || "",
      content: n.content || n.body || n.description || "",
      author: n.author || "",
      imageUrl: n.imageUrl || n.image || "",
      published: n.published === false ? false : true,
      scheduleAt: n.scheduleAt || n.scheduledFor || "",
    });
    setError("");
    setModal({ mode: "edit", item: n });
  };

  const closeModal = () => {
    setModal(null);
    setError("");
  };

  const compressImage = (file, maxSize = 800, quality = 0.82) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError(t("Please choose an image file."));
      return;
    }
    try {
      const dataUrl = await compressImage(file);
      setForm({ ...form, imageUrl: dataUrl });
    } catch {
      setError(t("Could not read that image. Please try another one."));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError(t("News title and content are required."));
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (modal.mode === "add") {
        await createNews(form);
        setNotice(`${t('News "')}${form.title}${t('" published successfully.')}`);
      } else {
        await updateNews(modal.item.id, form);
        setNotice(`${t('News "')}${form.title}${t('" updated successfully.')}`);
      }
      closeModal();
      load();
    } catch {
      setError(modal.mode === "add"
        ? t("Failed to publish news. Please try again.")
        : t("Failed to update news. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  const requestDelete = (n) => setConfirm({ item: n });

  const runDelete = async () => {
    if (!confirm) return;
    const n = confirm.item;
    setConfirm(null);
    setError("");
    try {
      await deleteNews(n.id);
      setNotice(`${t('News "')}${n.title}${t('" deleted successfully.')}`);
      load();
    } catch {
      setError(t("Failed to delete news. Please try again."));
    }
  };

  const q = query.trim().toLowerCase();
  const filtered = q
    ? news.filter((n) =>
        [n.title, n.headline, n.content, n.author, n.category]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      )
    : news;

  const formatDate = (v) => {
    if (!v) return "-";
    const d = new Date(v);
    return isNaN(d.getTime()) ? v : d.toLocaleDateString("en-US", { dateStyle: "medium" });
  };

  return (
    <div className="nm">
      <style>{`
        .nm .content-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 22px; gap: 20px; flex-wrap: wrap;
        }
        .nm .date-label { color: #6B7280; font-size: 13.5px; }
        .nm .search-box {
          display: flex; align-items: center; gap: 8px; background: #EFEBE3;
          border-radius: 10px; padding: 9px 14px; width: 260px; color: #8A8378;
        }
        .nm .search-box input { border: none; outline: none; background: transparent; font-size: 13px; width: 100%; color: #1F2430; }
        .nm .add-btn {
          background: #3E5EDB; color: #fff; border: none; padding: 10px 18px; border-radius: 9px;
          font-size: 13px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
          box-shadow: 0 6px 16px rgba(62,94,219,0.35);
        }
        .nm .error-banner {
          background: #FBE3E0; border: 1px solid #E0665A; color: #D2483C;
          border-radius: 10px; padding: 12px 18px; font-size: 13px; margin-bottom: 20px;
        }
        .nm .notice-banner {
          background: #E3F0E7; border: 1px solid #2E9E6C; color: #1E7A4E;
          border-radius: 10px; padding: 12px 18px; font-size: 13px; margin-bottom: 20px;
        }
        .nm .news-panel { background: #fff; border-radius: 14px; padding: 22px; box-shadow: 0 4px 16px rgba(24,38,68,0.06); }
        .nm .news-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .nm .news-table th { text-align: left; color: #3E5EDB; border-bottom: 2px solid #E5E7EB; padding: 10px 12px; }
        .nm .news-table td { padding: 10px 12px; border-bottom: 1px solid #F0EEE9; vertical-align: top; }
        .nm .btn-edit, .nm .btn-remove {
          border: none; border-radius: 7px; font-size: 11px; font-weight: 700;
          padding: 6px 12px; cursor: pointer; color: #fff; display: inline-flex; align-items: center; gap: 6px;
        }
        .nm .btn-edit { background: #3E5EDB; margin-right: 6px; }
        .nm .btn-edit:hover { background: #3049B0; }
        .nm .btn-remove { background: #D2483C; }
        .nm .btn-remove:hover { background: #B93A30; }
        .nm .status-pill { color: #fff; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 999px; }
        .nm .news-title-cell { max-width: 320px; font-weight: 600; color: #182644; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .nm .nm-overlay {
          position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center;
          animation: nmFade 0.25s ease;
        }
        .nm .nm-modal { background: #fff; border-radius: 16px; padding: 22px 24px; width: min(92vw, 480px); max-height: 88vh; overflow-y: auto; animation: nmPop 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .nm .nm-modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .nm .nm-modal-title { font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 16px; color: #182644; }
        .nm .nm-close { background: #F6F4EF; border: none; border-radius: 8px; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; color: #6B7280; cursor: pointer; }
        .nm .nm-field { margin-bottom: 14px; }
        .nm .nm-label { display: block; font-size: 12.5px; font-weight: 600; color: #182644; margin-bottom: 6px; }
        .nm .nm-input {
          width: 100%; padding: 11px 14px; border: 1.5px solid #E5E7EB; border-radius: 10px;
          font-size: 13.5px; outline: none; background: #FBFBF9; color: #1F2430;
        }
        .nm .nm-input:focus { border-color: #3E5EDB; }
        .nm .nm-input-row { display: flex; gap: 14px; }
        .nm .nm-input-row .nm-field { flex: 1; }
        .nm .nm-img-box {
          display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 6px;
          border: 2px dashed #CBD0DB; border-radius: 10px; padding: 12px; cursor: pointer;
          background: #FBFBF9; color: #8A8378; font-size: 12px; text-align: center;
          transition: border-color 0.2s; min-height: 88px; overflow: hidden;
        }
        .nm .nm-img-box:hover { border-color: #3E5EDB; color: #3E5EDB; }
        .nm .nm-img-preview { max-width: 100%; max-height: 100px; border-radius: 8px; object-fit: cover; }
        .nm .nm-img-remove {
          margin-top: 8px; border: none; background: #FBE3E0; color: #D2483C; font-size: 12px;
          font-weight: 600; padding: 6px 12px; border-radius: 8px; cursor: pointer;
        }
        .nm .nm-textarea { resize: vertical; min-height: 110px; font-family: inherit; }
        .nm .nm-toggle-row { display: flex; align-items: center; gap: 10px; padding: 10px 0; }
        .nm .nm-toggle { width: 40px; height: 22px; border-radius: 999px; border: none; cursor: pointer; position: relative; transition: background 0.2s; }
        .nm .nm-toggle::after {
          content: ''; position: absolute; top: 3px; left: 3px; width: 16px; height: 16px;
          background: #fff; border-radius: 50%; transition: transform 0.2s;
        }
        .nm .nm-toggle.on { background: #3E5EDB; }
        .nm .nm-toggle.on::after { transform: translateX(18px); }
        .nm .nm-toggle.off { background: #CBD0DB; }
        .nm .nm-modal-foot { display: flex; gap: 12px; margin-top: 22px; }
        .nm .nm-cancel {
          flex: 1; padding: 11px 0; border-radius: 10px; border: 1.5px solid #E5E7EB;
          background: #F6F4EF; color: #6B7280; font-size: 14px; font-weight: 600; cursor: pointer;
        }
        .nm .nm-save {
          flex: 1; padding: 11px 0; border-radius: 10px; border: none; background: #3E5EDB; color: #fff;
          font-size: 14px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center;
          justify-content: center; gap: 8px; box-shadow: 0 6px 16px rgba(62,94,219,0.35);
        }
        .nm .nm-save:disabled { opacity: 0.6; cursor: not-allowed; }
        .nm .nm-delete-btn {
          flex: 1; padding: 11px 0; border-radius: 10px; border: none; background: #D2483C; color: #fff;
          font-size: 14px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center;
          justify-content: center; gap: 8px; box-shadow: 0 6px 16px rgba(210,72,60,0.35);
        }
        .nm .nm-icon { width: 56px; height: 56px; margin: 0 auto 14px; border-radius: 50%; background: #FBE3E0; color: #D2483C; display: flex; align-items: center; justify-content: center; }
        @keyframes nmFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes nmPop { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
      `}</style>

      <div className="content-row">
        <div className="date-label">{t("Publish and manage news articles shown on the homepage.")}</div>
        <div style={{ display: "flex", gap: 12 }}>
          <div className="search-box">
            <Search size={15} />
            <input
              placeholder={t("Search news...")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button className="add-btn" onClick={openAdd}><Plus size={15} /> {t("Post News")}</button>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {notice && <div className="notice-banner">{notice}</div>}

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
          <Loader2 size={30} className="animate-spin" style={{ color: "#3E5EDB" }} />
        </div>
      ) : (
        <div className="news-panel">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <Newspaper size={18} style={{ color: "#3E5EDB" }} />
            <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, color: "#182644", fontSize: 15 }}>
              {t("News Posts (")}{filtered.length}{t(")")}
            </span>
          </div>
          {filtered.length > 0 ? (
            <table className="news-table">
              <thead>
                <tr>
                  <th>{t("ID")}</th>
                  <th>{t("Title")}</th>
                  <th>{t("Author")}</th>
                  <th>{t("Date")}</th>
                  <th>{t("Status")}</th>
                  <th>{t("Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((n) => (
                  <tr key={n.id}>
                    <td style={{ fontWeight: 700, color: "#3E5EDB" }}>{n.id}</td>
                    <td className="news-title-cell" title={n.title}>{n.title || n.headline || "-"}</td>
                    <td>{n.author || "-"}</td>
                    <td style={{ whiteSpace: "nowrap", color: "#6B7280" }}>{formatDate(n.date || n.publishedAt || n.createdAt)}</td>
                    <td>
                      <span
                        className="status-pill"
                        style={{
                          background: n.scheduleAt && n.published !== false ? "#7A5CDB" : n.published === false ? "#D2483C" : "#2E9E6C",
                        }}
                      >
                        {n.scheduleAt && n.published !== false ? `${t("Scheduled")} ${String(n.scheduleAt).slice(0, 10)}` : n.published === false ? t("Draft") : t("Published")}
                      </span>
                    </td>
                    <td>
                      <button className="btn-edit" onClick={() => openEdit(n)}><Pencil size={13} /> {t("Edit")}</button>
                      <button className="btn-remove" onClick={() => requestDelete(n)}><Trash2 size={13} /> {t("Delete")}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ color: "#6B7280", fontSize: 13.5, padding: "20px 0" }}>
              {q ? `${t('No news match "')}${query}${t('".')}` : t('No news yet. Click "Post News" to publish the first article.')}
            </div>
          )}
        </div>
      )}

      {modal && (
        <div className="nm-overlay">
          <div className="nm-modal">
            <div className="nm-modal-head">
              <div className="nm-modal-title">{modal.mode === "add" ? t("Post News") : `${t("Edit News #")}${modal.item.id}`}</div>
              <button className="nm-close" onClick={closeModal} aria-label={t("Close")}><X size={18} /></button>
            </div>

            <form onSubmit={handleSave}>
              <div className="nm-field">
                <label className="nm-label">{t("Title")}</label>
                <input
                  className="nm-input"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder={t("e.g. CIU wins national coding competition")}
                  required
                />
              </div>

              <div className="nm-input-row">
                <div className="nm-field">
                  <label className="nm-label">{t("Author")}</label>
                  <input
                    className="nm-input"
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    placeholder={t("e.g. Admin")}
                  />
                </div>
                <div className="nm-field">
                  <label className="nm-label">{t("Image")}</label>
                  <label className="nm-img-box">
                    {form.imageUrl ? (
                      <img src={form.imageUrl} alt="preview" className="nm-img-preview" />
                    ) : (
                      <>
                        <Upload size={22} />
                        <span>{t("Click to choose a photo from your device")}</span>
                      </>
                    )}
                    <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                  </label>
                  {form.imageUrl && (
                    <button type="button" className="nm-img-remove" onClick={() => setForm({ ...form, imageUrl: "" })}>
                      {t("Remove image")}
                    </button>
                  )}
                </div>
              </div>

              <div className="nm-field">
                <label className="nm-label">{t("Content")}</label>
                <textarea
                  className="nm-input nm-textarea"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder={t("Write the news article content...")}
                  required
                />
              </div>

              <div className="nm-field">
                <label className="nm-label">{t("Publish on (optional)")}</label>
                <input
                  className="nm-input"
                  type="datetime-local"
                  value={form.scheduleAt}
                  onChange={(e) => setForm({ ...form, scheduleAt: e.target.value })}
                />
                <div style={{ fontSize: 11.5, color: "#9A8F80", marginTop: 4 }}>
                  {t("Leave empty to publish immediately. Setting a date schedules the post.")}
                </div>
              </div>

              <div className="nm-toggle-row">
                <button
                  type="button"
                  className={"nm-toggle " + (form.published ? "on" : "off")}
                  onClick={() => setForm({ ...form, published: !form.published })}
                  aria-label={t("Toggle published")}
                />
                <span className="nm-label" style={{ margin: 0 }}>{form.published ? t("Published (visible on homepage)") : t("Draft (hidden on homepage)")}</span>
              </div>

              <div className="nm-modal-foot">
                <button type="button" className="nm-cancel" onClick={closeModal}>{t("Cancel")}</button>
                <button type="submit" className="nm-save" disabled={saving}>
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
                  {saving ? t("Saving...") : modal.mode === "add" ? t("Publish News") : t("Save Changes")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirm && (
        <div className="nm-overlay">
          <div className="nm-modal" style={{ textAlign: "center", maxWidth: 420 }}>
            <div className="nm-icon"><Trash2 size={26} /></div>
            <div className="nm-modal-title" style={{ textAlign: "center" }}>{t("Delete news post?")}</div>
            <p style={{ fontSize: 13.5, color: "#6B7280", margin: "10px 0 0", lineHeight: 1.6 }}>
              {t("Are you sure you want to delete news post")}{" "}
              <strong style={{ color: "#182644" }}>{confirm.item.title}</strong>{t("? It will be hidden.")}
            </p>
            <div className="nm-modal-foot">
              <button type="button" className="nm-cancel" onClick={() => setConfirm(null)}>{t("Cancel")}</button>
              <button type="button" className="nm-delete-btn" onClick={runDelete}>
                <Trash2 size={15} /> {t("Delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
