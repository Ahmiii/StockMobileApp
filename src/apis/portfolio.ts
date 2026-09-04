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

const getHoldings = async (portfolioId: string) => {
  const response = await client.get(`/portfolio/${portfolioId}/positions`);
  const positions: Position[] = response.data.data.positions;
  const summary: HoldingsSummary = response.data.data.summary;
  return { positions, summary };
};

export { getHoldings, getPortfolios };

