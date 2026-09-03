import { Pressable, Text } from "react-native";

type Variant = "soft" | "solid";

const boxClass: Record<Variant, string> = {
  soft: "bg-primary-soft",
  solid: "bg-primary",
};

const textClass: Record<Variant, string> = {
  soft: "text-primary",
  solid: "text-primary-foreground",
};

type Props = {
  label: string;
  variant?: Variant;
  onPress?: () => void;
  className?: string;
};

const Button = ({
  label,
  variant = "soft",
  onPress,
  className = "",
}: Props) => (
  <Pressable
    onPress={onPress}
    className={`items-center rounded-2xl py-4 ${boxClass[variant]} ${className}`}
  >
    <Text className={`text-lg font-bold ${textClass[variant]}`}>{label}</Text>
  </Pressable>
);

export default Button;
