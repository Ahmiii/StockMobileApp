import PortfolioList from "@/organisms/PortfolioList";
import { selectPortfolio, usePortfolios } from "@/queries/usePortfolios";
import { router } from "expo-router";

const Portfolios = () => {
  const { data, isPending, error } = usePortfolios();

  return (
    <PortfolioList
      portfolios={data ?? []}
      isPending={isPending}
      error={error}
      onSelect={(portfolio) => {
        selectPortfolio(portfolio.id);
        router.replace("/Portfolio");
      }}
    />
  );
};

export default Portfolios;
