import { View } from "react-native";

type Props = {
  bordered?: boolean;
  className?: string;
  children: React.ReactNode;
};

const Card = ({ bordered = false, className = "", children }: Props) => (
  <View
    className={`rounded-2xl bg-card p-4 ${bordered ? "border border-border" : ""} ${className}`}
  >
    {children}
  </View>
);

export default Card;
