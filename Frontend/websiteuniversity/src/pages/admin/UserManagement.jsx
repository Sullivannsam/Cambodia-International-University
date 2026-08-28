import React, { useState, useEffect } from "react";
import {
  Search, Loader2, Pencil, Trash2, X, Save, UserCircle2, Ban, RotateCcw, FileUp, FileDown
} from "lucide-react";
import { getUsers, updateUser, deleteUser, suspendUser, unsuspendUser, importUsers, exportUsers } from "../../services/endpoints";
import { useLanguage } from "../../context/LanguageContext";

const ROLES = ["USER", "ADMIN", "STUDENT", "TEACHER"];

const emptyForm = () => ({
  username: "",
  email: "",
  phone: "",
  role: "USER",
  course: "",
  active: true,
});

export default function UserManagement() {
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [suspendTarget, setSuspendTarget] = useState(null);
  const [suspendMessage, setSuspendMessage] = useState("");
  const [suspending, setSuspending] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const fileRef = React.useRef(null);

  const handleExport = async () => {
    setError("");
    try {
      const res = await exportUsers();
      const rows = Array.isArray(res) ? res : Array.isArray(res.users) ? res.users : users;
      const header = `${t("ID")},${t("Username")},${t("Email")},${t("Phone")},${t("Role")},${t("Status")}`;
      const body = rows.map((u) =>
        `"${u.id ?? ""}","${(u.username || "").replace(/"/g, '""')}","${(u.email || "").replace(/"/g, '""')}","${u.phone || ""}","${u.role || ""}","${u.active === false ? "Inactive" : "Active"}"`
      ).join("\n");
      const blob = new Blob([`${header}\n${body}`], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "users.csv";
      a.click();
      URL.revokeObjectURL(url);
      setNotice(t("Users exported successfully."));
    } catch {
      setError(t("Failed to export users. Please try again."));
    }
  };

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    setNotice("");
    try {
      const text = await file.text();
      const rows = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      if (rows.length === 0) throw new Error("empty");
      const header = rows[0].split(",").map((h) => h.replace(/^"|"$/g, "").trim().toLowerCase());
      const data = rows.slice(1).map((l) => {
        const cells = l.split(",").map((c) => c.replace(/^"|"$/g, "").trim());
        const obj = {};
        header.forEach((h, i) => { obj[h] = cells[i] || ""; });
        return obj;
      });
      await importUsers(data);
      setNotice(`${t("Imported")} ${data.length} ${t("user(s) successfully.")}`);
      load();
    } catch {
      setError(t("Failed to import users. Check that the CSV has a header row with username, email, phone, role."));
    }
  };

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getUsers();
      setUsers(Array.isArray(res) ? res : []);
    } catch {
      setError(t("Failed to load users. Make sure the backend server is running."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const q = query.toString().toLowerCase().trim();
  const filtered = q
    ? users.filter((u) =>
        [u.username, u.email, u.phone, u.id, u.role].some(
          (v) => v != null && v.toString().toLowerCase().includes(q)
        )
      )
    : users;

  const roleCounts = (role) => users.filter((u) => String(u.role || "").toUpperCase() === role).length;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const openEdit = (u) => {
    setForm({
      username: u.username || "",
      email: u.email || "",
      phone: u.phone || "",
      role: u.role || "USER",
      course: u.course || "",
      active: u.active === false ? false : true,
    });
    setNotice("");
    setEditing(u);
  };

  const closeEdit = () => {
    setEditing(null);
    setNotice("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError("");
    try {
      await updateUser(editing.id, form);
      setNotice(t("User updated successfully."));
      closeEdit();
      load();
    } catch {
      setError(t("Failed to update user. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  const requestDelete = (u) => setConfirm({ action: "delete", user: u });

  const requestRestore = (u) => setConfirm({ action: "restore", user: u });

  const runConfirm = async () => {
    if (!confirm) return;
    const { action, user } = confirm;
    setConfirm(null);
    setError("");
    try {
      if (action === "delete") {
        await deleteUser(user.id);
        setNotice(`${t("User")} "${user.username || user.email}" ${t("deleted successfully.")}`);
      } else {
        await unsuspendUser(user.id);
        setNotice(`${t("User")} "${user.username || user.email}" ${t("restored.")}`);
      }
      load();
    } catch {
      setError(action === "delete"
        ? t("Failed to delete user. Please try again.")
        : t("Failed to restore user. Please try again."));
    }
  };

  const openSuspend = (u) => {
    setSuspendTarget(u);
    setSuspendMessage("");
    setSuspending(false);
    setError("");
  };

  const closeSuspend = () => {
    setSuspendTarget(null);
    setSuspendMessage("");
  };

  const handleSuspend = async (e) => {
    e.preventDefault();
    if (!suspendTarget || !suspendMessage.trim()) return;
    setSuspending(true);
    setError("");
    try {
      await suspendUser(suspendTarget.id, { message: suspendMessage.trim() });
      setNotice(`${t("User")} "${suspendTarget.username || suspendTarget.email}" ${t("suspended.")}`);
      closeSuspend();
      load();
    } catch {
      setError(t("Failed to suspend user. Please try again."));
    } finally {
      setSuspending(false);
    }
  };

  return (
    <div className="um">
      <style>{`
        .um .content-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 22px; gap: 20px; flex-wrap: wrap;
        }
        .um .date-label { color: #6B7280; font-size: 13.5px; }
        .um .search-box {
          display: flex; align-items: center; gap: 8px;
          background: #EFEBE3; border-radius: 10px;
          padding: 9px 14px; width: 260px; color: #8A8378;
        }
        .um .search-box input {
          border: none; outline: none; background: transparent;
          font-size: 13px; width: 100%; color: #1F2430;
        }
        .um .um-banner {
          border-radius: 10px; padding: 12px 18px;
          font-size: 13px; font-weight: 600; margin-bottom: 20px;
        }
        .um .um-error {
          background: #FBE3E0; border: 1px solid #E0665A; color: #D2483C;
        }
        .um .um-success {
          background: #DCEEE1; border: 1px solid #2E9E6C; color: #1E7A52;
        }
        .um .panel {
          background: #fff; border-radius: 14px; padding: 22px;
          box-shadow: 0 4px 16px rgba(24,38,68,0.06);
        }
        .um .panel-title {
          font-family: 'Poppins', sans-serif; font-weight: 600;
          color: #182644; margin-bottom: 16px; font-size: 15px;
        }
        .um table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .um th {
          text-align: left; color: #3E5EDB;
          border-bottom: 2px solid #E5E7EB; padding: 10px 12px;
          white-space: nowrap;
        }
        .um td { border-bottom: 1px solid #F0EEE9; padding: 10px 12px; }
        .um .um-id { font-weight: 700; color: #3E5EDB; }
        .um .um-name { font-weight: 600; color: #182644; }
        .um .um-status {
          display: inline-block; padding: 2px 9px; border-radius: 999px;
          color: #fff; font-size: 11.5px; font-weight: 700;
        }
        .um .um-actions { display: flex; gap: 8px; }
        .um .um-csv-btn {
          background: #182644; color: #fff; border: none; padding: 10px 18px; border-radius: 9px;
          font-size: 13px; font-weight: 600; cursor: pointer;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .um .um-csv-btn:hover { background: #233766; }
        .um .um-csv-export { background: #3E5EDB; }
        .um .um-csv-export:hover { background: #3049B0; }
        .um .btn-update, .um .btn-delete, .um .btn-suspend, .um .btn-restore {
          border: none; border-radius: 7px; font-size: 11.5px; font-weight: 700;
          padding: 6px 12px; cursor: pointer; color: #fff;
          display: inline-flex; align-items: center; gap: 6px;
          white-space: nowrap;
        }
        .um .btn-update { background: #2E9E6C; }
        .um .btn-update:hover { background: #25845B; }
        .um .btn-suspend { background: #D69A1E; }
        .um .btn-suspend:hover { background: #B98312; }
        .um .btn-restore { background: #3E5EDB; }
        .um .btn-restore:hover { background: #3049B0; }
        .um .btn-delete { background: #D2483C; }
        .um .btn-delete:hover { background: #B93A30; }
        .um .um-suspend-msg {
          font-size: 11.5px; color: #9A8F80; font-style: italic;
          margin-top: 4px; max-width: 220px; line-height: 1.4;
        }
        .um .um-textarea { resize: vertical; min-height: 90px; font-family: inherit; }
        .um .um-suspend-btn {
          flex: 1; padding: 11px 0; border-radius: 10px;
          border: none; background: #D2483C; color: #fff;
          font-size: 14px; font-weight: 600; cursor: pointer;
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 6px 16px rgba(210,72,60,0.35);
        }
        .um .um-suspend-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .um .um-empty { color: #6B7280; font-size: 13.5px; padding: 24px 0; }
        .um .um-overlay {
          position: fixed; inset: 0; z-index: 9998;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
          animation: umFade 0.25s ease;
        }
        .um .um-modal {
          background: #fff; border-radius: 16px; padding: 26px 28px;
          width: min(92vw, 460px); max-height: 90vh; overflow-y: auto;
          box-shadow: 0 12px 40px rgba(0,0,0,0.2);
          animation: umPop 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .um .um-modal-head {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 20px;
        }
        .um .um-modal-title {
          font-family: 'Poppins', sans-serif; font-weight: 600;
          font-size: 17px; color: #182644;
        }
        .um .um-close {
          background: none; border: none; cursor: pointer;
          color: #9A8F80; padding: 4px; border-radius: 8px;
        }
        .um .um-close:hover { background: #F6F4EF; color: #182644; }
        .um .um-field { margin-bottom: 14px; }
        .um .um-label {
          display: block; font-size: 12.5px; font-weight: 600;
          color: #182644; margin-bottom: 6px;
        }
        .um .um-input {
          width: 100%; padding: 10px 12px; font-size: 13px;
          border: 1px solid #E5E7EB; border-radius: 9px;
          background: #FBF4EE; color: #1F2430; outline: none;
        }
        .um .um-input:focus { border-color: #3E5EDB; }
        .um .um-check {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; font-weight: 600; color: #182644;
        }
        .um .um-modal-foot {
          display: flex; gap: 12px; margin-top: 22px;
        }
        .um .um-cancel {
          flex: 1; padding: 11px 0; border-radius: 10px;
          border: 1.5px solid #E5E7EB; background: #F6F4EF;
          color: #6B7280; font-size: 14px; font-weight: 600;
          cursor: pointer;
        }
        .um .um-save {
          flex: 1; padding: 11px 0; border-radius: 10px;
          border: none; background: #3E5EDB; color: #fff;
          font-size: 14px; font-weight: 600; cursor: pointer;
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 6px 16px rgba(62,94,219,0.35);
        }
        .um .um-save:disabled { opacity: 0.6; cursor: not-allowed; }
        .um .um-confirm-icon {
          width: 56px; height: 56px; margin: 0 auto 14px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }
        .um .um-delete-btn {
          flex: 1; padding: 11px 0; border-radius: 10px;
          border: none; background: #D2483C; color: #fff;
          font-size: 14px; font-weight: 600; cursor: pointer;
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 6px 16px rgba(210,72,60,0.35);
        }
        .um .um-delete-btn:hover { background: #B93A30; }
        @keyframes umFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes umPop {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        @media (max-width: 980px) {
          .um table { font-size: 12px; }
        }
      `}</style>

      <div className="content-row">
        <div className="date-label">{today}</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div className="search-box">
            <Search size={15} />
            <input
              placeholder={t("Search users by ID, name, email...")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button className="um-csv-btn" onClick={() => fileRef.current?.click()}><FileUp size={15} /> {t("Import CSV")}</button>
          <button className="um-csv-btn um-csv-export" onClick={handleExport}><FileDown size={15} /> {t("Export CSV")}</button>
          <input ref={fileRef} type="file" accept=".csv,text/csv" style={{ display: "none" }} onChange={handleImportFile} />
        </div>
      </div>

      {error && <div className="um-banner um-error">{error}</div>}
      {notice && <div className="um-banner um-success">{notice}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 14, marginBottom: 18 }}>
        {[
          { role: "ADMIN", label: t("Admin"), color: "#3E5EDB" },
          { role: "TEACHER", label: t("Teacher"), color: "#2E9E6C" },
          { role: "STUDENT", label: t("Student"), color: "#D69A1E" },
          { role: "USER", label: t("User"), color: "#7A5CDB" },
        ].map(({ role, label, color }) => (
          <div key={role} style={{
            background: "#fff", borderRadius: 12, padding: "16px 18px",
            boxShadow: "0 4px 16px rgba(24,38,68,0.06)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1F2430" }}>{label}</span>
            <span style={{ fontSize: 24, fontWeight: 800, color }}>{roleCounts(role)}</span>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="panel-title">{t("Registered Users")} ({filtered.length})</div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
            <Loader2 size={30} className="animate-spin" style={{ color: "#3E5EDB" }} />
          </div>
        ) : filtered.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>{t("ID")}</th>
                  <th>{t("Username")}</th>
                  <th>{t("Email")}</th>
                  <th>{t("Phone")}</th>
                  <th>{t("Role")}</th>
                  <th>{t("Course")}</th>
                  <th>{t("Status")}</th>
                  <th>{t("Created")}</th>
                  <th>{t("Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id ?? u.email}>
                    <td className="um-id">{u.id ?? "-"}</td>
                    <td className="um-name">
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <UserCircle2 size={16} style={{ color: "#3E5EDB" }} />
                        {u.username || "-"}
                      </span>
                    </td>
                    <td>{u.email || "-"}</td>
                    <td>{u.phone || "-"}</td>
                    <td>{u.role || "-"}</td>
                    <td>{u.course || "-"}</td>
                    <td>
                      {u.suspended ? (
                        <>
                          <span className="um-status" style={{ background: "#D69A1E" }}>
                            Suspended
                          </span>
                          {u.suspendedMessage && (
                            <div className="um-suspend-msg">"{u.suspendedMessage}"</div>
                          )}
                        </>
                      ) : (
                        <span
                          className="um-status"
                          style={{ background: u.active === false ? "#D2483C" : "#2E9E6C" }}
                        >
                          {u.active === false ? "Inactive" : "Active"}
                        </span>
                      )}
                    </td>
                    <td style={{ color: "#6B7280" }}>{u.createAt ? u.createAt.slice(0, 10) : "-"}</td>
                    <td>
                      <div className="um-actions">
                        <button className="btn-update" onClick={() => openEdit(u)}>
                          <Pencil size={12} /> {t("Edit")}
                        </button>
                        {u.suspended ? (
                          <button className="btn-restore" onClick={() => requestRestore(u)}>
                            <RotateCcw size={12} /> {t("Restore")}
                          </button>
                        ) : (
                          <button className="btn-suspend" onClick={() => openSuspend(u)}>
                            <Ban size={12} /> {t("Suspend")}
                          </button>
                        )}
                        <button className="btn-delete" onClick={() => requestDelete(u)}>
                          <Trash2 size={12} /> {t("Delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="um-empty">
            {q ? `${t("No users match")} "${query}".` : t("No registered users found.")}
          </div>
        )}
      </div>

      {editing && (
        <div className="um-overlay">
          <div className="um-modal">
            <div className="um-modal-head">
              <div className="um-modal-title">{t("Edit User")} #{editing.id}</div>
              <button className="um-close" onClick={closeEdit} aria-label={t("Close")}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="um-field">
                <label className="um-label">{t("Username")}</label>
                <input
                  className="um-input"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="um-field">
                <label className="um-label">{t("Email")}</label>
                <input
                  className="um-input"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="um-field">
                <label className="um-label">{t("Phone")}</label>
                <input
                  className="um-input"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="um-field">
                <label className="um-label">{t("Course")}</label>
                <input
                  className="um-input"
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                />
              </div>
              <div className="um-field">
                <label className="um-label">{t("Role")}</label>
                <select className="um-input" name="role" value={form.role} onChange={handleChange}>
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="um-field">
                <label className="um-check">
                  <input
                    type="checkbox"
                    name="active"
                    checked={form.active}
                    onChange={handleChange}
                  />
                  {t("Active account")}
                </label>
              </div>

              <div className="um-modal-foot">
                <button type="button" className="um-cancel" onClick={closeEdit}>
                  {t("Cancel")}
                </button>
                <button type="submit" className="um-save" disabled={saving}>
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  {saving ? t("Saving...") : t("Save Changes")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {suspendTarget && (
        <div className="um-overlay">
          <div className="um-modal">
            <div className="um-modal-head">
              <div className="um-modal-title">{t("Suspend Account")}</div>
              <button className="um-close" onClick={closeSuspend} aria-label={t("Close")}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSuspend}>
              <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 14, lineHeight: 1.5 }}>
                {t("Suspending")}{" "}
                <strong style={{ color: "#182644" }}>{suspendTarget.username || suspendTarget.email}</strong>{" "}
                ({suspendTarget.email}). {t("They will not be able to log in until the account is restored.")}
              </div>

              <div className="um-field">
                <label className="um-label">{t("Message to the user")}</label>
                <textarea
                  className="um-input um-textarea"
                  rows={4}
                  value={suspendMessage}
                  onChange={(e) => setSuspendMessage(e.target.value)}
                  placeholder={t("e.g. Your account has been suspended for 1 week. Reason: breaking school rules.")}
                  required
                />
              </div>

              <div className="um-modal-foot">
                <button type="button" className="um-cancel" onClick={closeSuspend}>
                  {t("Cancel")}
                </button>
                <button type="submit" className="um-suspend-btn" disabled={suspending}>
                  {suspending ? <Loader2 size={15} className="animate-spin" /> : <Ban size={15} />}
                  {suspending ? t("Suspending...") : t("Suspend Account")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirm && (
        <div className="um-overlay">
          <div className="um-modal" style={{ textAlign: "center", maxWidth: 420 }}>
            <div
              className="um-confirm-icon"
              style={{
                background: confirm.action === "delete" ? "#FBE3E0" : "#E7E3F7",
                color: confirm.action === "delete" ? "#D2483C" : "#3E5EDB",
              }}
            >
              {confirm.action === "delete" ? <Trash2 size={26} /> : <RotateCcw size={26} />}
            </div>

            <div className="um-modal-title" style={{ fontSize: 18, textAlign: "center" }}>
              {confirm.action === "delete" ? t("Delete user?") : t("Restore user?")}
            </div>

            <p style={{ fontSize: 13.5, color: "#6B7280", margin: "10px 0 0", lineHeight: 1.6 }}>
              {confirm.action === "delete"
                ? `${t("Are you sure you want to permanently delete")} "${confirm.user.username || confirm.user.email}"? ${t("This cannot be undone.")}`
                : `${t("Restore")} "${confirm.user.username || confirm.user.email}"? ${t("They will be able to log in again.")}`}
            </p>

            <div className="um-modal-foot">
              <button type="button" className="um-cancel" onClick={() => setConfirm(null)}>
                {t("Cancel")}
              </button>
              <button
                type="button"
                className={confirm.action === "delete" ? "um-delete-btn" : "um-save"}
                onClick={runConfirm}
              >
                {confirm.action === "delete" ? <Trash2 size={15} /> : <RotateCcw size={15} />}
                {confirm.action === "delete" ? t("Delete") : t("Restore")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
