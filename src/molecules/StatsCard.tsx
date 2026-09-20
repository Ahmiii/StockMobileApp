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
      {/* "Rs 5,124,653", and "-Rs 6,810" for a loss */}
      <Text className="text-lg font-bold text-foreground">
        {`${realizeProfit < 0 ? "-" : ""}Rs ${Math.abs(realizeProfit).toLocaleString("en-US")}`}
      </Text>
    </Card>
  );
};
export default StatsCard;
