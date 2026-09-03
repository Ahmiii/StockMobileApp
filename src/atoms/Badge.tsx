import { Text, View } from "react-native";

type Tone = "success" | "danger" | "neutral" | "primary";

const boxClass: Record<Tone, string> = {
  success: "bg-success-soft",
  danger: "bg-danger-soft",
  neutral: "bg-secondary",
  primary: "bg-primary-soft",
};

const textClass: Record<Tone, string> = {
  success: "text-success",
  danger: "text-danger",
  neutral: "text-muted",
  primary: "text-primary",
};

type Props = { label: string; tone?: Tone; className?: string };

// A small square with a single letter or short code, e.g. "B" for a buy.
const Badge = ({ label, tone = "neutral", className = "" }: Props) => (
  <View
    className={`size-12 items-center justify-center rounded-xl ${boxClass[tone]} ${className}`}
  >
    <Text className={`text-base font-bold ${textClass[tone]}`}>{label}</Text>
  </View>
);

export default Badge;
