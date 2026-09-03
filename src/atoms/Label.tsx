import { Text } from "react-native";

type Size = "xs" | "sm" | "base" | "lg";
type Color = "muted" | "foreground";

const sizeClass: Record<Size, string> = {
  xs: "text-xs font-bold",
  sm: "text-sm font-semibold",
  base: "text-base font-bold",
  lg: "text-3xl font-bold",
};

const colorClass: Record<Color, string> = {
  muted: "text-muted",
  foreground: "text-foreground",
};

type Props = {
  size?: Size;
  color?: Color;
  className?: string;
  children: React.ReactNode;
};

// Heading text. Small and muted by default for section titles ("Holdings",
// "Since June"). size="lg" color="foreground" is a screen title ("Watchlist").
const Label = ({ size = "sm", color = "muted", className = "", children }: Props) => (
  <Text className={`${colorClass[color]} ${sizeClass[size]} ${className}`}>
    {children}
  </Text>
);

export default Label;
