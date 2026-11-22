import { useRoomSearch } from '../hooks/use-room-search';
import { SearchHeader } from '../components/search/search-header';
import { RecentSearchesBar } from '../components/search/recent-searches-bar';
import { ActiveFilterChips } from '../components/search/active-filter-chips';
import { SearchSummarySortBar } from '../components/search/search-summary-sort-bar';
import { RoomSearchGrid } from '../components/search/room-search-grid';
import { RoomFilterModal } from '../components/search/room-filter-modal';
import { LoginPromptModal } from '../components/search/login-prompt-modal';

export const RoomSearchPage = () => {
  const {
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
    favorites,
    rooms,
    totalCount,
    totalPages,
    pageNo,
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
    handleResetFilters,
    handleSortChange,
    handlePageChange,
    handleBack,
    canFavorite,
    handleSelectAllRooms,
    handleSelectFavorites,
  } = useRoomSearch();

  return (
    <div className="space-y-4 pb-12 w-full">
      {/* 1. Sticky Search Header */}
      <SearchHeader
        keyword={keyword}
        onKeywordChange={setKeyword}
        onKeywordSubmit={handleKeywordSubmit}
        onClearKeyword={handleClearKeyword}
        onBack={handleBack}
        onOpenFilter={() => setFilterModalOpen(true)}
        activeFilterCount={activeFilterCount}
      />

      {/* 2. Recent Searches Bar (Displayed if user has search history) */}
      <RecentSearchesBar
        searches={recentSearches}
        onSelect={handleSelectRecentSearch}
        onRemove={removeSearch}
        onClearAll={clearSearches}
      />

      {/* 3. Active Filter Chips */}
      <ActiveFilterChips chips={activeChips} onClearAll={handleResetFilters} />

      {/* 4. Results Summary & Sort Dropdown */}
      <SearchSummarySortBar
        totalCount={totalCount}
        currentSort={currentSort}
        onSortChange={handleSortChange}
        isFavorites={favorites}
        canFavorite={canFavorite}
        onSelectAllRooms={handleSelectAllRooms}
        onSelectFavorites={handleSelectFavorites}
      />

      {/* 5. Room Grid with Pagination (Always shows all rooms paginated when no filter) */}
      <RoomSearchGrid
        rooms={rooms}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        pageNo={pageNo}
        totalPages={totalPages}
        hasActiveFilters={hasActiveFilters}
        isFavorites={favorites}
        onPageChange={handlePageChange}
        onRetry={() => void refetch()}
        onResetFilters={handleResetFilters}
        onRequireAuth={() => setAuthPromptOpen(true)}
      />

      {/* Filter Modal Dialog */}
      <RoomFilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        filters={appliedFilters}
        onApply={handleApplyModalFilters}
        onReset={handleResetFilters}
      />

      {/* Login Prompt Modal for unauthorized bookmark action */}
      <LoginPromptModal open={authPromptOpen} onClose={() => setAuthPromptOpen(false)} />
    </div>
  );
};
