import React, { useState } from 'react';

const departments = [
  "Computer Science",
  "Information Technology",
  "Business Management",
  "Marketing",
  "Accounting & Finance",
  "English Literature",
  "Law",
  "Engineering",
  "Architecture",
  "Other",
];

const StudentEmailForm = () => {
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("email") || "";

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    studentId: "",
    department: "",
    year: "",
  });
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setMsg({ type: "", text: "" });
  };

  const validate = () => {
    const errs = {};
    if (!form.studentId.trim()) errs.studentId = "Student ID is required";
    if (!form.department) errs.department = "Select your department";
    if (!form.year) errs.year = "Select your year";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const claimEmail = async () => {
    if (!validate()) return;
    setLoading(true);
    setMsg({ type: "", text: "" });

    const body = {
      email: userEmail,
      studentId: form.studentId,
      department: form.department,
      year: form.year,
    };

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/student/claim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        setEmail(data.email);
        setStep(2);
      } else {
        setMsg({ type: "error", text: data.message || "No student record found." });
      }
    } catch {
      setMsg({ type: "error", text: "Backend not reachable. Make sure the server is running." });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 bg-gray-50 border ${errors[field] ? "border-red-400" : "border-gray-200"} rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition`;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg-secondary)" }}>
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
          <p className="text-gray-700 font-medium">Please log in first to claim your student email.</p>
          <a href="/public/login" className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition">Go to Login</a>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg-secondary)" }}>
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Email Generated!</h2>
          <p className="text-sm text-gray-500 mb-6">
            Your student email has been created successfully.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-xs text-blue-600 font-medium mb-1">Your student email:</p>
            <p className="text-lg font-bold text-gray-900">{email}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left text-sm space-y-1">
            <p className="text-gray-500"><span className="font-medium text-gray-700">Account Email:</span> {userEmail}</p>
            <p className="text-gray-500"><span className="font-medium text-gray-700">Student ID:</span> {form.studentId}</p>
            <p className="text-gray-500"><span className="font-medium text-gray-700">Department:</span> {form.department}</p>
            <p className="text-gray-500"><span className="font-medium text-gray-700">Year:</span> {form.year}</p>
          </div>
          <button
            onClick={() => { setStep(1); setEmail(""); setMsg({ type: "", text: "" }); }}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
          >
            Claim Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg-secondary)" }}>
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Claim Your Student Email</h2>
          <p className="text-sm text-gray-500 mt-1">Verify your student identity to get a <strong>@ciu.std.kh</strong> email</p>
        </div>

        {/* Account Info (read-only) */}
        <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Account Email</span><span className="font-medium text-gray-800">{userEmail}</span></div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Student ID</label>
            <input name="studentId" value={form.studentId} onChange={handleChange} placeholder="e.g. CS-2024-001" className={inputClass("studentId")} />
            {errors.studentId && <p className="text-xs text-red-500 mt-1">{errors.studentId}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Department</label>
              <select name="department" value={form.department} onChange={handleChange} className={inputClass("department")}>
                <option value="">Select...</option>
                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.department && <p className="text-xs text-red-500 mt-1">{errors.department}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Year</label>
              <select name="year" value={form.year} onChange={handleChange} className={inputClass("year")}>
                <option value="">Select...</option>
                {[1, 2, 3, 4, 5].map((y) => <option key={y} value={`Year ${y}`}>Year {y}</option>)}
              </select>
              {errors.year && <p className="text-xs text-red-500 mt-1">{errors.year}</p>}
            </div>
          </div>

          {msg.text && (
            <p className={`text-sm ${msg.type === "error" ? "text-red-500 bg-red-50 border-red-200" : "text-green-600 bg-green-50 border-green-200"} border rounded-lg p-3 text-center`}>
              {msg.text}
            </p>
          )}

          <button
            onClick={claimEmail}
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition mt-2 disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Claim Email"}
          </button>

          <p className="text-xs text-gray-400 text-center mt-3">
            Your email will be: <strong className="text-gray-600">firstname.lastname@ciu.std.kh</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentEmailForm;
