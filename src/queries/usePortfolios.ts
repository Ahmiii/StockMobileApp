import { getHoldings, getPortfolios } from "@/apis/portfolio";
import { useQuery } from "@tanstack/react-query";

export const usePortfolios = () =>
  useQuery({
    queryKey: ["portfolios"],
    queryFn: getPortfolios,
  });

export const useHoldings = (portfolioId: string) =>
  useQuery({
    queryKey: ["holdings", portfolioId],
    queryFn: () => getHoldings(portfolioId),
    // Don't call /portfolio//positions while the id is still unknown.
    enabled: portfolioId !== "",
  });
