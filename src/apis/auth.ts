import type { Href } from "expo-router";
import { client, setAuthToken } from "./client";

// ---- types -----------------------------------------------------------------

export type LoginRequest = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  fullName: string;
  email: string;
};

export type BrokerAccountRequest = {
  accountNumber: string;
  password: string;
};

export type BrokerAccount = {
  id: string;
  clientCode: string;
  syncStatus: "idle" | "syncing" | "error" | "disconnected";
  lastSyncedAt: string | null; // ISO timestamp of the last successful sync
};

// ---- functions -------------------------------------------------------------

// POST /auth/login
const login = async (body: LoginRequest) => {
  const response = await client.post("/auth/login", body);
  if (response.data.message !== "success") {
    throw new Error("Login failed");
  }
  const { user, token } = response.data.data;
  setAuthToken(token);
  return { user, token };
};

const logout = () => {
  setAuthToken(null);
};

// POST /broker/accounts, then the first import of trades, holdings and prices.
// Without the import a newly linked account shows an empty Rs 0 portfolio until
// the evening job. It talks to the broker and the price provider for every
// stock, so it gets minutes, not the usual 15 seconds. If the import fails the
// link still counts: the portfolio header then says "Last sync failed".
const linkBrokerAccount = async (body: BrokerAccountRequest) => {
  const response = await client.post("/broker/accounts", body);
  const linked = response.data.data;
  try {
    await client.post(`/broker/accounts/${linked.brokerAccountId}/full-sync`, undefined, {
      timeout: 300_000,
    });
  } catch {
    // the evening job will try again
  }
  return linked;
};

// GET /broker/accounts — the broker accounts already linked to this user.
const getBrokerAccounts = async () => {
  const response = await client.get("/broker/accounts");
  const accounts: BrokerAccount[] = response.data.data.accounts;
  return accounts;
};

// Where a signed-in user lands: the tabs if a broker is linked, else the
// screen to link one.
const routeAfterLogin = async (): Promise<Href> => {
  const accounts = await getBrokerAccounts();
  return accounts.length > 0 ? "/Portfolio" : "/link-broker";
};

export { getBrokerAccounts, linkBrokerAccount, login, logout, routeAfterLogin };
