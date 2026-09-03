import { Text, View } from "react-native";

type Props = { initials: string; className?: string };

// A round initials badge, e.g. "AR". Pass at most two characters.
const Avatar = ({ initials, className = "" }: Props) => (
  <View
    className={`size-20 items-center justify-center rounded-full bg-primary-soft ${className}`}
  >
    <Text className="text-2xl font-bold text-primary">{initials}</Text>
  </View>
);

export default Avatar;
