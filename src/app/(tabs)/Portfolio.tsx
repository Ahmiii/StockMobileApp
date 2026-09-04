import HoldingsSection, { type Holding } from "@/organisms/HoldingsSection";
import InvestPnL from "@/organisms/Invest&PnL";
import PerformanceCard from "@/organisms/PerformanceCard";
import PortfolioHeader from "@/organisms/PortfolioHeader";
import PortfolioSummary from "@/organisms/PortfolioSummary";
import { useIndexPrices } from "@/queries/useMarket";
import { useHoldings, usePortfolios } from "@/queries/usePortfolios";
import Screen from "@/templates/Screen";

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
  const { data: portfolios } = usePortfolios();
  const { data } = useHoldings(portfolios?.[1]?.id ?? "");
  const { data: bars } = useIndexPrices("KSE100");
  const summary = data?.summary;

  // Closed positions (quantity 0) only carry realized P&L; leave them out.
  const openPositions = (data?.positions ?? []).filter(
    (position) => position.quantity > 0,
  );

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

  // The index over the same number of days.
  const indexValues = (bars ?? []).slice(-days).map((bar) => bar.close);

  const portfolioTrend = rebase(portfolioValues);
  const benchmarkTrend = rebase(indexValues);
  const portfolioPct = (portfolioTrend[portfolioTrend.length - 1] ?? 100) - 100;
  const indexPct = (benchmarkTrend[benchmarkTrend.length - 1] ?? 100) - 100;
  const hasPerformance = portfolioTrend.length > 1 && benchmarkTrend.length > 1;

  return (
    <Screen>
      <PortfolioHeader syncLabel="Sync now" />
      <PortfolioSummary
        value="Rs 0.00"
        change={{ amount: "Rs 2,745", percent: "+0.48", caption: "today" }}
      />

      {hasPerformance ? (
        <PerformanceCard
          period={`Last ${days} days`}
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
