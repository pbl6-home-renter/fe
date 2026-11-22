import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { SortValue } from '../constants/search.constants';

export interface RoomSearchFiltersState {
  province: string;
  district: string;
  ward: string;
  minPrice: string;
  maxPrice: string;
  genderPolicy: string;
}

export const useRoomSearchUrlParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlKeyword = searchParams.get('keyword') ?? '';
  const urlProvince = searchParams.get('province') ?? '';
  const urlDistrict = searchParams.get('district') ?? '';
  const urlWard = searchParams.get('ward') ?? '';
  const urlMinPrice = searchParams.get('minPrice') ?? '';
  const urlMaxPrice = searchParams.get('maxPrice') ?? '';
  const urlGenderPolicy = searchParams.get('genderPolicy') ?? '';
  const urlSort = (searchParams.get('sort') as 'createdAt' | 'rentPrice') ?? 'createdAt';
  const urlOrder = (searchParams.get('order') as 'asc' | 'desc') ?? 'desc';
  const urlPage = Math.max(1, Number(searchParams.get('pageNo')) || 1);
  const nearMe = searchParams.get('nearMe') === 'true';
  const favorites = searchParams.get('favorites') === 'true';

  const appliedFilters: RoomSearchFiltersState = useMemo(
    () => ({
      province: urlProvince,
      district: urlDistrict,
      ward: urlWard,
      minPrice: urlMinPrice,
      maxPrice: urlMaxPrice,
      genderPolicy: urlGenderPolicy,
    }),
    [urlProvince, urlDistrict, urlWard, urlMinPrice, urlMaxPrice, urlGenderPolicy],
  );

  const hasActiveFilters = Boolean(
    appliedFilters.province ||
    appliedFilters.district ||
    appliedFilters.ward ||
    appliedFilters.genderPolicy ||
    appliedFilters.minPrice ||
    appliedFilters.maxPrice ||
    nearMe ||
    favorites,
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (appliedFilters.province || appliedFilters.district || appliedFilters.ward) count += 1;
    if (appliedFilters.minPrice || appliedFilters.maxPrice) count += 1;
    if (appliedFilters.genderPolicy) count += 1;
    if (nearMe) count += 1;
    if (favorites) count += 1;
    return count;
  }, [appliedFilters, nearMe, favorites]);

  const currentSort: SortValue = useMemo(() => {
    if (urlSort === 'rentPrice' && urlOrder === 'asc') return 'price-asc';
    if (urlSort === 'rentPrice' && urlOrder === 'desc') return 'price-desc';
    return 'newest';
  }, [urlSort, urlOrder]);

  const updateUrlParams = useCallback(
    (updates: Record<string, string | null | undefined>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(updates).forEach(([key, val]) => {
            if (!val) next.delete(key);
            else next.set(key, val);
          });
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const handleApplyModalFilters = (next: RoomSearchFiltersState) => {
    updateUrlParams({
      province: next.province || null,
      ward: next.ward || null,
      minPrice: next.minPrice || null,
      maxPrice: next.maxPrice || null,
      genderPolicy: next.genderPolicy || null,
      pageNo: '1',
    });
  };

  const handleResetFilters = () => {
    updateUrlParams({
      keyword: null,
      province: null,
      district: null,
      ward: null,
      minPrice: null,
      maxPrice: null,
      genderPolicy: null,
      nearMe: null,
      favorites: null,
      pageNo: '1',
    });
  };

  const handleSortChange = (value: SortValue) => {
    if (value === 'price-asc') updateUrlParams({ sort: 'rentPrice', order: 'asc', pageNo: '1' });
    else if (value === 'price-desc') updateUrlParams({ sort: 'rentPrice', order: 'desc', pageNo: '1' });
    else updateUrlParams({ sort: 'createdAt', order: 'desc', pageNo: '1' });
  };

  const handleRemoveFavorites = () => {
    updateUrlParams({ favorites: null, pageNo: '1' });
  };

  const handlePageChange = (newPage: number) => {
    updateUrlParams({ pageNo: String(newPage) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    urlKeyword,
    urlPage,
    urlSort,
    urlOrder,
    nearMe,
    favorites,
    appliedFilters,
    hasActiveFilters,
    activeFilterCount,
    currentSort,
    updateUrlParams,
    handleApplyModalFilters,
    handleResetFilters,
    handleRemoveFavorites,
    handleSortChange,
    handlePageChange,
  };
};
