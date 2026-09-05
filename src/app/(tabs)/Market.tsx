import MarketIndexCard from "@/organisms/MarketIndexCard";
import SectorsToday, { type Sector } from "@/organisms/SectorsToday";
import StocksVsIndex, { type StockComparison } from "@/organisms/StocksVsIndex";
import { useIndexPrices } from "@/queries/useMarket";
import { useHoldings, usePortfolios } from "@/queries/usePortfolios";
import Screen from "@/templates/Screen";

// Placeholder until there is a sectors endpoint.
const SECTORS: Sector[] = [
  { name: "Banking", change: 1.2 },
  { name: "E&P", change: 1.0 },
  { name: "Cement", change: 0.8 },
  { name: "Fertilizer", change: 0.3 },
  { name: "Power", change: -0.4 },
  { name: "Technology", change: -0.7 },
];

// 147832.64 -> "147,832.64"
const money = (n: number, decimals = 0) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

const signed = (n: number, decimals = 2) =>
  `${n > 0 ? "+" : ""}${money(n, decimals)}`;

// 407266609 -> "407M"
const compact = (n: number) => {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${Math.round(n / 1e6)}M`;
  return money(n);
};

// Rebase a series so it starts at 100, so a stock and the index share a scale.
const rebase = (values: number[]) => {
  const first = values[0] || 1;
  return values.map((value) => (value / first) * 100);
};

const Market = () => {
  const { data: bars } = useIndexPrices("KSE100");
  const { data: portfolios } = usePortfolios();
  const { data: holdings } = useHoldings(portfolios?.[1]?.id ?? "");

  const openPositions = (holdings?.positions ?? []).filter(
    (position) => position.quantity > 0,
  );

  // The index over the same window as the holdings' trends (30 trading days).
  const days = openPositions[0]?.trend.length || 30;
  const recentBars = (bars ?? []).slice(-days);
  const indexCloses = recentBars.map((bar) => bar.close);
  const indexRebased = rebase(indexCloses);

  // Index card: last close, change vs the previous close, and a few stats.
  const last = recentBars[recentBars.length - 1];
  const previous = recentBars[recentBars.length - 2];
  const dayChange = last && previous ? last.close - previous.close : 0;
  const dayChangePct = previous ? (dayChange / previous.close) * 100 : 0;
  const windowHigh = Math.max(...recentBars.map((bar) => bar.high));
  const windowLow = Math.min(...recentBars.map((bar) => bar.low));

  // Each holding against the index over the same window.
  const stocks: StockComparison[] = openPositions.map((position) => {
    // Oldest first, whatever order the backend sends. With newest first the
    // change would come out with the wrong sign.
    const closes = [...position.trend]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((point) => point.close);
    const first = closes[0] || 1;
    const changePct = ((closes[closes.length - 1] ?? first) / first - 1) * 100;
    return {
      symbol: position.symbol,
      name: position.companyName,
      change: `${signed(changePct, 1)}%`,
      tone: changePct < 0 ? "danger" : "success",
      trend: rebase(closes),
      benchmark: indexRebased,
    };
  });

  return (
    <Screen>
      {last ? (
        <MarketIndexCard
          name="KSE-100"
          value={money(last.close, 2)}
          change={`${signed(dayChange)} · ${signed(dayChangePct)}%`}
          tone={dayChange < 0 ? "danger" : "success"}
          trend={indexCloses}
          stats={[
            { label: "Volume", value: compact(last.volume) },
            { label: `${days}d high`, value: money(windowHigh) },
            { label: `${days}d low`, value: money(windowLow) },
          ]}
        />
      ) : null}

      <StocksVsIndex stocks={stocks} />

      <SectorsToday sectors={SECTORS} />
    </Screen>
  );
};

export default Market;
