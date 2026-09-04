import Card from "@/atoms/Card";
import Pill from "@/atoms/Pill";
import {
  Divider,
  Host,
  HStack,
  Picker,
  RNHostView,
  Spacer,
  Text,
  VStack,
} from "@expo/ui/swift-ui";
import {
  font,
  foregroundStyle,
  frame,
  pickerStyle,
  tag,
  tint,
} from "@expo/ui/swift-ui/modifiers";
import { Text as RNText } from "react-native";
import { Uniwind, useCSSVariable, useUniwind } from "uniwind";
import { THEMES, type SettingsListProps, type Theme } from "./settingsListShared";

// iOS: native SwiftUI rows inside the app's Card. The theme switch is a real
// segmented UISegmentedControl. SwiftUI takes colors, not classes, so the
// tokens are read and passed in.
const SettingsList = ({ currency }: SettingsListProps) => {
  const { theme } = useUniwind();
  const [foreground, muted, primary] = useCSSVariable([
    "--color-foreground",
    "--color-muted",
    "--color-primary",
  ]);
  const fg = String(foreground);
  const dim = String(muted);
  const accent = String(primary);

  const rowLabel = [
    font({ size: 17, weight: "semibold" }),
    foregroundStyle(fg),
  ];
  const rowValue = [font({ size: 17 }), foregroundStyle(dim)];

  // Reuse the RN Pill rather than restyle a SwiftUI capsule.
  const soon = (
    <RNHostView matchContents>
      <Pill tone="primary">
        <RNText className="text-xs font-bold uppercase text-primary">
          Soon
        </RNText>
      </Pill>
    </RNHostView>
  );

  return (
    <Card bordered>
      <Host matchContents={{ vertical: true }} colorScheme={theme}>
        <VStack spacing={16}>
          <HStack>
            <Text modifiers={rowLabel}>Appearance</Text>
            <Spacer />
            <Picker<Theme>
              selection={theme}
              onSelectionChange={(next) => Uniwind.setTheme(next)}
              modifiers={[
                pickerStyle("segmented"),
                tint(accent),
                frame({ width: 160 }),
              ]}
            >
              {THEMES.map((option) => (
                <Text key={option.value} modifiers={[tag(option.value)]}>
                  {option.label}
                </Text>
              ))}
            </Picker>
          </HStack>

          <Divider />

          <HStack>
            <Text modifiers={rowLabel}>Base currency</Text>
            <Spacer />
            <Text modifiers={rowValue}>{currency}</Text>
          </HStack>

          <Divider />

          <HStack>
            <Text modifiers={rowLabel}>Price alerts</Text>
            <Spacer />
            {soon}
          </HStack>

          <Divider />

          <HStack>
            <Text modifiers={rowLabel}>CGT report · FY26</Text>
            <Spacer />
            {soon}
          </HStack>
        </VStack>
      </Host>
    </Card>
  );
};

export default SettingsList;
