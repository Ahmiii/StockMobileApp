import Chip from "@/atoms/Chip";
import { View } from "react-native";

export type FilterOption<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

// A row of chips where exactly one is active. Works like a radio group.
const FilterChips = <T extends string>({ options, value, onChange }: Props<T>) => (
  <View className="flex-row gap-2">
    {options.map((option) => (
      <Chip
        key={option.value}
        label={option.label}
        active={option.value === value}
        onPress={() => onChange(option.value)}
      />
    ))}
  </View>
);

export default FilterChips;
