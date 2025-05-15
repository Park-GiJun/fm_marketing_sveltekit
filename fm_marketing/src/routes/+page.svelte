<script>
  // 기존 Slider 및 GridGallery 컴포넌트 대신 직접 구현
</script>

<svelte:head>
  <title>FM 마케팅 - 홈</title>
</svelte:head>

<!-- 슬라이더 섹션 -->
<section class="slider-section">
  <div class="hero-slider">
    <div class="slide active">
      <div class="slide-content">
        <h2>효과적인 마케팅 전략</h2>
        <p>귀사의 비즈니스에 맞는 최적의 마케팅 전략을 제공합니다.</p>
        <a href="/services" class="btn btn-primary">자세히 보기</a>
      </div>
    </div>
  </div>
</section>

<!-- 다양한 성공 사례 섹션 -->
<section class="success-cases">
  <div class="container">
    <h2 class="section-title">다양한 성공 사례</h2>
    <p class="section-desc">다양한 업종에서의 성공적인 마케팅 사례를 확인하세요.</p>
    
    <a href="/cases" class="btn">사례 보기</a>
  </div>
</section>

<!-- 최신 콘텐츠 섹션 -->
<section class="latest-content">
  <div class="container">
    <h2 class="section-title">최신 콘텐츠</h2>
    
    <div class="content-grid">
      <!-- 콘텐츠 아이템 1 -->
      <div class="content-item">
        <div class="content-img"></div>
        <div class="content-info">
          <div class="content-meta">
            <span class="content-category">가이드</span>
            <span class="content-date">2025-04-10</span>
          </div>
          <h3 class="content-title">디지털 마케팅 전략 가이드</h3>
          <a href="/content/1" class="content-link">자세히 보기 →</a>
        </div>
      </div>
      
      <!-- 콘텐츠 아이템 2 -->
      <div class="content-item">
        <div class="content-img"></div>
        <div class="content-info">
          <div class="content-meta">
            <span class="content-category">사례 연구</span>
            <span class="content-date">2025-04-05</span>
          </div>
          <h3 class="content-title">SNS 마케팅 성공 사례 분석</h3>
          <a href="/content/2" class="content-link">자세히 보기 →</a>
        </div>
      </div>
      
      <!-- 콘텐츠 아이템 3 -->
      <div class="content-item">
        <div class="content-img"></div>
        <div class="content-info">
          <div class="content-meta">
            <span class="content-category">팁</span>
            <span class="content-date">2025-03-28</span>
          </div>
          <h3 class="content-title">이메일 마케팅 최적화 방법</h3>
          <a href="/content/3" class="content-link">자세히 보기 →</a>
        </div>
      </div>
    </div>
    
    <div class="content-action">
      <a href="/contents" class="btn btn-primary">모든 콘텐츠 보기</a>
    </div>
  </div>
</section>

<style>
  /* 슬라이더 섹션 스타일 */
  .slider-section {
    margin-bottom: 2.5rem;
  }
  
  .hero-slider {
    position: relative;
    height: 500px;
    background-color: #0284c7; /* sky-600 */
    color: white;
    overflow: hidden;
  }
  
  .slide {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2rem;
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  
  .slide.active {
    opacity: 1;
  }
  
  .slide-content {
    max-width: 800px;
  }
  
  .slide-content h2 {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
  
  .slide-content p {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
    opacity: 0.9;
  }
  
  /* 성공 사례 섹션 */
  .success-cases {
    padding: 4rem 0;
    background-color: #f0f9ff; /* sky-50 */
    text-align: center;
  }
  
  /* 최신 콘텐츠 섹션 */
  .latest-content {
    padding: 4rem 0;
  }
  
  .section-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #075985; /* sky-800 */
    margin-bottom: 1.5rem;
  }
  
  .section-desc {
    font-size: 1.125rem;
    color: #4b5563; /* gray-600 */
    margin-bottom: 2rem;
  }
  
  .content-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  @media (min-width: 640px) {
    .content-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (min-width: 1024px) {
    .content-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  
  .content-item {
    background-color: white;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
  }
  
  .content-item:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .content-img {
    height: 12rem;
    background-color: #e5e7eb; /* gray-200 */
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .content-info {
    padding: 1rem;
  }
  
  .content-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .content-category {
    font-size: 0.875rem;
    font-weight: 500;
    color: #0284c7; /* sky-600 */
  }
  
  .content-date {
    font-size: 0.75rem;
    color: #6b7280; /* gray-500 */
  }
  
  .content-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .content-link {
    font-size: 0.875rem;
    color: #0369a1; /* sky-700 */
    text-decoration: none;
  }
  
  .content-link:hover {
    text-decoration: underline;
  }
  
  .content-action {
    text-align: center;
    margin-top: 2rem;
  }
  
  /* 기본 스타일 재정의 */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .btn {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    background-color: transparent;
    color: #0284c7; /* sky-600 */
    border: 1px solid #0284c7;
    text-decoration: none;
    transition: all 0.3s ease;
    cursor: pointer;
  }
  
  .btn:hover {
    background-color: rgba(2, 132, 199, 0.1); /* sky-600 with opacity */
  }
  
  .btn-primary {
    background-color: #0284c7; /* sky-600 */
    color: white;
    border: 1px solid #0284c7;
  }
  
  .btn-primary:hover {
    background-color: #0369a1; /* sky-700 */
    border-color: #0369a1;
  }
</style>
