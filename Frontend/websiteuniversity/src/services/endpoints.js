const BASE_URL = process.env.REACT_APP_API_URL || "https://cambodia-international-university.onrender.com";

const authHeaders = () => ({
    "Content-Type": "application/json",
    ...(sessionStorage.getItem("token") && {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    }),
    ...(sessionStorage.getItem("email") && {
        "X-User-Email": sessionStorage.getItem("email"),
    }),
});

const parse = async (response) => {
    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const err = new Error(body?.message || `Request failed (${response.status})`);
        err.status = response.status;
        throw err;
    }
    if (response.status === 204) return {};
    return response.json();
};

// ---------- Auth ----------
export const adminLogin = async (data) => {
    const response = await fetch(`${BASE_URL}/api/auth/login/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return parse(response);
};

export const adminRegister = async (data) => {
    const response = await fetch(`${BASE_URL}/api/auth/register/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return parse(response);
};

export const loginUser = async (data) => {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return parse(response);
};

export const registerUser = async (data) => {
    const response = await fetch(`${BASE_URL}/api/verification/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return parse(response);
};

// ---------- Dashboard Stats ----------
export const getDashboardStats = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/dashboard/stats`, {
        headers: authHeaders(),
    });
    return parse(response);
};

// ---------- Student Attendance ----------
export const getStudentAttendance = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/dashboard/attendance/student`, {
        headers: authHeaders(),
    });
    return parse(response);
};

// ---------- Teacher Attendance ----------
export const getTeacherAttendance = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/dashboard/attendance/teacher`, {
        headers: authHeaders(),
    });
    return parse(response);
};

// ---------- Income / Earnings ----------
export const getIncomeData = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/dashboard/income`, {
        headers: authHeaders(),
    });
    return parse(response);
};

export const getEarnings = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/dashboard/earnings`, {
        headers: authHeaders(),
    });
    return parse(response);
};

// ---------- Fee Groups ----------
export const getFeeGroups = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/dashboard/fee-groups`, {
        headers: authHeaders(),
    });
    return parse(response);
};

// ---------- Classes ----------
export const getAdminClasses = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/dashboard/classes`, {
        headers: authHeaders(),
    });
    return parse(response);
};

// ---------- Fee Group Members ----------
export const getFeeGroupMembers = async (group) => {
    const response = await fetch(`${BASE_URL}/api/admin/dashboard/fee-groups/${encodeURIComponent(group)}`, {
        headers: authHeaders(),
    });
    return parse(response);
};

// ---------- Student Auth ----------
export const studentLogin = async (data) => {
    const response = await fetch(`${BASE_URL}/api/auth/students/login/account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return parse(response);
};

export const studentRegister = async (data) => {
    const response = await fetch(`${BASE_URL}/api/auth/students/register/account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return parse(response);
};

// ---------- Teacher Auth ----------
export const teacherLogin = async (data) => {
    const response = await fetch(`${BASE_URL}/api/auth/teacher/login/account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return parse(response);
};

export const teacherRegister = async (data) => {
    const response = await fetch(`${BASE_URL}/api/auth/teacher/register/account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return parse(response);
};

// ---------- Email Verification ----------
export const verifyEmail = async (data) => {
    const response = await fetch(`${BASE_URL}/api/verification/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return parse(response);
};

export const resendCode = async (data) => {
    const response = await fetch(`${BASE_URL}/api/verification/resend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return parse(response);
};

// ---------- Account Lists ----------
export const getStudentAccounts = async () => {
    const response = await fetch(`${BASE_URL}/api/auth/students`, {
        headers: authHeaders(),
    });
    return parse(response);
};

export const getTeacherAccounts = async () => {
    const response = await fetch(`${BASE_URL}/api/auth/teacher/list`, {
        headers: authHeaders(),
    });
    return parse(response);
};

export const getAdminAccounts = async () => {
    const response = await fetch(`${BASE_URL}/api/auth/account/admin`, {
        headers: authHeaders(),
    });
    return parse(response);
};

// ---------- User Management (web users) ----------
export const getUsers = async () => {
    const response = await fetch(`${BASE_URL}/api/auth/users/users`, {
        headers: authHeaders(),
    });
    return parse(response);
};

export const updateUser = async (id, data) => {
    const response = await fetch(`${BASE_URL}/api/auth/users/update/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return parse(response);
};

export const deleteUser = async (id) => {
    const response = await fetch(`${BASE_URL}/api/auth/users/delete/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    return parse(response);
};

export const suspendUser = async (id, data) => {
    const response = await fetch(`${BASE_URL}/api/auth/users/suspend/account/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return parse(response);
};

export const unsuspendUser = async (id) => {
    const response = await fetch(`${BASE_URL}/api/auth/users/unsuspend/account/${id}`, {
        method: "PUT",
        headers: authHeaders(),
    });
    return parse(response);
};

// ---------- Contact ----------
export const getContact = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/contact/messages`, {
        headers: authHeaders(),
    });
    const data = await parse(response);
    const arr = Array.isArray(data) ? data : Array.isArray(data.messages) ? data.messages : [];
    return arr.map((m) => ({
        id: m.id,
        name: m.username || m.name,
        email: m.email,
        phone: m.phoneNumber || m.phone,
        message: m.message,
        subject: m.subject || (m.message || "").slice(0, 60),
        date: m.date || m.createdAt || "",
        read: !!m.read,
    }));
};

export const sendContact = async (data) => {
    const response = await fetch(`${BASE_URL}/api/public/contact/report-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return parse(response);
};

export const replyContact = async (data) => {
    const response = await fetch(`${BASE_URL}/api/admin/contact/reply`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return parse(response);
};

export const markContactRead = async (id) => {
    const response = await fetch(`${BASE_URL}/api/admin/contact/${id}/read`, {
        method: "PUT",
        headers: authHeaders(),
    });
    return parse(response);
};

export const deleteContact = async (id) => {
    const response = await fetch(`${BASE_URL}/api/admin/contact/delete/message/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    return parse(response);
};

// ---------- Password Reset ----------
export const forgotPassword = async (data) => {
    const response = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return parse(response);
};

export const resetPassword = async (data) => {
    const response = await fetch(`${BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return parse(response);
};

// ---------- Courses (admin CRUD) ----------
export const getCourses = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/course`, {
        headers: authHeaders(),
    });
    return parse(response);
};

export const createCourse = async (data) => {
    const response = await fetch(`${BASE_URL}/api/admin/course`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return parse(response);
};

export const updateCourse = async (id, data) => {
    const response = await fetch(`${BASE_URL}/api/admin/course/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return parse(response);
};

export const deleteCourse = async (id) => {
    const response = await fetch(`${BASE_URL}/api/admin/course/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    return parse(response);
};

// ---------- Audit Log ----------
export const getAuditLogs = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/audit-logs`, {
        headers: authHeaders(),
    });
    return parse(response);
};

export const clearAuditLogs = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/audit-logs/clear`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    return parse(response);
};

// ---------- News ----------
 export const getNews = async () => {
     const isAdmin = sessionStorage.getItem("role") === "ADMIN";
     const url = isAdmin
         ? `${BASE_URL}/api/auth/admin/news`
         : `${BASE_URL}/api/news`;
     const response = await fetch(url, {
         headers: authHeaders(),
     });
     return parse(response);
 };

export const createNews = async (data) => {
    const response = await fetch(`${BASE_URL}/api/auth/admin/posts/news`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return parse(response);
};

export const updateNews = async (id, data) => {
    const response = await fetch(`${BASE_URL}/api/auth/admin/update/news/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return parse(response);
};

export const deleteNews = async (id) => {
    const response = await fetch(`${BASE_URL}/api/auth/admin/delete/news/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    return parse(response);
};

// ---------- Student Portal ----------
export const getStudentProfile = async () => {
    const response = await fetch(`${BASE_URL}/api/students/profile`, {
        headers: authHeaders(),
    });
    return parse(response);
};

export const getStudentEnrollments = async () => {
    const response = await fetch(`${BASE_URL}/api/students/enrollments`, {
        headers: authHeaders(),
    });
    return parse(response);
};

export const getStudentClassInfo = async () => {
    const response = await fetch(`${BASE_URL}/api/students/class-info`, {
        headers: authHeaders(),
    });
    return parse(response);
};

export const getStudentGrades = async () => {
    const response = await fetch(`${BASE_URL}/api/students/grades`, {
        headers: authHeaders(),
    });
    return parse(response);
};

export const enrollInCourse = async (data) => {
    const response = await fetch(`${BASE_URL}/api/students/enrollments`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return parse(response);
};

// ---------- Teacher Portal ----------
export const getTeacherClasses = async () => {
    const response = await fetch(`${BASE_URL}/api/teachers/classes`, {
        headers: authHeaders(),
    });
    return parse(response);
};

export const getTeacherStudents = async () => {
    const response = await fetch(`${BASE_URL}/api/teachers/students`, {
        headers: authHeaders(),
    });
    return parse(response);
};

export const getTeacherClassStudents = async (code) => {
    const response = await fetch(`${BASE_URL}/api/teachers/classes/${encodeURIComponent(code)}/students`, {
        headers: authHeaders(),
    });
    return parse(response);
};

export const getTeacherAnnouncements = async () => {
    const response = await fetch(`${BASE_URL}/api/teachers/announcements`, {
        headers: authHeaders(),
    });
    return parse(response);
};

export const saveTeacherAttendance = async (data) => {
    const response = await fetch(`${BASE_URL}/api/teachers/attendance`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return parse(response);
};

export const submitTeacherGrades = async (data) => {
    const response = await fetch(`${BASE_URL}/api/teachers/grades`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return parse(response);
};

export const postTeacherAnnouncement = async (data) => {
    const response = await fetch(`${BASE_URL}/api/teachers/announcements`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return parse(response);
};

// ---------- Enrollments (admin) ----------
export const getEnrollments = async () => {
    const response = await fetch(`${BASE_URL}/api/auth/admin/enrollments`, {
        headers: authHeaders(),
    });
    return parse(response);
};

export const getEnrollment = async (id) => {
    const response = await fetch(`${BASE_URL}/api/auth/admin/enrollments/${id}`, {
        headers: authHeaders(),
    });
    return parse(response);
};

export const updateEnrollmentStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/api/auth/admin/enrollments/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ status }),
    });
    return parse(response);
};

// ---------- Reports ----------
export const getReports = async () => {
    const response = await fetch(`${BASE_URL}/api/auth/report`, {
        headers: authHeaders(),
    });
    return parse(response);
};

export const submitReport = async (data) => {
    const response = await fetch(`${BASE_URL}/api/auth/report/submit`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return parse(response);
};

export const updateReport = async (id, data) => {
    const response = await fetch(`${BASE_URL}/api/auth/report/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return parse(response);
};

// ---------- Student announcements / schedule / attendance ----------
export const getStudentAnnouncements = async () => {
    const response = await fetch(`${BASE_URL}/api/students/announcements`, {
        headers: authHeaders(),
    });
    return parse(response);
};

export const getStudentSchedule = async () => {
    const response = await fetch(`${BASE_URL}/api/students/schedule`, {
        headers: authHeaders(),
    });
    return parse(response);
};

export const getStudentAttendanceRecords = async () => {
    const response = await fetch(`${BASE_URL}/api/students/attendance`, {
        headers: authHeaders(),
    });
    return parse(response);
};

// ---------- Assignments (student + teacher) ----------
export const getStudentAssignments = async () => {
    const response = await fetch(`${BASE_URL}/api/students/assignments`, {
        headers: authHeaders(),
    });
    return parse(response);
};

export const submitStudentAssignment = async (data) => {
    const response = await fetch(`${BASE_URL}/api/students/assignments/submit`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return parse(response);
};

export const getTeacherAssignments = async () => {
    const response = await fetch(`${BASE_URL}/api/teachers/assignments`, {
        headers: authHeaders(),
    });
    return parse(response);
};

export const createTeacherAssignment = async (data) => {
    const response = await fetch(`${BASE_URL}/api/teachers/assignments`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return parse(response);
};

export const deleteTeacherAssignment = async (id) => {
    const response = await fetch(`${BASE_URL}/api/teachers/assignments/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    return parse(response);
};

export const deleteTeacherAnnouncement = async (id) => {
    const response = await fetch(`${BASE_URL}/api/teachers/announcements/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    return parse(response);
};

// ---------- Notifications ----------
export const getStudentNotifications = async () => {
    const response = await fetch(`${BASE_URL}/api/students/notifications`, {
        headers: authHeaders(),
    });
    return parse(response);
};

export const markStudentNotificationsRead = async (data) => {
    const response = await fetch(`${BASE_URL}/api/students/notifications/read`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data || {}),
    });
    return parse(response);
};

export const broadcastNotification = async (data) => {
    const response = await fetch(`${BASE_URL}/api/admin/notifications`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return parse(response);
};

export const getAdminNotifications = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/notifications`, {
        headers: authHeaders(),
    });
    return parse(response);
};

// ---------- Messaging / class chat ----------
export const getStudentMessages = async () => {
    const response = await fetch(`${BASE_URL}/api/students/messages`, {
        headers: authHeaders(),
    });
    return parse(response);
};

export const sendStudentMessage = async (data) => {
    const response = await fetch(`${BASE_URL}/api/students/messages`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return parse(response);
};

export const getTeacherMessages = async () => {
    const response = await fetch(`${BASE_URL}/api/teachers/messages`, {
        headers: authHeaders(),
    });
    return parse(response);
};

export const sendTeacherMessage = async (data) => {
    const response = await fetch(`${BASE_URL}/api/teachers/messages`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return parse(response);
};

// ---------- Progression ----------
export const getProgressionPreview = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/progression/preview`, {
        headers: authHeaders(),
    });
    return parse(response);
};

export const processProgression = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/progression/process`, {
        method: "POST",
        headers: authHeaders(),
    });
    return parse(response);
};

export const getStudentProgression = async () => {
    const response = await fetch(`${BASE_URL}/api/students/progression`, {
        headers: authHeaders(),
    });
    return parse(response);
};

// ---------- Student Card (ID card) ----------
export const getStudentCard = async () => {
    const response = await fetch(`${BASE_URL}/api/students/card`, {
        headers: authHeaders(),
    });
    return parse(response);
};

export const updateStudentCard = async (id, data) => {
    const response = await fetch(`${BASE_URL}/api/admin/students/${id}/card`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return parse(response);
};

export const uploadStudentPhoto = async (id, file) => {
    const fd = new FormData();
    fd.append("file", file);
    const response = await fetch(`${BASE_URL}/api/admin/students/${id}/photo`, {
        method: "POST",
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        body: fd,
    });
    return parse(response);
};

// ---------- Student Records (admin) ----------
export const getStudentRecords = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/students/records`, {
        headers: authHeaders(),
    });
    return parse(response);
};

// ---------- Invoices ----------
export const getStudentInvoices = async () => {
    const response = await fetch(`${BASE_URL}/api/students/invoices`, {
        headers: authHeaders(),
    });
    return parse(response);
};

export const getAdminInvoices = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/invoices`, {
        headers: authHeaders(),
    });
    return parse(response);
};

// ---------- Schedule (admin) ----------
export const getAdminSchedule = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/schedule`, {
        headers: authHeaders(),
    });
    return parse(response);
};

export const saveAdminSchedule = async (data) => {
    const response = await fetch(`${BASE_URL}/api/admin/schedule`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return parse(response);
};

export const deleteAdminScheduleRow = async (id) => {
    const response = await fetch(`${BASE_URL}/api/admin/schedule/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    return parse(response);
};

export const deleteAdminScheduleBlock = async ({ major, field, level, semester }) => {
    const query = new URLSearchParams({ major, field, level, semester });
    const response = await fetch(`${BASE_URL}/api/admin/schedule?${query}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    return parse(response);
};

// ---------- User import / export (admin) ----------
export const importUsers = async (data) => {
    const response = await fetch(`${BASE_URL}/api/admin/users/import`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return parse(response);
};

export const exportUsers = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/users/export`, {
        headers: authHeaders(),
    });
    return parse(response);
};

// ---------- Public: newsletter / applications ----------
export const subscribeNewsletter = async (data) => {
    const response = await fetch(`${BASE_URL}/api/public/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return parse(response);
};

export const submitApplication = async (data) => {
    const response = await fetch(`${BASE_URL}/api/public/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return parse(response);
};

export const getApplicationStatus = async (code) => {
    const response = await fetch(`${BASE_URL}/api/public/applications/${encodeURIComponent(code)}`, {
        headers: { "Content-Type": "application/json" },
    });
    return parse(response);
};

// ---------- Class code join (teacher) ----------
export const joinTeacherClass = async (code) => {
    const response = await fetch(`${BASE_URL}/api/teachers/join`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ code }),
    });
    return parse(response);
};

export const getTeacherNotifications = async () => {
    const response = await fetch(`${BASE_URL}/api/teachers/notifications`, {
        headers: authHeaders(),
    });
    return parse(response);
};

// ---------- Class code join (student, online-pay path) ----------
export const joinStudentClass = async (code) => {
    const response = await fetch(`${BASE_URL}/api/students/join`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ code }),
    });
    return parse(response);
};

// ---------- Student class / progression payment (frontend contract) ----------
export const getStudentClassStatus = async () => {
    const response = await fetch(`${BASE_URL}/api/students/my-class`, {
        headers: authHeaders(),
    });
    return parse(response);
};

export const payStudentClass = async (data) => {
    const response = await fetch(`${BASE_URL}/api/students/pay-and-join`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data || {}),
    });
    return parse(response);
};

export const getStudentClassByCode = async (code) => {
    const response = await fetch(`${BASE_URL}/api/students/class/${encodeURIComponent(code)}`, {
        headers: authHeaders(),
    });
    return parse(response);
};
