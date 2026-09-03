import Card from "@/atoms/Card";
import Label from "@/atoms/Label";
import TrendChart from "@/molecules/TrendChart";
import { FlashList } from "@shopify/flash-list";
import { Text, View } from "react-native";
import { useCSSVariable } from "uniwind";

type Tone = "success" | "danger" | "neutral";

type Props = {
  holdings: Holding[];
  height?: number;
};

const textClass: Record<Tone, string> = {
  success: "text-success",
  danger: "text-danger",
  neutral: "text-muted",
};

export type Holding = {
  symbol: string; // "OGDC"
  name: string; // "Oil & Gas Development"
  value: string; // "Rs 42,300"
  change: string; // "+1.2%"
  tone?: Tone;
  trend?: number[];
};

const Separator = () => <View className="h-2" />;

const HoldingsSection = ({ holdings, height = 280 }: Props) => {
  // Skia's Canvas takes colors, not classes, so read the tokens directly.
  const [success, danger, muted] = useCSSVariable([
    "--color-success",
    "--color-danger",
    "--color-muted",
  ]);
  const lineColor: Record<Tone, string> = {
    success: String(success),
    danger: String(danger),
    neutral: String(muted),
  };

  return (
    <View className="gap-2">
      <Label>Holdings</Label>
      <View style={{ height }}>
        <FlashList
          data={holdings}
          keyExtractor={(holding) => holding.symbol}
          renderItem={({ item }) => {
            const tone = item.tone ?? "neutral";
            return (
              <Card bordered>
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="font-semibold text-foreground">
                      {item.symbol}
                    </Text>
                  </View>
                  {item.trend ? (
                    <View className="flex-1 px-4">
                      <TrendChart
                        height={28}
                        strokeWidth={1.5}
                        series={[
                          { values: item.trend, color: lineColor[tone] },
                        ]}
                      />
                    </View>
                  ) : null}

                  <View className="items-end">
                    <Text className="font-semibold text-foreground">
                      {item.value}
                    </Text>
                    <Text
                      className={`text-xs font-semibold ${textClass[tone]}`}
                    >
                      {item.change}
                    </Text>
                  </View>
                </View>
              </Card>

              // <HoldingRow holding={item} lineColor={lineColor[item.tone ?? "neutral"]} />
            );
          }}
          ItemSeparatorComponent={Separator}
          ListEmptyComponent={
            <Text className="text-foreground">No holdings yet</Text>
          }
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        />
      </View>
    </View>
  );
};

export default HoldingsSection;
