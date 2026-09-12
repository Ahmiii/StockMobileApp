import Card from "@/atoms/Card";
import Label from "@/atoms/Label";
import Ionicons from "@react-native-vector-icons/ionicons";
import { Pressable, View } from "react-native";
import { useCSSVariable } from "uniwind";
type horizontalChipProps = {
  label: string;
  statValue: string;
  iconName: string;
};
const HorizontalChip = ({
  label,
  statValue,
  iconName,
}: horizontalChipProps) => {
  const [muted] = useCSSVariable(["--color-muted"]);

  return (
    <Pressable className="flex-row grow" onPress={() => {}}>
      <Card bordered className="flex-row grow items-center justify-between">
        <Label>{label}</Label>
        <View className="flex-row gap-2 items-center justify-between">
          <Label>{statValue}</Label>
          {iconName && (
            <Ionicons name="chevron-forward" color={String(muted)} />
          )}
        </View>
      </Card>
    </Pressable>
  );
};

export default HorizontalChip;
