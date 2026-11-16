export const RECENT_SEARCHES_STORAGE_KEY = 'rentify_recent_searches';
export const MAX_RECENT_SEARCHES = 10;

export const MIN_SEARCH_PRICE = 0;
export const MAX_SEARCH_PRICE = 15_000_000;
export const SEARCH_PRICE_STEP = 500_000;

export type PriceQuickChipLabelKey =
  'search.filterPriceUnder2M' | 'search.filterPrice2Mto35M' | 'search.filterPrice35Mto5M' | 'search.filterPriceAbove5M';

export interface PriceQuickChip {
  id: string;
  min: number;
  max: number;
  labelKey: PriceQuickChipLabelKey;
}

export const PRICE_QUICK_CHIPS: PriceQuickChip[] = [
  { id: 'under-2m', min: 0, max: 2_000_000, labelKey: 'search.filterPriceUnder2M' },
  { id: '2m-3.5m', min: 2_000_000, max: 3_500_000, labelKey: 'search.filterPrice2Mto35M' },
  { id: '3.5m-5m', min: 3_500_000, max: 5_000_000, labelKey: 'search.filterPrice35Mto5M' },
  { id: 'above-5m', min: 5_000_000, max: 15_000_000, labelKey: 'search.filterPriceAbove5M' },
];

export const SORT_OPTIONS = [
  { value: 'newest', sort: 'createdAt', order: 'desc', labelKey: 'search.sortNewest' },
  { value: 'price-asc', sort: 'rentPrice', order: 'asc', labelKey: 'search.sortPriceAsc' },
  { value: 'price-desc', sort: 'rentPrice', order: 'desc', labelKey: 'search.sortPriceDesc' },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]['value'];
