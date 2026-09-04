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
  if (response.data.status !== "success") {
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

export { linkBrokerAccount, login, logout };
