import type { Income } from "@/apis/portfolio";
import Card from "@/atoms/Card";
import Divider from "@/atoms/Divider";
import Pill from "@/atoms/Pill";
import SectionHeader from "@/molecules/SectionHeader";
import { Text, View } from "react-native";

const money = (amount: number) => `Rs ${Math.round(amount).toLocaleString("en-US")}`;

// "2026-09-17" -> "17 Sep"
const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

type FigureProps = { label: string; value: string; hint?: string; alignRight?: boolean };

const Figure = ({ label, value, hint, alignRight }: FigureProps) => (
  <View className={alignRight ? "items-end" : ""}>
    <Text className="text-xs text-muted">{label}</Text>
    <Text className="text-lg font-bold text-foreground">{value}</Text>
    {hint ? <Text className="text-xs text-muted">{hint}</Text> : null}
  </View>
);

type Props = { income: Income };

// Dividend income: what this fiscal year has paid so far, what the current
// holdings should pay over the next twelve months, and the dividends coming
// up, with the day you must own the shares by.
const IncomeCard = ({ income }: Props) => {
  const { thisYear, projected, upcoming, taxRate } = income;
  const next = upcoming.slice(0, 4);

  return (
    <View className="gap-2">
      <SectionHeader
        title="DIVIDEND INCOME"
        right={<Text className="text-xs text-muted">after {Math.round(taxRate * 100)}% tax</Text>}
      />

      <Card bordered className="gap-3">
        <View className="flex-row justify-between">
          <Figure
            label={`FY${thisYear.fiscalYear} so far`}
            value={money(thisYear.net)}
            hint={`${thisYear.dividends} dividend${thisYear.dividends === 1 ? "" : "s"}`}
          />
          <Figure
            label="Next 12 months"
            value={money(projected.net)}
            hint={projected.yieldOnCost === null ? undefined : `${projected.yieldOnCost.toFixed(1)}% on cost`}
            alignRight
          />
        </View>

        {next.length > 0 ? <Divider /> : null}

        {next.map((dividend) => (
          <View
            key={`${dividend.symbol}-${dividend.exDate}`}
            className="flex-row items-center justify-between"
          >
            <View>
              <Text className="font-semibold text-foreground">{dividend.symbol}</Text>
              <Text className="text-xs text-muted">
                Rs {dividend.amount}/share · own by {shortDate(dividend.buyBefore)}
              </Text>
            </View>
            {dividend.expected ? (
              <Text className="font-semibold text-success">+{money(dividend.expected.net)}</Text>
            ) : (
              <Pill tone="neutral">
                <Text className="text-xs text-muted">watching</Text>
              </Pill>
            )}
          </View>
        ))}

        {next.length === 0 ? (
          <Text className="text-xs text-muted">No dividends announced for your stocks yet.</Text>
        ) : null}
      </Card>
    </View>
  );
};

export default IncomeCard;
