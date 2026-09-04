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

const getIndexPrices = async (symbol: string) => {
  const response = await client.get(`/market/prices/${symbol}`);
  const bars: PriceBar[] = response.data.data.bars;
  return bars;
};

export { getIndexPrices };
