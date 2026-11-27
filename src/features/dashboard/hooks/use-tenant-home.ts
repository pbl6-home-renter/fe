import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useUnreadNotificationsQuery } from '@/features/notifications/hooks/use-unread-notifications-query';
import { useTenantActiveContracts } from '@/features/rooms/hooks/use-tenant-active-contracts';
import { useMyInvoicesQuery } from '@/features/invoices/hooks/use-my-invoices-query';
import { usePublicRoomsQuery } from '@/features/rooms/hooks/use-public-rooms-query';
import { useToggleFavoriteRoom } from '@/features/rooms/hooks/use-toggle-favorite-room';
import { ROUTES } from '@/config/routes.config';
import { InvoiceStatus } from '@/features/invoices/enums/invoice-status.enum';
import type { MyContractListItemDto } from '@/features/contracts/types/contract.dto';
import type { TenantInvoiceListItemDto } from '@/features/invoices/types/invoices.dto';
import { POPULAR_AREAS, type PopularAreaItem } from '../constants/tenant-dashboard.constants';

export { POPULAR_AREAS, type PopularAreaItem };

export const useTenantHome = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLocked, isActiveUser } = useAuth();
  const { data: hasUnreadNotifications = false } = useUnreadNotificationsQuery();

  // Active contracts for logged-in tenant
  const {
    data: contracts = [],
    isLoading: isContractsLoading,
    isError: isContractsError,
    refetch: refetchContracts,
  } = useTenantActiveContracts({ enabled: isAuthenticated });

  // Invoices for logged-in tenant
  const { data: invoicesData } = useMyInvoicesQuery({ pageSize: 50 }, { enabled: isAuthenticated });

  const invoices = useMemo(() => invoicesData?.items ?? [], [invoicesData]);

  // Unpaid invoices count (e.g. issued invoices)
  const unpaidInvoicesCount = useMemo(() => {
    return invoices.filter((inv) => inv.invoiceStatus === InvoiceStatus.ISSUED).length;
  }, [invoices]);

  // Recommended rooms for guest or active user (BE blocks GET /rooms for locked tokens)
  const [recommendedPage, setRecommendedPage] = useState(1);
  const {
    data: recommendedData,
    isLoading: isRecommendedLoading,
    isError: isRecommendedError,
    refetch: refetchRecommended,
  } = usePublicRoomsQuery({ pageNo: recommendedPage, pageSize: 8 }, { enabled: !isAuthenticated || isActiveUser });

  const recommendedRooms = useMemo(() => recommendedData?.items ?? [], [recommendedData]);

  // Modal states
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Search Bar state
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');

  // Carousel index for My Room
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);

  const activeContract: MyContractListItemDto | undefined = contracts[activeRoomIndex];

  // Current contract's latest invoice
  const currentContractInvoice: TenantInvoiceListItemDto | undefined = useMemo(() => {
    if (!activeContract) return undefined;
    return invoices.find((inv) => inv.contractId === activeContract.id);
  }, [activeContract, invoices]);

  // User display name (short first name or full name)
  const userDisplayName = useMemo(() => {
    if (!user?.name) return '';
    const parts = user.name.trim().split(' ');
    return parts[parts.length - 1] || user.name;
  }, [user]);

  // Handlers
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = new URLSearchParams();
    if (searchKeyword.trim()) query.set('keyword', searchKeyword.trim());
    if (selectedDistrict) query.set('district', selectedDistrict);
    if (selectedPriceRange) query.set('price', selectedPriceRange);
    navigate(`${ROUTES.ROOMS_SEARCH}?${query.toString()}`);
  };

  const handleQuickAction = (action: 'nearMe' | 'saved' | 'roommates' | 'invoices') => {
    if (!isAuthenticated) {
      if (action === 'nearMe') {
        navigate(`${ROUTES.ROOMS_SEARCH}?nearMe=true`);
        return;
      }
      setAuthPromptOpen(true);
      return;
    }

    switch (action) {
      case 'nearMe':
        navigate(`${ROUTES.ROOMS_SEARCH}?nearMe=true`);
        break;
      case 'saved':
        navigate(`${ROUTES.ROOMS_SEARCH}?favorites=true`);
        break;
      case 'roommates':
        navigate(ROUTES.TENANT.ROOMMATES);
        break;
      case 'invoices':
        navigate(ROUTES.TENANT.INVOICES);
        break;
    }
  };

  const handleSelectArea = (area: PopularAreaItem) => {
    const query = new URLSearchParams();
    query.set('keyword', area.name);
    if (area.province) query.set('province', area.province);
    navigate(`${ROUTES.ROOMS_SEARCH}?${query.toString()}`);
  };

  const handleRoomClick = (roomId: string) => {
    navigate(ROUTES.ROOM_DETAIL(roomId));
  };

  const { toggleFavorite } = useToggleFavoriteRoom();

  const handleFavoriteClick = (e: React.MouseEvent, roomId: string) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setAuthPromptOpen(true);
      return;
    }
    const targetRoom = recommendedRooms.find((r) => r.id === roomId);
    toggleFavorite({ roomId, isFavorited: Boolean(targetRoom?.isFavorited) });
  };

  const handlePrevRoom = () => {
    setActiveRoomIndex((prev) => (prev > 0 ? prev - 1 : contracts.length - 1));
  };

  const handleNextRoom = () => {
    setActiveRoomIndex((prev) => (prev < contracts.length - 1 ? prev + 1 : 0));
  };

  return {
    user,
    isAuthenticated,
    isLocked,
    userDisplayName,
    hasUnreadNotifications,
    contracts,
    activeContract,
    activeRoomIndex,
    setActiveRoomIndex,
    handlePrevRoom,
    handleNextRoom,
    currentContractInvoice,
    unpaidInvoicesCount,
    isContractsLoading,
    isContractsError,
    refetchContracts,
    recommendedRooms,
    recommendedPagination: recommendedData?.pagination,
    isRecommendedLoading,
    isRecommendedError,
    refetchRecommended,
    recommendedPage,
    setRecommendedPage,
    searchKeyword,
    setSearchKeyword,
    selectedDistrict,
    setSelectedDistrict,
    selectedPriceRange,
    setSelectedPriceRange,
    handleSearchSubmit,
    handleQuickAction,
    handleSelectArea,
    handleRoomClick,
    handleFavoriteClick,
    authPromptOpen,
    setAuthPromptOpen,
    filterModalOpen,
    setFilterModalOpen,
  };
};
