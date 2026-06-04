
const BASE_URL = "http://localhost:8080";

export const getContact = async () => {
    const response = await fetch(`${BASE_URL}/api/contact`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.json();
};

export const sendContact = async (data) => {
    const response = await fetch(`${BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return response.json();
};
