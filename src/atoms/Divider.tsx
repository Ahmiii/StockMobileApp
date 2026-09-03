import { View } from "react-native";

type Props = { className?: string };

const Divider = ({ className = "" }: Props) => (
  <View className={`h-px w-full bg-border ${className}`} />
);

export default Divider;
