import HorizontalChip from "@/molecules/HorizontalChip";
import StatsCard from "@/molecules/StatsCard";
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
    {totalDividend && (
      <HorizontalChip
        label="Dividends received"
        iconName="chevron-forward"
        statValue={totalDividend}
      />
    )}
  </View>
);

export default InvestPnL;
