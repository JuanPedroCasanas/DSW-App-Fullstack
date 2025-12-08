const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') || '';
const basePort = import.meta.env.VITE_API_BASE_PORT || '';

export const API_BASE = basePort
  ? `${baseUrl}:${basePort}`
  : baseUrl;
