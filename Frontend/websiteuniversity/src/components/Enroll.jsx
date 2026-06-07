
import React, { useState } from "react";

const availableCourses = [
  { id: "cs101", name: "Intro to Computer Science" },
  { id: "math201", name: "Calculus I" },
  { id: "eng150", name: "English Composition" },
  { id: "hist210", name: "World History" },
];

export default function Enroll() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    studentId: "",
    courses: [], // array of ids
    term: "fall",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState(null);

  const validate = (values) => {
    const errs = {};
    if (!values.fullName.trim()) errs.fullName = "Full name is required.";
    if (!values.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errs.email = "Email is invalid.";
    }
    if (!values.studentId.trim()) errs.studentId = "Student ID is required.";
    if (!values.courses.length) errs.courses = "Select at least one course.";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleCheckbox = (courseId) => {
    setForm((f) => {
      const exists = f.courses.includes(courseId);
      return {
        ...f,
        courses: exists ? f.courses.filter((c) => c !== courseId) : [...f.courses, courseId],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      // Replace this with real submit logic (API call) as needed.
      setSubmittedData(form);
      // reset form (optional)
      // setForm({ fullName: "", email: "", studentId: "", courses: [], term: "fall", notes: "" });
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "24px auto", fontFamily: "Arial, sans-serif" }}>
      <h2>Class Enrollment Form</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: 12 }}>
          <label>
            <div><strong>Full name</strong></div>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              style={{ width: "100%", padding: 8 }}
            />
          </label>
          {errors.fullName && <div style={{ color: "crimson", marginTop: 6 }}>{errors.fullName}</div>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            <div><strong>Email</strong></div>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              style={{ width: "100%", padding: 8 }}
            />
          </label>
          {errors.email && <div style={{ color: "crimson", marginTop: 6 }}>{errors.email}</div>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            <div><strong>Student ID</strong></div>
            <input
              name="studentId"
              value={form.studentId}
              onChange={handleChange}
              style={{ width: "100%", padding: 8 }}
            />
          </label>
          {errors.studentId && <div style={{ color: "crimson", marginTop: 6 }}>{errors.studentId}</div>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <div><strong>Courses</strong></div>
          <div style={{ display: "grid", gap: 6, marginTop: 6 }}>
            {availableCourses.map((c) => (
              <label key={c.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={form.courses.includes(c.id)}
                  onChange={() => handleCheckbox(c.id)}
                />
                <span>{c.name}</span>
              </label>
            ))}
          </div>
          {errors.courses && <div style={{ color: "crimson", marginTop: 6 }}>{errors.courses}</div>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <div><strong>Term</strong></div>
          <label style={{ marginRight: 12 }}>
            <input
              type="radio"
              name="term"
              value="fall"
              checked={form.term === "fall"}
              onChange={handleChange}
            /> Fall
          </label>
          <label style={{ marginRight: 12 }}>
            <input
              type="radio"
              name="term"
              value="spring"
              checked={form.term === "spring"}
              onChange={handleChange}
            /> Spring
          </label>
          <label>
            <input
              type="radio"
              name="term"
              value="summer"
              checked={form.term === "summer"}
              onChange={handleChange}
            /> Summer
          </label>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            <div><strong>Notes (optional)</strong></div>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={4}
              style={{ width: "100%", padding: 8 }}
            />
          </label>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" style={{ padding: "8px 14px" }}>Submit</button>
          <button
            type="button"
            onClick={() => {
              setForm({ fullName: "", email: "", studentId: "", courses: [], term: "fall", notes: "" });
              setErrors({});
              setSubmittedData(null);
            }}
            style={{ padding: "8px 14px" }}
          >
            Reset
          </button>
        </div>
      </form>

      {submittedData && (
        <div style={{ marginTop: 20, padding: 12, border: "1px solid #ddd", background: "#fafafa" }}>
          <h3>Submitted data</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(submittedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
