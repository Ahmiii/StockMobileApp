import LineSwatch, { type LineVariant } from "@/atoms/LineSwatch";
import { Text, View } from "react-native";

export type LegendItem = {
  label: string;
  variant: LineVariant;
  className?: string;
};

type Props = {
  items: LegendItem[];
  right?: React.ReactNode;
};

const ChartLegend = ({ items, right }: Props) => (
  <View className="flex-row items-center justify-between">
    <View className="flex-row gap-3">
      {items.map((item) => (
        <View key={item.label} className="flex-row items-center gap-1.5">
          <LineSwatch variant={item.variant} className={item.className} />
          <Text className="text-xs text-muted font-semibold">{item.label}</Text>
        </View>
      ))}
    </View>
    {right ?? null}
  </View>
);

export default ChartLegend;
