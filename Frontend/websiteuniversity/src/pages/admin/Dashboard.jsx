import React, { useState, useEffect, useMemo } from "react";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import {
  LayoutGrid, TrendingUp, ClipboardCheck, UserCheck, Users,
  BookOpen, CalendarDays, FileBarChart, UserCircle2, LogOut,
  Search, ChevronRight, Loader2, UserCog, FileClock, Newspaper,
  ChevronsLeft, ChevronsRight, UserPlus, Inbox, Megaphone, FileDown, IdCard
} from "lucide-react";
import {
  getDashboardStats, getStudentAttendance, getTeacherAttendance,
  getIncomeData, getEarnings, getFeeGroups, getFeeGroupMembers,
  getStudentAccounts, getTeacherAccounts, getAdminAccounts,
  getEnrollments, getContact, getReports
} from "../../services/endpoints";
import LogoutModal from "../../components/common/LogoutModal";
import UserManagement from "./UserManagement";
import CourseManagement from "./CourseManagement";
import NewsManagement from "./NewsManagement";
import AuditLog from "./AuditLog";
import EnrollmentManagement from "./EnrollmentManagement";
import Progression from "./Progression";
import StudentCardManager from "./StudentCardManager";
import ContactInbox from "./ContactInbox";
import ReportPage from "./ReportPage";
import ScheduleBuilder from "./ScheduleBuilder";
import NotificationsCenter from "./NotificationsCenter";
import { useLanguage } from "../../context/LanguageContext";
import { useActiveTab } from "../../hooks/useActiveTab";

const NAV = [
  {
    label: "Setting",
    items: [
      { key: "overview", label: "Overview", icon: LayoutGrid },
      { key: "income", label: "Amount Income", icon: TrendingUp },
    ],
  },
  {
    label: "Attendances",
    items: [
      { key: "student-att", label: "Student Attendance", icon: ClipboardCheck },
      { key: "teacher-att", label: "Teacher Attendance", icon: UserCheck },
    ],
  },
  {
    label: "About Students",
    items: [
      { key: "students", label: "Students", icon: Users },
      { key: "classes", label: "Classes", icon: BookOpen },
      { key: "schedule", label: "Schedule", icon: CalendarDays },
      { key: "report", label: "Report", icon: FileBarChart },
      { key: "progression", label: "Progression", icon: TrendingUp },
      { key: "cards", label: "Student Cards", icon: IdCard },
    ],
  },
  {
    label: "Account",
    items: [
      { key: "student-acc", label: "Student Account", icon: UserCircle2 },
      { key: "teacher-acc", label: "Teacher Account", icon: UserCircle2 },
      { key: "admin-acc", label: "Admin Account", icon: UserCircle2 },
      { key: "user-mgmt", label: "User Management", icon: UserCog },
    ],
  },
  {
    label: "Management",
    items: [
      { key: "courses", label: "Courses", icon: BookOpen },
      { key: "news", label: "News", icon: Newspaper },
      { key: "enrollments", label: "Enrollments", icon: UserPlus, badge: 3 },
      { key: "contact", label: "Contact Inbox", icon: Inbox, badge: 4 },
      { key: "notifications", label: "Notifications", icon: Megaphone },
      { key: "audit-log", label: "Audit Log", icon: FileClock },
    ],
  },
];

function attColor(pct) {
  if (pct >= 90) return "#2E9E6C";
  if (pct >= 70) return "#D69A1E";
  return "#D2483C";
}

function StatTile({ title, value, color }) {
  return (
    <div className="stat-tile">
      <div className="stat-tile-title">{title}</div>
      <div className="stat-tile-value" style={{ color }}>{value}</div>
    </div>
  );
}

function PersonCard({ person, kind }) {
  const { t } = useLanguage();
  const color = attColor(person.att);
  return (
    <div className="person-card">
      <div className="person-card-head">
        <div className="person-avatar"><UserCircle2 size={30} strokeWidth={1.4} /></div>
      </div>
      <div className="person-card-body">
        <div className="person-name"><span className="label">{t("Username:")}</span> {person.name}</div>
        <div><span className="label">{t("ID:")}</span> {person.id}</div>
        {kind === "student" && (
          <>
            <div><span className="label">{t("Major:")}</span> {person.major}</div>
            <div><span className="label">{t("Class:")}</span> {person.cls}</div>
          </>
        )}
        <div className="att-row">
          <span className="label">{t("Attendance:")}</span>
          <span className="att-pill" style={{ background: color }}>{person.att}%</span>
        </div>
        <div>
          <span className="label">{t("Absent:")}</span> {person.absentPct}%
          {person.dates?.length > 0 && <span> {t("On Date:")}</span>}
        </div>
        {person.dates?.length > 0 && (
          <ul className="dates">
            {person.dates.map((d) => <li key={d}>{d}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
}

function GroupSection({ title, members }) {
  const { t } = useLanguage();
  return (
    <div className="group-section">
      <div className="group-title">{title}</div>
      <div className="group-grid">
        {members?.length > 0 ? members.map((m, i) => (
          <div className="group-row" key={i}>
            <div className="group-avatar"><UserCircle2 size={22} strokeWidth={1.4} /></div>
            <div className="group-info">
              <div><span className="label">{t("ID:")}</span> {m.id || `000${i + 1}`}</div>
              <div><span className="label">{t("Username:")}</span> {m.name}</div>
              <div><span className="label">{t("Major:")}</span> {m.major || "IT"}</div>
              <div><span className="label">{t("Year:")}</span> {m.year || "2"}</div>
            </div>
            <div className="group-actions">
              <button className="btn-update">{t("Update")}</button>
              <button className="btn-delete">{t("Delete")}</button>
            </div>
          </div>
        )) : (
          <div className="group-row">
            <div className="group-info">{t("No members in this group")}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function AccountTable({ title, accounts, query }) {
  const { t } = useLanguage();
  const rows = Array.isArray(accounts) ? accounts : [];
  const q = (query || "").toString().toLowerCase().trim();
  const filtered = q
    ? rows.filter((a) => {
        const name = (a.username || "").toString().toLowerCase();
        const id = (a.id === null || a.id === undefined ? "" : a.id.toString().toLowerCase());
        return name.includes(q) || id.includes(q);
      })
    : rows;
  return (
    <div className="panel">
      <div className="panel-title">{title} ({filtered.length})</div>
      {q && filtered.length === 0 ? (
        <div style={{
          background: "#FBE3E0", border: "1px solid #E0665A",
          color: "#D2483C", borderRadius: 10, padding: "12px 16px",
          fontSize: 13, fontWeight: 600,
        }}>
          {t("account")} "{query}" {t("doesn't exist in table")}
        </div>
      ) : filtered.length > 0 ? (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: "left", color: "#3E5EDB", borderBottom: "2px solid #E5E7EB" }}>
              <th style={{ padding: "10px 12px" }}>{t("ID")}</th>
              <th style={{ padding: "10px 12px" }}>{t("Username")}</th>
              <th style={{ padding: "10px 12px" }}>{t("Email")}</th>
              <th style={{ padding: "10px 12px" }}>{t("Phone")}</th>
              <th style={{ padding: "10px 12px" }}>{t("Role")}</th>
              <th style={{ padding: "10px 12px" }}>{t("Status")}</th>
              <th style={{ padding: "10px 12px" }}>{t("Date")}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #F0EEE9" }}>
                <td style={{ padding: "10px 12px", fontWeight: 700, color: "#3E5EDB" }}>{a.id ?? "-"}</td>
                <td style={{ padding: "10px 12px", fontWeight: 600, color: "#182644" }}>{a.username || "-"}</td>
                <td style={{ padding: "10px 12px" }}>{a.email || "-"}</td>
                <td style={{ padding: "10px 12px" }}>{a.phone || "-"}</td>
                <td style={{ padding: "10px 12px" }}>{a.role || "-"}</td>
                <td style={{ padding: "10px 12px" }}>
                  <span style={{ color: a.active === false ? "#D2483C" : "#2E9E6C", fontWeight: 700 }}>
                    {a.active === false ? t("Inactive") : t("Active")}
                  </span>
                </td>
                <td style={{ padding: "10px 12px" }}>{a.date || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="date-label">{t("No accounts found.")}</div>
      )}
    </div>
  );
}

function Placeholder({ title }) {
  const { t } = useLanguage();
  return (
    <div className="placeholder">
      <div className="placeholder-icon"><ChevronRight size={22} /></div>
      <div>
        <div className="placeholder-title">{title}</div>
        <div className="placeholder-sub">{t("This section isn't wired up in the preview yet — it would live here, styled to match the rest of the dashboard.")}</div>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center" style={{ padding: "80px 0" }}>
      <Loader2 size={32} className="animate-spin" style={{ color: "#3E5EDB" }} />
    </div>
  );
}

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [active, setActive] = useActiveTab("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [studentQuery, setStudentQuery] = useState("");
  const [teacherQuery, setTeacherQuery] = useState("");
  const [studentAccQuery, setStudentAccQuery] = useState("");
  const [teacherAccQuery, setTeacherAccQuery] = useState("");
  const [adminAccQuery, setAdminAccQuery] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [incomePie, setIncomePie] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [feeGroups, setFeeGroups] = useState([]);
  const [feeGroupMembers, setFeeGroupMembers] = useState({});
  const [studentAccounts, setStudentAccounts] = useState([]);
  const [teacherAccounts, setTeacherAccounts] = useState([]);
  const [adminAccounts, setAdminAccounts] = useState([]);
  const [badges, setBadges] = useState({ enrollments: 0, contact: 0, report: 0 });
  const [seen, setSeen] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("adminSeenBadges") || "{}");
    } catch {
      return {};
    }
  });

  const effectiveBadge = (key) => {
    const count = badges[key] || 0;
    return count > (seen[key] || 0) ? count : 0;
  };

  const markSeen = (key) => {
    const s = { ...seen, [key]: badges[key] || 0 };
    setSeen(s);
    localStorage.setItem("adminSeenBadges", JSON.stringify(s));
  };

  const user = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const today = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  }, []);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError("");
      try {
        const [statsRes, studentsRes, teachersRes, incomeRes, earningsRes, groupsRes] =
          await Promise.all([
            getDashboardStats().catch(() => ({ stats: [] })),
            getStudentAttendance().catch(() => []) ,
            getTeacherAttendance().catch(() => []) ,
            getIncomeData().catch(() => ({ TotalIncome: 0 })),
            getEarnings().catch(() => []),
            getFeeGroups().catch(() => []),
          ]);

        setStats(Array.isArray(statsRes.stats) ? statsRes.stats : []);
        setStudents(Array.isArray(studentsRes) ? studentsRes : []);
        setTeachers(Array.isArray(teachersRes) ? teachersRes : []);
        const total = typeof incomeRes.TotalIncome === 'number' ? incomeRes.TotalIncome : 0;
        setIncomePie([{ name: 'Total Income', value: Math.round(total), color: '#3E5EDB' }]);

        const monthly = Array.isArray(earningsRes) ? earningsRes : [];
        setEarnings(monthly);

        const groups = Array.isArray(groupsRes) ? groupsRes : [];
        setFeeGroups(groups);

        const memberMap = {};
        for (const g of groups) {
          const res = await getFeeGroupMembers(g).catch(() => []);
          memberMap[g] = Array.isArray(res) ? res : [];
        }
        setFeeGroupMembers(memberMap);

        const [stuAcc, teaAcc, admAcc] = await Promise.all([
          getStudentAccounts().catch(() => []),
          getTeacherAccounts().catch(() => []),
          getAdminAccounts().catch(() => []),
        ]);
        setStudentAccounts(Array.isArray(stuAcc) ? stuAcc : []);
        setTeacherAccounts(Array.isArray(teaAcc) ? teaAcc : []);
        setAdminAccounts(Array.isArray(admAcc) ? admAcc : []);

        const [enrollRes, contactRes, reportsRes] = await Promise.all([
          getEnrollments().catch(() => []),
          getContact().catch(() => []),
          getReports().catch(() => []),
        ]);
        const enrollArr = Array.isArray(enrollRes) ? enrollRes : Array.isArray(enrollRes.enrollments) ? enrollRes.enrollments : [];
        const contactArr = Array.isArray(contactRes) ? contactRes : Array.isArray(contactRes.messages) ? contactRes.messages : [];
        const reportsArr = Array.isArray(reportsRes) ? reportsRes : Array.isArray(reportsRes.reports) ? reportsRes.reports : [];
        setBadges({
          enrollments: enrollArr.filter((e) => e.status === "PENDING").length,
          contact: contactArr.filter((m) => !m.read).length,
          report: reportsArr.filter((r) => !r.read).length,
        });
      } catch (err) {
        setError(t("Failed to load dashboard data. Make sure the backend server is running."));
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const refreshReports = async () => {
      try {
        const data = await getReports();
        if (cancelled) return;
        const arr = Array.isArray(data) ? data : Array.isArray(data.reports) ? data.reports : [];
        setBadges((b) => ({ ...b, report: arr.filter((r) => !r.read).length }));
      } catch { /* keep last count */ }
    };
    refreshReports();
    const id = setInterval(refreshReports, 10000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  const filteredStudents = students.filter((s) =>
    (s.name + s.id).toLowerCase().includes(studentQuery.toLowerCase())
  );
  const filteredTeachers = teachers.filter((teacher) =>
    (teacher.name + teacher.id).toLowerCase().includes(teacherQuery.toLowerCase())
  );

  const lastMonthA = earnings.length ? earnings[earnings.length - 1]?.a ?? 0 : 0;
  const lastMonthB = earnings.length ? earnings[earnings.length - 1]?.b ?? 0 : 0;
  const avgEarning = earnings.length
    ? Math.round(earnings.reduce((sum, e) => sum + (e.a || 0) + (e.b || 0), 0) / earnings.length)
    : 0;

  const exportEarningsCSV = () => {
    const header = `${t("Month")},a,b`;
    const rows = earnings.map((e) => `"${e.m}","${e.a ?? 0}","${e.b ?? 0}"`).join("\n");
    const blob = new Blob([`${header}\n${rows}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "earnings.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeLabel =
    NAV.flatMap((s) => s.items).find((i) => i.key === active)?.label || "Overview";

  if (sessionStorage.getItem("role") !== "ADMIN") {
    window.location.href = "/";
    return null;
  }

  return (
    <div className="app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .app *:focus { outline: none; }
        .app {
          font-family: 'Inter', system-ui, sans-serif;
          color: #1F2430;
          background: #F6F4EF;
          min-height: 100vh;
          display: flex;
        }
        .sidebar {
          width: 250px;
          flex-shrink: 0;
          background: #182644;
          color: #E7EAF4;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          transition: width 0.25s ease;
        }
        .sidebar.collapsed { width: 72px; }
        .sidebar.collapsed .sidebar-head { padding: 48px 0 16px; display: flex; flex-direction: column; align-items: center; }
        .sidebar.collapsed .avatar-ring { margin-bottom: 0; }
        .sidebar.collapsed .sidebar-head-title { display: none; }
        .sidebar.collapsed .sidebar-scroll { padding: 18px 8px 30px; }
        .sidebar.collapsed .nav-section-label { display: none; }
        .sidebar.collapsed .nav-item { justify-content: center; padding: 9px 0; }
        .sidebar.collapsed .nav-label { display: none; }
        .sidebar-collapse-btn {
          position: absolute; top: 12px; right: 10px;
          width: 28px; height: 28px; border-radius: 8px;
          background: rgba(255,255,255,0.1); border: none; color: #C9D0E8;
          display: flex; align-items: center; justify-content: center; cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .sidebar-collapse-btn:hover { background: rgba(255,255,255,0.2); color: #fff; }
        .sidebar.collapsed .sidebar-collapse-btn { right: auto; left: 50%; top: 12px; transform: translateX(-50%); }
        .sidebar-head {
          padding: 26px 22px 20px;
          background: linear-gradient(160deg,#233766,#182644 70%);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          position: relative;
        }
        .avatar-ring {
          width: 56px; height: 56px; border-radius: 50%;
          background: #3E5EDB;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 12px;
          box-shadow: 0 0 0 3px rgba(255,255,255,0.15);
        }
        .sidebar-head-title {
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: 14.5px;
          letter-spacing: 0.2px;
        }
        .sidebar-scroll { padding: 18px 14px 30px; overflow-y: auto; }
        .nav-section { margin-bottom: 18px; }
        .nav-section-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          color: #7C89B8;
          padding: 0 10px 8px;
          font-weight: 600;
        }
        .nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px;
          border-radius: 8px;
          font-size: 13.5px;
          color: #C9D0E8;
          cursor: pointer;
          margin-bottom: 3px;
          transition: background 0.15s ease, color 0.15s ease;
          background: transparent;
          border: none;
          width: 100%;
          text-align: left;
          position: relative;
        }
        .nav-badge {
          position: absolute;
          top: 7px;
          right: 8px;
          min-width: 17px;
          height: 17px;
          padding: 0 5px;
          border-radius: 999px;
          background: #ef4444;
          color: #fff;
          font-size: 10.5px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          box-shadow: 0 2px 6px rgba(239, 68, 68, 0.45);
        }
        .nav-item:hover { background: rgba(255,255,255,0.06); color: #fff; }
        .nav-item.active {
          background: #3E5EDB;
          color: #fff;
          box-shadow: 0 4px 14px rgba(62,94,219,0.4);
        }
        .main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
        .topbar {
          background: #FBF4EE;
          padding: 22px 34px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #ECE3D8;
        }
        .topbar-title {
          font-family: 'Poppins', sans-serif;
          font-size: 21px;
          font-weight: 600;
          color: #182644;
        }
        .topbar-sub { font-size: 12.5px; color: #9A8F80; margin-top: 2px; }
        .logout-btn {
          background: #3E5EDB;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 9px;
          font-size: 13.5px;
          font-weight: 600;
          display: flex; align-items: center; gap: 8px;
          cursor: pointer;
          box-shadow: 0 6px 16px rgba(62,94,219,0.35);
        }
        .content { padding: 26px 34px 60px; flex: 1; }
        .content-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 22px; gap: 20px; flex-wrap: wrap;
        }
        .date-label { color: #6B7280; font-size: 13.5px; }
        .search-box {
          display: flex; align-items: center; gap: 8px;
          background: #EFEBE3; border-radius: 10px;
          padding: 9px 14px; width: 260px; color: #8A8378;
        }
        .search-box input {
          border: none; outline: none; background: transparent;
          font-size: 13px; width: 100%; color: #1F2430;
        }
        .error-banner {
          background: #FBE3E0; border: 1px solid #E0665A;
          color: #D2483C; border-radius: 10px; padding: 12px 18px;
          font-size: 13px; margin-bottom: 20px;
        }
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0,1fr));
          gap: 20px;
          margin-bottom: 22px;
        }
        .stat-tile {
          background: #fff;
          border-radius: 14px;
          padding: 18px 20px;
          box-shadow: 0 4px 16px rgba(24,38,68,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .stat-tile-title {
          font-size: 13px; font-weight: 600; color: #1F2430;
        }
        .stat-tile-value {
          font-size: 30px; font-weight: 700; line-height: 1;
        }
        .overview-head {
          display: flex; justify-content: space-between; align-items: flex-end;
          margin-bottom: 22px;
        }
        .overview-greet {
          font-size: 22px; font-weight: 700; color: #1F2430; margin-bottom: 4px;
        }
        .overview-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 20px;
          margin-bottom: 22px;
        }
        .panel {
          background: #fff; border-radius: 14px; padding: 18px 20px;
          box-shadow: 0 4px 16px rgba(24,38,68,0.06);
        }
        .panel-title { font-size: 14px; font-weight: 700; color: #1F2430; margin-bottom: 14px; }
        .attention-list { display: flex; flex-direction: column; gap: 10px; }
        .attention-item {
          display: flex; align-items: center; gap: 12px;
          width: 100%; text-align: left; cursor: pointer;
          background: #FAF9F6; border: 1px solid #EFECE6; border-radius: 12px;
          padding: 12px 14px;
          transition: background 0.15s ease, border-color 0.15s ease;
        }
        .attention-item:hover { background: #F3F1EB; border-color: #E2DED5; }
        .attention-ico {
          width: 38px; height: 38px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .attention-text { display: flex; flex-direction: column; flex: 1; min-width: 0; }
        .attention-title { font-size: 13.5px; font-weight: 600; color: #1F2430; }
        .attention-sub { font-size: 12px; color: #7A8290; margin-top: 2px; }
        .attention-count {
          font-size: 13px; font-weight: 700; color: #3E5EDB;
          background: #E9EEFF; border-radius: 999px; padding: 4px 10px;
        }
        .account-summary { display: flex; flex-direction: column; gap: 10px; }
        .account-row {
          display: flex; align-items: center; gap: 12px;
          background: #FAF9F6; border-radius: 12px; padding: 12px 14px;
        }
        .account-ico {
          width: 34px; height: 34px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .account-name { flex: 1; font-size: 13.5px; font-weight: 600; color: #1F2430; }
        .account-num { font-size: 18px; font-weight: 700; color: #1F2430; }
        .person-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 20px;
        }
        .person-card {
          background: #fff; border-radius: 14px; overflow: hidden;
          box-shadow: 0 4px 16px rgba(24,38,68,0.07);
        }
        .person-card-head {
          background: #DCEEE1; padding: 22px 0; display: flex; justify-content: center;
        }
        .person-avatar {
          width: 52px; height: 52px; border-radius: 50%;
          background: #ffffffaa; display: flex; align-items: center; justify-content: center;
          color: #182644;
        }
        .person-card-body { padding: 16px 18px 20px; font-size: 12.8px; line-height: 1.9; }
        .label { color: #182644; font-weight: 600; }
        .att-row { display: flex; align-items: center; gap: 8px; }
        .att-pill {
          color: #fff; font-size: 11.5px; font-weight: 700;
          padding: 2px 9px; border-radius: 999px;
        }
        .dates { margin: 4px 0 0 0; padding-left: 18px; color: #6B7280; }
        .income-top {
          display: grid; grid-template-columns: 1fr 1.4fr; gap: 20px; margin-bottom: 26px;
        }
        .income-summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 22px; }
        .income-sum-card {
          background: #fff; border-radius: 14px; padding: 16px 20px;
          box-shadow: 0 4px 16px rgba(24,38,68,0.06);
        }
        .income-sum-label { font-size: 12px; color: #9A8F80; }
        .income-sum-value { font-size: 22px; font-weight: 800; color: #182644; margin-top: 4px; }
        .panel { background: #fff; border-radius: 14px; padding: 22px; box-shadow: 0 4px 16px rgba(24,38,68,0.06); }
        .panel-title { font-family:'Poppins',sans-serif; font-weight: 600; color: #182644; margin-bottom: 16px; font-size: 15px; }
        .pie-wrap { display: flex; align-items: center; gap: 20px; }
        .pie-legend { display: flex; flex-direction: column; gap: 10px; }
        .legend-chip {
          display: flex; align-items: center; gap: 8px;
          font-size: 12.5px; font-weight: 600; padding: 8px 12px; border-radius: 9px;
          background: #F6F4EF;
        }
        .dot { width: 9px; height: 9px; border-radius: 50%; }
        .group-section { background: #fff; border-radius: 14px; padding: 20px 22px 24px; margin-bottom: 20px; box-shadow: 0 4px 16px rgba(24,38,68,0.06); }
        .group-title { font-family:'Poppins',sans-serif; color: #3E5EDB; font-weight: 600; margin-bottom: 14px; font-size: 14.5px; }
        .group-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .group-row {
          display: flex; align-items: center; gap: 12px;
          background: #FAF8F4; border-radius: 10px; padding: 10px 14px;
        }
        .group-avatar {
          width: 34px; height: 34px; border-radius: 50%; background: #EFEBE3;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #6B7280;
        }
        .group-info { font-size: 11.5px; line-height: 1.65; flex: 1; }
        .group-actions { display: flex; flex-direction: column; gap: 6px; }
        .btn-update, .btn-delete {
          border: none; border-radius: 7px; font-size: 10.5px; font-weight: 700;
          padding: 5px 10px; cursor: pointer; color: #fff;
        }
        .btn-update { background: #2E9E6C; }
        .btn-delete { background: #D2483C; }
        .placeholder {
          background: #fff; border-radius: 14px; padding: 40px 30px;
          display: flex; gap: 18px; align-items: flex-start;
          box-shadow: 0 4px 16px rgba(24,38,68,0.06);
          color: #6B7280;
        }
        .placeholder-icon { color: #3E5EDB; margin-top: 3px; }
        .placeholder-title { font-family:'Poppins',sans-serif; color:#182644; font-weight:600; font-size:15px; margin-bottom:6px; }
        .placeholder-sub { font-size: 13px; max-width: 480px; line-height: 1.6; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 980px) {
          .stat-grid { grid-template-columns: 1fr; }
          .income-top { grid-template-columns: 1fr; }
          .income-summary { grid-template-columns: 1fr 1fr; }
          .group-grid { grid-template-columns: 1fr; }
          .sidebar { width: 210px; }
        }
        @media (max-width: 720px) {
          .sidebar { display: none; }
          .main { padding-bottom: 68px; }
          .content { padding: 20px 16px 60px; }
          .topbar { padding: 16px 20px; flex-wrap: wrap; gap: 12px; }
          .topbar-title { font-size: 18px; }
          .mobile-bottom-nav {
            display: flex; position: fixed; bottom: 0; left: 0; right: 0; z-index: 9997;
            background: #fff; border-top: 1px solid #ECE3D8;
            box-shadow: 0 -4px 18px rgba(24,38,68,0.08);
          }
        }
        @media (min-width: 721px) { .mobile-bottom-nav { display: none; } }
        .mobile-bottom-nav { display: none; }
        .mb-item {
          flex: 1; border: none; background: transparent; padding: 10px 4px;
          display: flex; flex-direction: column; align-items: center; gap: 3px;
          font-size: 10px; font-weight: 600; color: #9A8F80; cursor: pointer;
        }
        .mb-item.active { color: #3E5EDB; }
      `}</style>

      <aside className={"sidebar" + (collapsed ? " collapsed" : "")}>
        <div className="sidebar-head">
          <button
            className="sidebar-collapse-btn"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? t("Expand sidebar") : t("Collapse sidebar")}
          >
            {collapsed ? <ChevronsRight size={15} /> : <ChevronsLeft size={15} />}
          </button>
          <div className="avatar-ring"><UserCircle2 size={30} color="#fff" /></div>
          <div className="sidebar-head-title">{t("Admin:")} {user.username || (user.email || "").split("@")[0] || t("Admin")}</div>
        </div>
        <div className="sidebar-scroll">
          {NAV.map((section) => (
            <div className="nav-section" key={section.label}>
              <div className="nav-section-label">{t(section.label)}</div>
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    className={"nav-item" + (active === item.key ? " active" : "")}
                    onClick={() => {
                      setActive(item.key);
                      if (badges[item.key] > (seen[item.key] || 0)) markSeen(item.key);
                    }}
                  >
                    <Icon size={16} strokeWidth={1.8} />
                    <span className="nav-label">{t(item.label)}</span>
                    {effectiveBadge(item.key) > 0 && <span className="nav-badge">{effectiveBadge(item.key)}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </aside>

      <div className="main">
        <div className="topbar">
          <div>
            <div className="topbar-title">{t("Welcome Admin Dashboard")}</div>
            <div className="topbar-sub">{t("CIU System Admin")}</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="logout-btn"
              style={{ background: "#182644" }}
              onClick={() => (window.location.href = "/")}
            >
              <LayoutGrid size={15} /> {t("Visit Public Page")}
            </button>
            <LogoutModal className="logout-btn" style={{ background: "#ef4444" }}><LogOut size={15} /> {t("Logout")}</LogoutModal>
          </div>
        </div>

        <div className="content">
          {error && <div className="error-banner">{error}</div>}

          {loading && <LoadingSpinner />}

          {!loading && active === "overview" && (
            <>
              <div className="overview-head">
                <div>
                  <div className="overview-greet">{t("Welcome back")}, {user.username || user.email || t("Admin")}</div>
                  <div className="date-label">{today}</div>
                </div>
              </div>
              <div className="stat-grid">
                <StatTile title={t("Total Staff")} value={stats[0]?.value ?? 0} color="#3E5EDB" />
                <StatTile title={t("Total Users")} value={stats[1]?.value ?? 0} color="#7C5CBF" />
                <StatTile title={t("Total Students")} value={stats[2]?.value ?? 0} color="#E0A520" />
                <StatTile title={t("Total Contact")} value={stats[3]?.value ?? 0} color="#2E8BC0" />
              </div>
              <div className="overview-grid">
                <div className="panel">
                  <div className="panel-title">{t("Needs Attention")}</div>
                  <div className="attention-list">
                    <button className="attention-item" onClick={() => setActive("enrollments")}>
                      <span className="attention-ico" style={{ background: "#FDEFC9", color: "#B47D00" }}><UserPlus size={17} /></span>
                      <span className="attention-text">
                        <span className="attention-title">{t("Pending Enrollments")}</span>
                        <span className="attention-sub">{badges.enrollments} {t("awaiting review")}</span>
                      </span>
                      <span className="attention-count">{badges.enrollments || "—"}</span>
                    </button>
                    <button className="attention-item" onClick={() => setActive("contact")}>
                      <span className="attention-ico" style={{ background: "#DCEEFA", color: "#1B6AA8" }}><Inbox size={17} /></span>
                      <span className="attention-text">
                        <span className="attention-title">{t("Unread Contact")}</span>
                        <span className="attention-sub">{badges.contact} {t("new messages")}</span>
                      </span>
                      <span className="attention-count">{badges.contact || "—"}</span>
                    </button>
                    <button className="attention-item" onClick={() => setActive("report")}>
                      <span className="attention-ico" style={{ background: "#FBE3E0", color: "#B3443A" }}><FileBarChart size={17} /></span>
                      <span className="attention-text">
                        <span className="attention-title">{t("Open Reports")}</span>
                        <span className="attention-sub">{badges.report} {t("pending review")}</span>
                      </span>
                      <span className="attention-count">{badges.report || "—"}</span>
                    </button>
                  </div>
                </div>
                <div className="panel">
                  <div className="panel-title">{t("Accounts")}</div>
                  <div className="account-summary">
                    <div className="account-row">
                      <span className="account-ico" style={{ background: "#E7E3F7", color: "#6C4FCB" }}><UserCircle2 size={16} /></span>
                      <span className="account-name">{t("Admins")}</span>
                      <b className="account-num">{adminAccounts.length}</b>
                    </div>
                    <div className="account-row">
                      <span className="account-ico" style={{ background: "#DCEEE1", color: "#2E9E6C" }}><UserCheck size={16} /></span>
                      <span className="account-name">{t("Teachers")}</span>
                      <b className="account-num">{teacherAccounts.length}</b>
                    </div>
                    <div className="account-row">
                      <span className="account-ico" style={{ background: "#FDEFC9", color: "#B47D00" }}><Users size={16} /></span>
                      <span className="account-name">{t("Students")}</span>
                      <b className="account-num">{studentAccounts.length}</b>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {!loading && active === "income" && (
            <>
              <div className="content-row">
                <div className="date-label">{today}</div>
                <button className="logout-btn" style={{ background: "#182644", padding: "9px 16px" }} onClick={exportEarningsCSV} disabled={!earnings.length}>
                  <FileDown size={15} /> {t("Export Earnings CSV")}
                </button>
              </div>
              <div className="income-summary">
                <div className="income-sum-card">
                  <div className="income-sum-label">{t("Total Income")}</div>
                  <div className="income-sum-value">{incomePie[0] ? `$${incomePie[0].value.toLocaleString()}` : "—"}</div>
                </div>
                <div className="income-sum-card">
                  <div className="income-sum-label">{t("Last Month (a)")}</div>
                  <div className="income-sum-value">{lastMonthA ? `$${lastMonthA.toLocaleString()}` : "—"}</div>
                </div>
                <div className="income-sum-card">
                  <div className="income-sum-label">{t("Last Month (b)")}</div>
                  <div className="income-sum-value">{lastMonthB ? `$${lastMonthB.toLocaleString()}` : "—"}</div>
                </div>
                <div className="income-sum-card">
                  <div className="income-sum-label">{t("Monthly Average")}</div>
                  <div className="income-sum-value">{avgEarning ? `$${avgEarning.toLocaleString()}` : "—"}</div>
                </div>
              </div>
              <div className="income-top">
                <div className="panel">
                  <div className="panel-title">{t("Student and System Amount")}</div>
                  <div className="pie-wrap">
                    <ResponsiveContainer width="55%" height={180}>
                      <PieChart>
                        <Pie data={incomePie} dataKey="value" innerRadius={38} outerRadius={70} paddingAngle={2}>
                          {incomePie.map((f) => <Cell key={f.name} fill={f.color} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="pie-legend">
                      {incomePie.map((f) => (
                        <div className="legend-chip" key={f.name}>
                          <span className="dot" style={{ background: f.color }} />
                          {f.value}% {t(f.name)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="panel">
                  <div className="panel-title">{t("Earning — Last Months")}</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={earnings}>
                      <defs>
                        <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3E5EDB" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="#3E5EDB" stopOpacity={0.02} />
                        </linearGradient>
                        <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#F2C14E" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="#F2C14E" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEE" />
                      <XAxis dataKey="m" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Tooltip />
                      <Area type="monotone" dataKey="a" stroke="#3E5EDB" fill="url(#ga)" strokeWidth={2} />
                      <Area type="monotone" dataKey="b" stroke="#F2C14E" fill="url(#gb)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {feeGroups.map((g) => (
                <GroupSection key={g} title={g} members={feeGroupMembers[g] || []} />
              ))}
            </>
          )}

          {!loading && active === "student-att" && (
            <>
              <div className="content-row">
                <div className="date-label">{today}</div>
                <div className="search-box">
                  <Search size={15} />
                  <input
                    placeholder={t("Search students attendance...")}
                    value={studentQuery}
                    onChange={(e) => setStudentQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="person-grid">
                {filteredStudents.length > 0
                  ? filteredStudents.map((s) => <PersonCard key={s.id + s.name} person={s} kind="student" />)
                  : <div className="date-label">{t("No attendance records found.")}</div>
                }
              </div>
            </>
          )}

          {!loading && active === "teacher-att" && (
            <>
              <div className="content-row">
                <div className="date-label">{today}</div>
                <div className="search-box">
                  <Search size={15} />
                  <input
                    placeholder={t("Search teachers attendance...")}
                    value={teacherQuery}
                    onChange={(e) => setTeacherQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="person-grid">
                {filteredTeachers.length > 0
                  ? filteredTeachers.map((teacher) => <PersonCard key={teacher.id + teacher.name} person={teacher} kind="teacher" />)
                  : <div className="date-label">{t("No attendance records found.")}</div>
                }
              </div>
            </>
          )}

          {!loading && active === "student-acc" && (
            <>
              <div className="content-row">
                <div className="date-label">{today}</div>
                <div className="search-box">
                  <Search size={15} />
                  <input
                    placeholder={t("Search student by ID, name, email...")}
                    value={studentAccQuery}
                    onChange={(e) => setStudentAccQuery(e.target.value)}
                  />
                </div>
              </div>
              <AccountTable title={t("Student Accounts")} accounts={studentAccounts} query={studentAccQuery} />
            </>
          )}

          {!loading && active === "teacher-acc" && (
            <>
              <div className="content-row">
                <div className="date-label">{today}</div>
                <div className="search-box">
                  <Search size={15} />
                  <input
                    placeholder={t("Search teacher by ID, name, email...")}
                    value={teacherAccQuery}
                    onChange={(e) => setTeacherAccQuery(e.target.value)}
                  />
                </div>
              </div>
              <AccountTable title={t("Teacher Accounts")} accounts={teacherAccounts} query={teacherAccQuery} />
            </>
          )}

          {!loading && active === "admin-acc" && (
            <>
              <div className="content-row">
                <div className="date-label">{today}</div>
                <div className="search-box">
                  <Search size={15} />
                  <input
                    placeholder={t("Search admin by ID, name, email...")}
                    value={adminAccQuery}
                    onChange={(e) => setAdminAccQuery(e.target.value)}
                  />
                </div>
              </div>
              <AccountTable title={t("Admin Accounts")} accounts={adminAccounts} query={adminAccQuery} />
            </>
          )}

          {!loading && active === "user-mgmt" && (
            <UserManagement />
          )}

          {!loading && active === "courses" && (
            <CourseManagement />
          )}

          {!loading && active === "news" && (
            <NewsManagement />
          )}

          {!loading && active === "enrollments" && (
            <EnrollmentManagement
              onPendingChange={(n) => setBadges((b) => ({ ...b, enrollments: n }))}
            />
          )}

          {!loading && active === "contact" && (
            <ContactInbox
              onUnreadChange={(n) => setBadges((b) => ({ ...b, contact: n }))}
            />
          )}

          {!loading && active === "audit-log" && (
            <AuditLog />
          )}

          {!loading && active === "progression" && (
            <Progression />
          )}

          {!loading && active === "cards" && (
            <StudentCardManager />
          )}

          {!loading && active === "schedule" && (
            <ScheduleBuilder />
          )}

          {!loading && active === "report" && (
            <ReportPage />
          )}

          {!loading && active === "notifications" && (
            <NotificationsCenter />
          )}

          {!loading && !["overview", "income", "student-att", "teacher-att", "student-acc", "teacher-acc", "admin-acc", "user-mgmt", "courses", "news", "enrollments", "contact", "audit-log", "schedule", "report", "notifications"].includes(active) && (
            <Placeholder title={t(activeLabel)} />
          )}
        </div>

        <nav className="mobile-bottom-nav" aria-label={t("Mobile navigation")}>
          {[
            { key: "overview", label: t("Overview"), icon: LayoutGrid },
            { key: "income", label: t("Income"), icon: TrendingUp },
            { key: "student-att", label: t("Attendance"), icon: ClipboardCheck },
            { key: "enrollments", label: t("Enrollments"), icon: UserPlus },
            { key: "contact", label: t("Inbox"), icon: Inbox },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.key} className={"mb-item" + (active === item.key ? " active" : "")} onClick={() => { setActive(item.key); if (badges[item.key] > (seen[item.key] || 0)) markSeen(item.key); }}>
                <Icon size={18} strokeWidth={1.8} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}