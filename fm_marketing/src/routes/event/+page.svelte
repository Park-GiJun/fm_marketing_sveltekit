<!-- src/routes/event/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { eventStore } from '$lib/stores/eventStore.js';
  import MainLayout from '$lib/components/layout/MainLayout.svelte';
  
  // 상태 변수
  let activeTab = 'notices'; // 'notices' 또는 'events'
  let notices = [];
  let events = [];
  let loading = true;
  
  // 탭 변경 핸들러
  function changeTab(tab) {
    activeTab = tab;
  }
  
  // 데이터 로드 함수
  async function loadData() {
    loading = true;
    
    try {
      if (activeTab === 'notices') {
        await eventStore.fetchNotices();
      } else {
        await eventStore.fetchEvents();
      }
      
      // 스토어에서 데이터 가져오기
      const unsubscribe = eventStore.subscribe(state => {
        notices = state.notices;
        events = state.events;
        loading = state.loading;
      });
      
      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error('데이터 로드 중 오류 발생:', error);
      loading = false;
    }
  }
  
  // 날짜 포맷팅 함수
  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  }
  
  // 이벤트 기간 포맷팅 함수
  function formatPeriod(startDate, endDate) {
    return `${formatDate(startDate)} ~ ${formatDate(endDate)}`;
  }
  
  // 탭 변경 감지 및 데이터 로드
  $: if (activeTab) {
    loadData();
  }
  
  // 컴포넌트 마운트 시 초기 데이터 로드
  onMount(() => {
    loadData();
  });
</script>

<svelte:head>
  <title>{activeTab === 'notices' ? '공지사항' : '이벤트'} - FM마케팅</title>
  <meta name="description" content="FM마케팅의 공지사항과 이벤트 정보를 확인하세요." />
</svelte:head>

<MainLayout>
  <div class="event-notice-container">
    <div class="page-header">
      <h1 class="page-title">{activeTab === 'notices' ? '공지사항' : '이벤트'}</h1>
      <p class="page-description">
        {activeTab === 'notices' 
          ? 'FM마케팅의 중요 공지사항을 확인하세요.'
          : '다양한 이벤트와 혜택 정보를 확인하세요.'}
      </p>
    </div>
    
    <div class="tab-navigation">
      <button 
        class={`tab-button ${activeTab === 'notices' ? 'active' : ''}`} 
        on:click={() => changeTab('notices')}
      >
        공지사항
      </button>
      <button 
        class={`tab-button ${activeTab === 'events' ? 'active' : ''}`} 
        on:click={() => changeTab('events')}
      >
        이벤트
      </button>
    </div>
    
    <div class="tab-content">
      {#if loading}
        <div class="loading-state">
          <p>데이터를 불러오는 중입니다...</p>
        </div>
      {:else if activeTab === 'notices' && notices.length === 0}
        <div class="empty-state">
          <p>등록된 공지사항이 없습니다.</p>
        </div>
      {:else if activeTab === 'events' && events.length === 0}
        <div class="empty-state">
          <p>등록된 이벤트가 없습니다.</p>
        </div>
      {:else if activeTab === 'notices'}
        <div class="notice-list">
          {#each notices as notice (notice.id)}
            <a href={`/event/notice/${notice.id}`} class="notice-item">
              <div class="notice-content">
                {#if notice.isImportant}
                  <span class="notice-badge">중요</span>
                {/if}
                <h3 class="notice-title">{notice.title}</h3>
                <p class="notice-excerpt">{notice.content.length > 100 ? notice.content.slice(0, 100) + '...' : notice.content}</p>
                <div class="notice-meta">
                  <span class="notice-category">{notice.category}</span>
                  <span class="notice-date">{formatDate(notice.createdAt)}</span>
                </div>
              </div>
              <div class="notice-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            </a>
          {/each}
        </div>
      {:else if activeTab === 'events'}
        <div class="event-grid">
          {#each events as event (event.id)}
            <a href={`/event/${event.id}`} class="event-card">
              <div class="event-image" style="background-image: url({event.imageUrl || '/images/events/default-event.jpg'})"></div>
              <div class="event-content">
                <h3 class="event-title">{event.title}</h3>
                <p class="event-period">{formatPeriod(event.startDate, event.endDate)}</p>
                <p class="event-status">{new Date() < new Date(event.endDate) ? '진행중' : '종료'}</p>
              </div>
            </a>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</MainLayout>

<style>
  .event-notice-container {
    width: 100%;
    max-width: 1000px;
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
    transition: all 0.2s;
  }
  
  .tab-button:hover {
    color: #4b5563;
  }
  
  .tab-button.active {
    color: #5ce0c6; /* 민트색 */
    border-bottom-color: #5ce0c6;
  }
  
  .tab-content {
    min-height: 400px;
  }
  
  .loading-state, .empty-state {
    padding: 3rem 0;
    text-align: center;
    color: #6b7280;
  }
  
  /* 공지사항 스타일 */
  .notice-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .notice-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    background-color: white;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
    text-decoration: none;
    color: inherit;
    transition: all 0.2s;
  }
  
  .notice-item:hover {
    border-color: #d1d5db;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  .notice-content {
    flex: 1;
  }
  
  .notice-badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    background-color: #ef4444;
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 0.25rem;
    margin-bottom: 0.5rem;
  }
  
  .notice-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
    line-height: 1.5;
  }
  
  .notice-excerpt {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 0.75rem;
    line-height: 1.5;
  }
  
  .notice-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.75rem;
    color: #9ca3af;
  }
  
  .notice-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
  }
  
  /* 이벤트 스타일 */
  .event-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  .event-card {
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 0.5rem;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    border: 1px solid #e5e7eb;
    transition: all 0.2s;
  }
  
  .event-card:hover {
    border-color: #d1d5db;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transform: translateY(-4px);
  }
  
  .event-image {
    width: 100%;
    height: 200px;
    background-color: #f3f4f6;
    background-size: cover;
    background-position: center;
  }
  
  .event-content {
    padding: 1.5rem;
  }
  
  .event-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 0.75rem 0;
    line-height: 1.5;
  }
  
  .event-period {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
  }
  
  .event-status {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: 0.25rem;
    background-color: #5ce0c6; /* 민트색 */
    color: white;
  }
  
  @media (max-width: 768px) {
    .tab-button {
      padding: 0.75rem 1rem;
    }
    
    .event-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
