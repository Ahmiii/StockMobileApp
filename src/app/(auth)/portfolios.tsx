import PortfolioList from "@/organisms/PortfolioList";
import { usePortfolios } from "@/queries/usePortfolios";
import { router } from "expo-router";

const Portfolios = () => {
  const { data, isPending, error } = usePortfolios();

  return (
    <PortfolioList
      portfolios={data ?? []}
      isPending={isPending}
      error={error}
      onSelect={() => router.replace("/Portfolio")}
    />
  );
};

export default Portfolios;
