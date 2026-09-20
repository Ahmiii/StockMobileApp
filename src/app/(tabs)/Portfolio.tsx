import type { BrokerAccount } from "@/apis/auth";
import type { Position } from "@/apis/portfolio";
import Button from "@/atoms/Button";
import { isoDate } from "@/molecules/rangePickerShared";
import RangePicker, {
  PERIOD_LABEL,
  RANGES,
  rangeDates,
  type Range,
} from "@/molecules/RangePicker";
import AllocationCard from "@/organisms/AllocationCard";
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
  usePortfolioId,
  usePortfolios,
} from "@/queries/usePortfolios";
import Screen from "@/templates/Screen";
import { router } from "expo-router";
import { useState } from "react";
import { Text } from "react-native";

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

// "Synced 8 Sep, 17:32" in green, or why there is nothing to show in grey or red.
// `loading` is true until the accounts have answered, so the pill does not say
// "No broker linked" for a moment on every launch.
const syncStatusFor = (account: BrokerAccount | undefined, loading: boolean) => {
  if (loading) return { label: "Checking sync…", tone: "neutral" as const };
  if (!account) return { label: "No broker linked", tone: "neutral" as const };
  if (account.syncStatus === "syncing") return { label: "Syncing…", tone: "neutral" as const };
  if (account.syncStatus === "error") return { label: "Last sync failed", tone: "danger" as const };
  if (account.syncStatus === "disconnected") return { label: "Broker disconnected", tone: "neutral" as const };
  if (!account.lastSyncedAt) return { label: "Not synced yet", tone: "neutral" as const };
  const at = new Date(account.lastSyncedAt).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  return { label: `Synced ${at}`, tone: "success" as const };
};

// One row of the holdings list.
const toHolding = (position: Position): Holding => {
  const closes = [...position.trend]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((point) => point.close);
  const stale = staleLabel(position.priceAsOf);

  // A stock with no price yet has no last price and no value.
  let price = "—";
  let value = "—";
  if (position.lastPrice !== null && position.marketValue !== null) {
    price = formatMoney(position.lastPrice, 2);
    value = `Rs ${formatMoney(position.marketValue, 2)}`;
  }

  // The small line is coloured by its own direction over the range. The
  // percentage next to it is since you bought, and keeps its own colour.
  let trendTone = toneOf(0);
  if (closes.length > 1) {
    trendTone = toneOf(closes[closes.length - 1] - closes[0]);
  }

  return {
    symbol: position.symbol,
    name: position.companyName,
    detail: `${formatMoney(position.quantity)} @ ${formatMoney(position.avgCost, 2)}`,
    price,
    value,
    change: formatPercent(position.unrealizedPct ?? 0, 2),
    tone: toneOf(position.unrealizedPnl ?? 0),
    trendTone,
    trend: stale ? undefined : closes,
    stale,
  };
};

// ---- screen ----------------------------------------------------------------

const Portfolio = () => {
  const [range, setRange] = useState<Range>("1Y");
  const [showing, setShowing] = useState<"today" | "sinceBought">("today");
  const portfolioId = usePortfolioId();
  const { error: portfoliosError, refetch: loadPortfoliosAgain } = usePortfolios();
  const { data: brokerAccounts, isPending: accountsLoading } = useBrokerAccounts();
  const syncStatus = syncStatusFor(brokerAccounts?.[0], accountsLoading);

  // 1. Portfolio vs KSE100 for the whole history. Both lines start at 100 on
  //    the first trade, and money added never moves the portfolio line.
  const { data: benchmark } = useBenchmark(portfolioId);
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
  const {
    data: holdingsData,
    isPending,
    error: holdingsError,
    refetch: loadHoldingsAgain,
  } = useHoldings(portfolioId, dates);
  const summary = holdingsData?.summary;
  // Biggest holding first, the same order the allocation card uses.
  const openPositions = (holdingsData?.positions ?? [])
    .filter((position) => position.quantity > 0)
    .sort((a, b) => (b.marketValue ?? 0) - (a.marketValue ?? 0));
  const holdings = openPositions.map(toHolding);

  // 4. Chart: the part of the history inside the range, rebased to 100 on
  //    the range's first day so it reads as "return over this range".
  //    When the range starts on a day with no trading (a weekend), the chart
  //    starts from the trading day before it. Otherwise the first day's move
  //    would be left out: "last week" opened on a Sunday would skip Monday.
  const series = benchmark?.series ?? [];
  let firstIndex = series.findIndex((point) => point.date >= dates.from);
  if (firstIndex === -1) {
    firstIndex = series.length;
  }
  if (firstIndex > 0 && firstIndex < series.length && series[firstIndex].date > dates.from) {
    firstIndex = firstIndex - 1;
  }
  const points = series.slice(firstIndex);
  const portfolioLine = rebase(points.map((point) => point.portfolio));
  const indexLine = rebase(points.map((point) => point.benchmark));
  const portfolioChange =
    (portfolioLine[portfolioLine.length - 1] ?? 100) - 100;
  const indexChange = (indexLine[indexLine.length - 1] ?? 100) - 100;

  // Without the list of portfolios there is no portfolio to load, and the
  // grey loading blocks would stay forever.
  if (portfoliosError && portfolioId === "") {
    return (
      <Screen>
        <PortfolioHeader syncLabel={syncStatus.label} syncTone={syncStatus.tone} />
        <Text className="text-danger">{portfoliosError.message}</Text>
        <Button label="Try again" variant="solid" onPress={() => loadPortfoliosAgain()} />
      </Screen>
    );
  }

  if (isPending) {
    return (
      <Screen>
        <PortfolioHeader syncLabel={syncStatus.label} syncTone={syncStatus.tone} />
        <PortfolioSkeleton />
      </Screen>
    );
  }

  // A request that failed must not be drawn as a portfolio worth Rs 0.
  if (holdingsError && !holdingsData) {
    return (
      <Screen>
        <PortfolioHeader syncLabel={syncStatus.label} syncTone={syncStatus.tone} />
        <Text className="text-danger">{holdingsError.message}</Text>
        <Button label="Try again" variant="solid" onPress={() => loadHoldingsAgain()} />
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
  // Today on the PSX calendar (Karachi), not the UTC date, which is still
  // yesterday between midnight and 5 am.
  const todayIso = isoDate(new Date());
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
      <PortfolioHeader syncLabel={syncStatus.label} syncTone={syncStatus.tone} />

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
        // Empty until the dividends have loaded, so the chip stays hidden instead of showing "NaN".
        totalDividend={dividends ? formatMoney(dividends.total) : ""}
      />

      <HoldingsSection
        holdings={holdings}
        onPressItem={(holding) =>
          router.push({
            pathname: "/stock/[symbol]",
            params: { symbol: holding.symbol, name: holding.name },
          })
        }
      />
      <AllocationCard positions={openPositions} />
    </Screen>
  );
};

export default Portfolio;
