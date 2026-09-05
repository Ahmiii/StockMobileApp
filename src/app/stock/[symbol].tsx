import Label from "@/atoms/Label";
import Skeleton from "@/atoms/Skeleton";
import type { TrendPeriod } from "@/apis/market";
import RangePicker, { type RangeOption } from "@/molecules/RangePicker";
import PerformanceCard from "@/organisms/PerformanceCard";
import StockStats, { type Stat } from "@/organisms/StockStats";
import StockSummaryCard from "@/organisms/StockSummaryCard";
import { useStockTrend } from "@/queries/useMarket";
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

const money = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const percent = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(2)}%`;

const toneOf = (n: number) => {
  if (n > 0) return "success" as const;
  if (n < 0) return "danger" as const;
  return "neutral" as const;
};

const DetailSkeleton = () => (
  <View className="gap-4">
    <Skeleton className="h-24 w-full rounded-2xl" />
    <Skeleton className="h-52 w-full rounded-2xl" />
    <Skeleton className="h-40 w-full rounded-2xl" />
  </View>
);

const StockDetail = () => {
  const { symbol = "", name } = useLocalSearchParams<{ symbol: string; name?: string }>();
  const [period, setPeriod] = useState<TrendPeriod>("6M");
  const { data, isPending, error } = useStockTrend(symbol, period);

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
    let bestDay = 0;
    let worstDay = 0;
    for (let i = 1; i < closes.length; i++) {
      const move = (closes[i] / closes[i - 1] - 1) * 100;
      if (move > bestDay) bestDay = move;
      if (move < worstDay) worstDay = move;
    }

    const { stockReturn, benchmarkReturn, outperformance } = data.summary;

    const stats: Stat[] = [
      { label: `${symbol} return`, value: percent(stockReturn), tone: toneOf(stockReturn) },
      { label: "KSE-100 return", value: percent(benchmarkReturn), tone: toneOf(benchmarkReturn) },
      { label: "vs KSE-100", value: percent(outperformance), tone: toneOf(outperformance) },
      { label: "Sessions", value: String(series.length) },
      { label: "Period high", value: money(high) },
      { label: "Period low", value: money(low) },
      { label: "Best day", value: percent(bestDay), tone: "success" },
      { label: "Worst day", value: percent(worstDay), tone: "danger" },
      { label: "Start", value: money(first) },
      { label: "End", value: money(last) },
    ];

    body = (
      <>
        <StockSummaryCard
          price={last}
          changeAmount={last - first}
          changePct={stockReturn}
          periodLabel={PERIOD_LABEL[period]}
          asOf={data.range.to}
        />

        <PerformanceCard
          period={PERIOD_LABEL[period]}
          delta={percent(stockReturn)}
          portfolio={series.map((point) => point.stock)}
          benchmark={series.map((point) => point.benchmark)}
          dates={series.map((point) => point.date)}
          portfolioName={symbol}
          benchmarkName="KSE-100"
          comparison={`${percent(outperformance)} vs KSE-100`}
        />

        <StockStats stats={stats} />
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
