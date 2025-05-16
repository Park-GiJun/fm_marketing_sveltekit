<!-- src/routes/community/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { communityStore } from '$lib/stores/communityStore.js';
  import { userStore } from '$lib/stores/userStore.js';
  import MainLayout from '$lib/components/layout/MainLayout.svelte';
  import Button from '$lib/components/common/Button.svelte';
  
  // 상태 변수
  let posts = [];
  let loading = true;
  let selectedCategory = 'all';
  let categories = [
    { id: 'all', name: '전체' },
    { id: '체험 후기', name: '체험 후기' },
    { id: '정보 공유', name: '정보 공유' },
    { id: '질문', name: '질문' },
    { id: '자유', name: '자유' }
  ];
  let sortOption = 'latest';
  let sortOptions = [
    { id: 'latest', name: '최신순' },
    { id: 'popular', name: '인기순' },
    { id: 'comments', name: '댓글순' }
  ];
  
  // 사용자 상태
  let isAuthenticated = false;
  
  // 카테고리 변경 핸들러
  function handleCategoryChange(category) {
    selectedCategory = category;
    loadPosts();
  }
  
  // 정렬 옵션 변경 핸들러
  function handleSortChange(sort) {
    sortOption = sort;
    loadPosts();
  }
  
  // 게시글 목록 로드 함수
  async function loadPosts() {
    loading = true;
    
    try {
      // 카테고리가 'all'인 경우 전체 게시글 로드, 아니면 특정 카테고리만 로드
      await communityStore.fetchPosts(selectedCategory === 'all' ? null : selectedCategory);
      
      // 스토어에서 데이터 가져오기
      const unsubscribe = communityStore.subscribe(state => {
        posts = state.posts;
        
        // 정렬 옵션에 따라 정렬
        if (sortOption === 'popular') {
          posts = [...posts].sort((a, b) => b.likes - a.likes);
        } else if (sortOption === 'comments') {
          posts = [...posts].sort((a, b) => b.commentCount - a.commentCount);
        }
        // 최신순은 기본 정렬이므로 추가 정렬 필요 없음
        
        loading = state.loading;
      });
      
      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error('게시글 로드 중 오류 발생:', error);
      loading = false;
    }
  }
  
  // 날짜 포맷팅 함수
  function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (60 * 1000));
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    
    if (diffMins < 60) {
      return `${diffMins}분 전`;
    } else if (diffHours < 24) {
      return `${diffHours}시간 전`;
    } else if (diffDays < 7) {
      return `${diffDays}일 전`;
    } else {
      return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
    }
  }
  
  // 컴포넌트 마운트 시 초기 데이터 로드
  onMount(() => {
    // 사용자 인증 상태 확인
    const unsubscribeUser = userStore.subscribe(state => {
      isAuthenticated = state.isAuthenticated;
    });
    
    // 게시글 로드
    loadPosts();
    
    return () => {
      unsubscribeUser();
    };
  });
</script>

<svelte:head>
  <title>커뮤니티 - FM마케팅</title>
  <meta name="description" content="FM마케팅 커뮤니티에서 체험단 후기와 정보를 공유하고 소통하세요." />
</svelte:head>

<MainLayout>
  <div class="community-container">
    <div class="page-header">
      <h1 class="page-title">커뮤니티</h1>
      <p class="page-description">체험단 후기, 정보 공유, 질문 등 다양한 주제로 소통해보세요.</p>
    </div>
    
    <div class="community-controls">
      <div class="category-tabs">
        {#each categories as category}
          <button 
            class="category-tab {selectedCategory === category.id ? 'active' : ''}" 
            on:click={() => handleCategoryChange(category.id)}
          >
            {category.name}
          </button>
        {/each}
      </div>
      
      <div class="community-actions">
        <div class="sort-options">
          {#each sortOptions as option}
            <button 
              class="sort-option {sortOption === option.id ? 'active' : ''}" 
              on:click={() => handleSortChange(option.id)}
            >
              {option.name}
            </button>
          {/each}
        </div>
        
        <a href="/community/write" class="write-button">
          <Button variant="primary" size="md">
            글쓰기
          </Button>
        </a>
      </div>
    </div>
    
    <div class="community-content">
      {#if loading}
        <div class="loading-state">
          <p>게시글을 불러오는 중입니다...</p>
        </div>
      {:else if posts.length === 0}
        <div class="empty-state">
          <p>게시글이 없습니다.</p>
          <p>첫 번째 게시글을 작성해보세요!</p>
        </div>
      {:else}
        <div class="post-list">
          {#each posts as post (post.id)}
            <div class="post-item">
              <div class="post-category">{post.category}</div>
              
              <div class="post-content">
                <a href={`/community/${post.id}`} class="post-title-link">
                  <h3 class="post-title">{post.title}</h3>
                </a>
                
                <div class="post-meta">
                  <div class="post-author">
                    <div class="author-avatar" style="background-image: url({post.author.profileImage || '/images/default-avatar.jpg'})"></div>
                    <span class="author-name">{post.author.nickname}</span>
                  </div>
                  
                  <span class="post-date">{formatDate(post.createdAt)}</span>
                  
                  <div class="post-stats">
                    <span class="post-views">조회 {post.views}</span>
                    <span class="stat-divider">·</span>
                    <span class="post-likes">좋아요 {post.likes}</span>
                    <span class="stat-divider">·</span>
                    <span class="post-comments">댓글 {post.commentCount}</span>
                  </div>
                </div>
                
                <p class="post-excerpt">
                  {post.content.length > 150 ? post.content.slice(0, 150) + '...' : post.content}
                </p>
                
                {#if post.images && post.images.length > 0}
                  <div class="post-thumbnail" style="background-image: url({post.images[0]})"></div>
                {/if}
                
                {#if post.tags && post.tags.length > 0}
                  <div class="post-tags">
                    {#each post.tags as tag}
                      <span class="post-tag">#{tag}</span>
                    {/each}
                  </div>
                {/if}
              </div>
            </div>
          {/each}
        </div>
        
        <div class="pagination">
          <button class="pagination-button">이전</button>
          <span class="page-info">1 / 1</span>
          <button class="pagination-button">다음</button>
        </div>
      {/if}
    </div>
  </div>
</MainLayout>

<style>
  .community-container {
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
  
  .community-controls {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    gap: 1rem;
  }
  
  .category-tabs {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  
  .category-tab {
    padding: 0.5rem 1rem;
    background-color: #f3f4f6;
    border: none;
    border-radius: 1.5rem;
    font-size: 0.875rem;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .category-tab:hover {
    background-color: #e5e7eb;
  }
  
  .category-tab.active {
    background-color: #4c96d7;
    color: white;
  }
  
  .community-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .sort-options {
    display: flex;
    gap: 0.5rem;
  }
  
  .sort-option {
    padding: 0.375rem 0.75rem;
    background-color: transparent;
    border: none;
    font-size: 0.875rem;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .sort-option:hover {
    color: #4b5563;
  }
  
  .sort-option.active {
    font-weight: 600;
    color: #4c96d7;
  }
  
  .community-content {
    width: 100%;
  }
  
  .loading-state, .empty-state {
    padding: 3rem 0;
    text-align: center;
    color: #6b7280;
  }
  
  .post-list {
    margin-bottom: 2rem;
  }
  
  .post-item {
    display: flex;
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    background-color: white;
  }
  
  .post-item:hover {
    background-color: #f9fafb;
  }
  
  .post-category {
    flex-shrink: 0;
    width: 5rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: #4c96d7;
    padding-top: 0.25rem;
  }
  
  .post-content {
    flex: 1;
  }
  
  .post-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
    line-height: 1.5;
  }
  
  .post-title-link {
    text-decoration: none;
    color: inherit;
  }
  
  .post-title-link:hover .post-title {
    color: #4c96d7;
  }
  
  .post-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 0.75rem;
    font-size: 0.75rem;
    color: #6b7280;
  }
  
  .post-author {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .author-avatar {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    background-color: #e5e7eb;
    background-size: cover;
    background-position: center;
  }
  
  .post-stats {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  
  .stat-divider {
    margin: 0 0.125rem;
  }
  
  .post-excerpt {
    margin-bottom: 0.75rem;
    font-size: 0.875rem;
    color: #4b5563;
    line-height: 1.5;
  }
  
  .post-thumbnail {
    width: 100%;
    height: 12rem;
    border-radius: 0.375rem;
    background-color: #f3f4f6;
    background-size: cover;
    background-position: center;
    margin-bottom: 0.75rem;
  }
  
  .post-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .post-tag {
    font-size: 0.75rem;
    color: #6b7280;
    background-color: #f3f4f6;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    gap: 1rem;
  }
  
  .pagination-button {
    padding: 0.5rem 1rem;
    background-color: #f3f4f6;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: #4b5563;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .pagination-button:hover {
    background-color: #e5e7eb;
  }
  
  .page-info {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  @media (max-width: 768px) {
    .community-controls {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .category-tabs {
      width: 100%;
      overflow-x: auto;
      padding-bottom: 0.5rem;
    }
    
    .community-actions {
      width: 100%;
      justify-content: space-between;
    }
    
    .post-item {
      flex-direction: column;
    }
    
    .post-category {
      width: auto;
      margin-bottom: 0.5rem;
    }
  }
</style>
