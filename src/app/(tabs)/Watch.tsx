import Skeleton from "@/atoms/Skeleton";
import Watchlist, { type WatchItem } from "@/organisms/Watchlist";
import { useWatchlist } from "@/queries/useWatchlist";
import Screen from "@/templates/Screen";
import { router } from "expo-router";
import { Text, View } from "react-native";

// Three grey rows while the first result loads. Cheap: no charts, no lists.
const WatchSkeleton = () => (
  <View className="gap-3">
    <Skeleton className="h-9 w-40" />
    <Skeleton className="h-4 w-48" />
    <Skeleton className="h-20 w-full rounded-2xl" />
    <Skeleton className="h-20 w-full rounded-2xl" />
    <Skeleton className="h-20 w-full rounded-2xl" />
  </View>
);

// The list is the screen's scroller, so the Screen itself must not scroll.
const Watch = () => {
  const { data, isPending, error } = useWatchlist();

  if (isPending) {
    return (
      <Screen scroll={false}>
        <WatchSkeleton />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen scroll={false}>
        <Text className="text-danger">{error.message}</Text>
      </Screen>
    );
  }

  // Chart and target are left out for now; the organism shows them only
  // when an item carries `trend` or `target`.
  const items: WatchItem[] = data.items.map((security) => ({
    symbol: security.symbol,
    name: security.companyName,
    sector: security.sector ?? undefined,
    price: security.lastPrice,
    change: security.changePct,
  }));

  const benchmark = {
    name: data.benchmark.companyName,
    price: data.benchmark.lastPrice ?? 0,
    change: data.benchmark.changePct ?? 0,
  };

  return (
    <Screen scroll={false}>
      <Watchlist
        items={items}
        benchmark={benchmark}
        onPressItem={(item) =>
          router.push({
            pathname: "/stock/[symbol]",
            params: { symbol: item.symbol, name: item.name },
          })
        }
      />
    </Screen>
  );
};

export default Watch;
