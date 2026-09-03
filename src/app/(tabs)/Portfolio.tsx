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
    symbol: "LUCK",
    name: "Lucky Cement",
    value: "Rs 28,150",
    change: "-0.6%",
    tone: "danger",
    trend: [910, 905, 912, 900, 895, 898, 890, 885, 888, 880],
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
    symbol: "LUCK",
    name: "Lucky Cement",
    value: "Rs 28,150",
    change: "-0.6%",
    tone: "danger",
    trend: [910, 905, 912, 900, 895, 898, 890, 885, 888, 880],
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
    symbol: "LUCK",
    name: "Lucky Cement",
    value: "Rs 28,150",
    change: "-0.6%",
    tone: "danger",
    trend: [910, 905, 912, 900, 895, 898, 890, 885, 888, 880],
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
    symbol: "LUCK",
    name: "Lucky Cement",
    value: "Rs 28,150",
    change: "-0.6%",
    tone: "danger",
    trend: [910, 905, 912, 900, 895, 898, 890, 885, 888, 880],
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
