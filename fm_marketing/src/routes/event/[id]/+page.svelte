<!-- src/routes/event/[id]/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { eventStore } from '$lib/stores/eventStore.js';
  import MainLayout from '$lib/components/layout/MainLayout.svelte';
  import Button from '$lib/components/common/Button.svelte';
  
  // 이벤트 데이터
  let event = null;
  let loading = true;
  let error = null;
  
  // 이벤트 참여 상태
  let isParticipating = false;
  let alreadyParticipated = false;
  
  // 날짜 포맷팅 함수
  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  }
  
  // 이벤트 활성 상태 확인
  function isEventActive(event) {
    if (!event) return false;
    
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    
    return now >= startDate && now <= endDate;
  }
  
  // 이벤트 참여 핸들러
  function handleParticipation() {
    isParticipating = true;
    
    // 실제로는 API 호출이 필요하지만 더미 데이터 사용
    setTimeout(() => {
      alreadyParticipated = true;
      isParticipating = false;
    }, 1000);
  }
  
  // 이벤트 데이터 로드
  async function loadEvent() {
    loading = true;
    error = null;
    
    try {
      const eventId = $page.params.id;
      const data = await eventStore.getEventById(parseInt(eventId));
      
      if (data) {
        event = data;
        
        // 더미 데이터 - 랜덤으로 참여 여부 결정
        alreadyParticipated = Math.random() > 0.7;
      } else {
        error = '이벤트를 찾을 수 없습니다.';
      }
    } catch (e) {
      error = '이벤트를 불러오는 중 오류가 발생했습니다.';
      console.error(e);
    } finally {
      loading = false;
    }
  }
  
  // 컴포넌트 마운트 시 초기 데이터 로드
  onMount(() => {
    loadEvent();
  });
</script>

<svelte:head>
  <title>{event ? event.title : '이벤트'} - FM마케팅</title>
  <meta name="description" content={event ? event.content.substring(0, 150) : '이벤트 상세 정보'} />
</svelte:head>

<MainLayout>
  <div class="event-detail-container">
    {#if loading}
      <div class="loading-state">
        <p>이벤트를 불러오는 중입니다...</p>
      </div>
    {:else if error}
      <div class="error-state">
        <p>{error}</p>
        <a href="/event" class="back-link">이벤트 목록으로 돌아가기</a>
      </div>
    {:else if event}
      <div class="event-detail">
        <div class="event-header">
          <h1 class="event-title">{event.title}</h1>
          
          <div class="event-meta">
            <div class="event-period">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>{formatDate(event.startDate)} ~ {formatDate(event.endDate)}</span>
            </div>
            
            <div class="event-status-badge {isEventActive(event) ? 'active' : 'inactive'}">
              {isEventActive(event) ? '진행중' : '종료됨'}
            </div>
          </div>
        </div>
        
        <div class="event-content">
          <div class="event-image" style="background-image: url({event.imageUrl || '/images/events/default-event.jpg'})"></div>
          
          <div class="event-description">
            <p>{event.content}</p>
          </div>
          
          {#if isEventActive(event)}
            <div class="event-participation">
              <h2 class="participation-title">이벤트 참여하기</h2>
              
              <div class="participation-form">
                {#if alreadyParticipated}
                  <div class="participation-message success">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <p>이미 참여한 이벤트입니다. 결과 발표를 기다려주세요!</p>
                  </div>
                {:else}
                  <div class="form-description">
                    <p>아래 버튼을 클릭하여 이벤트에 참여하세요. 참여 시 추가 정보 입력이 필요할 수 있습니다.</p>
                  </div>
                  
                  <div class="form-action">
                    <Button 
                      variant="primary" 
                      size="lg" 
                      disabled={isParticipating}
                      on:click={handleParticipation}
                    >
                      {isParticipating ? '참여 중...' : '이벤트 참여하기'}
                    </Button>
                  </div>
                {/if}
              </div>
            </div>
          {:else}
            <div class="event-ended">
              <div class="ended-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <p>이 이벤트는 종료되었습니다. 다음 이벤트를 기대해주세요!</p>
              </div>
            </div>
          {/if}
        </div>
        
        <div class="event-footer">
          <a href="/event" class="back-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            목록으로 돌아가기
          </a>
        </div>
      </div>
      
      <!-- 관련 이벤트 -->
      <div class="related-events">
        <h2 class="related-title">다른 이벤트</h2>
        
        <div class="related-grid">
          <a href="/event/2" class="related-card">
            <div class="related-image" style="background-image: url('/images/events/welcome_points.jpg')"></div>
            <div class="related-content">
              <h3 class="related-event-title">신규 가입자 웰컴 포인트 2배 증정</h3>
              <p class="related-period">2025.06.01 ~ 2025.06.30</p>
              <span class="related-status active">진행중</span>
            </div>
          </a>
          
          <a href="/event/3" class="related-card">
            <div class="related-image" style="background-image: url('/images/events/review_event.jpg')"></div>
            <div class="related-content">
              <h3 class="related-event-title">리뷰 작성 이벤트</h3>
              <p class="related-period">2025.05.15 ~ 2025.06.15</p>
              <span class="related-status active">진행중</span>
            </div>
          </a>
        </div>
      </div>
    {/if}
  </div>
</MainLayout>

<style>
  .event-detail-container {
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
  
  .event-detail {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    margin-bottom: 2rem;
  }
  
  .event-header {
    padding: 2rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .event-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 1rem 0;
    line-height: 1.5;
  }
  
  .event-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .event-period {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .event-status-badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: 0.25rem;
  }
  
  .event-status-badge.active {
    background-color: #10b981;
    color: white;
  }
  
  .event-status-badge.inactive {
    background-color: #6b7280;
    color: white;
  }
  
  .event-content {
    padding: 2rem;
  }
  
  .event-image {
    width: 100%;
    height: 300px;
    background-color: #f3f4f6;
    background-size: cover;
    background-position: center;
    border-radius: 0.5rem;
    margin-bottom: 1.5rem;
  }
  
  .event-description {
    color: #4b5563;
    font-size: 0.875rem;
    line-height: 1.6;
    margin-bottom: 2rem;
  }
  
  .event-description p {
    margin-bottom: 1rem;
  }
  
  .event-participation {
    background-color: #f9fafb;
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .participation-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 1rem 0;
  }
  
  .participation-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .form-description {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .form-action {
    display: flex;
    justify-content: center;
  }
  
  .participation-message {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    border-radius: 0.375rem;
  }
  
  .participation-message.success {
    background-color: #ecfdf5;
    color: #10b981;
  }
  
  .participation-message p {
    font-size: 0.875rem;
    margin: 0;
  }
  
  .event-ended {
    background-color: #f9fafb;
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .ended-message {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #6b7280;
  }
  
  .ended-message p {
    font-size: 0.875rem;
    margin: 0;
  }
  
  .event-footer {
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
  
  .related-events {
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
  
  .related-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .related-card {
    display: flex;
    flex-direction: column;
    background-color: #f9fafb;
    border-radius: 0.375rem;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .related-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }
  
  .related-image {
    width: 100%;
    height: 120px;
    background-color: #f3f4f6;
    background-size: cover;
    background-position: center;
  }
  
  .related-content {
    padding: 1rem;
  }
  
  .related-event-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
    line-height: 1.5;
  }
  
  .related-period {
    font-size: 0.75rem;
    color: #6b7280;
    margin: 0 0 0.5rem 0;
  }
  
  .related-status {
    display: inline-block;
    padding: 0.125rem 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: 0.25rem;
  }
  
  .related-status.active {
    background-color: #10b981;
    color: white;
  }
  
  .related-status.inactive {
    background-color: #6b7280;
    color: white;
  }
  
  @media (max-width: 640px) {
    .event-header, .event-content, .event-footer {
      padding: 1.5rem;
    }
    
    .event-title {
      font-size: 1.25rem;
    }
    
    .event-image {
      height: 200px;
    }
    
    .related-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
