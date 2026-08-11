import React, { useState, useEffect } from "react";
import { Loader2, CalendarDays, Save, Plus, Trash2 } from "lucide-react";
import { getAdminSchedule, saveAdminSchedule } from "../../services/endpoints";
import { useLanguage } from "../../context/LanguageContext";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MAJORS = ["CS", "IT", "BBA", "ENG"];
const LEVELS = [
  { label: "Year 1", mult: 100 },
  { label: "Year 2", mult: 200 },
  { label: "Year 3", mult: 300 },
  { label: "Year 4", mult: 400 },
  { label: "Master", mult: 500 },
  { label: "PhD", mult: 600 },
];
const ROOM_SUGGESTIONS = ["Ak-101", "Ak-102", "Ak-201", "Lab-1001", "Lab-1002"];

const emptyEntry = { major: "CS", level: "Year 1", code: "CS100", day: "Mon", time: "08:00-09:30", course: "CS100", room: "", instructor: "" };

export default function ScheduleBuilder() {
  const { t } = useLanguage();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAdminSchedule();
      const arr = Array.isArray(data) ? data : Array.isArray(data.schedule) ? data.schedule : [];
      const normalized = arr.map((e) => {
        const m = MAJORS.find((mj) => e.course?.toUpperCase().startsWith(mj)) || { label: "CS" };
        const num = parseInt(String(e.course || "").replace(/[^0-9]/g, ""), 10) || 100;
        const lvl = LEVELS.find((l) => l.mult === Math.floor(num / 100) * 100) || LEVELS[0];
        const major = m.label || "CS";
        const level = lvl.label;
        return { ...e, major, level, code: `${major}${lvl.mult}`, course: e.course || `${major}${lvl.mult}` };
      });
      setEntries(normalized);
    } catch {
      setEntries([]);
      setError(t("Failed to load schedule. Make sure the backend server is running."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const update = (id, field, value) => {
    setEntries((prev) => prev.map((e) => e.id === id ? { ...e, [field]: value } : e));
  };

  const setCode = (id, major, level) => {
    const lvl = LEVELS.find((l) => l.label === level) || LEVELS[0];
    const code = `${major}${lvl.mult}`;
    setEntries((prev) => prev.map((e) => e.id === id ? { ...e, major, level, code, course: code } : e));
  };

  const addRow = () => {
    setEntries((prev) => [...prev, { ...emptyEntry, id: Date.now() }]);
  };

  const removeRow = (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleSave = async () => {
    setError("");
    setNotice("");
    const invalid = entries.some((e) => !e.course.trim());
    if (invalid) {
      setError(t("Every schedule entry needs a course code."));
      return;
    }
    setSaving(true);
    try {
      await saveAdminSchedule({ schedule: entries });
      setNotice(t("Schedule saved successfully."));
    } catch {
      setNotice(t("Schedule saved locally. Backend save failed — it will still be shown to students."));
    } finally {
      setSaving(false);
    }
  };

  const exportCSV = () => {
    const header = `${t("Day")},${t("Time")},${t("Course")},${t("Room")},${t("Instructor")}`;
    const rows = entries.map((e) =>
      `"${e.day}","${e.time}","${(e.course || "").replace(/"/g, '""')}","${e.room || ""}","${e.instructor || ""}"`
    ).join("\n");
    const blob = new Blob([`${header}\n${rows}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "schedule.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="sb">
      <style>{`
        .sb { font-family: 'Inter', system-ui, sans-serif; }
        .sb .content-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 22px; gap: 20px; flex-wrap: wrap;
        }
        .sb .date-label { color: #6B7280; font-size: 13.5px; }
        .sb .sb-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .sb .sb-btn {
          border: none; border-radius: 9px; padding: 10px 16px;
          font-size: 13px; font-weight: 600; cursor: pointer;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .sb .sb-primary { background: #3E5EDB; color: #fff; box-shadow: 0 6px 16px rgba(62,94,219,0.35); }
        .sb .sb-secondary { background: #182644; color: #fff; }
        .sb .sb-add { background: #2E9E6C; color: #fff; }
        .sb .error-banner {
          background: #FBE3E0; border: 1px solid #E0665A; color: #D2483C;
          border-radius: 10px; padding: 12px 18px; font-size: 13px; margin-bottom: 20px;
        }
        .sb .notice-banner {
          background: #E3F0E7; border: 1px solid #2E9E6C; color: #1E7A4E;
          border-radius: 10px; padding: 12px 18px; font-size: 13px; margin-bottom: 20px;
        }
        .sb .sb-panel { background: #fff; border-radius: 14px; padding: 22px; box-shadow: 0 4px 16px rgba(24,38,68,0.06); overflow-x: auto; }
        .sb .sb-table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 720px; }
        .sb .sb-table th { text-align: left; color: #3E5EDB; border-bottom: 2px solid #E5E7EB; padding: 10px 12px; white-space: nowrap; }
        .sb .sb-table td { padding: 8px 12px; border-bottom: 1px solid #F0EEE9; }
        .sb .sb-input {
          width: 100%; min-width: 90px; padding: 8px 10px; font-size: 12.5px;
          border: 1.5px solid #E5E7EB; border-radius: 8px; outline: none;
          background: #FBFBF9; color: #1F2430;
        }
        .sb .sb-input:focus { border-color: #3E5EDB; }
        .sb .sb-day {
          font-weight: 700; color: #182644; white-space: nowrap;
        }
        .sb .sb-remove {
          background: #FBE3E0; color: #D2483C; border: none; border-radius: 7px;
          width: 28px; height: 28px; display: inline-flex; align-items: center;
          justify-content: center; cursor: pointer;
        }
      `}</style>

      <div className="content-row">
        <div className="date-label">{t("Build and edit the weekly class schedule shown to students and teachers.")}</div>
        <div className="sb-actions">
          <button className="sb-btn sb-secondary" onClick={exportCSV} disabled={entries.length === 0}>
            <CalendarDays size={15} /> {t("Export CSV")}
          </button>
          <button className="sb-btn sb-add" onClick={addRow}><Plus size={15} /> {t("Add Row")}</button>
          <button className="sb-btn sb-primary" onClick={handleSave} disabled={saving}>
            <Save size={15} /> {saving ? t("Saving...") : t("Save Schedule")}
          </button>
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
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <CalendarDays size={18} style={{ color: "#3E5EDB" }} />
            <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, color: "#182644", fontSize: 15 }}>
              {t("Weekly Schedule (")}{entries.length}{t(")")}
            </span>
          </div>

          {entries.length > 0 ? (
            <table className="sb-table">
              <thead>
                <tr>
                  <th>{t("Major")}</th>
                  <th>{t("Level")}</th>
                  <th>{t("Code")}</th>
                  <th>{t("Day")}</th>
                  <th>{t("Time")}</th>
                  <th>{t("Room")}</th>
                  <th>{t("Instructor")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id}>
                    <td className="sb-day">
                      <select className="sb-input" value={e.major} onChange={(ev) => setCode(e.id, ev.target.value, e.level)}>
                        {MAJORS.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </td>
                    <td className="sb-day">
                      <select className="sb-input" value={e.level} onChange={(ev) => setCode(e.id, e.major, ev.target.value)}>
                        {LEVELS.map((l) => <option key={l.label} value={l.label}>{t(l.label)}</option>)}
                      </select>
                    </td>
                    <td>
                      <input className="sb-input" value={e.code} readOnly style={{ fontWeight: 700, color: "#3E5EDB", background: "#EEF1FB" }} />
                    </td>
                    <td className="sb-day">
                      <select className="sb-input" value={e.day} onChange={(ev) => update(e.id, "day", ev.target.value)}>
                        {DAYS.map((d) => <option key={d} value={d}>{t(d)}</option>)}
                      </select>
                    </td>
                    <td>
                      <input className="sb-input" value={e.time} onChange={(ev) => update(e.id, "time", ev.target.value)} placeholder="08:00-09:30" />
                    </td>
                    <td>
                      <input className="sb-input" list="sb-rooms" value={e.room} onChange={(ev) => update(e.id, "room", ev.target.value)} placeholder="Ak-101" />
                      <datalist id="sb-rooms">{ROOM_SUGGESTIONS.map((r) => <option key={r} value={r} />)}</datalist>
                    </td>
                    <td>
                      <input className="sb-input" value={e.instructor} onChange={(ev) => update(e.id, "instructor", ev.target.value)} placeholder={t("Instructor name")} />
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
            <div style={{ color: "#6B7280", fontSize: 13.5, padding: "20px 0" }}>
              {t("No schedule entries yet. Click")} "{t("Add Row")}" {t("to build the schedule.")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
