<!-- src/routes/review/[id]/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { reviewStore } from '$lib/stores/reviewStore.js';
  import { userStore } from '$lib/stores/userStore.js';
  import MainLayout from '$lib/components/layout/MainLayout.svelte';
  import Button from '$lib/components/common/Button.svelte';
  import Badge from '$lib/components/common/Badge.svelte';
  import ImageGallery from '$lib/components/common/ImageGallery.svelte';
  import { formatKoreanDate, getRelativeTime } from '$lib/utils/date.js';
  
  // 상태 변수
  let review = null;
  let loading = true;
  let error = null;
  let isAuthenticated = false;
  let isLiked = false;
  
  // 관련 리뷰
  let relatedReviews = [];
  
  // 날짜 포맷팅
  function formatDate(dateString) {
    if (!dateString) return '';
    return formatKoreanDate(dateString);
  }
  
  // 좋아요 토글
  async function toggleLike() {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      return;
    }
    
    isLiked = !isLiked;
    review.likes += isLiked ? 1 : -1;
    
    // 실제로는 API 호출
    // await reviewApi.likeReview(review.id);
  }
  
  // 공유하기
  function shareReview() {
    if (navigator.share) {
      navigator.share({
        title: review.title,
        text: review.content.substring(0, 100) + '...',
        url: window.location.href
      });
    } else {
      // 링크 복사
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('링크가 클립보드에 복사되었습니다.');
      });
    }
  }
  
  // 신고하기
  function reportReview() {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      return;
    }
    
    if (confirm('이 리뷰를 신고하시겠습니까?')) {
      alert('신고가 접수되었습니다. 검토 후 조치하겠습니다.');
    }
  }
  
  // 리뷰 데이터 로드
  async function loadReview() {
    loading = true;
    error = null;
    
    try {
      const reviewId = $page.params.id;
      const data = await reviewStore.getReviewById(reviewId);
      
      if (data) {
        review = {
          ...data,
          author: {
            id: 1,
            name: '체험러버',
            profileImage: '/images/avatars/user1.jpg',
            level: '골드',
            reviewCount: 24
          },
          createdAt: '2025-05-20T14:30:00',
          location: '서울특별시 강남구',
          category: '맛집',
          rating: 4.5,
          visitDate: '2025-05-18',
          pros: ['음식이 정말 맛있어요', '분위기가 좋아요', '서비스가 친절해요'],
          cons: ['가격이 조금 비싸요', '주차가 어려워요'],
          recommendations: '커플, 가족 모임에 추천해요'
        };
        
        // 관련 리뷰 로드
        await loadRelatedReviews();
      } else {
        error = '리뷰를 찾을 수 없습니다.';
      }
    } catch (e) {
      error = '리뷰를 불러오는 중 오류가 발생했습니다.';
      console.error(e);
    } finally {
      loading = false;
    }
  }
  
  // 관련 리뷰 로드
  async function loadRelatedReviews() {
    const allReviews = await reviewStore.getReviewById('dummy-1');
    relatedReviews = Array.from({ length: 4 }, (_, i) => ({
      id: `related-${i + 1}`,
      title: `관련 체험단 ${i + 1}`,
      category: review.category,
      rating: 4.0 + Math.random(),
      thumbnail: `/images/reviews/related-${i + 1}.jpg`,
      author: `체험러${i + 1}`
    }));
  }
  
  onMount(() => {
    // 사용자 인증 상태 확인
    const unsubscribeUser = userStore.subscribe(state => {
      isAuthenticated = state.isAuthenticated;
    });
    
    loadReview();
    
    return () => {
      unsubscribeUser();
    };
  });
</script>

<svelte:head>
  <title>{review ? review.title : '리뷰 상세'} - FM마케팅</title>
  <meta name="description" content={review ? review.content.substring(0, 150) : '체험단 리뷰 상세 정보'} />
</svelte:head>

<MainLayout>
  <div class="review-detail-container">
    {#if loading}
      <div class="loading-state">
        <div class="spinner"></div>
        <p>리뷰를 불러오는 중입니다...</p>
      </div>
    {:else if error}
      <div class="error-state">
        <h2>오류가 발생했습니다</h2>
        <p>{error}</p>
        <Button variant="primary" on:click={() => window.history.back()}>
          돌아가기
        </Button>
      </div>
    {:else if review}
      <article class="review-detail">
        <!-- 리뷰 헤더 -->
        <header class="review-header">
          <div class="breadcrumb">
            <a href="/">홈</a>
            <span>></span>
            <a href="/review">리뷰</a>
            <span>></span>
            <span>{review.category}</span>
          </div>
          
          <div class="review-badges">
            <Badge type={review.isPromoted ? 'premium' : 'review'} size="md">
              {review.type}
            </Badge>
            
            <Badge type="success" size="md">
              {review.category}
            </Badge>
          </div>
          
          <h1 class="review-title">{review.title}</h1>
          
          <div class="review-meta">
            <div class="author-info">
              <div class="author-avatar" style="background-image: url({review.author.profileImage})"></div>
              <div class="author-details">
                <span class="author-name">{review.author.name}</span>
                <div class="author-stats">
                  <Badge type="warning" size="sm">{review.author.level}</Badge>
                  <span class="review-count">리뷰 {review.author.reviewCount}개</span>
                </div>
              </div>
            </div>
            
            <div class="review-info">
              <div class="info-item">
                <span class="info-label">작성일</span>
                <span class="info-value">{formatDate(review.createdAt)}</span>
              </div>
              <div class="info-item">
                <span class="info-label">체험일</span>
                <span class="info-value">{formatDate(review.visitDate)}</span>
              </div>
              <div class="info-item">
                <span class="info-label">위치</span>
                <span class="info-value">{review.location}</span>
              </div>
            </div>
          </div>
          
          <!-- 평점 -->
          <div class="rating-section">
            <div class="rating-display">
              <span class="rating-score">{review.rating.toFixed(1)}</span>
              <div class="rating-stars">
                {#each Array(5) as _, i}
                  <span class="star {i < Math.floor(review.rating) ? 'filled' : ''}">★</span>
                {/each}
              </div>
            </div>
          </div>
        </header>
        
        <!-- 리뷰 이미지 갤러리 -->
        {#if review.images && review.images.length > 0}
          <section class="image-gallery">
            <ImageGallery 
              images={review.images}
              aspectRatio="16:9"
              columns={3}
              showLightbox={true}
            />
          </section>
        {/if}
        
        <!-- 리뷰 내용 -->
        <section class="review-content">
          <h2 class="content-title">체험 후기</h2>
          <div class="content-text">
            <p>{review.content}</p>
            
            <!-- 추가 더미 내용 -->
            <p>이번 체험은 정말 만족스러웠습니다. 직원분들이 매우 친절했고, 음식의 퀄리티도 기대 이상이었어요. 특히 시그니처 메뉴는 꼭 한번 드셔보시길 추천드립니다.</p>
            
            <p>분위기도 데이트하기에 딱 좋았고, 사진 찍기에도 예쁜 장소들이 많았습니다. 다음에 기회가 되면 또 방문하고 싶어요!</p>
          </div>
          
          <!-- 장단점 -->
          <div class="pros-cons">
            <div class="pros">
              <h3>👍 좋았던 점</h3>
              <ul>
                {#each review.pros as pro}
                  <li>{pro}</li>
                {/each}
              </ul>
            </div>
            
            <div class="cons">
              <h3>👎 아쉬웠던 점</h3>
              <ul>
                {#each review.cons as con}
                  <li>{con}</li>
                {/each}
              </ul>
            </div>
          </div>
          
          <!-- 추천 대상 -->
          <div class="recommendations">
            <h3>💡 추천 대상</h3>
            <p>{review.recommendations}</p>
          </div>
        </section>
        
        <!-- 리뷰 액션 -->
        <section class="review-actions">
          <div class="action-buttons">
            <button 
              class="action-button like {isLiked ? 'active' : ''}" 
              on:click={toggleLike}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              좋아요 {review.likes}
            </button>
            
            <button class="action-button share" on:click={shareReview}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              공유하기
            </button>
            
            <button class="action-button report" on:click={reportReview}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 3h18v18H3zM12 8v4M12 16h.01"/>
              </svg>
              신고하기
            </button>
          </div>
          
          <div class="view-count">
            조회수 {review.views}
          </div>
        </section>
        
        <!-- 관련 리뷰 -->
        <section class="related-reviews">
          <h2 class="related-title">관련 리뷰</h2>
          
          <div class="related-grid">
            {#each relatedReviews as related}
              <a href={`/review/${related.id}`} class="related-card">
                <div class="related-image" style="background-image: url({related.thumbnail || '/images/placeholder.jpg'})"></div>
                <div class="related-content">
                  <h3 class="related-review-title">{related.title}</h3>
                  <div class="related-meta">
                    <span class="related-category">{related.category}</span>
                    <div class="related-rating">
                      <span class="star">★</span>
                      <span>{related.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <span class="related-author">by {related.author}</span>
                </div>
              </a>
            {/each}
          </div>
        </section>
      </article>
    {/if}
  </div>
</MainLayout>

<style>
  .review-detail-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
  }
  
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    gap: 1rem;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f3f4f6;
    border-top: 3px solid #5ce0c6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .error-state {
    text-align: center;
    padding: 3rem;
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .review-detail {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .review-header {
    padding: 2rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .breadcrumb a {
    color: #5ce0c6;
    text-decoration: none;
  }
  
  .breadcrumb a:hover {
    text-decoration: underline;
  }
  
  .review-badges {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .review-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 1.5rem 0;
    line-height: 1.4;
  }
  
  .review-meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 1.5rem;
  }
  
  .author-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .author-avatar {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background-color: #e5e7eb;
    background-size: cover;
    background-position: center;
  }
  
  .author-name {
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.25rem;
  }
  
  .author-stats {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .review-count {
    font-size: 0.75rem;
    color: #9ca3af;
  }
  
  .review-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .info-item {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
  }
  
  .info-label {
    color: #6b7280;
  }
  
  .info-value {
    color: #1f2937;
    font-weight: 500;
  }
  
  .rating-section {
    display: flex;
    justify-content: center;
    padding: 1.5rem;
    background-color: #f9fafb;
    border-radius: 0.375rem;
  }
  
  .rating-display {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .rating-score {
    font-size: 2rem;
    font-weight: 700;
    color: #f59e0b;
  }
  
  .rating-stars {
    display: flex;
    gap: 0.25rem;
  }
  
  .star {
    font-size: 1.25rem;
    color: #d1d5db;
  }
  
  .star.filled {
    color: #f59e0b;
  }
  
  .image-gallery {
    padding: 2rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .main-image {
    width: 100%;
    height: 400px;
    margin-bottom: 1rem;
    border-radius: 0.5rem;
    overflow: hidden;
  }
  
  .main-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .thumbnail-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
  }
  
  .thumbnail {
    aspect-ratio: 1;
    border-radius: 0.375rem;
    overflow: hidden;
  }
  
  .thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .more-images {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    font-weight: 600;
    border-radius: 0.375rem;
  }
  
  .review-content {
    padding: 2rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .content-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1rem;
  }
  
  .content-text {
    line-height: 1.7;
    color: #4b5563;
    margin-bottom: 2rem;
  }
  
  .content-text p {
    margin-bottom: 1rem;
  }
  
  .pros-cons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }
  
  .pros, .cons {
    padding: 1.5rem;
    background-color: #f9fafb;
    border-radius: 0.375rem;
  }
  
  .pros h3, .cons h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  .pros ul, .cons ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .pros li, .cons li {
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    color: #4b5563;
  }
  
  .recommendations {
    padding: 1.5rem;
    background-color: #f0f9ff;
    border-radius: 0.375rem;
  }
  
  .recommendations h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .review-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .action-buttons {
    display: flex;
    gap: 1rem;
  }
  
  .action-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #f3f4f6;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: #4b5563;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .action-button:hover {
    background-color: #e5e7eb;
  }
  
  .action-button.like.active {
    background-color: #fee2e2;
    color: #dc2626;
  }
  
  .view-count {
    font-size: 0.875rem;
    color: #9ca3af;
  }
  
  .related-reviews {
    padding: 2rem;
  }
  
  .related-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1.5rem;
    text-align: center;
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
    transition: transform 0.2s;
  }
  
  .related-card:hover {
    transform: translateY(-2px);
  }
  
  .related-image {
    width: 100%;
    height: 120px;
    background-color: #e5e7eb;
    background-size: cover;
    background-position: center;
  }
  
  .related-content {
    padding: 1rem;
  }
  
  .related-review-title {
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    line-height: 1.4;
  }
  
  .related-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.25rem;
  }
  
  .related-category {
    font-size: 0.75rem;
    color: #6b7280;
  }
  
  .related-rating {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
  }
  
  .related-rating .star {
    color: #f59e0b;
  }
  
  .related-author {
    font-size: 0.75rem;
    color: #9ca3af;
  }
  
  @media (max-width: 768px) {
    .review-meta {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .pros-cons {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .related-grid {
      grid-template-columns: 1fr;
    }
    
    .thumbnail-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>
