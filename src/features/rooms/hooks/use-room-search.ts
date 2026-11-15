import { useMemo, useState } from 'react';
import { usePublicRoomsQuery } from './use-public-rooms-query';
import type { RoomPublicFilter } from '../types/room.dto';
import type { ListParams } from '@/types/api';

export interface RoomSearchFiltersState {
  province: string;
  ward: string;
  minPrice: string;
  maxPrice: string;
  genderPolicy: string;
}

const DEFAULT_FILTERS: RoomSearchFiltersState = {
  province: '',
  ward: '',
  minPrice: '',
  maxPrice: '',
  genderPolicy: '',
};

export const useRoomSearch = () => {
  const [pageNo, setPageNo] = useState(1);
  const [sort, setSort] = useState<'rentPrice'>('rentPrice');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  // Input state in the sidebar form
  const [draftFilters, setDraftFilters] = useState<RoomSearchFiltersState>(DEFAULT_FILTERS);

  // Applied state sent to API
  const [appliedFilters, setAppliedFilters] = useState<RoomSearchFiltersState>(DEFAULT_FILTERS);

  const queryParams = useMemo<ListParams<RoomPublicFilter>>(() => {
    const filter: RoomPublicFilter = {};

    if (appliedFilters.province.trim()) {
      filter.province = appliedFilters.province.trim();
    }
    if (appliedFilters.ward.trim()) {
      filter.ward = appliedFilters.ward.trim();
    }
    if (appliedFilters.genderPolicy) {
      filter.genderPolicy = appliedFilters.genderPolicy;
    }
    if (appliedFilters.minPrice) {
      const min = Number(appliedFilters.minPrice);
      if (!Number.isNaN(min) && min >= 0) filter.minPrice = min;
    }
    if (appliedFilters.maxPrice) {
      const max = Number(appliedFilters.maxPrice);
      if (!Number.isNaN(max) && max >= 0) filter.maxPrice = max;
    }

    return {
      pageNo,
      pageSize: 12,
      sort,
      order,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
    };
  }, [appliedFilters, pageNo, sort, order]);

  const { data, isLoading, isFetching, isError, refetch } = usePublicRoomsQuery(queryParams);

  const rooms = data?.items ?? [];
  const pagination = data?.pagination;

  const hasActiveFilters = Boolean(
    appliedFilters.province ||
    appliedFilters.ward ||
    appliedFilters.genderPolicy ||
    appliedFilters.minPrice ||
    appliedFilters.maxPrice,
  );

  const handleDraftChange = (field: keyof RoomSearchFiltersState, value: string) => {
    setDraftFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilter = () => {
    setPageNo(1);
    setAppliedFilters(draftFilters);
  };

  const handleResetFilter = () => {
    setDraftFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setPageNo(1);
  };

  const handleSortChange = (newOrder: 'asc' | 'desc') => {
    setSort('rentPrice');
    setOrder(newOrder);
    setPageNo(1);
  };

  const handlePageChange = (newPage: number) => {
    setPageNo(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    rooms,
    pagination,
    draftFilters,
    appliedFilters,
    hasActiveFilters,
    order,
    isLoading,
    isFetching,
    isError,
    pageNo,
    refetch,
    handleDraftChange,
    handleApplyFilter,
    handleResetFilter,
    handleSortChange,
    handlePageChange,
  };
};
