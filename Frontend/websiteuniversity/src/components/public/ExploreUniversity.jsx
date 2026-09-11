import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

const QUICK_LINKS = [
  { label: "About Us", href: "/public/aboutus", icon: "🏫", desc: "Our story, mission & vision", color: "#4d79ff" },
  { label: "Course", href: "/public/course", icon: "🎓", desc: "Browse programs & curriculum", color: "#8b5cf6" },
  { label: "FAQ", href: "/public/faq", icon: "❓", desc: "Answers to common questions", color: "#f59e0b" },
  { label: "Scholarships", href: "/public/scholarships", icon: "🌟", desc: "Funding & financial aid", color: "#10b981" },
  { label: "Facilities", href: "/public/facilities", icon: "🔬", desc: "Labs, campus & learning spaces", color: "#06b6d4" },
  { label: "Check Application Status", href: "/public/application-status", icon: "📋", desc: "Track your enrollment progress", color: "#ec4899" },
];

const RESOURCES = [
  { label: "Library", href: "/public/facilities", icon: "📚", desc: "Digital & physical resources", color: "#6366f1" },
  { label: "Academic Calendar", href: "/public/calendar", icon: "📅", desc: "Semester schedule & deadlines", color: "#0ea5e9" },
  { label: "Faculty & Staff", href: "/public/staff", icon: "👥", desc: "Meet our team", color: "#14b8a6" },
  { label: "Events", href: "/public/calendar", icon: "🎉", desc: "Campus life & activities", color: "#f43f5e" },
];

const ENROLL = { label: "Enroll", href: "/public/content/enroll", icon: "🚀", desc: "Start your journey at CIU today", color: "#4d79ff" };

function Card({ item, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group text-left w-full rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform duration-200 group-hover:scale-110"
        style={{ background: `${item.color}18`, color: item.color }}
      >
        {item.icon}
      </div>
      <div className="space-y-1">
        <div className="font-semibold text-sm text-slate-900 dark:text-slate-100 leading-snug">
          {item.label}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {item.desc}
        </div>
      </div>
      <div className="mt-auto pt-1 text-xs font-semibold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
        Visit →
      </div>
    </button>
  );
}

function GroupLabel({ children }) {
  return (
    <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
      {children}
    </h3>
  );
}

export default function ExploreUniversity() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="bg-[#f1f5f9] dark:bg-slate-900 py-14 sm:py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-block">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-blue-600 text-white px-3 py-1.5 rounded-full">
              🏛 Explore CIU
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {t("Everything you need, one click away")}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg mx-auto">
            {t("Discover programs, resources, and services — all accessible directly from here.")}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <GroupLabel>{t("Quick Links")}</GroupLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUICK_LINKS.map((item) => (
              <Card
                key={item.label}
                item={{ ...item, label: t(item.label) }}
                onClick={() => navigate(item.href)}
              />
            ))}
          </div>
        </div>

        {/* Resources */}
        <div>
          <GroupLabel>{t("Resources")}</GroupLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {RESOURCES.map((item) => (
              <Card
                key={item.label}
                item={{ ...item, label: t(item.label) }}
                onClick={() => navigate(item.href)}
              />
            ))}
            {/* Featured Enroll Card */}
            <button
              onClick={() => navigate(ENROLL.href)}
              className="group relative text-left w-full rounded-2xl overflow-hidden p-5 flex flex-col justify-between min-h-[160px] text-white transition-all duration-200 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              style={{ background: "linear-gradient(135deg,#4d79ff 0%,#8585e6 100%)" }}
            >
              {/* Decorative circle */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
              <div className="relative z-10 space-y-2">
                <div className="text-3xl">{ENROLL.icon}</div>
                <div className="text-lg font-bold leading-snug">{t("Enroll")}</div>
                <div className="text-xs text-white/80 leading-relaxed">{t("Start your journey at CIU today")}</div>
              </div>
              <div className="relative z-10 mt-3 text-xs font-semibold text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Apply now →
              </div>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
