import Dot from "@/atoms/Dot";
import { Text, View } from "react-native";

type Props = { items: string[] };

// Bulleted selling points with a gold dot per line.
const FeatureList = ({ items }: Props) => (
  <View className="gap-5">
    {items.map((item) => (
      <View key={item} className="flex-row items-start gap-4">
        <Dot tone="primary" className="mt-2 size-2.5" />
        <Text className="flex-1 text-xl leading-7 text-foreground">{item}</Text>
      </View>
    ))}
  </View>
);

export default FeatureList;
