import {
  getIndexPrices,
  getStockTrend,
  searchSecurities,
  type TrendPeriod,
} from "@/apis/market";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

// Symbol / company search for the "add to watchlist" modal. Only runs from
// two characters, and keeps the previous results on screen while typing.
export const useSecuritySearch = (query: string) =>
  useQuery({
    queryKey: ["securities", query],
    queryFn: () => searchSecurities(query),
    placeholderData: keepPreviousData,
    enabled: query.length >= 2,
  });

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
