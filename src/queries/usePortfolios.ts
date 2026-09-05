import {
  getHoldings,
  getPortfolios,
  getTrades,
  type DateRange,
} from "@/apis/portfolio";
import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const usePortfolios = () =>
  useQuery({
    queryKey: ["portfolios"],
    queryFn: getPortfolios,
  });

// The range is part of the cache key, so each picked range is fetched once
// and switching back to it is instant.
export const useHoldings = (portfolioId: string, range?: DateRange) =>
  useQuery({
    queryKey: ["holdings", portfolioId, range],
    queryFn: () => getHoldings(portfolioId, range),
    enabled: portfolioId !== "",
    // When the range changes, keep showing the last result until the new one
    // arrives, instead of dropping back to the skeleton.
    placeholderData: keepPreviousData,
  });

export const useTrades = (portfolioId: string) =>
  useInfiniteQuery({
    queryKey: ["trades", portfolioId],
    queryFn: ({ pageParam }) => getTrades(portfolioId, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination.hasMore) return undefined;
      return lastPage.pagination.offset + lastPage.pagination.limit;
    },
    enabled: portfolioId !== "",
  });
