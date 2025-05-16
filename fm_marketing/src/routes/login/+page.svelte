<!-- src/routes/login/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { userStore } from '$lib/stores/userStore.js';
  import { goto } from '$app/navigation';
  import Button from '$lib/components/common/Button.svelte';

  // 로그인 폼 데이터
  let username = '';
  let password = '';
  let rememberMe = false;
  let errorMessage = '';
  let loading = false;
  
  // 로그인 처리
  async function handleLogin() {
    if (!username || !password) {
      errorMessage = '아이디와 비밀번호를 입력해주세요.';
      return;
    }
    
    loading = true;
    errorMessage = '';
    
    try {
      await userStore.login(username, password);
      // 로그인 성공 시 메인 페이지로 이동
      goto('/');
    } catch (error) {
      errorMessage = error.message || '로그인에 실패했습니다.';
    } finally {
      loading = false;
    }
  }
  
  // 엔터 키 이벤트 처리
  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      handleLogin();
    }
  }
  
  // 컴포넌트 마운트 시
  onMount(() => {
    // 이미 로그인 상태인 경우 메인 페이지로 리다이렉트
    const unsubscribe = userStore.subscribe(state => {
      if (state.isAuthenticated) {
        goto('/');
      }
    });
    
    return () => {
      unsubscribe();
    };
  });
</script>

<svelte:head>
  <title>로그인 - FM마케팅</title>
</svelte:head>

<div class="login-container">
  <div class="login-card">
    <div class="login-header">
      <h1 class="login-title">
        <span class="logo-green">FM</span><span class="logo-blue">Marketing</span>
      </h1>
      <p class="login-subtitle">체험단 마케팅 플랫폼</p>
    </div>
    
    <form class="login-form" on:submit|preventDefault={handleLogin}>
      {#if errorMessage}
        <div class="error-message">
          {errorMessage}
        </div>
      {/if}
      
      <div class="form-group">
        <label for="username">아이디</label>
        <input 
          type="text" 
          id="username" 
          bind:value={username} 
          placeholder="아이디를 입력하세요" 
          on:keypress={handleKeyPress}
          disabled={loading}
        />
      </div>
      
      <div class="form-group">
        <label for="password">비밀번호</label>
        <input 
          type="password" 
          id="password" 
          bind:value={password} 
          placeholder="비밀번호를 입력하세요" 
          on:keypress={handleKeyPress}
          disabled={loading}
        />
      </div>
      
      <div class="form-check">
        <input type="checkbox" id="remember-me" bind:checked={rememberMe} disabled={loading} />
        <label for="remember-me">자동 로그인</label>
      </div>
      
      <div class="form-actions">
        <Button 
          type="submit" 
          variant="primary" 
          size="lg" 
          fullWidth={true} 
          disabled={loading}
        >
          {loading ? '로그인 중...' : '로그인'}
        </Button>
      </div>
      
      <div class="form-links">
        <a href="/register" class="form-link">회원가입</a>
        <span class="divider">|</span>
        <a href="/find-id" class="form-link">아이디 찾기</a>
        <span class="divider">|</span>
        <a href="/find-password" class="form-link">비밀번호 찾기</a>
      </div>
      
      <div class="login-tips">
        <p>테스트 계정: user1 / password123</p>
      </div>
    </form>
  </div>
</div>

<style>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;
    background-color: #f9fafb;
  }
  
  .login-card {
    width: 100%;
    max-width: 450px;
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 2.5rem;
  }
  
  .login-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .login-title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  .logo-green {
    color: #6bb546;
  }
  
  .logo-blue {
    color: #4c96d7;
  }
  
  .login-subtitle {
    color: #6b7280;
    font-size: 1rem;
  }
  
  .login-form {
    width: 100%;
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
    margin-bottom: 1.25rem;
  }
  
  .form-group label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #4b5563;
    margin-bottom: 0.5rem;
  }
  
  .form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
  }
  
  .form-group input:focus {
    outline: none;
    border-color: #4c96d7;
    box-shadow: 0 0 0 2px rgba(76, 150, 215, 0.2);
  }
  
  .form-check {
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .form-check input {
    margin-right: 0.5rem;
  }
  
  .form-check label {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .form-actions {
    margin-bottom: 1.5rem;
  }
  
  .form-links {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
  }
  
  .form-link {
    font-size: 0.875rem;
    color: #6b7280;
    text-decoration: none;
  }
  
  .form-link:hover {
    color: #4c96d7;
    text-decoration: underline;
  }
  
  .divider {
    margin: 0 0.5rem;
    color: #d1d5db;
  }
  
  .login-tips {
    text-align: center;
    font-size: 0.75rem;
    color: #9ca3af;
    background-color: #f3f4f6;
    padding: 0.5rem;
    border-radius: 0.25rem;
  }
  
  @media (max-width: 640px) {
    .login-card {
      padding: 1.5rem;
    }
  }
</style>
