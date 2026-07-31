import { useLanguage } from "../../context/LanguageContext";

export default function BlackFooter() {
  const { t } = useLanguage();
  return (
    <footer style={{ background: "#0f172a", padding: "28px 32px", display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "space-between", alignItems: "center" }}>
      <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, margin: 0 }}>
        {t("This contact provided by our University.")} 🇰🇭
      </p>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 6, fontWeight: 600 }}>{t("Contact us for more information")}</p>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, margin: 0 }}>✉ {t("Email")}: CIU.edu.info@gmail.com</p>
      </div>
      <div style={{ textAlign: "right" }}>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 6, fontWeight: 600 }}>{t("Developer System")}</p>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, margin: 0 }}>⊙ {t("Github")}: Sullivann Sam.github</p>
      </div>
    </footer>
  );
}