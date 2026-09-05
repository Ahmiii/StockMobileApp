import Chip from "@/atoms/Chip";
import RangeSheet from "@/molecules/RangeSheet";
import { useState } from "react";
import { View, type LayoutChangeEvent } from "react-native";
import type { RangeOption } from "./rangePickerShared";

export {
  PERIOD_LABEL,
  RANGES,
  rangeDates,
  type Range,
  type RangeOption,
} from "./rangePickerShared";

// Space between chips (the row's gap-2).
const GAP = 8;

type Props<T extends string> = {
  options: RangeOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

// Shows as many chips as fit on one line, then a "…" chip. Tapping "…" opens
// a native list of the rest; when the pick comes from that list the "…"
// chip is highlighted, and the sheet shows a checkmark on the chosen row.
const RangePicker = <T extends string>({ options, value, onChange }: Props<T>) => {
  const [rowWidth, setRowWidth] = useState(0);
  const [chipWidth, setChipWidth] = useState(0);
  const [open, setOpen] = useState(false);

  const onRowLayout = (e: LayoutChangeEvent) =>
    setRowWidth(e.nativeEvent.layout.width);

  // Every chip has the same padding and a short label, so measuring the
  // first one is enough to know how wide they all are.
  const onChipLayout = (e: LayoutChangeEvent) =>
    setChipWidth(e.nativeEvent.layout.width);

  // How many chips fit, keeping one slot for "…". Until both widths are
  // known, show a single chip so the measurement can happen.
  let visibleCount = 1;
  if (rowWidth > 0 && chipWidth > 0) {
    const perChip = chipWidth + GAP;
    visibleCount = Math.floor((rowWidth - chipWidth) / perChip);
  }
  if (visibleCount < 1) visibleCount = 1;
  if (visibleCount >= options.length) visibleCount = options.length;

  const visible = options.slice(0, visibleCount);
  const overflow = options.slice(visibleCount);
  const overflowSelected = overflow.some((option) => option.value === value);

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

      {overflow.length > 0 ? (
        <Chip label="…" active={overflowSelected} onPress={() => setOpen(true)} />
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
