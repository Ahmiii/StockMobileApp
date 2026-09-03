import Card from "@/atoms/Card";
import Divider from "@/atoms/Divider";
import Label from "@/atoms/Label";
import TrendChart from "@/molecules/TrendChart";
import { Text, View } from "react-native";
import { useCSSVariable } from "uniwind";

type Tone = "success" | "danger" | "neutral";

const textClass: Record<Tone, string> = {
  success: "text-success",
  danger: "text-danger",
  neutral: "text-muted",
};

export type IndexStat = {
  label: string; // "Volume"
  /** A string, or a node when parts need different colors (e.g. "214 / 129"). */
  value: React.ReactNode;
};

type Props = {
  name: string; // "KSE-100"
  value: string; // "147,832.64"
  change: string; // "+1,102.38 · +0.76%"
  tone?: Tone;
  trend: number[];
  stats: IndexStat[];
};

const MarketIndexCard = ({
  name,
  value,
  change,
  tone = "success",
  trend,
  stats,
}: Props) => {
  // Skia's Canvas takes colors, not classes, so read the token directly.
  const [primary] = useCSSVariable(["--color-primary"]);

  return (
    <Card bordered className="gap-3">
      <Label size="xs" className="uppercase">
        {name}
      </Label>

      <View className="flex-row items-baseline gap-2">
        <Text className="text-2xl font-bold text-foreground">{value}</Text>
        <Text className={`text-xs font-semibold ${textClass[tone]}`}>
          {change}
        </Text>
      </View>

      <TrendChart
        height={56}
        series={[{ values: trend, color: String(primary), area: true }]}
      />
      <Divider />
      <View className="flex-row justify-between">
        {stats.map((stat) => (
          <View key={stat.label} className="gap-0.5">
            <Label size="xs">{stat.label}</Label>
            {typeof stat.value === "string" ? (
              <Text className="text-sm font-semibold text-foreground">
                {stat.value}
              </Text>
            ) : (
              stat.value
            )}
          </View>
        ))}
      </View>
    </Card>
  );
};

export default MarketIndexCard;
