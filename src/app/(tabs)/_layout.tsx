import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Tabs } from "expo-router";
import { useCSSVariable } from "uniwind";

const TabsLayout = () => {
  // Navigators are configured with props, not className, so read the same
  // tokens out of the stylesheet. These re-resolve when the theme changes.
  const [primary, muted, background, border] = useCSSVariable([
    "--color-primary",
    "--color-muted",
    "--color-background",
    "--color-border",
  ]) as (string | undefined)[];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: primary,
        tabBarInactiveTintColor: muted,
        tabBarStyle: {
          backgroundColor: background,
          borderTopColor: border,
        },
      }}
    >
      <Tabs.Screen
        name="Portfolio"
        options={{
          title: "Portfolio",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={"home-outline"} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Market"
        options={{
          title: "Market",
          tabBarIcon: ({ color, size, focused }) => {
            return (
              <Ionicons
                name={"trending-up-outline"}
                color={color}
                size={size}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="Watch"
        options={{
          title: "Watch",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={"star-outline"} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Trades"
        options={{
          title: "Trades",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={"time-outline"} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={"settings-outline"} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
