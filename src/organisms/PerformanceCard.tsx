import Card from "@/atoms/Card";
import Divider from "@/atoms/Divider";
import ChartLegend from "@/molecules/ChartLegend";
import SectionHeader from "@/molecules/SectionHeader";
import TrendChart from "@/molecules/TrendChart";
import { Text, View } from "react-native";
import { useCSSVariable } from "uniwind";

type Props = {
  period: string; // "Last 30 days"
  delta: string; // "+2.1%"
  /** Both series rebased to 100 at the first point. */
  portfolio: number[];
  benchmark: number[];
  /** One ISO date per point, e.g. "2026-08-04". Drives the scrub tooltip. */
  dates: string[];
  benchmarkName: string; // "KSE-100"
  comparison: string; // "+11.8% vs KSE-100"
};

// "2026-08-04" -> "4 Aug"
const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

// Rebased value -> change since the first point, e.g. 102.13 -> "+2.13%".
const asChange = (value: number) => {
  const change = value - 100;
  return `${change > 0 ? "+" : ""}${change.toFixed(2)}%`;
};

const PerformanceCard = ({
  period,
  delta,
  portfolio,
  benchmark,
  dates,
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
        labels={dates.map(shortDate)}
        formatValue={asChange}
        series={[
          { values: portfolio, color: String(primary), area: true, label: "Portfolio" },
          { values: benchmark, color: String(muted), dotted: true, label: benchmarkName },
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
