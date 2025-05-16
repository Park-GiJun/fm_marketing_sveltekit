<!-- src/routes/checklist/[id]/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { reviewStore } from '$lib/stores/reviewStore.js';
  import { userStore } from '$lib/stores/userStore.js';
  import MainLayout from '$lib/components/layout/MainLayout.svelte';
  import Button from '$lib/components/common/Button.svelte';
  import Badge from '$lib/components/common/Badge.svelte';

  // 리뷰 데이터
  let review = null;
  let loading = true;
  let error = null;
  
  // 사용자 인증 상태
  let isAuthenticated = false;
  
  // 신청 상태
  let isApplying = false;
  let alreadyApplied = false;
  
  // 기본 이미지 슬라이더 상태
  let currentImageIndex = 0;
  
  // 다음/이전 이미지 핸들러
  function nextImage() {
    if (review && review.images && review.images.length > 0) {
      currentImageIndex = (currentImageIndex + 1) % review.images.length;
    }
  }
  
  function prevImage() {
    if (review && review.images && review.images.length > 0) {
      currentImageIndex = (currentImageIndex - 1 + review.images.length) % review.images.length;
    }
  }
  
  // 체험단 신청 핸들러
  async function handleApply() {
    if (!isAuthenticated) {
      // 로그인 페이지로 이동
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }
    
    isApplying = true;
    
    // 실제로는 API 호출이 필요하지만 더미 데이터 사용
    setTimeout(() => {
      alreadyApplied = true;
      isApplying = false;
      
      // 신청자 수 증가
      if (review) {
        review.views += 1;
      }
    }, 1000);
  }
  
  // 날짜 포맷팅 함수
  function formatDate(days) {
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + days);
    
    return `${targetDate.getFullYear()}.${targetDate.getMonth() + 1}.${targetDate.getDate()}`;
  }
  
  // 리뷰 데이터 로드
  async function loadReview() {
    loading = true;
    error = null;
    
    try {
      const reviewId = $page.params.id;
      const data = await reviewStore.getReviewById(reviewId);
      
      if (data) {
        review = data;
        // 더미 데이터 - 랜덤으로 신청 여부 결정
        alreadyApplied = Math.random() > 0.7;
      } else {
        error = '체험단 정보를 찾을 수 없습니다.';
      }
    } catch (e) {
      error = '체험단 정보를 불러오는 중 오류가 발생했습니다.';
      console.error(e);
    } finally {
      loading = false;
    }
  }
  
  // 컴포넌트 마운트 시 초기 데이터 로드
  onMount(() => {
    // 사용자 인증 상태 확인
    const unsubscribeUser = userStore.subscribe(state => {
      isAuthenticated = state.isAuthenticated;
    });
    
    // 리뷰 데이터 로드
    loadReview();
    
    return () => {
      unsubscribeUser();
    };
  });
</script>

<svelte:head>
  <title>{review ? review.title : '체험단 상세'} - FM마케팅</title>
  <meta name="description" content={review ? review.content.substring(0, 150) : '체험단 상세 정보'} />
</svelte:head>

<MainLayout>
  <div class="checklist-detail-container">
    {#if loading}
      <div class="loading-state">
        <p>체험단 정보를 불러오는 중입니다...</p>
      </div>
    {:else if error}
      <div class="error-state">
        <p>{error}</p>
        <a href="/checklist" class="back-link">체험단 목록으로 돌아가기</a>
      </div>
    {:else if review}
      <div class="checklist-detail">
        <div class="detail-header">
          <div class="detail-badges">
            <Badge type={review.isPromoted ? 'premium' : 'review'} size="md">
              {review.type}
            </Badge>
            
            {#if review.daysAgo <= 3}
              <Badge type="primary" size="md">신규</Badge>
            {/if}
            
            {#if review.views > 100}
              <Badge type="success" size="md">인기</Badge>
            {/if}
          </div>
          
          <h1 class="detail-title">{review.title}</h1>
          
          <div class="detail-meta">
            <div class="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>모집기간: {formatDate(0)} ~ {formatDate(review.daysAgo + 7)}</span>
            </div>
            
            <div class="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>신청자: {review.views}명</span>
            </div>
            
            <div class="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span>좋아요: {review.likes}</span>
            </div>
          </div>
        </div>
        
        <div class="detail-content">
          <div class="content-main">
            <!-- 이미지 슬라이더 -->
            <div class="image-slider">
              {#if review.images && review.images.length > 0}
                <div class="slider-container">
                  <div class="slider-image" style="background-image: url({review.images[currentImageIndex] || '/images/default-image.jpg'})"></div>
                  
                  <button class="slider-arrow prev" on:click={prevImage}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                  
                  <button class="slider-arrow next" on:click={nextImage}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                  
                  {#if review.images.length > 1}
                    <div class="slider-dots">
                      {#each review.images as _, index}
                        <span 
                          class="dot {currentImageIndex === index ? 'active' : ''}" 
                          on:click={() => currentImageIndex = index}
                        ></span>
                      {/each}
                    </div>
                  {/if}
                </div>
              {:else}
                <div class="no-image">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  <p>이미지 준비 중입니다</p>
                </div>
              {/if}
            </div>
            
            <!-- 체험단 설명 내용 -->
            <div class="description-section">
              <h2 class="section-title">체험단 소개</h2>
              <div class="description-content">
                <p>{review.content || '이 체험단에 대한 상세 설명입니다. (더미 데이터)'}</p>
                <p>체험단에 참여하시면 무료로 상품 또는 서비스를 체험하고, 블로그나 SNS에 솔직한 후기를 작성해주시면 됩니다. 정성스러운 리뷰를 작성해주신 분들께는 추가 포인트가 지급됩니다.</p>
              </div>
            </div>
            
            <!-- 체험단 정보 -->
            <div class="info-section">
              <h2 class="section-title">체험 정보</h2>
              <div class="info-grid">
                <div class="info-item">
                  <h3 class="info-title">체험 장소</h3>
                  <p class="info-content">서울특별시 강남구 테헤란로 123</p>
                </div>
                
                <div class="info-item">
                  <h3 class="info-title">체험 기간</h3>
                  <p class="info-content">{formatDate(review.daysAgo + 8)} ~ {formatDate(review.daysAgo + 22)}</p>
                </div>
                
                <div class="info-item">
                  <h3 class="info-title">모집 인원</h3>
                  <p class="info-content">10명</p>
                </div>
                
                <div class="info-item">
                  <h3 class="info-title">제공 혜택</h3>
                  <p class="info-content">5만원 상당 식사권</p>
                </div>
                
                <div class="info-item">
                  <h3 class="info-title">미션 플랫폼</h3>
                  <p class="info-content">블로그, 인스타그램</p>
                </div>
                
                <div class="info-item">
                  <h3 class="info-title">지역</h3>
                  <p class="info-content">{review.region || '서울'}</p>
                </div>
              </div>
            </div>
            
            <!-- 참여 방법 -->
            <div class="how-to-section">
              <h2 class="section-title">참여 방법</h2>
              <div class="steps">
                <div class="step">
                  <div class="step-number">1</div>
                  <div class="step-content">
                    <h3 class="step-title">신청하기</h3>
                    <p class="step-description">체험단 신청 버튼을 클릭하여 지원서를 작성해주세요.</p>
                  </div>
                </div>
                
                <div class="step">
                  <div class="step-number">2</div>
                  <div class="step-content">
                    <h3 class="step-title">선정 확인</h3>
                    <p class="step-description">신청 마감 후 3일 이내에 선정 결과를 알려드립니다.</p>
                  </div>
                </div>
                
                <div class="step">
                  <div class="step-number">3</div>
                  <div class="step-content">
                    <h3 class="step-title">체험하기</h3>
                    <p class="step-description">제공된 정보에 따라 지정된 기간 내 체험을 진행해주세요.</p>
                  </div>
                </div>
                
                <div class="step">
                  <div class="step-number">4</div>
                  <div class="step-content">
                    <h3 class="step-title">리뷰 작성</h3>
                    <p class="step-description">체험 후 48시간 내에 솔직한 리뷰를 작성해주세요.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="content-sidebar">
            <div class="sidebar-card">
              <h3 class="card-title">체험단 신청</h3>
              
              <div class="card-info">
                <div class="info-row">
                  <span class="info-label">모집 마감일</span>
                  <span class="info-value">{formatDate(review.daysAgo + 7)}</span>
                </div>
                
                <div class="info-row">
                  <span class="info-label">남은 기간</span>
                  <span class="info-value highlight">{review.daysAgo}일</span>
                </div>
                
                <div class="info-row">
                  <span class="info-label">참여 비용</span>
                  <span class="info-value">
                    {#if review.isPromoted}
                      <del class="original-price">500,000 P</del>
                      <span class="discounted-price">120,000 P</span>
                    {:else}
                      <span>무료</span>
                    {/if}
                  </span>
                </div>
              </div>
              
              <div class="card-actions">
                {#if alreadyApplied}
                  <Button variant="secondary" size="lg" fullWidth={true} disabled={true}>
                    신청 완료
                  </Button>
                  <p class="application-note">이미 신청한 체험단입니다.</p>
                {:else if review.daysAgo <= 0}
                  <Button variant="secondary" size="lg" fullWidth={true} disabled={true}>
                    모집 마감
                  </Button>
                  <p class="application-note">체험단 모집이 마감되었습니다.</p>
                {:else}
                  <Button 
                    variant="primary" 
                    size="lg" 
                    fullWidth={true} 
                    disabled={isApplying}
                    on:click={handleApply}
                  >
                    {isApplying ? '신청 중...' : '체험단 신청하기'}
                  </Button>
                  <p class="application-note">신청 시 본인 정보를 정확히 입력해주세요.</p>
                {/if}
              </div>
            </div>
            
            <div class="sidebar-card">
              <h3 class="card-title">문의 정보</h3>
              
              <div class="contact-info">
                <div class="contact-item">
                  <span class="contact-label">담당자</span>
                  <span class="contact-value">FM마케팅 체험단 담당자</span>
                </div>
                
                <div class="contact-item">
                  <span class="contact-label">이메일</span>
                  <span class="contact-value">experience@fmmarketing.com</span>
                </div>
                
                <div class="contact-item">
                  <span class="contact-label">연락처</span>
                  <span class="contact-value">02-123-4567</span>
                </div>
              </div>
            </div>
            
            <div class="sidebar-card">
              <h3 class="card-title">체험단 태그</h3>
              
              <div class="tag-cloud">
                {#if review.tags && review.tags.length > 0}
                  {#each review.tags as tag}
                    <a href={`/checklist?tag=${tag}`} class="tag">#{tag}</a>
                  {/each}
                {:else}
                  <span class="no-tags">등록된 태그가 없습니다.</span>
                {/if}
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</MainLayout>

<style>
  .checklist-detail-container {
    width: 100%;
    max-width: 1200px;
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
  
  .checklist-detail {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .detail-header {
    padding: 2rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .detail-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .detail-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 1rem 0;
    line-height: 1.5;
  }
  
  .detail-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .detail-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
    padding: 2rem;
  }
  
  /* 이미지 슬라이더 */
  .image-slider {
    margin-bottom: 2rem;
  }
  
  .slider-container {
    position: relative;
    border-radius: 0.5rem;
    overflow: hidden;
  }
  
  .slider-image {
    width: 100%;
    height: 400px;
    background-color: #f3f4f6;
    background-size: cover;
    background-position: center;
  }
  
  .slider-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(255, 255, 255, 0.8);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #4b5563;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .slider-arrow.prev {
    left: 1rem;
  }
  
  .slider-arrow.next {
    right: 1rem;
  }
  
  .slider-dots {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.5rem;
  }
  
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
  }
  
  .dot.active {
    background-color: white;
  }
  
  .no-image {
    width: 100%;
    height: 300px;
    background-color: #f3f4f6;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
    border-radius: 0.5rem;
    border: 2px dashed #e5e7eb;
  }
  
  .no-image svg {
    margin-bottom: 1rem;
    opacity: 0.6;
  }
  
  .no-image p {
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  /* 섹션 스타일 */
  .section-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 1rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .description-section, .info-section, .how-to-section {
    margin-bottom: 2rem;
  }
  
  .description-content {
    font-size: 0.875rem;
    color: #4b5563;
    line-height: 1.6;
  }
  
  .description-content p {
    margin-bottom: 1rem;
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .info-item {
    background-color: #f9fafb;
    padding: 1rem;
    border-radius: 0.375rem;
  }
  
  .info-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #4b5563;
    margin: 0 0 0.5rem 0;
  }
  
  .info-content {
    font-size: 0.875rem;
    color: #1f2937;
  }
  
  .steps {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .step {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .step-number {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background-color: #4c96d7;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    flex-shrink: 0;
  }
  
  .step-title {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 0.25rem 0;
  }
  
  .step-description {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  /* 사이드바 */
  .sidebar-card {
    background-color: #f9fafb;
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .card-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 1rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .card-info {
    margin-bottom: 1.5rem;
  }
  
  .card-actions {
    margin-bottom: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .info-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.75rem;
    font-size: 0.875rem;
  }
  
  .info-label {
    color: #6b7280;
  }
  
  .info-value {
    font-weight: 500;
    color: #1f2937;
  }
  
  .info-value.highlight {
    color: #4c96d7;
    font-weight: 600;
  }
  
  .original-price {
    font-size: 0.75rem;
    color: #9ca3af;
    text-decoration: line-through;
    margin-right: 0.5rem;
  }
  
  .discounted-price {
    color: #4c96d7;
    font-weight: 600;
  }
  
  .application-note {
    font-size: 0.75rem;
    color: #6b7280;
    text-align: center;
    margin-top: 0.5rem;
    background-color: #f3f4f6;
    padding: 0.5rem;
    border-radius: 0.25rem;
  }
  
  .contact-info {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .contact-item {
    display: flex;
    flex-direction: column;
    font-size: 0.875rem;
  }
  
  .contact-label {
    color: #6b7280;
    margin-bottom: 0.25rem;
  }
  
  .contact-value {
    color: #1f2937;
  }
  
  .tag-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .tag {
    font-size: 0.75rem;
    color: #4c96d7;
    background-color: #e1f0ff;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    text-decoration: none;
  }
  
  .tag:hover {
    background-color: #c7e2ff;
  }
  
  .no-tags {
    font-size: 0.875rem;
    color: #9ca3af;
  }
  
  @media (max-width: 768px) {
    .detail-content {
      grid-template-columns: 1fr;
    }
    
    .slider-image {
      height: 250px;
    }
    
    .info-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
