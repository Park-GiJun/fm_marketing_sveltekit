<script>
  // 예시 지역 데이터
  const regions = [
    { id: 1, name: '서울', description: '대한민국의 수도', image: '/images/regions/seoul.jpg' },
    { id: 2, name: '부산', description: '대한민국 제2의 도시', image: '/images/regions/busan.jpg' },
    { id: 3, name: '인천', description: '국제 무역의 관문', image: '/images/regions/incheon.jpg' },
    { id: 4, name: '대구', description: '섬유 산업의 중심지', image: '/images/regions/daegu.jpg' },
    { id: 5, name: '광주', description: '예술과 문화의 도시', image: '/images/regions/gwangju.jpg' },
    { id: 6, name: '대전', description: '과학 기술의 중심', image: '/images/regions/daejeon.jpg' },
    { id: 7, name: '울산', description: '산업의 중심지', image: '/images/regions/ulsan.jpg' },
    { id: 8, name: '세종', description: '행정 중심 복합도시', image: '/images/regions/sejong.jpg' }
  ];
</script>

<svelte:head>
  <title>FM 마케팅 - 지역</title>
</svelte:head>

<section class="regions-section">
  <div class="container">
    <h1 class="page-title">지역별 마케팅</h1>
    
    <p class="page-desc">
      각 지역의 특성에 맞는 맞춤형 마케팅 전략을 제공합니다. 지역을 선택하여 자세한 정보를 확인하세요.
    </p>
    
    <div class="regions-grid">
      {#each regions as region}
        <div class="region-card">
          <div class="region-img">
            <span class="region-name-placeholder">{region.name}</span>
          </div>
          <div class="region-info">
            <h3 class="region-name">{region.name}</h3>
            <p class="region-desc">{region.description}</p>
            <a href="/regions/{region.id}" class="region-link">자세히 보기 →</a>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .regions-section {
    padding: 3rem 0;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .page-title {
    font-size: 2rem;
    font-weight: bold;
    color: #075985; /* sky-800 */
    margin-bottom: 1rem;
  }
  
  .page-desc {
    font-size: 1.125rem;
    color: #4b5563; /* gray-600 */
    max-width: 800px;
    margin-bottom: 2.5rem;
  }
  
  .regions-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 1.5rem;
  }
  
  @media (min-width: 640px) {
    .regions-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (min-width: 1024px) {
    .regions-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  
  .region-card {
    background-color: white;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .region-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  
  .region-img {
    height: 12rem;
    background-color: #e5e7eb; /* gray-200 */
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .region-name-placeholder {
    font-size: 1.5rem;
    color: #6b7280; /* gray-500 */
    font-weight: 500;
  }
  
  .region-info {
    padding: 1.25rem;
  }
  
  .region-name {
    font-size: 1.25rem;
    font-weight: 600;
    color: #0369a1; /* sky-700 */
    margin-bottom: 0.5rem;
  }
  
  .region-desc {
    color: #6b7280; /* gray-500 */
    font-size: 0.9375rem;
    margin-bottom: 1rem;
  }
  
  .region-link {
    font-size: 0.875rem;
    color: #0284c7; /* sky-600 */
    font-weight: 500;
    transition: color 0.2s ease;
  }
  
  .region-link:hover {
    color: #0369a1; /* sky-700 */
  }
</style>
