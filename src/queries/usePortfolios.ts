import {
  getBenchmark,
  getDividends,
  getHoldings,
  getIncome,
  getPortfolios,
  getTrades,
  type DateRange,
} from "@/apis/portfolio";
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { useSyncExternalStore } from "react";

export const usePortfolios = () =>
  useQuery({
    queryKey: ["portfolios"],
    queryFn: getPortfolios,
  });

// ---- which portfolio the tabs show ----------------------------------------
// The one picked on the portfolios screen. Until a pick is made, the
// broker-linked one, else the first. A tiny store: `selectPortfolio` writes,
// `usePortfolioId` reads and re-renders when it changes.

let selectedId: string | null = null;
const listeners = new Set<() => void>();

const subscribe = (onChange: () => void) => {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
};

export const selectPortfolio = (id: string) => {
  selectedId = id;
  listeners.forEach((onChange) => onChange());
};

export const usePortfolioId = () => {
  const selected = useSyncExternalStore(subscribe, () => selectedId);
  const { data: portfolios } = usePortfolios();
  if (selected) return selected;
  const linked = portfolios?.find((portfolio) => portfolio.linked);
  return linked?.id ?? portfolios?.[0]?.id ?? "";
};

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

// Whole history in one go; it only changes after a price sync, so no range
// in the key and an hour before it is refetched.
export const useBenchmark = (portfolioId: string) =>
  useQuery({
    queryKey: ["benchmark", portfolioId],
    queryFn: () => getBenchmark(portfolioId),
    enabled: portfolioId !== "",
    staleTime: 60 * 60 * 1000,
  });

// Dividend income; like the benchmark it only changes after a sync.
export const useIncome = (portfolioId: string) =>
  useQuery({
    queryKey: ["income", portfolioId],
    queryFn: () => getIncome(portfolioId),
    enabled: portfolioId !== "",
    staleTime: 60 * 60 * 1000,
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

// Dividends received; like the benchmark it only changes after a sync.
export const useDividends = (portfolioId: string) =>
  useQuery({
    queryKey: ["dividends", portfolioId],
    queryFn: () => getDividends(portfolioId),
    enabled: portfolioId !== "",
    staleTime: 60 * 60 * 1000,
  });
