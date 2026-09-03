import Label from "@/atoms/Label";
import { View } from "react-native";

type Props = {
  title: string;
  size?: "xs" | "sm" | "base" | "lg";
  color?: "muted" | "foreground";
  right?: React.ReactNode;
};

const SectionHeader = ({ title, size = "sm", color = "muted", right }: Props) => (
  <View className="flex-row items-center justify-between">
    <Label size={size} color={color}>
      {title}
    </Label>
    {right ?? null}
  </View>
);

export default SectionHeader;
