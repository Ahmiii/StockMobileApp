import Pill from "@/atoms/Pill";
import { Pressable, Text, View } from "react-native";

type Tone = "success" | "danger" | "neutral";

const textClass: Record<Tone, string> = {
  success: "text-success",
  danger: "text-danger",
  neutral: "text-muted",
};

type Props = {
  amount: string; // "+Rs 2,745"
  percent: string; // "+0.48%"
  caption?: string; // "Today vs previous day Sep 4, 2026"
  tone?: Tone;
  /** Cut the caption to this many lines with an ellipsis. Omit to show it all. */
  captionLines?: number;
  /** Called when the caption is tapped, e.g. to expand a truncated one. */
  onPressCaption?: () => void;
  /** Called when the pill itself is tapped, e.g. to swap what it shows. */
  onPressAmount?: () => void;
};

const ChangeBadge = ({
  amount,
  percent,
  caption,
  tone = "success",
  captionLines,
  onPressCaption,
  onPressAmount,
}: Props) => (
  <View className="flex-row items-center gap-2">
    <Pressable
      onPress={onPressAmount}
      disabled={!onPressAmount}
      accessibilityRole={onPressAmount ? "button" : undefined}
      accessibilityHint={
        onPressAmount ? "Swaps between today's change and the change since you bought" : undefined
      }
    >
      <Pill tone={tone}>
        <Text className={`text-sm font-bold ${textClass[tone]}`}>
          {amount} · {percent}
        </Text>
      </Pill>
    </Pressable>
    {caption ? (
      // flex-1 lets the caption take the leftover width and truncate there,
      // instead of pushing the row wider than the screen.
      <Pressable className="flex-1" onPress={onPressCaption} disabled={!onPressCaption}>
        <Text className="text-sm text-muted" numberOfLines={captionLines}>
          {caption}
        </Text>
      </Pressable>
    ) : null}
  </View>
);

export default ChangeBadge;
