import { BottomSheet, Button, Host, List, Section } from "@expo/ui/swift-ui";
import { frame, tint } from "@expo/ui/swift-ui/modifiers";
import { useCSSVariable, useUniwind } from "uniwind";
import type { RangeSheetProps } from "./rangePickerShared";

// iOS: a SwiftUI bottom sheet holding a sectioned List, one row per option.
// The sheet is triggered by an RN chip, so the Host is a zero-size anchor
// that only exists to present it.
const RangeSheet = ({ visible, options, value, onSelect, onClose }: RangeSheetProps) => {
  const { theme } = useUniwind();
  const [primary] = useCSSVariable(["--color-primary"]);

  // fitToContents needs the List to have a height of its own.
  const listHeight = options.length * 48 + 72;

  return (
    <Host style={{ position: "absolute", width: 0, height: 0 }} colorScheme={theme}>
      <BottomSheet
        isPresented={visible}
        onIsPresentedChange={(presented) => {
          if (!presented) onClose();
        }}
        fitToContents
      >
        <List modifiers={[frame({ height: listHeight }), tint(String(primary))]}>
          <Section title="Range">
            {options.map((option) => (
              <Button
                key={option.value}
                label={option.label}
                systemImage={option.value === value ? "checkmark" : undefined}
                onPress={() => onSelect(option.value)}
              />
            ))}
          </Section>
        </List>
      </BottomSheet>
    </Host>
  );
};

export default RangeSheet;
