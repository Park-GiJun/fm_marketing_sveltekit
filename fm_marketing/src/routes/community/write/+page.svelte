<!-- src/routes/community/write/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { communityStore } from '$lib/stores/communityStore.js';
  import { userStore } from '$lib/stores/userStore.js';
  import MainLayout from '$lib/components/layout/MainLayout.svelte';
  import Button from '$lib/components/common/Button.svelte';
  
  let isAuthenticated = false;
  let user = null;
  
  let formData = {
    title: '',
    category: '자유',
    content: '',
    tags: ''
  };
  
  let errors = {};
  let loading = false;
  
  const categories = [
    { id: '체험 후기', name: '체험 후기' },
    { id: '정보 공유', name: '정보 공유' },
    { id: '질문', name: '질문' },
    { id: '자유', name: '자유' }
  ];
  
  async function handleSubmit() {
    errors = {};
    
    if (!formData.title.trim()) {
      errors.title = '제목을 입력해주세요.';
    }
    
    if (!formData.content.trim()) {
      errors.content = '내용을 입력해주세요.';
    }
    
    if (Object.keys(errors).length > 0) return;
    
    loading = true;
    
    try {
      const postData = {
        title: formData.title,
        category: formData.category,
        content: formData.content,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        author: {
          id: user?.id || 1,
          nickname: user?.nickname || '테스트유저',
          profileImage: user?.profileImage || '/images/default-avatar.jpg'
        },
        images: []
      };
      
      await communityStore.createPost(postData);
      goto('/community');
    } catch (error) {
      errors.general = '게시글 작성에 실패했습니다.';
    } finally {
      loading = false;
    }
  }
  
  onMount(() => {
    const unsubscribe = userStore.subscribe(state => {
      isAuthenticated = state.isAuthenticated;
      user = state.user;
      
      if (!isAuthenticated) {
        alert('로그인이 필요합니다.');
        goto('/login?redirect=/community/write');
      }
    });
    
    return () => {
      unsubscribe();
    };
  });
</script>

<svelte:head>
  <title>글쓰기 - FM마케팅 커뮤니티</title>
</svelte:head>

<MainLayout>
  <div class="write-container">
    <div class="write-header">
      <h1 class="write-title">글쓰기</h1>
    </div>
    
    <form class="write-form" on:submit|preventDefault={handleSubmit}>
      {#if errors.general}
        <div class="error-message">{errors.general}</div>
      {/if}
      
      <div class="form-group">
        <label for="category">카테고리</label>
        <select id="category" bind:value={formData.category}>
          {#each categories as category}
            <option value={category.id}>{category.name}</option>
          {/each}
        </select>
      </div>
      
      <div class="form-group">
        <label for="title">제목</label>
        <input 
          type="text" 
          id="title" 
          bind:value={formData.title} 
          placeholder="제목을 입력하세요"
        />
        {#if errors.title}
          <span class="field-error">{errors.title}</span>
        {/if}
      </div>
      
      <div class="form-group">
        <label for="content">내용</label>
        <textarea 
          id="content" 
          bind:value={formData.content} 
          placeholder="내용을 입력하세요"
          rows="15"
        ></textarea>
        {#if errors.content}
          <span class="field-error">{errors.content}</span>
        {/if}
      </div>
      
      <div class="form-group">
        <label for="tags">태그</label>
        <input 
          type="text" 
          id="tags" 
          bind:value={formData.tags} 
          placeholder="태그를 쉼표로 구분하여 입력하세요 (예: 체험단, 후기, 서울)"
        />
      </div>
      
      <div class="form-actions">
        <Button 
          variant="outline" 
          size="lg" 
          on:click={() => goto('/community')}
        >
          취소
        </Button>
        <Button 
          type="submit" 
          variant="primary" 
          size="lg" 
          disabled={loading}
        >
          {loading ? '등록 중...' : '등록하기'}
        </Button>
      </div>
    </form>
  </div>
</MainLayout>

<style>
  .write-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
  }
  
  .write-header {
    margin-bottom: 2rem;
  }
  
  .write-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
  }
  
  .write-form {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 2rem;
  }
  
  .error-message {
    background-color: #fee2e2;
    color: #dc2626;
    padding: 0.75rem;
    border-radius: 0.375rem;
    margin-bottom: 1.5rem;
    font-size: 0.875rem;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-group label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #4b5563;
    margin-bottom: 0.5rem;
  }
  
  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
  }
  
  .form-group textarea {
    resize: vertical;
  }
  
  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #5ce0c6;
    box-shadow: 0 0 0 2px rgba(92, 224, 198, 0.2);
  }
  
  .field-error {
    display: block;
    color: #dc2626;
    font-size: 0.75rem;
    margin-top: 0.25rem;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
  }
</style>
