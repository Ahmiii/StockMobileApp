import { Tabs } from "expo-router";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="Portfolio" options={{ title: "Portfolio" }} />
      <Tabs.Screen name="Market" options={{ title: "Market" }} />
      <Tabs.Screen name="Watch" options={{ title: "Watch" }} />
      <Tabs.Screen name="Trades" options={{ title: "Trades" }} />
      <Tabs.Screen name="Settings" options={{ title: "Settings" }} />
    </Tabs>
  );
};

export default TabsLayout;
