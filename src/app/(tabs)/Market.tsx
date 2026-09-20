import Skeleton from "@/atoms/Skeleton";
import { rangeDates } from "@/molecules/RangePicker";
import MarketIndexCard from "@/organisms/MarketIndexCard";
import StocksVsIndex, { type StockComparison } from "@/organisms/StocksVsIndex";
import { useIndexPrices } from "@/queries/useMarket";
import { useHoldings, usePortfolioId } from "@/queries/usePortfolios";
import Screen from "@/templates/Screen";
import { Text } from "react-native";

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
  // One month for both, so the sparklines and the index card share a window.
  const dates = rangeDates("1M");
  const indexQuery = useIndexPrices("KSE100", dates.from, dates.to);
  const holdingsQuery = useHoldings(usePortfolioId(), dates);
  const bars = indexQuery.data;
  const holdings = holdingsQuery.data;

  // Held, and priced in this window — a stock with no recent bars has nothing to compare.
  const openPositions = (holdings?.positions ?? []).filter(
    (position) => position.quantity > 0 && position.trend.length > 1,
  );

  // Every index day of the month, not a count taken from one of the stocks.
  const recentBars = bars ?? [];
  const indexCloses = recentBars.map((bar) => bar.close);
  const indexCloseOn: Record<string, number> = {};
  for (const bar of recentBars) {
    indexCloseOn[bar.date] = bar.close;
  }

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
    const points = [...position.trend].sort((a, b) => a.date.localeCompare(b.date));
    const closes = points.map((point) => point.close);
    // The index on exactly the days this stock has a price, so the two lines
    // cover the same days even for a stock that did not trade every day.
    const indexOnSameDays = [];
    for (const point of points) {
      if (indexCloseOn[point.date] !== undefined) {
        indexOnSameDays.push(indexCloseOn[point.date]);
      }
    }
    const first = closes[0] || 1;
    const changePct = ((closes[closes.length - 1] ?? first) / first - 1) * 100;
    return {
      symbol: position.symbol,
      name: position.companyName,
      change: `${signed(changePct, 1)}%`,
      tone: changePct < 0 ? "danger" : "success",
      trend: rebase(closes),
      benchmark: rebase(indexOnSameDays),
    };
  });

  // Grey blocks while loading, and the message when a request failed, instead
  // of an empty "no stocks" list.
  if (indexQuery.isPending || holdingsQuery.isPending) {
    return (
      <Screen>
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-72 w-full rounded-2xl" />
      </Screen>
    );
  }
  const failed = indexQuery.error ?? holdingsQuery.error;
  if (failed && (!bars || !holdings)) {
    return (
      <Screen>
        <Text className="text-danger">{failed.message}</Text>
      </Screen>
    );
  }

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
            { label: "1M high", value: money(windowHigh) },
            { label: "1M low", value: money(windowLow) },
          ]}
        />
      ) : null}

      <StocksVsIndex title="YOUR STOCKS VS KSE-100 · 1 MONTH" stocks={stocks} />
    </Screen>
  );
};

export default Market;
