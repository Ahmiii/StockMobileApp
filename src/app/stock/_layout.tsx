import { Stack } from "expo-router";
import { useCSSVariable } from "uniwind";

// Detail screens pushed over the tabs. The native header gives us the back
// button; each screen sets its own title.
const StockLayout = () => {
  const [background, foreground] = useCSSVariable([
    "--color-background",
    "--color-foreground",
  ]);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: String(background) },
        headerTintColor: String(foreground),
        headerShadowVisible: false,
        headerBackButtonDisplayMode: "minimal",
        contentStyle: {
          backgroundColor: String(background),
          paddingTop: 10,
          paddingHorizontal: 15,
        },
      }}
    />
  );
};

export default StockLayout;
