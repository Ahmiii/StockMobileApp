import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Tabs } from "expo-router";
import { useCSSVariable } from "uniwind";

const TabsLayout = () => {
  // Navigators are configured with props, not className, so read the same
  // tokens out of the stylesheet. These re-resolve when the theme changes.
  const [primary, muted, background, border, card] = useCSSVariable([
    "--color-primary",
    "--color-muted",
    "--color-background",
    "--color-border",
    "--color-card",
  ]) as (string | undefined)[];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: primary,
        tabBarInactiveTintColor: muted,
        tabBarStyle: {
          backgroundColor: card,
          borderTopColor: border,
        },
        sceneStyle: {
          backgroundColor: background,
          paddingTop: 10,
          paddingLeft: 15,
          paddingRight: 15,
        },
      }}
    >
      <Tabs.Screen
        name="Portfolio"
        options={{
          title: "Portfolio",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={"home-outline"} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Market"
        options={{
          title: "Market",
          tabBarIcon: ({ color, size }) => {
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
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={"star-outline"} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Trades"
        options={{
          title: "Trades",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={"time-outline"} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={"settings-outline"} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
