import React, { useState, useEffect } from "react";
import {
  Search, Loader2, Bell, BellRing, Send, X, Megaphone, CheckCheck
} from "lucide-react";
import { getAdminNotifications, broadcastNotification } from "../../services/endpoints";
import { useLanguage } from "../../context/LanguageContext";

const TYPE_COLORS = {
  EXAM: "#3E5EDB",
  PAYMENT: "#D69A1E",
  EVENT: "#2E9E6C",
  GENERAL: "#7A5CDB",
};

export default function NotificationsCenter() {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", type: "GENERAL", audience: "ALL" });
  const [sending, setSending] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAdminNotifications();
      const arr = Array.isArray(data) ? data : Array.isArray(data.notifications) ? data.notifications : [];
      setNotifications(arr);
    } catch {
      setNotifications([]);
      setError(t("Failed to load notifications. Make sure the backend server is running."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? notifications.filter((n) =>
        [n.title, n.body, n.type, n.audience]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      )
    : notifications;

  const sendBroadcast = async () => {
    setError("");
    if (!form.title.trim() || !form.body.trim()) {
      setError(t("Notification title and message are required."));
      return;
    }
    setSending(true);
    try {
      await broadcastNotification({
        title: form.title.trim(),
        body: form.body.trim(),
        type: form.type,
        audience: form.audience,
      });
      setNotifications((prev) => [{
        id: Date.now(),
        title: form.title.trim(),
        body: form.body.trim(),
        type: form.type,
        audience: form.audience,
        date: new Date().toISOString().slice(0, 10),
        read: false,
      }, ...prev]);
      setNotice(t("Notification broadcast sent successfully."));
      setBroadcastOpen(false);
      setForm({ title: "", body: "", type: "GENERAL", audience: "ALL" });
    } catch {
      setError(t("Failed to send broadcast. Make sure the backend server is running."));
    } finally {
      setSending(false);
    }
  };

  const markAllRead = () => {
    const next = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(next);
    setNotice(t("All notifications marked as read."));
  };

  return (
    <div className="nc">
      <style>{`
        .nc { font-family: 'Inter', system-ui, sans-serif; }
        .nc .content-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 22px; gap: 20px; flex-wrap: wrap;
        }
        .nc .date-label { color: #6B7280; font-size: 13.5px; }
        .nc .nc-toolbar { display: flex; gap: 12px; flex-wrap: wrap; }
        .nc .search-box {
          display: flex; align-items: center; gap: 8px; background: #EFEBE3;
          border-radius: 10px; padding: 9px 14px; width: 240px; color: #8A8378;
        }
        .nc .search-box input { border: none; outline: none; background: transparent; font-size: 13px; width: 100%; color: #1F2430; }
        .nc .broadcast-btn {
          background: #3E5EDB; color: #fff; border: none; padding: 9px 16px;
          border-radius: 9px; font-size: 13px; font-weight: 600; cursor: pointer;
          display: inline-flex; align-items: center; gap: 8px;
          box-shadow: 0 6px 16px rgba(62,94,219,0.35);
        }
        .nc .readall-btn {
          background: #E7E3F7; color: #3E5EDB; border: none; padding: 9px 16px;
          border-radius: 9px; font-size: 13px; font-weight: 600; cursor: pointer;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .nc .error-banner {
          background: #FBE3E0; border: 1px solid #E0665A; color: #D2483C;
          border-radius: 10px; padding: 12px 18px; font-size: 13px; margin-bottom: 20px;
        }
        .nc .notice-banner {
          background: #E3F0E7; border: 1px solid #2E9E6C; color: #1E7A4E;
          border-radius: 10px; padding: 12px 18px; font-size: 13px; margin-bottom: 20px;
        }
        .nc .nc-list { display: flex; flex-direction: column; gap: 12px; }
        .nc .nc-card {
          background: #fff; border: 1px solid #ECE6DC; border-radius: 12px;
          padding: 16px 18px; box-shadow: 0 4px 16px rgba(24,38,68,0.06);
          display: flex; gap: 14px; align-items: flex-start;
        }
        .nc .nc-card.unread { border-left: 4px solid #3E5EDB; }
        .nc .nc-icon {
          width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; color: #fff;
        }
        .nc .nc-title { font-weight: 700; color: #182644; font-size: 14px; }
        .nc .nc-body { font-size: 13px; color: #6B7280; margin-top: 4px; line-height: 1.6; }
        .nc .nc-meta { display: flex; gap: 12px; margin-top: 8px; font-size: 11.5px; color: #9CA3AF; flex-wrap: wrap; }
        .nc .nc-meta span { display: inline-flex; align-items: center; gap: 5px; }
        .nc .nc-overlay {
          position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center;
          animation: ncFade 0.25s ease;
        }
        .nc .nc-modal {
          background: #fff; border-radius: 16px; padding: 26px 28px;
          width: min(92vw, 520px); animation: ncPop 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nc .nc-modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .nc .nc-modal-title { font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 17px; color: #182644; }
        .nc .nc-close { background: #F6F4EF; border: none; border-radius: 8px; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; color: #6B7280; cursor: pointer; }
        .nc .nc-field { margin-bottom: 14px; }
        .nc .nc-label { display: block; font-size: 12.5px; font-weight: 600; color: #182644; margin-bottom: 6px; }
        .nc .nc-input {
          width: 100%; padding: 11px 14px; border: 1.5px solid #E5E7EB; border-radius: 10px;
          font-size: 13.5px; outline: none; background: #FBFBF9; color: #1F2430; box-sizing: border-box;
        }
        .nc .nc-input:focus { border-color: #3E5EDB; }
        .nc .nc-input-row { display: flex; gap: 14px; }
        .nc .nc-input-row .nc-field { flex: 1; }
        .nc .nc-textarea { resize: vertical; min-height: 100px; font-family: inherit; }
        .nc .nc-modal-foot { display: flex; gap: 12px; margin-top: 22px; }
        .nc .nc-cancel {
          flex: 1; padding: 11px 0; border-radius: 10px; border: 1.5px solid #E5E7EB;
          background: #F6F4EF; color: #6B7280; font-size: 14px; font-weight: 600; cursor: pointer;
        }
        .nc .nc-send {
          flex: 1; padding: 11px 0; border-radius: 10px; border: none; background: #3E5EDB; color: #fff;
          font-size: 14px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center;
          justify-content: center; gap: 8px; box-shadow: 0 6px 16px rgba(62,94,219,0.35);
        }
        .nc .nc-send:disabled { opacity: 0.6; cursor: not-allowed; }
        @keyframes ncFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ncPop { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
      `}</style>

      <div className="content-row">
        <div className="date-label">{t("Broadcast announcements and manage notifications sent to students and staff.")}</div>
        <div className="nc-toolbar">
          <div className="search-box">
            <Search size={15} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("Search notifications...")} />
          </div>
          <button className="readall-btn" onClick={markAllRead} disabled={notifications.length === 0}>
            <CheckCheck size={15} /> {t("Mark all read")}
          </button>
          <button className="broadcast-btn" onClick={() => setBroadcastOpen(true)}>
            <Megaphone size={15} /> {t("Broadcast")}
          </button>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {notice && <div className="notice-banner">{notice}</div>}

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
          <Loader2 size={30} className="animate-spin" style={{ color: "#3E5EDB" }} />
        </div>
      ) : filtered.length > 0 ? (
        <div className="nc-list">
          {filtered.map((n) => {
            const color = TYPE_COLORS[n.type] || "#6B7280";
            return (
              <div key={n.id} className={"nc-card" + (n.read ? "" : " unread")}>
                <div className="nc-icon" style={{ background: color }}>
                  {n.read ? <Bell size={18} /> : <BellRing size={18} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="nc-title">{t(n.title)}</div>
                  <div className="nc-body">{t(n.body)}</div>
                  <div className="nc-meta">
                    <span>{n.date || n.createdAt?.slice?.(0, 10) || "-"}</span>
                    <span>{n.type || "GENERAL"}</span>
                    <span>{n.audience || "ALL"}</span>
                    <span style={{ color: n.read ? "#6B7280" : "#3E5EDB", fontWeight: 700 }}>
                      {n.read ? t("Read") : t("Unread")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 14, padding: 40, textAlign: "center", color: "#9CA3AF", fontSize: 13.5 }}>
          {q ? t("No notifications match your search.") : t("No notifications yet.")}
        </div>
      )}

      {broadcastOpen && (
        <div className="nc-overlay">
          <div className="nc-modal">
            <div className="nc-modal-head">
              <div className="nc-modal-title">{t("Broadcast Notification")}</div>
              <button className="nc-close" onClick={() => setBroadcastOpen(false)} aria-label={t("Close")}><X size={18} /></button>
            </div>

            <div className="nc-field">
              <label className="nc-label">{t("Title")}</label>
              <input className="nc-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder={t("e.g. Campus closure on Friday")} />
            </div>

            <div className="nc-field">
              <label className="nc-label">{t("Message")}</label>
              <textarea className="nc-input nc-textarea" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder={t("Write the notification message...")} />
            </div>

            <div className="nc-input-row">
              <div className="nc-field">
                <label className="nc-label">{t("Type")}</label>
                <select className="nc-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="GENERAL">GENERAL</option>
                  <option value="EXAM">EXAM</option>
                  <option value="PAYMENT">PAYMENT</option>
                  <option value="EVENT">EVENT</option>
                </select>
              </div>
              <div className="nc-field">
                <label className="nc-label">{t("Audience")}</label>
                <select className="nc-input" value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}>
                  <option value="ALL">ALL</option>
                  <option value="STUDENT">STUDENT</option>
                  <option value="TEACHER">TEACHER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>

            <div className="nc-modal-foot">
              <button className="nc-cancel" onClick={() => setBroadcastOpen(false)}>{t("Cancel")}</button>
              <button className="nc-send" onClick={sendBroadcast} disabled={sending}>
                {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                {sending ? t("Sending...") : t("Send Broadcast")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
