import StatsCard from "@/molecules/StatsCard";
import { View } from "react-native";

const data = [
  {
    label: "Invested",
    amount: 5555,
  },
  {
    label: "Unrealized P&L",
    amount: 27057,
  },
];
const InvestPnL = () => {
  return (
    <View className="flex-row gap-2 items-center justify-between">
      {data?.map((value, key) => {
        return (
          <StatsCard
            key={key}
            realizeProfit={value?.amount}
            lable={value.label}
          />
        );
      })}
    </View>
  );
};
export default InvestPnL;
