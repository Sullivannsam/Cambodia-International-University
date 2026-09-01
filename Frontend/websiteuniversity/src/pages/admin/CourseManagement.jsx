import React, { useState, useEffect } from "react";
import {
  Search, Loader2, Pencil, Trash2, X, Plus, BookOpen, Star, Power
} from "lucide-react";
import { getCourses, createCourse, updateCourse, deleteCourse } from "../../services/endpoints";
import { useLanguage } from "../../context/LanguageContext";

const emptyForm = () => ({
  code: "",
  title: "",
  credits: 0,
  instructor: "",
  description: "",
  active: true,
  featured: false,
});

export default function CourseManagement() {
  const { t } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null); // { mode: "add" } | { mode: "edit", course }
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getCourses();
      setCourses(Array.isArray(data) ? data : Array.isArray(data.courses) ? data.courses : []);
    } catch {
      setError(t("Failed to load courses. Make sure the backend server is running."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm(emptyForm());
    setError("");
    setModal({ mode: "add" });
  };

  const openEdit = (c) => {
    setForm({
      code: c.code || c.courseCode || "",
      title: c.title || c.courseName || c.name || "",
      credits: Number(c.credits ?? c.credit ?? 0),
      instructor: c.instructor || c.teacher || "",
      description: c.description || "",
      active: c.active === false ? false : c.status === "INACTIVE" ? false : true,
      featured: !!c.featured || c.featured === true,
    });
    setError("");
    setModal({ mode: "edit", course: c });
  };

  const closeModal = () => {
    setModal(null);
    setError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.code.trim() || !form.title.trim()) {
      setError(t("Course code and title are required."));
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (modal.mode === "add") {
        await createCourse(form);
        setNotice(`${t("Course")} "${form.code}" ${t("created successfully.")}`);
      } else {
        await updateCourse(modal.course.id, form);
        setNotice(`${t("Course")} "${form.code}" ${t("updated successfully.")}`);
      }
      closeModal();
      load();
    } catch {
      setError(modal.mode === "add"
        ? t("Failed to create course. Please try again.")
        : t("Failed to update course. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  const requestDelete = (c) => setConfirm({ course: c });

  const toggleActive = async (c) => {
    const nextActive = c.active === false ? true : false;
    setCourses((prev) => prev.map((x) => x.id === c.id ? { ...x, active: nextActive } : x));
    try {
      await updateCourse(c.id, { ...formFrom(c), active: nextActive });
      setNotice(`${t("Course")} "${c.code || c.title}" ${nextActive ? t("enabled") : t("disabled")}${t(".")}`);
    } catch {
      setError(t("Failed to update course status. Please try again."));
      load();
    }
  };

  const toggleFeatured = async (c) => {
    const nextFeatured = !c.featured;
    setCourses((prev) => prev.map((x) => x.id === c.id ? { ...x, featured: nextFeatured } : x));
    try {
      await updateCourse(c.id, { ...formFrom(c), featured: nextFeatured });
      setNotice(`${t("Course")} "${c.code || c.title}" ${nextFeatured ? t("featured on homepage") : t("unfeatured")}${t(".")}`);
    } catch {
      setError(t("Failed to update course. Please try again."));
      load();
    }
  };

  const formFrom = (c) => ({
    code: c.code || c.courseCode || "",
    title: c.title || c.courseName || c.name || "",
    credits: Number(c.credits ?? c.credit ?? 0),
    instructor: c.instructor || c.teacher || "",
    description: c.description || "",
    active: c.active === false ? false : true,
    featured: !!c.featured,
  });

  const runDelete = async () => {
    if (!confirm) return;
    const c = confirm.course;
    setConfirm(null);
    setError("");
    try {
      await deleteCourse(c.id);
      setNotice(`${t("Course")} "${c.code || c.title}" ${t("deleted successfully.")}`);
      load();
    } catch {
      setError(t("Failed to delete course. Please try again."));
    }
  };

  const q = query.trim().toLowerCase();
  const filtered = q
    ? courses.filter((c) =>
        [c.code, c.courseCode, c.title, c.courseName, c.name, c.instructor, c.teacher]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      )
    : courses;

  return (
    <div className="um">
      <style>{`
        .um .content-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 22px; gap: 20px; flex-wrap: wrap;
        }
        .um .date-label { color: #6B7280; font-size: 13.5px; }
        .um .search-box {
          display: flex; align-items: center; gap: 8px; background: #EFEBE3;
          border-radius: 10px; padding: 9px 14px; width: 260px; color: #8A8378;
        }
        .um .search-box input { border: none; outline: none; background: transparent; font-size: 13px; width: 100%; color: #1F2430; }
        .um .add-btn {
          background: #3E5EDB; color: #fff; border: none; padding: 10px 18px; border-radius: 9px;
          font-size: 13px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
          box-shadow: 0 6px 16px rgba(62,94,219,0.35);
        }
        .um .error-banner {
          background: #FBE3E0; border: 1px solid #E0665A; color: #D2483C;
          border-radius: 10px; padding: 12px 18px; font-size: 13px; margin-bottom: 20px;
        }
        .um .notice-banner {
          background: #E3F0E7; border: 1px solid #2E9E6C; color: #1E7A4E;
          border-radius: 10px; padding: 12px 18px; font-size: 13px; margin-bottom: 20px;
        }
        .um .course-panel { background: #fff; border-radius: 14px; padding: 22px; box-shadow: 0 4px 16px rgba(24,38,68,0.06); }
        .um .course-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .um .course-table th { text-align: left; color: #3E5EDB; border-bottom: 2px solid #E5E7EB; padding: 10px 12px; }
        .um .course-table td { padding: 10px 12px; border-bottom: 1px solid #F0EEE9; }
        .um .btn-edit, .um .btn-remove {
          border: none; border-radius: 7px; font-size: 11px; font-weight: 700;
          padding: 6px 12px; cursor: pointer; color: #fff; display: inline-flex; align-items: center; gap: 6px;
        }
        .um .btn-edit { background: #3E5EDB; margin-right: 6px; }
        .um .btn-edit:hover { background: #3049B0; }
        .um .btn-remove { background: #D2483C; }
        .um .btn-remove:hover { background: #B93A30; }
        .um .btn-toggle {
          border: none; border-radius: 7px; font-size: 11px; font-weight: 700;
          padding: 6px 12px; cursor: pointer; color: #fff; display: inline-flex;
          align-items: center; gap: 6px; margin-right: 6px; background: #D69A1E;
        }
        .um .btn-toggle:hover { background: #B98312; }
        .um .btn-feature { background: #7A5CDB; margin-right: 6px; }
        .um .btn-feature:hover { background: #6349B8; }
        .um .featured-pill {
          display: inline-flex; align-items: center; gap: 4px; margin-left: 6px;
          background: #7A5CDB; color: #fff; font-size: 11px; font-weight: 700;
          padding: 3px 9px; border-radius: 999px;
        }
        .um .status-pill { color: #fff; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 999px; }
        .um .um-overlay {
          position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center;
          animation: umFade 0.25s ease;
        }
        .um .um-modal { background: #fff; border-radius: 16px; padding: 26px 28px; width: min(90vw, 500px); animation: umPop 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .um .um-modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .um .um-modal-title { font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 16px; color: #182644; }
        .um .um-close { background: #F6F4EF; border: none; border-radius: 8px; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; color: #6B7280; cursor: pointer; }
        .um .um-field { margin-bottom: 14px; }
        .um .um-label { display: block; font-size: 12.5px; font-weight: 600; color: #182644; margin-bottom: 6px; }
        .um .um-input {
          width: 100%; padding: 11px 14px; border: 1.5px solid #E5E7EB; border-radius: 10px;
          font-size: 13.5px; outline: none; background: #FBFBF9; color: #1F2430;
        }
        .um .um-input:focus { border-color: #3E5EDB; }
        .um .um-input-row { display: flex; gap: 14px; }
        .um .um-input-row .um-field { flex: 1; }
        .um .um-textarea { resize: vertical; min-height: 80px; font-family: inherit; }
        .um .um-toggle-row { display: flex; align-items: center; gap: 10px; padding: 10px 0; }
        .um .um-toggle { width: 40px; height: 22px; border-radius: 999px; border: none; cursor: pointer; position: relative; transition: background 0.2s; }
        .um .um-toggle::after {
          content: ''; position: absolute; top: 3px; left: 3px; width: 16px; height: 16px;
          background: #fff; border-radius: 50%; transition: transform 0.2s;
        }
        .um .um-toggle.on { background: #3E5EDB; }
        .um .um-toggle.on::after { transform: translateX(18px); }
        .um .um-toggle.off { background: #CBD0DB; }
        .um .um-modal-foot { display: flex; gap: 12px; margin-top: 22px; }
        .um .um-cancel {
          flex: 1; padding: 11px 0; border-radius: 10px; border: 1.5px solid #E5E7EB;
          background: #F6F4EF; color: #6B7280; font-size: 14px; font-weight: 600; cursor: pointer;
        }
        .um .um-save {
          flex: 1; padding: 11px 0; border-radius: 10px; border: none; background: #3E5EDB; color: #fff;
          font-size: 14px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center;
          justify-content: center; gap: 8px; box-shadow: 0 6px 16px rgba(62,94,219,0.35);
        }
        .um .um-save:disabled { opacity: 0.6; cursor: not-allowed; }
        .um .um-delete-btn {
          flex: 1; padding: 11px 0; border-radius: 10px; border: none; background: #D2483C; color: #fff;
          font-size: 14px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center;
          justify-content: center; gap: 8px; box-shadow: 0 6px 16px rgba(210,72,60,0.35);
        }
        .um .um-confirm-icon {
          width: 56px; height: 56px; margin: 0 auto 14px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }
        @keyframes umFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes umPop { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
      `}</style>

      <div className="content-row">
        <div className="date-label">{t("Manage university courses, credits, and instructors.")}</div>
        <div style={{ display: "flex", gap: 12 }}>
          <div className="search-box">
            <Search size={15} />
            <input
              placeholder={t("Search courses...")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button className="add-btn" onClick={openAdd}><Plus size={15} /> {t("Add Course")}</button>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {notice && <div className="notice-banner">{notice}</div>}

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
          <Loader2 size={30} className="animate-spin" style={{ color: "#3E5EDB" }} />
        </div>
      ) : (
        <div className="course-panel">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <BookOpen size={18} style={{ color: "#3E5EDB" }} />
            <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, color: "#182644", fontSize: 15 }}>
              {t("Courses")} ({filtered.length})
            </span>
          </div>
          {filtered.length > 0 ? (
            <table className="course-table">
              <thead>
                <tr>
                  <th>{t("ID")}</th>
                  <th>{t("Code")}</th>
                  <th>{t("Title")}</th>
                  <th>{t("Credits")}</th>
                  <th>{t("Instructor")}</th>
                  <th>{t("Status")}</th>
                  <th>{t("Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 700, color: "#3E5EDB" }}>{c.id}</td>
                    <td style={{ fontWeight: 600, color: "#182644" }}>{c.code || c.courseCode || "-"}</td>
                    <td>{c.title || c.courseName || c.name || "-"}</td>
                    <td>{c.credits ?? c.credit ?? 0}</td>
                    <td>{c.instructor || c.teacher || "-"}</td>
                    <td>
                      <span className="status-pill" style={{ background: c.active === false ? "#D2483C" : "#2E9E6C" }}>
                        {c.active === false ? "Inactive" : "Active"}
                      </span>
                      {c.featured && (
                        <span className="featured-pill">
                          <Star size={11} fill="#fff" /> {t("Featured")}
                        </span>
                      )}
                    </td>
                    <td>
                      <button className="btn-toggle" title={t("Toggle active")} onClick={() => toggleActive(c)}>
                        <Power size={13} /> {c.active === false ? t("Enable") : t("Disable")}
                      </button>
                      <button className="btn-toggle btn-feature" title={t("Toggle featured")} onClick={() => toggleFeatured(c)}>
                        <Star size={13} /> {c.featured ? t("Unfeature") : t("Feature")}
                      </button>
                      <button className="btn-edit" onClick={() => openEdit(c)}><Pencil size={13} /> {t("Edit")}</button>
                      <button className="btn-remove" onClick={() => requestDelete(c)}><Trash2 size={13} /> {t("Delete")}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ color: "#6B7280", fontSize: 13.5, padding: "20px 0" }}>
              {q ? `${t("No courses match")} "${query}".` : t("No courses found. Click \"Add Course\" to create one.")}
            </div>
          )}
        </div>
      )}

      {modal && (
        <div className="um-overlay">
          <div className="um-modal">
            <div className="um-modal-head">
              <div className="um-modal-title">{modal.mode === "add" ? t("Add Course") : `${t("Edit Course")} #${modal.course.id}`}</div>
              <button className="um-close" onClick={closeModal} aria-label={t("Close")}><X size={18} /></button>
            </div>

            <form onSubmit={handleSave}>
              <div className="um-input-row">
                <div className="um-field">
                  <label className="um-label">{t("Course code")}</label>
                  <input
                    className="um-input"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    placeholder={t("e.g. CS101")}
                    required
                  />
                </div>
                <div className="um-field" style={{ maxWidth: 120 }}>
                  <label className="um-label">{t("Credits")}</label>
                  <input
                    className="um-input"
                    type="number"
                    min={0}
                    value={form.credits}
                    onChange={(e) => setForm({ ...form, credits: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="um-field">
                <label className="um-label">{t("Course title")}</label>
                <input
                  className="um-input"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder={t("e.g. Introduction to Computer Science")}
                  required
                />
              </div>

              <div className="um-field">
                <label className="um-label">{t("Instructor")}</label>
                <input
                  className="um-input"
                  value={form.instructor}
                  onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                  placeholder={t("e.g. Mr. Rady Chan")}
                />
              </div>

              <div className="um-field">
                <label className="um-label">{t("Description")}</label>
                <textarea
                  className="um-input um-textarea"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder={t("Short description of the course")}
                />
              </div>

              <div className="um-toggle-row">
                <button
                  type="button"
                  className={"um-toggle " + (form.active ? "on" : "off")}
                  onClick={() => setForm({ ...form, active: !form.active })}
                  aria-label={t("Toggle active")}
                />
                <span className="um-label" style={{ margin: 0 }}>{form.active ? "Active" : "Inactive"}</span>
              </div>
              <div className="um-toggle-row">
                <button
                  type="button"
                  className={"um-toggle " + (form.featured ? "on" : "off")}
                  onClick={() => setForm({ ...form, featured: !form.featured })}
                  aria-label={t("Toggle featured")}
                />
                <span className="um-label" style={{ margin: 0 }}>
                  {form.featured ? t("Featured on homepage") : t("Not featured")}
                </span>
              </div>

              <div className="um-modal-foot">
                <button type="button" className="um-cancel" onClick={closeModal}>{t("Cancel")}</button>
                <button type="submit" className="um-save" disabled={saving}>
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
                  {saving ? t("Saving...") : t("Save Course")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirm && (
        <div className="um-overlay">
          <div className="um-modal" style={{ textAlign: "center", maxWidth: 420 }}>
            <div className="um-confirm-icon" style={{ background: "#FBE3E0", color: "#D2483C" }}>
              <Trash2 size={26} />
            </div>
            <div className="um-modal-title" style={{ textAlign: "center" }}>{t("Delete course?")}</div>
            <p style={{ fontSize: 13.5, color: "#6B7280", margin: "10px 0 0", lineHeight: 1.6 }}>
              {t("Are you sure you want to delete course")}{" "}
              <strong style={{ color: "#182644" }}>{confirm.course.code || confirm.course.title}</strong>? {t("It will be hidden.")}
            </p>
            <div className="um-modal-foot">
              <button type="button" className="um-cancel" onClick={() => setConfirm(null)}>{t("Cancel")}</button>
              <button type="button" className="um-delete-btn" onClick={runDelete}>
                <Trash2 size={15} /> {t("Delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
