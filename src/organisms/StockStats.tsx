import Card from "@/atoms/Card";
import Divider from "@/atoms/Divider";
import Label from "@/atoms/Label";
import SectionHeader from "@/molecules/SectionHeader";
import { Fragment } from "react";
import { Text, View } from "react-native";

type Tone = "success" | "danger" | "neutral";

const textClass: Record<Tone, string> = {
  success: "text-success",
  danger: "text-danger",
  neutral: "text-foreground",
};

export type Stat = {
  label: string; // "Period high"
  value: string; // "393.07"
  tone?: Tone;
};

type Props = {
  title?: string;
  stats: Stat[];
};

// A two-column grid of figures. Stats are laid out two per row; an odd last
// stat sits alone on the left.
const StockStats = ({ title = "ANALYTICS", stats }: Props) => {
  const rows: Stat[][] = [];
  for (let i = 0; i < stats.length; i += 2) {
    rows.push(stats.slice(i, i + 2));
  }

  return (
    <View className="gap-2">
      <SectionHeader title={title} />
      <Card bordered>
        {rows.map((row, rowIndex) => (
          <Fragment key={rowIndex}>
            {rowIndex > 0 ? <Divider className="my-3" /> : null}
            <View className="flex-row">
              {row.map((stat) => (
                <View key={stat.label} className="flex-1 gap-0.5">
                  <Label size="xs">{stat.label}</Label>
                  <Text
                    className={`text-base font-semibold ${textClass[stat.tone ?? "neutral"]}`}
                  >
                    {stat.value}
                  </Text>
                </View>
              ))}
            </View>
          </Fragment>
        ))}
      </Card>
    </View>
  );
};

export default StockStats;
