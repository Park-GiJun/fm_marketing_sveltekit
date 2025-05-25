<!-- 관리자 대시보드 메인 페이지 -->
<script>
  import { onMount } from 'svelte';
  import { statsApi } from '$lib/utils/api.js';
  import { userStore } from '$lib/stores/userStore.js';
  import { formatKoreanDate, getRelativeTime } from '$lib/utils/date.js';
  
  // 대시보드 데이터
  let dashboardData = {
    stats: {
      totalUsers: 0,
      newUsers: 0,
      totalExperiences: 0,
      activeExperiences: 0,
      totalPosts: 0,
      todayPosts: 0,
      totalApplications: 0,
      pendingApplications: 0
    },
    recentUsers: [],
    recentExperiences: [],
    recentApplications: [],
    recentPosts: []
  };
  
  let loading = true;
  let error = null;
  
  // 통계 카드 정보
  const statCards = [
    {
      title: '전체 사용자',
      key: 'totalUsers',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>`,
      color: 'blue'
    },
    {
      title: '신규 가입자',
      key: 'newUsers',
      subtitle: '(최근 7일)',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="8.5" cy="7" r="4"></circle>
        <line x1="20" y1="8" x2="20" y2="14"></line>
        <line x1="23" y1="11" x2="17" y2="11"></line>
      </svg>`,
      color: 'green'
    },
    {
      title: '진행중 체험단',
      key: 'activeExperiences',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
      </svg>`,
      color: 'mint'
    },
    {
      title: '대기중 신청',
      key: 'pendingApplications',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>`,
      color: 'yellow'
    }
  ];
  
  // 대시보드 데이터 로드
  async function loadDashboardData() {
    try {
      loading = true;
      error = null;
      
      const response = await statsApi.getDashboard();
      dashboardData = response.data || dashboardData;
      
    } catch (err) {
      console.error('대시보드 데이터 로드 실패:', err);
      error = '대시보드 데이터를 불러오는데 실패했습니다.';
    } finally {
      loading = false;
    }
  }
  
  onMount(() => {
    loadDashboardData();
    
    // 30초마다 자동 새로고침
    const interval = setInterval(loadDashboardData, 30000);
    
    return () => {
      clearInterval(interval);
    };
  });
</script>

<div class="dashboard">
  <div class="dashboard-header">
    <h1 class="page-title">대시보드</h1>
    <button class="refresh-button" on:click={loadDashboardData} disabled={loading}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class:rotating={loading}>
        <polyline points="23 4 23 10 17 10"></polyline>
        <polyline points="1 20 1 14 7 14"></polyline>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
      </svg>
      새로고침
    </button>
  </div>
  
  {#if error}
    <div class="error-message">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      {error}
    </div>
  {/if}
  
  <!-- 통계 카드 -->
  <div class="stats-grid">
    {#each statCards as card}
      <div class="stat-card {card.color}">
        <div class="stat-icon">
          {@html card.icon}
        </div>
        <div class="stat-content">
          <h3 class="stat-title">{card.title}</h3>
          {#if card.subtitle}
            <p class="stat-subtitle">{card.subtitle}</p>
          {/if}
          <p class="stat-value">
            {#if loading}
              <span class="skeleton">0000</span>
            {:else}
              {dashboardData.stats[card.key].toLocaleString()}
            {/if}
          </p>
        </div>
      </div>
    {/each}
  </div>
  
  <!-- 최근 활동 섹션 -->
  <div class="recent-activities">
    <!-- 최근 가입 사용자 -->
    <div class="activity-section">
      <h2 class="section-title">최근 가입 사용자</h2>
      <div class="activity-list">
        {#if loading}
          {#each Array(3) as _}
            <div class="activity-item skeleton-item">
              <div class="skeleton-avatar"></div>
              <div class="skeleton-content">
                <div class="skeleton-text"></div>
                <div class="skeleton-text short"></div>
              </div>
            </div>
          {/each}
        {:else if dashboardData.recentUsers.length > 0}
          {#each dashboardData.recentUsers as user}
            <div class="activity-item">
              <div class="user-avatar">
                {user.name ? user.name.charAt(0) : 'U'}
              </div>
              <div class="activity-content">
                <p class="activity-main">{user.name || user.nickname || user.username}</p>
                <p class="activity-sub">{user.email} · {getRelativeTime(user.createdAt)}</p>
              </div>
              <a href="/admin/users/{user.id}" class="activity-link">
                상세보기
              </a>
            </div>
          {/each}
        {:else}
          <p class="no-data">최근 가입한 사용자가 없습니다.</p>
        {/if}
      </div>
    </div>
    
    <!-- 최근 체험단 -->
    <div class="activity-section">
      <h2 class="section-title">최근 등록 체험단</h2>
      <div class="activity-list">
        {#if loading}
          {#each Array(3) as _}
            <div class="activity-item skeleton-item">
              <div class="skeleton-content">
                <div class="skeleton-text"></div>
                <div class="skeleton-text short"></div>
              </div>
            </div>
          {/each}
        {:else if dashboardData.recentExperiences.length > 0}
          {#each dashboardData.recentExperiences as experience}
            <div class="activity-item">
              <div class="activity-content">
                <p class="activity-main">{experience.title}</p>
                <p class="activity-sub">
                  {experience.region} · {experience.category} · 
                  <span class="status-badge {experience.status}">
                    {experience.status === 'active' ? '진행중' : '마감'}
                  </span>
                </p>
              </div>
              <a href="/admin/experiences/{experience.id}" class="activity-link">
                관리
              </a>
            </div>
          {/each}
        {:else}
          <p class="no-data">최근 등록된 체험단이 없습니다.</p>
        {/if}
      </div>
    </div>
    
    <!-- 최근 신청 -->
    <div class="activity-section">
      <h2 class="section-title">최근 체험단 신청</h2>
      <div class="activity-list">
        {#if loading}
          {#each Array(3) as _}
            <div class="activity-item skeleton-item">
              <div class="skeleton-content">
                <div class="skeleton-text"></div>
                <div class="skeleton-text short"></div>
              </div>
            </div>
          {/each}
        {:else if dashboardData.recentApplications.length > 0}
          {#each dashboardData.recentApplications as application}
            <div class="activity-item">
              <div class="activity-content">
                <p class="activity-main">{application.userName} → {application.experienceTitle}</p>
                <p class="activity-sub">
                  {getRelativeTime(application.createdAt)} · 
                  <span class="status-badge {application.status}">
                    {application.status === 'pending' ? '대기중' : 
                     application.status === 'approved' ? '승인' : '거절'}
                  </span>
                </p>
              </div>
              <a href="/admin/experiences/{application.experienceId}/applications" class="activity-link">
                검토
              </a>
            </div>
          {/each}
        {:else}
          <p class="no-data">최근 신청 내역이 없습니다.</p>
        {/if}
      </div>
    </div>
    
    <!-- 최근 게시글 -->
    <div class="activity-section">
      <h2 class="section-title">최근 커뮤니티 게시글</h2>
      <div class="activity-list">
        {#if loading}
          {#each Array(3) as _}
            <div class="activity-item skeleton-item">
              <div class="skeleton-content">
                <div class="skeleton-text"></div>
                <div class="skeleton-text short"></div>
              </div>
            </div>
          {/each}
        {:else if dashboardData.recentPosts.length > 0}
          {#each dashboardData.recentPosts as post}
            <div class="activity-item">
              <div class="activity-content">
                <p class="activity-main">{post.title}</p>
                <p class="activity-sub">
                  {post.authorName} · {post.category} · {getRelativeTime(post.createdAt)}
                </p>
              </div>
              <a href="/admin/community/{post.id}" class="activity-link">
                관리
              </a>
            </div>
          {/each}
        {:else}
          <p class="no-data">최근 게시글이 없습니다.</p>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .dashboard {
    max-width: 1400px;
    margin: 0 auto;
  }
  
  .dashboard-header {
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
  
  .error-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background-color: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 0.5rem;
    color: #dc2626;
    margin-bottom: 2rem;
  }
  
  /* 통계 카드 */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
  }
  
  .stat-card {
    background-color: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .stat-icon {
    width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    flex-shrink: 0;
  }
  
  .stat-card.blue .stat-icon {
    background-color: #dbeafe;
    color: #3b82f6;
  }
  
  .stat-card.green .stat-icon {
    background-color: #d1fae5;
    color: #10b981;
  }
  
  .stat-card.mint .stat-icon {
    background-color: #ccfbf1;
    color: #14b8a6;
  }
  
  .stat-card.yellow .stat-icon {
    background-color: #fef3c7;
    color: #f59e0b;
  }
  
  .stat-content {
    flex: 1;
  }
  
  .stat-title {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
    font-weight: 500;
  }
  
  .stat-subtitle {
    font-size: 0.75rem;
    color: #9ca3af;
    margin: 0.125rem 0 0 0;
  }
  
  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0.25rem 0 0 0;
  }
  
  /* 최근 활동 섹션 */
  .recent-activities {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }
  
  .activity-section {
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
  
  .activity-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .activity-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background-color: #f9fafb;
    border-radius: 0.375rem;
    transition: background-color 0.2s;
  }
  
  .activity-item:hover {
    background-color: #f3f4f6;
  }
  
  .user-avatar {
    width: 2.5rem;
    height: 2.5rem;
    background-color: #5ce0c6;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1rem;
    flex-shrink: 0;
  }
  
  .activity-content {
    flex: 1;
    min-width: 0;
  }
  
  .activity-main {
    font-size: 0.875rem;
    font-weight: 500;
    color: #1f2937;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .activity-sub {
    font-size: 0.75rem;
    color: #6b7280;
    margin: 0.25rem 0 0 0;
  }
  
  .status-badge {
    display: inline-block;
    padding: 0.125rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .status-badge.active,
  .status-badge.approved {
    background-color: #d1fae5;
    color: #065f46;
  }
  
  .status-badge.closed,
  .status-badge.rejected {
    background-color: #fee2e2;
    color: #991b1b;
  }
  
  .status-badge.pending {
    background-color: #fef3c7;
    color: #92400e;
  }
  
  .activity-link {
    padding: 0.25rem 0.75rem;
    background-color: #5ce0c6;
    color: white;
    font-size: 0.75rem;
    font-weight: 500;
    text-decoration: none;
    border-radius: 0.25rem;
    transition: background-color 0.2s;
  }
  
  .activity-link:hover {
    background-color: #3aaa94;
  }
  
  .no-data {
    text-align: center;
    color: #9ca3af;
    font-size: 0.875rem;
    padding: 2rem 0;
  }
  
  /* 스켈레톤 로더 */
  .skeleton {
    display: inline-block;
    background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 0.25rem;
    color: transparent;
  }
  
  .skeleton-item {
    pointer-events: none;
  }
  
  .skeleton-avatar {
    width: 2.5rem;
    height: 2.5rem;
    background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 50%;
  }
  
  .skeleton-content {
    flex: 1;
  }
  
  .skeleton-text {
    height: 0.875rem;
    background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 0.25rem;
    margin-bottom: 0.5rem;
  }
  
  .skeleton-text.short {
    width: 60%;
  }
  
  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  
  @media (max-width: 1024px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 640px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
    
    .recent-activities {
      grid-template-columns: 1fr;
    }
  }
</style>
