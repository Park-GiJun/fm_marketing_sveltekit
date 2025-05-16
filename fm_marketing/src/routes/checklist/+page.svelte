<!-- src/routes/checklist/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { reviewStore } from '$lib/stores/reviewStore.js';
  import MainLayout from '$lib/components/layout/MainLayout.svelte';
  import RegionTab from '$lib/components/layout/RegionTab.svelte';
  import ReviewFilter from '$lib/components/review/ReviewFilter.svelte';
  import ReviewList from '$lib/components/review/ReviewList.svelte';
  import Button from '$lib/components/common/Button.svelte';
  
  // 상태 변수
  let selectedRegion = '전체';
  let currentCategory = '카테고리';
  let currentSort = '최신순';
  let currentType = '유형';
  let searchKeyword = '';
  let loading = false;
  let reviews = [];
  let currentPage = 1;
  let totalPages = 10; // 더미 데이터용
  
  // 필터 변경 핸들러
  function handleFilterChange(e) {
    const { category, sort, type, region } = e.detail;
    
    currentCategory = category;
    currentSort = sort;
    currentType = type;
    
    if (region !== selectedRegion) {
      selectedRegion = region;
    }
    
    // 필터 적용하여 리뷰 목록 로드
    loadReviews();
  }
  
  // 지역 탭 변경 핸들러
  function handleRegionChange(e) {
    selectedRegion = e.detail;
    
    // 지역 변경 시 리뷰 목록 로드
    loadReviews();
  }
  
  // 검색 핸들러
  function handleSearch() {
    loadReviews();
  }
  
  // 리뷰 목록 로드 함수
  function loadReviews() {
    loading = true;
    
    // 스토어에서 리뷰 데이터 로드
    reviewStore.fetchReviewsByRegion(selectedRegion);
    
    // 스토어 구독
    const unsubscribe = reviewStore.subscribe(state => {
      reviews = state.reviews;
      loading = state.loading;
    });
    
    return () => {
      unsubscribe();
    };
  }
  
  // 페이지네이션 핸들러
  function goToPage(page) {
    if (page < 1 || page > totalPages || page === currentPage) return;
    
    currentPage = page;
    loadReviews();
  }
  
  // 컴포넌트 마운트 시 초기 데이터 로드
  onMount(() => {
    loadReviews();
  });
</script>

<svelte:head>
  <title>체험단 검색 - FM마케팅</title>
  <meta name="description" content="FM마케팅에서 지역별, 카테고리별 다양한 체험단을 검색하고 신청해보세요." />
</svelte:head>

<MainLayout>
  <div class="checklist-container">
    <div class="page-header">
      <h1 class="page-title">체험단 검색</h1>
      <p class="page-description">지역별, 카테고리별로 다양한 체험단을 검색하고 신청하세요.</p>
    </div>
    
    <div class="region-tabs-container">
      <RegionTab bind:selectedRegion on:regionSelect={handleRegionChange} />
    </div>
    
    <div class="filter-search-container">
      <div class="filter-container">
        <ReviewFilter 
          currentCategory={currentCategory} 
          currentSort={currentSort} 
          currentType={currentType} 
          currentRegion={selectedRegion} 
          on:filterChange={handleFilterChange} 
        />
      </div>
      
      <div class="search-container">
        <div class="search-input-group">
          <input 
            type="text" 
            placeholder="키워드 검색" 
            bind:value={searchKeyword} 
            on:keydown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button class="search-button" on:click={handleSearch}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <div class="reviews-container">
      <ReviewList {reviews} {loading} columns={3} />
      
      {#if reviews.length > 0}
        <div class="pagination">
          <button 
            class="pagination-button" 
            disabled={currentPage === 1} 
            on:click={() => goToPage(currentPage - 1)}
          >
            이전
          </button>
          
          <div class="page-numbers">
            {#each Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = currentPage > 3 
                ? (currentPage - 3 + i + (currentPage + 2 > totalPages ? totalPages - currentPage - 2 : 0)) 
                : i + 1;
              return pageNum <= totalPages ? pageNum : null;
            }).filter(Boolean) as page}
              <button 
                class="page-number {currentPage === page ? 'active' : ''}" 
                on:click={() => goToPage(page)}
              >
                {page}
              </button>
            {/each}
            
            {#if currentPage + 2 < totalPages}
              <span class="page-ellipsis">...</span>
              <button 
                class="page-number" 
                on:click={() => goToPage(totalPages)}
              >
                {totalPages}
              </button>
            {/if}
          </div>
          
          <button 
            class="pagination-button" 
            disabled={currentPage === totalPages} 
            on:click={() => goToPage(currentPage + 1)}
          >
            다음
          </button>
        </div>
      {/if}
    </div>
  </div>
</MainLayout>

<style>
  .checklist-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
  }
  
  .page-header {
    margin-bottom: 2rem;
  }
  
  .page-title {
    font-size: 1.875rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
  }
  
  .page-description {
    font-size: 1rem;
    color: #6b7280;
  }
  
  .region-tabs-container {
    margin-bottom: 2rem;
  }
  
  .filter-search-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    gap: 1rem;
  }
  
  .filter-container {
    flex: 1;
    min-width: 300px;
  }
  
  .search-container {
    width: 300px;
  }
  
  .search-input-group {
    display: flex;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    overflow: hidden;
  }
  
  .search-input-group input {
    flex: 1;
    padding: 0.625rem;
    border: none;
    outline: none;
    font-size: 0.875rem;
  }
  
  .search-button {
    background-color: #f3f4f6;
    border: none;
    padding: 0.625rem 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .search-button:hover {
    background-color: #e5e7eb;
    color: #4b5563;
  }
  
  .reviews-container {
    margin-bottom: 3rem;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    gap: 0.5rem;
  }
  
  .pagination-button {
    padding: 0.5rem 1rem;
    background-color: #f3f4f6;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: #4b5563;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .pagination-button:hover:not(:disabled) {
    background-color: #e5e7eb;
  }
  
  .pagination-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .page-numbers {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  
  .page-number {
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border: 1px solid #e5e7eb;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    color: #4b5563;
    cursor: pointer;
  }
  
  .page-number:hover:not(.active) {
    background-color: #f3f4f6;
  }
  
  .page-number.active {
    background-color: #5ce0c6; /* 민트색 */
    color: white;
    border-color: #5ce0c6;
  }
  
  .page-ellipsis {
    color: #6b7280;
    padding: 0 0.25rem;
  }
  
  @media (max-width: 768px) {
    .filter-search-container {
      flex-direction: column;
    }
    
    .search-container {
      width: 100%;
    }
  }
</style>
