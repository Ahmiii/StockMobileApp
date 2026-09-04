import { Text, View } from "react-native";

type Props = { children: React.ReactNode };

// A soft gold box for a reassuring or explanatory note.
const InfoNote = ({ children }: Props) => (
  <View className="rounded-2xl bg-primary-soft p-4">
    <Text className="text-base leading-6 text-muted">{children}</Text>
  </View>
);

export default InfoNote;
