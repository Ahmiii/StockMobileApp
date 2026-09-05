import Card from "@/atoms/Card";
import Label from "@/atoms/Label";
import { Text, View } from "react-native";

type Props = {
  /** Latest close, e.g. 360.7 */
  price: number;
  /** Move over the period, in rupees and percent. */
  changeAmount: number;
  changePct: number;
  periodLabel: string; // "Last 6 months"
  asOf: string; // "2026-09-04"
};

const money = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const signed = (n: number, suffix = "") =>
  `${n > 0 ? "+" : n < 0 ? "-" : ""}${money(Math.abs(n))}${suffix}`;

const toneClass = (n: number) => {
  if (n > 0) return "text-success";
  if (n < 0) return "text-danger";
  return "text-muted";
};

// "2026-09-04" -> "4 Sep 2026"
const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const StockSummaryCard = ({ price, changeAmount, changePct, periodLabel, asOf }: Props) => (
  <Card bordered className="gap-1">
    <Label size="xs" className="uppercase">
      Last close · {longDate(asOf)}
    </Label>
    <Text className="text-3xl font-bold text-foreground">Rs {money(price)}</Text>
    <View className="flex-row items-center gap-2">
      <Text className={`text-sm font-semibold ${toneClass(changeAmount)}`}>
        {signed(changeAmount)} ({signed(changePct, "%")})
      </Text>
      <Text className="text-sm text-muted">{periodLabel.toLowerCase()}</Text>
    </View>
  </Card>
);

export default StockSummaryCard;
