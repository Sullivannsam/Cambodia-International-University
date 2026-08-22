import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, BookOpen, CalendarDays, IdCard, UserCircle2 } from 'lucide-react';
import { getStudentCard } from '../../services/endpoints';
import { useLanguage } from '../../context/LanguageContext';

export default function StudentIdCard({ fallback = {} }) {
  const { t } = useLanguage();
  const [card, setCard] = useState(null);
  const [photoError, setPhotoError] = useState(false);

  useEffect(() => {
    let live = true;
    getStudentCard()
      .then((d) => { if (live) setCard(d); })
      .catch(() => {});
    return () => { live = false; };
  }, []);

  const c = { ...fallback, ...(card || {}) };
  const code = c.cardCode
    || (c.id && !isNaN(c.id) ? String(c.id).padStart(6, "0") : "------");
  const fullName = c.fullName || c.username || c.name || t("Student");

  const Row = ({ icon: Icon, label, value }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: "1px dashed rgba(0,0,0,0.08)" }}>
      <Icon size={16} color="#3E5EDB" style={{ flexShrink: 0 }} />
      <span style={{ fontSize: 13, color: "#64748b", minWidth: 90 }}>{label}</span>
      <strong style={{ fontSize: 14, color: "#182644", flex: 1, minWidth: 0, overflowWrap: "anywhere" }}>{value || "-"}</strong>
    </div>
  );

  return (
    <div style={{
      maxWidth: 520,
      borderRadius: 18,
      overflow: "hidden",
      border: "1px solid rgba(0,0,0,0.08)",
      boxShadow: "0 10px 30px rgba(24,38,68,0.12)",
      background: "var(--bg-primary, #fff)",
    }}>
      <style>{`
        @media print { .sic-actions { display: none !important; } }
      `}</style>

      <div style={{
        background: "linear-gradient(135deg, #182644 0%, #3E5EDB 100%)",
        color: "#fff",
        padding: "18px 22px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15 }}>Cambodia International University</div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>{t("Official Student Card")}</div>
        </div>
        <IdCard size={26} />
      </div>

      <div style={{ padding: 22 }}>
        <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 16 }}>
          <div style={{
            width: 84, height: 84, borderRadius: "50%", overflow: "hidden", flexShrink: 0,
            border: "3px solid #3E5EDB", background: "#E8EDFB",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {c.photoUrl && !photoError ? (
              <img
                src={c.photoUrl}
                alt={fullName}
                onError={() => setPhotoError(true)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <UserCircle2 size={46} color="#3E5EDB" />
            )}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 19, color: "#182644", lineHeight: 1.25, overflowWrap: "anywhere" }}>{fullName}</div>
            <div style={{
              display: "inline-block", marginTop: 5, padding: "3px 12px", borderRadius: 999,
              background: "rgba(62,94,219,0.1)", color: "#3E5EDB", fontWeight: 700, fontSize: 13,
              letterSpacing: 1,
            }}>
              {code}
            </div>
          </div>
        </div>

        <Row icon={BookOpen} label={t("Major")} value={c.major} />
        <Row icon={CalendarDays} label={t("Year")} value={c.year || (c.yearNumber ? `${t("Year")} ${c.yearNumber}` : "")} />
        <Row icon={Mail} label={t("Email")} value={c.email} />
        <Row icon={Phone} label={t("Phone")} value={c.phone} />
        <Row icon={MapPin} label={t("Address")} value={c.address} />

        <p style={{ margin: "14px 0 0", fontSize: 12, color: "#94a3b8", textAlign: "center" }}>
          {t("This card is managed by the university administration.")}
        </p>
      </div>
    </div>
  );
}
