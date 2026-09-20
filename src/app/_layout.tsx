import { onSessionExpired } from "@/apis/client";
import { selectPortfolio } from "@/queries/usePortfolios";
import { QueryClient, QueryClientProvider, focusManager } from "@tanstack/react-query";
import { Stack, router } from "expo-router";
import { useEffect } from "react";
import { AppState } from "react-native";
import "../global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1 },
  },
});

export default function RootLayout() {

  useEffect(
    () =>
      onSessionExpired(() => {
        queryClient.clear();
        selectPortfolio(null);
        // Close a stock or dividends screen that is open above the tabs first,
        // or only that top screen would be replaced and the tabs would stay under it.
        if (router.canDismiss()) {
          router.dismissAll();
        }
        router.replace({ pathname: "/welcome", params: { reason: "expired" } });
      }),
    [],
  );

  // On a phone React Query cannot tell when the app comes back to the front,
  // so it is told here. Data that is old by then is fetched again: prices from
  // last night's sync show up without restarting the app.
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      focusManager.setFocused(state === "active");
    });
    return () => subscription.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </QueryClientProvider>
  );
}
