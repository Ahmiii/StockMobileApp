import { client } from "./client";

export type Portfolio = {
  id: string;
  name: string;
  subtitle?: string;
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

export { getHoldings, getPortfolios, getTrades };

