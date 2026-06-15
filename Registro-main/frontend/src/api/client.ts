import axios from "axios";

const STORAGE_KEY = "registro_token";

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ??
    "https://registro-production-e4c8.up.railway.app/api",
});

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem(STORAGE_KEY, token);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function getAuthToken(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      setAuthToken(null);
      // Evita bucles si ya estamos en login.
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

/** Extrae un mensaje de error legible de una respuesta de Axios. */
export function getApiErrorMessage(error: unknown, fallback = "Ocurrió un error."): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
}
