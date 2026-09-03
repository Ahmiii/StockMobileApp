import Watchlist, { type WatchItem } from "@/organisms/Watchlist";
import Screen from "@/templates/Screen";

// Placeholder data until the watchlist is wired up.
const WATCHLIST: WatchItem[] = [
  {
    symbol: "HBL",
    name: "Habib Bank",
    price: 245.6,
    change: 1.1,
    target: 280,
    trend: [228, 231, 230, 234, 233, 236, 238, 240, 243, 245.6],
  },
  {
    symbol: "ENGRO",
    name: "Engro Holdings",
    price: 412.85,
    change: 0.9,
    target: 450,
    trend: [390, 394, 398, 397, 402, 405, 404, 408, 410, 412.85],
  },
  {
    symbol: "UBL",
    name: "United Bank",
    price: 372.1,
    change: 0.7,
    target: 400,
    trend: [350, 352, 356, 355, 360, 363, 366, 370, 374, 372.1],
  },
  {
    symbol: "MARI",
    name: "Mari Energies",
    price: 612.35,
    change: 4.1,
    target: 700,
    trend: [560, 565, 570, 576, 580, 588, 594, 600, 606, 612.35],
  },
  {
    symbol: "AIRLINK",
    name: "Air Link Communication",
    price: 182.4,
    change: 7.2,
    target: 200,
    trend: [160, 164, 168, 171, 170, 174, 176, 178, 180, 182.4],
  },
];

// The list is the screen's scroller, so the Screen itself must not scroll.
const Watch = () => (
  <Screen scroll={false}>
    <Watchlist items={WATCHLIST} />
  </Screen>
);

export default Watch;
