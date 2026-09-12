import type { DividendByStock, DividendRecord } from "@/apis/portfolio";
import Card from "@/atoms/Card";
import Divider from "@/atoms/Divider";
import Label from "@/atoms/Label";
import Ionicons from "@react-native-vector-icons/ionicons";
import { FlashList } from "@shopify/flash-list";
import { Fragment, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useCSSVariable } from "uniwind";

type Props = {
  title?: string;
  items: DividendByStock[];
  dividends: DividendRecord[];
};

// 5849.5 -> "5,850"
const money = (amount: number, decimals = 0) =>
  amount.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

// "2024-08-12T00:00:00.000Z" -> "12 Aug 2024"
const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const Separator = () => <View className="h-2" />;

// One row per stock: symbol, payout count and rupees received. Tapping a row
// opens it like an accordion and lists that stock's payouts underneath, from
// the `dividends` records. One stock is open at a time.
const DividendStockList = ({
  title = "Dividends by stock",
  items,
  dividends,
}: Props) => {
  const [openSymbol, setOpenSymbol] = useState<string | null>(null);
  const [muted] = useCSSVariable(["--color-muted"]);
  const toggle = (symbol: string) =>
    setOpenSymbol((current) => (current === symbol ? null : symbol));

  return (
    <View className="flex-1 gap-3">
      <Label size="lg" color="foreground">
        {title}
      </Label>

      <View className="flex-1">
        <FlashList
          data={items}
          keyExtractor={(item) => item.symbol}
          extraData={openSymbol}
          renderItem={({ item }) => {
            const open = item.symbol === openSymbol;
            const records = dividends?.filter(
              (record) => record.symbol === item.symbol,
            );

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
                        Rs {money(item.rupees)}
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
                    {records?.map((record, i) => (
                      <Fragment key={`${record.exDate}-${i}`}>
                        {i > 0 ? <Divider /> : null}
                        <View className="flex-row items-center justify-between">
                          <View>
                            <Text className="text-sm text-foreground">
                              {shortDate(record.exDate)}
                            </Text>
                            <Text className="text-xs text-muted">
                              Rs {money(record.perShare, 2)} × {record.shares}{" "}
                              shares
                            </Text>
                          </View>
                          <Text className="text-sm font-semibold text-foreground">
                            Rs {money(record.rupees)}
                          </Text>
                        </View>
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
      </View>
    </View>
  );
};

export default DividendStockList;
