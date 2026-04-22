const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Centralized fetch wrapper with credentials, JSON handling,
 * and automatic token refresh on 401.
 */
const api = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;

  const config = {
    credentials: "include", // send cookies cross-origin
    headers: {
      ...(options.body instanceof FormData
        ? {} // let browser set Content-Type for FormData
        : { "Content-Type": "application/json" }),
      ...options.headers,
    },
    ...options,
  };

  console.log(`API Request: ${config.method} ${url}`, {
    body: config.body,
    headers: config.headers,
  });

  let res = await fetch(url, config);

  // If access token expired and it wasn't a login/refresh request, try refreshing once
  const isAuthRequest = endpoint.includes("/auth/login") || endpoint.includes("/auth/refresh-token") || endpoint.includes("/auth/signup");

  if (res.status === 401 && !isAuthRequest) {
    const refreshRes = await fetch(`${API_BASE}/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      // Retry original request with new cookies
      res = await fetch(url, config);
    } else {
      // Refresh failed — force logout
      const err = new Error("Session expired. Please log in again.");
      err.status = 401;
      throw err;
    }
  }

  const data = await res.json();

  if (!res.ok || data.success === false) {
    const err = new Error(data.message || "Something went wrong");
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
};

// ── Convenience methods ──────────────────────────────────────────────────────

export const get = (endpoint) => api(endpoint, { method: "GET" });

export const post = (endpoint, body) =>
  api(endpoint, {
    method: "POST",
    body: body instanceof FormData ? body : JSON.stringify(body),
  });

export const put = (endpoint, body) =>
  api(endpoint, {
    method: "PUT",
    body: body instanceof FormData ? body : JSON.stringify(body),
  });

export const patch = (endpoint, body) =>
  api(endpoint, {
    method: "PATCH",
    body: body instanceof FormData ? body : JSON.stringify(body),
  });

export const del = (endpoint) => api(endpoint, { method: "DELETE" });

export const postFormData = (endpoint, formData) =>
  api(endpoint, {
    method: "POST",
    body: formData,
    headers: {}, // let browser set multipart boundary
  });

export const putFormData = (endpoint, formData) =>
  api(endpoint, {
    method: "PUT",
    body: formData,
    headers: {},
  });

export { API_BASE };
export default api;
