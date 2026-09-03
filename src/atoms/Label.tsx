import { Text } from "react-native";

type Size = "sm" | "base";

const sizeClass: Record<Size, string> = {
  sm: "text-sm font-semibold",
  base: "text-base font-bold",
};

type Props = { size?: Size; className?: string; children: React.ReactNode };

// Small muted heading used for section titles: "PORTFOLIO", "Since June", "Holdings".
const Label = ({ size = "sm", className = "", children }: Props) => (
  <Text className={`text-muted ${sizeClass[size]} ${className}`}>{children}</Text>
);

export default Label;
