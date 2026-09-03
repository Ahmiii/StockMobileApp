import HoldingsSection, { type Holding } from "@/organisms/HoldingsSection";
import InvestPnL from "@/organisms/Invest&PnL";
import PerformanceCard from "@/organisms/PerformanceCard";
import PortfolioHeader from "@/organisms/PortfolioHeader";
import PortfolioSummary from "@/organisms/PortfolioSummary";
import Screen from "@/templates/Screen";

// Placeholder data until the portfolio history is wired up.
const PORTFOLIO_TREND = [96, 98, 97, 101, 104, 103, 108, 111, 110, 116];
const BENCHMARK_TREND = [96, 97, 99, 98, 100, 102, 101, 104, 105, 106];
const HOLDINGS: Holding[] = [
  {
    symbol: "OGDC",
    name: "Oil & Gas Development",
    value: "Rs 42,300",
    change: "+1.2%",
    tone: "success",
    trend: [118, 119, 117, 121, 124, 123, 127, 126, 130, 132],
  },
  {
    symbol: "LUCK",
    name: "Lucky Cement",
    value: "Rs 28,150",
    change: "-0.6%",
    tone: "danger",
    trend: [910, 905, 912, 900, 895, 898, 890, 885, 888, 880],
  },
  {
    symbol: "PPL",
    name: "Pakistan Petroleum",
    value: "Rs 19,870",
    change: "+0.9%",
    tone: "success",
    trend: [150, 152, 151, 154, 153, 156, 158, 157, 160, 162],
  },
  {
    symbol: "HBL",
    name: "Habib Bank",
    value: "Rs 15,400",
    change: "+0.3%",
    tone: "success",
    trend: [128, 127, 129, 130, 129, 131, 130, 132, 133, 133],
  },
  {
    symbol: "ENGRO",
    name: "Engro Holdings",
    value: "Rs 12,960",
    change: "-1.4%",
    tone: "danger",
    trend: [340, 338, 341, 336, 333, 335, 330, 328, 326, 325],
  },
  {
    symbol: "MARI",
    name: "Mari Energies",
    value: "Rs 11,250",
    change: "+2.1%",
    tone: "success",
    trend: [560, 565, 563, 570, 575, 574, 580, 584, 590, 592],
  },
  {
    symbol: "TRG",
    name: "TRG Pakistan",
    value: "Rs 8,730",
    change: "0.0%",
    tone: "neutral",
    trend: [64, 65, 64, 66, 65, 64, 65, 65, 64, 64],
  },
  {
    symbol: "SYS",
    name: "Systems Limited",
    value: "Rs 7,410",
    change: "-0.2%",
    tone: "danger",
    trend: [410, 412, 409, 411, 408, 410, 407, 406, 408, 407],
  },
  {
    symbol: "FFC",
    name: "Fauji Fertilizer",
    value: "Rs 6,980",
    change: "+0.5%",
    tone: "success",
    trend: [112, 113, 112, 114, 115, 114, 116, 117, 117, 118],
  },
];
const Portfolio = () => (
  <Screen>
    <PortfolioHeader syncLabel="Sync now" />

    <PortfolioSummary
      value="Rs 0.00"
      change={{ amount: "Rs 2,745", percent: "+0.48", caption: "today" }}
    />

    <PerformanceCard
      period="Since June"
      delta="+233"
      portfolio={PORTFOLIO_TREND}
      benchmark={BENCHMARK_TREND}
      benchmarkName="KSE-100"
      comparison="+11.8% vs KSE-100"
    />
    <InvestPnL />
    <HoldingsSection holdings={HOLDINGS} />
  </Screen>
);

export default Portfolio;
