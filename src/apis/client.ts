import axios from "axios";
import { router } from "expo-router";
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
      if (error.response?.status === 401 && authToken) {
        setAuthToken(null);
        router.replace("/welcome");
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
