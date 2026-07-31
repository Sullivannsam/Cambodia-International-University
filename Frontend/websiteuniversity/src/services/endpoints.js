const BASE_URL = process.env.REACT_APP_API_URL;

const authHeaders = () => ({
    "Content-Type": "application/json",
    ...(localStorage.getItem("token") && {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    }),
});

// ---------- Auth ----------
export const adminLogin = async (data) => {
    const response = await fetch(`${BASE_URL}/api/auth/login/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
};

export const adminRegister = async (data) => {
    const response = await fetch(`${BASE_URL}/api/auth/register/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
};

export const loginUser = async (data) => {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
};

export const registerUser = async (data) => {
    const response = await fetch(`${BASE_URL}/api/verification/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
};

// ---------- Dashboard Stats ----------
export const getDashboardStats = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/dashboard/stats`, {
        headers: authHeaders(),
    });
    return response.json();
};

// ---------- Student Attendance ----------
export const getStudentAttendance = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/dashboard/attendance/student`, {
        headers: authHeaders(),
    });
    return response.json();
};

// ---------- Teacher Attendance ----------
export const getTeacherAttendance = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/dashboard/attendance/teacher`, {
        headers: authHeaders(),
    });
    return response.json();
};

// ---------- Income / Earnings ----------
export const getIncomeData = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/dashboard/income`, {
        headers: authHeaders(),
    });
    return response.json();
};

export const getEarnings = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/dashboard/earnings`, {
        headers: authHeaders(),
    });
    return response.json();
};

// ---------- Fee Groups ----------
export const getFeeGroups = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/dashboard/fee-groups`, {
        headers: authHeaders(),
    });
    return response.json();
};

// ---------- Fee Group Members ----------
export const getFeeGroupMembers = async (group) => {
    const response = await fetch(`${BASE_URL}/api/admin/dashboard/fee-groups/${encodeURIComponent(group)}`, {
        headers: authHeaders(),
    });
    return response.json();
};

// ---------- Student Auth ----------
export const studentLogin = async (data) => {
    const response = await fetch(`${BASE_URL}/api/auth/students/login/account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
};

export const studentRegister = async (data) => {
    const response = await fetch(`${BASE_URL}/api/auth/students/register/account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
};

// ---------- Teacher Auth ----------
export const teacherLogin = async (data) => {
    const response = await fetch(`${BASE_URL}/api/auth/teacher/login/account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
};

export const teacherRegister = async (data) => {
    const response = await fetch(`${BASE_URL}/api/auth/teacher/register/account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
};

// ---------- Email Verification ----------
export const verifyEmail = async (data) => {
    const response = await fetch(`${BASE_URL}/api/verification/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
};

export const resendCode = async (data) => {
    const response = await fetch(`${BASE_URL}/api/verification/resend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
};

// ---------- Account Lists ----------
export const getStudentAccounts = async () => {
    const response = await fetch(`${BASE_URL}/api/auth/students`, {
        headers: authHeaders(),
    });
    return response.json();
};

export const getTeacherAccounts = async () => {
    const response = await fetch(`${BASE_URL}/api/auth/teacher/list`, {
        headers: authHeaders(),
    });
    return response.json();
};

export const getAdminAccounts = async () => {
    const response = await fetch(`${BASE_URL}/api/auth/account/admin`, {
        headers: authHeaders(),
    });
    return response.json();
};

// ---------- User Management (web users) ----------
export const getUsers = async () => {
    const response = await fetch(`${BASE_URL}/api/auth/users/users`, {
        headers: authHeaders(),
    });
    return response.json();
};

export const updateUser = async (id, data) => {
    const response = await fetch(`${BASE_URL}/api/auth/users/update/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return response.json();
};

export const deleteUser = async (id) => {
    const response = await fetch(`${BASE_URL}/api/auth/users/delete/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    return response.json();
};

export const suspendUser = async (id, data) => {
    const response = await fetch(`${BASE_URL}/api/auth/users/suspend/account/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return response.json();
};

export const unsuspendUser = async (id) => {
    const response = await fetch(`${BASE_URL}/api/auth/users/unsuspend/account/${id}`, {
        method: "PUT",
        headers: authHeaders(),
    });
    return response.json();
};

// ---------- Contact ----------
export const getContact = async () => {
    const response = await fetch(`${BASE_URL}/api/public`, {
        headers: { "Content-Type": "application/json" },
    });
    return response.json();
};

export const sendContact = async (data) => {
    const response = await fetch(`${BASE_URL}/api/public/contact/report-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
};

export const replyContact = async (data) => {
    const response = await fetch(`${BASE_URL}/api/admin/contact/reply`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return response.json();
};

// ---------- Password Reset ----------
export const forgotPassword = async (data) => {
    const response = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
};

export const resetPassword = async (data) => {
    const response = await fetch(`${BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
};

// ---------- Courses (admin CRUD) ----------
export const getCourses = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/courses`, {
        headers: authHeaders(),
    });
    return response.json();
};

export const createCourse = async (data) => {
    const response = await fetch(`${BASE_URL}/api/admin/courses`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return response.json();
};

export const updateCourse = async (id, data) => {
    const response = await fetch(`${BASE_URL}/api/admin/courses/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return response.json();
};

export const deleteCourse = async (id) => {
    const response = await fetch(`${BASE_URL}/api/admin/courses/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    return response.json();
};

// ---------- Audit Log ----------
export const getAuditLogs = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/audit-logs`, {
        headers: authHeaders(),
    });
    return response.json();
};

export const clearAuditLogs = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/audit-logs/clear`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    return response.json();
};

// ---------- News ----------
export const getNews = async () => {
    const response = await fetch(`${BASE_URL}/api/news`, {
        headers: { "Content-Type": "application/json" },
    });
    return response.json();
};

export const createNews = async (data) => {
    const response = await fetch(`${BASE_URL}/api/admin/news`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return response.json();
};

export const updateNews = async (id, data) => {
    const response = await fetch(`${BASE_URL}/api/admin/news/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return response.json();
};

export const deleteNews = async (id) => {
    const response = await fetch(`${BASE_URL}/api/admin/news/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    return response.json();
};

// ---------- Student Portal ----------
export const getStudentProfile = async () => {
    const response = await fetch(`${BASE_URL}/api/students/profile`, {
        headers: authHeaders(),
    });
    return response.json();
};

export const getStudentEnrollments = async () => {
    const response = await fetch(`${BASE_URL}/api/students/enrollments`, {
        headers: authHeaders(),
    });
    return response.json();
};

export const getStudentGrades = async () => {
    const response = await fetch(`${BASE_URL}/api/students/grades`, {
        headers: authHeaders(),
    });
    return response.json();
};

export const enrollInCourse = async (data) => {
    const response = await fetch(`${BASE_URL}/api/students/enrollments`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return response.json();
};

// ---------- Teacher Portal ----------
export const getTeacherClasses = async () => {
    const response = await fetch(`${BASE_URL}/api/teachers/classes`, {
        headers: authHeaders(),
    });
    return response.json();
};

export const getTeacherStudents = async () => {
    const response = await fetch(`${BASE_URL}/api/teachers/students`, {
        headers: authHeaders(),
    });
    return response.json();
};

export const getTeacherAnnouncements = async () => {
    const response = await fetch(`${BASE_URL}/api/teachers/announcements`, {
        headers: authHeaders(),
    });
    return response.json();
};

export const saveTeacherAttendance = async (data) => {
    const response = await fetch(`${BASE_URL}/api/teachers/attendance`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return response.json();
};

export const submitTeacherGrades = async (data) => {
    const response = await fetch(`${BASE_URL}/api/teachers/grades`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return response.json();
};

export const postTeacherAnnouncement = async (data) => {
    const response = await fetch(`${BASE_URL}/api/teachers/announcements`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return response.json();
};

// ---------- Enrollments (admin) ----------
export const getEnrollments = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/enrollments`, {
        headers: authHeaders(),
    });
    return response.json();
};

export const updateEnrollmentStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/api/admin/enrollments/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ status }),
    });
    return response.json();
};

// ---------- Reports (admin) ----------
export const getReports = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/reports`, {
        headers: authHeaders(),
    });
    return response.json();
};

// ---------- Student announcements / schedule / attendance ----------
export const getStudentAnnouncements = async () => {
    const response = await fetch(`${BASE_URL}/api/students/announcements`, {
        headers: authHeaders(),
    });
    return response.json();
};

export const getStudentSchedule = async () => {
    const response = await fetch(`${BASE_URL}/api/students/schedule`, {
        headers: authHeaders(),
    });
    return response.json();
};

export const getStudentAttendanceRecords = async () => {
    const response = await fetch(`${BASE_URL}/api/students/attendance`, {
        headers: authHeaders(),
    });
    return response.json();
};

// ---------- Assignments (student + teacher) ----------
export const getStudentAssignments = async () => {
    const response = await fetch(`${BASE_URL}/api/students/assignments`, {
        headers: authHeaders(),
    });
    return response.json();
};

export const submitStudentAssignment = async (data) => {
    const response = await fetch(`${BASE_URL}/api/students/assignments/submit`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return response.json();
};

export const getTeacherAssignments = async () => {
    const response = await fetch(`${BASE_URL}/api/teachers/assignments`, {
        headers: authHeaders(),
    });
    return response.json();
};

export const createTeacherAssignment = async (data) => {
    const response = await fetch(`${BASE_URL}/api/teachers/assignments`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return response.json();
};

export const deleteTeacherAssignment = async (id) => {
    const response = await fetch(`${BASE_URL}/api/teachers/assignments/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    return response.json();
};

// ---------- Notifications ----------
export const getStudentNotifications = async () => {
    const response = await fetch(`${BASE_URL}/api/students/notifications`, {
        headers: authHeaders(),
    });
    return response.json();
};

export const markStudentNotificationsRead = async (data) => {
    const response = await fetch(`${BASE_URL}/api/students/notifications/read`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data || {}),
    });
    return response.json();
};

export const broadcastNotification = async (data) => {
    const response = await fetch(`${BASE_URL}/api/admin/notifications`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return response.json();
};

// ---------- Messaging / class chat ----------
export const getStudentMessages = async () => {
    const response = await fetch(`${BASE_URL}/api/students/messages`, {
        headers: authHeaders(),
    });
    return response.json();
};

export const sendStudentMessage = async (data) => {
    const response = await fetch(`${BASE_URL}/api/students/messages`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return response.json();
};

export const getTeacherMessages = async () => {
    const response = await fetch(`${BASE_URL}/api/teachers/messages`, {
        headers: authHeaders(),
    });
    return response.json();
};

export const sendTeacherMessage = async (data) => {
    const response = await fetch(`${BASE_URL}/api/teachers/messages`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return response.json();
};

// ---------- Invoices ----------
export const getStudentInvoices = async () => {
    const response = await fetch(`${BASE_URL}/api/students/invoices`, {
        headers: authHeaders(),
    });
    return response.json();
};

export const getAdminInvoices = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/invoices`, {
        headers: authHeaders(),
    });
    return response.json();
};

// ---------- Schedule (admin) ----------
export const getAdminSchedule = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/schedule`, {
        headers: authHeaders(),
    });
    return response.json();
};

export const saveAdminSchedule = async (data) => {
    const response = await fetch(`${BASE_URL}/api/admin/schedule`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return response.json();
};

// ---------- User import / export (admin) ----------
export const importUsers = async (data) => {
    const response = await fetch(`${BASE_URL}/api/admin/users/import`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return response.json();
};

export const exportUsers = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/users/export`, {
        headers: authHeaders(),
    });
    return response.json();
};

// ---------- Public: newsletter / applications ----------
export const subscribeNewsletter = async (data) => {
    const response = await fetch(`${BASE_URL}/api/public/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
};

export const submitApplication = async (data) => {
    const response = await fetch(`${BASE_URL}/api/public/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
};

export const getApplicationStatus = async (code) => {
    const response = await fetch(`${BASE_URL}/api/public/applications/${encodeURIComponent(code)}`, {
        headers: { "Content-Type": "application/json" },
    });
    return response.json();
};
