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
  benchmark: WatchlistSecurity | null; // null before the first price sync

  items: WatchlistSecurity[];
};

const getWatchlist = async () => {
  const response = await client.get("/watchlist");
  const data: WatchlistData = response.data.data;
  return data;
};

// POST /watchlist/:securityId
// The backend saves the stock first and then loads five years of prices for it
// before it answers, which can take longer than the usual 15 seconds.
const addToWatchlist = async (securityId: string) => {
  await client.post(`/watchlist/${securityId}`, undefined, { timeout: 60_000 });
};

export { addToWatchlist, getWatchlist };
