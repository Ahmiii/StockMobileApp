import Card from "@/atoms/Card";
import Pill from "@/atoms/Pill";
import SectionHeader from "@/molecules/SectionHeader";
import { FlashList } from "@shopify/flash-list";
import { Pressable, Text, View } from "react-native";

type Tone = "success" | "danger" | "neutral";

const textClass: Record<Tone, string> = {
  success: "text-success",
  danger: "text-danger",
  neutral: "text-muted",
};

export type WatchItem = {
  symbol: string; // "PSO"
  name: string; // "Pakistan State Oil Company Limited"
  sector?: string; // "OIL & GAS MARKETING COMPANIES"
  /** Last price; null until the backend has a quote. */
  price: number | null;
  /** Day change in percent, e.g. 0.28 or -0.4; null with no quote. */
  change: number | null;
  /** Set when this price is older than the index's, e.g. "4 Sep". Shown under the change. */
  priceDate?: string;
};

export type Benchmark = {
  name: string; // "KSE-100 Index"
  price: number;
  change: number; // percent
};

type Props = {
  title?: string;
  items: WatchItem[];
  /** Shown under the title, e.g. the KSE-100 with its day change. */
  benchmark?: Benchmark;
  onAdd?: () => void;
  /** Called when a row is tapped, e.g. to open the stock's detail screen. */
  onPressItem?: (item: WatchItem) => void;
};

// The change is rounded to two decimals first, so the colour and the sign
// always agree with the text: -0.004 is "0.00%" in grey, not "-0.00%" in red.
const rounded = (change: number) => Number(change.toFixed(2));

const toneFor = (change: number | null): Tone => {
  if (change === null) return "neutral";
  if (rounded(change) > 0) return "success";
  if (rounded(change) < 0) return "danger";
  return "neutral";
};

const money = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatChange = (change: number) =>
  `${rounded(change) > 0 ? "+" : ""}${rounded(change).toFixed(2)}%`;

const Separator = () => <View className="h-3" />;

// Fills the screen. The list is the only scroller, so put this inside
// <Screen scroll={false}> rather than a scrolling Screen.
const Watchlist = ({ title = "Watchlist", items, benchmark, onAdd, onPressItem }: Props) => (
  <View className="flex-1 gap-3">
    <SectionHeader
      title={title}
      size="lg"
      color="foreground"
      right={
        <Pressable onPress={onAdd}>
          <Pill tone="primary">
            <Text className="text-sm font-semibold text-primary">+ Add</Text>
          </Pill>
        </Pressable>
      }
    />

    {benchmark ? (
      <View className="flex-row items-center gap-2">
        <Text className="text-sm text-muted">{benchmark.name}</Text>
        <Text className="text-sm font-semibold text-foreground">
          {money(benchmark.price)}
        </Text>
        <Text className={`text-sm font-semibold ${textClass[toneFor(benchmark.change)]}`}>
          {formatChange(benchmark.change)}
        </Text>
      </View>
    ) : null}

    <View className="flex-1">
      <FlashList
        data={items}
        keyExtractor={(item) => item.symbol}
        renderItem={({ item }) => {
          const tone = toneFor(item.change);
          return (
            <Pressable onPress={() => onPressItem?.(item)}>
              <Card bordered>
                <View className="flex-row items-center gap-3">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-foreground">{item.symbol}</Text>
                    <Text className="text-sm text-muted" numberOfLines={1}>
                      {item.name}
                    </Text>
                    {item.sector ? (
                      <Text className="text-xs text-muted" numberOfLines={1}>
                        {item.sector}
                      </Text>
                    ) : null}
                  </View>

                  <View className="items-end">
                    {item.price !== null ? (
                      <Text className="text-lg font-bold text-foreground">
                        {money(item.price)}
                      </Text>
                    ) : (
                      <Text className="text-sm text-muted">No price yet</Text>
                    )}
                    {item.change !== null ? (
                      <Text className={`text-sm font-semibold ${textClass[tone]}`}>
                        {formatChange(item.change)}
                      </Text>
                    ) : null}
                    {item.priceDate ? (
                      <Text className="text-xs text-muted">price from {item.priceDate}</Text>
                    ) : null}
                  </View>

                  <Text className="text-xl text-muted">›</Text>
                </View>
              </Card>
            </Pressable>
          );
        }}
        ItemSeparatorComponent={Separator}
        ListEmptyComponent={
          <Text className="text-muted">Nothing on your watchlist yet</Text>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  </View>
);

export default Watchlist;
