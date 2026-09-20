import { addToWatchlist, getWatchlist } from "@/apis/watchlist";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useWatchlist = () =>
  useQuery({
    queryKey: ["watchlist"],
    queryFn: getWatchlist,
  });

// After an add, mark the watchlist stale so the list refetches and the new
// symbol appears. Also after a failed add: the backend saves the stock before
// it loads the prices, so the stock can be on the list even when the request
// timed out. The search results no longer offer a stock that is on the list.
export const useAddToWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToWatchlist,
    retry: false,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      queryClient.invalidateQueries({ queryKey: ["securities"] });
    },
  });
};
