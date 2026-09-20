import type {
  DividendByStock,
  DividendRecord,
  UpcommingDividendsRecord,
} from "@/apis/portfolio";
import Card from "@/atoms/Card";
import Divider from "@/atoms/Divider";
import Label from "@/atoms/Label";
import FilterChips, { type FilterOption } from "@/molecules/FilterChips";
import Ionicons from "@react-native-vector-icons/ionicons";
import { FlashList } from "@shopify/flash-list";
import { Fragment, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useCSSVariable } from "uniwind";

type Tab = "received" | "upcoming";

const TABS: FilterOption<Tab>[] = [
  { value: "received", label: "Earned" },
  { value: "upcoming", label: "Upcoming" },
];

type Props = {
  title?: string;
  items: DividendByStock[];
  dividends: DividendRecord[];
  upcomingDividend: UpcommingDividendsRecord[];
  /** Shows a "Close" button at the top when given. */
  onClose?: () => void;
};

const money = (amount: number, decimals = 0) =>
  amount.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

// The backend sends the calendar date at midnight UTC, so it is read as UTC on every phone.
const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

const Separator = () => <View className="h-2" />;

// One payout line: date, per-share × shares, rupees.
const PayoutRow = ({ record }: { record: DividendRecord }) => (
  <View className="flex-row items-center justify-between">
    <View>
      <Text className="text-sm text-foreground">
        {shortDate(record.exDate)}
      </Text>
      <Text className="text-xs text-muted">
        Rs {money(record.perShare, 2)} × {money(record.shares)} shares
      </Text>
    </View>
    <Text className="text-sm font-semibold text-foreground">
      Rs {money(record.rupees, 2)}
    </Text>
  </View>
);

// Two tabs. "Earned": one row per stock that opens like an accordion to
// list that stock's payouts. "Upcoming": announced payouts, one per line.
// All amounts are before the 15% tax, and a payout counts from its ex-date,
// which is a few weeks before the cash arrives.
const DividendStockList = ({
  title = "Dividends",
  items,
  dividends,
  upcomingDividend,
  onClose,
}: Props) => {
  const [tab, setTab] = useState<Tab>("received");
  const [openSymbol, setOpenSymbol] = useState<string | null>(null);
  const [muted] = useCSSVariable(["--color-muted"]);
  const toggle = (symbol: string) =>
    setOpenSymbol((current) => (current === symbol ? null : symbol));

  // The stock that paid the most comes first.
  const stocksByAmount = [...items].sort((a, b) => b.rupees - a.rupees);

  let list = null;

  if (tab === "received") {
    list = (
      <FlashList
        data={stocksByAmount}
        keyExtractor={(item) => item.symbol}
        // Rows only re-render when their data changes; the open state lives
        // outside the data, so tell the list to re-render when it moves.
        extraData={openSymbol}
        renderItem={({ item }) => {
          const open = item.symbol === openSymbol;
          // The backend sends the oldest payout first; the newest reads better on top.
          const records = dividends
            .filter((record) => record.symbol === item.symbol)
            .reverse();

          return (
            <Card bordered className="gap-3">
              <Pressable
                onPress={() => toggle(item.symbol)}
                accessibilityRole="button"
                accessibilityState={{ expanded: open }}
              >
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-base font-bold text-foreground">
                      {item.symbol}
                    </Text>
                    <Text className="text-xs text-muted">
                      {item.dividends}{" "}
                      {item.dividends === 1 ? "payout" : "payouts"}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-base font-semibold text-success">
                      Rs {money(item.rupees, 2)}
                    </Text>
                    <Ionicons
                      name={open ? "chevron-up" : "chevron-down"}
                      size={16}
                      color={String(muted)}
                    />
                  </View>
                </View>
              </Pressable>

              {open ? (
                <View className="gap-2">
                  <Divider />
                  {records.map((record, i) => (
                    <Fragment key={`${record.exDate}-${i}`}>
                      {i > 0 ? <Divider /> : null}
                      <PayoutRow record={record} />
                    </Fragment>
                  ))}
                </View>
              ) : null}
            </Card>
          );
        }}
        ItemSeparatorComponent={Separator}
        ListEmptyComponent={
          <Text className="text-muted">No dividends received yet</Text>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    );
  } else {
    list = (
      <FlashList
        data={upcomingDividend}
        keyExtractor={(record, i) => `${record.symbol}-${record.exDate}-${i}`}
        renderItem={({ item }) => (
          <Card bordered className="gap-1">
            <Text className="text-base font-bold text-foreground">
              {item.symbol}
            </Text>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm text-foreground">
                  Ex-date {shortDate(item.exDate)}
                </Text>
                <Text className="text-xs text-muted">
                  Own the shares by {shortDate(item.ownBy)}
                </Text>
                <Text className="text-xs text-muted">
                  Rs {money(item.perShare, 2)} × {money(item.shares)} shares
                </Text>
              </View>
              <Text className="text-sm font-semibold text-foreground">
                Rs {money(item.expected, 2)}
              </Text>
            </View>
          </Card>
        )}
        ItemSeparatorComponent={Separator}
        ListEmptyComponent={
          <Text className="text-muted">No upcoming dividends announced</Text>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  return (
    <View className="flex-1 gap-3">
      <View className="flex-row items-center justify-between">
        <Label size="lg" color="foreground">
          {title}
        </Label>
        {onClose ? (
          <Pressable onPress={onClose} accessibilityRole="button">
            <Text className="text-base font-semibold text-primary">Close</Text>
          </Pressable>
        ) : null}
      </View>
      <Text className="text-xs text-muted">
        Before the 15% tax. A payout counts from its ex-date, a few weeks before the cash arrives.
      </Text>

      <FilterChips options={TABS} value={tab} onChange={setTab} />

      <View className="flex-1">{list}</View>
    </View>
  );
};

export default DividendStockList;
