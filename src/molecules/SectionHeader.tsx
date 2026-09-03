import { Text, View } from "react-native";
import SyncStatus from "./SyncStatusCard";
type Props = {
  profileLable: string;
  syncStatusLable: string;
};
const SectionHeader = ({ profileLable, syncStatusLable }: Props) => {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-muted font-bold">{profileLable}</Text>
      <SyncStatus label={syncStatusLable} />
    </View>
  );
};

export default SectionHeader;
