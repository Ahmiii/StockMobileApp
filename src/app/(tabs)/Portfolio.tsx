import RangePicker, {
  PERIOD_LABEL,
  rangeDates,
  type Range,
} from "@/molecules/RangePicker";
import HoldingsSection, { type Holding } from "@/organisms/HoldingsSection";
import InvestPnL from "@/organisms/Invest&PnL";
import PerformanceCard from "@/organisms/PerformanceCard";
import PortfolioHeader from "@/organisms/PortfolioHeader";
import PortfolioSkeleton from "@/organisms/PortfolioSkeleton";
import PortfolioSummary from "@/organisms/PortfolioSummary";
import { useIndexPrices } from "@/queries/useMarket";
import { useHoldings, usePortfolios } from "@/queries/usePortfolios";
import Screen from "@/templates/Screen";
import { useState } from "react";

// 1855.92 -> "1,855.92"
const money = (n: number, decimals = 0) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

const toneOf = (n: number) => {
  if (n > 0) return "success" as const;
  if (n < 0) return "danger" as const;
  return "neutral" as const;
};

// Rebase a series so it starts at 100. The performance chart draws both
// lines on one scale, so the portfolio (Rs millions) and the index
// (150,000 points) have to be brought to the same footing first.
const rebase = (values: number[]) => {
  const first = values[0] || 1;
  return values.map((value) => (value / first) * 100);
};

const signed = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;

const Portfolio = () => {
  const [range, setRange] = useState<Range>("1Y");
  const dates = rangeDates(range);

  const { data: portfolios } = usePortfolios();
  // isPending is true until the first holdings result for this range arrives,
  // including while we're still waiting on the portfolio id.
  const { data, isPending } = useHoldings(portfolios?.[1]?.id ?? "", dates);
  // Fetch five years of the index once; every picked range is a slice of it.
  const indexDates = rangeDates("5Y");
  const { data: bars } = useIndexPrices("KSE100", indexDates.from, indexDates.to);
  const summary = data?.summary;

  const openPositions = (data?.positions ?? [])
    .filter((position) => position.quantity > 0)
    .map((position) => ({
      ...position,
      trend: [...position.trend].sort((a, b) => a.date.localeCompare(b.date)),
    }));

  const holdings: Holding[] = openPositions.map((position) => {
    const pct = position.unrealizedPct ?? 0;
    return {
      symbol: position.symbol,
      name: position.companyName,
      detail: `${position.quantity} @ ${money(position.avgCost, 2)}`,
      price: money(position.lastPrice, 2),
      value: `Rs ${money(position.marketValue, 2)}`,
      change: `${pct > 0 ? "+" : ""}${money(pct, 2)}%`,
      tone: toneOf(position.unrealizedPnl),
      trend: position.trend.map((point) => point.close),
    };
  });

  // Portfolio value per day: sum of quantity × close across holdings, over
  // the days the backend returned for the picked range.
  const days = openPositions[0]?.trend.length ?? 0;
  const portfolioValues: number[] = [];
  for (let day = 0; day < days; day++) {
    let total = 0;
    for (const position of openPositions) {
      const close = position.trend[day]?.close ?? position.lastPrice;
      total += position.quantity * close;
    }
    portfolioValues.push(total);
  }

  // The index over the same dates, so both lines cover the picked range.
  const indexValues = (bars ?? [])
    .filter((bar) => bar.date >= dates.from && bar.date <= dates.to)
    .map((bar) => bar.close);

  const portfolioTrend = rebase(portfolioValues);
  const benchmarkTrend = rebase(indexValues);
  const portfolioPct = (portfolioTrend[portfolioTrend.length - 1] ?? 100) - 100;
  const indexPct = (benchmarkTrend[benchmarkTrend.length - 1] ?? 100) - 100;
  const hasPerformance = portfolioTrend.length > 1 && benchmarkTrend.length > 1;

  if (isPending) {
    return (
      <Screen>
        <PortfolioHeader syncLabel="Sync now" />
        <PortfolioSkeleton />
      </Screen>
    );
  }

  return (
    <Screen>
      <PortfolioHeader syncLabel="Sync now" />
      <PortfolioSummary
        value="Rs 0.00"
        change={{ amount: "Rs 2,745", percent: "+0.48", caption: "today" }}
      />

      <RangePicker value={range} onChange={setRange} />

      {hasPerformance ? (
        <PerformanceCard
          period={PERIOD_LABEL[range]}
          delta={signed(portfolioPct)}
          portfolio={portfolioTrend}
          benchmark={benchmarkTrend}
          dates={openPositions[0]?.trend.map((point) => point.date) ?? []}
          benchmarkName="KSE-100"
          comparison={`${signed(portfolioPct - indexPct)} vs KSE-100`}
        />
      ) : null}

      <InvestPnL
        invested={Math.round(summary?.invested ?? 0)}
        unrealizedPnl={Math.round(summary?.unrealizedPnl ?? 0)}
      />

      <HoldingsSection holdings={holdings} />
    </Screen>
  );
};

export default Portfolio;
