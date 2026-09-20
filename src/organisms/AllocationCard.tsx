import type { Position } from "@/apis/portfolio";
import Card from "@/atoms/Card";
import Divider from "@/atoms/Divider";
import SectionHeader from "@/molecules/SectionHeader";
import { Text, View } from "react-native";

type Props = { positions: Position[] };

// each sector's and each stock's share of the holdings at today's prices
const AllocationCard = ({ positions }: Props) => {
  const sectorPct: Record<string, number> = {};
  for (const position of positions) {
    const sector = position.sector ?? "No sector";
    sectorPct[sector] = (sectorPct[sector] ?? 0) + (position.weightPct ?? 0);
  }
  const sectors = Object.keys(sectorPct).sort((a, b) => sectorPct[b] - sectorPct[a]);
  const stocks = [...positions].sort((a, b) => (b.weightPct ?? 0) - (a.weightPct ?? 0));

  const biggest = stocks[0];
  const tooBig = biggest !== undefined && (biggest.weightPct ?? 0) > 25;

  return (
    <View className="gap-2">
      <SectionHeader title="WHERE YOUR MONEY IS" />

      <Card bordered className="gap-3">
        {sectors.map((sector) => (
          <View key={sector} className="flex-row justify-between gap-3">
            <Text className="shrink text-sm text-foreground" numberOfLines={1}>
              {sector}
            </Text>
            <Text className="text-sm font-bold text-foreground">
              {sectorPct[sector].toFixed(1)}%
            </Text>
          </View>
        ))}

        <Divider />

        {stocks.map((stock) => (
          <View key={stock.symbol} className="flex-row justify-between">
            <Text className="text-sm text-muted">{stock.symbol}</Text>
            <Text className="text-sm text-foreground">
              {(stock.weightPct ?? 0).toFixed(1)}%
            </Text>
          </View>
        ))}

        {tooBig ? (
          <Text className="text-sm text-danger">
            {biggest.symbol} is {(biggest.weightPct ?? 0).toFixed(1)}% of your holdings, above the 25% limit.
          </Text>
        ) : null}
      </Card>
    </View>
  );
};

export default AllocationCard;
