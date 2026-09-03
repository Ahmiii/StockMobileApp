import Label from "@/atoms/Label";
import { View } from "react-native";

type Props = {
  title: string;
  size?: "sm" | "base";
  right?: React.ReactNode;
};

const SectionHeader = ({ title, size = "sm", right }: Props) => (
  <View className="flex-row items-center justify-between">
    <Label size={size}>{title}</Label>
    {right ?? null}
  </View>
);

export default SectionHeader;
