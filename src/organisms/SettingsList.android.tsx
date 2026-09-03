import Card from "@/atoms/Card";
import Pill from "@/atoms/Pill";
import {
  Column,
  HorizontalDivider,
  Host,
  RNHostView,
  Row,
  SegmentedButton,
  SingleChoiceSegmentedButtonRow,
  Text,
} from "@expo/ui/jetpack-compose";
import { fillMaxWidth } from "@expo/ui/jetpack-compose/modifiers";
import { Text as RNText } from "react-native";
import { Uniwind, useCSSVariable, useUniwind } from "uniwind";
import { THEMES, type SettingsListProps } from "./SettingsList";

const SettingsList = ({ currency }: SettingsListProps) => {
  const { theme } = useUniwind();
  const [foreground, muted, primary, primaryForeground, secondary, border] =
    useCSSVariable([
      "--color-foreground",
      "--color-muted",
      "--color-primary",
      "--color-primary-foreground",
      "--color-secondary",
      "--color-border",
    ]);
  const fg = String(foreground);
  const dim = String(muted);
  const accent = String(primary);
  const onAccent = String(primaryForeground);
  const quiet = String(secondary);
  const line = String(border);

  // Reuse the RN Pill rather than restyle a Compose Badge.
  const soon = (
    <RNHostView matchContents>
      <Pill tone="primary">
        <RNText className="text-xs font-bold uppercase text-primary">
          Soon
        </RNText>
      </Pill>
    </RNHostView>
  );

  const label = (text: string) => (
    <Text color={fg} style={{ fontSize: 17, fontWeight: "600" }}>
      {text}
    </Text>
  );

  return (
    <Card bordered>
      <Host matchContents={{ vertical: true }} colorScheme={theme}>
        <Column
          verticalArrangement={{ spacedBy: 16 }}
          modifiers={[fillMaxWidth()]}
        >
          <Row
            horizontalArrangement="spaceBetween"
            verticalAlignment="center"
            modifiers={[fillMaxWidth()]}
          >
            {label("Appearance")}
            <SingleChoiceSegmentedButtonRow>
              {THEMES.map((option) => (
                <SegmentedButton
                  key={option.value}
                  selected={theme === option.value}
                  onClick={() => Uniwind.setTheme(option.value)}
                  colors={{
                    activeContainerColor: accent,
                    activeContentColor: onAccent,
                    activeBorderColor: accent,
                    inactiveContainerColor: quiet,
                    inactiveContentColor: dim,
                    inactiveBorderColor: line,
                  }}
                >
                  <SegmentedButton.Label>
                    <Text>{option.label}</Text>
                  </SegmentedButton.Label>
                </SegmentedButton>
              ))}
            </SingleChoiceSegmentedButtonRow>
          </Row>

          <HorizontalDivider color={line} />

          <Row
            horizontalArrangement="spaceBetween"
            verticalAlignment="center"
            modifiers={[fillMaxWidth()]}
          >
            {label("Base currency")}
            <Text color={dim} style={{ fontSize: 17 }}>
              {currency}
            </Text>
          </Row>

          <HorizontalDivider color={line} />

          <Row
            horizontalArrangement="spaceBetween"
            verticalAlignment="center"
            modifiers={[fillMaxWidth()]}
          >
            {label("Price alerts")}
            {soon}
          </Row>

          <HorizontalDivider color={line} />

          <Row
            horizontalArrangement="spaceBetween"
            verticalAlignment="center"
            modifiers={[fillMaxWidth()]}
          >
            {label("CGT report · FY26")}
            {soon}
          </Row>
        </Column>
      </Host>
    </Card>
  );
};

export default SettingsList;
