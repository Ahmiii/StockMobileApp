import { client } from "./client";

// One daily bar as the backend sends it (GET /market/prices/:symbol).
export type PriceBar = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

// GET /market/prices/KSE100?from=2021-08-31&to=2026-08-31
// Without from/to the backend returns the last year.
const getIndexPrices = async (symbol: string, from?: string, to?: string) => {
  const query = from && to ? `?from=${from}&to=${to}` : "";
  const response = await client.get(`/market/prices/${symbol}${query}`);
  const bars: PriceBar[] = response.data.data.bars;
  return bars;
};

export { getIndexPrices };
