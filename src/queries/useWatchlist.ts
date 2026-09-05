import { getWatchlist } from "@/apis/watchlist";
import { useQuery } from "@tanstack/react-query";

export const useWatchlist = () =>
  useQuery({
    queryKey: ["watchlist"],
    queryFn: getWatchlist,
  });
