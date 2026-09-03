import { ScrollView, View } from "react-native";

type Props = {
  className?: string;
  /**
   * Pass false when the screen's main content is a FlashList. Two scrollers
   * nested in the same direction fight over the gesture (a short list hands
   * the drag to the page, so the whole screen moves). With false, the screen
   * only fills its area and the list does all the scrolling.
   */
  scroll?: boolean;
  children: React.ReactNode;
};

// No SafeAreaView here on purpose. The tab navigator adds the status-bar
// inset once for every tab (see (tabs)/_layout.tsx), so each screen starts at
// the same y-offset and nothing has to be re-measured when tabs switch.
const Screen = ({ className = "", scroll = true, children }: Props) =>
  scroll ? (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      // iOS otherwise rubber-bands even when the content fits on screen.
      alwaysBounceVertical={false}
      contentContainerClassName={`gap-2 pb-6 ${className}`}
    >
      {children}
    </ScrollView>
  ) : (
    <View className={`flex-1 gap-2 ${className}`}>{children}</View>
  );

export default Screen;
