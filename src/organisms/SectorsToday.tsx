import Card from "@/atoms/Card";
import ProgressBar from "@/atoms/ProgressBar";
import SectionHeader from "@/molecules/SectionHeader";
import { FlashList } from "@shopify/flash-list";
import { Text, View } from "react-native";
import { useCSSVariable } from "uniwind";

type Tone = "success" | "danger" | "neutral";

const textClass: Record<Tone, string> = {
  success: "text-success",
  danger: "text-danger",
  neutral: "text-muted",
};

export type Sector = {
  name: string;
  change: number;
};

type Props = {
  title?: string;
  sectors: Sector[];
  height?: number;
};

const toneFor = (change: number): Tone => {
  if (change > 0) return "success";
  if (change < 0) return "danger";
  return "neutral";
};

const formatChange = (change: number) =>
  `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;

const Separator = () => <View className="h-6" />;

const SectorsToday = ({
  title = "SECTORS TODAY",
  sectors,
  height = 270,
}: Props) => {
  const [success, danger, muted, secondary] = useCSSVariable([
    "--color-success",
    "--color-danger",
    "--color-muted",
    "--color-secondary",
  ]);
  const barColor: Record<Tone, string> = {
    success: String(success),
    danger: String(danger),
    neutral: String(muted),
  };
  const trackColor = String(secondary);

  // Bars are relative to the biggest move of the day, so the largest is full.
  const biggestMove =
    Math.max(...sectors.map((s) => Math.abs(s.change)), 0) || 1;

  return (
    <View className="gap-2">
      <SectionHeader title={title} />

      <Card bordered>
        <View style={{ height }}>
          <FlashList
            data={sectors}
            keyExtractor={(sector) => sector.name}
            renderItem={({ item }) => {
              const tone = toneFor(item.change);
              return (
                <View className="flex-row items-center gap-4">
                  <Text className="w-24 text-base text-foreground">
                    {item.name}
                  </Text>

                  <View className="flex-1">
                    <ProgressBar
                      value={Math.abs(item.change) / biggestMove}
                      color={barColor[tone]}
                      trackColor={trackColor}
                    />
                  </View>

                  <Text
                    className={`w-14 text-right text-sm font-bold ${textClass[tone]}`}
                  >
                    {formatChange(item.change)}
                  </Text>
                </View>
              );
            }}
            ItemSeparatorComponent={Separator}
            ListEmptyComponent={
              <Text className="text-muted">No sector data yet</Text>
            }
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          />
        </View>
      </Card>
    </View>
  );
};

export default SectorsToday;
