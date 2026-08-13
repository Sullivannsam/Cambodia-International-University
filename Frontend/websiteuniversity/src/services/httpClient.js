const BASE_URL = process.env.REACT_APP_API_URL || "https://cambodia-international-university.onrender.com";

const getHeaders = () => ({
    "Content-Type": "application/json",
    ...(sessionStorage.getItem("token") && {
        "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
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

// GET request
export const get = async (path) => {
    const response = await fetch(`${BASE_URL}${path}`, {
        method: "GET",
        headers: getHeaders(),
    });
    return parse(response);
};

// POST request
export const post = async (path, body) => {
    const response = await fetch(`${BASE_URL}${path}`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(body),
    });
    return parse(response);
};

// PUT request
export const put = async (path, body) => {
    const response = await fetch(`${BASE_URL}${path}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(body),
    });
    return parse(response);
};

// DELETE request
export const del = async (path) => {
    const response = await fetch(`${BASE_URL}${path}`, {
        method: "DELETE",
        headers: getHeaders(),
    });
    return parse(response);
};
