import axios from "axios";
import * as SecureStore from "expo-secure-store";

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

const TOKEN_KEY = "authToken";
let authToken: string | null = null;

// Kept in memory for requests and on disk for the next launch.
export const setAuthToken = (token: string | null) => {
  authToken = token;
  const persist = token
    ? SecureStore.setItemAsync(TOKEN_KEY, token)
    : SecureStore.deleteItemAsync(TOKEN_KEY);
  persist.catch(() => {});
};

export const loadAuthToken = async () => {
  authToken = await SecureStore.getItemAsync(TOKEN_KEY).catch(() => null);
  return authToken;
};

// False once the backend has rejected the token and it was cleared.
export const hasAuthToken = () => authToken !== null;

// ---- session expiry -------------------------------------------------------
// The API layer knows nothing about screens or caches, so when the backend
// rejects a token it just announces it. The root layout listens and does the
// app-side work: clear cached data and go back to sign-in.

type Listener = () => void;
const sessionExpiredListeners = new Set<Listener>();

export const onSessionExpired = (listener: Listener) => {
  sessionExpiredListeners.add(listener);
  return () => {
    sessionExpiredListeners.delete(listener);
  };
};

// Several requests can fail with 401 at once; only the first one matters.
const sessionExpired = () => {
  if (!authToken) return;
  setAuthToken(null);
  sessionExpiredListeners.forEach((listener) => listener());
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
      // A rejected token means sign in again. A failed sign-in (no token yet)
      // just shows its message.
      if (error.response?.status === 401) {
        sessionExpired();
      }
      const data = error.response?.data;
      const message =
        data?.error ??
        data?.message ??
        error.message ??
        "Something went wrong. Please try again.";
      return Promise.reject(new Error(message));
    }
    return Promise.reject(error);
  },
);
