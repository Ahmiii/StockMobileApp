import { BottomSheet, Button, Host, List, Section } from "@expo/ui/swift-ui";
import { frame } from "@expo/ui/swift-ui/modifiers";
import { useUniwind } from "uniwind";
import type { RangeSheetProps } from "./rangePickerShared";

// iOS: a SwiftUI bottom sheet holding a List with one section of buttons.
// The trigger is a React Native chip, so the sheet is presented from a
// zero-size Host rather than a SwiftUI anchor.
const RangeSheet = <T extends string>({
  visible,
  options,
  value,
  onSelect,
  onClose,
}: RangeSheetProps<T>) => {
  const { theme } = useUniwind();

  // SwiftUI can't size a List on its own, so give it a height from the rows.
  const listHeight = options.length * 48 + 72;

  return (
    <Host
      style={{ position: "absolute", width: 0, height: 0 }}
      colorScheme={theme}
    >
      <BottomSheet
        isPresented={visible}
        onIsPresentedChange={(open) => {
          if (!open) onClose();
        }}
        fitToContents
      >
        <List modifiers={[frame({ height: listHeight })]}>
          <Section>
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
