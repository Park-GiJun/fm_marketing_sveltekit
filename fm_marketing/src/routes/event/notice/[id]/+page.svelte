<!-- src/routes/event/notice/[id]/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { eventStore } from '$lib/stores/eventStore.js';
  import MainLayout from '$lib/components/layout/MainLayout.svelte';
  
  // 공지사항 데이터
  let notice = null;
  let loading = true;
  let error = null;
  
  // 날짜 포맷팅 함수
  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  }
  
  // 공지사항 데이터 로드
  async function loadNotice() {
    loading = true;
    error = null;
    
    try {
      const noticeId = $page.params.id;
      const data = await eventStore.getNoticeById(parseInt(noticeId));
      
      if (data) {
        notice = data;
      } else {
        error = '공지사항을 찾을 수 없습니다.';
      }
    } catch (e) {
      error = '공지사항을 불러오는 중 오류가 발생했습니다.';
      console.error(e);
    } finally {
      loading = false;
    }
  }
  
  // 컴포넌트 마운트 시 초기 데이터 로드
  onMount(() => {
    loadNotice();
  });
</script>

<svelte:head>
  <title>{notice ? notice.title : '공지사항'} - FM마케팅</title>
  <meta name="description" content={notice ? notice.content.substring(0, 150) : '공지사항 상세 정보'} />
</svelte:head>

<MainLayout>
  <div class="notice-detail-container">
    {#if loading}
      <div class="loading-state">
        <p>공지사항을 불러오는 중입니다...</p>
      </div>
    {:else if error}
      <div class="error-state">
        <p>{error}</p>
        <a href="/event" class="back-link">공지사항 목록으로 돌아가기</a>
      </div>
    {:else if notice}
      <div class="notice-detail">
        <div class="notice-header">
          {#if notice.isImportant}
            <div class="notice-badge">중요</div>
          {/if}
          <h1 class="notice-title">{notice.title}</h1>
          <div class="notice-meta">
            <span class="notice-category">{notice.category}</span>
            <span class="meta-divider">|</span>
            <span class="notice-date">{formatDate(notice.createdAt)}</span>
          </div>
        </div>
        
        <div class="notice-content">
          <p>{notice.content}</p>
        </div>
        
        <div class="notice-footer">
          <a href="/event" class="back-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            목록으로 돌아가기
          </a>
        </div>
      </div>
      
      <!-- 관련 공지사항 -->
      <div class="related-notices">
        <h2 class="related-title">다른 공지사항</h2>
        
        <div class="related-list">
          <a href="/event/notice/2" class="related-item">
            <div class="related-content">
              <h3 class="related-notice-title">개인정보처리방침 변경 안내</h3>
              <div class="related-meta">
                <span class="related-category">공지</span>
                <span class="meta-divider">|</span>
                <span class="related-date">2025.05.14</span>
              </div>
            </div>
            <div class="related-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </a>
          
          <a href="/event/notice/3" class="related-item">
            <div class="related-content">
              <h3 class="related-notice-title">5월 우수 체험단 발표</h3>
              <div class="related-meta">
                <span class="related-category">공지</span>
                <span class="meta-divider">|</span>
                <span class="related-date">2025.05.31</span>
              </div>
            </div>
            <div class="related-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </a>
          
          <a href="/event/notice/4" class="related-item">
            <div class="related-content">
              <h3 class="related-notice-title">체험단 신청 방법 안내</h3>
              <div class="related-meta">
                <span class="related-category">안내</span>
                <span class="meta-divider">|</span>
                <span class="related-date">2025.05.10</span>
              </div>
            </div>
            <div class="related-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </a>
        </div>
      </div>
    {/if}
  </div>
</MainLayout>

<style>
  .notice-detail-container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
  }
  
  .loading-state, .error-state {
    padding: 3rem 0;
    text-align: center;
    color: #6b7280;
  }
  
  .back-link {
    display: inline-block;
    margin-top: 1rem;
    color: #4c96d7;
    text-decoration: none;
  }
  
  .back-link:hover {
    text-decoration: underline;
  }
  
  .notice-detail {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    margin-bottom: 2rem;
  }
  
  .notice-header {
    padding: 2rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .notice-badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    background-color: #ef4444;
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 0.25rem;
    margin-bottom: 1rem;
  }
  
  .notice-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 1rem 0;
    line-height: 1.5;
  }
  
  .notice-meta {
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .meta-divider {
    margin: 0 0.5rem;
    color: #e5e7eb;
  }
  
  .notice-content {
    padding: 2rem;
    min-height: 200px;
    color: #4b5563;
    font-size: 0.875rem;
    line-height: 1.6;
  }
  
  .notice-content p {
    margin-bottom: 1rem;
  }
  
  .notice-footer {
    padding: 1.5rem 2rem;
    border-top: 1px solid #e5e7eb;
    text-align: center;
  }
  
  .back-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #6b7280;
    text-decoration: none;
    font-size: 0.875rem;
    transition: color 0.2s;
  }
  
  .back-button:hover {
    color: #4b5563;
  }
  
  .related-notices {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
  }
  
  .related-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 1rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .related-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .related-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #f9fafb;
    border-radius: 0.375rem;
    text-decoration: none;
    color: inherit;
    transition: background-color 0.2s;
  }
  
  .related-item:hover {
    background-color: #f3f4f6;
  }
  
  .related-content {
    flex: 1;
  }
  
  .related-notice-title {
    font-size: 1rem;
    font-weight: 500;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
  }
  
  .related-meta {
    font-size: 0.75rem;
    color: #6b7280;
  }
  
  .related-arrow {
    color: #9ca3af;
  }
  
  @media (max-width: 640px) {
    .notice-header, .notice-content, .notice-footer {
      padding: 1.5rem;
    }
    
    .notice-title {
      font-size: 1.25rem;
    }
  }
</style>
