<!-- src/routes/guide/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { guideStore } from '$lib/stores/guideStore.js';
  import MainLayout from '$lib/components/layout/MainLayout.svelte';
  
  // 상태 변수
  let activeTab = 'guides'; // 'guides' 또는 'faqs'
  let selectedCategory = 'all';
  let guides = [];
  let faqs = [];
  let loading = true;
  
  // 가이드 카테고리
  const guideCategories = [
    { id: 'all', name: '전체' },
    { id: '기본 가이드', name: '기본 가이드' },
    { id: '체험단 정보', name: '체험단 정보' },
    { id: '포인트/결제', name: '포인트/결제' }
  ];
  
  // FAQ 카테고리
  const faqCategories = [
    { id: 'all', name: '전체' },
    { id: '체험단 신청', name: '체험단 신청' },
    { id: '체험단 활동', name: '체험단 활동' },
    { id: '포인트/결제', name: '포인트/결제' },
    { id: '회원 정보', name: '회원 정보' }
  ];
  
  // 탭 변경 핸들러
  function changeTab(tab) {
    activeTab = tab;
    selectedCategory = 'all';
    loadData();
  }
  
  // 카테고리 변경 핸들러
  function changeCategory(category) {
    selectedCategory = category;
    loadData();
  }
  
  // 데이터 로드 함수
  async function loadData() {
    loading = true;
    
    try {
      if (activeTab === 'guides') {
        // 선택된 카테고리에 따라 가이드 로드
        await guideStore.fetchGuides(selectedCategory === 'all' ? null : selectedCategory);
      } else {
        // 선택된 카테고리에 따라 FAQ 로드
        await guideStore.fetchFaqs(selectedCategory === 'all' ? null : selectedCategory);
      }
      
      // 스토어에서 데이터 가져오기
      const unsubscribe = guideStore.subscribe(state => {
        guides = state.guides;
        faqs = state.faqs;
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
  
  // FAQ 아코디언 상태
  let openFaqId = null;
  
  // FAQ 아코디언 토글 핸들러
  function toggleFaq(id) {
    if (openFaqId === id) {
      openFaqId = null;
    } else {
      openFaqId = id;
    }
  }
  
  // 컴포넌트 마운트 시 초기 데이터 로드
  onMount(() => {
    loadData();
  });
</script>

<svelte:head>
  <title>이용가이드 - FM마케팅</title>
  <meta name="description" content="FM마케팅 이용 방법과 자주 묻는 질문을 확인하세요." />
</svelte:head>

<MainLayout>
  <div class="guide-container">
    <div class="page-header">
      <h1 class="page-title">이용가이드</h1>
      <p class="page-description">FM마케팅 이용 방법과 자주 묻는 질문을 확인하세요.</p>
    </div>
    
    <div class="tab-navigation">
      <button 
        class={`tab-button ${activeTab === 'guides' ? 'active' : ''}`} 
        on:click={() => changeTab('guides')}
      >
        이용 가이드
      </button>
      <button 
        class={`tab-button ${activeTab === 'faqs' ? 'active' : ''}`} 
        on:click={() => changeTab('faqs')}
      >
        자주 묻는 질문
      </button>
    </div>
    
    <div class="category-filter">
      {#if activeTab === 'guides'}
        {#each guideCategories as category}
          <button 
            class={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
            on:click={() => changeCategory(category.id)}
          >
            {category.name}
          </button>
        {/each}
      {:else}
        {#each faqCategories as category}
          <button 
            class={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
            on:click={() => changeCategory(category.id)}
          >
            {category.name}
          </button>
        {/each}
      {/if}
    </div>
    
    <div class="content-area">
      {#if loading}
        <div class="loading-state">
          <p>데이터를 불러오는 중입니다...</p>
        </div>
      {:else if activeTab === 'guides' && guides.length === 0}
        <div class="empty-state">
          <p>등록된 가이드가 없습니다.</p>
        </div>
      {:else if activeTab === 'faqs' && faqs.length === 0}
        <div class="empty-state">
          <p>등록된 FAQ가 없습니다.</p>
        </div>
      {:else if activeTab === 'guides'}
        <div class="guide-grid">
          {#each guides as guide (guide.id)}
            <a href={`/guide/${guide.id}`} class="guide-card">
              <div class="guide-thumbnail" style="background-image: url({guide.thumbnail || '/images/guides/default-guide.jpg'})"></div>
              <div class="guide-content">
                <span class="guide-category">{guide.category}</span>
                <h3 class="guide-title">{guide.title}</h3>
                <span class="guide-date">{formatDate(guide.createdAt)}</span>
              </div>
            </a>
          {/each}
        </div>
      {:else if activeTab === 'faqs'}
        <div class="faq-list">
          {#each faqs as faq (faq.id)}
            <div class="faq-item">
              <button 
                class="faq-question {openFaqId === faq.id ? 'open' : ''}" 
                on:click={() => toggleFaq(faq.id)}
              >
                <span class="question-text">Q. {faq.question}</span>
                <span class="question-toggle">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    {#if openFaqId === faq.id}
                      <line x1="18" y1="12" x2="6" y2="12"></line>
                    {:else}
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    {/if}
                  </svg>
                </span>
              </button>
              
              {#if openFaqId === faq.id}
                <div class="faq-answer">
                  <p>A. {faq.answer}</p>
                  <div class="answer-meta">
                    <span class="answer-category">{faq.category}</span>
                    <span class="answer-date">{formatDate(faq.createdAt)}</span>
                  </div>
                </div>
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</MainLayout>

<style>
  .guide-container {
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
    margin-bottom: 1.5rem;
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
  
  .category-filter {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 2rem;
  }
  
  .category-button {
    padding: 0.5rem 1rem;
    background-color: #f3f4f6;
    border: none;
    border-radius: 1.5rem;
    font-size: 0.875rem;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .category-button:hover {
    background-color: #e5e7eb;
  }
  
  .category-button.active {
    background-color: #ff7eb6; /* 핑크색 */
    color: white;
  }
  
  .content-area {
    min-height: 400px;
  }
  
  .loading-state, .empty-state {
    padding: 3rem 0;
    text-align: center;
    color: #6b7280;
  }
  
  /* 가이드 스타일 */
  .guide-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  .guide-card {
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
  
  .guide-card:hover {
    border-color: #d1d5db;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transform: translateY(-4px);
  }
  
  .guide-thumbnail {
    width: 100%;
    height: 160px;
    background-color: #f3f4f6;
    background-size: cover;
    background-position: center;
  }
  
  .guide-content {
    padding: 1.25rem;
  }
  
  .guide-category {
    display: inline-block;
    font-size: 0.75rem;
    color: #ff7eb6; /* 핑크색 */
    margin-bottom: 0.5rem;
  }
  
  .guide-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 0.75rem 0;
    line-height: 1.5;
    min-height: 3rem;
  }
  
  .guide-date {
    font-size: 0.75rem;
    color: #9ca3af;
  }
  
  /* FAQ 스타일 */
  .faq-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .faq-item {
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    overflow: hidden;
    background-color: white;
  }
  
  .faq-question {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem;
    background-color: transparent;
    border: none;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .faq-question:hover {
    background-color: #f9fafb;
  }
  
  .faq-question.open {
    background-color: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .question-text {
    font-size: 1rem;
    font-weight: 500;
    color: #1f2937;
  }
  
  .question-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
  }
  
  .faq-answer {
    padding: 1.25rem;
    font-size: 0.875rem;
    color: #4b5563;
    line-height: 1.5;
  }
  
  .answer-meta {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #f3f4f6;
    font-size: 0.75rem;
    color: #9ca3af;
  }
  
  @media (max-width: 768px) {
    .tab-button {
      padding: 0.75rem 1rem;
    }
    
    .guide-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
