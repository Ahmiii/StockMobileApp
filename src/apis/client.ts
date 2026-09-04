import axios from "axios";
const baseURL = process.env.EXPO_PUBLIC_BASE_URL;

if (!baseURL) {
  throw new Error(
    "EXPO_PUBLIC_BASE_URL is missing from .env (restart Metro after adding it)",
  );
}

export const client = axios.create({
  baseURL,
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};
client.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        setAuthToken(null);
      }
      const message =
        error.response?.data?.message ??
        error.message ??
        "Something went wrong. Please try again.";
      return Promise.reject(new Error(message));
    }
    return Promise.reject(error);
  },
);
