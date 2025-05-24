<!-- src/routes/community/[id]/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { communityStore } from '$lib/stores/communityStore.js';
  import { userStore } from '$lib/stores/userStore.js';
  import MainLayout from '$lib/components/layout/MainLayout.svelte';
  import Button from '$lib/components/common/Button.svelte';
  
  let post = null;
  let loading = true;
  let error = null;
  let isAuthenticated = false;
  let newComment = '';
  let isSubmittingComment = false;
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
  }
  
  async function loadPost() {
    loading = true;
    error = null;
    
    try {
      const postId = $page.params.id;
      const data = await communityStore.getPostById(postId);
      
      if (data) {
        post = data;
      } else {
        error = '게시글을 찾을 수 없습니다.';
      }
    } catch (e) {
      error = '게시글을 불러오는 중 오류가 발생했습니다.';
    } finally {
      loading = false;
    }
  }
  
  async function handleLike() {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      return;
    }
    
    const newLikes = await communityStore.likePost(post.id);
    if (newLikes !== null) {
      post.likes = newLikes;
    }
  }
  
  async function handleCommentSubmit() {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      return;
    }
    
    if (!newComment.trim()) {
      alert('댓글을 입력해주세요.');
      return;
    }
    
    isSubmittingComment = true;
    
    const comment = await communityStore.addComment(post.id, {
      content: newComment,
      author: {
        id: 99,
        nickname: '테스트유저',
        profileImage: '/images/default-avatar.jpg'
      }
    });
    
    if (comment) {
      post.comments = [...post.comments, comment];
      post.commentCount += 1;
      newComment = '';
    }
    
    isSubmittingComment = false;
  }
  
  onMount(() => {
    const unsubscribeUser = userStore.subscribe(state => {
      isAuthenticated = state.isAuthenticated;
    });
    
    loadPost();
    
    return () => {
      unsubscribeUser();
    };
  });
</script>

<svelte:head>
  <title>{post ? post.title : '게시글'} - FM마케팅 커뮤니티</title>
</svelte:head>

<MainLayout>
  <div class="post-detail-container">
    {#if loading}
      <div class="loading-state">로딩 중...</div>
    {:else if error}
      <div class="error-state">
        <p>{error}</p>
        <a href="/community">목록으로 돌아가기</a>
      </div>
    {:else if post}
      <div class="post-detail">
        <div class="post-header">
          <div class="post-category">{post.category}</div>
          <h1 class="post-title">{post.title}</h1>
          
          <div class="post-meta">
            <div class="author-info">
              <div class="author-avatar" style="background-image: url({post.author.profileImage || '/images/default-avatar.jpg'})"></div>
              <span class="author-name">{post.author.nickname}</span>
            </div>
            <span class="post-date">{formatDate(post.createdAt)}</span>
            <div class="post-stats">
              <span>조회 {post.views}</span>
              <span>좋아요 {post.likes}</span>
              <span>댓글 {post.commentCount}</span>
            </div>
          </div>
        </div>
        
        <div class="post-content">
          <p>{post.content}</p>
          
          {#if post.images && post.images.length > 0}
            <div class="post-images">
              {#each post.images as image}
                <img src={image} alt="게시글 이미지" />
              {/each}
            </div>
          {/if}
          
          {#if post.tags && post.tags.length > 0}
            <div class="post-tags">
              {#each post.tags as tag}
                <span class="tag">#{tag}</span>
              {/each}
            </div>
          {/if}
        </div>
        
        <div class="post-actions">
          <button class="like-button" on:click={handleLike}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            좋아요 {post.likes}
          </button>
        </div>
        
        <div class="comments-section">
          <h3 class="comments-title">댓글 {post.commentCount}</h3>
          
          <div class="comment-form">
            <textarea 
              placeholder="댓글을 입력하세요" 
              bind:value={newComment}
              disabled={isSubmittingComment}
            ></textarea>
            <Button 
              variant="primary" 
              size="md" 
              disabled={isSubmittingComment}
              on:click={handleCommentSubmit}
            >
              {isSubmittingComment ? '등록 중...' : '댓글 등록'}
            </Button>
          </div>
          
          <div class="comments-list">
            {#each post.comments as comment}
              {#if !comment.isDeleted}
                <div class="comment-item">
                  <div class="comment-author">
                    <div class="author-avatar" style="background-image: url({comment.author.profileImage || '/images/default-avatar.jpg'})"></div>
                    <span class="author-name">{comment.author.nickname}</span>
                    <span class="comment-date">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p class="comment-content">{comment.content}</p>
                </div>
              {/if}
            {/each}
          </div>
        </div>
        
        <div class="post-footer">
          <a href="/community" class="back-link">목록으로 돌아가기</a>
        </div>
      </div>
    {/if}
  </div>
</MainLayout>

<style>
  .post-detail-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
  }
  
  .loading-state, .error-state {
    padding: 3rem 0;
    text-align: center;
    color: #6b7280;
  }
  
  .post-detail {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .post-header {
    padding: 2rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .post-category {
    display: inline-block;
    font-size: 0.875rem;
    color: #ff7eb6;
    margin-bottom: 0.5rem;
  }
  
  .post-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 1rem 0;
  }
  
  .post-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .author-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .author-avatar {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background-color: #e5e7eb;
    background-size: cover;
    background-position: center;
  }
  
  .post-stats {
    display: flex;
    gap: 1rem;
  }
  
  .post-content {
    padding: 2rem;
  }
  
  .post-content p {
    line-height: 1.6;
    margin-bottom: 1rem;
  }
  
  .post-images {
    margin: 1rem 0;
  }
  
  .post-images img {
    width: 100%;
    max-width: 100%;
    margin-bottom: 1rem;
    border-radius: 0.375rem;
  }
  
  .post-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  
  .tag {
    font-size: 0.875rem;
    color: #6b7280;
    background-color: #f3f4f6;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
  }
  
  .post-actions {
    padding: 1rem 2rem;
    border-top: 1px solid #e5e7eb;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .like-button {
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
  }
  
  .like-button:hover {
    background-color: #e5e7eb;
  }
  
  .comments-section {
    padding: 2rem;
  }
  
  .comments-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  .comment-form {
    margin-bottom: 2rem;
  }
  
  .comment-form textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    resize: vertical;
    min-height: 100px;
    margin-bottom: 0.75rem;
  }
  
  .comments-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .comment-item {
    padding: 1rem;
    background-color: #f9fafb;
    border-radius: 0.375rem;
  }
  
  .comment-author {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
  }
  
  .comment-date {
    color: #9ca3af;
  }
  
  .comment-content {
    font-size: 0.875rem;
    line-height: 1.5;
  }
  
  .post-footer {
    padding: 1.5rem 2rem;
    text-align: center;
  }
  
  .back-link {
    color: #5ce0c6;
    text-decoration: none;
  }
  
  .back-link:hover {
    text-decoration: underline;
  }
</style>
