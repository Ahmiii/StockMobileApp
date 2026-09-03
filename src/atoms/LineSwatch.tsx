import { View } from "react-native";

export type LineVariant = "solid" | "dotted";

type Props = {
  variant?: LineVariant;
  className?: string;
};

const LineSwatch = ({ variant = "solid", className = "bg-muted" }: Props) => {
  if (variant === "dotted") {
    return (
      <View className="flex-row items-center gap-1">
        {Array.from({ length: 4 }, (_, i) => (
          <View key={i} className={`size-0.5 rounded-full ${className}`} />
        ))}
      </View>
    );
  }

  return <View className={`h-0.5 w-4 rounded-full ${className}`} />;
};

export default LineSwatch;
