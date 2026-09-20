import HorizontalChip from "@/molecules/HorizontalChip";
import StatsCard from "@/molecules/StatsCard";
import { router } from "expo-router";
import { View } from "react-native";

type Props = {
  invested: number;
  unrealizedPnl: number;
  totalDividend: string;
};

const InvestPnL = ({ invested, unrealizedPnl, totalDividend }: Props) => (
  <View className="flex-row flex-wrap gap-2">
    <StatsCard lable="Invested" realizeProfit={invested} />
    <StatsCard lable="Unrealized P&L" realizeProfit={unrealizedPnl} />
    {/* Ternary, not `&&`: an empty string would render as bare text. */}
    {/* The figure is what you were entitled to on each ex-date, before the 15%
        tax. It is counted from the ex-date, a few weeks before the cash arrives. */}
    {totalDividend ? (
      <HorizontalChip
        label="Dividends earned (before tax)"
        iconName="chevron-forward"
        statValue={totalDividend}
        onPressChip={() => router.push("/DividendStockList")}
      />
    ) : null}
  </View>
);

export default InvestPnL;
