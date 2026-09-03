import MarketIndexCard from "@/organisms/MarketIndexCard";
import SectorsToday, { type Sector } from "@/organisms/SectorsToday";
import StocksVsIndex, { type StockComparison } from "@/organisms/StocksVsIndex";
import Screen from "@/templates/Screen";
import { Text } from "react-native";

// Placeholder data until the market feed is wired up.
const KSE100_TREND = [
  146200, 146450, 146100, 146800, 147300, 147000, 147600, 147200, 147900,
  147832,
];

// The index rebased to 100 so it can sit on the same scale as each stock.
const INDEX_REBASED = KSE100_TREND.map((v) => (v / KSE100_TREND[0]) * 100);

const STOCKS: StockComparison[] = [
  {
    symbol: "OGDC",
    name: "Oil & Gas Development",
    change: "+26.7%",
    tone: "success",
    trend: [100, 104, 108, 106, 112, 118, 121, 124, 126, 127],
    benchmark: INDEX_REBASED,
  },
  {
    symbol: "MEBL",
    name: "Meezan Bank",
    change: "+13.7%",
    tone: "success",
    trend: [100, 102, 101, 105, 108, 107, 110, 112, 113, 114],
    benchmark: INDEX_REBASED,
  },
  {
    symbol: "LUCK",
    name: "Lucky Cement",
    change: "+20.1%",
    tone: "success",
    trend: [100, 103, 106, 104, 110, 113, 115, 118, 119, 120],
    benchmark: INDEX_REBASED,
  },
  {
    symbol: "FFC",
    name: "Fauji Fertilizer",
    change: "+24.3%",
    tone: "success",
    trend: [100, 105, 104, 109, 114, 116, 119, 121, 123, 124],
    benchmark: INDEX_REBASED,
  },
  {
    symbol: "SYS",
    name: "Systems Limited",
    change: "-17.5%",
    tone: "danger",
    trend: [100, 97, 95, 96, 92, 90, 88, 86, 84, 82],
    benchmark: INDEX_REBASED,
  },
  {
    symbol: "PPL",
    name: "Pakistan Petroleum",
    change: "-25.3%",
    tone: "danger",
    trend: [100, 96, 93, 90, 88, 85, 82, 79, 77, 75],
    benchmark: INDEX_REBASED,
  },
];

const SECTORS: Sector[] = [
  { name: "Banking", change: 1.2 },
  { name: "E&P", change: 1.0 },
  { name: "Cement", change: 0.8 },
  { name: "Fertilizer", change: 0.3 },
  { name: "Power", change: -0.4 },
  { name: "Technology", change: -0.7 },
];

const Market = () => {
  return (
    <Screen>
      <MarketIndexCard
        name="KSE-100"
        value="147,832.64"
        change="+1,102.38 · +0.76%"
        tone="success"
        trend={KSE100_TREND}
        stats={[
          { label: "Volume", value: "512M" },
          { label: "Value", value: "Rs 28.4B" },
          {
            label: "Adv / Dec",
            value: (
              <Text className="text-sm font-semibold text-foreground">
                <Text className="text-success">214</Text> /{" "}
                <Text className="text-danger">129</Text>
              </Text>
            ),
          },
        ]}
      />

      <StocksVsIndex stocks={STOCKS} />

      <SectorsToday sectors={SECTORS} />
    </Screen>
  );
};

export default Market;
