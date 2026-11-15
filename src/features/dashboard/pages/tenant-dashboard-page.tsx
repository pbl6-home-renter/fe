import { useTenantHome } from '../hooks/use-tenant-home';
import { TenantHomeBanner } from '../components/tenant/tenant-home-banner';
import { TenantQuickActions } from '../components/tenant/tenant-quick-actions';
import { TenantMyRoomWidget } from '../components/tenant/tenant-my-room-widget';
import { TenantPopularAreas } from '../components/tenant/tenant-popular-areas';
import { TenantRecommendedRooms } from '../components/tenant/tenant-recommended-rooms';
import { TenantFilterModal } from '../components/tenant/tenant-filter-modal';
import { LoginPromptModal } from '@/features/rooms/components/search/login-prompt-modal';

export const TenantDashboardPage = () => {
  const {
    isAuthenticated,
    userDisplayName,
    hasUnreadNotifications,
    contracts,
    activeContract,
    activeRoomIndex,
    handlePrevRoom,
    handleNextRoom,
    currentContractInvoice,
    unpaidInvoicesCount,
    recommendedRooms,
    isRecommendedLoading,
    isRecommendedError,
    refetchRecommended,
    searchKeyword,
    setSearchKeyword,
    handleSearchSubmit,
    handleQuickAction,
    handleSelectArea,
    handleRoomClick,
    handleFavoriteClick,
    authPromptOpen,
    setAuthPromptOpen,
    filterModalOpen,
    setFilterModalOpen,
  } = useTenantHome();

  const hasActiveRooms = isAuthenticated && contracts.length > 0 && Boolean(activeContract);

  return (
    <div className="space-y-8 pb-12 w-full max-w-[1440px] mx-auto">
      {/* Khối 1: Banner đầu trang & Thanh tìm kiếm nổi */}
      <TenantHomeBanner
        isAuthenticated={isAuthenticated}
        userDisplayName={userDisplayName}
        hasUnreadNotifications={hasUnreadNotifications}
        keyword={searchKeyword}
        onKeywordChange={setSearchKeyword}
        onOpenFilter={() => setFilterModalOpen(true)}
        onSearch={handleSearchSubmit}
      />

      {/* Khối 2 & 3: Bố cục theo trạng thái có phòng đang thuê hay không */}
      {hasActiveRooms && activeContract ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Khối 3: Widget "Phòng của tôi" (8 cols) */}
          <div className="lg:col-span-8">
            <TenantMyRoomWidget
              contracts={contracts}
              activeContract={activeContract}
              invoice={currentContractInvoice}
              activeRoomIndex={activeRoomIndex}
              onPrevRoom={handlePrevRoom}
              onNextRoom={handleNextRoom}
            />
          </div>

          {/* Khối 2: 4 Tiện ích nhanh (4 cols, xếp dọc trong Card) */}
          <div className="lg:col-span-4">
            <TenantQuickActions
              isAuthenticated={isAuthenticated}
              unpaidCount={unpaidInvoicesCount}
              layout="vertical"
              onAction={handleQuickAction}
            />
          </div>
        </div>
      ) : (
        /* Khối 2: 4 Tiện ích nhanh (Hàng 4 cột ngang cho khách hoặc chưa thuê phòng) */
        <TenantQuickActions
          isAuthenticated={isAuthenticated}
          unpaidCount={unpaidInvoicesCount}
          layout="horizontal"
          onAction={handleQuickAction}
        />
      )}

      {/* Khối 4: Khu vực phổ biến (Slider/Grid 6 quận phường nổi bật) */}
      <TenantPopularAreas onSelectArea={handleSelectArea} />

      {/* Khối 5: Danh sách "Dành cho bạn" / "Phòng nổi bật" */}
      <TenantRecommendedRooms
        isAuthenticated={isAuthenticated}
        rooms={recommendedRooms}
        isLoading={isRecommendedLoading}
        isError={isRecommendedError}
        onRetry={() => void refetchRecommended()}
        onFavoriteClick={handleFavoriteClick}
        onRoomClick={handleRoomClick}
      />

      {/* Modals & Dialogs */}
      <LoginPromptModal open={authPromptOpen} onClose={() => setAuthPromptOpen(false)} />

      <TenantFilterModal open={filterModalOpen} onClose={() => setFilterModalOpen(false)} />
    </div>
  );
};
