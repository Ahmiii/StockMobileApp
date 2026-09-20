import type { Security } from "@/apis/market";
import { useSecuritySearch } from "@/queries/useMarket";
import { useAddToWatchlist } from "@/queries/useWatchlist";
import { useEffect, useState } from "react";

// Shared by AddStockModal.tsx and its .ios / .android files. Lives in its own
// file so a platform file never imports its own base name (require cycle).

export type AddStockModalProps = {
  visible: boolean;
  onClose: () => void;
};

// Everything the three modals have in common: the typed query, a short
// debounce before searching, the results, and the add mutation.
export const useAddStock = (onClose: () => void) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Wait 300ms after the last keystroke before searching.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const search = useSecuritySearch(debouncedQuery);
  const addMutation = useAddToWatchlist();

  const close = () => {
    setQuery("");
    addMutation.reset();
    onClose();
  };

  // A second tap while an add is still running is ignored.
  const add = (security: Security) => {
    if (addMutation.isPending) {
      return;
    }
    addMutation.mutate(security.id, { onSuccess: close });
  };

  // Typing again clears the message of an add that failed, so the search
  // feedback shows again.
  const changeQuery = (text: string) => {
    setQuery(text);
    if (addMutation.error) {
      addMutation.reset();
    }
  };

  const searched = debouncedQuery.length >= 2;
  // The search keeps its last results while a new query loads, so an empty
  // box would still show the old list. Clear it when there is nothing to search.
  const results = searched ? (search.data ?? []) : [];

  // One line of feedback under the search box, or nothing when there are results.
  // isFetching, not isPending: the search keeps its last results while a new
  // query loads, so it never counts as pending again after the first search.
  let status = "";
  if (!searched) status = "Type a symbol or company name";
  else if (search.isFetching) status = "Searching…";
  else if (search.error) status = search.error.message;
  else if (results.length === 0) status = `No matches for "${debouncedQuery}"`;
  else if (results.length === 20) status = "Showing the first 20, keep typing to narrow it down";
  if (addMutation.error) status = addMutation.error.message;

  return {
    query,
    setQuery: changeQuery,
    results,
    status,
    add,
    close,
    addingId: addMutation.isPending ? addMutation.variables : null,
  };
};
