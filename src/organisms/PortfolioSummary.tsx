import ChangeBadge from "@/molecules/ChangeBedge";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

type Tone = "success" | "danger" | "neutral";

type Props = {
  value: string; // "Rs 1,24,500"
  change: {
    amount: string; // "+Rs 2,745"
    percent: string; // "+0.48%"
    caption?: string; // "Today vs previous day Sep 4, 2026"
    tone?: Tone;
  };
  /** A quieter line under the badge, e.g. the other way of reading the change. */
  secondary?: string;
  /** When given, tapping the pill calls this (used to swap today / since bought). */
  onPressChange?: () => void;
};

const PortfolioSummary = ({ value, change, secondary, onPressChange }: Props) => {
  // The caption and the secondary line can be long ("Sep 8, 2026 vs previous
  // day Sep 4, 2026 · 99% of holdings"). They start cut to one line with an
  // ellipsis; a tap on either shows the full text, another tap folds it back.
  const [expanded, setExpanded] = useState(false);
  const toggle = () => setExpanded((open) => !open);
  const lines = expanded ? undefined : 1;

  return (
    <View className="gap-2">
      <Text className="mt-1 text-3xl font-bold text-foreground">{value}</Text>

      {/* Pill tap swaps today / since bought; caption tap expands the text. */}
      <ChangeBadge
        amount={change.amount}
        percent={change.percent}
        caption={change.caption}
        tone={change.tone}
        captionLines={lines}
        onPressCaption={toggle}
        onPressAmount={onPressChange}
      />

      {secondary ? (
        <Pressable onPress={toggle}>
          <Text className="text-sm text-muted" numberOfLines={lines}>
            {secondary}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
};

export default PortfolioSummary;
