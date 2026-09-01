import React, { useState, useEffect, useMemo, useRef } from "react";
import { Loader2, CalendarDays, Save, Plus, Trash2, Sparkles, Blocks, Copy, ChevronDown, KeyRound, Check } from "lucide-react";
import { getAdminSchedule, saveAdminSchedule, deleteAdminScheduleRow, deleteAdminScheduleBlock, getTeacherAccounts } from "../../services/endpoints";
import { useLanguage } from "../../context/LanguageContext";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const YEARS = ["Year 1", "Year 2", "Year 3", "Year 4"];
const SEMESTERS = ["Semester 1", "Semester 2"];
const TIME_SLOTS = ["08:00-09:30", "09:40-11:10", "11:20-12:50", "14:00-15:30", "15:40-17:10", "17:20-18:50"];
const ROOM_SUGGESTIONS = ["Ak-101", "Ak-102", "Ak-201", "Lab-1001", "Lab-1002"];

const MAJORS = [
  { code: "IT", label: "Information Technology" },
  { code: "CS", label: "Computer Science" },
  { code: "BBA", label: "Business Administration" },
  { code: "ENG", label: "Engineering" },
];

const FIELDS = {
  IT: ["Software Development", "Cyber Security", "Cyber Engineer", "Network Engineering", "Data Analytics"],
  CS: ["Software Engineering", "Artificial Intelligence", "Data Science"],
  BBA: ["Marketing", "Finance", "Accounting", "Business Management"],
  ENG: ["Civil Engineering", "Mechanical Engineering", "Electrical Engineering", "Software Engineering"],
};

// Suggested curriculum per field: [yearIndex][semIndex] = [subject names]
const CURRICULUM = {
  "Software Development": [
    [["HTML & CSS", "JavaScript Essentials", "Java Programming", "Introduction to IT"], ["Advanced CSS (Tailwind)", "Java OOP", "SQL & Databases", "Web Design"]],
    [["React & Frontend", "Data Structures", "Python for Developers", "Networking Basics"], ["Spring Boot / Java API", "Git & Agile", "Software Testing", "System Analysis"]],
    [["Full-Stack Project", "Cloud Computing", "DevOps & CI/CD", "UI/UX Design"], ["Mobile App Development", "Software Architecture", "ML & AI Basics", "Professional Ethics"]],
    [["Capstone Project I", "Cybersecurity Basics", "Elective (Advanced Web)", "Portfolio I"], ["Capstone Project II", "System Integration", "Software Project Mgmt", "Career Readiness"]],
  ],
  "Cyber Security": [
    [["Cybersecurity Fundamentals", "Networking Basics", "Linux Essentials", "Python for Security"], ["Cryptography", "Windows Security", "Web Security Basics", "Network Defense"]],
    [["Ethical Hacking", "Digital Forensics", "Incident Response", "Operating Systems"], ["Penetration Testing", "Cloud Security", "SOC Operations", "Scripting & Automation"]],
    [["Malware Analysis", "Red Team Operations", "Secure Software Dev", "Compliance & Audit"], ["Mobile Security", "OT/ICS Security", "Risk Management", "Threat Intelligence"]],
    [["Capstone Security I", "Security Cert Prep (CEH)", "Internship Prep", "Network Defense Lab"], ["Capstone Security II", "Forensics Lab", "Security Governance", "Career Readiness"]],
  ],
  "Cyber Engineer": [
    [["Computer Architecture", "Networking Fundamentals", "Linux Systems", "Python Essentials"], ["Digital Logic Design", "Embedded Systems", "C Programming", "Network Protocols"]],
    [["System Security", "Hardware Security", "Network Defense", "C++ for Systems"], ["Secure System Design", "Cryptography", "Wireless Security", "Virtualization & Containers"]],
    [["Penetration Testing", "Red Team Ops", "IoT Security", "Automation & Scripting"], ["Cloud Security", "DevSecOps", "Sensor Networks", "Regulatory Compliance"]],
    [["Capstone Engineering I", "Security Certification Prep", "Internship", "Secure Architecture"], ["Capstone Engineering II", "Hardware Forensics", "SOC & Blue Team", "Career Readiness"]],
  ],
  "Network Engineering": [
    [["Network Fundamentals", "Linux Basics", "IT Essentials", "Math for Networks"], ["Routing & Switching", "Network Protocols", "Python for Networking", "Cabling & Infrastructure"]],
    [["Advanced Routing", "Wireless & Mobile", "Network Security", "DNS & DHCP"], ["CCNA Prep", "Network Automation", "Server Administration", "Virtualization"]],
    [["Enterprise Networking", "SDN & Cloud Networking", "Monitoring & Tools", "Network Design Lab"], ["WAN Technologies", "VoIP & Collaboration", "Disaster Recovery", "ISP Services"]],
    [["Capstone Network I", "CCNP Prep", "Internship", "Network Optimization"], ["Capstone Network II", "Cloud Network Architect", "Troubleshooting Lab", "Career Readiness"]],
  ],
  "Data Analytics": [
    [["Statistics Essentials", "Excel & BI Tools", "Introduction to Data", "Business Fundamentals"], ["SQL Fundamentals", "Python for Data", "Data Visualization", "Math for Analytics"]],
    [["Advanced SQL", "Pandas & NumPy", "Dashboarding (PowerBI)", "Data Cleaning"], ["Machine Learning Basics", "Statistics for ML", "Data Governance", "Storytelling with Data"]],
    [["Predictive Analytics", "Python ML Libraries", "Big Data Tools", "Data Warehousing"], ["Time Series & Forecasting", "Cloud Analytics", "Data Ethics", "A/B Testing"]],
    [["Capstone Analytics I", "Internship", "Business Intelligence", "Portfolio"], ["Capstone Analytics II", "Advanced ML", "Data Engineering", "Career Readiness"]],
  ],
  "Software Engineering": [
    [["Programming Fundamentals", "HTML & CSS", "Databases", "Discrete Math"], ["Java OOP", "Data Structures", "Web Development", "Software Process"]],
    [["Algorithms", "React & Frontend", "Database Design", "Operating Systems"], ["Spring Boot / API", "Design Patterns", "Testing & QA", "Computer Networks"]],
    [["Full-Stack Development", "Cloud & DevOps", "Software Architecture", "UX Research"], ["Mobile Development", "Distributed Systems", "Machine Learning", "Professional Ethics"]],
    [["Capstone Project I", "Internship", "System Security", "Portfolio"], ["Capstone Project II", "Software Economics", "Enterprise Integration", "Career Readiness"]],
  ],
  "Artificial Intelligence": [
    [["Programming Fundamentals", "Math for AI (Linear Algebra)", "Python Programming", "Intro to AI"], ["Probability & Statistics", "Data Structures", "Python ML Libraries", "Databases"]],
    [["Machine Learning", "Neural Networks", "Data Visualization", "Computer Vision"], ["Deep Learning", "NLP", "Big Data Tools", "MLOps Basics"]],
    [["Reinforcement Learning", "AI Ethics", "Cloud AI Services", "Generative AI"], ["Advanced Deep Learning", "Time Series", "Research Methods", "Parallel Computing"]],
    [["Capstone AI Project I", "Internship", "AI in Production", "Portfolio"], ["Capstone AI Project II", "AI Governance", "Cutting-Edge Seminars", "Career Readiness"]],
  ],
  "Data Science": [
    [["Statistics Essentials", "Python Programming", "Intro to Data Science", "Databases"], ["Data Visualization", "Probability & Statistics", "SQL Advanced", "Linear Algebra"]],
    [["Machine Learning", "Pandas & NumPy", "Data Wrangling", "Big Data Tools"], ["Deep Learning", "Feature Engineering", "Cloud Data Platforms", "MLOps"]],
    [["NLP & Text Mining", "Time Series Forecasting", "PySpark & Hadoop", "Data Ethics"], ["Advanced ML", "Computer Vision", "Recommender Systems", "A/B Testing"]],
    [["Capstone Data Science I", "Internship", "ML Engineering", "Portfolio"], ["Capstone Data Science II", "Data Engineering", "AI Product Design", "Career Readiness"]],
  ],
  Marketing: [
    [["Principles of Marketing", "Business Communication", "Economics I", "Digital Literacy"], ["Consumer Behavior", "Marketing Analytics", "Accounting I", "Branding Basics"]],
    [["Digital Marketing", "Market Research", "Social Media Strategy", "Business Law"], ["SEO & SEM", "Content Marketing", "Sales Management", "Statistics for Business"]],
    [["Marketing Strategy", "E-commerce", "Customer Relationship Mgmt", "Public Relations"], ["Global Marketing", "Data-Driven Marketing", "Campaign Management", "Retail Marketing"]],
    [["Capstone Marketing I", "Internship", "Brand Management", "Portfolio"], ["Capstone Marketing II", "Marketing Leadership", "Digital Transformation", "Career Readiness"]],
  ],
  Finance: [
    [["Principles of Accounting", "Business Math", "Economics I", "Business Communication"], ["Financial Accounting", "Microeconomics", "Excel for Finance", "Business Law"]],
    [["Managerial Accounting", "Corporate Finance", "Statistics for Finance", "Financial Markets"], ["Investments", "Financial Modeling", "Taxation", "Banking Operations"]],
    [["Advanced Corporate Finance", "Risk Management", "Portfolio Theory", "Auditing"], ["Derivatives", "Financial Analysis", "International Finance", "FinTech"]],
    [["Capstone Finance I", "Internship", "Wealth Management", "Portfolio"], ["Capstone Finance II", "Mergers & Acquisitions", "Financial Strategy", "Career Readiness"]],
  ],
  Accounting: [
    [["Principles of Accounting", "Business Math", "Economics I", "Business Communication"], ["Financial Accounting", "Managerial Accounting", "Business Law", "Excel for Accounting"]],
    [["Intermediate Accounting", "Cost Accounting", "Taxation I", "Statistics"], ["Advanced Accounting", "Auditing I", "Financial Reporting", "Accounting Information Systems"]],
    [["Auditing II", "Advanced Taxation", "Government Accounting", "Corporate Law"], ["Forensic Accounting", "International Accounting", "Financial Analysis", "Case Studies"]],
    [["Capstone Accounting I", "Internship", "CPA Prep", "Portfolio"], ["Capstone Accounting II", "Audit Practicum", "Accounting Ethics", "Career Readiness"]],
  ],
  "Business Management": [
    [["Principles of Management", "Business Communication", "Economics I", "Digital Literacy"], ["Organizational Behavior", "Accounting I", "Marketing Basics", "Business Law"]],
    [["Operations Management", "Human Resource Mgmt", "Financial Management", "Statistics for Business"], ["Strategic Management", "Supply Chain Mgmt", "Leadership", "Project Management"]],
    [["Business Ethics", "Entrepreneurship", "International Business", "Data-Driven Decision Making"], ["Change Management", "Negotiation Skills", "Family Business", "Innovation Management"]],
    [["Capstone Business I", "Internship", "Business Plan", "Portfolio"], ["Capstone Business II", "Executive Leadership", "Digital Business", "Career Readiness"]],
  ],
  "Civil Engineering": [
    [["Engineering Math I", "Physics I", "Engineering Drawing", "Intro to Civil Eng"], ["Engineering Math II", "Physics II", "Materials Science", "Programming Basics"]],
    [["Statics & Dynamics", "Surveying", "Structural Analysis I", "Fluid Mechanics"], ["Strength of Materials", "Geotechnical Engineering", "Hydraulics", "Transportation Eng"]],
    [["Reinforced Concrete", "Steel Structures", "Construction Management", "Environmental Eng"], ["Foundation Engineering", "Highway Engineering", "Water Resources", "Earthquake Eng"]],
    [["Capstone Civil I", "Internship", "Project Estimating", "Portfolio"], ["Capstone Civil II", "Engineering Ethics", "Professional Practice", "Career Readiness"]],
  ],
  "Mechanical Engineering": [
    [["Engineering Math I", "Physics I", "Engineering Drawing", "Intro to Mechanical Eng"], ["Engineering Math II", "Physics II", "Materials Science", "Programming Basics"]],
    [["Statics & Dynamics", "Thermodynamics", "Mechanics of Materials", "Manufacturing Processes"], ["Fluid Mechanics, Heat Transfer", "Machine Design", "Dynamics of Machinery", "Instrumentation"]],
    [["Heat Transfer", "Control Systems", "CAD/CAM", "Vibrations"], ["Energy Systems", "Robotics", "Internal Combustion Engines", "Finite Element Analysis"]],
    [["Capstone Mechanical I", "Internship", "Maintenance Management", "Portfolio"], ["Capstone Mechanical II", "Engineering Ethics", "Automotive Engineering", "Career Readiness"]],
  ],
  "Electrical Engineering": [
    [["Engineering Math I", "Physics I", "Engineering Drawing", "Intro to Electrical Eng"], ["Engineering Math II", "Physics II", "Circuit Analysis I", "Programming Basics"]],
    [["Circuit Analysis II", "Electronics I", "Signals & Systems", "Electromagnetics"], ["Electronics II", "Digital Logic", "Electrical Machines", "Control Systems"]],
    [["Power Systems", "Microprocessors", "Embedded Systems", "Renewable Energy"], ["Power Electronics", "Communication Systems", "VLSI Basics", "Instrumentation"]],
    [["Capstone Electrical I", "Internship", "Smart Grid Systems", "Portfolio"], ["Capstone Electrical II", "Engineering Ethics", "Power Distribution Lab", "Career Readiness"]],
  ],
};

const baseCurriculumFor = (field) => CURRICULUM[field] || [
  [["Fundamentals I", "Communication Skills", "Math I", "Field Orientation"], ["Fundamentals II", "Critical Thinking", "Math II", "Computer Skills"]],
  [["Discipline Core I", "Research Methods", "Statistics", "Elective I"], ["Discipline Core II", "Analytical Skills", "Team Project", "Elective II"]],
  [["Advanced Core I", "Applied Project", "Professional Practice", "Elective III"], ["Advanced Core II", "Industry Internship", "Innovation & Design", "Elective IV"]],
  [["Capstone Project I", "Internship", "Portfolio Development", "Seminar"], ["Capstone Project II", "Professional Ethics", "Graduation Lab", "Career Readiness"]],
];

const emptyEntry = (major, field, level, semester) => ({
  id: Date.now() + Math.random(),
  major,
  field,
  level,
  semester,
  subject: "",
  course: "",
  startDay: "Mon",
  endDay: "Mon",
  time: TIME_SLOTS[0],
  room: "",
  teacher: "",
  joinCode: "",
});

const suggestedDay = (index) => DAYS[index % 5];

const StyledSelect = ({ value, onChange, options, placeholder, disabled, openWidth }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (ev) => {
      if (ref.current && !ref.current.contains(ev.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="sb-dd" ref={ref} style={openWidth ? { minWidth: openWidth } : undefined}>
      <button type="button" className={`sb-dd-btn${selected ? "" : " sb-dd-ph"}`}
        disabled={disabled} onClick={() => setOpen((o) => !o)}
        style={openWidth ? { minWidth: openWidth } : undefined}>
        <span className="sb-dd-val">{selected ? selected.label : (placeholder || "Select...")}</span>
        <ChevronDown size={14} style={{ transition: "transform .2s", transform: open ? "rotate(180deg)" : "none" }} />
      </button>
      {open && (
        <div className="sb-dd-menu">
          {options.length ? options.map((o) => (
            <button type="button" key={o.value} className={`sb-dd-item${o.value === value ? " sb-dd-sel" : ""}`}
              onClick={() => { onChange(o.value); setOpen(false); }}>
              <span>{o.label}</span>
              {o.value === value && <Check size={13} />}
            </button>
          )) : (
            <div className="sb-dd-empty">{placeholder || "No options"}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default function ScheduleBuilder() {
  const { t } = useLanguage();
  const [major, setMajor] = useState(() => localStorage.getItem("sb-major") || "IT");
  const [field, setField] = useState(() => localStorage.getItem("sb-field") || "Software Development");
  const [entries, setEntries] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClick = (ev) => {
      if (menuRef.current && !menuRef.current.contains(ev.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const fields = FIELDS[major] || FIELDS.IT;

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [data, teacherData] = await Promise.all([
        getAdminSchedule(),
        getTeacherAccounts().catch(() => []),
      ]);
      const arr = Array.isArray(data) ? data : Array.isArray(data.schedule) ? data.schedule : [];
      const teacherList = Array.isArray(teacherData) ? teacherData : [];
      setTeachers(teacherList);
      const normalized = arr.map((e, i) => ({
        id: e.id ?? i,
        major: e.major || "IT",
        field: e.field || "Software Development",
        level: e.level || "Year 1",
        semester: e.semester || "Semester 1",
        subject: e.subject || e.course || "",
        course: e.course || e.subject || "",
        startDay: e.startDay || "Mon",
        endDay: e.endDay || "Mon",
        time: e.time || TIME_SLOTS[0],
        room: e.room || "",
        teacher: e.teacher || e.instructor || "",
        joinCode: e.joinCode || "",
      }));
      setEntries(normalized);
    } catch {
      setEntries([]);
      setError(t("Failed to load schedule. Make sure the backend server is running."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Keep the field valid when the major changes
  useEffect(() => {
    if (!fields.includes(field)) setField(fields[0]);
  }, [major]);

  useEffect(() => {
    localStorage.setItem("sb-major", major);
    localStorage.setItem("sb-field", field);
  }, [major, field]);

  // Visible entries = the selected major+field only
  const visible = useMemo(
    () => entries.filter((e) => e.major === major && e.field === field),
    [entries, major, field]
  );

  const visibleFor = (level, semester) =>
    visible.filter((e) => e.level === level && e.semester === semester);

  const update = (id, prop, value) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, [prop]: value } : e)));
  };

  const addRow = (level, semester) => {
    setEntries((prev) => [...prev, emptyEntry(major, field, level, semester)]);
  };

  const removeRow = (id) => {
    setConfirm({ type: "remove-row", rowId: id });
  };

  const runConfirm = async () => {
    if (!confirm) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      if (confirm.type === "save-block") {
        const rows = visibleFor(confirm.level, confirm.semester);
        if (rows.some((e) => !String(e.subject || "").trim())) {
          setError(t("Every subject needs a name. Fill or remove the empty rows in this block."));
          setConfirm(null);
          return;
        }
        const saved = await saveAdminSchedule({
          schedule: toPayload(rows),
          major, field, level: confirm.level, semester: confirm.semester,
        });
        applySaved(saved);
        setNotice(t("Saved") + ` ${t(confirm.level) || confirm.level}, ${t(confirm.semester) || confirm.semester} ${t("join codes generated and sent to the teachers.")}`);
      } else if (confirm.type === "save-schedule") {
        if (visible.some((e) => !String(e.subject || "").trim())) {
          setError(t("Every subject needs a name. Fill or remove the empty rows."));
          setConfirm(null);
          return;
        }
        const saved = await saveAdminSchedule({ schedule: toPayload(visible) });
        applySaved(saved);
        setNotice(t("Schedule table saved successfully. Join codes generated and sent."));
      } else if (confirm.type === "remove-row") {
        const id = confirm.rowId;
        setEntries((prev) => prev.filter((e) => e.id !== id));
        if (Number.isInteger(id) && id > 0) {
          await deleteAdminScheduleRow(id);
        }
        setNotice(t("Subject row removed."));
      }
    } catch {
      setNotice(t("Backend error, changes kept locally."));
    } finally {
      setSaving(false);
      setConfirm(null);
    }
  };

  const generateCurriculum = () => {
    const plan = baseCurriculumFor(field);
    setEntries((prev) => {
      const keep = prev.filter((e) => e.major !== major || e.field !== field);
      const rows = [];
      plan.forEach((sems, yi) => {
        sems.forEach((subjects, si) => {
          const level = YEARS[yi];
          const semester = SEMESTERS[si];
          subjects.forEach((subject, i) => {
            const day = suggestedDay(i + yi * 2 + si);
            const teacherSame = prev.find(
              (e) => e.major === major && e.field === field && e.level === level && e.semester === semester && e.subject === subject
            );
            rows.push({
              id: Date.now() + Math.random(),
              major,
              field,
              level,
              semester,
              subject,
              course: subject,
              startDay: day,
              endDay: day,
              time: TIME_SLOTS[i % TIME_SLOTS.length] || TIME_SLOTS[0],
              room: "",
              teacher: teacherSame?.teacher || "",
            });
          });
        });
      });
      return [...keep, ...rows];
    });
  };

  const toPayload = (rows) =>
    rows.map((e) => ({
      id: e.id,
      major: e.major,
      field: e.field,
      level: e.level,
      semester: e.semester,
      subject: e.subject.trim(),
      course: (e.course || "").trim() || e.subject.trim(),
      startDay: e.startDay,
      endDay: e.endDay,
      day: e.startDay === e.endDay ? e.startDay : `${e.startDay}-${e.endDay}`,
      time: e.time,
      room: e.room || "",
      teacher: e.teacher,
      joinCode: e.joinCode || "",
      instructor: teachers.find((tt) => tt.email === e.teacher)?.username || e.teacher,
    }));

  const applySaved = (rows) => {
    const arr = Array.isArray(rows) ? rows : Array.isArray(rows?.schedule) ? rows.schedule : [];
    if (!arr.length) return;
    setEntries((prev) => prev.map((e) => {
      const byId = arr.find((sv) => typeof sv.id !== "undefined"
        && Number.isInteger(Number(sv.id)) && Number(sv.id) > 0
        && Number.isInteger(Number(e.id)) && Number(sv.id) === Number(e.id));
      const saved = byId || arr.find((sv) =>
        String(sv.course) === (e.course || e.subject)
        && sv.level === e.level && sv.semester === e.semester
        && sv.major === e.major && sv.field === e.field);
      if (!saved) return e;
      const dbId = Number.isInteger(Number(saved.id)) ? Number(saved.id) : e.id;
      return { ...e, id: dbId, joinCode: saved.joinCode || "" };
    }));
  };

  const saveBlock = (level, semester) => {
    setError("");
    setNotice("");
    const rows = visibleFor(level, semester);
    if (rows.some((e) => !String(e.subject || "").trim())) {
      setError(t("Every subject needs a name. Fill or remove the empty rows in this block."));
      return;
    }
    setConfirm({ type: "save-block", level, semester });
  };

  const handleSave = () => {
    setError("");
    setNotice("");
    if (visible.some((e) => !String(e.subject || "").trim())) {
      setError(t("Every subject needs a name. Fill or remove the empty rows."));
      return;
    }
    setConfirm({ type: "save-schedule" });
  };

  const exportCSV = () => {
    const header = `${t("Major")},${t("Field")},${t("Year")},${t("Semester")},${t("Subject")},${t("Day")},${t("Time")},${t("Room")},${t("Teacher")}`;
    const q = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = visible.map((e) => {
      const teacherName = teachers.find((tt) => tt.email === e.teacher)?.username || e.teacher || "";
      return [q(major), q(field), q(e.level), q(e.semester), q(e.subject), q(e.startDay === e.endDay ? e.startDay : `${e.startDay}-${e.endDay}`), q(e.time), q(e.room), q(teacherName)].join(",");
    }).join("\n");
    const blob = new Blob([`${header}\n${rows}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "schedule-table.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="sb">
      <style>{`
        .sb { font-family: 'Inter', system-ui, sans-serif; }
        .sb .content-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; gap: 20px; flex-wrap: wrap; }
        .sb .date-label { color: #6B7280; font-size: 13.5px; }
        .sb .sb-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .sb .sb-btn { border: none; border-radius: 9px; padding: 10px 16px; font-size: 13px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; }
        .sb .sb-primary { background: #3E5EDB; color: #fff; box-shadow: 0 6px 16px rgba(62,94,219,0.35); }
        .sb .sb-secondary { background: #182644; color: #fff; }
        .sb .sb-add { background: #2E9E6C; color: #fff; }
        .sb .sb-spark { background: linear-gradient(135deg,#7C3AED,#3E5EDB); color: #fff; box-shadow: 0 6px 16px rgba(124,58,237,0.35); }
        .sb .error-banner { background: #FBE3E0; border: 1px solid #E0665A; color: #D2483C; border-radius: 10px; padding: 12px 18px; font-size: 13px; margin-bottom: 20px; }
        .sb .notice-banner { background: #E3F0E7; border: 1px solid #2E9E6C; color: #1E7A4E; border-radius: 10px; padding: 12px 18px; font-size: 13px; margin-bottom: 20px; }
        .sb .sb-panel { background: #fff; border-radius: 14px; padding: 22px; box-shadow: 0 4px 16px rgba(24,38,68,0.06); }
        .sb .sb-filters { display: flex; gap: 14px; flex-wrap: wrap; align-items: flex-end; background: #F6F7FC; border: 1px solid #E8EAF5; border-radius: 12px; padding: 16px 18px; margin-bottom: 18px; }
        .sb .sb-filter { display: flex; flex-direction: column; gap: 6px; }
        .sb .sb-filter label { font-size: 11.5px; font-weight: 700; letter-spacing: .4px; color: #6B7280; text-transform: uppercase; }
        .sb .sb-select { min-width: 210px; padding: 9px 12px; font-size: 13px; border: none; background: none; color: inherit; outline: none; appearance: auto; }
        .sb .sb-select:focus { border-color: #3E5EDB; }
        .sb .sb-dd { position: relative; display: inline-block; }
        .sb .sb-dd-btn { display: inline-flex; align-items: center; justify-content: space-between; gap: 8px; min-width: 210px; padding: 9px 12px; font-size: 13px; background: #fff; color: #1F2430; border: 1.5px solid #E5E7EB; border-radius: 8px; cursor: pointer; text-align: left; font-weight: 500; }
        .sb .sb-dd .sb-dd-val { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .sb .sb-dd-btn:hover { border-color: #B9CBF8; }
        .sb .sb-dd-ph { color: #9AA3B2; }
        .sb .sb-dd-menu { position: absolute; top: calc(100% + 6px); left: 0; z-index: 60; min-width: 100%; max-height: 300px; overflow: auto; background: #fff; border: 1px solid #E9EBF3; border-radius: 10px; box-shadow: 0 12px 32px rgba(24,38,68,0.16); padding: 6px; animation: sbPop .14s ease; }
        .sb .sb-dd-item { display: flex; align-items: center; justify-content: space-between; gap: 10px; width: 100%; padding: 9px 12px; font-size: 13px; color: #1F2430; background: none; border: none; border-radius: 7px; cursor: pointer; text-align: left; }
        .sb .sb-dd-item:hover { background: #F0F3FF; color: #3E5EDB; }
        .sb .sb-dd-sel { background: #F0F3FF; color: #3E5EDB; font-weight: 600; }
        .sb .sb-dd-item.sb-dd-sel:hover { background: #E6EDFF; color: #2E4FC4; }
        .sb .sb-dd-empty { padding: 10px 12px; font-size: 13px; color: #9AA3B2; }
        .sb .sb-dd-btn:disabled { opacity: .55; cursor: not-allowed; }
        .sb .sb-note { flex: 1 1 100%; font-size: 12.5px; color: #6B7280; background: #EEF1FB; border-radius: 8px; padding: 10px 12px; margin-top: 4px; }
        .sb .sb-note b { color: #3E5EDB; }
        .sb .sb-table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 860px; }
        .sb .sb-table th { text-align: left; color: #3E5EDB; border-bottom: 2px solid #E5E7EB; padding: 10px 12px; white-space: nowrap; font-size: 12px; }
        .sb .sb-table td { padding: 8px 12px; border-bottom: 1px solid #F0EEE9; }
        .sb .sb-input { width: 100%; min-width: 90px; padding: 8px 10px; font-size: 12.5px; border: 1.5px solid #E5E7EB; border-radius: 8px; outline: none; background: #FBFBF9; color: #1F2430; }
        .sb .sb-input:focus { border-color: #3E5EDB; }
        .sb select.sb-input { width: auto; border: none; background: none; color: inherit; font: inherit; padding: 0; appearance: auto; box-shadow: none; }
        .sb select.sb-input option, .sb .sb-select option { background: #fff; color: #1F2430; font-size: 13px; padding: 8px 10px; }
        .sb select.sb-input option:hover, .sb .sb-select option:hover { background: #F0F3FF; color: #3E5EDB; }
        .sb select.sb-input option:checked, .sb .sb-select option:checked { background: #3E5EDB; color: #fff; }
        .sb select.sb-select:focus { outline: none; }
        .sb .sb-remove { background: #FBE3E0; color: #D2483C; border: none; border-radius: 7px; width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; }
        .sb .sb-block { border: 1px solid #E9EBF3; border-radius: 12px; margin-bottom: 16px; overflow: visible; }
        .sb .sb-block-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 12px 16px; background: linear-gradient(90deg,#F0F3FF,#FBFBFF); border-bottom: 1px solid #E9EBF3; cursor: pointer; user-select: none; border-radius: 12px 12px 0 0; }
        .sb .sb-block-title { font-family: 'Poppins',sans-serif; font-weight: 600; color: #182644; font-size: 13.5px; display: flex; align-items: center; gap: 10px; }
        .sb .sb-block-title .pill { font-size: 11px; font-weight: 700; background: #3E5EDB; color: #fff; border-radius: 999px; padding: 3px 10px; }
        .sb .sb-block-title .chev { color: #9AA3B2; transition: transform .2s; }
        .sb .sb-block-title .chev.open { transform: rotate(90deg); }
        .sb .sb-block-add { background: #fff; border: 1.5px dashed #C9CEE0; color: #3E5EDB; border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; }
        .sb .sb-block-add:hover { border-color: #3E5EDB; background: #EEF1FB; }
        .sb .sb-block-save { background: #2E9E6C; border: none; color: #fff; border-radius: 8px; padding: 7px 14px; font-size: 12px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(46,158,108,0.3); }
        .sb .sb-block-save:hover { background: #27875C; }
        .sb .sb-block-save:disabled { opacity: .6; cursor: not-allowed; }
        .sb .sb-empty { color: #9AA3B2; font-size: 12.5px; padding: 14px 16px; }
        .sb .sb-subject-cell { font-weight: 600; color: #182644; white-space: nowrap; }
        .sb .sb-day-chip { border: none; background: none; padding: 0; color: inherit; font: inherit; white-space: nowrap; }
        .sb .sb-codes { display: flex; flex-wrap: wrap; gap: 8px; padding: 10px 16px; background: #FBFBFE; border-bottom: 1px solid #F0EEE9; align-items: center; }
        .sb .sb-codes-label { font-size: 11.5px; font-weight: 700; color: #6B7280; text-transform: uppercase; letter-spacing: .4px; }
        .sb .sb-code-chip { background: #EAF7F0; border: 1px solid #BCE5CF; color: #1E7A4E; border-radius: 7px; padding: 4px 8px; font-size: 12px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; }
        .sb .sb-code-input { width: 6em; border: none; background: transparent; color: inherit; font: inherit; font-weight: 700; padding: 0; outline: none; user-select: text; -webkit-user-select: text; }
        .sb .sb-code-copy { background: none; border: none; color: #1E7A4E; cursor: pointer; display: inline-flex; align-items: center; padding: 0; }
        .sb .sb-code-hint { color: #9AA3B2; font-size: 12px; font-style: italic; }
        .sb .sb-codes-inline { display: inline-flex; align-items: center; gap: 6px; }
        .sb .sb-join { display: inline-flex; align-items: center; gap: 8px; border: 1px solid #E9EBF3; border-radius: 9px; padding: 6px 12px; background: #fff; }
        .sb .sb-join-label { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; letter-spacing: .5px; color: #3E5EDB; text-transform: uppercase; }
        .sb .sb-join .sb-code-hint { color: #9AA3B2; font-size: 12px; font-style: italic; }
.sb .sb-dropdown { position: relative; }
        .sb .sb-menu { position: absolute; top: calc(100% + 8px); right: 0; background: #fff; border: 1px solid #E9EBF3; border-radius: 12px; box-shadow: 0 12px 32px rgba(24,38,68,0.18); padding: 8px; width: 280px; z-index: 20; animation: sbPop .16s ease; }
        .sb .sb-menu-label { font-size: 11px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; color: #9AA3B2; padding: 6px 10px 4px; }
        .sb .sb-menu-list { display: flex; flex-direction: column; padding: 2px 4px 6px; }
        .sb .sb-menu-link { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 9px 10px; font-size: 13px; color: #1F2430; text-decoration: none; cursor: pointer; border-bottom: 1px solid #EDEFF6; }
        .sb .sb-menu-link:last-child { border-bottom: none; }
        .sb .sb-menu-link:hover { background: #F0F3FF; color: #3E5EDB; }
        .sb .sb-mc-count { color: #9AA3B2; font-size: 12px; font-weight: 700; }
        .sb .sb-menu-link:hover .sb-mc-count { color: #3E5EDB; }
        .sb .sb-menu-item { width: 100%; display: flex; align-items: center; gap: 10px; background: none; border: none; border-radius: 8px; padding: 10px 14px; font-size: 13px; font-weight: 600; color: #1F2430; cursor: pointer; text-align: left; }
        .sb .sb-menu-item:hover { background: #F0F3FF; color: #3E5EDB; }
        .sb .sb-menu-item:disabled { opacity: .45; cursor: not-allowed; }
        .sb .sb-menu-item svg { color: #3E5EDB; }
        .sb .sb-menu-save svg { color: #2E9E6C; }
        .sb .sb-menu-save { color: #1E7A4E; }
        .sb .sb-menu-sep { height: 1px; background: #F0EEE9; margin: 6px 4px; }
        .sb .sb-confirm-overlay { position: fixed; inset: 0; background: rgba(24,38,68,0.4); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; animation: sbFade .18s ease; }
        .sb .sb-confirm-card { background: #fff; border-radius: 16px; padding: 26px 28px; width: min(90vw, 420px); text-align: center; box-shadow: 0 20px 48px rgba(24,38,68,0.28); animation: sbPop .16s ease; }
        .sb .sb-confirm-icon { width: 58px; height: 58px; border-radius: 50%; margin: 0 auto 14px; display: flex; align-items: center; justify-content: center; }
        .sb .sb-confirm-title { font-family: 'Poppins',sans-serif; font-weight: 600; font-size: 16px; color: #182644; }
        .sb .sb-confirm-msg { font-size: 13.5px; color: #6B7280; margin: 10px 0 0; line-height: 1.6; }
        .sb .sb-confirm-foot { display: flex; gap: 12px; margin-top: 24px; }
        .sb .sb-confirm-cancel { flex: 1; background: #F0F1F5; border: none; color: #4A4F5C; border-radius: 9px; padding: 11px 14px; font-size: 13px; font-weight: 600; cursor: pointer; }
        .sb .sb-confirm-cancel:hover { background: #E6E8EE; }
        .sb .sb-confirm-cancel:disabled { opacity: .5; cursor: not-allowed; }
        .sb .sb-confirm-ok { flex: 1; border: none; border-radius: 9px; padding: 11px 14px; font-size: 13px; font-weight: 700; color: #fff; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 7px; }
        .sb .sb-confirm-ok.save { background: #2E9E6C; box-shadow: 0 4px 12px rgba(46,158,108,0.3); }
        .sb .sb-confirm-ok.save:hover { background: #27875C; }
        .sb .sb-confirm-ok.danger { background: #D2483C; box-shadow: 0 4px 12px rgba(210,72,60,0.3); }
        .sb .sb-confirm-ok.danger:hover { background: #BC3D32; }
        .sb .sb-confirm-ok:disabled { opacity: .5; cursor: not-allowed; }
        @keyframes sbPop { from { opacity: 0; transform: translateY(-6px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes sbFade { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      <div className="content-row">
        <div className="date-label">{t("Schedule table")} {t("design what each year & semester studies, which days, and which teacher teaches which subject.")}</div>
        <div className="sb-actions">
          <div className="sb-dropdown" ref={menuRef}>
            <button className="sb-btn sb-primary" onClick={() => setMenuOpen((o) => !o)}>
              <Blocks size={15} /> {t("Actions")} <ChevronDown size={14} style={{ marginLeft: 2, transform: menuOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
            </button>
            {menuOpen && (
              <div className="sb-menu">
                <div className="sb-menu-label">{t("Jump to")}</div>
                <div className="sb-menu-list">
                  {YEARS.map((year, yi) => (
                    SEMESTERS.map((sem, si) => (
                      <a key={`${year}-${sem}`} className="sb-menu-link"
                        onClick={(ev) => {
                          ev.preventDefault();
                          setMenuOpen(false);
                          document.getElementById(`sb-block-${year}-${sem}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        href={`#sb-block-${year}-${sem}`}>
                        <span>{t(year) || year} · {t(sem) || sem}</span>
                        <span className="sb-mc-count">{visibleFor(year, sem).length}</span>
                      </a>
                    ))
                  ))}
                </div>
                <div className="sb-menu-sep" />
                <div className="sb-menu-label">{t("Actions")}</div>
                <button className="sb-menu-item" onClick={() => { setMenuOpen(false); exportCSV(); }} disabled={visible.length === 0}>
                  <CalendarDays size={15} /> {t("Export CSV")}
                </button>
                <button className="sb-menu-item" onClick={() => { setMenuOpen(false); generateCurriculum(); }}>
                  <Sparkles size={15} /> {t("Generate Curriculum")}
                </button>
                <div className="sb-menu-sep" />
                <button className="sb-menu-item sb-menu-save" onClick={handleSave} disabled={saving}>
                  <Save size={15} /> {saving ? t("Saving...") : t("Save Schedule")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {notice && <div className="notice-banner">{notice}</div>}

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
          <Loader2 size={30} className="animate-spin" style={{ color: "#3E5EDB" }} />
        </div>
      ) : (
        <div className="sb-panel">
          <div className="sb-filters">
            <div className="sb-filter">
              <label>{t("Major")}</label>
              <StyledSelect value={major} onChange={setMajor}
                  options={MAJORS.map((m) => ({ value: m.code, label: `${m.code} ${t(m.label)}` }))} />
            </div>
            <div className="sb-filter">
              <label>{t("Field / Specialization")}</label>
              <StyledSelect value={field} onChange={setField} disabled={!major}
                  options={fields.map((f) => ({ value: f, label: t(f) }))} />
            </div>
            <div className="sb-note">
              <Blocks size={14} style={{ verticalAlign: "-2px", marginRight: 6, color: "#3E5EDB" }} />
              <b>{field}</b> ({major}) {t("Program covers")} <b>{t("Year 1, Semester 1")}</b> {t("through")} <b>{t("Year 4, Semester 2")}</b>. {t("Pick a subject, assign the day(s) it is taught, and the teacher (by email).")}
            </div>
          </div>

          {YEARS.map((year, yi) => (
            SEMESTERS.map((sem, si) => {
              const rows = visibleFor(year, sem);
              return (
                <div className="sb-block" id={`sb-block-${year}-${sem}`} key={`${year}-${sem}`}>
                  <div className="sb-block-head">
                    <span className="sb-block-title">
                      <span className="chev">{'>'}</span>
                      {t("Note:")} <span className="pill">{t(year) || year}</span>
                      <span className="pill" style={{ background: "#182644" }}>{t(sem) || sem}</span>
                      <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>{rows.length} {t("subject(s)")}</span>
                    </span>
                    <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span className="sb-join">
                        <span className="sb-join-label"><KeyRound size={12} /> {t("JOIN class")}</span>
                        {Array.from(new Set(rows.map((e) => e.joinCode).filter(Boolean))).length ? (
                          <span className="sb-codes-inline">
                            {Array.from(new Set(rows.map((e) => e.joinCode).filter(Boolean))).map((code) => (
                              <span className="sb-code-chip" key={`code-${code}`}>
                                <input className="sb-code-input" readOnly value={code}
                                  title={t("Select to copy")} onFocus={(ev) => ev.target.select()} />
                                <button className="sb-code-copy" title={t("Copy")} onClick={() => {
                                  navigator.clipboard?.writeText(code);
                                }}>
                                  <Copy size={12} />
                                </button>
                              </span>
                            ))}
                          </span>
                        ) : (
                          <span className="sb-code-hint">{t("after Save")}</span>
                        )}
                      </span>
                      <button className="sb-block-save" onClick={() => saveBlock(year, sem)} disabled={saving}
                        title={`${t("Save")} ${t(year)}, ${t(sem)}`}>
                        <Save size={13} /> {saving ? t("Saving...") : t("Save")}
                      </button>
                      <button className="sb-block-add" onClick={() => addRow(year, sem)}><Plus size={14} /> {t("Add Subject")}</button>
                    </span>
                  </div>
                  {rows.length ? (
                      <table className="sb-table">
                        <thead>
                          <tr>
                            <th>{t("Subject")}</th>
                            <th>{t("Day")}</th>
                            <th>{t("Time")}</th>
                            <th>{t("Room")}</th>
                            <th>{t("Teacher")}</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((e) => (
                            <tr key={e.id}>
                              <td className="sb-subject-cell">
                                <input className="sb-input" style={{ fontWeight: 600 }} value={e.subject}
                                  onChange={(ev) => update(e.id, "subject", ev.target.value)}
                                  placeholder={t("e.g. HTML & CSS, Java...")} />
                              </td>
                              <td>
                                <StyledSelect value={e.startDay} openWidth="76px"
                                  onChange={(v) => {
                                    update(e.id, "startDay", v);
                                    update(e.id, "endDay", v);
                                  }}
                                  options={DAYS.map((d) => ({ value: d, label: t(d) }))} />
                              </td>
                              <td>
                                <StyledSelect value={e.time} openWidth="120px"
                                  onChange={(v) => update(e.id, "time", v)}
                                  options={TIME_SLOTS.map((ts) => ({ value: ts, label: ts }))} />
                              </td>
                              <td>
                                <input className="sb-input" list="sb-rooms" value={e.room} onChange={(ev) => update(e.id, "room", ev.target.value)} placeholder="Ak-101" />
                                <datalist id="sb-rooms">{ROOM_SUGGESTIONS.map((r) => <option key={r} value={r} />)}</datalist>
                              </td>
                              <td>
                                <StyledSelect value={e.teacher} openWidth="220px"
                                  onChange={(v) => update(e.id, "teacher", v)}
                                  placeholder={t("Select teacher by email...")}
                                  options={teachers.map((tch) => ({ value: tch.email, label: `${tch.username} (${tch.email})` }))} />
                              </td>
                              <td>
                                <button className="sb-remove" onClick={() => removeRow(e.id)} aria-label={t("Remove")}>
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="sb-empty">{t("No subjects yet. Click")} "{t("Add Subject")}" {t("or")} "{t("Generate Curriculum")}".</div>
                    )}
                  </div>
              );
            })
          ))}

          {visible.length === 0 && (
            <div style={{ display: "flex", justifyContent: "center", padding: "26px 0 6px" }}>
              <button className="sb-btn sb-spark" onClick={generateCurriculum}>
                <Sparkles size={15} /> {t("Generate Suggested Curriculum for")} {field}
              </button>
            </div>
          )}
        </div>
      )}

      {confirm && (() => {
        const isSave = confirm.type === "save-block" || confirm.type === "save-schedule";
        const isBlockSave = confirm.type === "save-block";
        const iconBg = isSave ? { background: "#E3F0E7", color: "#1E7A4E" } : { background: "#FBE3E0", color: "#D2483C" };
        return (
          <div className="sb-confirm-overlay">
            <div className="sb-confirm-card">
              <div className="sb-confirm-icon" style={iconBg}>
                {isSave ? <Save size={26} /> : <Trash2 size={26} />}
              </div>
              <div className="sb-confirm-title">
                {isBlockSave
                  ? `${t("Save")} ${t(confirm.level) || confirm.level}, ${t(confirm.semester) || confirm.semester}?`
                  : isSave ? t("Save schedule?")
                  : t("Delete subject?")}
              </div>
              <p className="sb-confirm-msg">
                {isSave
                  ? t("Join codes will be generated and sent to the assigned teachers. Existing rows in this block will be updated.")
                  : t("The subject row will be hidden from the schedule. It stays in the database and can be restored later.")}
              </p>
              <div className="sb-confirm-foot">
                <button type="button" className="sb-confirm-cancel" onClick={() => setConfirm(null)} disabled={saving}>
                  {t("Cancel")}
                </button>
                <button type="button" className={"sb-confirm-ok " + (isSave ? "save" : "danger")} onClick={runConfirm} disabled={saving}>
                  {saving ? <Loader2 size={14} className="animate-spin" /> : isSave ? <Save size={14} /> : <Trash2 size={14} />}
                  {saving ? t("Please wait...") : isSave ? t("Confirm Save") : t("Confirm Delete")}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}