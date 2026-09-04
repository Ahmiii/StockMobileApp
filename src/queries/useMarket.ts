import { getIndexPrices } from "@/apis/market";
import { useQuery } from "@tanstack/react-query";

export const useIndexPrices = (symbol: string) =>
  useQuery({
    queryKey: ["prices", symbol],
    queryFn: () => getIndexPrices(symbol),
  });
