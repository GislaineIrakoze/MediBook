export async function apiRequest(path, options = {}) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
  const requestPath = path.startsWith("/") ? path : `/${path}`;
  const url = apiBaseUrl ? `${apiBaseUrl}${requestPath}` : requestPath;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "object"
        ? payload.error || payload.message || "Request failed"
        : payload || "Request failed";
    throw new Error(message);
  }

  return payload;
}

export function saveSession(session) {
  if (typeof window === "undefined") return;
  localStorage.setItem("medibook-session", JSON.stringify(session));
}

export function readSession() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("medibook-session");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("medibook-session");
}
