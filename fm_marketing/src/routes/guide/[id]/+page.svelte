<!-- src/routes/guide/[id]/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { guideStore } from '$lib/stores/guideStore.js';
  import MainLayout from '$lib/components/layout/MainLayout.svelte';
  
  // 가이드 데이터
  let guide = null;
  let loading = true;
  let error = null;
  
  // 날짜 포맷팅 함수
  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  }
  
  // 가이드 데이터 로드
  async function loadGuide() {
    loading = true;
    error = null;
    
    try {
      const guideId = $page.params.id;
      const data = await guideStore.getGuideById(parseInt(guideId));
      
      if (data) {
        guide = data;
      } else {
        error = '가이드를 찾을 수 없습니다.';
      }
    } catch (e) {
      error = '가이드를 불러오는 중 오류가 발생했습니다.';
      console.error(e);
    } finally {
      loading = false;
    }
  }
  
  // 컴포넌트 마운트 시 초기 데이터 로드
  onMount(() => {
    loadGuide();
  });
</script>

<svelte:head>
  <title>{guide ? guide.title : '이용가이드'} - FM마케팅</title>
  <meta name="description" content={guide ? guide.title + ' - FM마케팅 이용가이드' : '이용가이드 상세 정보'} />
</svelte:head>

<MainLayout>
  <div class="guide-detail-container">
    {#if loading}
      <div class="loading-state">
        <p>가이드를 불러오는 중입니다...</p>
      </div>
    {:else if error}
      <div class="error-state">
        <p>{error}</p>
        <a href="/guide" class="back-link">가이드 목록으로 돌아가기</a>
      </div>
    {:else if guide}
      <div class="guide-detail">
        <div class="guide-header">
          <div class="guide-category">{guide.category}</div>
          <h1 class="guide-title">{guide.title}</h1>
          <div class="guide-meta">
            <span class="guide-date">작성일: {formatDate(guide.createdAt)}</span>
          </div>
        </div>
        
        <div class="guide-content">
          <!-- HTML 내용을 안전하게 렌더링 -->
          {@html guide.content}
        </div>
        
        <div class="guide-footer">
          <a href="/guide" class="back-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            가이드 목록으로 돌아가기
          </a>
        </div>
      </div>
      
      <!-- 자주 묻는 질문 -->
      <div class="related-faqs">
        <h2 class="related-title">자주 묻는 질문</h2>
        
        <div class="faq-list">
          <div class="faq-item">
            <div class="faq-question">
              <span class="question-marker">Q.</span>
              <span class="question-text">체험단 신청은 어떻게 하나요?</span>
            </div>
            <div class="faq-answer">
              <span class="answer-marker">A.</span>
              <span class="answer-text">메인 페이지나 체험단 검색 메뉴에서 원하는 체험단을 찾아 상세 페이지로 이동한 후 '신청하기' 버튼을 클릭하여 신청할 수 있습니다. 신청 시 신청 이유와 SNS 정보 등을 상세하게 작성하면 선정 확률이 높아집니다.</span>
            </div>
          </div>
          
          <div class="faq-item">
            <div class="faq-question">
              <span class="question-marker">Q.</span>
              <span class="question-text">체험단 활동 후 인증은 어떻게 하나요?</span>
            </div>
            <div class="faq-answer">
              <span class="answer-marker">A.</span>
              <span class="answer-text">체험 완료 후 지정된 플랫폼(블로그, 인스타그램 등)에 리뷰를 작성한 다음, 마이페이지 > 체험단 활동 > 해당 체험단 항목에서 '인증하기' 버튼을 클릭하여 리뷰 URL을 등록하면 됩니다.</span>
            </div>
          </div>
          
          <div class="faq-item">
            <div class="faq-question">
              <span class="question-marker">Q.</span>
              <span class="question-text">포인트는 어떻게 적립되나요?</span>
            </div>
            <div class="faq-answer">
              <span class="answer-marker">A.</span>
              <span class="answer-text">회원가입, 로그인, 체험단 활동 완료, 커뮤니티 활동 등 다양한 방법으로 포인트를 적립할 수 있습니다. 적립된 포인트는 마이페이지 > 포인트 내역에서 확인할 수 있습니다.</span>
            </div>
          </div>
        </div>
        
        <div class="view-more-faqs">
          <a href="/guide?tab=faqs" class="view-more-link">자주 묻는 질문 더보기</a>
        </div>
      </div>
      
      <!-- 관련 가이드 -->
      <div class="related-guides">
        <h2 class="related-title">관련 가이드</h2>
        
        <div class="related-grid">
          <a href="/guide/2" class="related-card">
            <div class="related-image" style="background-image: url('/images/guides/verification_guide.jpg')"></div>
            <div class="related-content">
              <span class="related-category">기본 가이드</span>
              <h3 class="related-guide-title">체험단 활동 인증 방법</h3>
            </div>
          </a>
          
          <a href="/guide/3" class="related-card">
            <div class="related-image" style="background-image: url('/images/guides/point_guide.jpg')"></div>
            <div class="related-content">
              <span class="related-category">포인트/결제</span>
              <h3 class="related-guide-title">포인트 적립 및 사용 안내</h3>
            </div>
          </a>
        </div>
      </div>
    {/if}
  </div>
</MainLayout>

<style>
  .guide-detail-container {
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
  
  .guide-detail {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    margin-bottom: 2rem;
  }
  
  .guide-header {
    padding: 2rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .guide-category {
    display: inline-block;
    font-size: 0.75rem;
    color: #4c96d7;
    margin-bottom: 0.5rem;
  }
  
  .guide-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 1rem 0;
    line-height: 1.5;
  }
  
  .guide-meta {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .guide-content {
    padding: 2rem;
    color: #4b5563;
    font-size: 0.875rem;
    line-height: 1.6;
  }
  
  .guide-content h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin: 2rem 0 1rem 0;
  }
  
  .guide-content h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin: 1.5rem 0 0.75rem 0;
  }
  
  .guide-content p {
    margin-bottom: 1rem;
  }
  
  .guide-content ul, .guide-content ol {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }
  
  .guide-content li {
    margin-bottom: 0.5rem;
  }
  
  .guide-footer {
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
  
  .related-faqs, .related-guides {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .related-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 1rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .faq-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .faq-item {
    background-color: #f9fafb;
    border-radius: 0.375rem;
    padding: 1.25rem;
  }
  
  .faq-question {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }
  
  .question-marker {
    font-weight: 600;
    color: #4c96d7;
    flex-shrink: 0;
  }
  
  .question-text {
    font-weight: 500;
    color: #1f2937;
  }
  
  .faq-answer {
    display: flex;
    gap: 0.75rem;
  }
  
  .answer-marker {
    font-weight: 600;
    color: #10b981;
    flex-shrink: 0;
  }
  
  .answer-text {
    font-size: 0.875rem;
    color: #4b5563;
    line-height: 1.5;
  }
  
  .view-more-faqs {
    text-align: center;
    margin-top: 1.5rem;
  }
  
  .view-more-link {
    display: inline-block;
    padding: 0.5rem 1rem;
    background-color: #f3f4f6;
    border-radius: 0.375rem;
    color: #4b5563;
    font-size: 0.875rem;
    text-decoration: none;
    transition: all 0.2s;
  }
  
  .view-more-link:hover {
    background-color: #e5e7eb;
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
  
  .related-category {
    display: block;
    font-size: 0.75rem;
    color: #4c96d7;
    margin-bottom: 0.25rem;
  }
  
  .related-guide-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
    line-height: 1.5;
  }
  
  @media (max-width: 640px) {
    .guide-header, .guide-content, .guide-footer {
      padding: 1.5rem;
    }
    
    .guide-title {
      font-size: 1.25rem;
    }
    
    .related-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
