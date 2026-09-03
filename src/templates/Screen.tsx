import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";

const StyledSafeAreaView = withUniwind(SafeAreaView);

type Props = {
  className?: string;
  /**
   * Pass false when the screen's main content is a FlashList. Two scrollers
   * nested in the same direction fight over the gesture (a short list hands
   * the drag to the page, so the whole screen moves). With false, the screen
   * only fills the safe area and the list does all the scrolling.
   */
  scroll?: boolean;
  children: React.ReactNode;
};

const Screen = ({ className = "", scroll = true, children }: Props) => (
  <StyledSafeAreaView className="flex-1" edges={["top"]}>
    {scroll ? (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName={`gap-2 pb-6 ${className}`}
      >
        {children}
      </ScrollView>
    ) : (
      <View className={`flex-1 gap-2 ${className}`}>{children}</View>
    )}
  </StyledSafeAreaView>
);

export default Screen;
