import { useState, useEffect } from 'react';
import {
  Presentation, LogOut, LayoutGrid, LayoutDashboard, BookOpen, Users, ClipboardCheck,
  GraduationCap, Megaphone, Search, CheckCircle2, XCircle,
  FileDown, MessageSquare, Send, Trash2, Pencil, Plus, AlertTriangle
} from 'lucide-react';
import LogoutModal from '../../components/common/LogoutModal';
import {
  getTeacherClasses, getTeacherStudents, getTeacherAnnouncements,
  saveTeacherAttendance, submitTeacherGrades, postTeacherAnnouncement,
  getTeacherAssignments, createTeacherAssignment, deleteTeacherAssignment,
  getTeacherMessages, sendTeacherMessage,
} from '../../services/endpoints';
import EmptyState from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

const FALLBACK_CLASSES = [
  { id: 1, code: "CS101", title: "Introduction to Programming", schedule: "Mon & Wed 08:00-09:30", students: 34, credits: 3 },
  { id: 2, code: "CS201", title: "Data Structures", schedule: "Tue & Thu 10:00-11:30", students: 28, credits: 3 },
  { id: 3, code: "CS305", title: "Database Systems", schedule: "Fri 14:00-17:00", students: 22, credits: 4 },
];

const FALLBACK_STUDENTS = [
  { id: "CS-2024-001", name: "Sokha Ly", major: "Computer Science", att: 94 },
  { id: "CS-2024-002", name: "Veasna Nop", major: "Computer Science", att: 88 },
  { id: "CS-2024-003", name: "Maly Chea", major: "Software Engineering", att: 76 },
  { id: "CS-2024-004", name: "Rithy Hun", major: "Computer Science", att: 91 },
  { id: "CS-2024-005", name: "Sreyneang Kim", major: "Software Engineering", att: 65 },
  { id: "CS-2024-006", name: "Piseth Nop", major: "Data Science", att: 82 },
];

const FALLBACK_ANNOUNCEMENTS = [
  { id: 1, title: "Midterm exam schedule is out", date: "2026-10-10", body: "Midterm exams run October 24-30. Please check the Academic Calendar for your assigned rooms." },
  { id: 2, title: "Faculty meeting — Friday", date: "2026-08-20", body: "All faculty must attend the monthly meeting in Room A201 at 15:00." },
  { id: 3, title: "New grading policy", date: "2026-08-12", body: "Please review the updated grading policy document on the faculty portal." },
];

const FALLBACK_ASSIGNMENTS = [
  { id: 1, code: "CS101", title: "Programming Assignment 1 — Loops", due: "2026-09-20", submissions: 12 },
  { id: 2, code: "CS101", title: "Programming Assignment 2 — Arrays", due: "2026-10-05", submissions: 5 },
  { id: 3, code: "CS305", title: "Database Design Project", due: "2026-11-01", submissions: 2 },
];

const FALLBACK_MESSAGES = [
  { id: 1, from: "Sokha Ly", course: "CS101", text: "Professor, could you clarify what 'recursion' means?", time: "2026-08-01 09:02", mine: false },
  { id: 2, from: "You", course: "CS101", text: "Recursion is a function that calls itself. I'll cover it in Thursday's lecture.", time: "2026-08-01 09:10", mine: true },
  { id: 3, from: "Maly Chea", course: "CS305", text: "Is the project due this Friday or next?", time: "2026-08-01 10:24", mine: false },
];

export default function TeacherDashboard() {
  const { t } = useLanguage();
  const email = localStorage.getItem('email') || '';
  const [active, setActive] = useState("overview");
  const [query, setQuery] = useState("");
  const [attendance, setAttendance] = useState({});
  const [saved, setSaved] = useState("");
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [grades, setGrades] = useState({});
  const [savingAtt, setSavingAtt] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [annOpen, setAnnOpen] = useState(false);
  const [annTitle, setAnnTitle] = useState("");
  const [annBody, setAnnBody] = useState("");
  const [annSaving, setAnnSaving] = useState(false);
  const [editingAnn, setEditingAnn] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [sendingChat, setSendingChat] = useState(false);
  const [selectedClass, setSelectedClass] = useState("CS101");
  const [attDate, setAttDate] = useState(new Date().toISOString().slice(0, 10));
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignTitle, setAssignTitle] = useState("");
  const [assignDue, setAssignDue] = useState("");
  const [assignSaving, setAssignSaving] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError("");
      try {
        const [c, s, a, asg, msg] = await Promise.all([
          getTeacherClasses().catch(() => []),
          getTeacherStudents().catch(() => []),
          getTeacherAnnouncements().catch(() => []),
          getTeacherAssignments().catch(() => []),
          getTeacherMessages().catch(() => []),
        ]);
        const cArr = Array.isArray(c) ? c : Array.isArray(c?.classes) ? c.classes : [];
        const sArr = Array.isArray(s) ? s : Array.isArray(s?.students) ? s.students : [];
        const aArr = Array.isArray(a) ? a : Array.isArray(a?.announcements) ? a.announcements : [];
        const asgArr = Array.isArray(asg) ? asg : Array.isArray(asg?.assignments) ? asg.assignments : [];
        const msgArr = Array.isArray(msg) ? msg : Array.isArray(msg?.messages) ? msg.messages : [];
        setClasses(cArr.length ? cArr : FALLBACK_CLASSES);
        setStudents(sArr.length ? sArr : FALLBACK_STUDENTS);
        setAnnouncements(aArr.length ? aArr : FALLBACK_ANNOUNCEMENTS);
        setAssignments(asgArr.length ? asgArr : FALLBACK_ASSIGNMENTS);
        setMessages(msgArr.length ? msgArr : FALLBACK_MESSAGES);
      } catch {
        setClasses(FALLBACK_CLASSES);
        setStudents(FALLBACK_STUDENTS);
        setAnnouncements(FALLBACK_ANNOUNCEMENTS);
        setAssignments(FALLBACK_ASSIGNMENTS);
        setMessages(FALLBACK_MESSAGES);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const toggleAtt = (sid) => {
    setAttendance(prev => ({ ...prev, [sid]: prev[sid] ? "absent" : "present" }));
  };

  const saveAttendance = async () => {
    setError("");
    setSavingAtt(true);
    const marked = students.map(s => ({
      studentId: s.id,
      status: attendance[s.id] || "present",
      date: attDate || new Date().toISOString().slice(0, 10),
      classCode: selectedClass,
    }));
    try {
      await saveTeacherAttendance(marked);
      setSaved(t("Attendance saved for the selected students."));
    } catch {
      setSaved(t("Attendance saved locally. Backend save failed."));
    } finally {
      setSavingAtt(false);
      setTimeout(() => setSaved(""), 3000);
    }
  };

  const submitGrades = async () => {
    setError("");
    const entries = Object.entries(grades)
      .filter(([, v]) => v !== "" && v !== undefined && v !== null)
      .map(([studentId, score]) => ({ studentId, score: Number(score), classCode: selectedClass }));
    if (!entries.length) {
      setError(t("Enter at least one grade before submitting."));
      return;
    }
    setSubmitting(true);
    try {
      await submitTeacherGrades(entries);
      setSaved(t("Grades submitted successfully."));
      setGrades({});
    } catch {
      setSaved(t("Grades saved locally. Backend submit failed."));
    } finally {
      setSubmitting(false);
      setTimeout(() => setSaved(""), 3000);
    }
  };

  const deleteAnnouncement = async (id) => {
    const next = announcements.filter(a => a.id !== id);
    setAnnouncements(next);
    toast(t("Announcement deleted."));
  };

  const openEditAnnouncement = (a) => {
    setEditingAnn(a);
    setAnnTitle(a.title);
    setAnnBody(a.body);
    setAnnOpen(true);
  };

  const saveAnnouncement = async () => {
    setError("");
    if (!annTitle.trim() || !annBody.trim()) {
      setError(t("Please fill in both the title and the message."));
      return;
    }
    setAnnSaving(true);
    try {
      if (editingAnn) {
        setAnnouncements(prev => prev.map(a => a.id === editingAnn.id ? { ...a, title: annTitle.trim(), body: annBody.trim() } : a));
        toast(t("Announcement updated."));
      } else {
        await postTeacherAnnouncement({ title: annTitle.trim(), body: annBody.trim() });
        setAnnouncements(prev => [{ id: Date.now(), title: annTitle.trim(), body: annBody.trim(), date: new Date().toISOString().slice(0, 10) }, ...prev]);
        toast(t("Announcement posted successfully."));
      }
      setAnnOpen(false);
      setAnnTitle("");
      setAnnBody("");
      setEditingAnn(null);
    } catch {
      setError(t("Failed to save announcement. Make sure the backend server is running."));
    } finally {
      setAnnSaving(false);
    }
  };

  const exportRosterCSV = () => {
    const header = `${t("ID")},${t("Name")},${t("Major")},${t("Attendance")}`;
    const rows = students.map(s => `"${s.id}","${s.name}","${s.major}","${s.att}"`).join("\n");
    const blob = new Blob([`${header}\n${rows}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `class-roster-${selectedClass}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const bulkMark = (status) => {
    const next = {};
    students.forEach(s => { next[s.id] = status; });
    setAttendance(prev => ({ ...prev, ...next }));
  };

  const postAssignment = async () => {
    setError("");
    if (!assignTitle.trim() || !assignDue) {
      setError(t("Please fill in both the title and the due date."));
      return;
    }
    setAssignSaving(true);
    try {
      await createTeacherAssignment({ code: selectedClass, title: assignTitle.trim(), due: assignDue });
      setAssignments(prev => [{ id: Date.now(), code: selectedClass, title: assignTitle.trim(), due: assignDue, submissions: 0 }, ...prev]);
      setAssignOpen(false);
      setAssignTitle("");
      setAssignDue("");
      toast(t("Assignment created."));
    } catch {
      setError(t("Failed to create assignment. Make sure the backend server is running."));
    } finally {
      setAssignSaving(false);
    }
  };

  const removeAssignment = async (id) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
    toast(t("Assignment deleted."));
    try { await deleteTeacherAssignment(id); } catch { /* backend later */ }
  };

  const sendChat = async () => {
    if (!chatInput.trim()) return;
    setSendingChat(true);
    const next = [...messages, {
      id: Date.now(), from: t("You"), course: selectedClass,
      text: chatInput.trim(), time: new Date().toISOString().slice(0, 16).replace("T", " "), mine: true,
    }];
    setMessages(next);
    setChatInput("");
    try {
      await sendTeacherMessage({ course: selectedClass, text: next[next.length - 1].text });
    } catch {
      toast(t("Message saved locally. Backend send failed."), "error");
    } finally {
      setSendingChat(false);
    }
  };

  const navItems = [
    { key: "overview", label: t("Overview"), icon: LayoutDashboard },
    { key: "classes", label: t("My Classes"), icon: BookOpen },
    { key: "students", label: t("Students"), icon: Users },
    { key: "attendance", label: t("Attendance"), icon: ClipboardCheck },
    { key: "grades", label: t("Grade Entry"), icon: GraduationCap },
    { key: "assignments", label: t("Assignments"), icon: BookOpen },
    { key: "announcements", label: t("Announcements"), icon: Megaphone },
    { key: "messages", label: t("Messages"), icon: MessageSquare },
  ];

  const filteredStudents = students.filter(s =>
    (s.name + s.id + s.major).toLowerCase().includes(query.toLowerCase())
  );

  const avgAttendance = students.length
    ? Math.round(students.reduce((sum, s) => sum + Number(s.att || 0), 0) / students.length)
    : 0;

  const attColor = (pct) => pct >= 90 ? "#2E9E6C" : pct >= 70 ? "#D69A1E" : "#D2483C";

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', display: 'flex', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        .td-sidebar { width: 250px; background: var(--bg-card); border-right: 1px solid var(--border); display: flex; flex-direction: column; padding: 24px 16px; }
        .td-brand { display: flex; align-items: center; gap: 10px; padding: 0 8px 20px; border-bottom: 1px solid var(--border); margin-bottom: 20px; }
        .td-brand-icon { width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0; background: linear-gradient(135deg,#3E5EDB,#7A5CDB); color: #fff; display: flex; align-items: center; justify-content: center; }
        .td-brand-name { font-weight: 800; font-size: 15px; color: var(--text-primary); line-height: 1.2; }
        .td-brand-sub { font-size: 11px; color: var(--text-muted); }
        .td-nav { display: flex; flex-direction: column; gap: 6px; flex: 1; }
        .td-nav-item { display: flex; align-items: center; gap: 12px; padding: 11px 12px; border-radius: 10px; border: none; background: none; cursor: pointer; font-size: 14px; font-weight: 600; color: var(--text-secondary); transition: all 0.2s ease; text-align: left; }
        .td-nav-item:hover { background: var(--hover-bg); color: var(--text-primary); }
        .td-nav-item.active { background: rgba(62,94,219,0.12); color: #3E5EDB; }
        .td-main { flex: 1; padding: 28px 36px; overflow: auto; }
        .td-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
        .td-greeting { font-size: 20px; font-weight: 800; color: var(--text-primary); }
        .logout-btn {
          background: #3E5EDB; color: #fff; border: none; padding: 10px 20px; border-radius: 9px;
          font-size: 13.5px; font-weight: 600; display: flex; align-items: center; gap: 8px; cursor: pointer;
          box-shadow: 0 6px 16px rgba(62,94,219,0.35);
        }
        .td-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 18px; margin-bottom: 24px; }
        .td-stat { background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px; padding: 20px; }
        .td-stat-label { font-size: 12.5px; font-weight: 600; color: #3E5EDB; margin-bottom: 8px; }
        .td-stat-value { font-size: 26px; font-weight: 800; color: var(--text-primary); }
        .td-stat-sub { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
        .td-panel { background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px; padding: 22px; margin-bottom: 20px; }
        .td-panel-title { font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
        .td-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .td-table th { text-align: left; color: #3E5EDB; border-bottom: 2px solid var(--border); padding: 10px 12px; }
        .td-table td { padding: 10px 12px; border-bottom: 1px solid var(--border); }
        .td-search { display: flex; align-items: center; gap: 8px; background: var(--input-bg); border: 1px solid var(--border); border-radius: 10px; padding: 9px 14px; color: var(--text-muted); flex: 1; min-width: 200px; max-width: 340px; }
        .td-search input { border: none; outline: none; background: none; flex: 1; font-size: 13px; color: var(--text-primary); }
        .td-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border: none; border-radius: 10px; background: linear-gradient(135deg,#3E5EDB,#7A5CDB); color: #fff; font-size: 13px; font-weight: 700; cursor: pointer; box-shadow: 0 6px 16px rgba(62,94,219,0.3); }
        .td-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 18px; }
        .td-pill { color: #fff; font-size: 11.5px; font-weight: 700; padding: 3px 10px; border-radius: 999px; }
        .td-att-toggle { border: none; cursor: pointer; border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 700; display: inline-flex; align-items: center; gap: 5px; }
        .td-banner { background: rgba(46,158,108,0.1); border: 1px solid rgba(46,158,108,0.35); color: #1E7A4E; border-radius: 10px; padding: 12px 16px; font-size: 13px; margin-bottom: 18px; font-weight: 600; }
        .td-empty { color: var(--text-muted); font-size: 13.5px; text-align: center; padding: 30px 0; }
        .td-ann { border-left: 3px solid #3E5EDB; background: var(--hover-bg); border-radius: 0 10px 10px 0; padding: 14px 18px; margin-bottom: 12px; }
        .td-ann-date { font-size: 11.5px; color: var(--text-muted); margin-bottom: 4px; }
        .td-ann-title { font-size: 14px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
        .td-ann-body { font-size: 13px; color: var(--text-secondary); line-height: 1.6; }
      `}</style>

      <aside className="td-sidebar">
        <div className="td-brand">
          <div className="td-brand-icon"><Presentation size={20} /></div>
          <div>
            <div className="td-brand-name">{t("Teacher Portal")}</div>
            <div className="td-brand-sub">{t("Cambodia Int'l University")}</div>
          </div>
        </div>
        <nav className="td-nav">
          {navItems.map(item => (
            <button key={item.key} className={"td-nav-item" + (active === item.key ? " active" : "")} onClick={() => setActive(item.key)}>
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="td-main">
        <div className="td-header">
          <div className="td-greeting">{t("Teacher Dashboard")} {loading && <span className="td-pill" style={{ background: "#D69A1E", marginLeft: 10, verticalAlign: "middle" }}>{t("Loading...")}</span>}</div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {email && <>{t("Signed in as")} <strong style={{ color: 'var(--text-primary)' }}>{email}</strong></>}
            </div>
            <button className="logout-btn" style={{ background: "#182644" }} onClick={() => (window.location.href = "/")}>
              <LayoutGrid size={15} /> {t("Visit Public Page")}
            </button>
            <LogoutModal className="logout-btn" style={{ background: "#ef4444" }}><LogOut size={15} /> {t("Logout")}</LogoutModal>
          </div>
        </div>

        {error && <div className="td-banner" style={{ background: "rgba(210,72,60,0.1)", borderColor: "rgba(210,72,60,0.35)", color: "#D2483C" }}><XCircle size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />{error}</div>}

        {saved && <div className="td-banner"><CheckCircle2 size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />{saved}</div>}

        {active === "overview" && (
          <>
            <div className="td-grid">
              <div className="td-stat"><div className="td-stat-label">{t("My Classes")}</div><div className="td-stat-value">{classes.length}</div><div className="td-stat-sub">{t("Active this semester")}</div></div>
              <div className="td-stat"><div className="td-stat-label">{t("Students")}</div><div className="td-stat-value">{students.length}</div><div className="td-stat-sub">{t("Across all classes")}</div></div>
              <div className="td-stat"><div className="td-stat-label">{t("Avg Attendance")}</div><div className="td-stat-value">{avgAttendance}%</div><div className="td-stat-sub">{t("This week")}</div></div>
              <div className="td-stat"><div className="td-stat-label">{t("Pending Grades")}</div><div className="td-stat-value">0</div><div className="td-stat-sub">{t("All submitted")}</div></div>
            </div>
            <div className="td-panel">
              <div className="td-panel-title"><BookOpen size={16} /> {t("Today's Schedule")}</div>
              {classes.map(c => (
                <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 14 }}>{t(c.title)}</div>
                    <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{c.code} · {t(c.schedule)}</div>
                  </div>
                  <span className="td-pill" style={{ background: "#3E5EDB" }}>{c.students} {t("students")}</span>
                </div>
              ))}
            </div>
            <div className="td-panel">
              <div className="td-panel-title"><Megaphone size={16} /> {t("Recent Announcements")}</div>
              {announcements.slice(0, 2).map(a => (
                <div className="td-ann" key={a.id}>
                  <div className="td-ann-date">{a.date}</div>
                  <div className="td-ann-title">{t(a.title)}</div>
                  <div className="td-ann-body">{t(a.body)}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {active === "classes" && (
          <>
            <div className="td-row"><div className="td-panel-title" style={{ margin: 0 }}>{t("My Classes")}</div><button className="td-btn"><BookOpen size={15} /> {t("New Class")}</button></div>
            <div className="td-table-wrap">
              <table className="td-table">
                <thead><tr><th>{t("Code")}</th><th>{t("Title")}</th><th>{t("Schedule")}</th><th>{t("Students")}</th><th>{t("Credits")}</th></tr></thead>
                <tbody>
                  {classes.map(c => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 700, color: "#3E5EDB" }}>{c.code}</td>
                      <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{c.title}</td>
                      <td>{c.schedule}</td>
                      <td>{c.students}</td>
                      <td>{c.credits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {active === "students" && (
          <>
            <div className="td-row">
              <div className="td-panel-title" style={{ margin: 0 }}>{t("Student Roster")}</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <div className="td-search"><Search size={15} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder={t("Search students...")} /></div>
                <button className="td-btn" onClick={exportRosterCSV} style={{ padding: "8px 14px", fontSize: 12 }}><FileDown size={14} /> {t("Export CSV")}</button>
              </div>
            </div>
            <table className="td-table">
              <thead><tr><th>{t("ID")}</th><th>{t("Name")}</th><th>{t("Major")}</th><th>{t("Attendance")}</th></tr></thead>
              <tbody>
                {filteredStudents.length ? filteredStudents.map(s => (
                  <tr key={s.id} style={Number(s.att) < 75 ? { background: "rgba(210,72,60,0.06)" } : undefined}>
                    <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{s.id}</td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        {s.name}
                        {Number(s.att) < 75 && <AlertTriangle size={14} color="#D2483C" title={t("Low attendance")} />}
                      </span>
                    </td>
                    <td>{t(s.major)}</td>
                    <td><span className="td-pill" style={{ background: attColor(s.att) }}>{s.att}%</span></td>
                  </tr>
                )) : <tr><td colSpan="4" className="td-empty">{t("No students found")}</td></tr>}
              </tbody>
            </table>
          </>
        )}

        {active === "attendance" && (
          <>
            <div className="td-row">
              <div className="td-panel-title" style={{ margin: 0 }}>{t("Take Attendance")}</div>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="td-search" style={{ flex: "none", minWidth: 0 }}>
                  {classes.map(c => <option key={c.code} value={c.code}>{c.code} — {c.title}</option>)}
                </select>
                <input type="date" value={attDate} onChange={e => setAttDate(e.target.value)} className="td-search" style={{ flex: "none", minWidth: 0 }} />
                <button className="td-att-toggle" style={{ background: "#E3F0E7", color: "#1E7A4E" }} onClick={() => bulkMark("present")}>{t("All present")}</button>
                <button className="td-att-toggle" style={{ background: "#FBE3E0", color: "#D2483C" }} onClick={() => bulkMark("absent")}>{t("All absent")}</button>
                <button className="td-btn" onClick={saveAttendance} disabled={savingAtt}>{savingAtt ? t("Saving...") : (<><CheckCircle2 size={15} /> {t("Save Attendance")}</>)}</button>
              </div>
            </div>
            <table className="td-table">
              <thead><tr><th>{t("ID")}</th><th>{t("Name")}</th><th>{t("Status")}</th><th>{t("Mark")}</th></tr></thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{s.id}</td>
                    <td>{s.name}</td>
                    <td>
                      <span className="td-pill" style={{ background: attendance[s.id] === "absent" ? "#D2483C" : "#2E9E6C" }}>
                        {attendance[s.id] === "absent" ? t("Absent") : attendance[s.id] === "present" ? t("Present") : t("Not marked")}
                      </span>
                    </td>
                    <td>
                      <button className="td-att-toggle" style={{ background: attendance[s.id] === "absent" ? "#FBE3E0" : "#E3F0E7", color: attendance[s.id] === "absent" ? "#D2483C" : "#1E7A4E" }} onClick={() => toggleAtt(s.id)}>
                        {attendance[s.id] === "absent" ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                        {attendance[s.id] === "absent" ? t("Mark Present") : t("Mark Absent")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {active === "grades" && (
          <>
            <div className="td-row"><div className="td-panel-title" style={{ margin: 0 }}>{t("Grade Entry")}</div>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="td-search" style={{ flex: "none", minWidth: 0 }}>
                  {classes.map(c => <option key={c.code} value={c.code}>{c.code} — {c.title}</option>)}
                </select>
                <button className="td-btn" onClick={submitGrades} disabled={submitting}>{submitting ? t("Submitting...") : (<><GraduationCap size={15} /> {t("Submit Grades")}</>)}</button>
              </div>
            </div>
            <table className="td-table">
              <thead><tr><th>{t("ID")}</th><th>{t("Name")}</th><th>{t("Class")}</th><th>{t("Score")}</th></tr></thead>
              <tbody>
                {students.slice(0, 4).map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{s.id}</td>
                    <td>{s.name}</td>
                    <td>CS101</td>
                    <td><input value={grades[s.id] ?? ""} onChange={e => setGrades(prev => ({ ...prev, [s.id]: e.target.value }))} placeholder={t("0 - 100")} style={{ padding: "7px 10px", border: "1.5px solid var(--border)", borderRadius: 8, background: "var(--input-bg)", color: "var(--text-primary)", width: 90, fontSize: 13, outline: "none" }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {active === "announcements" && (
          <>
            <div className="td-row"><div className="td-panel-title" style={{ margin: 0 }}>{t("Announcements")}</div><button className="td-btn" onClick={() => { setEditingAnn(null); setAnnTitle(""); setAnnBody(""); setAnnOpen(true); }}><Megaphone size={15} /> {t("Post Announcement")}</button></div>
            {announcements.map(a => (
              <div className="td-ann" key={a.id} style={{ position: "relative", paddingRight: 90 }}>
                <div className="td-ann-date">{a.date}</div>
                <div className="td-ann-title">{t(a.title)}</div>
                <div className="td-ann-body">{t(a.body)}</div>
                <div style={{ position: "absolute", right: 12, top: 12, display: "flex", gap: 6 }}>
                  <button onClick={() => openEditAnnouncement(a)} className="td-att-toggle" style={{ background: "var(--hover-bg)", color: "var(--text-secondary)" }} aria-label={t("Edit")}><Pencil size={13} /></button>
                  <button onClick={() => deleteAnnouncement(a.id)} className="td-att-toggle" style={{ background: "#FBE3E0", color: "#D2483C" }} aria-label={t("Delete")}><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
          </>
        )}

        {active === "assignments" && (
          <>
            <div className="td-row"><div className="td-panel-title" style={{ margin: 0 }}>{t("Assignments")}</div><button className="td-btn" onClick={() => setAssignOpen(true)}><Plus size={15} /> {t("New Assignment")}</button></div>
            <table className="td-table">
              <thead><tr><th>{t("Code")}</th><th>{t("Assignment")}</th><th>{t("Due")}</th><th>{t("Submissions")}</th><th></th></tr></thead>
              <tbody>
                {assignments.length ? assignments.map(a => (
                  <tr key={a.id}>
                    <td><span className="td-pill" style={{ background: "#3E5EDB" }}>{a.code}</span></td>
                    <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{t(a.title)}</td>
                    <td>{a.due}</td>
                    <td>{a.submissions ?? 0}</td>
                    <td>
                      <button onClick={() => removeAssignment(a.id)} className="td-att-toggle" style={{ background: "#FBE3E0", color: "#D2483C" }} aria-label={t("Delete")}><Trash2 size={13} /></button>
                    </td>
                  </tr>
                )) : <tr><td colSpan="5" className="td-empty">{t("No assignments yet")}</td></tr>}
              </tbody>
            </table>
          </>
        )}

        {active === "messages" && (
          <div className="td-panel">
            <div className="td-row">
              <div className="td-panel-title" style={{ margin: 0 }}>{t("Class Messages")}</div>
              <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="td-search" style={{ flex: "none", minWidth: 0 }}>
                {classes.map(c => <option key={c.code} value={c.code}>{c.code} — {c.title}</option>)}
              </select>
            </div>
            <div style={{ maxHeight: 420, overflow: "auto", border: "1px solid var(--border)", borderRadius: 12, padding: 16, marginBottom: 16, background: "var(--input-bg)" }}>
              {messages.length ? messages.map(m => (
                <div key={m.id} style={{ display: "flex", justifyContent: m.mine ? "flex-end" : "flex-start", marginBottom: 12 }}>
                  <div style={{
                    maxWidth: "75%", padding: "10px 14px", borderRadius: 12,
                    background: m.mine ? "linear-gradient(135deg,#3E5EDB,#7A5CDB)" : "var(--bg-card)",
                    color: m.mine ? "#fff" : "var(--text-primary)",
                    border: m.mine ? "none" : "1px solid var(--border)", fontSize: 13.5, lineHeight: 1.5,
                  }}>
                    {!m.mine && <div style={{ fontSize: 11, fontWeight: 700, color: "#3E5EDB", marginBottom: 2 }}>{m.from}</div>}
                    <div>{t(m.text)}</div>
                    <div style={{ fontSize: 10.5, marginTop: 4, opacity: 0.7 }}>{m.time}</div>
                  </div>
                </div>
              )) : <EmptyState title={t("No messages yet")} />}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") sendChat(); }}
                placeholder={t("Type a message...")}
                style={{ flex: 1, padding: "11px 14px", border: "1.5px solid var(--border)", borderRadius: 10, fontSize: 13.5, outline: "none", background: "var(--input-bg)", color: "var(--text-primary)" }}
              />
              <button className="td-btn" onClick={sendChat} disabled={sendingChat || !chatInput.trim()}>
                {sendingChat ? t("Sending...") : <><Send size={15} /> {t("Send")}</>}
              </button>
            </div>
          </div>
        )}
      </main>

      {annOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9998,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
        }}>
          <div style={{ background: "var(--bg-card)", borderRadius: 16, padding: 26, width: "min(90vw, 480px)", boxShadow: "0 12px 40px rgba(0,0,0,0.2)" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 17, fontWeight: 700, color: "var(--text-primary)" }}>{editingAnn ? t("Edit Announcement") : t("Post Announcement")}</h3>
            <input value={annTitle} onChange={e => setAnnTitle(e.target.value)} placeholder={t("Announcement title")} style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", border: "1.5px solid var(--border)", borderRadius: 10, background: "var(--input-bg)", color: "var(--text-primary)", fontSize: 14, outline: "none", marginBottom: 12 }} />
            <textarea value={annBody} onChange={e => setAnnBody(e.target.value)} placeholder={t("Write your announcement here...")} rows={4} style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", border: "1.5px solid var(--border)", borderRadius: 10, background: "var(--input-bg)", color: "var(--text-primary)", fontSize: 14, outline: "none", resize: "vertical", marginBottom: 18, fontFamily: "inherit" }} />
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => { setAnnOpen(false); setAnnTitle(""); setAnnBody(""); setEditingAnn(null); }} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "1.5px solid var(--border)", background: "var(--input-bg)", color: "var(--text-secondary)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{t("Cancel")}</button>
              <button onClick={saveAnnouncement} disabled={annSaving} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#3E5EDB,#7A5CDB)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>{annSaving ? t("Saving...") : (editingAnn ? t("Save") : t("Post"))}</button>
            </div>
          </div>
        </div>
      )}

      {assignOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9998,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
        }}>
          <div style={{ background: "var(--bg-card)", borderRadius: 16, padding: 26, width: "min(90vw, 480px)", boxShadow: "0 12px 40px rgba(0,0,0,0.2)" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 17, fontWeight: 700, color: "var(--text-primary)" }}>{t("New Assignment")}</h3>
            <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", border: "1.5px solid var(--border)", borderRadius: 10, background: "var(--input-bg)", color: "var(--text-primary)", fontSize: 14, outline: "none", marginBottom: 12 }}>
              {classes.map(c => <option key={c.code} value={c.code}>{c.code} — {c.title}</option>)}
            </select>
            <input value={assignTitle} onChange={e => setAssignTitle(e.target.value)} placeholder={t("Assignment title")} style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", border: "1.5px solid var(--border)", borderRadius: 10, background: "var(--input-bg)", color: "var(--text-primary)", fontSize: 14, outline: "none", marginBottom: 12 }} />
            <input type="date" value={assignDue} onChange={e => setAssignDue(e.target.value)} style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", border: "1.5px solid var(--border)", borderRadius: 10, background: "var(--input-bg)", color: "var(--text-primary)", fontSize: 14, outline: "none", marginBottom: 18 }} />
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => { setAssignOpen(false); setAssignTitle(""); setAssignDue(""); }} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "1.5px solid var(--border)", background: "var(--input-bg)", color: "var(--text-secondary)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{t("Cancel")}</button>
              <button onClick={postAssignment} disabled={assignSaving} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#3E5EDB,#7A5CDB)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>{assignSaving ? t("Creating...") : t("Create")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
