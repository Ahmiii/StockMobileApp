import TradeHistory, { type Trade } from "@/organisms/TradeHistory";
import Screen from "@/templates/Screen";

// Placeholder data until the broker sync is wired up.
const TRADES: Trade[] = [
  { id: "t10", symbol: "FFC", side: "buy", quantity: 100, price: 191.2, total: 19149, date: "26 Aug 2026" },
  { id: "t9", symbol: "SYS", side: "sell", quantity: 50, price: 1058, total: 52821, date: "21 Aug 2026" },
  { id: "t8", symbol: "OGDC", side: "buy", quantity: 200, price: 214.75, total: 43014, date: "18 Aug 2026" },
  { id: "t7", symbol: "MEBL", side: "buy", quantity: 100, price: 247.3, total: 24767, date: "12 Aug 2026" },
  { id: "t6", symbol: "PPL", side: "sell", quantity: 150, price: 152.4, total: 22826, date: "05 Aug 2026" },
  { id: "t5", symbol: "LUCK", side: "buy", quantity: 20, price: 1590, total: 31848, date: "29 Jul 2026" },
  { id: "t4", symbol: "SYS", side: "buy", quantity: 50, price: 1141.5, total: 57161, date: "22 Jul 2026" },
  { id: "t3", symbol: "PPL", side: "buy", quantity: 200, price: 146.1, total: 29264, date: "15 Jul 2026" },
  { id: "t2", symbol: "OGDC", side: "buy", quantity: 300, price: 187.6, total: 56364, date: "08 Jul 2026" },
  { id: "t1", symbol: "FFC", side: "buy", quantity: 300, price: 166, total: 49875, date: "30 Jun 2026" },
];

// The list is the screen's scroller, so the Screen itself must not scroll.
const Trades = () => (
  <Screen scroll={false}>
    <TradeHistory source="AHL eTrade" trades={TRADES} />
  </Screen>
);

export default Trades;
