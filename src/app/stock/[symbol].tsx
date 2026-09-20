import type { TrendPeriod } from "@/apis/market";
import Label from "@/atoms/Label";
import Skeleton from "@/atoms/Skeleton";
import RangePicker, { type RangeOption } from "@/molecules/RangePicker";
import { isoDate } from "@/molecules/rangePickerShared";
import PerformanceCard from "@/organisms/PerformanceCard";
import StockStats, { type Stat } from "@/organisms/StockStats";
import StockSummaryCard from "@/organisms/StockSummaryCard";
import { useCorporateActions, useStockTrend } from "@/queries/useMarket";
import Screen from "@/templates/Screen";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

// What the trend endpoint accepts (1D isn't supported).
const PERIODS: RangeOption<TrendPeriod>[] = [
  { value: "1W", label: "1W" },
  { value: "1M", label: "1M" },
  { value: "3M", label: "3M" },
  { value: "6M", label: "6M" },
  { value: "1Y", label: "1Y" },
  { value: "3Y", label: "3Y" },
  { value: "5Y", label: "5Y" },
];

const PERIOD_LABEL: Record<TrendPeriod, string> = {
  "1W": "Last week",
  "1M": "Last month",
  "3M": "Last 3 months",
  "6M": "Last 6 months",
  "1Y": "Last year",
  "3Y": "Last 3 years",
  "5Y": "Last 5 years",
};

// How many months each period reaches back, to notice a stock with less history.
const PERIOD_MONTHS: Record<TrendPeriod, number> = {
  "1W": 0,
  "1M": 1,
  "3M": 3,
  "6M": 6,
  "1Y": 12,
  "3Y": 36,
  "5Y": 60,
};

const money = (n: number) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const percent = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(2)}%`;

const toneOf = (n: number) => {
  if (n > 0) return "success" as const;
  if (n < 0) return "danger" as const;
  return "neutral" as const;
};

// "2025-06-02" -> "2 Jun 2025"
const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// "2 for 1" for a split, "10% bonus" for a bonus issue.
const describeRatio = (type: string, ratio: number | null) => {
  if (ratio === null) return "";
  if (type === "BONUS_SHARE") return `${Number(((ratio - 1) * 100).toFixed(1))}% bonus`;
  return `${ratio} for 1`;
};

const DetailSkeleton = () => (
  <View className="gap-4">
    <Skeleton className="h-24 w-full rounded-2xl" />
    <Skeleton className="h-52 w-full rounded-2xl" />
    <Skeleton className="h-40 w-full rounded-2xl" />
  </View>
);

const StockDetail = () => {
  const { symbol = "", name } = useLocalSearchParams<{
    symbol: string;
    name?: string;
  }>();
  const [period, setPeriod] = useState<TrendPeriod>("6M");
  const { data, isPending, error } = useStockTrend(symbol, period);
  const { data: actions } = useCorporateActions(symbol);

  // Dividends and share-count events, as a small stats grid.
  // Today on the PSX calendar (Karachi), not the UTC date. A dividend that
  // goes ex today counts as paid, not as the next one, the same as the backend.
  const today = isoDate(new Date());
  const dividends = (actions ?? []).filter((a) => a.type === "DIVIDEND");
  const nextDividend = [...dividends].reverse().find((a) => a.exDate > today);
  const yearAgo = isoDate(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000));
  const trailingDps = dividends
    .filter((a) => a.exDate > yearAgo && a.exDate <= today)
    .reduce((sum, a) => sum + (a.amount ?? 0), 0);
  const lastShareEvent = (actions ?? []).find(
    (a) => a.type === "SPLIT" || a.type === "BONUS_SHARE",
  );
  const actionStats: Stat[] = [
    {
      label: "Next dividend",
      value: nextDividend
        ? `Rs ${(nextDividend.amount ?? 0).toFixed(2)} · ex ${longDate(nextDividend.exDate)}`
        : "none announced",
    },
    {
      label: "Paid last 12 months",
      value: `Rs ${trailingDps.toFixed(2)}/share`,
    },
    {
      label: "Last split / bonus",
      value: lastShareEvent
        ? `${describeRatio(lastShareEvent.type, lastShareEvent.ratio)} · ${longDate(lastShareEvent.exDate)}`
        : "none on record",
    },
    { label: "Dividends on record", value: String(dividends.length) },
  ];

  let body = null;

  if (isPending) {
    body = <DetailSkeleton />;
  } else if (error) {
    body = <Text className="text-danger">{error.message}</Text>;
  } else if (data.series.length > 1) {
    const series = data.series;
    const closes = series.map((point) => point.close);
    const first = closes[0];
    const last = closes[closes.length - 1];
    const high = Math.max(...closes);
    const low = Math.min(...closes);

    // Best and worst single-session moves in the period.
    // They start from the first move, not from zero: in a week with only
    // falling days the "best day" is the smallest fall, not 0.00%.
    let bestDay = (closes[1] / closes[0] - 1) * 100;
    let worstDay = bestDay;
    for (let i = 1; i < closes.length; i++) {
      const move = (closes[i] / closes[i - 1] - 1) * 100;
      if (move > bestDay) bestDay = move;
      if (move < worstDay) worstDay = move;
    }

    // The label comes from the answer, not from the chip just tapped: while a
    // new period loads, the old numbers stay on screen with their own label.
    // A stock listed later than the period reaches says since when.
    let periodLabel = PERIOD_LABEL[data.period];
    const expectedStart = new Date(data.range.to);
    expectedStart.setMonth(expectedStart.getMonth() - PERIOD_MONTHS[data.period]);
    expectedStart.setDate(expectedStart.getDate() + 21);
    if (data.period !== "1W" && data.range.from > expectedStart.toISOString().slice(0, 10)) {
      periodLabel = `Since ${longDate(data.range.from)}`;
    }

    const { stockReturn, benchmarkReturn, outperformance } = data.summary;

    const stats: Stat[] = [
      {
        label: `${symbol} return`,
        value: percent(stockReturn),
        tone: toneOf(stockReturn),
      },
      {
        label: "KSE-100 return",
        value: percent(benchmarkReturn),
        tone: toneOf(benchmarkReturn),
      },
      {
        label: "vs KSE-100",
        // a gap between two percentages is in points, not percent
        value: `${outperformance > 0 ? "+" : ""}${outperformance.toFixed(2)} pts`,
        tone: toneOf(outperformance),
      },
      { label: "Sessions", value: String(series.length) },
      { label: "Period high", value: money(high) },
      { label: "Period low", value: money(low) },
      { label: "Best day", value: percent(bestDay), tone: toneOf(bestDay) },
      { label: "Worst day", value: percent(worstDay), tone: toneOf(worstDay) },
      { label: "Start", value: money(first) },
      { label: "End", value: money(last) },
    ];

    body = (
      <>
        <StockSummaryCard
          price={data.lastClose ?? last}
          changeAmount={last - first}
          changePct={stockReturn}
          periodLabel={periodLabel}
          asOf={data.lastCloseDate ?? data.range.to}
        />

        <PerformanceCard
          period={periodLabel}
          delta={percent(stockReturn)}
          portfolio={series.map((point) => point.stock)}
          benchmark={series.map((point) => point.benchmark)}
          dates={series.map((point) => point.date)}
          portfolioName={symbol}
          benchmarkName="KSE-100"
          comparison={`${percent(outperformance)} vs KSE-100`}
        />

        <StockStats stats={stats} />

        {actions && actions.length > 0 ? (
          <StockStats title="DIVIDENDS & ACTIONS" stats={actionStats} />
        ) : null}
        {actions && actions.length === 0 ? (
          <Text className="text-sm text-muted">No dividend data for this stock.</Text>
        ) : null}
      </>
    );
  } else {
    body = <Text className="text-muted">Not enough data for this period.</Text>;
  }

  return (
    <Screen className="gap-4">
      <Stack.Screen options={{ title: symbol }} />

      <View className="gap-1">
        <Label size="lg" color="foreground">
          {symbol}
        </Label>
        {name ? <Text className="text-base text-muted">{name}</Text> : null}
      </View>

      <RangePicker options={PERIODS} value={period} onChange={setPeriod} />

      {body}
    </Screen>
  );
};

export default StockDetail;
