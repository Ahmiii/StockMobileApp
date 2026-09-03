import { ScrollView, View } from "react-native";

export type ScrollerProps = {
  height: number;
  contentClassName?: string;
  children: React.ReactNode;
};
const Scroller = ({
  height,
  contentClassName = "gap-2",
  children,
}: ScrollerProps) => (
  <ScrollView
    style={{ height }}
    nestedScrollEnabled
    showsVerticalScrollIndicator={false}
    contentContainerClassName={contentClassName}
  >
    <View className={contentClassName}>{children}</View>
  </ScrollView>
);

export default Scroller;
