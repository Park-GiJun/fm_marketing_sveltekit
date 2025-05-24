<!-- 관리자 통계 페이지 -->
<script>
  import { onMount } from 'svelte';
  import { statsApi } from '$lib/utils/api.js';
  import { formatKoreanDate } from '$lib/utils/date.js';
  
  let statsData = {
    userStats: {
      totalUsers: 0,
      newUsersToday: 0,
      newUsersWeek: 0,
      newUsersMonth: 0,
      activeUsers: 0,
      verifiedUsers: 0
    },
    experienceStats: {
      totalExperiences: 0,
      activeExperiences: 0,
      completedExperiences: 0,
      totalApplications: 0,
      approvedApplications: 0,
      averageApplicationsPerExperience: 0
    },
    communityStats: {
      totalPosts: 0,
      postsToday: 0,
      totalComments: 0,
      activePosters: 0
    },
    pointStats: {
      totalPointsDistributed: 0,
      totalPointsUsed: 0,
      averagePointsPerUser: 0,
      pendingWithdrawals: 0
    }
  };
  
  let selectedPeriod = '7days';
  let loading = true;
  let chartData = [];
  
  // 기간 옵션
  const periodOptions = [
    { value: '7days', label: '최근 7일' },
    { value: '30days', label: '최근 30일' },
    { value: '90days', label: '최근 90일' },
    { value: 'year', label: '1년' }
  ];
  
  // 통계 데이터 로드
  async function loadStats() {
    try {
      loading = true;
      
      const response = await statsApi.getReviewStats({ period: selectedPeriod });
      statsData = response.data || statsData;
      
      // 차트 데이터 생성 (더미)
      generateChartData();
      
    } catch (error) {
      console.error('통계 데이터 로드 실패:', error);
    } finally {
      loading = false;
    }
  }
  
  // 차트 데이터 생성
  function generateChartData() {
    const days = selectedPeriod === '7days' ? 7 : 
                 selectedPeriod === '30days' ? 30 :
                 selectedPeriod === '90days' ? 90 : 365;
    
    chartData = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      
      return {
        date: formatKoreanDate(date),
        users: Math.floor(Math.random() * 50) + 10,
        experiences: Math.floor(Math.random() * 20) + 5,
        applications: Math.floor(Math.random() * 100) + 20
      };
    });
  }
  
  // CSV 다운로드
  function downloadCSV(type) {
    let csvContent = '';
    let filename = '';
    
    switch (type) {
      case 'users':
        csvContent = 'Date,New Users\n';
        chartData.forEach(item => {
          csvContent += `${item.date},${item.users}\n`;
        });
        filename = `user_stats_${selectedPeriod}.csv`;
        break;
        
      case 'experiences':
        csvContent = 'Date,New Experiences\n';
        chartData.forEach(item => {
          csvContent += `${item.date},${item.experiences}\n`;
        });
        filename = `experience_stats_${selectedPeriod}.csv`;
        break;
        
      case 'applications':
        csvContent = 'Date,Applications\n';
        chartData.forEach(item => {
          csvContent += `${item.date},${item.applications}\n`;
        });
        filename = `application_stats_${selectedPeriod}.csv`;
        break;
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
  
  onMount(() => {
    loadStats();
  });
</script>

<div class="stats-page">
  <div class="page-header">
    <h1 class="page-title">통계</h1>
    
    <div class="header-actions">
      <select bind:value={selectedPeriod} on:change={loadStats}>
        {#each periodOptions as option}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
      
      <button class="refresh-button" on:click={loadStats} disabled={loading}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class:rotating={loading}>
          <polyline points="23 4 23 10 17 10"></polyline>
          <polyline points="1 20 1 14 7 14"></polyline>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
        </svg>
        새로고침
      </button>
    </div>
  </div>
  
  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>통계 데이터를 불러오는 중...</p>
    </div>
  {:else}
    <!-- 주요 지표 카드 -->
    <div class="stats-grid">
      <!-- 사용자 통계 -->
      <div class="stat-section">
        <h2 class="section-title">사용자 통계</h2>
        <div class="stat-cards">
          <div class="stat-card">
            <div class="stat-label">전체 사용자</div>
            <div class="stat-value">{statsData.userStats.totalUsers.toLocaleString()}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">오늘 가입</div>
            <div class="stat-value">{statsData.userStats.newUsersToday.toLocaleString()}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">주간 가입</div>
            <div class="stat-value">{statsData.userStats.newUsersWeek.toLocaleString()}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">인증 사용자</div>
            <div class="stat-value">{statsData.userStats.verifiedUsers.toLocaleString()}</div>
          </div>
        </div>
      </div>
      
      <!-- 체험단 통계 -->
      <div class="stat-section">
        <h2 class="section-title">체험단 통계</h2>
        <div class="stat-cards">
          <div class="stat-card">
            <div class="stat-label">전체 체험단</div>
            <div class="stat-value">{statsData.experienceStats.totalExperiences.toLocaleString()}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">진행중</div>
            <div class="stat-value">{statsData.experienceStats.activeExperiences.toLocaleString()}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">총 신청</div>
            <div class="stat-value">{statsData.experienceStats.totalApplications.toLocaleString()}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">평균 신청</div>
            <div class="stat-value">{statsData.experienceStats.averageApplicationsPerExperience.toFixed(1)}</div>
          </div>
        </div>
      </div>
      
      <!-- 커뮤니티 통계 -->
      <div class="stat-section">
        <h2 class="section-title">커뮤니티 통계</h2>
        <div class="stat-cards">
          <div class="stat-card">
            <div class="stat-label">전체 게시글</div>
            <div class="stat-value">{statsData.communityStats.totalPosts.toLocaleString()}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">오늘 게시글</div>
            <div class="stat-value">{statsData.communityStats.postsToday.toLocaleString()}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">전체 댓글</div>
            <div class="stat-value">{statsData.communityStats.totalComments.toLocaleString()}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">활동 사용자</div>
            <div class="stat-value">{statsData.communityStats.activePosters.toLocaleString()}</div>
          </div>
        </div>
      </div>
      
      <!-- 포인트 통계 -->
      <div class="stat-section">
        <h2 class="section-title">포인트 통계</h2>
        <div class="stat-cards">
          <div class="stat-card">
            <div class="stat-label">총 지급</div>
            <div class="stat-value">{statsData.pointStats.totalPointsDistributed.toLocaleString()}P</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">총 사용</div>
            <div class="stat-value">{statsData.pointStats.totalPointsUsed.toLocaleString()}P</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">평균 보유</div>
            <div class="stat-value">{statsData.pointStats.averagePointsPerUser.toLocaleString()}P</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">대기 환급</div>
            <div class="stat-value">{statsData.pointStats.pendingWithdrawals.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 차트 섹션 -->
    <div class="charts-section">
      <!-- 사용자 증가 차트 -->
      <div class="chart-container">
        <div class="chart-header">
          <h3 class="chart-title">일별 신규 가입자</h3>
          <button class="download-btn" on:click={() => downloadCSV('users')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            CSV 다운로드
          </button>
        </div>
        <div class="chart">
          <div class="chart-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
            <p>차트 영역</p>
          </div>
        </div>
      </div>
      
      <!-- 체험단 현황 차트 -->
      <div class="chart-container">
        <div class="chart-header">
          <h3 class="chart-title">일별 체험단 등록</h3>
          <button class="download-btn" on:click={() => downloadCSV('experiences')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            CSV 다운로드
          </button>
        </div>
        <div class="chart">
          <div class="chart-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
            <p>차트 영역</p>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .stats-page {
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
  
  .header-actions {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  
  .header-actions select {
    padding: 0.5rem 1rem;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    cursor: pointer;
  }
  
  .refresh-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    color: #4b5563;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .refresh-button:hover:not(:disabled) {
    background-color: #f9fafb;
    border-color: #d1d5db;
  }
  
  .refresh-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .refresh-button svg {
    transition: transform 0.3s;
  }
  
  .refresh-button svg.rotating {
    animation: rotate 1s linear infinite;
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  /* 통계 그리드 */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }
  
  .stat-section {
    background-color: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .section-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 1rem 0;
  }
  
  .stat-cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .stat-card {
    padding: 1rem;
    background-color: #f9fafb;
    border-radius: 0.5rem;
    text-align: center;
  }
  
  .stat-label {
    font-size: 0.75rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
  }
  
  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
  }
  
  /* 차트 섹션 */
  .charts-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    gap: 2rem;
  }
  
  .chart-container {
    background-color: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .chart-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }
  
  .download-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    color: #4b5563;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .download-btn:hover {
    background-color: #f9fafb;
    border-color: #d1d5db;
  }
  
  .chart {
    height: 300px;
    background-color: #f9fafb;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .chart-placeholder {
    text-align: center;
    color: #9ca3af;
  }
  
  .chart-placeholder svg {
    margin: 0 auto 1rem;
    color: #e5e7eb;
  }
  
  .chart-placeholder p {
    font-size: 0.875rem;
    margin: 0;
  }
  
  /* 로딩 */
  .loading {
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
  
  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
    
    .charts-section {
      grid-template-columns: 1fr;
    }
    
    .stat-cards {
      grid-template-columns: 1fr;
    }
  }
</style>
