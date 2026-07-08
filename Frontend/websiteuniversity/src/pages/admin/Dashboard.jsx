import React, { useState, useEffect, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import {
  LayoutGrid, TrendingUp, ClipboardCheck, UserCheck, Users,
  BookOpen, CalendarDays, FileBarChart, UserCircle2, LogOut,
  Search, ChevronRight, Loader2
} from "lucide-react";
import {
  getDashboardStats, getStudentAttendance, getTeacherAttendance,
  getIncomeData, getEarnings, getFeeGroups, getFeeGroupMembers
} from "../../services/endpoints";

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
    ],
  },
  {
    label: "Account",
    items: [
      { key: "student-acc", label: "Student Account", icon: UserCircle2 },
      { key: "teacher-acc", label: "Teacher Account", icon: UserCircle2 },
      { key: "admin-acc", label: "Admin Account", icon: UserCircle2 },
    ],
  },
];

function attColor(pct) {
  if (pct >= 90) return "#2E9E6C";
  if (pct >= 70) return "#D69A1E";
  return "#D2483C";
}

function StatCard({ title, gradient, data }) {
  return (
    <div className="stat-card">
      <div className="stat-card-title">{title}</div>
      <div className="stat-card-chart" style={{ background: gradient }}>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={data} margin={{ top: 10, right: 8, bottom: 0, left: 8 }}>
            <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="rgba(27,42,74,0.55)" />
          </BarChart>
        </ResponsiveContainer>
        <div className="stat-card-years">
          <span>2021</span><span>2022</span><span>2023</span>
        </div>
      </div>
    </div>
  );
}

function PersonCard({ person, kind }) {
  const color = attColor(person.att);
  return (
    <div className="person-card">
      <div className="person-card-head">
        <div className="person-avatar"><UserCircle2 size={30} strokeWidth={1.4} /></div>
      </div>
      <div className="person-card-body">
        <div className="person-name"><span className="label">Username:</span> {person.name}</div>
        <div><span className="label">ID:</span> {person.id}</div>
        {kind === "student" && (
          <>
            <div><span className="label">Major:</span> {person.major}</div>
            <div><span className="label">Class:</span> {person.cls}</div>
          </>
        )}
        <div className="att-row">
          <span className="label">Attendance:</span>
          <span className="att-pill" style={{ background: color }}>{person.att}%</span>
        </div>
        <div>
          <span className="label">Absent:</span> {person.absentPct}%
          {person.dates?.length > 0 && <span> On Date:</span>}
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
  return (
    <div className="group-section">
      <div className="group-title">{title}</div>
      <div className="group-grid">
        {members?.length > 0 ? members.map((m, i) => (
          <div className="group-row" key={i}>
            <div className="group-avatar"><UserCircle2 size={22} strokeWidth={1.4} /></div>
            <div className="group-info">
              <div><span className="label">ID:</span> {m.id || `000${i + 1}`}</div>
              <div><span className="label">Username:</span> {m.name}</div>
              <div><span className="label">Major:</span> {m.major || "IT"}</div>
              <div><span className="label">Year:</span> {m.year || "2"}</div>
            </div>
            <div className="group-actions">
              <button className="btn-update">Update</button>
              <button className="btn-delete">Delete</button>
            </div>
          </div>
        )) : (
          <div className="group-row">
            <div className="group-info">No members in this group</div>
          </div>
        )}
      </div>
    </div>
  );
}

function Placeholder({ title }) {
  return (
    <div className="placeholder">
      <div className="placeholder-icon"><ChevronRight size={22} /></div>
      <div>
        <div className="placeholder-title">{title}</div>
        <div className="placeholder-sub">This section isn't wired up in the preview yet — it would live here, styled to match the rest of the dashboard.</div>
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
  const [active, setActive] = useState("overview");
  const [studentQuery, setStudentQuery] = useState("");
  const [teacherQuery, setTeacherQuery] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [incomePie, setIncomePie] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [feeGroups, setFeeGroups] = useState([]);
  const [feeGroupMembers, setFeeGroupMembers] = useState({});

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
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
            getIncomeData().catch(() => ({ pie: [] })),
            getEarnings().catch(() => []),
            getFeeGroups().catch(() => []),
          ]);

        setStats(Array.isArray(statsRes.stats) ? statsRes.stats : []);
        setStudents(Array.isArray(studentsRes) ? studentsRes : []);
        setTeachers(Array.isArray(teachersRes) ? teachersRes : []);
        setIncomePie(Array.isArray(incomeRes.pie) ? incomeRes.pie : []);

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
      } catch (err) {
        setError("Failed to load dashboard data. Make sure the backend server is running.");
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const filteredStudents = students.filter((s) =>
    (s.name + s.id).toLowerCase().includes(studentQuery.toLowerCase())
  );
  const filteredTeachers = teachers.filter((t) =>
    (t.name + t.id).toLowerCase().includes(teacherQuery.toLowerCase())
  );

  const activeLabel =
    NAV.flatMap((s) => s.items).find((i) => i.key === active)?.label || "Overview";

  if (!localStorage.getItem("token")) {
    window.location.href = "/";
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
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
        }
        .sidebar-head {
          padding: 26px 22px 20px;
          background: linear-gradient(160deg,#233766,#182644 70%);
          border-bottom: 1px solid rgba(255,255,255,0.08);
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
          grid-template-columns: repeat(3, minmax(0,1fr));
          gap: 20px;
          margin-bottom: 22px;
        }
        .stat-card {
          background: #fff;
          border-radius: 14px;
          padding: 16px 16px 6px;
          box-shadow: 0 4px 16px rgba(24,38,68,0.06);
        }
        .stat-card-title {
          font-size: 13px; font-weight: 600; color: #3E5EDB; margin-bottom: 10px;
        }
        .stat-card-chart {
          border-radius: 10px; padding: 6px 6px 4px; position: relative;
        }
        .stat-card-years {
          display: flex; justify-content: space-between; font-size: 10.5px;
          color: rgba(27,42,74,0.55); padding: 0 6px 6px; font-weight: 600;
        }
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
          .group-grid { grid-template-columns: 1fr; }
          .sidebar { width: 210px; }
        }
      `}</style>

      <aside className="sidebar">
        <div className="sidebar-head">
          <div className="avatar-ring"><UserCircle2 size={30} color="#fff" /></div>
          <div className="sidebar-head-title">Admin: {user.username || (user.email || "").split("@")[0] || "Admin"}</div>
        </div>
        <div className="sidebar-scroll">
          {NAV.map((section) => (
            <div className="nav-section" key={section.label}>
              <div className="nav-section-label">{section.label}</div>
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    className={"nav-item" + (active === item.key ? " active" : "")}
                    onClick={() => setActive(item.key)}
                  >
                    <Icon size={16} strokeWidth={1.8} />
                    {item.label}
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
            <div className="topbar-title">Welcome Admin Dashboard</div>
            <div className="topbar-sub">CIU System Admin</div>
          </div>
          <button className="logout-btn" onClick={handleLogout}><LogOut size={15} /> Logout</button>
        </div>

        <div className="content">
          {error && <div className="error-banner">{error}</div>}

          {loading && <LoadingSpinner />}

          {!loading && active === "overview" && (
            <>
              <div className="content-row">
                <div className="date-label">{today}</div>
              </div>
              <div className="stat-grid">
                <StatCard title="Total Overall" gradient="linear-gradient(180deg,#DCEEE1,#fff)" data={stats.slice(0, 3)} />
                <StatCard title="Total Teachers" gradient="linear-gradient(180deg,#E7E3F7,#fff)" data={stats.slice(3, 6)} />
                <StatCard title="Total Students" gradient="linear-gradient(180deg,#FDEFC9,#fff)" data={stats.slice(6, 9)} />
              </div>
              <div className="stat-grid">
                <StatCard title="Total Every Year" gradient="linear-gradient(180deg,#E3E7F7,#fff)" data={stats.slice(9, 12)} />
                <StatCard title="Total Amount in a Month" gradient="linear-gradient(180deg,#DCEEFA,#fff)" data={stats.slice(12, 15)} />
                <StatCard title="Total in a Year" gradient="linear-gradient(180deg,#FBE3E0,#fff)" data={stats.slice(15, 18)} />
              </div>
            </>
          )}

          {!loading && active === "income" && (
            <>
              <div className="content-row">
                <div className="date-label">{today}</div>
              </div>
              <div className="income-top">
                <div className="panel">
                  <div className="panel-title">Student and System Amount</div>
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
                          {f.value}% {f.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="panel">
                  <div className="panel-title">Earning — Last Months</div>
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
                    placeholder="Search students attendance..."
                    value={studentQuery}
                    onChange={(e) => setStudentQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="person-grid">
                {filteredStudents.length > 0
                  ? filteredStudents.map((s) => <PersonCard key={s.id + s.name} person={s} kind="student" />)
                  : <div className="date-label">No attendance records found.</div>
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
                    placeholder="Search teachers attendance..."
                    value={teacherQuery}
                    onChange={(e) => setTeacherQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="person-grid">
                {filteredTeachers.length > 0
                  ? filteredTeachers.map((t) => <PersonCard key={t.id + t.name} person={t} kind="teacher" />)
                  : <div className="date-label">No attendance records found.</div>
                }
              </div>
            </>
          )}

          {!loading && !["overview", "income", "student-att", "teacher-att"].includes(active) && (
            <Placeholder title={activeLabel} />
          )}
        </div>
      </div>
    </div>
  );
}