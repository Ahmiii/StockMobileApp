// Shared by RangePicker.tsx and the RangeSheet platform files. Lives in its
// own file so a platform file never imports its own base name (require cycle).

/** One chip / sheet row. `T` is the union of allowed values for that picker. */
export type RangeOption<T extends string = string> = { value: T; label: string };

/** The native list that opens from the "…" chip. */
export type RangeSheetProps<T extends string = string> = {
  visible: boolean;
  options: RangeOption<T>[];
  value: T;
  onSelect: (value: T) => void;
  onClose: () => void;
};

// ---- The Portfolio tab's ranges (turned into from/to dates) ----------------

export type Range = "1W" | "1M" | "3M" | "1Y" | "2Y" | "3Y" | "4Y" | "5Y" | "All";

export const RANGES: RangeOption<Range>[] = [
  { value: "1W", label: "1W" },
  { value: "1M", label: "1M" },
  { value: "3M", label: "3M" },
  { value: "1Y", label: "1Y" },
  { value: "2Y", label: "2Y" },
  { value: "3Y", label: "3Y" },
  { value: "4Y", label: "4Y" },
  { value: "5Y", label: "5Y" },
  { value: "All", label: "All" },
];

export const PERIOD_LABEL: Record<Range, string> = {
  "1W": "Last week",
  "1M": "Last month",
  "3M": "Last 3 months",
  "1Y": "Last year",
  "2Y": "Last 2 years",
  "3Y": "Last 3 years",
  "4Y": "Last 4 years",
  "5Y": "Last 5 years",
  All: "Since first trade",
};

/** ISO dates, e.g. { from: "2026-08-05", to: "2026-09-05" }. */
export type DateRange = { from: string; to: string };

// The PSX day, not the UTC one: Karachi is UTC+5 all year, so shift before
// slicing or the date is a day behind between midnight and 5 am.
const isoDate = (date: Date) =>
  new Date(date.getTime() + 5 * 60 * 60 * 1000).toISOString().slice(0, 10);

/**
 * Turn a picked range into the from/to dates the backend wants. "All" starts
 * on the first trade; until that date is known it falls back to five years,
 * the widest window the positions endpoint accepts.
 */
export const rangeDates = (
  range: Range,
  firstTradeDate?: string,
  today = new Date(),
): DateRange => {
  const from = new Date(today);

  if (range === "All") {
    from.setFullYear(from.getFullYear() - 5);
    const fiveYearsAgo = isoDate(from);
    const start = firstTradeDate && firstTradeDate > fiveYearsAgo ? firstTradeDate : fiveYearsAgo;
    return { from: start, to: isoDate(today) };
  }

  const amount = Number(range.slice(0, -1));
  const unit = range.slice(-1);

  if (unit === "W") from.setDate(from.getDate() - amount * 7);
  if (unit === "M") from.setMonth(from.getMonth() - amount);
  if (unit === "Y") from.setFullYear(from.getFullYear() - amount);

  return { from: isoDate(from), to: isoDate(today) };
};
