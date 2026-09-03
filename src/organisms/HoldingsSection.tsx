import Card from "@/atoms/Card";
import Divider from "@/atoms/Divider";
import Label from "@/atoms/Label";
import { Fragment } from "react";
import { Text, View } from "react-native";

type Tone = "success" | "danger" | "neutral";

const textClass: Record<Tone, string> = {
  success: "text-success",
  danger: "text-danger",
  neutral: "text-muted",
};

export type Holding = {
  symbol: string; // "OGDC"
  name: string; // "Oil & Gas Development"
  value: string; // "Rs 42,300"
  change: string; // "+1.2%"
  tone?: Tone;
};

type Props = { holdings: Holding[] };

const HoldingsSection = ({ holdings }: Props) => (
  <View className="gap-2">
    <Label>Holdings</Label>
    <Card>
      {holdings.length === 0 ? (
        <Text className="text-foreground">No holdings yet</Text>
      ) : (
        holdings.map((holding, i) => (
          <Fragment key={holding.symbol}>
            {i > 0 ? <Divider className="my-3" /> : null}
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="font-semibold text-foreground">{holding.symbol}</Text>
                <Text className="text-xs text-muted">{holding.name}</Text>
              </View>
              <View className="items-end">
                <Text className="font-semibold text-foreground">{holding.value}</Text>
                <Text className={`text-xs font-semibold ${textClass[holding.tone ?? "neutral"]}`}>
                  {holding.change}
                </Text>
              </View>
            </View>
          </Fragment>
        ))
      )}
    </Card>
  </View>
);

export default HoldingsSection;