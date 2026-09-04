import { ScrollView, View } from "react-native";

type Props = {
  className?: string;
  scroll?: boolean;
  children: React.ReactNode;
};

const Screen = ({ className = "", scroll = true, children }: Props) =>
  scroll ? (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      alwaysBounceVertical={false}
      contentContainerClassName={`gap-2 pb-6 ${className}`}
    >
      {children}
    </ScrollView>
  ) : (
    <View className={`flex-1 gap-2 ${className}`}>{children}</View>
  );

export default Screen;
