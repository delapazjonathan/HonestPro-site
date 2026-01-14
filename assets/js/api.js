// assets/js/api.js
(function () {
  const API_BASE_URL = window.HP_API_BASE_URL || "http://localhost:3000";

  async function request(path, { method = "GET", body, headers = {} } = {}) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      credentials: "include", // IMPORTANT for cookie-based sessions
      body: body ? JSON.stringify(body) : undefined,
    });

    const contentType = res.headers.get("content-type") || "";
    const data = contentType.includes("application/json") ? await res.json() : null;

    if (!res.ok) {
      const err = new Error(data?.error || `Request failed: ${res.status}`);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  }

  window.HPApi = {
    get: (path) => request(path),
    post: (path, body) => request(path, { method: "POST", body }),
  };
})();
