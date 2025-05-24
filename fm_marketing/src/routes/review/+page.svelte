<!-- src/routes/review/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { reviewStore } from '$lib/stores/reviewStore.js';
  import { userStore } from '$lib/stores/userStore.js';
  import MainLayout from '$lib/components/layout/MainLayout.svelte';
  import ReviewList from '$lib/components/review/ReviewList.svelte';
  import ReviewFilter from '$lib/components/review/ReviewFilter.svelte';
  import Button from '$lib/components/common/Button.svelte';
  
  // 페이지 상태
  let loading = false;
  let reviews = [];
  let currentPage = 1;
  let totalPages = 10;
  let isAdmin = false;
  
  // 필터 상태
  let currentCategory = '카테고리';
  let currentSort = '최신순';
  let currentType = '유형';
  let currentRegion = '전체';
  
  // 검색
  let searchKeyword = '';
  
  // 필터 변경 핸들러
  function handleFilterChange(e) {
    const { category, sort, type, region } = e.detail;
    
    currentCategory = category;
    currentSort = sort;
    currentType = type;
    currentRegion = region;
    
    loadReviews();
  }
  
  // 검색 핸들러
  function handleSearch() {
    currentPage = 1;
    loadReviews();
  }
  
  // 리뷰 목록 로드
  function loadReviews() {
    loading = true;
    
    // 실제로는 API 호출
    reviewStore.fetchReviews();
    
    const unsubscribe = reviewStore.subscribe(state => {
      reviews = state.reviews;
      loading = state.loading;
    });
    
    return () => {
      unsubscribe();
    };
  }
  
  // 페이지네이션
  function goToPage(page) {
    if (page < 1 || page > totalPages || page === currentPage) return;
    
    currentPage = page;
    loadReviews();
  }
  
  onMount(() => {
    loadReviews();
    
    // 관리자 권한 확인
    const unsubscribe = userStore.subscribe(state => {
      isAdmin = state.user?.role === 'admin';
    });
    
    return () => {
      unsubscribe();
    };
  });
</script>

<svelte:head>
  <title>체험단 리뷰 - FM마케팅</title>
  <meta name="description" content="다양한 체험단 리뷰를 확인하고 원하는 체험단을 찾아보세요." />
</svelte:head>

<MainLayout>
  <div class="review-page-container">
    <div class="page-header">
      <div>
        <h1 class="page-title">체험단 리뷰</h1>
        <p class="page-description">실제 참여한 체험단 리뷰를 확인하고 나에게 맞는 체험단을 찾아보세요.</p>
      </div>
      {#if isAdmin}
        <a href="/admin/experiences/new">
          <Button variant="secondary" size="md">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem;">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            체험단 등록
          </Button>
        </a>
      {/if}
    </div>
    
    <!-- 검색 및 필터 영역 -->
    <div class="search-filter-section">
      <div class="search-area">
        <div class="search-input-group">
          <input 
            type="text" 
            placeholder="체험단, 지역, 업체명으로 검색" 
            bind:value={searchKeyword}
            on:keydown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button class="search-button" on:click={handleSearch}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
      </div>
      
      <div class="filter-area">
        <ReviewFilter 
          {currentCategory} 
          {currentSort} 
          {currentType} 
          {currentRegion}
          on:filterChange={handleFilterChange} 
        />
      </div>
    </div>
    
    <!-- 결과 요약 -->
    <div class="results-summary">
      <div class="result-count">
        총 <strong>{reviews.length}</strong>개의 체험단이 있습니다.
      </div>
      
      <div class="view-options">
        <select class="items-per-page">
          <option value="12">12개씩 보기</option>
          <option value="24">24개씩 보기</option>
          <option value="48">48개씩 보기</option>
        </select>
      </div>
    </div>
    
    <!-- 리뷰 목록 -->
    <div class="review-list-section">
      <ReviewList {reviews} {loading} columns={4} />
    </div>
    
    <!-- 페이지네이션 -->
    {#if reviews.length > 0}
      <div class="pagination-section">
        <div class="pagination">
          <button 
            class="pagination-button" 
            disabled={currentPage === 1}
            on:click={() => goToPage(currentPage - 1)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
        
        <div class="page-info">
          <span>{currentPage} / {totalPages} 페이지</span>
        </div>
      </div>
    {/if}
    
    <!-- 추천 체험단 섹션 -->
    <div class="recommended-section">
      <h2 class="section-title">추천 체험단</h2>
      <p class="section-description">인기가 높고 만족도가 좋은 체험단을 추천해드려요.</p>
      
      <div class="recommended-list">
        <ReviewList reviews={reviews.slice(0, 8)} loading={false} columns={4} />
      </div>
      
      <div class="more-button-container">
        <Button variant="outline" size="lg">
          더 많은 체험단 보기
        </Button>
      </div>
    </div>
  </div>
</MainLayout>

<style>
  .review-page-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
  }
  
  .page-header {
    margin-bottom: 3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .page-header > div {
    flex: 1;
  }
  
  .page-title {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }
  
  .page-description {
    font-size: 1rem;
    color: #6b7280;
  }
  
  .search-filter-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 2rem;
    background-color: white;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .search-area {
    display: flex;
    justify-content: center;
  }
  
  .search-input-group {
    display: flex;
    width: 100%;
    max-width: 500px;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    overflow: hidden;
  }
  
  .search-input-group input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: none;
    outline: none;
    font-size: 1rem;
  }
  
  .search-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1rem;
    background-color: #5ce0c6;
    border: none;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .search-button:hover {
    background-color: #4bc0a9;
  }
  
  .filter-area {
    display: flex;
    justify-content: center;
  }
  
  .results-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background-color: #f9fafb;
    border-radius: 0.375rem;
  }
  
  .result-count {
    font-size: 0.875rem;
    color: #4b5563;
  }
  
  .view-options {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .items-per-page {
    padding: 0.375rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    background-color: white;
  }
  
  .review-list-section {
    margin-bottom: 3rem;
  }
  
  .pagination-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-bottom: 3rem;
  }
  
  .pagination {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .pagination-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background-color: white;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: #4b5563;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .pagination-button:hover:not(:disabled) {
    background-color: #f3f4f6;
    border-color: #9ca3af;
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
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: #4b5563;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .page-number:hover:not(.active) {
    background-color: #f3f4f6;
  }
  
  .page-number.active {
    background-color: #5ce0c6;
    color: white;
    border-color: #5ce0c6;
  }
  
  .page-ellipsis {
    padding: 0 0.5rem;
    color: #9ca3af;
  }
  
  .page-info {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .recommended-section {
    background-color: white;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.5rem;
    text-align: center;
  }
  
  .section-description {
    font-size: 1rem;
    color: #6b7280;
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .recommended-list {
    margin-bottom: 2rem;
  }
  
  .more-button-container {
    display: flex;
    justify-content: center;
  }
  
  @media (max-width: 768px) {
    .search-filter-section {
      padding: 1.5rem;
    }
    
    .results-summary {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }
    
    .pagination {
      flex-wrap: wrap;
      justify-content: center;
    }
  }
</style>
