import { Text, View } from "react-native";

type Props = { lines: string[] };

// Centered muted lines at the bottom of a screen: data sources, version, etc.
const AppFooter = ({ lines }: Props) => (
  <View className="items-center gap-1 py-4">
    {lines.map((line) => (
      <Text key={line} className="text-sm text-muted">
        {line}
      </Text>
    ))}
  </View>
);

export default AppFooter;
