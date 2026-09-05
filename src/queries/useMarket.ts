import { getIndexPrices } from "@/apis/market";
import { useQuery } from "@tanstack/react-query";

// from/to are part of the cache key, so the same window is fetched once.
export const useIndexPrices = (symbol: string, from?: string, to?: string) =>
  useQuery({
    queryKey: ["prices", symbol, from, to],
    queryFn: () => getIndexPrices(symbol, from, to),
  });
