const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "/api";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function request<T>(
  path: string,
  options: RequestInit & { method?: HttpMethod } = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} – ${text || res.statusText}`);
  }
  // Si no hay body (204), evitá JSON.parse
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  // agregá put/patch/delete si lo necesitás
};

// Ejemplo de uso:
// const health = await api.get<{ ok: boolean }>("/health");
