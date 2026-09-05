import { getIndexPrices, getStockTrend, type TrendPeriod } from "@/apis/market";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

// Stock vs KSE-100 over a period. keepPreviousData holds the last chart on
// screen while a newly picked period loads.
export const useStockTrend = (symbol: string, period: TrendPeriod) =>
  useQuery({
    queryKey: ["trend", symbol, period],
    queryFn: () => getStockTrend(symbol, period),
    placeholderData: keepPreviousData,
    enabled: symbol !== "",
  });

// from/to are part of the cache key, so the same window is fetched once.
export const useIndexPrices = (symbol: string, from?: string, to?: string) =>
  useQuery({
    queryKey: ["prices", symbol, from, to],
    queryFn: () => getIndexPrices(symbol, from, to),
  });
