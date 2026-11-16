import { useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePublicRoomsQuery } from './use-public-rooms-query';
import { useRecentSearches } from './use-recent-searches';
import { useActiveSearchChips } from './use-active-search-chips';
import { useRoomSearchUrlParams, type RoomSearchFiltersState } from './use-room-search-url-params';
import { ROUTES } from '@/config/routes.config';
import type { RoomPublicFilter, RoomPublicListItemDto } from '../types/room.dto';
import type { ListParams } from '@/types/api';

export type { RoomSearchFiltersState };

export const useRoomSearch = () => {
  const navigate = useNavigate();
  const { recentSearches, addSearch, removeSearch, clearSearches } = useRecentSearches();

  const {
    urlKeyword,
    urlPage,
    urlSort,
    urlOrder,
    appliedFilters,
    hasActiveFilters,
    activeFilterCount,
    currentSort,
    updateUrlParams,
    handleApplyModalFilters,
    handleResetFilters,
    handleSortChange,
    handlePageChange,
  } = useRoomSearchUrlParams();

  const [keyword, setKeyword] = useState(urlKeyword);
  const [prevUrlKeyword, setPrevUrlKeyword] = useState(urlKeyword);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);

  if (prevUrlKeyword !== urlKeyword) {
    setPrevUrlKeyword(urlKeyword);
    setKeyword(urlKeyword);
  }

  const isClientFiltering = Boolean(keyword.trim() || appliedFilters.district.trim());

  const queryParams = useMemo<ListParams<RoomPublicFilter>>(() => {
    const filter: RoomPublicFilter = {};
    if (appliedFilters.province.trim()) filter.province = appliedFilters.province.trim();
    if (appliedFilters.ward.trim()) filter.ward = appliedFilters.ward.trim();
    if (appliedFilters.genderPolicy) filter.genderPolicy = appliedFilters.genderPolicy;
    if (appliedFilters.minPrice) {
      const min = Number(appliedFilters.minPrice);
      if (!Number.isNaN(min) && min >= 0) filter.minPrice = min;
    }
    if (appliedFilters.maxPrice) {
      const max = Number(appliedFilters.maxPrice);
      if (!Number.isNaN(max) && max >= 0) filter.maxPrice = max;
    }

    return {
      pageNo: isClientFiltering ? 1 : urlPage,
      pageSize: isClientFiltering ? 100 : 12,
      sort: urlSort,
      order: urlOrder,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
    };
  }, [appliedFilters, isClientFiltering, urlPage, urlSort, urlOrder]);

  const { data, isLoading, isFetching, isError, refetch } = usePublicRoomsQuery(queryParams);

  const allFilteredRooms = useMemo<RoomPublicListItemDto[]>(() => {
    const rawItems = data?.items ?? [];
    return rawItems.filter((room) => {
      if (keyword.trim()) {
        const term = keyword.trim().toLowerCase();
        const matchName = room.name?.toLowerCase().includes(term);
        const matchDistrict = room.district?.toLowerCase().includes(term);
        const matchAddress = room.address?.toLowerCase().includes(term);
        const matchProvince = room.province?.toLowerCase().includes(term);
        if (!matchName && !matchDistrict && !matchAddress && !matchProvince) return false;
      }

      if (appliedFilters.district?.trim()) {
        const dTerm = appliedFilters.district.trim().toLowerCase();
        const matchDistrict = room.district?.toLowerCase().includes(dTerm);
        const matchAddress = room.address?.toLowerCase().includes(dTerm);
        if (!matchDistrict && !matchAddress) return false;
      }

      return true;
    });
  }, [data?.items, keyword, appliedFilters.district]);

  const totalCount = isClientFiltering ? allFilteredRooms.length : (data?.pagination?.totalItems ?? 0);
  const totalPages = isClientFiltering
    ? Math.max(1, Math.ceil(allFilteredRooms.length / 12))
    : (data?.pagination?.totalPages ?? 1);

  const paginatedRooms = useMemo<RoomPublicListItemDto[]>(() => {
    if (!isClientFiltering) return allFilteredRooms;
    const startIndex = (urlPage - 1) * 12;
    return allFilteredRooms.slice(startIndex, startIndex + 12);
  }, [allFilteredRooms, isClientFiltering, urlPage]);

  const handleKeywordSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = keyword.trim();
    if (clean) addSearch(clean);
    updateUrlParams({ keyword: clean || null, pageNo: '1' });
  };

  const handleClearKeyword = useCallback(() => {
    setKeyword('');
    updateUrlParams({ keyword: null, pageNo: '1' });
  }, [updateUrlParams]);

  const handleRemoveLocation = useCallback(() => {
    setKeyword((currentKeyword) => {
      const areaName = appliedFilters.ward || appliedFilters.district || appliedFilters.province;
      const cleanKw = currentKeyword.trim().toLowerCase();
      const isSame =
        Boolean(areaName) &&
        Boolean(cleanKw) &&
        (cleanKw === areaName.toLowerCase() ||
          areaName.toLowerCase().includes(cleanKw) ||
          cleanKw.includes(areaName.toLowerCase()));

      updateUrlParams({
        province: null,
        district: null,
        ward: null,
        ...(isSame ? { keyword: null } : {}),
        pageNo: '1',
      });

      return isSame ? '' : currentKeyword;
    });
  }, [appliedFilters, updateUrlParams]);

  const handleResetFiltersAndKeyword = useCallback(() => {
    setKeyword('');
    handleResetFilters();
  }, [handleResetFilters]);

  const handleSelectRecentSearch = (kw: string) => {
    setKeyword(kw);
    addSearch(kw);
    updateUrlParams({ keyword: kw, pageNo: '1' });
  };

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(ROUTES.HOME);
  };

  const activeChips = useActiveSearchChips({
    keyword,
    appliedFilters,
    onClearKeyword: handleClearKeyword,
    onRemoveLocation: handleRemoveLocation,
    onRemovePrice: () => updateUrlParams({ minPrice: null, maxPrice: null, pageNo: '1' }),
    onRemoveGender: () => updateUrlParams({ genderPolicy: null, pageNo: '1' }),
  });

  return {
    keyword,
    setKeyword,
    recentSearches,
    removeSearch,
    clearSearches,
    appliedFilters,
    hasActiveFilters,
    activeFilterCount,
    activeChips,
    currentSort,
    rooms: paginatedRooms,
    totalCount,
    totalPages,
    pageNo: urlPage,
    isLoading,
    isFetching,
    isError,
    refetch,
    filterModalOpen,
    setFilterModalOpen,
    authPromptOpen,
    setAuthPromptOpen,
    handleKeywordSubmit,
    handleClearKeyword,
    handleSelectRecentSearch,
    handleApplyModalFilters,
    handleResetFilters: handleResetFiltersAndKeyword,
    handleSortChange,
    handlePageChange,
    handleBack,
  };
};
