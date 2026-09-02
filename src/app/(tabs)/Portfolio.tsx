import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Portfolio = () => {
  return (
    <SafeAreaView>
      <View className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
        <Text className="text-primary dark:text-primary-300">
          This text adapts to the current themee
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Portfolio;
