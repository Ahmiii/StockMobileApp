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
  /** Blocks presses and dims the button, e.g. while a request is in flight. */
  disabled?: boolean;
  onPress?: () => void;
  className?: string;
};

const Button = ({
  label,
  variant = "soft",
  disabled = false,
  onPress,
  className = "",
}: Props) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    className={`items-center rounded-2xl py-4 ${boxClass[variant]} ${disabled ? "opacity-60" : ""} ${className}`}
  >
    <Text className={`text-lg font-bold ${textClass[variant]}`}>{label}</Text>
  </Pressable>
);

export default Button;
