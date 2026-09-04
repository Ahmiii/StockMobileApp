import type { FilterOption } from "@/molecules/FilterChips";

export type Theme = "dark" | "light";

export const THEMES: FilterOption<Theme>[] = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
];

export type SettingsListProps = {
  currency: string; // "PKR"
};
