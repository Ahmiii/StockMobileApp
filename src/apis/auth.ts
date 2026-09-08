import type { Href } from "expo-router";
import { client, setAuthToken } from "./client";

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

const linkBrokerAccount = async (body: BrokerAccountRequest) => {
  const response = await client.post("/broker/accounts", body);
  return response.data.data;
};

// GET /broker/accounts — the broker accounts already linked to this user.
const getBrokerAccounts = async () => {
  const response = await client.get("/broker/accounts");
  const accounts: { id: string; clientCode: string }[] = response.data.data.accounts;
  return accounts;
};

// Where a signed-in user lands: the tabs if a broker is linked, else the
// screen to link one.
const routeAfterLogin = async (): Promise<Href> => {
  const accounts = await getBrokerAccounts();
  return accounts.length > 0 ? "/Portfolio" : "/link-broker";
};

export { getBrokerAccounts, linkBrokerAccount, login, logout, routeAfterLogin };
