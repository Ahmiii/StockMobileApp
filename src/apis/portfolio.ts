import { client } from "./client";

export type Portfolio = {
  id: string;
  name: string;
  subtitle?: string;
  linked: boolean; // has a broker account behind it
};

type PortfolioItem = {
  id: string;
  userId: string;
  brokerAccountId: string | null;
  name: string;
  baseCurrency: string;
  createdAt: string;
};

// One position as the backend sends it (GET /portfolio/:id/positions).
export type Position = {
  id: string;
  portfolioId: string;
  symbol: string;
  companyName: string;
  quantity: number;
  avgCost: number;
  lastPrice: number;
  priceAsOf: string;
  previousClose: number | null; // the close before the latest one
  previousCloseDate: string | null; // its date, e.g. Friday on a Monday
  dayChange: number | null; // Rs, quantity × (lastPrice − previousClose); null when stale
  dayChangePct: number | null;
  investedValue: number;
  marketValue: number;
  unrealizedPnl: number;
  unrealizedPct: number | null;
  realizedPnl: number;
  trend: { date: string; close: number }[];
};

export type HoldingsSummary = {
  invested: number;
  marketValue: number;
  unrealizedPnl: number;
  unrealizedPct: number;
  dayChange: number | null; // Rs, across holdings priced on dayChangeAsOf
  dayChangePct: number | null;
  dayChangeAsOf: string | null; // the trading day the change belongs to
  dayChangeFrom: string | null; // the trading day it is measured from
  dayChangeCoverage: number | null; // % of market value that has a price for that day
  realizedPnl: number;
  openPositions: number;
  pricedPositions: number;
  unpricedPositions: number;
};

export type DateRange = { from: string; to: string }; // ISO dates

export type TradeItem = {
  id: string;
  portfolioId: string;
  side: "BUY" | "SELL";
  quantity: string;
  price: string;
  commission: string;
  netAmount: string;
  executedAt: string; // ISO date
  security: {
    symbol: string;
    companyName: string;
  };
};

export type TradesPage = {
  trades: TradeItem[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
};

export type BenchmarkPoint = {
  date: string;
  portfolio: number; // time-weighted, 100 at the first trade, dividends included
  benchmark: number; // KSE-100 rebased the same way, credited with index dividends
  value: number; // holdings worth that day, in Rs
  netCashIn: number; // buys − sells so far, in Rs
  dividends: number; // dividends received so far, in Rs
};

export type BenchmarkPosition = {
  symbol: string;
  quantity: number;
  avgCost: number;
  lastPrice: number;
  dividendsPerShare: number; // received since buyDate, in today's share units
  buyDate: string; // cost-weighted, moved to the next trading day
  stockReturn: number; // price change plus dividends, on avgCost
  benchmarkReturn: number; // KSE-100 over the same window
  alpha: number; // stockReturn − benchmarkReturn
  costBasis: number;
  weight: number; // % of total cost
};

export type Benchmark = {
  asOf: string;
  window: { from: string; to: string; tradingDays: number };
  headline: {
    netCashIn: number;
    portfolio: number; // what the holdings are worth today
    dividends: number; // dividends received over the whole history
    portfolioWithDividends: number; // holdings + dividends kept as cash
    benchmark: number; // what the same cash in KSE-100 would be worth
    difference: number; // portfolioWithDividends − benchmark
    portfolioReturnOnCash: number;
    benchmarkReturnOnCash: number;
  };
  timeWeighted: {
    portfolio: number;
    benchmark: number;
    alpha: number;
    maxDrawdown: { portfolio: number; benchmark: number };
  };
  moneyWeighted: { portfolioXirr: number; benchmarkXirr: number };
  phases: {
    from: string;
    to: string;
    portfolio: number;
    benchmark: number;
    netCashInAtEnd: number;
  }[];
  series: BenchmarkPoint[];
  positions: BenchmarkPosition[];
};

export type Money = { gross: number; net: number };

export type DividendByStock = {
  symbol: string;
  dividends: number; // how many payouts
  rupees: number; // total received from this stock
};

export type DividendRecord = {
  symbol: string;
  exDate: string; // ISO, e.g. "2024-08-12T00:00:00.000Z"
  perShare: number; // Rs per share
  shares: number; // shares held on the ex-date
  rupees: number; // perShare × shares
};

export type Dividends = {
  total: number; // Rs, all stocks, all time
  byStock: DividendByStock[];
  dividends: DividendRecord[]; // newest first
};

const getPortfolios = async (): Promise<Portfolio[]> => {
  const response = await client.get("/portfolio/list");
  const items: PortfolioItem[] = response.data.data.portfoliolist;

  return items.map((item) => ({
    id: item.id,
    name: item.name,
    subtitle: item.brokerAccountId
      ? `${item.baseCurrency} · Linked to broker`
      : `${item.baseCurrency} · Not linked`,
    linked: item.brokerAccountId !== null,
  }));
};

const getHoldings = async (portfolioId: string, range?: DateRange) => {
  const response = await client.get(`/portfolio/${portfolioId}/position-list`, {
    params: range,
  });
  const positions: Position[] = response.data.data.positions;
  const summary: HoldingsSummary = response.data.data.summary;
  const usedRange: DateRange = response.data.data.range;
  return { positions, summary, range: usedRange };
};

const getTrades = async (portfolioId: string, offset: number, limit = 50) => {
  const response = await client.get(`/portfolio/${portfolioId}/trade-list`, {
    params: { limit, offset },
  });
  const page: TradesPage = response.data.data;
  return page;
};

const getBenchmark = async (portfolioId: string) => {
  const response = await client.get(`/portfolio/${portfolioId}/benchmark`);
  const benchmark: Benchmark = response.data.data;
  return benchmark;
};

const getDividends = async (portfolioId: string) => {
  const response = await client.get(
    `/portfolio/${portfolioId}/dividend-income`,
  );
  const dividends: Dividends = response.data.data;
  return dividends;
};

export { getBenchmark, getDividends, getHoldings, getPortfolios, getTrades };
