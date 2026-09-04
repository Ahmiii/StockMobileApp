import { Ionicons } from "@react-native-vector-icons/ionicons";
import { View } from "react-native";
import { useCSSVariable } from "uniwind";

// The app mark: a gold rounded square with a trend line.
const LogoMark = () => {
  // Icons take a color prop, not a class, so read the token directly.
  const [primaryForeground] = useCSSVariable(["--color-primary-foreground"]);

  return (
    <View className="size-24 items-center justify-center rounded-3xl bg-primary">
      <Ionicons name="trending-up" size={40} color={String(primaryForeground)} />
    </View>
  );
};

export default LogoMark;
