import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCSSVariable } from "uniwind";

// Onboarding stack: welcome -> link-broker. Lives outside the tabs so it has
// no tab bar, and applies its own safe-area and horizontal padding once here.
const AuthLayout = () => {
  const [background] = useCSSVariable(["--color-background"]);
  const insets = useSafeAreaInsets();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: String(background),
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 16,
          paddingHorizontal: 15,
        },
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="link-broker" />
      <Stack.Screen name="portfolios" />
    </Stack>
  );
};

export default AuthLayout;
