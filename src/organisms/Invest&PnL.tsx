import StatsCard from "@/molecules/StatsCard";
import { View } from "react-native";

type Props = {
  invested: number;
  unrealizedPnl: number;
};

const InvestPnL = ({ invested, unrealizedPnl }: Props) => {
  return (
    <View className="flex-row gap-2 items-center justify-between">
      <StatsCard lable="Invested" realizeProfit={invested} />
      <StatsCard lable="Unrealized P&L" realizeProfit={unrealizedPnl} />
    </View>
  );
};
export default InvestPnL;
