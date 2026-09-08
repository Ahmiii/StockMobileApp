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

const getPortfolios = async (): Promise<Portfolio[]> => {
  const response = await client.get("/portfolio/getPortfolioList");
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
  realizedPnl: number;
  openPositions: number;
  pricedPositions: number;
  unpricedPositions: number;
};

export type DateRange = { from: string; to: string }; // ISO dates

// `range` bounds each position's trend. Without it the backend returns the
// last year. It echoes the range it used in the response.
const getHoldings = async (portfolioId: string, range?: DateRange) => {
  const response = await client.get(`/portfolio/${portfolioId}/positions`, {
    params: range,
  });
  const positions: Position[] = response.data.data.positions;
  const summary: HoldingsSummary = response.data.data.summary;
  const usedRange: DateRange = response.data.data.range;
  return { positions, summary, range: usedRange };
};

// One trade as the backend sends it (GET /portfolio/:id/trades).
// Numbers arrive as strings; convert with Number() where they are used.
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

const getTrades = async (portfolioId: string, offset: number, limit = 50) => {
  const response = await client.get(`/portfolio/${portfolioId}/trades`, {
    params: { limit, offset },
  });
  const page: TradesPage = response.data.data;
  return page;
};

// GET /portfolio/:id/benchmark — the whole history since the first trade.
export type BenchmarkPoint = {
  date: string;
  portfolio: number; // time-weighted, 100 at the first trade
  benchmark: number; // KSE-100 rebased the same way
  value: number; // holdings worth that day, in Rs
  netCashIn: number; // buys − sells so far, in Rs
};

export type BenchmarkPosition = {
  symbol: string;
  quantity: number;
  avgCost: number;
  lastPrice: number;
  buyDate: string; // cost-weighted, moved to the next trading day
  stockReturn: number;
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
    benchmark: number; // what the same cash in KSE-100 would be worth
    difference: number;
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

const getBenchmark = async (portfolioId: string) => {
  const response = await client.get(`/portfolio/${portfolioId}/benchmark`);
  const benchmark: Benchmark = response.data.data;
  return benchmark;
};

export { getBenchmark, getHoldings, getPortfolios, getTrades };

