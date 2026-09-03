import Avatar from "@/atoms/Avatar";
import Card from "@/atoms/Card";
import { Text, View } from "react-native";

type Props = {
  name: string; // "A. Raza"
  email: string;
};

// "A. Raza" -> "AR". First letter of the first two words.
const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((word) => word[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);

const ProfileCard = ({ name, email }: Props) => (
  <Card bordered>
    <View className="flex-row items-center gap-4">
      <Avatar initials={initialsOf(name)} />
      <View className="flex-1">
        <Text className="text-2xl font-bold text-foreground">{name}</Text>
        <Text className="text-base text-muted" numberOfLines={1}>
          {email}
        </Text>
      </View>
    </View>
  </Card>
);

export default ProfileCard;
