import { View } from "react-native";

type Tone = "success" | "danger" | "neutral" | "primary";

const toneClass: Record<Tone, string> = {
  success: "bg-success-soft",
  danger: "bg-danger-soft",
  neutral: "bg-secondary",
  primary: "bg-primary-soft",
};

type Props = { tone?: Tone; className?: string; children: React.ReactNode };

const Pill = ({ tone = "neutral", className = "", children }: Props) => (
  <View
    className={`flex-row items-center gap-1.5 rounded-full border border-border px-2.5 py-1 ${toneClass[tone]} ${className}`}
  >
    {children}
  </View>
);

export default Pill;
