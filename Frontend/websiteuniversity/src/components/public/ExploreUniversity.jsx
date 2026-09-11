import { useNavigate } from "react-router-dom";
import {
  Landmark,
  GraduationCap,
  HelpCircle,
  Award,
  FlaskConical,
  ClipboardCheck,
  BookOpen,
  CalendarDays,
  Users,
  CalendarClock,
  Rocket,
  Compass,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const QUICK_LINKS = [
  { label: "About Us", href: "/public/aboutus", Icon: Landmark, desc: "Our story, mission & vision" },
  { label: "Course", href: "/public/course", Icon: GraduationCap, desc: "Browse programs & curriculum" },
  { label: "FAQ", href: "/public/faq", Icon: HelpCircle, desc: "Answers to common questions" },
  { label: "Scholarships", href: "/public/scholarships", Icon: Award, desc: "Funding & financial aid" },
  { label: "Facilities", href: "/public/facilities", Icon: FlaskConical, desc: "Labs, campus & learning spaces" },
  { label: "Check Application Status", href: "/public/application-status", Icon: ClipboardCheck, desc: "Track your enrollment progress" },
];

const RESOURCES = [
  { label: "Library", href: "/public/facilities", Icon: BookOpen, desc: "Digital & physical resources" },
  { label: "Academic Calendar", href: "/public/calendar", Icon: CalendarDays, desc: "Semester schedule & deadlines" },
  { label: "Faculty & Staff", href: "/public/staff", Icon: Users, desc: "Meet our team" },
  { label: "Events", href: "/public/calendar", Icon: CalendarClock, desc: "Campus life & activities" },
];

const ENROLL = { label: "Enroll", href: "/public/content/enroll", Icon: Rocket, desc: "Start your journey at CIU today" };

function Card({ item, onClick }) {
  const { Icon } = item;
  return (
    <button
      onClick={onClick}
      className="group text-left w-full rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 flex flex-col gap-3 transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400/40"
    >
      <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 shrink-0">
        <Icon size={20} strokeWidth={1.75} />
      </div>
      <div className="space-y-1">
        <div className="font-semibold text-sm text-slate-900 dark:text-slate-100 leading-snug">
          {item.label}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {item.desc}
        </div>
      </div>
      <div className="mt-auto pt-1 text-xs font-semibold text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
        Visit <ArrowRight size={13} />
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
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-slate-800 text-white px-3 py-1.5 rounded-full">
              <Compass size={12} strokeWidth={2} />
              {t("Explore CIU")}
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
              className="group relative text-left w-full rounded-xl overflow-hidden p-5 flex flex-col justify-between min-h-[160px] text-white transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-400/50"
              style={{ background: "linear-gradient(135deg,#1e293b 0%,#334155 100%)" }}
            >
              <div className="relative z-10 space-y-2">
                <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-white/10 text-white">
                  <Rocket size={20} strokeWidth={1.75} />
                </div>
                <div className="text-lg font-bold leading-snug">{t("Enroll")}</div>
                <div className="text-xs text-white/70 leading-relaxed">{t("Start your journey at CIU today")}</div>
              </div>
              <div className="relative z-10 mt-3 text-xs font-semibold text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
                {t("Apply now")} <ArrowRight size={13} />
              </div>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
