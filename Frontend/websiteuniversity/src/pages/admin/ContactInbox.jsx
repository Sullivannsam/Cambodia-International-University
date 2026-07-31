import React, { useState, useEffect } from "react";
import {
  Search, Loader2, Mail, User, Trash2, Phone, MessageSquare, Send, Reply, CheckCheck, FileDown
} from "lucide-react";
import { getContact, replyContact } from "../../services/endpoints";
import { useLanguage } from "../../context/LanguageContext";

const FALLBACK = [
  { id: 1, name: "Sok Veasna", email: "veasna.sok@example.com", phone: "+855 12 345 678", subject: "Admission inquiry", message: "Hello, I would like to know the requirements for the Computer Science program and when applications close.", date: "2026-08-20", read: false },
  { id: 2, name: "Chea Maly", email: "maly.chea@example.com", phone: "+855 98 765 432", subject: "Tuition fees", message: "Could you share the tuition fee schedule for the next academic year?", date: "2026-08-18", read: false },
  { id: 3, name: "Kim Rithy", email: "rithy.kim@example.com", phone: "+855 77 123 456", subject: "Student email", message: "I am having trouble claiming my student email. Can you assist?", date: "2026-08-15", read: true },
  { id: 4, name: "Ly Sokha", email: "sokha.ly@example.com", phone: "+855 15 246 810", subject: "Scholarship application", message: "What documents are required for the merit scholarship application?", date: "2026-08-12", read: true },
];

export default function ContactInbox({ onUnreadChange }) {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [notice, setNotice] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replySubject, setReplySubject] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyError, setReplyError] = useState("");
  const [replySending, setReplySending] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const countUnread = (arr) => arr.filter(m => !m.read).length;

  const load = async () => {
    setLoading(true);
    try {
      const data = await getContact();
      const arr = Array.isArray(data) ? data : Array.isArray(data.messages) ? data.messages : [];
      const normalized = (arr.length ? arr : FALLBACK).map(m => ({ ...m, read: !!m.read }));
      setMessages(normalized);
      onUnreadChange?.(countUnread(normalized));
    } catch {
      const normalized = FALLBACK.map(m => ({ ...m, read: !!m.read }));
      setMessages(normalized);
      onUnreadChange?.(countUnread(normalized));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = messages.filter(m =>
    (m.name + m.email + m.subject + m.message).toLowerCase().includes(query.toLowerCase())
  );

  const openMessage = (m) => {
    setSelected(m);
    if (!m.read) {
      const next = messages.map(x => x.id === m.id ? { ...x, read: true } : x);
      setMessages(next);
      onUnreadChange?.(countUnread(next));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((m) => m.id));
    }
  };

  const markSelectedRead = () => {
    const next = messages.map((m) => selectedIds.includes(m.id) ? { ...m, read: true } : m);
    setMessages(next);
    onUnreadChange?.(countUnread(next));
    setSelectedIds([]);
    setNotice(t("Selected messages marked as read."));
  };

  const deleteSelected = () => {
    const next = messages.filter((m) => !selectedIds.includes(m.id));
    setMessages(next);
    onUnreadChange?.(countUnread(next));
    if (selected && selectedIds.includes(selected.id)) setSelected(null);
    setSelectedIds([]);
    setNotice(t("Selected messages deleted."));
  };

  const exportCSV = () => {
    const header = `${t("Name")},${t("Email")},${t("Phone")},${t("Subject")},${t("Message")},${t("Date")}`;
    const rows = filtered.map((m) =>
      `"${m.name}","${m.email}","${m.phone || ""}","${(m.subject || "").replace(/"/g, '""')}","${(m.message || "").replace(/"/g, '""')}","${m.date || m.createdAt || ""}"`
    ).join("\n");
    const blob = new Blob([`${header}\n${rows}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contact-messages.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const remove = (id) => {
    const next = messages.filter(m => m.id !== id);
    setMessages(next);
    onUnreadChange?.(countUnread(next));
    if (selected?.id === id) setSelected(null);
  };

  const sendReply = async () => {
    setReplyError("");
    if (!replyTo) return;
    if (!replySubject.trim() || !replyText.trim()) {
      setReplyError(t("Please fill in both the subject and your reply."));
      return;
    }
    setReplySending(true);
    try {
      const res = await replyContact({
        to: replyTo.email,
        name: replyTo.name,
        subject: replySubject.trim(),
        message: replyText.trim(),
      });
      if (res && res.error) throw new Error(res.error);
      setNotice(`${t("Reply sent to")} ${replyTo.email}${t(".")}`);
    } catch {
      const mailto = `mailto:${replyTo.email}?subject=${encodeURIComponent(replySubject.trim())}&body=${encodeURIComponent(replyText.trim())}`;
      window.location.href = mailto;
      setNotice(t("Backend reply failed — opened your mail app instead."));
    } finally {
      setReplySending(false);
      setReplyTo(null);
      setReplySubject("");
      setReplyText("");
    }
  };

  return (
    <div className="ci-wrap">
      <style>{`
        .ci-wrap { font-family: 'Inter', system-ui, sans-serif; }
        .ci-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 18px; }
        .ci-title { font-size: 18px; font-weight: 800; color: #182644; }
        .ci-search { display: flex; align-items: center; gap: 8px; background: #F6F4EF; border: 1px solid #E5E7EB; border-radius: 10px; padding: 9px 14px; color: #9CA3AF; }
        .ci-search input { border: none; outline: none; background: none; font-size: 13px; width: 220px; color: #1F2430; }
        .ci-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: start; }
        .ci-list { display: flex; flex-direction: column; gap: 10px; }
        .ci-card {
          background: #fff; border: 1px solid #ECE6DC; border-radius: 12px; padding: 14px 16px; cursor: pointer;
          transition: all 0.2s ease; box-shadow: 0 2px 10px rgba(24,38,68,0.04);
        }
        .ci-card:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(24,38,68,0.1); }
        .ci-card.active { border-color: #3E5EDB; box-shadow: 0 0 0 3px rgba(62,94,219,0.15); }
        .ci-card-top { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
        .ci-sender { font-weight: 700; color: #182644; font-size: 14px; }
        .ci-date { font-size: 11.5px; color: #9CA3AF; }
        .ci-newtag {
          display: inline-block;
          background: #ef4444;
          color: #fff;
          font-size: 10px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 5px;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          box-shadow: 0 2px 6px rgba(239, 68, 68, 0.35);
        }
        .ci-subject { font-size: 13px; color: #3E5EDB; font-weight: 600; margin: 6px 0 4px; }
        .ci-preview { font-size: 12.5px; color: #6B7280; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ci-detail {
          background: #fff; border: 1px solid #ECE6DC; border-radius: 14px; padding: 22px;
          box-shadow: 0 4px 16px rgba(24,38,68,0.06); position: sticky; top: 0;
        }
        .ci-detail-empty { color: #9CA3AF; text-align: center; padding: 60px 20px; font-size: 13.5px; }
        .ci-meta { display: flex; gap: 14px; flex-wrap: wrap; font-size: 12.5px; color: #6B7280; margin: 12px 0 16px; }
        .ci-meta span { display: inline-flex; align-items: center; gap: 6px; }
        .ci-message { font-size: 14px; color: #1F2430; line-height: 1.8; background: #F6F4EF; border-radius: 10px; padding: 16px 18px; }
        .ci-delete { display: inline-flex; align-items: center; gap: 6px; border: none; cursor: pointer; border-radius: 8px; padding: 8px 14px; font-size: 12.5px; font-weight: 700; background: #FBE3E0; color: #D2483C; margin-top: 16px; }
        .ci-reply-btn { display: inline-flex; align-items: center; gap: 6px; border: none; cursor: pointer; border-radius: 8px; padding: 8px 14px; font-size: 12.5px; font-weight: 700; background: #3E5EDB; color: #fff; margin-top: 16px; margin-right: 8px; }
        .ci-notice { background: #E3F0E7; border: 1px solid #2E9E6C; color: #1E7A4E; border-radius: 10px; padding: 10px 14px; font-size: 12.5px; margin-bottom: 14px; font-weight: 600; }
        .ci-bulk-btn {
          display: inline-flex; align-items: center; gap: 6px; border: none; cursor: pointer;
          border-radius: 8px; padding: 8px 14px; font-size: 12.5px; font-weight: 700;
          background: #E7E3F7; color: #3E5EDB;
        }
        .ci-bulk-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .ci-bulk-danger { background: #FBE3E0; color: #D2483C; }
        .ci-bulk-export { background: #3E5EDB; color: #fff; }
        .ci-select-all {
          display: flex; align-items: center; gap: 8px; font-size: 12.5px; font-weight: 600;
          color: #6B7280; padding: 4px 6px; cursor: pointer; user-select: none;
        }
        .ci-select-all input { cursor: pointer; }
        .ci-modal-overlay { position: fixed; inset: 0; background: rgba(24, 38, 68, 0.45); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; }
        .ci-modal { background: #fff; border-radius: 16px; padding: 24px; width: 100%; max-width: 480px; box-shadow: 0 20px 60px rgba(24, 38, 68, 0.3); }
        .ci-modal-title { font-size: 17px; font-weight: 800; color: #182644; margin-bottom: 4px; }
        .ci-modal-to { font-size: 12.5px; color: #9A8F80; margin-bottom: 16px; }
        .ci-modal input, .ci-modal textarea { width: 100%; border: 1px solid #E5E7EB; border-radius: 10px; padding: 11px 14px; font-size: 13.5px; color: #1F2430; outline: none; background: #F6F4EF; margin-bottom: 12px; font-family: inherit; box-sizing: border-box; }
        .ci-modal input:focus, .ci-modal textarea:focus { border-color: #3E5EDB; background: #fff; }
        .ci-modal textarea { min-height: 130px; resize: vertical; }
        .ci-modal-error { background: #FBE3E0; border: 1px solid #E0665A; color: #D2483C; border-radius: 8px; padding: 8px 12px; font-size: 12.5px; margin-bottom: 12px; }
        .ci-modal-actions { display: flex; justify-content: flex-end; gap: 10px; }
        .ci-modal-cancel { border: 1px solid #E5E7EB; background: #fff; color: #6B7280; border-radius: 9px; padding: 9px 16px; font-size: 13px; font-weight: 600; cursor: pointer; }
        .ci-modal-send { display: inline-flex; align-items: center; gap: 7px; border: none; background: #3E5EDB; color: #fff; border-radius: 9px; padding: 9px 18px; font-size: 13px; font-weight: 700; cursor: pointer; }
        .ci-modal-send:disabled { opacity: 0.6; cursor: not-allowed; }
        @media (max-width: 860px) { .ci-grid { grid-template-columns: 1fr; } .ci-search { width: 100%; } .ci-search input { width: 100%; } }
      `}</style>

      <div className="ci-head">
        <div className="ci-title">{t("Contact Messages")}</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div className="ci-search"><Search size={15} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder={t("Search messages...")} /></div>
          {selectedIds.length > 0 && (
            <>
              <button className="ci-bulk-btn" onClick={markSelectedRead} disabled={!selectedIds.some((id) => !messages.find((m) => m.id === id)?.read)}>
                <CheckCheck size={14} /> {t("Mark read")} ({selectedIds.length})
              </button>
              <button className="ci-bulk-btn ci-bulk-danger" onClick={deleteSelected}>
                <Trash2 size={14} /> {t("Delete")} ({selectedIds.length})
              </button>
            </>
          )}
          <button className="ci-bulk-btn ci-bulk-export" onClick={exportCSV} disabled={filtered.length === 0}>
            <FileDown size={14} /> {t("Export CSV")}
          </button>
        </div>
      </div>

      {notice && <div className="ci-notice">{notice}</div>}

      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}><Loader2 size={28} className="ci-spin" style={{ color: "#3E5EDB", animation: "cispin 1s linear infinite" }} /></div>
      ) : (
        <div className="ci-grid">
        <div className="ci-list">
          <div className="ci-select-all" onClick={toggleSelectAll}>
            <input type="checkbox" checked={selectedIds.length === filtered.length && filtered.length > 0} onChange={toggleSelectAll} readOnly />
            <span>{selectedIds.length === filtered.length && filtered.length > 0 ? t("Deselect all") : t("Select all")}</span>
            <span style={{ marginLeft: "auto", color: "#9CA3AF", fontSize: 12 }}>{filtered.length} {t("messages")}</span>
          </div>
          {filtered.length ? filtered.map(m => (
            <div key={m.id} className={"ci-card" + (selected?.id === m.id ? " active" : "")} onClick={() => openMessage(m)}>
              <div className="ci-card-top">
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={selectedIds.includes(m.id)} onClick={e => e.stopPropagation()} onChange={() => toggleSelect(m.id)} aria-label={t("Select message")} />
                  <span className="ci-sender"><Mail size={13} style={{ verticalAlign: 'middle', marginRight: 6, color: '#3E5EDB' }} />{m.name}</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {!m.read && <span className="ci-newtag">{t("New Message")}</span>}
                  <span className="ci-date">{m.date || m.createdAt || ""}</span>
                </span>
              </div>
              <div className="ci-subject">{m.subject}</div>
              <div className="ci-preview">{m.message}</div>
            </div>
          )) : (
            <div className="ci-detail-empty">{t("No messages match your search.")}</div>
          )}
        </div>

          <div className="ci-detail">
            {selected ? (
              <>
                <div style={{ fontSize: 17, fontWeight: 800, color: "#182644" }}>{selected.subject}</div>
                <div className="ci-meta">
                  <span><User size={14} /> {selected.name}</span>
                  <span><Mail size={14} /> {selected.email}</span>
                  {selected.phone && <span><Phone size={14} /> {selected.phone}</span>}
                  {selected.date && <span><MessageSquare size={14} /> {selected.date}</span>}
                </div>
                <div className="ci-message">{selected.message}</div>
                <div>
                  <button className="ci-reply-btn" onClick={() => setReplyTo(selected)}><Reply size={14} /> {t("Reply")}</button>
                  <button className="ci-delete" onClick={() => remove(selected.id)}><Trash2 size={14} /> {t("Delete Message")}</button>
                </div>
              </>
            ) : (
              <div className="ci-detail-empty">
                <Mail size={40} style={{ display: "block", margin: "0 auto 12px", color: "#D1D5DB" }} />
                {t("Select a message to read it here.")}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`@keyframes cispin { from { transform: rotate(0); } to { transform: rotate(360deg); } }`}</style>

      {replyTo && (
        <div className="ci-modal-overlay" onClick={() => { if (!replySending) { setReplyTo(null); setReplyError(""); } }}>
          <div className="ci-modal" onClick={e => e.stopPropagation()}>
            <div className="ci-modal-title">{t("Reply to")} {replyTo.name}</div>
            <div className="ci-modal-to">{t("To:")} {replyTo.email}</div>
            <input value={replySubject} onChange={e => setReplySubject(e.target.value)} placeholder={t("Subject")} />
            <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder={t("Write your reply message...")} />
            {replyError && <div className="ci-modal-error">{replyError}</div>}
            <div className="ci-modal-actions">
              <button className="ci-modal-cancel" onClick={() => { setReplyTo(null); setReplyError(""); }} disabled={replySending}>{t("Cancel")}</button>
              <button className="ci-modal-send" onClick={sendReply} disabled={replySending}>
                {replySending ? <Loader2 size={14} style={{ animation: "cispin 1s linear infinite" }} /> : <Send size={14} />}
                {t("Send Reply")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
