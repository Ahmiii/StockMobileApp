import Card from "@/atoms/Card";
import Label from "@/atoms/Label";
import TrendChart from "@/molecules/TrendChart";
// import { Fragment } from "react";
import Scroller from "@/atoms/Scroller";
import { Text, View } from "react-native";
import { useCSSVariable } from "uniwind";

type Tone = "success" | "danger" | "neutral";

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
  /** Recent prices for the sparkline, oldest first. */
  trend?: number[];
};

type Props = { holdings: Holding[] };

const HoldingsSection = ({ holdings }: Props) => {
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
      <Scroller height={280}>
        {holdings.length === 0 ? (
          <Text className="text-foreground">No holdings yet</Text>
        ) : (
          holdings.map((holding, i) => {
            const tone = holding.tone ?? "neutral";
            return (
              <Card className="" bordered key={i}>
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="font-semibold text-foreground">
                      {holding.symbol}
                    </Text>
                    {/* <Text className="text-xs text-muted">{holding.name}</Text> */}
                  </View>

                  {holding.trend ? (
                    <View className="flex-1 px-4">
                      <TrendChart
                        height={28}
                        strokeWidth={1.5}
                        series={[
                          { values: holding.trend, color: lineColor[tone] },
                        ]}
                      />
                    </View>
                  ) : null}

                  <View className="items-end">
                    <Text className="font-semibold text-foreground">
                      {holding.value}
                    </Text>
                    <Text
                      className={`text-xs font-semibold ${textClass[tone]}`}
                    >
                      {holding.change}
                    </Text>
                  </View>
                </View>
              </Card>
            );
          })
        )}
      </Scroller>
    </View>
  );
};

export default HoldingsSection;
