<!-- src/routes/register/+page.svelte -->
<script>
  import { userStore } from '$lib/stores/userStore.js';
  import { goto } from '$app/navigation';
  import Button from '$lib/components/common/Button.svelte';

  let formData = {
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    nickname: '',
    phone: '',
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false
  };
  
  let errors = {};
  let loading = false;
  
  async function handleRegister() {
    // 유효성 검사
    errors = {};
    
    if (!formData.username) errors.username = '아이디를 입력해주세요.';
    if (!formData.email) errors.email = '이메일을 입력해주세요.';
    if (!formData.password) errors.password = '비밀번호를 입력해주세요.';
    if (formData.password !== formData.passwordConfirm) errors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    if (!formData.name) errors.name = '이름을 입력해주세요.';
    if (!formData.nickname) errors.nickname = '닉네임을 입력해주세요.';
    if (!formData.phone) errors.phone = '전화번호를 입력해주세요.';
    if (!formData.agreeTerms) errors.agreeTerms = '이용약관에 동의해주세요.';
    if (!formData.agreePrivacy) errors.agreePrivacy = '개인정보처리방침에 동의해주세요.';
    
    if (Object.keys(errors).length > 0) return;
    
    loading = true;
    
    try {
      await userStore.register(formData);
      goto('/');
    } catch (error) {
      errors.general = '회원가입에 실패했습니다.';
    } finally {
      loading = false;
    }
  }
  
  function checkAll(e) {
    const checked = e.target.checked;
    formData.agreeTerms = checked;
    formData.agreePrivacy = checked;
    formData.agreeMarketing = checked;
  }
</script>

<svelte:head>
  <title>회원가입 - FM마케팅</title>
</svelte:head>

<div class="register-container">
  <div class="register-card">
    <div class="register-header">
      <h1 class="register-title">
        <span class="logo-green">FM</span><span class="logo-blue">Marketing</span>
      </h1>
      <p class="register-subtitle">회원가입</p>
    </div>
    
    <form class="register-form" on:submit|preventDefault={handleRegister}>
      {#if errors.general}
        <div class="error-message">{errors.general}</div>
      {/if}
      
      <div class="form-group">
        <label for="username">아이디 *</label>
        <input type="text" id="username" bind:value={formData.username} />
        {#if errors.username}<span class="field-error">{errors.username}</span>{/if}
      </div>
      
      <div class="form-group">
        <label for="email">이메일 *</label>
        <input type="email" id="email" bind:value={formData.email} />
        {#if errors.email}<span class="field-error">{errors.email}</span>{/if}
      </div>
      
      <div class="form-group">
        <label for="password">비밀번호 *</label>
        <input type="password" id="password" bind:value={formData.password} />
        {#if errors.password}<span class="field-error">{errors.password}</span>{/if}
      </div>
      
      <div class="form-group">
        <label for="passwordConfirm">비밀번호 확인 *</label>
        <input type="password" id="passwordConfirm" bind:value={formData.passwordConfirm} />
        {#if errors.passwordConfirm}<span class="field-error">{errors.passwordConfirm}</span>{/if}
      </div>
      
      <div class="form-group">
        <label for="name">이름 *</label>
        <input type="text" id="name" bind:value={formData.name} />
        {#if errors.name}<span class="field-error">{errors.name}</span>{/if}
      </div>
      
      <div class="form-group">
        <label for="nickname">닉네임 *</label>
        <input type="text" id="nickname" bind:value={formData.nickname} />
        {#if errors.nickname}<span class="field-error">{errors.nickname}</span>{/if}
      </div>
      
      <div class="form-group">
        <label for="phone">전화번호 *</label>
        <input type="tel" id="phone" bind:value={formData.phone} placeholder="010-0000-0000" />
        {#if errors.phone}<span class="field-error">{errors.phone}</span>{/if}
      </div>
      
      <div class="agreement-section">
        <div class="agreement-header">
          <input type="checkbox" id="agreeAll" on:change={checkAll} />
          <label for="agreeAll">전체 동의</label>
        </div>
        
        <div class="agreement-item">
          <input type="checkbox" id="agreeTerms" bind:checked={formData.agreeTerms} />
          <label for="agreeTerms">[필수] 이용약관 동의</label>
          <a href="/terms" class="agreement-link">보기</a>
        </div>
        
        <div class="agreement-item">
          <input type="checkbox" id="agreePrivacy" bind:checked={formData.agreePrivacy} />
          <label for="agreePrivacy">[필수] 개인정보처리방침 동의</label>
          <a href="/privacy" class="agreement-link">보기</a>
        </div>
        
        <div class="agreement-item">
          <input type="checkbox" id="agreeMarketing" bind:checked={formData.agreeMarketing} />
          <label for="agreeMarketing">[선택] 마케팅 정보 수신 동의</label>
        </div>
      </div>
      
      <div class="form-actions">
        <Button type="submit" variant="primary" size="lg" fullWidth={true} disabled={loading}>
          {loading ? '가입 중...' : '회원가입'}
        </Button>
      </div>
      
      <div class="form-footer">
        <p>이미 계정이 있으신가요? <a href="/login">로그인</a></p>
      </div>
    </form>
  </div>
</div>

<style>
  .register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;
    background-color: #f9fafb;
  }
  
  .register-card {
    width: 100%;
    max-width: 500px;
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 2.5rem;
  }
  
  .register-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .register-title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  .logo-green {
    color: #5ce0c6;
  }
  
  .logo-blue {
    color: #ff7eb6;
  }
  
  .register-subtitle {
    color: #6b7280;
    font-size: 1rem;
  }
  
  .register-form {
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
    border-color: #5ce0c6;
    box-shadow: 0 0 0 2px rgba(92, 224, 198, 0.2);
  }
  
  .field-error {
    display: block;
    color: #dc2626;
    font-size: 0.75rem;
    margin-top: 0.25rem;
  }
  
  .agreement-section {
    margin: 1.5rem 0;
    padding: 1rem;
    background-color: #f9fafb;
    border-radius: 0.375rem;
  }
  
  .agreement-header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .agreement-item {
    display: flex;
    align-items: center;
    margin-bottom: 0.75rem;
    font-size: 0.875rem;
  }
  
  .agreement-item input {
    margin-right: 0.5rem;
  }
  
  .agreement-item label {
    flex: 1;
    color: #4b5563;
  }
  
  .agreement-link {
    color: #6b7280;
    text-decoration: underline;
    font-size: 0.75rem;
  }
  
  .form-actions {
    margin-bottom: 1.5rem;
  }
  
  .form-footer {
    text-align: center;
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .form-footer a {
    color: #5ce0c6;
    text-decoration: none;
  }
  
  .form-footer a:hover {
    text-decoration: underline;
  }
</style>
