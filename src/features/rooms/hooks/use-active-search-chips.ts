import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatVnd } from '@/lib/utils/format';
import type { RoomSearchFiltersState } from './use-room-search-url-params';
import type { ActiveChipItem } from '../components/search/active-filter-chips';

interface UseActiveSearchChipsParams {
  keyword: string;
  appliedFilters: RoomSearchFiltersState;
  onClearKeyword: () => void;
  onRemoveLocation: () => void;
  onRemovePrice: () => void;
  onRemoveGender: () => void;
}

export const useActiveSearchChips = ({
  keyword,
  appliedFilters,
  onClearKeyword,
  onRemoveLocation,
  onRemovePrice,
  onRemoveGender,
}: UseActiveSearchChipsParams): ActiveChipItem[] => {
  const { t } = useTranslation('rooms');

  return useMemo(() => {
    const list: ActiveChipItem[] = [];

    const areaName = appliedFilters.ward || appliedFilters.district || appliedFilters.province;
    const hasArea = Boolean(areaName);
    const cleanKeyword = keyword.trim().toLowerCase();
    const isKeywordSameAsArea =
      hasArea &&
      Boolean(cleanKeyword) &&
      (cleanKeyword === areaName.toLowerCase() ||
        areaName.toLowerCase().includes(cleanKeyword) ||
        cleanKeyword.includes(areaName.toLowerCase()));

    if (cleanKeyword && !isKeywordSameAsArea) {
      list.push({
        id: 'keyword',
        label: t('search.chipKeyword', { keyword: keyword.trim() }),
        onRemove: onClearKeyword,
      });
    }

    if (hasArea) {
      list.push({
        id: 'area',
        label: t('search.chipArea', { name: areaName }),
        onRemove: onRemoveLocation,
      });
    }

    if (appliedFilters.minPrice || appliedFilters.maxPrice) {
      const minText = appliedFilters.minPrice ? formatVnd(Number(appliedFilters.minPrice)) : '0 đ';
      const maxText = appliedFilters.maxPrice ? formatVnd(Number(appliedFilters.maxPrice)) : '15 tr';
      list.push({
        id: 'price',
        label: t('search.chipPrice', { price: `${minText} – ${maxText}` }),
        onRemove: onRemovePrice,
      });
    }

    if (appliedFilters.genderPolicy) {
      list.push({
        id: 'gender',
        label: t('search.chipGender', {
          gender: appliedFilters.genderPolicy === 'MALE' ? t('search.genderMale') : t('search.genderFemale'),
        }),
        onRemove: onRemoveGender,
      });
    }

    return list;
  }, [keyword, appliedFilters, t, onClearKeyword, onRemoveLocation, onRemovePrice, onRemoveGender]);
};
