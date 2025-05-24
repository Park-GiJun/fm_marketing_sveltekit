<!-- src/routes/mypage/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { userStore } from '$lib/stores/userStore.js';
  import MainLayout from '$lib/components/layout/MainLayout.svelte';
  import Button from '$lib/components/common/Button.svelte';
  
  let isAuthenticated = false;
  let user = null;
  let activeTab = 'profile';
  
  // 더미 데이터
  let myActivities = [
    { id: 1, title: '서울 맛집 체험단', status: '활동 완료', date: '2025.05.15' },
    { id: 2, title: '뷰티 제품 체험단', status: '진행 중', date: '2025.05.20' }
  ];
  
  let myPoints = {
    total: 15000,
    available: 12000,
    pending: 3000
  };
  
  let pointHistory = [
    { id: 1, type: '적립', amount: 5000, reason: '체험단 활동 완료', date: '2025.05.15' },
    { id: 2, type: '사용', amount: -3000, reason: '현금 환급', date: '2025.05.10' }
  ];
  
  function changeTab(tab) {
    activeTab = tab;
  }
  
  async function handleLogout() {
    userStore.logout();
    goto('/');
  }
  
  onMount(() => {
    const unsubscribe = userStore.subscribe(state => {
      isAuthenticated = state.isAuthenticated;
      user = state.user;
      
      if (!isAuthenticated) {
        goto('/login?redirect=/mypage');
      }
    });
    
    return () => {
      unsubscribe();
    };
  });
</script>

<svelte:head>
  <title>마이페이지 - FM마케팅</title>
</svelte:head>

<MainLayout>
  <div class="mypage-container">
    <div class="mypage-header">
      <h1 class="mypage-title">마이페이지</h1>
    </div>
    
    {#if user}
      <div class="user-info-card">
        <div class="user-avatar" style="background-image: url({user.profileImage || '/images/default-avatar.jpg'})"></div>
        <div class="user-details">
          <h2 class="user-name">{user.name} ({user.nickname})</h2>
          <p class="user-email">{user.email}</p>
          <div class="user-stats">
            <div class="stat-item">
              <span class="stat-label">체험단 활동</span>
              <span class="stat-value">{myActivities.length}회</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">보유 포인트</span>
              <span class="stat-value">{myPoints.available.toLocaleString()}P</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="tab-navigation">
        <button 
          class={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          on:click={() => changeTab('profile')}
        >
          회원정보
        </button>
        <button 
          class={`tab-button ${activeTab === 'activities' ? 'active' : ''}`}
          on:click={() => changeTab('activities')}
        >
          체험단 활동
        </button>
        <button 
          class={`tab-button ${activeTab === 'points' ? 'active' : ''}`}
          on:click={() => changeTab('points')}
        >
          포인트
        </button>
      </div>
      
      <div class="tab-content">
        {#if activeTab === 'profile'}
          <div class="profile-section">
            <h3 class="section-title">기본 정보</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">아이디</span>
                <span class="info-value">{user.username}</span>
              </div>
              <div class="info-item">
                <span class="info-label">이메일</span>
                <span class="info-value">{user.email}</span>
              </div>
              <div class="info-item">
                <span class="info-label">이름</span>
                <span class="info-value">{user.name}</span>
              </div>
              <div class="info-item">
                <span class="info-label">닉네임</span>
                <span class="info-value">{user.nickname}</span>
              </div>
            </div>
            
            <div class="profile-actions">
              <Button variant="outline" size="md">회원정보 수정</Button>
              <Button variant="outline" size="md" on:click={handleLogout}>로그아웃</Button>
            </div>
          </div>
        {:else if activeTab === 'activities'}
          <div class="activities-section">
            <h3 class="section-title">체험단 활동 내역</h3>
            <div class="activities-list">
              {#each myActivities as activity}
                <div class="activity-item">
                  <div class="activity-info">
                    <h4 class="activity-title">{activity.title}</h4>
                    <span class="activity-date">{activity.date}</span>
                  </div>
                  <span class="activity-status {activity.status === '활동 완료' ? 'completed' : 'ongoing'}">
                    {activity.status}
                  </span>
                </div>
              {/each}
            </div>
          </div>
        {:else if activeTab === 'points'}
          <div class="points-section">
            <div class="points-summary">
              <div class="points-card">
                <span class="points-label">총 포인트</span>
                <span class="points-value">{myPoints.total.toLocaleString()}P</span>
              </div>
              <div class="points-card">
                <span class="points-label">사용 가능</span>
                <span class="points-value primary">{myPoints.available.toLocaleString()}P</span>
              </div>
              <div class="points-card">
                <span class="points-label">적립 예정</span>
                <span class="points-value">{myPoints.pending.toLocaleString()}P</span>
              </div>
            </div>
            
            <h3 class="section-title">포인트 내역</h3>
            <div class="point-history">
              {#each pointHistory as history}
                <div class="history-item">
                  <div class="history-info">
                    <span class="history-type {history.type}">{history.type}</span>
                    <span class="history-reason">{history.reason}</span>
                    <span class="history-date">{history.date}</span>
                  </div>
                  <span class="history-amount {history.type}">
                    {history.amount > 0 ? '+' : ''}{history.amount.toLocaleString()}P
                  </span>
                </div>
              {/each}
            </div>
            
            <div class="points-actions">
              <Button variant="primary" size="md">포인트 환급 신청</Button>
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</MainLayout>

<style>
  .mypage-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 1rem;
  }
  
  .mypage-header {
    margin-bottom: 2rem;
  }
  
  .mypage-title {
    font-size: 1.875rem;
    font-weight: 700;
    color: #1f2937;
  }
  
  .user-info-card {
    display: flex;
    gap: 2rem;
    background-color: white;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
  }
  
  .user-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: #e5e7eb;
    background-size: cover;
    background-position: center;
  }
  
  .user-details {
    flex: 1;
  }
  
  .user-name {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }
  
  .user-email {
    color: #6b7280;
    margin-bottom: 1rem;
  }
  
  .user-stats {
    display: flex;
    gap: 2rem;
  }
  
  .stat-item {
    display: flex;
    flex-direction: column;
  }
  
  .stat-label {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .stat-value {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
  }
  
  .tab-navigation {
    display: flex;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 2rem;
  }
  
  .tab-button {
    padding: 0.75rem 2rem;
    background-color: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    font-size: 1rem;
    font-weight: 500;
    color: #6b7280;
    cursor: pointer;
  }
  
  .tab-button.active {
    color: #5ce0c6;
    border-bottom-color: #5ce0c6;
  }
  
  .tab-content {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 2rem;
  }
  
  .section-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .info-item {
    display: flex;
    flex-direction: column;
  }
  
  .info-label {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 0.25rem;
  }
  
  .info-value {
    font-size: 1rem;
    color: #1f2937;
  }
  
  .profile-actions {
    display: flex;
    gap: 1rem;
  }
  
  .activities-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .activity-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #f9fafb;
    border-radius: 0.375rem;
  }
  
  .activity-title {
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 0.25rem;
  }
  
  .activity-date {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .activity-status {
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.875rem;
  }
  
  .activity-status.completed {
    background-color: #d1fae5;
    color: #10b981;
  }
  
  .activity-status.ongoing {
    background-color: #dbeafe;
    color: #3b82f6;
  }
  
  .points-summary {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .points-card {
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    background-color: #f9fafb;
    border-radius: 0.5rem;
    text-align: center;
  }
  
  .points-label {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
  }
  
  .points-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
  }
  
  .points-value.primary {
    color: #5ce0c6;
  }
  
  .point-history {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 2rem;
  }
  
  .history-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .history-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .history-type {
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  .history-type.적립 {
    color: #10b981;
  }
  
  .history-type.사용 {
    color: #ef4444;
  }
  
  .history-reason {
    font-size: 0.875rem;
    color: #4b5563;
  }
  
  .history-date {
    font-size: 0.75rem;
    color: #9ca3af;
  }
  
  .history-amount {
    font-size: 1rem;
    font-weight: 600;
  }
  
  .history-amount.적립 {
    color: #10b981;
  }
  
  .history-amount.사용 {
    color: #ef4444;
  }
  
  .points-actions {
    text-align: center;
  }
  
  @media (max-width: 768px) {
    .user-info-card {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    
    .info-grid {
      grid-template-columns: 1fr;
    }
    
    .points-summary {
      grid-template-columns: 1fr;
    }
  }
</style>
