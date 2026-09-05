// Shared by RangePicker.tsx and the RangeSheet platform files. Lives in its
// own file so a platform file never imports its own base name (require cycle).

export type Range =
  | "1D"
  | "7D"
  | "1M"
  | "3M"
  | "6M"
  | "1Y"
  | "2Y"
  | "3Y"
  | "4Y"
  | "5Y";

export type RangeOption = { value: Range; label: string };

export const RANGES: RangeOption[] = [
  { value: "1D", label: "1D" },
  { value: "7D", label: "7D" },
  { value: "1M", label: "1M" },
  { value: "3M", label: "3M" },
  { value: "6M", label: "6M" },
  { value: "1Y", label: "1Y" },
  { value: "2Y", label: "2Y" },
  { value: "3Y", label: "3Y" },
  { value: "4Y", label: "4Y" },
  { value: "5Y", label: "5Y" },
];

export const PERIOD_LABEL: Record<Range, string> = {
  "1D": "Today",
  "7D": "Last 7 days",
  "1M": "Last month",
  "3M": "Last 3 months",
  "6M": "Last 6 months",
  "1Y": "Last year",
  "2Y": "Last 2 years",
  "3Y": "Last 3 years",
  "4Y": "Last 4 years",
  "5Y": "Last 5 years",
};

/** ISO dates, e.g. { from: "2026-08-05", to: "2026-09-05" }. */
export type DateRange = { from: string; to: string };

const isoDate = (date: Date) => date.toISOString().slice(0, 10);

/** Turn a picked range into the from/to dates the backend wants. */
export const rangeDates = (range: Range, today = new Date()): DateRange => {
  const from = new Date(today);
  const amount = Number(range.slice(0, -1));
  const unit = range.slice(-1);

  if (unit === "D") from.setDate(from.getDate() - amount);
  if (unit === "M") from.setMonth(from.getMonth() - amount);
  if (unit === "Y") from.setFullYear(from.getFullYear() - amount);

  return { from: isoDate(from), to: isoDate(today) };
};

/** The native list that opens from the "…" chip. */
export type RangeSheetProps = {
  visible: boolean;
  options: RangeOption[];
  value: Range;
  onSelect: (value: Range) => void;
  onClose: () => void;
};
