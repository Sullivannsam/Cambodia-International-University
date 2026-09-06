import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import {
  LayoutGrid, BookOpen, GraduationCap, UserCircle2, LogOut,
  Loader2, ClipboardList, X, RotateCcw, CreditCard,
  FileText, Megaphone, Save, Printer, Bell, CalendarDays,
  ClipboardCheck, MessageSquare, FileDown, Send, Upload, AlertTriangle
} from "lucide-react";
import {
  getStudentProfile, getStudentEnrollments, getStudentClassInfo, getStudentGrades,
  getStudentAnnouncements, getStudentSchedule, getStudentAttendanceRecords,
  getStudentAssignments, submitStudentAssignment,
  getStudentNotifications, markStudentNotificationsRead,
  getStudentMessages, sendStudentMessage, getStudentInvoices,
  submitReport,
  getStudentClassStatus, payStudentClass, joinStudentClass
} from "../../services/endpoints";
import LogoutModal from "../../components/common/LogoutModal";
import EmptyState from "../../components/common/EmptyState";
import StyledSelect from "../../components/common/StyledSelect";
import { useToast } from "../../context/ToastContext";
import { useLanguage } from "../../context/LanguageContext";
import StudentIdCard from "../../components/common/StudentIdCard";
import { useActiveTab } from "../../hooks/useActiveTab";

const NAV = [
  {
    label: "General",
    items: [
      { key: "overview", label: "Overview", icon: LayoutGrid },
      { key: "announcements", label: "Announcements", icon: Megaphone },
    ],
  },
  {
    label: "Academic",
    items: [
      { key: "courses", label: "My Class", icon: BookOpen },
      { key: "schedule", label: "Schedule", icon: CalendarDays },
      { key: "assignments", label: "Assignments", icon: ClipboardList },
      { key: "grades", label: "Grades", icon: GraduationCap },
      { key: "transcript", label: "Transcript", icon: FileText },
      { key: "attendance", label: "Attendance", icon: ClipboardCheck },
    ],
  },
  {
    label: "Financial",
    items: [
      { key: "payments", label: "Payments", icon: CreditCard },
      { key: "invoices", label: "Invoices", icon: FileText },
    ],
  },
  {
    label: "Communication",
    items: [
      { key: "messages", label: "Messages", icon: MessageSquare },
    ],
  },
  {
    label: "Account",
    items: [
      { key: "profile", label: "My Profile", icon: UserCircle2 },
    ],
  },
];

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function LoadingSpinner() {
  return (
    <div className="sp-flex" style={{ padding: "80px 0", justifyContent: "center" }}>
      <Loader2 size={32} className="sp-spin" style={{ color: "#3E5EDB" }} />
    </div>
  );
}

export default function StudentDashboard() {
  const { t } = useLanguage();
  const [active, setActive] = useActiveTab("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [profile, setProfile] = useState({});
  const [enrollments, setEnrollments] = useState([]);
  const [myClass, setMyClass] = useState(null);
  const [grades, setGrades] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [sendingChat, setSendingChat] = useState(false);

  const [payments, setPayments] = useState([]);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileForm, setProfileForm] = useState({
    phone: "", address: "", major: "", year: "",
  });

  const [submitFor, setSubmitFor] = useState(null);
  const [submitNote, setSubmitNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { toast } = useToast();

  const [reportOpen, setReportOpen] = useState(false);
  const [reportTeacher, setReportTeacher] = useState("");
  const [reportCategory, setReportCategory] = useState("Academic");
  const [reportDescription, setReportDescription] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);

  // --- Pay-for-class & join-by-id flow ---
  const [classStatus, setClassStatus] = useState(null);
  const [classLoading, setClassLoading] = useState(true);
  const [payOpen, setPayOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinedClass, setJoinedClass] = useState(null);

  const loadClassStatus = async (silent) => {
    if (!silent) setClassLoading(true);
    try {
      const data = await getStudentClassStatus();
      setClassStatus(data && typeof data === "object" ? data : null);
    } catch {
      setClassStatus(null);
    } finally {
      if (!silent) setClassLoading(false);
    }
  };

  useEffect(() => { loadClassStatus(); }, []);

  const confirmPay = async () => {
    setPaying(true);
    setError("");
    try {
      const res = await payStudentClass({});
      const updated = res && typeof res === "object" ? { ...(classStatus || {}), ...res, paid: true } : { ...(classStatus || {}), paid: true };
      setClassStatus(updated);
      setPayOpen(false);
      setNotice(t("Payment received. Your class join key has been unlocked."));
      maybePersistPayments(updated.price);
    } catch {
      setError(t("Payment could not be processed. Make sure the backend server is running."));
    } finally {
      setPaying(false);
    }
  };

  const maybePersistPayments = (amount) => {
    try {
      const existing = JSON.parse(localStorage.getItem("payments") || "[]");
      existing.push({
        studentId: profile.studentId || studentId,
        amount: amount ? String(amount) : "",
        date: new Date().toISOString().slice(0, 10),
        type: "tuition",
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("payments", JSON.stringify(existing));
      setPayments(existing);
    } catch {}
  };

  const handleJoinClass = async (e) => {
    e.preventDefault();
    const code = joinCodeInput.trim();
    if (!code) return;
    setJoining(true);
    setError("");
    setJoinedClass(null);
    try {
      const cls = await joinStudentClass(code);
      if (cls && typeof cls === "object" && !cls.error) {
        setJoinedClass(cls);
        setJoinOpen(false);
        setJoinCodeInput("");
        reload();
      } else {
        setError(cls && cls.message ? t(cls.message) : t("No class found for that code."));
      }
    } catch {
      setError(t("No class found for that code. Make sure you paid and the code is correct."));
    } finally {
      setJoining(false);
    }
  };

  const submitTeacherReport = async () => {
    if (!reportTeacher.trim() || !reportDescription.trim()) {
      setError(t("Please fill in both the teacher name and the description."));
      return;
    }
    setReportSubmitting(true);
    setError("");
    try {
      await submitReport({
        role: "STUDENT",
        email: profile.email || user.email || "",
        name: displayName,
        subjectRole: "TEACHER",
        subjectEmail: "",
        subjectName: reportTeacher.trim(),
        category: reportCategory,
        description: reportDescription.trim(),
        date: new Date().toLocaleDateString("en-CA"),
      });
      setNotice(t("Report submitted. The administration will review it."));
      setReportOpen(false);
      setReportTeacher("");
      setReportDescription("");
      setReportCategory("Academic");
    } catch {
      setError(t("Failed to submit the report. Make sure the backend server is running."));
    } finally {
      setReportSubmitting(false);
    }
  };

  useEffect(() => {
    try {
      setPayments(JSON.parse(localStorage.getItem("payments") || "[]"));
    } catch {
      setPayments([]);
    }
  }, []);

  const saveProfile = (e) => {
    e.preventDefault();
    const existing = profile.username || profile.name || user.username || "";
    const savedProfile = { ...profile, ...profileForm, name: existing };
    localStorage.setItem("studentProfile", JSON.stringify(savedProfile));
    setProfile({ ...profile, ...profileForm });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  useEffect(() => {
    if (Object.keys(profile).length > 0) {
      setProfileForm({ phone: profile.phone || "", address: profile.address || "", major: profile.major || "", year: profile.year || "" });
    }
  }, [profile]);

  const letterGrade = (score) => {
    const s = Number(score);
    if (s >= 90) return { letter: "A", pts: 4.0 };
    if (s >= 80) return { letter: "B", pts: 3.0 };
    if (s >= 70) return { letter: "C", pts: 2.0 };
    if (s >= 60) return { letter: "D", pts: 1.0 };
    return { letter: "F", pts: 0.0 };
  };

  const gpa = grades.length
    ? (grades.reduce((sum, g) => sum + letterGrade(g.score ?? g.mark ?? 0).pts, 0) / grades.length).toFixed(2)
    : "0.00";

  const totalCredits = enrollments.reduce((sum, c) => sum + Number(c.credits || c.credit || 0), 0);

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
        const [p, e, g, ann, sch, att, asg, notif, msg, inv] = await Promise.all([
          getStudentProfile().catch(() => ({})),
          getStudentEnrollments().catch(() => []),
          getStudentGrades().catch(() => []),
          getStudentAnnouncements().catch(() => []),
          getStudentSchedule().catch(() => []),
          getStudentAttendanceRecords().catch(() => []),
          getStudentAssignments().catch(() => []),
          getStudentNotifications().catch(() => []),
          getStudentMessages().catch(() => []),
          getStudentInvoices().catch(() => []),
        ]);
        getStudentClassInfo().then(d => setMyClass(d && typeof d === "object" ? d : null)).catch(() => {});
        setProfile(Array.isArray(p) ? p[0] || {} : p || {});
        setEnrollments(Array.isArray(e) ? e : []);
        setGrades(Array.isArray(g) ? g : []);
        setAnnouncements(Array.isArray(ann) ? ann : []);
        setSchedule(Array.isArray(sch) ? sch : []);
        setAttendanceRecords(Array.isArray(att) ? att : []);
        setAssignments(Array.isArray(asg) ? asg : []);
        setNotifications(Array.isArray(notif) ? notif : []);
        setMessages(Array.isArray(msg) ? msg : []);
        setInvoices(Array.isArray(inv) ? inv : []);
      } catch {
        setError(t("Failed to load student data. Make sure the backend server is running."));
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const reload = () => {
    getStudentEnrollments().then((e) => setEnrollments(Array.isArray(e) ? e : [])).catch(() => {});
    getStudentClassInfo().then((d) => setMyClass(d && typeof d === "object" ? d : null)).catch(() => {});
    getStudentGrades().then((g) => setGrades(Array.isArray(g) ? g : [])).catch(() => {});
    getStudentSchedule().then((sch) => setSchedule(Array.isArray(sch) ? sch : [])).catch(() => {});
  };

  const displayName = profile.username || profile.name || user.username || (user.email || "").split("@")[0] || t("Student");
  const studentId = profile.studentId || profile.id || "-";

  const unreadCount = notifications.filter(n => !n.read).length;

  const [annSeenId, setAnnSeenId] = useState(() => Number(localStorage.getItem("studentAnnouncementSeenId") || 0));
  const newAnnouncements = announcements.filter(a => Number(a.id) > annSeenId);
  const markAnnouncementsSeen = () => {
    const mx = announcements.reduce((m, a) => Math.max(m, Number(a.id) || 0), 0);
    setAnnSeenId(mx);
    localStorage.setItem("studentAnnouncementSeenId", String(mx));
  };

  useEffect(() => {
    if (active === "announcements" && announcements.length > 0) markAnnouncementsSeen();
  }, [active, announcements]);

  const openNotifications = () => {
    setNotifOpen(o => !o);
    if (!notifOpen && unreadCount > 0) {
      const next = notifications.map(n => ({ ...n, read: true }));
      setNotifications(next);
      markStudentNotificationsRead().catch(() => {});
    }
  };

  const submitAssignment = async () => {
    if (!submitFor) return;
    setSubmitting(true);
    setError("");
    try {
      await submitStudentAssignment({ assignmentId: submitFor.id, note: submitNote.trim() });
      const next = assignments.map(a => a.id === submitFor.id ? { ...a, submitted: true } : a);
      setAssignments(next);
      toast(t("Assignment submitted successfully."));
      setSubmitFor(null);
      setSubmitNote("");
    } catch {
      setError(t("Failed to submit assignment. Make sure the backend server is running."));
    } finally {
      setSubmitting(false);
    }
  };

  const sendChat = async () => {
    if (!chatInput.trim()) return;
    setSendingChat(true);
    const next = [...messages, {
      id: Date.now(), from: t("You"), course: "CS101",
      text: chatInput.trim(), time: new Date().toISOString().slice(0, 16).replace("T", " "), mine: true,
    }];
    setMessages(next);
    setChatInput("");
    try {
      await sendStudentMessage({ course: "CS101", text: next[next.length - 1].text });
    } catch {
      toast(t("Message saved locally. Backend send failed."), "error");
    } finally {
      setSendingChat(false);
    }
  };

  const downloadTranscript = () => {
    const w = window.open("", "_blank");
    const rows = grades.map((g, i) => {
      const score = Number(g.score ?? g.mark ?? 0);
      const lg = letterGrade(score);
      return `<tr><td>${g.title || g.courseName || g.name || "-"}</td><td>${g.code || g.courseCode || "-"}</td><td>${score}%</td><td>${lg.letter}</td><td>${lg.pts.toFixed(1)}</td></tr>`;
    }).join("");
    w.document.write(`<!doctype html><html><head><title>${t("Academic Transcript")}</title><style>body{font-family:Arial,sans-serif;padding:40px}table{width:100%;border-collapse:collapse;margin-top:20px}td,th{padding:10px;border:1px solid #ddd;text-align:left}h1{color:#3E5EDB}</style></head><body><h1>${t("Cambodia International University")}</h1><p>${t("Academic Transcript")} — ${displayName} (${studentId})</p><table><thead><tr><th>${t("Course")}</th><th>${t("Code")}</th><th>${t("Score")}</th><th>${t("Grade")}</th><th>${t("Grade Points")}</th></tr></thead><tbody>${rows}</tbody></table><p><strong>${t("Cumulative GPA")}:</strong> ${gpa} &nbsp; <strong>${t("Credits Earned")}:</strong> ${totalCredits}</p></body></html>`);
    w.document.close();
    w.print();
  };

  const downloadRosterCSV = () => {
    const header = `${t("ID")},${t("Name")},${t("Major")},${t("Attendance")}`;
    const rows = enrollments.map(c => `"${c.code || c.courseCode || ""}","${c.title || c.courseName || ""}","${c.credits || c.credit || 0}"`).join("\n");
    const blob = new Blob([`${header}\n${rows}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `my-courses-${studentId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const avgGrade = grades.length
    ? (grades.reduce((sum, g) => {
        const score = Number(g.score ?? g.grade ?? g.mark ?? 0);
        return sum + score;
      }, 0) / grades.length).toFixed(1)
    : "0";

  if (sessionStorage.getItem("role") !== "STUDENT") {
    window.location.href = "/";
    return null;
  }

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
          width: 250px; flex-shrink: 0;
          background: #182644; color: #E7EAF4;
          min-height: 100vh; display: flex; flex-direction: column;
        }
        .sidebar-head {
          padding: 26px 22px 20px;
          background: linear-gradient(160deg,#233766,#182644 70%);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .avatar-ring {
          width: 56px; height: 56px; border-radius: 50%;
          background: #3E5EDB; display: flex; align-items: center; justify-content: center;
          margin-bottom: 12px; box-shadow: 0 0 0 3px rgba(255,255,255,0.15);
        }
        .sidebar-head-title { font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 14.5px; }
        .sidebar-scroll { padding: 18px 14px 30px; overflow-y: auto; }
        .nav-section { margin-bottom: 18px; }
        .nav-section-label {
          font-size: 11px; text-transform: uppercase; letter-spacing: 0.09em;
          color: #7C89B8; padding: 0 10px 8px; font-weight: 600;
        }
        .nav-item {
          display: flex; align-items: center; gap: 10px; padding: 9px 12px;
          border-radius: 8px; font-size: 13.5px; color: #C9D0E8; cursor: pointer;
          margin-bottom: 3px; transition: background 0.15s ease, color 0.15s ease;
          background: transparent; border: none; width: 100%; text-align: left;
        }
        .nav-item:hover { background: rgba(255,255,255,0.06); color: #fff; }
        .nav-item.active { background: #3E5EDB; color: #fff; box-shadow: 0 4px 14px rgba(62,94,219,0.4); }
        .nav-badge {
          margin-left: auto; min-width: 17px; height: 17px; padding: 0 5px;
          border-radius: 999px; background: #ef4444; color: #fff;
          font-size: 10.5px; font-weight: 700; display: flex;
          align-items: center; justify-content: center;
        }
        .main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
        .topbar {
          background: #FBF4EE; padding: 22px 34px;
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid #ECE3D8;
        }
        .topbar-title { font-family: 'Poppins', sans-serif; font-size: 21px; font-weight: 600; color: #182644; }
        .topbar-sub { font-size: 12.5px; color: #9A8F80; margin-top: 2px; }
        .logout-btn {
          background: #3E5EDB; color: #fff; border: none; padding: 10px 20px; border-radius: 9px;
          font-size: 13.5px; font-weight: 600; display: flex; align-items: center; gap: 8px; cursor: pointer;
          box-shadow: 0 6px 16px rgba(62,94,219,0.35);
        }
        .content { padding: 26px 34px 60px; flex: 1; }
        .content-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; gap: 20px; flex-wrap: wrap; }
        .date-label { color: #6B7280; font-size: 13.5px; }
        .error-banner {
          background: #FBE3E0; border: 1px solid #E0665A; color: #D2483C;
          border-radius: 10px; padding: 12px 18px; font-size: 13px; margin-bottom: 20px;
        }
        .notice-banner {
          background: #E3F0E7; border: 1px solid #2E9E6C; color: #1E7A4E;
          border-radius: 10px; padding: 12px 18px; font-size: 13px; margin-bottom: 20px;
        }
        .profile-card {
          background: linear-gradient(135deg, #182644, #233766);
          color: #fff; border-radius: 16px; padding: 26px 28px; margin-bottom: 22px;
          display: flex; align-items: center; gap: 20px;
          box-shadow: 0 8px 24px rgba(24,38,68,0.25);
        }
        .profile-avatar {
          width: 64px; height: 64px; border-radius: 50%; background: #3E5EDB;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .profile-name { font-family: 'Poppins', sans-serif; font-size: 19px; font-weight: 600; }
        .profile-meta { font-size: 12.5px; color: #B9C3E2; margin-top: 3px; }
        .sp-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 20px; margin-bottom: 22px; }
        .sp-card { background: #fff; border-radius: 14px; padding: 20px; box-shadow: 0 4px 16px rgba(24,38,68,0.06); }
        .sp-card-title { font-size: 12.5px; font-weight: 600; color: #3E5EDB; margin-bottom: 8px; }
        .sp-card-value { font-family: 'Poppins', sans-serif; font-size: 26px; font-weight: 700; color: #182644; }
        .sp-card-sub { font-size: 12px; color: #9A8F80; margin-top: 4px; }
        .panel { background: #fff; border-radius: 14px; padding: 22px; box-shadow: 0 4px 16px rgba(24,38,68,0.06); }
        .prof-status { border: 1px solid #ECE6DC; border-radius: 12px; overflow: hidden; }
        .prof-row { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 12px 16px; border-bottom: 1px solid #F0EEE9; font-size: 13.5px; }
        .prof-row:last-child { border-bottom: none; }
        .prof-row > span { color: #9A8F80; }
        .prof-row > strong { color: #182644; display: flex; align-items: center; gap: 8px; text-align: right; }
        .lockbox { margin-top: 14px; background: #EAF7F0; border: 1px dashed #2E9E6C; border-radius: 12px; padding: 16px; text-align: center; }
        .lockbox-label { font-size: 11.5px; color: #1E7A4E; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
        .lockkey { font-size: 26px; font-weight: 800; letter-spacing: 2px; color: #1E7A4E; font-family: monospace; }
        .lockbox-note { font-size: 12px; color: #4B9D7A; margin: 8px 0 0; }
        .hint { margin-top: 14px; padding: 12px 16px; border-radius: 10px; background: #FFF7E6; color: #9A6B00; font-size: 13px; line-height: 1.6; border: 1px solid #F0DCB6; }
        .panel-title { font-family:'Poppins',sans-serif; font-weight: 600; color: #182644; margin-bottom: 16px; font-size: 15px; }
        .course-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px; }
        .course-card { background: #FAF8F4; border: 1px solid #ECE6DC; border-radius: 14px; padding: 18px 20px; }
        .course-code { display: inline-block; background: #E7E3F7; color: #3E5EDB; font-weight: 700; font-size: 12px; padding: 3px 10px; border-radius: 999px; }
        .course-title { font-family: 'Poppins', sans-serif; font-size: 15px; font-weight: 600; color: #182644; margin: 10px 0 4px; }
        .course-desc { font-size: 12.5px; color: #6B7280; line-height: 1.6; }
        .course-foot { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; font-size: 12px; color: #9A8F80; }
        .add-btn {
          background: #3E5EDB; color: #fff; border: none; padding: 10px 18px; border-radius: 9px;
          font-size: 13px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
          box-shadow: 0 6px 16px rgba(62,94,219,0.35);
        }
        .sp-overlay {
          position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center;
          animation: spFade 0.25s ease;
        }
        .sp-modal { background: #fff; border-radius: 16px; padding: 26px 28px; width: min(90vw, 440px); animation: spPop 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .sp-modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .sp-modal-title { font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 16px; color: #182644; }
        .sp-close { background: #F6F4EF; border: none; border-radius: 8px; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; color: #6B7280; cursor: pointer; }
        .sp-field { margin-bottom: 14px; }
        .sp-label { display: block; font-size: 12.5px; font-weight: 600; color: #182644; margin-bottom: 6px; }
        .sp-input {
          width: 100%; padding: 11px 14px; border: 1.5px solid #E5E7EB; border-radius: 10px;
          font-size: 13.5px; outline: none; background: #FBFBF9; color: #1F2430;
        }
        .sp-input:focus { border-color: #3E5EDB; }
        .sp-modal-foot { display: flex; gap: 12px; margin-top: 22px; }
        .sp-cancel {
          flex: 1; padding: 11px 0; border-radius: 10px; border: 1.5px solid #E5E7EB;
          background: #F6F4EF; color: #6B7280; font-size: 14px; font-weight: 600; cursor: pointer;
        }
        .sp-primary {
          flex: 1; padding: 11px 0; border-radius: 10px; border: none; background: #3E5EDB; color: #fff;
          font-size: 14px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center;
          justify-content: center; gap: 8px; box-shadow: 0 6px 16px rgba(62,94,219,0.35);
        }
        .sp-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .sp-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .sp-table th { text-align: left; color: #3E5EDB; border-bottom: 2px solid #E5E7EB; padding: 10px 12px; }
        .sp-table td { padding: 10px 12px; border-bottom: 1px solid #F0EEE9; }
        .grade-pill { color: #fff; font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 999px; }
        .sp-flex { display: flex; align-items: center; gap: 8px; }
        .sp-spin { animation: spspin 1s linear infinite; }
        @keyframes spspin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes spPop { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
        @media (max-width: 900px) {
          .sp-grid { grid-template-columns: 1fr; }
          .sidebar { width: 210px; }
          .sp-profile-form { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <aside className="sidebar">
        <div className="sidebar-head">
          <div className="avatar-ring"><UserCircle2 size={30} color="#fff" /></div>
          <div className="sidebar-head-title">{t("Student")}: {displayName}</div>
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
                    }}
                  >
                    <Icon size={16} strokeWidth={1.8} />
                    {t(item.label)}
                    {item.key === "announcements" && newAnnouncements.length > 0 && (
                      <span className="nav-badge">{newAnnouncements.length}</span>
                    )}
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
            <div className="topbar-title">{t("Student Portal")}</div>
            <div className="topbar-sub">{t("CIU Student Dashboard")}</div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", position: "relative" }}>
            <button
              onClick={openNotifications}
              className="logout-btn"
              style={{ background: "#182644", position: "relative", padding: "10px 14px" }}
              aria-label={t("Notifications")}
            >
              <Bell size={15} />
              {unreadCount > 0 && (
                <span style={{
                  position: "absolute", top: -5, right: -5,
                  background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 800,
                  minWidth: 18, height: 18, borderRadius: 999, display: "flex",
                  alignItems: "center", justifyContent: "center", padding: "0 4px",
                }}>{unreadCount}</span>
              )}
            </button>
            {notifOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 10px)", right: 0, zIndex: 100,
                background: "#fff", borderRadius: 14, boxShadow: "0 12px 32px rgba(24,38,68,0.18)",
                width: 340, maxHeight: 380, overflow: "auto", padding: 8, border: "1px solid #ECE6DC",
              }}>
                <div style={{ padding: "10px 12px 6px", fontWeight: 700, fontSize: 14, color: "#182644" }}>
                  {t("Notifications")}
                </div>
                {notifications.length ? notifications.map(n => (
                  <div key={n.id} style={{ padding: "10px 12px", borderBottom: "1px solid #F0EEE9" }}>
                    <div style={{ fontSize: 13, fontWeight: n.read ? 600 : 700, color: "#182644" }}>{t(n.title)}</div>
                    <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2, lineHeight: 1.5 }}>{t(n.body)}</div>
                    <div style={{ fontSize: 11, color: "#9A8F80", marginTop: 4 }}>{n.date}</div>
                  </div>
                )) : (
                  <div style={{ padding: "16px 12px", fontSize: 13, color: "#9A8F80", textAlign: "center" }}>
                    {t("No notifications")}
                  </div>
                )}
              </div>
            )}
            <button className="logout-btn" style={{ background: "#182644" }} onClick={() => (window.location.href = "/")}>
              <LayoutGrid size={15} /> {t("Visit Public Page")}
            </button>
            <LogoutModal className="logout-btn" style={{ background: "#ef4444" }}><LogOut size={15} /> {t("Logout")}</LogoutModal>
          </div>
        </div>

        <div className="content">
          {error && <div className="error-banner">{error}</div>}
          {notice && <div className="notice-banner">{notice}</div>}

          {loading && <LoadingSpinner />}

          {!loading && active === "overview" && (
            <>
              <div className="content-row">
                <div className="date-label">{today}</div>
              </div>
              <div className="profile-card">
                <div className="profile-avatar"><UserCircle2 size={32} color="#fff" /></div>
                <div>
                  <div className="profile-name">{displayName}</div>
                  <div className="profile-meta">{t("Student ID")}: {studentId} &nbsp;·&nbsp; {t("Email")}: {profile.email || user.email || "-"}</div>
                </div>
              </div>
              <div className="sp-grid">
                <div className="sp-card">
                  <div className="sp-card-title">{t("Enrolled Courses")}</div>
                  <div className="sp-card-value">{enrollments.length}</div>
                  <div className="sp-card-sub">{t("Currently active enrollments")}</div>
                </div>
                <div className="sp-card">
                  <div className="sp-card-title">{t("Average Score")}</div>
                  <div className="sp-card-value">{avgGrade}</div>
                  <div className="sp-card-sub">{t("Across")} {grades.length} {t("graded subject(s)")}</div>
                </div>
                <div className="sp-card">
                  <div className="sp-card-title">{t("Program")}</div>
                  <div className="sp-card-value" style={{ fontSize: 17 }}>{profile.major || profile.course || "—"}</div>
                  <div className="sp-card-sub">{profile.year ? `${t("Year")} ${profile.year}` : "—"}</div>
                </div>
              </div>
              <div className="panel">
                <div className="panel-title">{t("Quick Actions")}</div>
                <div className="course-grid">
                  <div className="course-card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div className="sp-flex" style={{ color: "#3E5EDB" }}><BookOpen size={18} /> {t("Join your class")}</div>
                    <div className="course-desc">{t("Use the class key you get after paying to join and see the class and teacher.")}</div>
                    <button className="add-btn" style={{ background: "#182644", boxShadow: "0 6px 16px rgba(24,38,68,0.3)" }} onClick={() => setJoinOpen(true)}><BookOpen size={15} /> {t("Join Class by ID")}</button>
                  </div>
                  <div className="course-card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div className="sp-flex" style={{ color: "#D2483C" }}><AlertTriangle size={18} /> {t("Report a teacher")}</div>
                    <div className="course-desc">{t("Report an issue about a teacher to the administration.")}</div>
                    <button className="add-btn" style={{ background: "#D2483C", boxShadow: "0 6px 16px rgba(210,72,60,0.35)" }} onClick={() => setReportOpen(true)}><AlertTriangle size={15} /> {t("Report")}</button>
                  </div>
                  <div className="course-card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div className="sp-flex" style={{ color: "#2E9E6C" }}><BookOpen size={18} /> {t("Collect your class key")}</div>
                    <div className="course-desc">{t("Pay for your next class to unlock its join key, then join by ID to see the class and teacher.")}</div>
                    <button className="add-btn" style={{ background: "#1E7A4E", boxShadow: "0 6px 16px rgba(30,122,78,0.35)" }} onClick={() => loadClassStatus().then(() => setPayOpen(true))}>
                      <CreditCard size={15} /> {t("Pay & Get Key")}
                    </button>
                  </div>
                </div>
              </div>

              <div className="panel" style={{ marginTop: 20 }}>
                <div className="panel-title sp-flex"><Megaphone size={16} /> {t("Announcements")}</div>
                {announcements.slice(0, 3).map(a => (
                  <div key={a.id} style={{ borderLeft: "3px solid #3E5EDB", background: "#F7F6F2", borderRadius: "0 10px 10px 0", padding: "12px 16px", marginBottom: 10 }}>
                    <div className="date-label" style={{ fontSize: 11.5 }}>{a.date}</div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#182644", margin: "3px 0" }}>{t(a.title)}</div>
                    <div style={{ fontSize: 12.5, color: "#6B7280", lineHeight: 1.6 }}>{t(a.body)}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!loading && active === "courses" && (
            <>
              <div className="content-row">
                <div className="date-label">{today}</div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button className="add-btn" style={{ background: "#182644", boxShadow: "0 6px 16px rgba(24,38,68,0.3)" }} onClick={() => setJoinOpen(true)}>
                    <BookOpen size={15} /> {t("Join Class by ID")}
                  </button>
                </div>
              </div>

              {myClass && myClass.joined ? (
                <>
                  <div className="panel" style={{ marginBottom: 20 }}>
                    <div className="panel-title sp-flex">
                      <BookOpen size={16} /> {t("My Class")}
                      <span className="course-code" style={{ marginLeft: 6 }}>{myClass.joinCode || myClass.group}</span>
                    </div>
                    <div className="prof-status">
                      <div className="prof-row"><span>{t("Class")}</span><strong>{t(myClass.classLabel || `${myClass.year} ${myClass.semester}`) || "-"}</strong></div>
                      <div className="prof-row"><span>{t("Course Name")}</span><strong>{t(myClass.course || "-")}</strong></div>
                      <div className="prof-row"><span>{t("Major")}</span><strong>{myClass.major || profile.major || "-"}</strong></div>
                      <div className="prof-row"><span>{t("Teacher")}</span><strong>{t(myClass.teacher || "-")}</strong></div>
                      <div className="prof-row"><span>{t("Days")}</span><strong>{t(myClass.days || "-")}</strong></div>
                      <div className="prof-row"><span>{t("Time")}</span><strong>{myClass.time || "-"}</strong></div>
                      <div className="prof-row"><span>{t("Room")}</span><strong>{myClass.room || "-"}</strong></div>
                    </div>
                  </div>

                  {(myClass.friends && myClass.friends.length > 0) && (
                    <div className="panel" style={{ marginBottom: 20 }}>
                      <div className="panel-title sp-flex"><UserCircle2 size={16} /> {t("Friends / Classmates")} <span className="course-code" style={{ marginLeft: 6 }}>{myClass.friends.length}</span></div>
                      {myClass.friends.map(f => (
                        <div key={f.id} className="prof-row">
                          <span>{t("Classmate")}</span>
                          <strong><UserCircle2 size={14} /> {f.name} <span className="course-code" style={{ marginLeft: 6 }}>{f.id}</span></strong>
                        </div>
                      ))}
                    </div>
                  )}

                  {enrollments.length > 0 && (
                    <div className="panel">
                      <div className="panel-title">{t("Subjects in this class")} ({enrollments.length})</div>
                      <div className="course-grid">
                        {enrollments.map((c, i) => (
                          <div className="course-card" key={c.id || i}>
                            <span className="course-code">{c.code || c.courseCode || `CRS-${i + 1}`}</span>
                            <div className="course-title">{c.title || c.courseName || c.name || t("Course")}</div>
                            <div className="course-desc">{c.description || `${t("Enrolled course")} ${i + 1}.`}</div>
                            <div className="course-foot">
                              <span>{t("Instructor")}: {c.instructor || c.teacher || "—"}</span>
                              <span>{c.credits || c.credit || 0} {t("credits")}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="panel">
                  <div className="panel-title">{t("My Class")}</div>
                  <div className="date-label">{t("You have not joined a class yet. Use your class join key to join your class and see the teacher, course and classmates.")}</div>
                </div>
              )}
            </>
          )}

          {!loading && active === "announcements" && (
            <div className="panel">
              <div className="panel-title sp-flex"><Megaphone size={16} /> {t("Announcements")}</div>

              {(classStatus?.paid || classStatus?.joined) && classStatus?.joinCode && (
                <div style={{ borderLeft: "3px solid #2E9E6C", background: "#EAF7F0", borderRadius: "0 10px 10px 0", padding: "14px 18px", marginBottom: 14 }}>
                  <div className="date-label" style={{ fontSize: 11.5 }}>{t("For paying students only")}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#182644", margin: "4px 0" }}>
                    {t("You are enrolled in")} {t(classStatus.nextLabel || `${classStatus.year} ${classStatus.semester}`)}
                  </div>
                  <div style={{ fontSize: 12.5, color: "#1E7A4E", lineHeight: 1.6 }}>
                    {t("Your class join key is")} <strong style={{ fontFamily: "monospace" }}>{classStatus.joinCode}</strong>. {t("Use it in Join Class by ID to view your schedule and teacher.")}
                  </div>
                </div>
              )}

              {announcements.length ? announcements.map(a => (
                <div key={a.id} style={{ borderLeft: "3px solid #3E5EDB", background: "#F7F6F2", borderRadius: "0 10px 10px 0", padding: "14px 18px", marginBottom: 12 }}>
                  <div className="date-label" style={{ fontSize: 11.5 }}>{a.date}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#182644", margin: "4px 0" }}>{t(a.title)}</div>
                  <div style={{ fontSize: 12.5, color: "#6B7280", lineHeight: 1.6 }}>{t(a.body)}</div>
                </div>
              )) : <EmptyState title={t("No announcements yet")} />}
            </div>
          )}

          {!loading && active === "schedule" && (
            <div className="panel">
              <div className="content-row" style={{ marginBottom: 12 }}>
                <div className="panel-title" style={{ margin: 0 }}><CalendarDays size={16} /> {t("Weekly Schedule")}</div>
                <button className="add-btn" onClick={downloadRosterCSV} style={{ padding: "8px 14px", fontSize: 12 }}><FileDown size={14} /> {t("Export CSV")}</button>
              </div>
              {schedule.length ? (
                <table className="sp-table">
                  <thead>
                    <tr><th>{t("Day")}</th><th>{t("Code")}</th><th>{t("Course")}</th><th>{t("Semester")}</th><th>{t("Time")}</th><th>{t("Room")}</th><th>{t("Teacher")}</th></tr>
                  </thead>
                  <tbody>
                    {[...schedule].sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day)).map((s, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600, color: "#182644" }}>
                          {t(s.day)}{s.endDay && s.endDay !== s.day ? ` - ${t(s.endDay)}` : ""}
                        </td>
                        <td><span className="course-code">{s.code}</span></td>
                        <td>{t(s.title)}</td>
                        <td>{s.semester || "-"}</td>
                        <td>{s.time}</td>
                        <td>{s.room}</td>
<td>{s.teacher || "-"}</td>
      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <EmptyState title={t("No schedule available yet")} />}
            </div>
          )}

          {!loading && active === "assignments" && (
            <div className="panel">
              <div className="panel-title sp-flex"><ClipboardList size={16} /> {t("Assignments")}</div>
              {assignments.length ? (
                <table className="sp-table">
                  <thead>
                    <tr><th>{t("Course")}</th><th>{t("Assignment")}</th><th>{t("Due")}</th><th>{t("Status")}</th><th></th></tr>
                  </thead>
                  <tbody>
                    {assignments.map(a => (
                      <tr key={a.id}>
                        <td><span className="course-code">{a.code}</span></td>
                        <td style={{ fontWeight: 600, color: "#182644" }}>{t(a.title)}</td>
                        <td>{a.due}</td>
                        <td>
                          {a.submitted
                            ? <span className="grade-pill" style={{ background: "#2E9E6C" }}>{t("Submitted")}</span>
                            : new Date(a.due) < new Date()
                              ? <span className="grade-pill" style={{ background: "#D2483C" }}>{t("Overdue")}</span>
                              : <span className="grade-pill" style={{ background: "#D69A1E" }}>{t("Pending")}</span>}
                        </td>
                        <td>
                          {!a.submitted && (
                            <button className="add-btn" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => { setSubmitFor(a); setSubmitNote(""); }}>
                              <Upload size={13} /> {t("Submit")}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <EmptyState title={t("No assignments yet")} />}
            </div>
          )}

          {!loading && active === "attendance" && (
            <div className="panel">
              <div className="panel-title sp-flex"><ClipboardCheck size={16} /> {t("My Attendance")}</div>
              {attendanceRecords.length ? (
                <table className="sp-table">
                  <thead>
                    <tr><th>{t("Course")}</th><th>{t("Present")}</th><th>{t("Total")}</th><th>{t("Rate")}</th></tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.map((a, i) => {
                      const pct = a.percent ?? (a.total ? Math.round((a.present / a.total) * 100) : 0);
                      return (
                        <tr key={i}>
                          <td style={{ fontWeight: 600, color: "#182644" }}>{t(a.title)} <span className="course-code" style={{ marginLeft: 6 }}>{a.code}</span></td>
                          <td>{a.present}</td>
                          <td>{a.total}</td>
                          <td><span className="grade-pill" style={{ background: pct >= 90 ? "#2E9E6C" : pct >= 70 ? "#D69A1E" : "#D2483C" }}>{pct}%</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : <EmptyState title={t("No attendance data yet")} />}
            </div>
          )}

          {!loading && active === "grades" && (
            <>
              <div className="content-row">
                <div className="date-label">{today}</div>
              </div>
              <div className="panel">
                <div className="panel-title">{t("Grades")} ({grades.length})</div>
                {grades.length > 0 ? (
                  <>
                    <div style={{ marginBottom: 18, height: 160 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={grades.map(g => ({ name: g.code || g.courseCode || "-", score: Number(g.score ?? g.mark ?? 0) }))}>
                          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                          <Tooltip />
                          <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                            {grades.map((g, i) => {
                              const score = Number(g.score ?? g.mark ?? 0);
                              return <Cell key={i} fill={score >= 90 ? "#2E9E6C" : score >= 70 ? "#D69A1E" : "#D2483C"} />;
                            })}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <table className="sp-table">
                    <thead>
                      <tr>
                        <th>{t("Course")}</th>
                        <th>{t("Code")}</th>
                        <th>{t("Instructor")}</th>
                        <th>{t("Score")}</th>
                        <th>{t("Grade")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grades.map((g, i) => {
                        const score = Number(g.score ?? g.mark ?? 0);
                        const pct = g.percent !== undefined ? Number(g.percent) : score;
                        const color = pct >= 90 ? "#2E9E6C" : pct >= 70 ? "#D69A1E" : "#D2483C";
                        return (
                          <tr key={g.id || i}>
                            <td style={{ fontWeight: 600, color: "#182644" }}>{g.title || g.courseName || g.name || t("Course")}</td>
                            <td>{g.code || g.courseCode || "-"}</td>
                            <td>{g.instructor || g.teacher || "-"}</td>
                            <td>{g.score !== undefined ? g.score : (g.grade || "-")}</td>
                            <td>
                              <span className="grade-pill" style={{ background: color }}>{g.grade || g.letter || score + "%"}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </>
                ) : (
                  <div className="date-label">{t("No grades available yet.")}</div>
                )}
              </div>
            </>
          )}

          {!loading && active === "transcript" && (
            <>
              <div className="content-row">
                <div className="date-label">{today}</div>
                <button className="add-btn" onClick={downloadTranscript}><FileDown size={15} /> {t("Download / Print")}</button>
              </div>
              <div className="panel">
                <div className="panel-title">{t("Academic Transcript")}</div>
                {grades.length > 0 ? (
                  <>
                    <table className="sp-table">
                      <thead>
                        <tr>
                          <th>{t("Course")}</th>
                          <th>{t("Code")}</th>
                          <th>{t("Score")}</th>
                          <th>{t("Grade")}</th>
                          <th>{t("Grade Points")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grades.map((g, i) => {
                          const score = Number(g.score ?? g.mark ?? 0);
                          const lg = letterGrade(score);
                          return (
                            <tr key={g.id || i}>
                              <td style={{ fontWeight: 600, color: "#182644" }}>{g.title || g.courseName || g.name || t("Course")}</td>
                              <td>{g.code || g.courseCode || "-"}</td>
                              <td>{score}%</td>
                              <td><span className="grade-pill" style={{ background: score >= 90 ? "#2E9E6C" : score >= 70 ? "#D69A1E" : "#D2483C" }}>{lg.letter}</span></td>
                              <td>{lg.pts.toFixed(1)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <div style={{ display: "flex", gap: 16, marginTop: 20, flexWrap: "wrap" }}>
                      <div className="sp-card" style={{ padding: "14px 20px" }}>
                        <div className="sp-card-title">{t("Cumulative GPA")}</div>
                        <div className="sp-card-value">{gpa}</div>
                      </div>
                      <div className="sp-card" style={{ padding: "14px 20px" }}>
                        <div className="sp-card-title">{t("Credits Earned")}</div>
                        <div className="sp-card-value">{totalCredits}</div>
                      </div>
                      <div className="sp-card" style={{ padding: "14px 20px" }}>
                        <div className="sp-card-title">{t("Courses Completed")}</div>
                        <div className="sp-card-value">{grades.length}</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="date-label">{t("No transcript data available yet.")}</div>
                )}
              </div>
            </>
          )}

          {!loading && active === "payments" && (
            <>
              <div className="content-row">
                <div className="date-label">{today}</div>
                <button className="add-btn" onClick={() => setPayOpen(true)}><CreditCard size={15} /> {t("Pay for Your Class")}</button>
              </div>

              <div className="panel" style={{ marginBottom: 20 }}>
                <div className="panel-title sp-flex"><CreditCard size={16} /> {t("Tuition & Class Enrollment")}</div>
                {classLoading ? (
                  <div className="sp-flex" style={{ padding: "24px 0", color: "#9A8F80" }}>
                    <Loader2 size={18} className="sp-spin" /> {t("Checking your class status...")}
                  </div>
                ) : classStatus ? (
                  <>
                    <div className="prof-status">
                      <div className="prof-row"><span>{t("Your Class")}</span><strong>{t(classStatus.classLabel || `${classStatus.year} ${classStatus.semester}`) || "-"}</strong></div>
                      <div className="prof-row"><span>{t("Major / Course")}</span><strong>{classStatus.major || profile.major || "-"}</strong></div>
                      <div className="prof-row">
                        <span>{t("Exam Average")}</span>
                        <strong>
                          {classStatus.avgScore != null ? `${Number(classStatus.avgScore).toFixed(2)}% ` : ""}
                          <span className="grade-pill" style={{ background: classStatus.passed ? "#2E9E6C" : "#D2483C" }}>
                            {classStatus.passed ? t("PASS") : t("FAIL")}
                          </span>
                        </strong>
                      </div>
                      <div className="prof-row"><span>{t("Next Semester")}</span><strong>{t(classStatus.nextLabel || (classStatus.passed ? "Semester 2, Year 1" : `${classStatus.year || "Year 1"}, ${classStatus.semester || "Semester 1"}`))}</strong></div>
                      <div className="prof-row"><span>{t("Tuition Fee")}</span><strong style={{ color: "#182644", fontSize: 15 }}>${Number(classStatus.price || classStatus.amount || 0).toFixed(2)}</strong></div>
                    </div>

                    {classStatus.joined || classStatus.paid ? (
                      <div className="lockbox">
                        <div className="lockbox-label">{t("Your class join key (unlocked)")}</div>
                        <div className="lockkey">{classStatus.joinCode || classStatus.key || "-"}</div>
                        <p className="lockbox-note">{t("Use this key in \"Join Class by ID\" to view your class and teacher.")}</p>
                      </div>
                    ) : (
                      <div className="hint">
                        {t("Pay the tuition above to unlock the join key for your next class. The schedule for this class must exist before you can join.")}
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                      <button className="add-btn" onClick={() => setPayOpen(true)}>
                        <CreditCard size={15} /> {t("Pay Now")}
                      </button>
                      <button className="add-btn" style={{ background: "#182644", boxShadow: "0 6px 16px rgba(24,38,68,0.3)" }} onClick={() => setJoinOpen(true)}>
                        <BookOpen size={15} /> {t("Join Class by ID")}
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <div className="date-label" style={{ marginBottom: 14 }}>{t("Class status is not available yet.")}</div>
                    <button className="add-btn" style={{ background: "#182644", boxShadow: "0 6px 16px rgba(24,38,68,0.3)" }} onClick={() => loadClassStatus()}>
                      <RotateCcw size={15} /> {t("Retry")}
                    </button>
                  </div>
                )}
              </div>

              {joinedClass && (
                <div className="panel" style={{ marginBottom: 20 }}>
                  <div className="panel-title sp-flex"><BookOpen size={16} /> {t("Joined Class")} <span className="course-code" style={{ marginLeft: 4 }}>{joinedClass.code}</span></div>
                  <div className="prof-status">
                    <div className="prof-row"><span>{t("Class")}</span><strong>{t(joinedClass.classLabel || `${joinedClass.year} ${joinedClass.semester}`) || "-"}</strong></div>
                    <div className="prof-row"><span>{t("Course / Major")}</span><strong>{joinedClass.course || joinedClass.major || "-"}</strong></div>
                    <div className="prof-row"><span>{t("Teacher")}</span><strong>{joinedClass.teacher || "-"}</strong></div>
                    <div className="prof-row"><span>{t("Days")}</span><strong>{joinedClass.days || joinedClass.startDay || "-"}</strong></div>
                    <div className="prof-row"><span>{t("Time")}</span><strong>{joinedClass.time || "-"}</strong></div>
                    <div className="prof-row"><span>{t("Room")}</span><strong>{joinedClass.room || "-"}</strong></div>
                  </div>
                </div>
              )}

              {payments.length > 0 && (
                <div className="panel">
                  <div className="panel-title">{t("Payment History")} ({payments.length})</div>
                  <table className="sp-table">
                    <thead>
                      <tr>
                        <th>{t("Receipt")}</th>
                        <th>{t("Date")}</th>
                        <th>{t("Type")}</th>
                        <th>{t("Amount")}</th>
                        <th>{t("Receipt")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 700, color: "#3E5EDB" }}>#{String(1000 + i + 1).padStart(4, "0")}</td>
                          <td>{p.date}</td>
                          <td style={{ textTransform: "capitalize" }}>{p.type}</td>
                          <td style={{ fontWeight: 700, color: "#182644" }}>${Number(p.amount).toFixed(2)}</td>
                          <td>
                            <button className="add-btn" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => {
                              const w = window.open("", "_blank");
                              w.document.write(`<!doctype html><html><head><title>${t("Receipt")}</title><style>body{font-family:Arial,sans-serif;padding:40px}table{width:100%;border-collapse:collapse;margin-top:20px}td,th{padding:10px;border:1px solid #ddd;text-align:left}h1{color:#3E5EDB}</style></head><body><h1>${t("Cambodia International University")}</h1><p>${t("Official Payment Receipt")}</p><table><tr><th>${t("Receipt No.")}</th><td>#${String(1000 + i + 1).padStart(4, "0")}</td></tr><tr><th>${t("Date")}</th><td>${p.date}</td></tr><tr><th>${t("Type")}</th><td>${p.type}</td></tr><tr><th>${t("Student ID")}</th><td>${p.studentId}</td></tr><tr><th>${t("Amount")}</th><td>$${Number(p.amount).toFixed(2)}</td></tr><tr><th>${t("Status")}</th><td>${t("Paid")}</td></tr></table></body></html>`);
                              w.document.close();
                              w.print();
                            }}>
                              <Printer size={13} /> {t("Print")}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {!loading && active === "invoices" && (
            <>
              <div className="content-row">
                <div className="date-label">{today}</div>
              </div>
              <div className="sp-grid">
                <div className="sp-card">
                  <div className="sp-card-title">{t("Total Billed")}</div>
                  <div className="sp-card-value">${invoices.reduce((s, i) => s + Number(i.amount || 0), 0).toFixed(2)}</div>
                  <div className="sp-card-sub">{invoices.length} {t("invoice(s)")}</div>
                </div>
                <div className="sp-card">
                  <div className="sp-card-title">{t("Outstanding")}</div>
                  <div className="sp-card-value" style={{ color: "#D2483C" }}>${invoices.filter(i => i.status !== "Paid").reduce((s, i) => s + Number(i.amount || 0), 0).toFixed(2)}</div>
                  <div className="sp-card-sub">{t("Unpaid balance")}</div>
                </div>
                <div className="sp-card">
                  <div className="sp-card-title">{t("Paid")}</div>
                  <div className="sp-card-value" style={{ color: "#2E9E6C" }}>${invoices.filter(i => i.status === "Paid").reduce((s, i) => s + Number(i.amount || 0), 0).toFixed(2)}</div>
                  <div className="sp-card-sub">{t("Completed payments")}</div>
                </div>
              </div>
              {invoices.length ? (
                <div className="panel">
                  <div className="panel-title">{t("Invoices")}</div>
                  <table className="sp-table">
                    <thead>
                      <tr><th>{t("Invoice")}</th><th>{t("Description")}</th><th>{t("Due")}</th><th>{t("Amount")}</th><th>{t("Status")}</th></tr>
                    </thead>
                    <tbody>
                      {invoices.map((inv, i) => (
                        <tr key={inv.id || i}>
                          <td style={{ fontWeight: 700, color: "#3E5EDB" }}>#INV-{String(1000 + (inv.id || i) + 1).padStart(4, "0")}</td>
                          <td style={{ fontWeight: 600, color: "#182644" }}>{t(inv.title)}</td>
                          <td>{inv.due}</td>
                          <td style={{ fontWeight: 700, color: "#182644" }}>${Number(inv.amount).toFixed(2)}</td>
                          <td>
                            <span className="grade-pill" style={{ background: inv.status === "Paid" ? "#2E9E6C" : "#D69A1E" }}>
                              {inv.status === "Paid" ? t("Paid") : t("Outstanding")}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <EmptyState title={t("No invoices yet")} />}
            </>
          )}

          {!loading && active === "messages" && (
            <div className="panel">
              <div className="panel-title sp-flex"><MessageSquare size={16} /> {t("Class Messages")} <span className="course-code" style={{ marginLeft: 4 }}>CS101</span></div>
              <div style={{ maxHeight: 420, overflow: "auto", border: "1px solid #ECE6DC", borderRadius: 12, padding: 16, marginBottom: 16, background: "#FAF8F4" }}>
                {messages.map(m => (
                  <div key={m.id} style={{ display: "flex", justifyContent: m.mine ? "flex-end" : "flex-start", marginBottom: 12 }}>
                    <div style={{
                      maxWidth: "75%", padding: "10px 14px", borderRadius: 12,
                      background: m.mine ? "#3E5EDB" : "#fff", color: m.mine ? "#fff" : "#1F2430",
                      border: m.mine ? "none" : "1px solid #E5E7EB", fontSize: 13.5, lineHeight: 1.5,
                    }}>
                      {!m.mine && <div style={{ fontSize: 11, fontWeight: 700, color: "#3E5EDB", marginBottom: 2 }}>{m.from}</div>}
                      <div>{t(m.text)}</div>
                      <div style={{ fontSize: 10.5, marginTop: 4, opacity: 0.7 }}>{m.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") sendChat(); }}
                  placeholder={t("Type a message...")}
                  style={{ flex: 1, padding: "11px 14px", border: "1.5px solid #E5E7EB", borderRadius: 10, fontSize: 13.5, outline: "none", background: "#FBFBF9", color: "#1F2430" }}
                />
                <button className="add-btn" onClick={sendChat} disabled={sendingChat || !chatInput.trim()}>
                  {sendingChat ? <Loader2 size={15} className="sp-spin" /> : <Send size={15} />} {t("Send")}
                </button>
              </div>
            </div>
          )}

          {!loading && active === "profile" && (
            <>
              <div className="content-row">
                <div className="date-label">{today}</div>
              </div>
              <StudentIdCard
                fallback={{
                  id: studentId,
                  fullName: displayName,
                  username: displayName,
                  email: profile.email || user.email,
                  phone: profile.phone,
                  major: profile.major,
                  year: profile.year,
                  address: profile.address,
                  photoUrl: profile.photoUrl,
                }}
              />
            </>
          )}
        </div>
      </div>

      {payOpen && (
        <div className="sp-overlay">
          <div className="sp-modal">
            <div className="sp-modal-head">
              <div className="sp-modal-title">{t("Pay for Your Class")}</div>
              <button className="sp-close" onClick={() => setPayOpen(false)} aria-label={t("Close")}><X size={16} /></button>
            </div>
            {classStatus ? (
              <>
                <div className="prof-status">
                  <div className="prof-row"><span>{t("Class")}</span><strong>{t(classStatus.classLabel || `${classStatus.year} ${classStatus.semester}`) || "-"}</strong></div>
                  <div className="prof-row"><span>{t("Next Semester")}</span><strong>{t(classStatus.nextLabel || (classStatus.passed ? "Semester 2, Year 1" : `${classStatus.year || "Year 1"}, ${classStatus.semester || "Semester 1"}`))}</strong></div>
                  <div className="prof-row"><span>{t("Exam Result")}</span><strong><span className="grade-pill" style={{ background: classStatus.passed ? "#2E9E6C" : "#D2483C" }}>{classStatus.passed ? t("PASS") : t("FAIL")}</span></strong></div>
                  <div className="prof-row"><span>{t("Amount to Pay")}</span><strong style={{ color: "#182644" }}>${Number(classStatus.price || classStatus.amount || 0).toFixed(2)}</strong></div>
                </div>
                {!classStatus.joined && !classStatus.paid && (
                  <p className="hint" style={{ marginTop: 12 }}>
                    {t("After payment, your unique class join key for the next semester will be unlocked.")}
                  </p>
                )}
                <div className="sp-modal-foot">
                  <button type="button" className="sp-cancel" onClick={() => setPayOpen(false)}>{t("Cancel")}</button>
                  <button type="button" className="sp-primary" disabled={paying || classStatus.joined || classStatus.paid} onClick={confirmPay}>
                    {paying ? <Loader2 size={15} className="sp-spin" /> : <CreditCard size={15} />}
                    {classStatus.joined || classStatus.paid ? t("Already Paid") : paying ? t("Processing...") : t("Confirm & Pay")}
                  </button>
                </div>
              </>
            ) : (
              <p className="date-label">{t("Class status is not available. Try again later.")}</p>
            )}
          </div>
        </div>
      )}

      {joinOpen && (
        <div className="sp-overlay">
          <div className="sp-modal">
            <div className="sp-modal-head">
              <div className="sp-modal-title">{t("Join Class by ID")}</div>
              <button className="sp-close" onClick={() => setJoinOpen(false)} aria-label={t("Close")}><X size={16} /></button>
            </div>
            <form onSubmit={handleJoinClass}>
              <div className="sp-field">
                <label className="sp-label">{t("Class join key / ID")}</label>
                <input
                  className="sp-input"
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value)}
                  placeholder={t("e.g. S2Y1-XXXX")}
                  required
                />
                <p style={{ fontSize: 12, color: "#9A8F80", marginTop: 6, lineHeight: 1.5 }}>
                  {t("Enter the unique key you received after paying for your class to view its schedule and teacher.")}
                </p>
              </div>
              <div className="sp-modal-foot">
                <button type="button" className="sp-cancel" onClick={() => setJoinOpen(false)}>{t("Cancel")}</button>
                <button type="submit" className="sp-primary" disabled={joining}>
                  {joining ? <Loader2 size={15} className="sp-spin" /> : <BookOpen size={15} />}
                  {joining ? t("Joining...") : t("Join Class")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {submitFor && (
        <div className="sp-overlay">
          <div className="sp-modal">
            <div className="sp-modal-head">
              <div className="sp-modal-title">{t("Submit Assignment")}</div>
              <button className="sp-close" onClick={() => setSubmitFor(null)} aria-label={t("Close")}><X size={16} /></button>
            </div>
            <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 14, lineHeight: 1.6 }}>
              <strong style={{ color: "#182644" }}>{submitFor.title}</strong>
              <div>{t("Course")}: {submitFor.code} · {t("Due")}: {submitFor.due}</div>
            </div>
            <div className="sp-field">
              <label className="sp-label">{t("Submission note (optional)")}</label>
              <textarea
                className="sp-input"
                rows={4}
                value={submitNote}
                onChange={e => setSubmitNote(e.target.value)}
                placeholder={t("Add a note to your submission...")}
                style={{ resize: "vertical", fontFamily: "inherit" }}
              />
            </div>
            <div className="sp-modal-foot">
              <button type="button" className="sp-cancel" onClick={() => setSubmitFor(null)}>{t("Cancel")}</button>
              <button type="button" className="sp-primary" disabled={submitting} onClick={submitAssignment}>
                {submitting ? <Loader2 size={15} className="sp-spin" /> : <Upload size={15} />}
                {submitting ? t("Submitting...") : t("Submit Assignment")}
              </button>
            </div>
          </div>
        </div>
      )}

      {reportOpen && (
        <div className="sp-overlay">
          <div className="sp-modal">
            <div className="sp-modal-head">
              <div className="sp-modal-title">{t("Report a Teacher")}</div>
              <button className="sp-close" onClick={() => setReportOpen(false)} aria-label={t("Close")}><X size={16} /></button>
            </div>
            <div className="sp-field">
              <label className="sp-label">{t("Teacher name")}</label>
              <input
                className="sp-input"
                value={reportTeacher}
                onChange={(e) => setReportTeacher(e.target.value)}
                placeholder={t("Type the teacher's name")}
                required
              />
            </div>
            <div className="sp-field">
              <label className="sp-label">{t("Category")}</label>
              <StyledSelect value={reportCategory} onChange={setReportCategory} width="100%"
                options={["Academic", "Financial", "Facility", "Other"].map(v => ({ value: v, label: v }))} />
            </div>
            <div className="sp-field">
              <label className="sp-label">{t("Description")}</label>
              <textarea
                className="sp-input"
                rows={4}
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder={t("Describe the issue...")}
                style={{ resize: "vertical", fontFamily: "inherit" }}
                required
              />
            </div>
            <div className="sp-modal-foot">
              <button type="button" className="sp-cancel" onClick={() => setReportOpen(false)}>{t("Cancel")}</button>
              <button type="button" className="sp-primary" style={{ background: "#D2483C", boxShadow: "0 6px 16px rgba(210,72,60,0.35)" }} disabled={reportSubmitting} onClick={submitTeacherReport}>
                {reportSubmitting ? <Loader2 size={15} className="sp-spin" /> : <AlertTriangle size={15} />}
                {reportSubmitting ? t("Submitting...") : t("Submit Report")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
