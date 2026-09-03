import Card from "@/atoms/Card";
import Divider from "@/atoms/Divider";
import Pill from "@/atoms/Pill";
import ProgressBar from "@/atoms/ProgressBar";
import SectionHeader from "@/molecules/SectionHeader";
import TrendChart from "@/molecules/TrendChart";
import { FlashList } from "@shopify/flash-list";
import { Pressable, Text, View } from "react-native";
import { useCSSVariable } from "uniwind";

type Tone = "success" | "danger" | "neutral";

const textClass: Record<Tone, string> = {
  success: "text-success",
  danger: "text-danger",
  neutral: "text-muted",
};

export type WatchItem = {
  symbol: string; // "HBL"
  name: string; // "Habib Bank"
  price: number; // 245.6
  /** Day change in percent, e.g. 1.1 or -0.4. */
  change: number;
  /** Price target. Progress is price / target. */
  target: number; // 280
  /** Recent prices for the sparkline, oldest first. */
  trend: number[];
};

type Props = {
  title?: string;
  items: WatchItem[];
  onAdd?: () => void;
};

const toneFor = (change: number): Tone => {
  if (change > 0) return "success";
  if (change < 0) return "danger";
  return "neutral";
};

const formatChange = (change: number) =>
  `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;

const Separator = () => <View className="h-3" />;

// Fills the screen. The list is the only scroller, so put this inside
// <Screen scroll={false}> rather than a scrolling Screen.
const Watchlist = ({ title = "Watchlist", items, onAdd }: Props) => {
  // Skia's Canvas takes colors, not classes, so read the tokens directly.
  const [success, danger, muted, primary, secondary] = useCSSVariable([
    "--color-success",
    "--color-danger",
    "--color-muted",
    "--color-primary",
    "--color-secondary",
  ]);
  const lineColor: Record<Tone, string> = {
    success: String(success),
    danger: String(danger),
    neutral: String(muted),
  };
  const barColor = String(primary);
  const trackColor = String(secondary);

  return (
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

      <View className="flex-1">
        <FlashList
          data={items}
          keyExtractor={(item) => item.symbol}
          renderItem={({ item }) => {
            const tone = toneFor(item.change);
            const progress = item.price / item.target;
            return (
              <Card bordered className="gap-3">
                <View className="flex-row items-center gap-3">
                  <View className="w-24">
                    <Text className="text-lg font-bold text-foreground">
                      {item.symbol}
                    </Text>
                    <Text className="text-sm text-muted" numberOfLines={1}>
                      {item.name}
                    </Text>
                  </View>

                  <View className="flex-1">
                    <TrendChart
                      height={36}
                      strokeWidth={1.5}
                      series={[{ values: item.trend, color: lineColor[tone] }]}
                    />
                  </View>

                  <View className="items-end">
                    <Text className="text-lg font-bold text-foreground">
                      {item.price.toFixed(2)}
                    </Text>
                    <Text
                      className={`text-sm font-semibold ${textClass[tone]}`}
                    >
                      {formatChange(item.change)}
                    </Text>
                  </View>
                </View>

                <Divider />

                <View className="flex-row items-center gap-3">
                  <Text className="w-28 text-sm text-muted">
                    Target {item.target.toFixed(2)}
                  </Text>
                  <View className="flex-1">
                    <ProgressBar
                      value={progress}
                      color={barColor}
                      trackColor={trackColor}
                    />
                  </View>
                  <Text className="w-12 text-right text-sm font-bold text-primary">
                    {Math.round(progress * 100)}%
                  </Text>
                </View>
              </Card>
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
};

export default Watchlist;
