import Badge from "@/atoms/Badge";
import Card from "@/atoms/Card";
import Divider from "@/atoms/Divider";
import Label from "@/atoms/Label";
import FilterChips, { type FilterOption } from "@/molecules/FilterChips";
import { FlashList } from "@shopify/flash-list";
import { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useCSSVariable } from "uniwind";

export type Trade = {
  id: string;
  symbol: string; // "FFC"
  side: "buy" | "sell";
  quantity: number; // 100
  price: number; // 191.2
  /** Amount paid or received, fees included. */
  total: number; // 19149
  date: string; // "26 Aug 2026"
};

type Filter = "all" | "buy" | "sell";

const FILTERS: FilterOption<Filter>[] = [
  { value: "all", label: "All" },
  { value: "buy", label: "Buys" },
  { value: "sell", label: "Sells" },
];

type Props = {
  title?: string;
  source: string;
  trades: Trade[];
  /** Total on the server, when the list is paginated and not all loaded yet. */
  total?: number;
  /** Called when the list scrolls near the end; load the next page here. */
  onEndReached?: () => void;
  isLoadingMore?: boolean;
};

const money = (n: number, decimals = 0) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

const Separator = () => <Divider className="my-3" />;

const TradeHistory = ({
  title = "Trades",
  source,
  trades,
  total,
  onEndReached,
  isLoadingMore = false,
}: Props) => {
  const [filter, setFilter] = useState<Filter>("all");
  const [primary] = useCSSVariable(["--color-primary"]);

  const visible =
    filter === "all" ? trades : trades.filter((trade) => trade.side === filter);

  return (
    <View className="flex-1 gap-4">
      <View className="gap-1">
        <Label size="lg" color="foreground">
          {title}
        </Label>
        <Text className="text-base text-muted">
          Synced from {source} · {total ?? trades.length} executions
        </Text>
      </View>

      <FilterChips options={FILTERS} value={filter} onChange={setFilter} />

      <Card bordered className="mb-4 flex-1">
        <FlashList
          data={visible}
          keyExtractor={(trade) => trade.id}
          renderItem={({ item }) => {
            const isBuy = item.side === "buy";
            return (
              <View className="flex-row items-center gap-4">
                <Badge
                  label={isBuy ? "B" : "S"}
                  tone={isBuy ? "success" : "danger"}
                />

                <View className="flex-1">
                  <Text className="text-lg text-muted" numberOfLines={1}>
                    <Text className="font-bold text-foreground">
                      {item.symbol}
                    </Text>{" "}
                    {item.quantity} @ {money(item.price, 2)}
                  </Text>
                  <Text className="text-base text-muted">{item.date}</Text>
                </View>

                <View className="items-end">
                  <Text className="text-lg font-bold text-foreground">
                    Rs {money(item.total)}
                  </Text>
                  <Text className="text-sm text-muted">incl. fees</Text>
                </View>
              </View>
            );
          }}
          ItemSeparatorComponent={Separator}
          ListEmptyComponent={
            <Text className="text-muted">No trades to show</Text>
          }
          // Fires when the last rows come into view; the screen loads the next page.
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoadingMore ? (
              <ActivityIndicator className="py-4" color={String(primary)} />
            ) : null
          }
          showsVerticalScrollIndicator={false}
        />
      </Card>
    </View>
  );
};

export default TradeHistory;
