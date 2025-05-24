<!-- src/routes/user/login/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { userStore } from '$lib/stores/userStore.js';
  import LoginForm from '$lib/components/user/LoginForm.svelte';
  
  let loginForm;
  let redirectUrl = '/';
  
  // 로그인 처리
  async function handleLogin(event) {
    const { username, password, rememberMe } = event.detail;
    
    try {
      await userStore.login(username, password);
      
      // 자동 로그인 처리
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      
      // 리다이렉트
      goto(redirectUrl);
    } catch (error) {
      loginForm.setError(error.message);
    }
  }
  
  // 소셜 로그인 처리
  function handleSocialLogin(provider) {
    alert(`${provider} 로그인은 준비 중입니다.`);
  }
  
  onMount(() => {
    // 리다이렉트 URL 확인
    const redirect = $page.url.searchParams.get('redirect');
    if (redirect) {
      redirectUrl = decodeURIComponent(redirect);
    }
    
    // 이미 로그인된 사용자 체크
    const unsubscribe = userStore.subscribe(state => {
      if (state.isAuthenticated) {
        goto(redirectUrl);
      }
    });
    
    return () => {
      unsubscribe();
    };
  });
</script>

<svelte:head>
  <title>로그인 - FM마케팅</title>
  <meta name="description" content="FM마케팅에 로그인하여 다양한 체험단에 참여해보세요." />
</svelte:head>

<div class="login-page">
  <div class="login-container">
    <div class="login-card">
      <!-- 로고 및 헤더 -->
      <div class="login-header">
        <a href="/" class="logo">
          <span class="logo-green">FM</span><span class="logo-blue">Marketing</span>
        </a>
        <h1 class="login-title">로그인</h1>
        <p class="login-subtitle">체험단 마케팅 플랫폼에 오신 것을 환영합니다</p>
      </div>
      
      <!-- 로그인 폼 -->
      <LoginForm bind:this={loginForm} on:login={handleLogin} />
      
      <!-- 소셜 로그인 -->
      <div class="social-login">
        <div class="divider">
          <span>또는</span>
        </div>
        
        <div class="social-buttons">
          <button 
            class="social-button kakao" 
            on:click={() => handleSocialLogin('카카오')}
          >
            <div class="social-icon kakao-icon">K</div>
            카카오로 로그인
          </button>
          
          <button 
            class="social-button naver" 
            on:click={() => handleSocialLogin('네이버')}
          >
            <div class="social-icon naver-icon">N</div>
            네이버로 로그인
          </button>
          
          <button 
            class="social-button google" 
            on:click={() => handleSocialLogin('구글')}
          >
            <div class="social-icon google-icon">G</div>
            구글로 로그인
          </button>
        </div>
      </div>
      
      <!-- 추가 링크 -->
      <div class="additional-links">
        <div class="signup-link">
          아직 계정이 없으신가요? 
          <a href="/register">회원가입</a>
        </div>
        
        <div class="help-links">
          <a href="/find-account">계정 찾기</a>
          <span class="separator">·</span>
          <a href="/support">고객센터</a>
        </div>
      </div>
    </div>
    
    <!-- 사이드 정보 -->
    <div class="info-panel">
      <div class="info-content">
        <h2 class="info-title">FM마케팅과 함께하세요</h2>
        <ul class="info-list">
          <li>
            <div class="info-icon">✨</div>
            <div class="info-text">
              <strong>무료 체험 기회</strong>
              <span>다양한 브랜드의 제품과 서비스를 무료로 체험하세요</span>
            </div>
          </li>
          <li>
            <div class="info-icon">💎</div>
            <div class="info-text">
              <strong>포인트 적립</strong>
              <span>체험단 활동으로 포인트를 적립하고 현금으로 환급받으세요</span>
            </div>
          </li>
          <li>
            <div class="info-icon">🤝</div>
            <div class="info-text">
              <strong>커뮤니티 활동</strong>
              <span>다른 체험단과 정보를 공유하고 소통하세요</span>
            </div>
          </li>
          <li>
            <div class="info-icon">📱</div>
            <div class="info-text">
              <strong>간편한 관리</strong>
              <span>체험단 신청부터 후기 작성까지 한 곳에서 관리하세요</span>
            </div>
          </li>
        </ul>
        
        <div class="stats">
          <div class="stat-item">
            <span class="stat-number">1,247</span>
            <span class="stat-label">진행된 체험단</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">3,429</span>
            <span class="stat-label">활동 중인 회원</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">4.8</span>
            <span class="stat-label">평균 만족도</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .login-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #5ce0c6 0%, #ff7eb6 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
  
  .login-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    max-width: 1000px;
    width: 100%;
    background-color: white;
    border-radius: 1rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .login-card {
    padding: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .login-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .logo {
    display: inline-block;
    font-size: 2rem;
    font-weight: bold;
    text-decoration: none;
    margin-bottom: 1rem;
  }
  
  .logo-green {
    color: #5ce0c6;
  }
  
  .logo-blue {
    color: #ff7eb6;
  }
  
  .login-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
  }
  
  .login-subtitle {
    color: #6b7280;
    margin: 0;
  }
  
  .social-login {
    margin: 2rem 0;
  }
  
  .divider {
    position: relative;
    text-align: center;
    margin: 1.5rem 0;
  }
  
  .divider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background-color: #e5e7eb;
  }
  
  .divider span {
    background-color: white;
    padding: 0 1rem;
    color: #9ca3af;
    font-size: 0.875rem;
  }
  
  .social-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .social-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    background-color: white;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .social-button:hover {
    border-color: #d1d5db;
    background-color: #f9fafb;
  }
  
  .social-icon {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.875rem;
    color: white;
  }
  
  .kakao-icon {
    background-color: #fee500;
    color: #3a1d1d;
  }
  
  .naver-icon {
    background-color: #03c75a;
  }
  
  .google-icon {
    background-color: #4285f4;
  }
  
  .additional-links {
    text-align: center;
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .signup-link {
    margin-bottom: 1rem;
  }
  
  .signup-link a {
    color: #5ce0c6;
    text-decoration: none;
    font-weight: 500;
  }
  
  .signup-link a:hover {
    text-decoration: underline;
  }
  
  .help-links {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
  }
  
  .help-links a {
    color: #9ca3af;
    text-decoration: none;
  }
  
  .help-links a:hover {
    color: #6b7280;
    text-decoration: underline;
  }
  
  .separator {
    color: #d1d5db;
  }
  
  .info-panel {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: white;
  }
  
  .info-content {
    max-width: 400px;
  }
  
  .info-title {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0 0 2rem 0;
  }
  
  .info-list {
    list-style: none;
    padding: 0;
    margin: 0 0 2rem 0;
  }
  
  .info-list li {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .info-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }
  
  .info-text {
    display: flex;
    flex-direction: column;
  }
  
  .info-text strong {
    font-weight: 600;
    margin-bottom: 0.25rem;
  }
  
  .info-text span {
    font-size: 0.875rem;
    opacity: 0.9;
  }
  
  .stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .stat-item {
    text-align: center;
  }
  
  .stat-number {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }
  
  .stat-label {
    font-size: 0.75rem;
    opacity: 0.8;
  }
  
  @media (max-width: 768px) {
    .login-container {
      grid-template-columns: 1fr;
    }
    
    .info-panel {
      order: -1;
      padding: 2rem;
    }
    
    .login-card {
      padding: 2rem;
    }
    
    .stats {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }
    
    .info-list li {
      margin-bottom: 1rem;
    }
  }
  
  @media (max-width: 480px) {
    .login-page {
      padding: 1rem;
    }
    
    .login-card, .info-panel {
      padding: 1.5rem;
    }
  }
</style>
