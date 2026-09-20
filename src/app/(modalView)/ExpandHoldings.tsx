import { Position } from "@/apis/portfolio";
import HoldingsSection, { type Holding } from "@/organisms/HoldingsSection";
import { useHoldings, usePortfolioId } from "@/queries/usePortfolios";
import { router } from "expo-router";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
const formatMoney = (amount: number, decimals = 0) =>
  amount.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

const formatPercent = (percent: number, decimals = 1) =>
  `${percent > 0 ? "+" : ""}${percent.toFixed(decimals)}%`;

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const staleLabel = (priceAsOf: string | null) => {
  if (!priceAsOf) return "no price yet";
  const age = Date.now() - new Date(priceAsOf).getTime();
  return age > ONE_WEEK_MS ? `price from ${formatDate(priceAsOf)}` : undefined;
};

const toHolding = (position: Position): Holding => {
  const closes = [...position.trend]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((point) => point.close);
  const stale = staleLabel(position.priceAsOf);

  const toneOf = (amount: number) => {
    if (amount > 0) return "success" as const;
    if (amount < 0) return "danger" as const;
    return "neutral" as const;
  };

  // A stock with no price yet has no last price and no value.
  let price = "—";
  let value = "—";
  if (position.lastPrice !== null && position.marketValue !== null) {
    price = formatMoney(position.lastPrice, 2);
    value = `Rs ${formatMoney(position.marketValue, 2)}`;
  }

  return {
    symbol: position.symbol,
    name: position.companyName,
    detail: `${formatMoney(position.quantity)} @ ${formatMoney(position.avgCost, 2)}`,
    price,
    value,
    change: formatPercent(position.unrealizedPct ?? 0, 2),
    tone: toneOf(position.unrealizedPnl ?? 0),
    trend: stale ? undefined : closes,
    stale,
  };
};

const ExpandHoldings = () => {
  const portfolioId = usePortfolioId();

  const { data: holdingsData, isPending } = useHoldings(portfolioId);
  const holdings = (holdingsData?.positions ?? [])
    .filter((position) => position.quantity > 0)
    .map(toHolding);
  return (
    <HoldingsSection
      holdings={holdings}
      height={1000}
      onPressItem={(holding) =>
        router.push({
          pathname: "/stock/[symbol]",
          params: { symbol: holding.symbol, name: holding.name },
        })
      }
    />
  );
};
export default ExpandHoldings;
