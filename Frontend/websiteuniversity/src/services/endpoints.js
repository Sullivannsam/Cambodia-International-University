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
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
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
    const response = await fetch(`${BASE_URL}/api/admin/attendance/students`, {
        headers: authHeaders(),
    });
    return response.json();
};

// ---------- Teacher Attendance ----------
export const getTeacherAttendance = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/attendance/teachers`, {
        headers: authHeaders(),
    });
    return response.json();
};

// ---------- Income / Earnings ----------
export const getIncomeData = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/income`, {
        headers: authHeaders(),
    });
    return response.json();
};

export const getEarnings = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/earnings`, {
        headers: authHeaders(),
    });
    return response.json();
};

// ---------- Fee Groups ----------
export const getFeeGroups = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/fee-groups`, {
        headers: authHeaders(),
    });
    return response.json();
};

// ---------- Fee Group Members ----------
export const getFeeGroupMembers = async (group) => {
    const response = await fetch(`${BASE_URL}/api/admin/fee-groups/${encodeURIComponent(group)}`, {
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

// ---------- Email Verification ----------
export const verifyEmail = async (data) => {
    const response = await fetch(`${BASE_URL}/api/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
