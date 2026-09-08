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

  const add = (security: Security) => {
    addMutation.mutate(security.id, { onSuccess: close });
  };

  const searched = debouncedQuery.length >= 2;
  // The search keeps its last results while a new query loads, so an empty
  // box would still show the old list. Clear it when there is nothing to search.
  const results = searched ? (search.data ?? []) : [];

  // One line of feedback under the search box, or nothing when there are results.
  let status = "";
  if (!searched) status = "Type a symbol or company name";
  else if (search.isPending) status = "Searching…";
  else if (search.error) status = search.error.message;
  else if (results.length === 0) status = `No matches for "${debouncedQuery}"`;
  if (addMutation.error) status = addMutation.error.message;

  return {
    query,
    setQuery,
    results,
    status,
    add,
    close,
    addingId: addMutation.isPending ? addMutation.variables : null,
  };
};
