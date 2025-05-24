<!-- src/routes/user/profile/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { userStore } from '$lib/stores/userStore.js';
  import MainLayout from '$lib/components/layout/MainLayout.svelte';
  import UserProfile from '$lib/components/user/UserProfile.svelte';
  
  let isAuthenticated = false;
  let user = null;
  let loading = true;
  
  // 프로필 저장 핸들러
  async function handleSaveProfile(event) {
    const updatedData = event.detail;
    
    try {
      await userStore.updateProfile(updatedData);
      alert('프로필이 성공적으로 업데이트되었습니다.');
    } catch (error) {
      alert('프로필 업데이트에 실패했습니다.');
      console.error(error);
    }
  }
  
  onMount(() => {
    const unsubscribe = userStore.subscribe(state => {
      isAuthenticated = state.isAuthenticated;
      user = state.user;
      loading = state.loading;
      
      if (!loading && !isAuthenticated) {
        goto('/login?redirect=/user/profile');
      }
    });
    
    return () => {
      unsubscribe();
    };
  });
</script>

<svelte:head>
  <title>프로필 - FM마케팅</title>
  <meta name="description" content="내 프로필 정보를 확인하고 수정하세요." />
</svelte:head>

<MainLayout>
  <div class="profile-page-container">
    <div class="page-header">
      <h1 class="page-title">내 프로필</h1>
      <p class="page-description">프로필 정보를 확인하고 수정할 수 있습니다.</p>
    </div>
    
    {#if loading}
      <div class="loading-state">
        <div class="spinner"></div>
        <p>프로필 정보를 불러오는 중입니다...</p>
      </div>
    {:else if user}
      <UserProfile 
        {user} 
        editable={true} 
        on:save={handleSaveProfile} 
      />
    {:else}
      <div class="error-state">
        <h2>접근할 수 없습니다</h2>
        <p>로그인이 필요한 페이지입니다.</p>
        <a href="/login" class="login-link">로그인하러 가기</a>
      </div>
    {/if}
  </div>
</MainLayout>

<style>
  .profile-page-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
  }
  
  .page-header {
    text-align: center;
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
    margin: 0;
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
  
  .error-state h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 1rem 0;
  }
  
  .error-state p {
    color: #6b7280;
    margin: 0 0 1.5rem 0;
  }
  
  .login-link {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background-color: #5ce0c6;
    color: white;
    text-decoration: none;
    border-radius: 0.375rem;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  .login-link:hover {
    background-color: #4bc0a9;
  }
</style>
