import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";

// react-native-safe-area-context's SafeAreaView is not one of the core
// components Uniwind patches, so give it className support explicitly.
const StyledSafeAreaView = withUniwind(SafeAreaView);

type Props = { className?: string; children: React.ReactNode };

// Shared scaffold for tab screens: safe-area top, scrollable, sections
// stacked vertically with a consistent gap. Horizontal padding comes from
// the tab navigator's sceneStyle, so none is added here.
const Screen = ({ className = "", children }: Props) => (
  <StyledSafeAreaView className="flex-1" edges={["top"]}>
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerClassName={`gap-2 pb-6 ${className}`}
    >
      {children}
    </ScrollView>
  </StyledSafeAreaView>
);

export default Screen;
