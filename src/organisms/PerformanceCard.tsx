import Card from "@/atoms/Card";
import Divider from "@/atoms/Divider";
import ChartLegend from "@/molecules/ChartLegend";
import SectionHeader from "@/molecules/SectionHeader";
import TrendChart from "@/molecules/TrendChart";
import { Text, View } from "react-native";
import { useCSSVariable } from "uniwind";

type Props = {
  period: string; // "Since June"
  delta: string; // "+233"
  portfolio: number[];
  benchmark: number[];
  benchmarkName: string; // "KSE-100"
  comparison: string; // "+11.8% vs KSE-100"
};

const PerformanceCard = ({
  period,
  delta,
  portfolio,
  benchmark,
  benchmarkName,
  comparison,
}: Props) => {
  const [primary, muted] = useCSSVariable(["--color-primary", "--color-muted"]);

  return (
    <Card bordered className="gap-5">
      <SectionHeader
        title={period}
        right={
          <Text className="text-sm font-semibold text-success">{delta}</Text>
        }
      />

      <TrendChart
        height={120}
        series={[
          { values: portfolio, color: String(primary), area: true },
          { values: benchmark, color: String(muted), dotted: true },
        ]}
      />

      <View className="gap-2">
        <Divider />
        <ChartLegend
          items={[
            { label: "Portfolio", variant: "solid", className: "bg-primary" },
            { label: benchmarkName, variant: "dotted", className: "bg-muted" },
          ]}
          right={
            <Text className="text-xs font-bold text-success">{comparison}</Text>
          }
        />
      </View>
    </Card>
  );
};

export default PerformanceCard;
