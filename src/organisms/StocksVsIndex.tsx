import Card from "@/atoms/Card";
import Divider from "@/atoms/Divider";
import Pill from "@/atoms/Pill";
import SectionHeader from "@/molecules/SectionHeader";
import TrendChart from "@/molecules/TrendChart";
import { FlashList } from "@shopify/flash-list";
import { Pressable, Text, View } from "react-native";
import { useCSSVariable } from "uniwind";

type Tone = "success" | "danger";

const textClass: Record<Tone, string> = {
  success: "text-success",
  danger: "text-danger",
};

export type StockComparison = {
  symbol: string; // "OGDC"
  name: string; // "Oil & Gas Development"
  change: string; // "+26.7%"
  tone: Tone;
  trend: number[];
  benchmark: number[];
};

type Props = {
  title?: string;
  stocks: StockComparison[];
  height?: number;
  onAdd?: () => void;
};

const Separator = () => <Divider className="my-3" />;

const StocksVsIndex = ({
  title = "YOUR STOCKS VS KSE-100",
  stocks,
  height = 380,
  onAdd,
}: Props) => {
  const [primary, muted] = useCSSVariable(["--color-primary", "--color-muted"]);
  const stockColor = String(primary);
  const indexColor = String(muted);

  return (
    <View className="gap-2">
      <SectionHeader
        title={title}
        right={
          <Pressable onPress={onAdd}>
            <Pill tone="primary">
              <Text className="text-xs font-semibold text-primary">+ Add</Text>
            </Pill>
          </Pressable>
        }
      />

      <Card bordered>
        <View style={{ height }}>
          <FlashList
            data={stocks}
            keyExtractor={(stock) => stock.symbol}
            renderItem={({ item }) => (
              <View className="flex-row items-center gap-3">
                <View className="w-24">
                  <Text className="text-base font-bold text-foreground">
                    {item.symbol}
                  </Text>
                  <Text className="text-xs text-muted" numberOfLines={1}>
                    {item.name}
                  </Text>
                </View>

                {/* Index first so the stock's line draws on top of it. */}
                <View className="flex-1">
                  <TrendChart
                    height={32}
                    strokeWidth={1.5}
                    series={[
                      { values: item.benchmark, color: indexColor, dotted: true },
                      { values: item.trend, color: stockColor },
                    ]}
                  />
                </View>

                <Text
                  className={`w-16 text-right text-sm font-bold ${textClass[item.tone]}`}
                >
                  {item.change}
                </Text>
              </View>
            )}
            ItemSeparatorComponent={Separator}
            ListEmptyComponent={
              <Text className="text-muted">No stocks added yet</Text>
            }
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          />
        </View>
      </Card>
    </View>
  );
};

export default StocksVsIndex;