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

// `range` bounds each position's trend. Without it the backend returns the
// last year. It echoes the range it used in the response.
const getHoldings = async (portfolioId: string, range?: DateRange) => {
  const response = await client.get(`/portfolio/${portfolioId}/position-list`, {
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
  const response = await client.get(`/portfolio/${portfolioId}/trade-list`, {
    params: { limit, offset },
  });
  const page: TradesPage = response.data.data;
  return page;
};

// GET /portfolio/:id/benchmark — the whole history since the first trade.
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

const getBenchmark = async (portfolioId: string) => {
  const response = await client.get(`/portfolio/${portfolioId}/benchmark`);
  const benchmark: Benchmark = response.data.data;
  return benchmark;
};

// GET /portfolio/:id/income — dividend income worked out from trades and the
// recorded dividends. Rupees; `net` is after withholding tax (`taxRate`).
export type Money = { gross: number; net: number };

export type UpcomingDividend = {
  symbol: string;
  exDate: string;
  buyBefore: string; // last weekday before the ex-date
  amount: number; // Rs per share
  held: boolean; // false for a watchlist-only stock
  shares: number;
  expected: Money | null;
};

export type IncomeHolding = {
  symbol: string;
  shares: number;
  avgCost: number;
  lastPrice: number | null;
  trailingDps: number; // dividend per share, last 12 months
  projected: number; // shares × trailingDps
  yieldOnCost: number | null; // percent
  currentYield: number | null; // percent
  thisYear: number; // gross, this fiscal year
  nextExDate: string | null;
};

export type Income = {
  thisYear: Money & { fiscalYear: number; dividends: number };
  lastTwelveMonths: Money & { dividends: number };
  projected: Money & {
    yieldOnCost: number | null;
    currentYield: number | null;
  };
  byYear: (Money & { fiscalYear: number })[];
  upcoming: UpcomingDividend[];
  holdings: IncomeHolding[];
  entitled: {
    symbol: string;
    exDate: string;
    amount: number;
    shares: number;
    gross: number;
    net: number;
  }[];
  taxRate: number;
};

export type Dividends = {
  total: number;
  byStock: [];
  dividends: [];
};

const getIncome = async (portfolioId: string) => {
  const response = await client.get(
    `/portfolio/${portfolioId}/dividend-income`,
  );
  const income: Income = response.data.data;
  return income;
};

const getDividends = async (portfolioId: string) => {
  const response = await client.get(
    `/portfolio/${portfolioId}/dividend-income`,
  );
  const dividends: Dividends = response.data.data;
  return dividends;
};

export {
  getBenchmark,
  getDividends,
  getHoldings,
  getIncome,
  getPortfolios,
  getTrades
};

