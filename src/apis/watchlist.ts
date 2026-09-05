import { client } from "./client";

// One security as the backend sends it (GET /watchlist). Price fields are
// null until the backend has a quote for it.
export type WatchlistSecurity = {
  securityId: string;
  symbol: string;
  companyName: string;
  sector: string | null;
  lastPrice: number | null;
  change: number | null;
  changePct: number | null;
  asOf: string | null;
};

export type WatchlistData = {
  benchmark: WatchlistSecurity;
  items: WatchlistSecurity[];
};

const getWatchlist = async () => {
  const response = await client.get("/watchlist");
  const data: WatchlistData = response.data.data;
  return data;
};

export { getWatchlist };
