import { View } from "react-native";

type Tone = "success" | "danger" | "neutral";

const toneClass: Record<Tone, string> = {
  success: "bg-success",
  danger: "bg-danger",
  neutral: "bg-muted",
};

type Props = { tone?: Tone; className?: string };

const Dot = ({ tone = "neutral", className = "" }: Props) => (
  <View className={`size-1.5 rounded-full ${toneClass[tone]} ${className}`} />
);

export default Dot;
