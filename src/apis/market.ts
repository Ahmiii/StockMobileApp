import { client } from "./client";

// ---- types -----------------------------------------------------------------

// One daily bar as the backend sends it (GET /market/prices/:symbol).
export type PriceBar = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

// What the trend endpoint accepts as ?period= (GET /market/trend/:symbol).
export type TrendPeriod = "1W" | "1M" | "3M" | "6M" | "1Y" | "3Y" | "5Y";

export type TrendPoint = {
  date: string; // "2026-03-09"
  close: number; // the stock's close
  stock: number; // rebased to 100 at the first point
  benchmark: number; // KSE-100, rebased the same way
};

export type StockTrend = {
  symbol: string;
  period: TrendPeriod;
  range: { from: string; to: string };
  series: TrendPoint[];
  summary: {
    stockReturn: number; // percent over the period
    benchmarkReturn: number;
    outperformance: number; // stockReturn - benchmarkReturn
  };
};

// One search hit (GET /market/securities?q=).
export type Security = {
  id: string;
  symbol: string;
  companyName: string;
  sector: string | null;
};

// One event (GET /market/payout/:symbol), newest first.
export type CorporateAction = {
  type: "DIVIDEND" | "BONUS_SHARE" | "RIGHT_SHARE" | "SPLIT" | "MERGER";
  exDate: string;
  ratio: number | null; // new shares per old (bonus, split, merger)
  amount: number | null; // Rs per share (dividend) or rights price
  toSymbol: string | null;
  source: string;
};

// ---- functions -------------------------------------------------------------

// GET /market/prices/KSE100?from=2021-08-31&to=2026-08-31
// Without from/to the backend returns the last year.
const getIndexPrices = async (symbol: string, from?: string, to?: string) => {
  const query = from && to ? `?from=${from}&to=${to}` : "";
  const response = await client.get(`/market/prices/${symbol}${query}`);
  const bars: PriceBar[] = response.data.data.bars;
  return bars;
};

// GET /market/trend/PSO?period=6M
const getStockTrend = async (symbol: string, period: TrendPeriod) => {
  const response = await client.get(`/market/trend/${symbol}?period=${period}`);
  const trend: StockTrend = response.data.data;
  return trend;
};

// GET /market/securities?q=pso
const searchSecurities = async (query: string) => {
  const response = await client.get(
    `/market/securities?q=${encodeURIComponent(query)}`,
  );
  const securities: Security[] = response.data.data?.securities ?? [];
  return securities;
};

// GET /market/payout/PSO — dividends, bonus, splits, newest first. Reads our
// table only; the nightly sync keeps it filled.
const getCorporateActions = async (symbol: string) => {
  const response = await client.get(`/market/payout/${symbol}`);
  const actions: CorporateAction[] = response.data.data.actions;
  return actions;
};

export { getCorporateActions, getIndexPrices, getStockTrend, searchSecurities };
