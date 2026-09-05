import TradeHistory, { type Trade } from "@/organisms/TradeHistory";
import { usePortfolios, useTrades } from "@/queries/usePortfolios";
import Screen from "@/templates/Screen";

// "2026-08-21T00:00:00.000Z" -> "21 Aug 2026"
const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const Trades = () => {
  const { data: portfolios } = usePortfolios();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useTrades(
    portfolios?.[1]?.id ?? "",
  );

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
