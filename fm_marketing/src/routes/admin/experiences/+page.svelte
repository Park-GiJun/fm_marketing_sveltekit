<!-- 관리자 체험단 관리 페이지 -->
<script>
  import { onMount } from 'svelte';
  import { reviewApi } from '$lib/utils/api.js';
  import { formatKoreanDate, formatDDay } from '$lib/utils/date.js';
  import { toast } from '$lib/stores/toastStore.js';
  
  let experiences = [];
  let loading = true;
  let searchQuery = '';
  let selectedStatus = 'all';
  let selectedRegion = 'all';
  let currentPage = 1;
  let totalPages = 1;
  
  // 필터 옵션
  const statusOptions = [
    { value: 'all', label: '전체' },
    { value: 'draft', label: '임시저장' },
    { value: 'active', label: '진행중' },
    { value: 'closed', label: '마감' },
    { value: 'completed', label: '완료' }
  ];
  
  const regionOptions = [
    { value: 'all', label: '전체' },
    { value: '서울', label: '서울' },
    { value: '경기', label: '경기' },
    { value: '인천', label: '인천' },
    { value: '부산', label: '부산' },
    { value: '대구', label: '대구' },
    { value: '광주', label: '광주' },
    { value: '대전', label: '대전' },
    { value: '울산', label: '울산' },
    { value: '세종', label: '세종' },
    { value: '강원', label: '강원' },
    { value: '충북', label: '충북' },
    { value: '충남', label: '충남' },
    { value: '전북', label: '전북' },
    { value: '전남', label: '전남' },
    { value: '경북', label: '경북' },
    { value: '경남', label: '경남' },
    { value: '제주', label: '제주' }
  ];
  
  // 체험단 목록 로드
  async function loadExperiences() {
    try {
      loading = true;
      
      const params = {
        page: currentPage,
        limit: 20
      };
      
      if (searchQuery) params.search = searchQuery;
      if (selectedStatus !== 'all') params.status = selectedStatus;
      if (selectedRegion !== 'all') params.region = selectedRegion;
      
      const response = await reviewApi.getReviews(params);
      
      experiences = response.data.experiences || [];
      totalPages = response.data.pagination?.totalPages || 1;
      
    } catch (error) {
      console.error('체험단 목록 로드 실패:', error);
      toast.error('체험단 목록을 불러오는데 실패했습니다.');
    } finally {
      loading = false;
    }
  }
  
  // 체험단 상태 변경
  async function updateExperienceStatus(id, newStatus) {
    try {
      await reviewApi.updateReview(id, { status: newStatus });
      toast.success('체험단 상태가 변경되었습니다.');
      await loadExperiences();
    } catch (error) {
      console.error('체험단 상태 변경 실패:', error);
      toast.error('체험단 상태 변경에 실패했습니다.');
    }
  }
  
  // 체험단 삭제
  async function deleteExperience(id) {
    if (!confirm('정말로 이 체험단을 삭제하시겠습니까?')) {
      return;
    }
    
    try {
      await reviewApi.deleteReview(id);
      toast.success('체험단이 삭제되었습니다.');
      await loadExperiences();
    } catch (error) {
      console.error('체험단 삭제 실패:', error);
      toast.error('체험단 삭제에 실패했습니다.');
    }
  }
  
  // 체험단 프로모션 토글
  async function togglePromotion(id, isPromoted) {
    try {
      await reviewApi.updateReview(id, { isPromoted: !isPromoted });
      toast.success(isPromoted ? '프로모션이 해제되었습니다.' : '프로모션이 설정되었습니다.');
      await loadExperiences();
    } catch (error) {
      console.error('프로모션 토글 실패:', error);
      toast.error('프로모션 설정에 실패했습니다.');
    }
  }
  
  // 검색 처리
  function handleSearch() {
    currentPage = 1;
    loadExperiences();
  }
  
  // 필터 변경
  function handleFilterChange() {
    currentPage = 1;
    loadExperiences();
  }
  
  // 페이지 변경
  function changePage(page) {
    currentPage = page;
    loadExperiences();
  }
  
  // 상태별 색상 클래스
  function getStatusClass(status) {
    switch (status) {
      case 'draft': return 'status-draft';
      case 'active': return 'status-active';
      case 'closed': return 'status-closed';
      case 'completed': return 'status-completed';
      default: return '';
    }
  }
  
  // 상태별 라벨
  function getStatusLabel(status) {
    switch (status) {
      case 'draft': return '임시저장';
      case 'active': return '진행중';
      case 'closed': return '마감';
      case 'completed': return '완료';
      default: return status;
    }
  }
  
  onMount(() => {
    loadExperiences();
  });
</script>

<div class="experiences-page">
  <div class="page-header">
    <h1 class="page-title">체험단 관리</h1>
    <a href="/admin/experiences/new" class="btn-primary">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      새 체험단 등록
    </a>
  </div>
  
  <!-- 검색 및 필터 -->
  <div class="filters">
    <div class="search-box">
      <input
        type="text"
        placeholder="체험단 제목, 회사명으로 검색"
        bind:value={searchQuery}
        on:keyup={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button on:click={handleSearch}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </button>
    </div>
    
    <div class="filter-group">
      <select bind:value={selectedStatus} on:change={handleFilterChange}>
        {#each statusOptions as option}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
      
      <select bind:value={selectedRegion} on:change={handleFilterChange}>
        {#each regionOptions as option}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
    </div>
  </div>
  
  <!-- 체험단 목록 -->
  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>체험단 목록을 불러오는 중...</p>
    </div>
  {:else if experiences.length === 0}
    <div class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
      <p>등록된 체험단이 없습니다.</p>
    </div>
  {:else}
    <div class="table-container">
      <table class="experiences-table">
        <thead>
          <tr>
            <th width="50">ID</th>
            <th>제목</th>
            <th width="100">카테고리</th>
            <th width="80">지역</th>
            <th width="100">신청마감</th>
            <th width="80">신청자</th>
            <th width="80">상태</th>
            <th width="60">프로모션</th>
            <th width="150">액션</th>
          </tr>
        </thead>
        <tbody>
          {#each experiences as experience}
            <tr>
              <td class="id">{experience.id}</td>
              <td class="title">
                <a href="/admin/experiences/{experience.id}">
                  {experience.title}
                </a>
                {#if experience.companyName}
                  <span class="company">({experience.companyName})</span>
                {/if}
              </td>
              <td class="category">{experience.category}</td>
              <td class="region">{experience.region}</td>
              <td class="deadline">
                {#if experience.applicationDeadline}
                  <div>{formatKoreanDate(experience.applicationDeadline)}</div>
                  <div class="d-day">{formatDDay(experience.applicationDeadline)}</div>
                {:else}
                  -
                {/if}
              </td>
              <td class="participants">
                {experience.currentParticipants || 0}/{experience.maxParticipants || '∞'}
              </td>
              <td>
                <span class="status-badge {getStatusClass(experience.status)}">
                  {getStatusLabel(experience.status)}
                </span>
              </td>
              <td class="promotion">
                <button
                  class="toggle-btn"
                  class:active={experience.isPromoted}
                  on:click={() => togglePromotion(experience.id, experience.isPromoted)}
                  title={experience.isPromoted ? '프로모션 해제' : '프로모션 설정'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
                  </svg>
                </button>
              </td>
              <td class="actions">
                <div class="action-buttons">
                  <a href="/admin/experiences/{experience.id}" class="btn-edit" title="상세/수정">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </a>
                  
                  {#if experience.status === 'draft'}
                    <button
                      class="btn-activate"
                      on:click={() => updateExperienceStatus(experience.id, 'active')}
                      title="활성화"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 11 12 14 22 4"></polyline>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                      </svg>
                    </button>
                  {:else if experience.status === 'active'}
                    <button
                      class="btn-close"
                      on:click={() => updateExperienceStatus(experience.id, 'closed')}
                      title="마감"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                      </svg>
                    </button>
                  {/if}
                  
                  <button
                    class="btn-delete"
                    on:click={() => deleteExperience(experience.id)}
                    title="삭제"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    
    <!-- 페이지네이션 -->
    {#if totalPages > 1}
      <div class="pagination">
        <button
          on:click={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
          class="page-btn"
        >
          이전
        </button>
        
        {#each Array(totalPages) as _, i}
          {#if i + 1 === 1 || i + 1 === totalPages || (i + 1 >= currentPage - 2 && i + 1 <= currentPage + 2)}
            <button
              on:click={() => changePage(i + 1)}
              class="page-btn"
              class:active={currentPage === i + 1}
            >
              {i + 1}
            </button>
          {:else if i + 1 === currentPage - 3 || i + 1 === currentPage + 3}
            <span class="ellipsis">...</span>
          {/if}
        {/each}
        
        <button
          on:click={() => changePage(currentPage + 1)}
          disabled={currentPage === totalPages}
          class="page-btn"
        >
          다음
        </button>
      </div>
    {/if}
  {/if}
</div>

<style>
  .experiences-page {
    max-width: 1400px;
    margin: 0 auto;
  }
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .page-title {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
  }
  
  .btn-primary {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background-color: #5ce0c6;
    color: white;
    text-decoration: none;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  .btn-primary:hover {
    background-color: #3aaa94;
  }
  
  /* 검색 및 필터 */
  .filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .search-box {
    flex: 1;
    display: flex;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    overflow: hidden;
  }
  
  .search-box input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: none;
    font-size: 0.875rem;
  }
  
  .search-box button {
    padding: 0 1rem;
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    transition: color 0.2s;
  }
  
  .search-box button:hover {
    color: #4b5563;
  }
  
  .filter-group {
    display: flex;
    gap: 0.5rem;
  }
  
  .filter-group select {
    padding: 0.75rem 1rem;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    cursor: pointer;
  }
  
  /* 테이블 */
  .table-container {
    background-color: white;
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .experiences-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .experiences-table th {
    background-color: #f9fafb;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    font-size: 0.875rem;
    color: #4b5563;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .experiences-table td {
    padding: 1rem;
    border-bottom: 1px solid #f3f4f6;
  }
  
  .experiences-table tbody tr:hover {
    background-color: #f9fafb;
  }
  
  .id {
    color: #6b7280;
    font-size: 0.875rem;
  }
  
  .title a {
    color: #1f2937;
    text-decoration: none;
    font-weight: 500;
  }
  
  .title a:hover {
    color: #5ce0c6;
  }
  
  .company {
    font-size: 0.75rem;
    color: #9ca3af;
  }
  
  .category,
  .region {
    font-size: 0.875rem;
    color: #4b5563;
  }
  
  .deadline {
    font-size: 0.875rem;
    color: #4b5563;
  }
  
  .d-day {
    font-size: 0.75rem;
    color: #dc2626;
    font-weight: 500;
  }
  
  .participants {
    font-size: 0.875rem;
    color: #4b5563;
    text-align: center;
  }
  
  /* 상태 뱃지 */
  .status-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .status-draft {
    background-color: #f3f4f6;
    color: #6b7280;
  }
  
  .status-active {
    background-color: #d1fae5;
    color: #065f46;
  }
  
  .status-closed {
    background-color: #fee2e2;
    color: #991b1b;
  }
  
  .status-completed {
    background-color: #ddd6fe;
    color: #5b21b6;
  }
  
  /* 프로모션 토글 */
  .toggle-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #d1d5db;
    transition: color 0.2s;
  }
  
  .toggle-btn.active {
    color: #fbbf24;
  }
  
  .toggle-btn:hover {
    color: #9ca3af;
  }
  
  .toggle-btn.active:hover {
    color: #f59e0b;
  }
  
  /* 액션 버튼 */
  .action-buttons {
    display: flex;
    gap: 0.5rem;
  }
  
  .action-buttons button,
  .action-buttons a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border: 1px solid #e5e7eb;
    background-color: white;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .btn-edit {
    color: #3b82f6;
  }
  
  .btn-edit:hover {
    background-color: #eff6ff;
    border-color: #3b82f6;
  }
  
  .btn-activate {
    color: #10b981;
  }
  
  .btn-activate:hover {
    background-color: #ecfdf5;
    border-color: #10b981;
  }
  
  .btn-close {
    color: #f59e0b;
  }
  
  .btn-close:hover {
    background-color: #fffbeb;
    border-color: #f59e0b;
  }
  
  .btn-delete {
    color: #ef4444;
  }
  
  .btn-delete:hover {
    background-color: #fef2f2;
    border-color: #ef4444;
  }
  
  /* 로딩 & 빈 상태 */
  .loading,
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    background-color: white;
    border-radius: 0.75rem;
    color: #9ca3af;
  }
  
  .spinner {
    width: 3rem;
    height: 3rem;
    border: 3px solid #e5e7eb;
    border-top-color: #5ce0c6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  /* 페이지네이션 */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin-top: 2rem;
  }
  
  .page-btn {
    padding: 0.5rem 1rem;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    color: #4b5563;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .page-btn:hover:not(:disabled) {
    background-color: #f9fafb;
    border-color: #d1d5db;
  }
  
  .page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .page-btn.active {
    background-color: #5ce0c6;
    border-color: #5ce0c6;
    color: white;
  }
  
  .ellipsis {
    color: #9ca3af;
  }
  
  @media (max-width: 768px) {
    .filters {
      flex-direction: column;
    }
    
    .filter-group {
      flex-direction: column;
    }
    
    .table-container {
      overflow-x: auto;
    }
    
    .experiences-table {
      min-width: 800px;
    }
  }
</style>
