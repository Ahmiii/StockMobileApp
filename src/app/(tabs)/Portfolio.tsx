import type { BrokerAccount } from "@/apis/auth";
import type { Position } from "@/apis/portfolio";
import RangePicker, {
  PERIOD_LABEL,
  RANGES,
  rangeDates,
  type Range,
} from "@/molecules/RangePicker";
import HoldingsSection, { type Holding } from "@/organisms/HoldingsSection";
import InvestPnL from "@/organisms/Invest&PnL";
import PerformanceCard from "@/organisms/PerformanceCard";
import PortfolioHeader from "@/organisms/PortfolioHeader";
import PortfolioSkeleton from "@/organisms/PortfolioSkeleton";
import PortfolioSummary from "@/organisms/PortfolioSummary";
import { useBrokerAccounts } from "@/queries/useBrokerAccounts";
import {
  useBenchmark,
  useDividends,
  useHoldings,
  usePortfolioId
} from "@/queries/usePortfolios";
import Screen from "@/templates/Screen";
import { router } from "expo-router";
import { useState } from "react";

// ---- formatting helpers ----------------------------------------------------

// 1855.92 -> "1,855.92"
const formatMoney = (amount: number, decimals = 0) =>
  amount.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

// 2.13 -> "+2.1%"
const formatPercent = (percent: number, decimals = 1) =>
  `${percent > 0 ? "+" : ""}${percent.toFixed(decimals)}%`;

// "2025-01-03" -> "3 Jan 2025"
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const toneOf = (amount: number) => {
  if (amount > 0) return "success" as const;
  if (amount < 0) return "danger" as const;
  return "neutral" as const;
};

// Makes a series start at 100 on its first point.
const rebase = (values: number[]) => {
  const first = values[0] || 1;
  return values.map((value) => (value / first) * 100);
};

// A price older than a week is shown as a date instead of a sparkline.
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const staleLabel = (priceAsOf: string | null) => {
  if (!priceAsOf) return "no price yet";
  const age = Date.now() - new Date(priceAsOf).getTime();
  return age > ONE_WEEK_MS ? `price from ${formatDate(priceAsOf)}` : undefined;
};

// "Synced 8 Sep, 17:32", or why there is nothing to show.
const syncLabelFor = (account?: BrokerAccount) => {
  if (!account) return "No broker linked";
  if (account.syncStatus === "syncing") return "Syncing…";
  if (account.syncStatus === "error") return "Last sync failed";
  if (!account.lastSyncedAt) return "Not synced yet";
  const at = new Date(account.lastSyncedAt).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  return `Synced ${at}`;
};

// One row of the holdings list.
const toHolding = (position: Position): Holding => {
  const closes = [...position.trend]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((point) => point.close);
  const stale = staleLabel(position.priceAsOf);

  return {
    symbol: position.symbol,
    name: position.companyName,
    detail: `${position.quantity} @ ${formatMoney(position.avgCost, 2)}`,
    price: formatMoney(position.lastPrice, 2),
    value: `Rs ${formatMoney(position.marketValue, 2)}`,
    change: formatPercent(position.unrealizedPct ?? 0, 2),
    tone: toneOf(position.unrealizedPnl),
    trend: stale ? undefined : closes,
    stale,
  };
};

// ---- screen ----------------------------------------------------------------

const Portfolio = () => {
  const [range, setRange] = useState<Range>("1Y");
  const [showing, setShowing] = useState<"today" | "sinceBought">("today");
  const portfolioId = usePortfolioId();
  const { data: brokerAccounts } = useBrokerAccounts();
  const syncLabel = syncLabelFor(brokerAccounts?.[0]);

  // 1. Portfolio vs KSE100 for the whole history. Both lines start at 100 on
  //    the first trade, and money added never moves the portfolio line.
  const { data: benchmark } = useBenchmark(portfolioId);
  // const { data: income } = useIncome(portfolioId);
  const { data: dividends } = useDividends(portfolioId);
  const firstTradeDate = benchmark?.window.from;
  // 2. Range chips. A chip that starts before the first trade would draw the
  //    same chart as "All", so it is hidden until the history is long enough.
  const chips = RANGES.filter(
    (chip) =>
      chip.value === "All" ||
      !firstTradeDate ||
      rangeDates(chip.value).from >= firstTradeDate,
  );
  const activeRange = chips.some((chip) => chip.value === range)
    ? range
    : "All";
  const dates = rangeDates(activeRange, firstTradeDate);

  // 3. Holdings for that range (the sparklines use the range's bars).
  const { data: holdingsData, isPending } = useHoldings(portfolioId, dates);
  const summary = holdingsData?.summary;
  const holdings = (holdingsData?.positions ?? [])
    .filter((position) => position.quantity > 0)
    .map(toHolding);

  // 4. Chart: the part of the history inside the range, rebased to 100 on
  //    the range's first day so it reads as "return over this range".
  const points = (benchmark?.series ?? []).filter(
    (point) => point.date >= dates.from,
  );
  const portfolioLine = rebase(points.map((point) => point.portfolio));
  const indexLine = rebase(points.map((point) => point.benchmark));
  const portfolioChange =
    (portfolioLine[portfolioLine.length - 1] ?? 100) - 100;
  const indexChange = (indexLine[indexLine.length - 1] ?? 100) - 100;

  if (isPending) {
    return (
      <Screen>
        <PortfolioHeader syncLabel={syncLabel} />
        <PortfolioSkeleton />
      </Screen>
    );
  }

  const unrealized = summary?.unrealizedPnl ?? 0;

  // "+Rs 6,810" or "-Rs 6,810"
  const rupeesWithSign = (amount: number) =>
    `${amount < 0 ? "-" : "+"}Rs ${formatMoney(Math.abs(amount))}`;

  // Two ways to read the change: today against yesterday, or since you bought
  // what you hold. The badge shows one, the line under it shows the other, and
  // a tap on the badge swaps them. Without a fresh price there is no "today".
  const hasToday =
    summary?.dayChange != null && Boolean(summary?.dayChangeAsOf);
  // "Today vs previous day Sep 4, 2026". Names both days, so a Monday never
  // says "yesterday", and says the price date instead of "Today" when the
  // latest price is older than today. Adds a note when some holdings lack it.
  const usDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  const todayIso = new Date().toISOString().slice(0, 10);
  const asOfLabel =
    summary?.dayChangeAsOf === todayIso
      ? "Portfolio today"
      : usDate(summary?.dayChangeAsOf ?? todayIso);
  const comparedWith = summary?.dayChangeFrom
    ? `${asOfLabel} vs previous day ${usDate(summary.dayChangeFrom)} change `
    : `${asOfLabel} vs previous close`;
  const todayLabel = hasToday
    ? summary.dayChangeCoverage !== null && summary.dayChangeCoverage < 95
      ? `${comparedWith} · ${Math.round(summary.dayChangeCoverage)}% of holdings`
      : comparedWith
    : "";
  const today = hasToday
    ? {
        amount: rupeesWithSign(summary.dayChange!),
        percent: formatPercent(summary.dayChangePct ?? 0),
        caption: todayLabel,
        tone: toneOf(summary.dayChange!),
      }
    : null;
  const sinceBought = {
    amount: rupeesWithSign(unrealized),
    percent: formatPercent(summary?.unrealizedPct ?? 0),
    caption: "since you bought",
    tone: toneOf(unrealized),
  };
  const badge = showing === "today" && today ? today : sinceBought;
  const otherLine =
    showing === "today" && today
      ? `${sinceBought.amount} · ${sinceBought.percent} since you bought`
      : today
        ? `${today.amount} · ${today.percent} ${todayLabel}`
        : undefined;

  return (
    <Screen>
      <PortfolioHeader syncLabel={syncLabel} />

      <PortfolioSummary
        value={`Rs ${formatMoney(summary?.marketValue ?? 0, 2)}`}
        change={badge}
        secondary={otherLine}
        onPressChange={
          today
            ? () => setShowing(showing === "today" ? "sinceBought" : "today")
            : undefined
        }
      />

      <RangePicker options={chips} value={activeRange} onChange={setRange} />

      {points.length > 1 ? (
        <PerformanceCard
          period={PERIOD_LABEL[activeRange]}
          delta={formatPercent(portfolioChange)}
          portfolio={portfolioLine}
          benchmark={indexLine}
          dates={points.map((point) => point.date)}
          benchmarkName="KSE-100"
          comparison={`${formatPercent(portfolioChange - indexChange)} vs KSE-100`}
        />
      ) : null}

      <InvestPnL
        invested={Math.round(summary?.invested ?? 0)}
        unrealizedPnl={Math.round(unrealized)}
        totalDividend={formatMoney(Number(dividends?.total))}
      />

      {/* {income ? <IncomeCard income={income} /> : null} */}

      <HoldingsSection
        holdings={holdings}
        onPressItem={(holding) =>
          router.push({
            pathname: "/stock/[symbol]",
            params: { symbol: holding.symbol, name: holding.name },
          })
        }
      />
    </Screen>
  );
};

export default Portfolio;
