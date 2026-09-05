import Chip from "@/atoms/Chip";
import RangeSheet from "@/molecules/RangeSheet";
import { useState } from "react";
import { View, type LayoutChangeEvent } from "react-native";
import { RANGES, type Range } from "./rangePickerShared";

export { PERIOD_LABEL, rangeDates, type Range } from "./rangePickerShared";

// The row uses gap-2 between chips.
const GAP = 8;

type Props = {
  value: Range;
  onChange: (value: Range) => void;
};

// Shows as many chips as fit on one line, then a "…" chip. Tapping "…" opens
// a native list of the rest; when the pick comes from that list the "…"
// chip is highlighted, and the sheet shows a checkmark on the chosen row.
const RangePicker = ({ value, onChange }: Props) => {
  const [rowWidth, setRowWidth] = useState(0);
  const [chipWidth, setChipWidth] = useState(0);
  const [open, setOpen] = useState(false);

  const onRowLayout = (e: LayoutChangeEvent) =>
    setRowWidth(e.nativeEvent.layout.width);

  // Measure the first chip once; every chip has the same padding and a
  // two-character label, so they're all this wide.
  const onChipLayout = (e: LayoutChangeEvent) => {
    if (chipWidth === 0) setChipWidth(e.nativeEvent.layout.width);
  };

  // n chips + gaps + the "…" chip must fit: n·w + n·gap + w <= row.
  let visibleCount = 1;
  if (rowWidth > 0 && chipWidth > 0) {
    visibleCount = Math.floor((rowWidth - chipWidth) / (chipWidth + GAP));
  }
  if (visibleCount < 1) visibleCount = 1;
  if (visibleCount >= RANGES.length) visibleCount = RANGES.length;

  const visible = RANGES.slice(0, visibleCount);
  const overflow = RANGES.slice(visibleCount);
  const overflowSelected = overflow.find((option) => option.value === value);

  return (
    <View onLayout={onRowLayout} className="flex-row gap-2">
      {visible.map((option, i) => (
        <View key={option.value} onLayout={i === 0 ? onChipLayout : undefined}>
          <Chip
            label={option.label}
            active={option.value === value}
            onPress={() => onChange(option.value)}
          />
        </View>
      ))}

      {/* Always reads "…"; it highlights when the pick came from the sheet. */}
      {overflow.length > 0 ? (
        <Chip
          label="…"
          active={overflowSelected !== undefined}
          onPress={() => setOpen(true)}
        />
      ) : null}

      <RangeSheet
        visible={open}
        options={overflow}
        value={value}
        onSelect={(next) => {
          onChange(next);
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
      />
    </View>
  );
};

export default RangePicker;
