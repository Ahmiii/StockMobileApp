import Card from "@/atoms/Card";
import Label from "@/atoms/Label";
import type { Portfolio } from "@/apis/portfolio";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { FlashList } from "@shopify/flash-list";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useCSSVariable } from "uniwind";

type Props = {
  title?: string;
  portfolios: Portfolio[];
  isPending: boolean;
  error: Error | null;
  onSelect: (portfolio: Portfolio) => void;
};

const Separator = () => <View className="h-3" />;

// Fills the screen. The list is the only scroller, so put this inside
// <Screen scroll={false}> rather than a scrolling Screen.
const PortfolioList = ({
  title = "Your portfolios",
  portfolios,
  isPending,
  error,
  onSelect,
}: Props) => {
  // Icons take a color prop, not a class, so read the tokens directly.
  const [muted, primary] = useCSSVariable(["--color-muted", "--color-primary"]);

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color={String(primary)} />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center gap-2">
        <Text className="text-base text-danger">{error.message}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 gap-3">
      <View className="gap-1">
        <Label size="lg" color="foreground">
          {title}
        </Label>
        <Text className="text-base text-muted">Pick the one you want to track.</Text>
      </View>

      <View className="flex-1">
        <FlashList
          data={portfolios}
          keyExtractor={(portfolio) => portfolio.id}
          renderItem={({ item }) => (
            <Pressable onPress={() => onSelect(item)}>
              <Card bordered>
                <View className="flex-row items-center gap-3">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-foreground">{item.name}</Text>
                    {item.subtitle ? (
                      <Text className="text-sm text-muted" numberOfLines={1}>
                        {item.subtitle}
                      </Text>
                    ) : null}
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={String(muted)} />
                </View>
              </Card>
            </Pressable>
          )}
          ItemSeparatorComponent={Separator}
          ListEmptyComponent={
            <Text className="text-muted">No portfolios found for this account.</Text>
          }
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default PortfolioList;
