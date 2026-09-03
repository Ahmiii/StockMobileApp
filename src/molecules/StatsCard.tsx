import Card from "@/atoms/Card";
import Label from "@/atoms/Label";
import { Text } from "react-native";

type Props = {
  lable: string;
  realizeProfit: number;
};
const StatsCard = ({ lable, realizeProfit = 0 }: Props) => {
  return (
    <Card className="grow pb-2 pt-2" bordered>
      <Label className="text-sm font-normal">{lable}</Label>
      <Text className="text-lg font-bold text-foreground">
        {`Rs ${realizeProfit}`}
      </Text>
    </Card>
  );
};
export default StatsCard;
