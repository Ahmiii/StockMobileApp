import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";

const StyledSafeAreaView = withUniwind(SafeAreaView);

type Props = { className?: string; children: React.ReactNode };
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
