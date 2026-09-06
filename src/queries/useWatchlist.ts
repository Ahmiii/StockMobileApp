import { addToWatchlist, getWatchlist } from "@/apis/watchlist";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useWatchlist = () =>
  useQuery({
    queryKey: ["watchlist"],
    queryFn: getWatchlist,
  });

// After a successful add, mark the watchlist stale so the list refetches
// and the new symbol appears without any manual state juggling.
export const useAddToWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToWatchlist,
    retry: false,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["watchlist"] }),
  });
};
