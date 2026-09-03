import { Pressable, Text } from "react-native";

type Props = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

// A tappable filter chip. Solid primary when active, quiet when not.
const Chip = ({ label, active = false, onPress }: Props) => (
  <Pressable
    onPress={onPress}
    className={`rounded-xl px-5 py-2.5 ${active ? "bg-primary" : "bg-secondary"}`}
  >
    <Text
      className={`text-base font-bold ${active ? "text-primary-foreground" : "text-muted"}`}
    >
      {label}
    </Text>
  </Pressable>
);

export default Chip;
