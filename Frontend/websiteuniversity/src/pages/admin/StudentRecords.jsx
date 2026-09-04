import { useEffect, useMemo, useState } from 'react';
import { Search, X, CreditCard, UserCircle2, Mail, Phone, MapPin, Cake, GraduationCap, Loader2, RefreshCcw } from 'lucide-react';
import { getStudentRecords } from "../../services/endpoints";
import { useLanguage } from "../../context/LanguageContext";

const PAY_META = {
  PAID: { bg: "#E3F0E7", fg: "#1E7A4E" },
  PARTIAL: { bg: "#FDF3E3", fg: "#B76E00" },
  UNPAID: { bg: "#FBE3E0", fg: "#D2483C" },
  NONE: { bg: "#EEEEEE", fg: "#64748B" },
};

const money = (v) => `$${Number(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const field = (obj, ...keys) => {
  for (const k of keys) {
    if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
  }
  return "";
};

const splitName = (raw) => {
  const ln = field(raw, "lastName", "last_name");
  const fn = field(raw, "firstName", "first_name");
  if (ln && fn) return { lastName: ln, firstName: fn };
  const full = field(raw, "fullName", "name", "username");
  const parts = String(full).trim().split(/\s+/).filter(Boolean);
  return parts.length > 1
    ? { lastName: parts[0], firstName: parts.slice(1).join(" ") }
    : { lastName: parts[0] || "", firstName: "" };
};

const normalizeInvoice = (inv) => {
  const amount = Number(field(inv, "amount", "total", 0)) || 0;
  const status = String(field(inv, "status", "UNPAID")).toUpperCase();
  const rawPaid = field(inv, "paid");
  const paid = rawPaid === "" ? (status === "PAID" ? amount : 0) : Number(rawPaid) || 0;
  return {
    id: field(inv, "id", "invoiceId"),
    title: field(inv, "title", "description", "invoiceNumber"),
    amount,
    paid,
    dueDate: field(inv, "dueDate", "dueTime", "due_time"),
    status,
  };
};

const normalizeStudent = (s) => {
  const info = (s && s.studentInfo && typeof s.studentInfo === "object") ? s.studentInfo : {};
  const { lastName, firstName } = splitName(s);
  const id = field(s, "id", "userId");
  const invoices = Array.isArray(s && s.invoices) ? s.invoices.map(normalizeInvoice) : [];
  return {
    id,
    studentId: field(s, "studentId", "cardCode") || String(id ?? "").padStart(6, "0"),
    username: field(s, "username"),
    lastName,
    firstName,
    email: field(s, "email"),
    phone: field(s, "phone", "phoneNumber", "phone_number"),
    gender: field(s, "gender"),
    birthDate: field(s, "birthDate", "date", "birthday", "dob"),
    birthPlace: field(s, "birthPlace", "birthplace", "place", "placeOfBirth", "place_of_birth") || field(info, "place", "placeOfBirth"),
    address: field(s, "address"),
    major: field(s, "major"),
    cardCode: field(s, "cardCode", "card_code"),
    year: Number(field(s, "year", 1)) || 1,
    semester: Number(field(s, "semester", 1)) || 1,
    photoUrl: field(s, "photoUrl", "photo_url"),
    status: field(s, "status", "ACTIVE"),
    invoices,
  };
};

export default function StudentRecords() {
  const { t } = useLanguage();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getStudentRecords();
      const arr = Array.isArray(data) ? data : Array.isArray(data.records) ? data.records : [];
      setRecords(arr.map(normalizeStudent));
    } catch {
      setError(t("Failed to load student records. Make sure the backend server is running."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return records;
    return records.filter((s) =>
      `${s.lastName} ${s.firstName} ${s.username} ${s.studentId} ${s.major} ${s.email}`.toLowerCase().includes(q)
    );
  }, [query, records]);

  return (
    <div>
      <style>{`
        .sd-table-wrap { overflow-x:auto; border-radius:12px; border:1px solid rgba(0,0,0,0.08); }
        .sd-table { width:100%; border-collapse:collapse; min-width:760px; font-size:14px; }
        .sd-table th { background:#182644; color:#fff; padding:11px 14px; text-align:left; white-space:nowrap; font-weight:600; font-size:12.5px; }
        .sd-table td { padding:11px 14px; border-top:1px solid rgba(0,0,0,0.07); }
        .sd-table tbody tr { cursor:pointer; transition:background .12s ease; }
        .sd-table tbody tr:hover td { background:rgba(62,94,219,0.05); }
        .sd-id { font-family:'SFMono-Regular',Consolas,monospace; font-weight:700; font-size:12.5px; color:#3E5EDB; }
        .sd-pay { font-size:11.5px; font-weight:700; padding:3px 11px; border-radius:999px; }
        .sd-overlay { position:fixed; inset:0; background:rgba(15,23,42,0.5); z-index:70; display:flex; align-items:center; justify-content:center; padding:20px; }
        .sd-modal { background:#fff; border-radius:14px; width:640px; max-width:100%; max-height:85vh; overflow-y:auto; box-shadow:0 24px 70px rgba(15,23,42,.35); }
        .sd-row { display:flex; align-items:center; gap:12px; padding:11px 22px; border-bottom:1px solid #F0EEE9; }
        .sd-row-ico { width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center; background:#F2F4FB; color:#3E5EDB; flex-shrink:0; }
        .sd-row-label { font-size:12px; color:#7A8290; width:120px; flex-shrink:0; }
        .sd-row-value { font-size:13.5px; font-weight:600; color:#1F2430; }
        .sd-sec { font-size:11.5px; font-weight:700; color:#7A8290; padding:14px 22px 2px; }
      `}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
        <h2 style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontWeight: 700, color: "#182644", fontSize: 18 }}>
          {t("Students")}
        </h2>
        <div className="search-box" style={{ width: 280 }}>
          <Search size={15} />
          <input placeholder={t("Search name, ID...")} value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "48px 0", color: "#6B7280", fontSize: 14 }}>
          <Loader2 size={18} className="animate-spin" />
          {t("Loading...")}
        </div>
      ) : error ? (
        <div style={{ padding: "40px 0", textAlign: "center" }}>
          <p style={{ color: "#D2483C", fontSize: 14, margin: "0 0 14px" }}>{error}</p>
          <button onClick={load} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 16px", border: "none", borderRadius: 10, background: "#3E5EDB", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            <RefreshCcw size={14} /> {t("Retry")}
          </button>
        </div>
      ) : (
        <div className="sd-table-wrap">
          <table className="sd-table">
            <thead>
              <tr>
                <th>{t("Student")}</th>
                <th>{t("Student ID")}</th>
                <th>{t("Username")}</th>
                <th>{t("Date of Birth")}</th>
                <th>{t("Birthplace")}</th>
                <th>{t("Payment")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const owes = s.invoices.reduce((a, i) => a + (i.amount - i.paid), 0) > 0;
                const pay = s.invoices.length === 0
                  ? { k: "NONE", label: "No Payment" }
                  : owes
                    ? (s.invoices.some((i) => i.status === "PARTIAL") ? { k: "PARTIAL", label: "Partial" } : { k: "UNPAID", label: "Unpaid" })
                    : { k: "PAID", label: "Paid" };
                const m = PAY_META[pay.k];
                return (
                  <tr key={s.studentId} onClick={() => setSelected(s)}>
                    <td>
                      <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        {s.photoUrl ? (
                          <img src={s.photoUrl} alt="" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} />
                        ) : (
                          <UserCircle2 size={27} color="#94a3b8" />
                        )}
                        <span style={{ fontWeight: 600 }}>{s.lastName} {s.firstName}</span>
                      </span>
                    </td>
                    <td><span className="sd-id">{s.studentId}</span></td>
                    <td>{s.username}</td>
                    <td>{s.birthDate}</td>
                    <td>{s.birthPlace}</td>
                    <td>
                      <span className="sd-pay" style={{ background: m.bg, color: m.fg }}>{t(pay.label)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: "28px 0", textAlign: "center", color: "#6B7280", fontSize: 13.5 }}>
              {query ? `${t("No students match your search.")} "${query}"` : t("No students found.")}
            </div>
          )}
        </div>
      )}

      {selected && (
        <div className="sd-overlay" onClick={() => setSelected(null)}>
          <div className="sd-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 22px", background: "#182644", borderRadius: "14px 14px 0 0" }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 13.5 }}>{t("Student Information")}</span>
              <button onClick={() => setSelected(null)} aria-label={t("Close")} style={{ border: "none", background: "rgba(255,255,255,0.12)", color: "#fff", borderRadius: 8, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <X size={14} />
              </button>
            </div>

            <div style={{ display: "flex", gap: 14, alignItems: "center", padding: "18px 22px" }}>
              {selected.photoUrl ? (
                <img src={selected.photoUrl} alt="" style={{ width: 56, height: 56, borderRadius: 12, objectFit: "cover" }} />
              ) : (
                <div style={{ width: 56, height: 56, borderRadius: 12, background: "#E9EEFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <UserCircle2 size={30} color="#3E5EDB" />
                </div>
              )}
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#1F2430" }}>{selected.lastName} {selected.firstName}</div>
                <div style={{ fontSize: 12.5, color: "#7A8290", marginTop: 2 }}>{selected.major} · {selected.email}</div>
              </div>
            </div>

            <div className="sd-sec">{t("Identity")}</div>
            <div className="sd-row"><span className="sd-row-ico"><CreditCard size={15} /></span><span className="sd-row-label">{t("Student ID")}</span><span className="sd-row-value">{selected.studentId}</span></div>
            <div className="sd-row"><span className="sd-row-ico"><UserCircle2 size={15} /></span><span className="sd-row-label">{t("Username")}</span><span className="sd-row-value">{selected.username}</span></div>
            <div className="sd-row"><span className="sd-row-ico"><Cake size={15} /></span><span className="sd-row-label">{t("Date of Birth")}</span><span className="sd-row-value">{selected.birthDate} · {t(selected.gender)}</span></div>
            <div className="sd-row"><span className="sd-row-ico"><MapPin size={15} /></span><span className="sd-row-label">{t("Birthplace")}</span><span className="sd-row-value">{selected.birthPlace}</span></div>
            <div className="sd-row"><span className="sd-row-ico"><MapPin size={15} /></span><span className="sd-row-label">{t("Address")}</span><span className="sd-row-value">{selected.address}</span></div>

            <div className="sd-sec">{t("Contact")}</div>
            <div className="sd-row"><span className="sd-row-ico"><Mail size={15} /></span><span className="sd-row-label">{t("Email")}</span><span className="sd-row-value">{selected.email}</span></div>
            <div className="sd-row"><span className="sd-row-ico"><Phone size={15} /></span><span className="sd-row-label">{t("Phone")}</span><span className="sd-row-value">{selected.phone}</span></div>

            <div className="sd-sec">{t("Academic")}</div>
            <div className="sd-row"><span className="sd-row-ico"><GraduationCap size={15} /></span><span className="sd-row-label">{t("Major")}</span><span className="sd-row-value">{selected.major}</span></div>
            <div className="sd-row"><span className="sd-row-ico"><GraduationCap size={15} /></span><span className="sd-row-label">{t("Year")}</span><span className="sd-row-value">Year {selected.year} · Semester {selected.semester}</span></div>

            <div className="sd-sec">{t("Payment History")}</div>
            <div style={{ paddingBottom: 18 }}>
              {selected.invoices.length === 0 ? (
                <div style={{ padding: "4px 22px 10px", color: "#6B7280", fontSize: 13 }}>{t("No invoices yet.")}</div>
              ) : (
                selected.invoices.map((inv) => {
                  const m = PAY_META[inv.status];
                  const pct = inv.amount ? Math.round((inv.paid / inv.amount) * 100) : 0;
                  return (
                    <div key={inv.id} className="sd-row" style={{ justifyContent: "space-between" }}>
                      <span className="sd-row-ico"><CreditCard size={15} /></span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1F2430" }}>{inv.title}</div>
                        <div style={{ fontSize: 12, color: "#7A8290", marginTop: 2 }}>{t("Due")} {inv.dueDate} · {money(inv.paid)} / {money(inv.amount)}</div>
                        <div style={{ height: 5, borderRadius: 999, background: "#EFECE6", marginTop: 8, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: m.fg, borderRadius: 999 }} />
                        </div>
                      </div>
                      <span className="sd-pay" style={{ background: m.bg, color: m.fg }}>{t(inv.status)}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}