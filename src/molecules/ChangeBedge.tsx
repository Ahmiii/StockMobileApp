import Pill from "@/atoms/Pill";
import { Text, View } from "react-native";

type Tone = "success" | "danger" | "neutral";

const textClass: Record<Tone, string> = {
  success: "text-success",
  danger: "text-danger",
  neutral: "text-muted",
};

type Props = {
  amount: string; // "+Rs 2,745"
  percent: string; // "+0.48%"
  caption?: string; // "today"
  tone?: Tone;
};

const ChangeBadge = ({ amount, percent, caption, tone = "success" }: Props) => (
  <View className="flex-row items-center gap-2">
    <Pill tone={tone}>
      <Text className={`text-sm font-bold ${textClass[tone]}`}>
        {amount} · {percent}
      </Text>
    </Pill>
    {caption ? <Text className="text-sm text-muted">{caption}</Text> : null}
  </View>
);

export default ChangeBadge;
