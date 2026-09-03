import TrendChart from "@/molecules/TrendChart";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCSSVariable, withUniwind } from "uniwind";

const StyledSafeAreaView = withUniwind(SafeAreaView);

// Placeholder data until the portfolio history is wired up.
const PORTFOLIO_TREND = [96, 98, 97, 101, 104, 103, 108, 111, 110, 116];
const BENCHMARK_TREND = [96, 97, 99, 98, 100, 102, 101, 104, 105, 106];

const Portfolio = () => {
  // Skia's Canvas takes colors, not classes, so read the tokens directly.
  const [primary, muted] = useCSSVariable(["--color-primary", "--color-muted"]);

  return (
    <StyledSafeAreaView className="flex-1" edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-2 pb-6"
      >
        {/* Section: header */}
        <View className="flex-row items-center justify-between">
          <Text className="text-muted font-bold">PORTFOLIO</Text>
          <View className="flex-row items-center gap-1.5 rounded-full border border-border bg-success-soft px-2.5 py-1">
            <View className="size-1.5 rounded-full bg-success" />
            <Text className="text-sm font-medium text-success">
              Synced just now
            </Text>
          </View>
        </View>

        {/* Section: summary card */}
        <View className="flex-col gap-2">
          <Text className="mt-1 text-3xl font-bold text-foreground">
            Rs 0.00
          </Text>
          <View className="flex-row gap-2 items-center">
            <View className="rounded-full border border-border bg-success-soft px-2.5 py-1">
              <Text className="text-sm font-bold text-success">
                +Rs 2,745 · +0.48%
              </Text>
            </View>

            <Text className="text-sm text-muted">today</Text>
          </View>
        </View>

        {/* Section: Analytics */}
        <View className="flex-col gap-5 border border-border rounded-2xl bg-card p-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-muted font-semibold">Since June</Text>
            <Text className="text-sm text-muted font-semibold text-success">
              +233
            </Text>
          </View>
          <TrendChart
            height={120}
            series={[
              {
                values: PORTFOLIO_TREND,
                color: String(primary),
                area: true,
              },
              {
                values: BENCHMARK_TREND,
                color: String(muted),
                dotted: true,
              },
            ]}
          />
          <View className="flex-col gap-2">
            <View className="flex-row items-center justify-between">
              <View></View>
            </View>
            <Text className="text-sm text-muted font-semibold text-success">
              +233
            </Text>
          </View>
        </View>

        {/* Section: holdings */}
        <View className="gap-2">
          <Text className="text-sm font-medium text-muted">Holdings</Text>
          <View className="rounded-2xl bg-card p-4">
            <Text className="text-foreground">No holdings yet</Text>
          </View>
        </View>
      </ScrollView>
    </StyledSafeAreaView>
  );
};

export default Portfolio;
