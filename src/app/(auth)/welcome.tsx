import Button from "@/atoms/Button";
import Label from "@/atoms/Label";
import LogoMark from "@/atoms/LogoMark";
import FeatureList from "@/molecules/FeatureList";
import { router } from "expo-router";
import { Text, View } from "react-native";

const FEATURES = [
  "Live KSE-100 market data and company financials",
  "Trades sync automatically from AHL eTrade",
  "P&L computed from your full trade history",
];

const Welcome = () => (
  <View className="flex-1 justify-between">
    <View className="gap-8">
      <LogoMark />

      <View className="gap-2">
        <Label size="lg" color="foreground">
          Crest
        </Label>
        <Text className="text-xl text-muted">Your PSX portfolio, always current.</Text>
      </View>

      <FeatureList items={FEATURES} />
    </View>

    <Button
      label="Link AHL eTrade"
      variant="solid"
      onPress={() => router.push("/link-broker")}
    />
  </View>
);

export default Welcome;
