import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface RoommateSearchFilterState {
  preferredArea: string;
  preferredProvince: string;
  preferredDistrict: string;
  gender: string;
}

const DEFAULT_FILTERS: RoommateSearchFilterState = {
  preferredArea: '',
  preferredProvince: '',
  preferredDistrict: '',
  gender: 'all',
};

export const useRoommateSearchUrlParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageNo = Math.max(1, Number(searchParams.get('page')) || 1);
  const appliedProvince = searchParams.get('province') || '';
  const appliedWard = searchParams.get('ward') || '';
  const appliedArea = searchParams.get('area') || [appliedWard, appliedProvince].filter(Boolean).join(', ');
  const appliedGender = searchParams.get('gender') || 'all';

  const [draftFilters, setDraftFilters] = useState<RoommateSearchFilterState>({
    preferredProvince: appliedProvince,
    preferredDistrict: appliedWard,
    preferredArea: appliedArea,
    gender: appliedGender,
  });

  const appliedKey = `${appliedProvince}|${appliedWard}|${appliedArea}|${appliedGender}`;
  const [prevKey, setPrevKey] = useState(appliedKey);
  if (prevKey !== appliedKey) {
    setPrevKey(appliedKey);
    setDraftFilters({
      preferredProvince: appliedProvince,
      preferredDistrict: appliedWard,
      preferredArea: appliedArea,
      gender: appliedGender,
    });
  }

  const handleDraftChange = useCallback((field: keyof RoommateSearchFilterState, value: string) => {
    setDraftFilters((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleApplyFilter = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      const { preferredProvince: p, preferredDistrict: w, preferredArea: a, gender: g } = draftFilters;
      if (p) next.set('province', p);
      else next.delete('province');
      if (w) next.set('ward', w);
      else next.delete('ward');
      if (a) next.set('area', a);
      else next.delete('area');
      if (g && g !== 'all') next.set('gender', g);
      else next.delete('gender');
      next.set('page', '1');
      return next;
    });
  }, [draftFilters, setSearchParams]);

  const handleResetFilter = useCallback(() => {
    setDraftFilters(DEFAULT_FILTERS);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      ['province', 'ward', 'area', 'gender'].forEach((k) => next.delete(k));
      next.set('page', '1');
      return next;
    });
  }, [setSearchParams]);

  const handlePageChange = useCallback(
    (page: number) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('page', String(page));
        return next;
      });
    },
    [setSearchParams],
  );

  const hasActiveFilters = useMemo(
    () => Boolean(appliedArea || (appliedGender && appliedGender !== 'all')),
    [appliedArea, appliedGender],
  );

  return {
    pageNo,
    appliedProvince,
    appliedWard,
    appliedArea,
    appliedGender,
    draftFilters,
    hasActiveFilters,
    handleDraftChange,
    handleApplyFilter,
    handleResetFilter,
    handlePageChange,
  };
};
