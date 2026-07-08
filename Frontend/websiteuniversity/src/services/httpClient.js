const BASE_URL = process.env.REACT_APP_API_URL;

const getHeaders = () => ({
    "Content-Type": "application/json",
    ...(localStorage.getItem("token") && {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
    }),
});

// GET request
export const get = async (path) => {
    const response = await fetch(`${BASE_URL}${path}`, {
        method: "GET",
        headers: getHeaders(),
    });
    return response.json();
};

// POST request
export const post = async (path, body) => {
    const response = await fetch(`${BASE_URL}${path}`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(body),
    });
    return response.json();
};

// PUT request
export const put = async (path, body) => {
    const response = await fetch(`${BASE_URL}${path}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(body),
    });
    return response.json();
};

// DELETE request
export const del = async (path) => {
    const response = await fetch(`${BASE_URL}${path}`, {
        method: "DELETE",
        headers: getHeaders(),
    });
    return response.json();
};
