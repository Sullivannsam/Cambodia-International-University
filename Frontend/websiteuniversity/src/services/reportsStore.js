const KEY = "ciu_reports_v1";

const readAll = () => {
    try {
        const raw = localStorage.getItem(KEY);
        const arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? arr : [];
    } catch {
        return [];
    }
};

const writeAll = (reports) => {
    localStorage.setItem(KEY, JSON.stringify(reports));
};

export const getReportsLocal = () => readAll();

export const submitReport = (data) => {
    const reports = readAll();
    const report = {
        id: Date.now(),
        reporterRole: data.reporterRole || "",
        reporterEmail: data.reporterEmail || "",
        reporterName: data.reporterName || "",
        subjectRole: data.subjectRole || "",
        subjectEmail: data.subjectEmail || "",
        subjectName: data.subjectName || "",
        category: data.category || "Other",
        description: data.description || "",
        date: data.date || new Date().toISOString().slice(0, 10),
        read: false,
    };
    reports.unshift(report);
    writeAll(reports);
    return report;
};

export const setReportRead = (id, read) => {
    writeAll(readAll().map((r) => (r.id === id ? { ...r, read } : r)));
};

export const clearReports = () => {
    localStorage.removeItem(KEY);
};
