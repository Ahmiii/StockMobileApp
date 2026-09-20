import Skeleton from "@/atoms/Skeleton";
import TradeHistory, { type Trade } from "@/organisms/TradeHistory";
import { usePortfolioId, useTrades } from "@/queries/usePortfolios";
import Screen from "@/templates/Screen";
import { Text, View } from "react-native";

// "2026-08-21T00:00:00.000Z" -> "21 Aug 2026". The backend sends the trade's
// calendar date at midnight UTC, so it is read as UTC on every phone.
const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

// Grey rows while the first page loads, instead of "0 executions".
const TradesSkeleton = () => (
  <View className="gap-3">
    <Skeleton className="h-9 w-32" />
    <Skeleton className="h-4 w-56" />
    <Skeleton className="h-16 w-full rounded-2xl" />
    <Skeleton className="h-16 w-full rounded-2xl" />
    <Skeleton className="h-16 w-full rounded-2xl" />
  </View>
);

const Trades = () => {
  const { data, isPending, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useTrades(usePortfolioId());

  if (isPending) {
    return (
      <Screen scroll={false}>
        <TradesSkeleton />
      </Screen>
    );
  }

  // Only when there is nothing to show: a failed refresh keeps the old list.
  if (error && !data) {
    return (
      <Screen scroll={false}>
        <Text className="text-danger">{error.message}</Text>
      </Screen>
    );
  }

  // Flatten the pages into one list, mapped to what TradeHistory renders.
  const trades: Trade[] = (data?.pages ?? [])
    .flatMap((page) => page.trades)
    .map((trade) => ({
      id: trade.id,
      symbol: trade.security.symbol,
      side: trade.side === "BUY" ? "buy" : "sell",
      quantity: Number(trade.quantity),
      price: Number(trade.price),
      total: Number(trade.netAmount),
      date: shortDate(trade.executedAt),
    }));

  const total = data?.pages[0]?.pagination.total ?? trades.length;

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // The list is the screen's scroller, so the Screen itself must not scroll.
  return (
    <Screen scroll={false}>
      <TradeHistory
        source="AHL eTrade"
        trades={trades}
        total={total}
        onEndReached={loadMore}
        isLoadingMore={isFetchingNextPage}
      />
    </Screen>
  );
};

export default Trades;
