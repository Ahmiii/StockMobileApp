import ChangeBadge from "@/molecules/ChangeBedge";
import { Text, View } from "react-native";

type Tone = "success" | "danger" | "neutral";

type Props = {
  value: string; // "Rs 1,24,500"
  change: {
    amount: string; // "+Rs 2,745"
    percent: string; // "+0.48%"
    caption?: string; // "today"
    tone?: Tone;
  };
};

const PortfolioSummary = ({ value, change }: Props) => (
  <View className="gap-2">
    <Text className="mt-1 text-3xl font-bold text-foreground">{value}</Text>
    <ChangeBadge
      amount={change.amount}
      percent={change.percent}
      caption={change.caption}
      tone={change.tone}
    />
  </View>
);

export default PortfolioSummary;
