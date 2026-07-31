import { CalendarDays } from 'lucide-react';
import InfoPage from '../../components/public/InfoPage';
import { useLanguage } from "../../context/LanguageContext";

const EVENTS = [
  { date: "2026-08-15", title: "Registration Opens", desc: "Online registration opens for the new academic year.", tag: "Admission" },
  { date: "2026-09-05", title: "Orientation Week", desc: "Welcome event for new students across all faculties.", tag: "Campus" },
  { date: "2026-09-12", title: "First Day of Classes", desc: "Semester 1 lectures begin.", tag: "Academic" },
  { date: "2026-10-24", title: "Midterm Examinations", desc: "Midterm exams run for one week.", tag: "Exam" },
  { date: "2026-11-12", title: "University Open Day", desc: "Campus tours and program showcases for prospective students.", tag: "Campus" },
  { date: "2026-12-18", title: "Final Examinations", desc: "Final exams for Semester 1.", tag: "Exam" },
  { date: "2026-12-24", title: "Semester Break Begins", desc: "Winter break starts after exams.", tag: "Holiday" },
  { date: "2027-01-10", title: "Semester 2 Begins", desc: "Lectures resume for the second semester.", tag: "Academic" },
];

const TAG_COLORS = {
  "Admission": "#3E5EDB",
  "Campus": "#7A5CDB",
  "Academic": "#2E9E6C",
  "Exam": "#D2483C",
  "Holiday": "#D69A1E",
};

export default function AcademicCalendar() {
  const { t } = useLanguage();
  const fmt = (d) => new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

  return (
    <InfoPage
      icon={<CalendarDays size={30} />}
      title={t("Academic Calendar")}
      subtitle={t("Key dates and events for the 2026–2027 academic year.")}
    >
      <style>{`
        .cal-list { display: flex; flex-direction: column; gap: 12px; }
        .cal-item {
          display: flex; gap: 16px; align-items: flex-start;
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: 14px; padding: 18px 20px;
        }
        .cal-date {
          width: 74px; flex-shrink: 0; text-align: center;
          background: var(--hover-bg); border-radius: 12px; padding: 10px 6px;
        }
        .cal-date-day { font-size: 20px; font-weight: 800; color: #3E5EDB; line-height: 1; }
        .cal-date-month { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-top: 3px; }
        .cal-title { font-size: 15.5px; font-weight: 700; color: var(--text-primary); margin: 0 0 4px; }
        .cal-desc { font-size: 13px; color: var(--text-secondary); margin: 0; line-height: 1.6; }
        .cal-tag {
          display: inline-block; font-size: 11px; font-weight: 700; color: #fff;
          padding: 3px 10px; border-radius: 999px; margin-bottom: 8px;
        }
      `}</style>

      <div className="cal-list">
        {EVENTS.map((e, i) => {
          const d = new Date(e.date);
          return (
            <div className="cal-item" key={i}>
              <div className="cal-date">
                <div className="cal-date-day">{d.getDate()}</div>
                <div className="cal-date-month">{d.toLocaleDateString("en-US", { month: "short" })} {d.getFullYear()}</div>
              </div>
              <div>
                <span className="cal-tag" style={{ background: TAG_COLORS[e.tag] || "#6B7280" }}>{t(e.tag)}</span>
                <h3 className="cal-title">{t(e.title)}</h3>
                <p className="cal-desc">{t(e.desc)} — {fmt(e.date)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </InfoPage>
  );
}
