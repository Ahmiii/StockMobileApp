import {
  Column,
  Host,
  ListItem,
  ModalBottomSheet,
  Text,
} from "@expo/ui/jetpack-compose";
import { clickable, fillMaxWidth } from "@expo/ui/jetpack-compose/modifiers";
import { useCSSVariable, useUniwind } from "uniwind";
import type { RangeSheetProps } from "./rangePickerShared";

// Android: a Material 3 modal bottom sheet with one list item per option.
// Compose takes colors, not classes, so the tokens are read and passed in.
const RangeSheet = ({ visible, options, value, onSelect, onClose }: RangeSheetProps) => {
  const { theme } = useUniwind();
  const [card, foreground, primary] = useCSSVariable([
    "--color-card",
    "--color-foreground",
    "--color-primary",
  ]);

  if (!visible) return null;

  return (
    <Host matchContents colorScheme={theme}>
      <ModalBottomSheet
        onDismissRequest={onClose}
        containerColor={String(card)}
        contentColor={String(foreground)}
      >
        <Column modifiers={[fillMaxWidth()]}>
          {options.map((option) => (
            <ListItem
              key={option.value}
              colors={{ containerColor: String(card), contentColor: String(foreground) }}
              modifiers={[fillMaxWidth(), clickable(() => onSelect(option.value))]}
            >
              <ListItem.HeadlineContent>
                <Text color={String(foreground)}>{option.label}</Text>
              </ListItem.HeadlineContent>
              {option.value === value ? (
                <ListItem.TrailingContent>
                  <Text color={String(primary)}>✓</Text>
                </ListItem.TrailingContent>
              ) : null}
            </ListItem>
          ))}
        </Column>
      </ModalBottomSheet>
    </Host>
  );
};

export default RangeSheet;
