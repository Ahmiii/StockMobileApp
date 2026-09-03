import Dot from "@/atoms/Dot";
import Pill from "@/atoms/Pill";
import { Text } from "react-native";

type Tone = "success" | "danger" | "neutral";

const textClass: Record<Tone, string> = {
  success: "text-success",
  danger: "text-danger",
  neutral: "text-muted",
};

type Props = { label: string; tone?: Tone };

const SyncStatus = ({ label, tone = "success" }: Props) => (
  <Pill tone={tone}>
    <Dot tone={tone} />
    <Text className={`text-sm font-medium ${textClass[tone]}`}>{label}</Text>
  </Pill>
);

export default SyncStatus;
