import Card from "@/atoms/Card";
import Divider from "@/atoms/Divider";
import Pill from "@/atoms/Pill";
import FilterChips from "@/molecules/FilterChips";
import SectionHeader from "@/molecules/SectionHeader";
import { Text, View } from "react-native";
import { Uniwind, useUniwind } from "uniwind";
import { THEMES, type SettingsListProps } from "./settingsListShared";

// Web fallback only. iOS renders SettingsList.ios.tsx (SwiftUI) and Android
// renders SettingsList.android.tsx (Jetpack Compose); Metro picks by platform.
const SettingsList = ({ currency }: SettingsListProps) => {
  const { theme } = useUniwind();

  const soon = (
    <Pill tone="primary">
      <Text className="text-xs font-bold uppercase text-primary">Soon</Text>
    </Pill>
  );

  return (
    <Card bordered>
      <SectionHeader
        title="Appearance"
        size="base"
        color="foreground"
        right={
          <View className="rounded-2xl bg-secondary p-1">
            <FilterChips
              options={THEMES}
              value={theme}
              onChange={(next) => Uniwind.setTheme(next)}
            />
          </View>
        }
      />
      <Divider className="my-4" />
      <SectionHeader
        title="Base currency"
        size="base"
        color="foreground"
        right={<Text className="text-lg text-muted">{currency}</Text>}
      />
      <Divider className="my-4" />
      <SectionHeader title="Price alerts" size="base" color="foreground" right={soon} />
      <Divider className="my-4" />
      <SectionHeader title="CGT report · FY26" size="base" color="foreground" right={soon} />
    </Card>
  );
};

export default SettingsList;
