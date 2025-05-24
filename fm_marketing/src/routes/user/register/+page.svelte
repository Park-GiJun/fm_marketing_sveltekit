<!-- src/routes/user/register/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { userStore } from '$lib/stores/userStore.js';
  import Button from '$lib/components/common/Button.svelte';
  
  // 폼 데이터
  let formData = {
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    nickname: '',
    phone: '',
    birthDate: '',
    gender: '',
    interests: [],
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false
  };
  
  // 상태
  let loading = false;
  let errors = {};
  let step = 1; // 1: 기본정보, 2: 추가정보, 3: 약관동의
  
  // 관심사 옵션
  const interestOptions = [
    '맛집', '뷰티', '패션', '여행', '건강', '문화', '디지털', '생활', '육아', '반려동물'
  ];
  
  // 다음 단계
  function nextStep() {
    if (validateCurrentStep()) {
      step++;
    }
  }
  
  // 이전 단계
  function prevStep() {
    step--;
  }
  
  // 현재 단계 유효성 검사
  function validateCurrentStep() {
    errors = {};
    
    if (step === 1) {
      if (!formData.username.trim()) errors.username = '아이디를 입력해주세요.';
      if (!formData.email.trim()) errors.email = '이메일을 입력해주세요.';
      if (!formData.password.trim()) errors.password = '비밀번호를 입력해주세요.';
      if (formData.password !== formData.passwordConfirm) errors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    }
    
    if (step === 2) {
      if (!formData.name.trim()) errors.name = '이름을 입력해주세요.';
      if (!formData.nickname.trim()) errors.nickname = '닉네임을 입력해주세요.';
      if (!formData.phone.trim()) errors.phone = '전화번호를 입력해주세요.';
    }
    
    return Object.keys(errors).length === 0;
  }
  
  // 관심사 토글
  function toggleInterest(interest) {
    if (formData.interests.includes(interest)) {
      formData.interests = formData.interests.filter(i => i !== interest);
    } else {
      formData.interests = [...formData.interests, interest];
    }
  }
  
  // 전체 약관 동의
  function toggleAllAgreements(e) {
    const checked = e.target.checked;
    formData.agreeTerms = checked;
    formData.agreePrivacy = checked;
    formData.agreeMarketing = checked;
  }
  
  // 회원가입 처리
  async function handleRegister() {
    if (!formData.agreeTerms || !formData.agreePrivacy) {
      errors.agreement = '필수 약관에 동의해주세요.';
      return;
    }
    
    loading = true;
    errors = {};
    
    try {
      await userStore.register(formData);
      alert('회원가입이 완료되었습니다! 로그인해주세요.');
      goto('/login');
    } catch (error) {
      errors.general = '회원가입에 실패했습니다. 다시 시도해주세요.';
    } finally {
      loading = false;
    }
  }
  
  onMount(() => {
    // 이미 로그인된 사용자 체크
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
  <title>회원가입 - FM마케팅</title>
  <meta name="description" content="FM마케팅에 가입하여 다양한 체험단에 참여해보세요." />
</svelte:head>

<div class="register-page">
  <div class="register-container">
    <div class="register-header">
      <a href="/" class="logo">
        <span class="logo-green">FM</span><span class="logo-blue">Marketing</span>
      </a>
      <h1 class="register-title">회원가입</h1>
      <p class="register-subtitle">체험단 마케팅 플랫폼에 가입하세요</p>
    </div>
    
    <!-- 진행 단계 표시 -->
    <div class="step-indicator">
      <div class="step {step >= 1 ? 'active' : ''} {step > 1 ? 'completed' : ''}">
        <span class="step-number">1</span>
        <span class="step-label">기본정보</span>
      </div>
      <div class="step-divider"></div>
      <div class="step {step >= 2 ? 'active' : ''} {step > 2 ? 'completed' : ''}">
        <span class="step-number">2</span>
        <span class="step-label">추가정보</span>
      </div>
      <div class="step-divider"></div>
      <div class="step {step >= 3 ? 'active' : ''}">
        <span class="step-number">3</span>
        <span class="step-label">약관동의</span>
      </div>
    </div>
    
    <form class="register-form" on:submit|preventDefault={step === 3 ? handleRegister : nextStep}>
      {#if errors.general}
        <div class="error-message">{errors.general}</div>
      {/if}
      
      <!-- Step 1: 기본 정보 -->
      {#if step === 1}
        <div class="form-step">
          <h2 class="step-title">기본 정보 입력</h2>
          
          <div class="form-group">
            <label for="username">아이디 *</label>
            <input 
              type="text" 
              id="username" 
              bind:value={formData.username}
              placeholder="영문, 숫자 조합 6-20자"
              class:error={errors.username}
            />
            {#if errors.username}<span class="field-error">{errors.username}</span>{/if}
          </div>
          
          <div class="form-group">
            <label for="email">이메일 *</label>
            <input 
              type="email" 
              id="email" 
              bind:value={formData.email}
              placeholder="example@email.com"
              class:error={errors.email}
            />
            {#if errors.email}<span class="field-error">{errors.email}</span>{/if}
          </div>
          
          <div class="form-group">
            <label for="password">비밀번호 *</label>
            <input 
              type="password" 
              id="password" 
              bind:value={formData.password}
              placeholder="영문, 숫자, 특수문자 조합 8자 이상"
              class:error={errors.password}
            />
            {#if errors.password}<span class="field-error">{errors.password}</span>{/if}
          </div>
          
          <div class="form-group">
            <label for="passwordConfirm">비밀번호 확인 *</label>
            <input 
              type="password" 
              id="passwordConfirm" 
              bind:value={formData.passwordConfirm}
              placeholder="비밀번호를 다시 입력하세요"
              class:error={errors.passwordConfirm}
            />
            {#if errors.passwordConfirm}<span class="field-error">{errors.passwordConfirm}</span>{/if}
          </div>
        </div>
      {/if}
      
      <!-- Step 2: 추가 정보 -->
      {#if step === 2}
        <div class="form-step">
          <h2 class="step-title">추가 정보 입력</h2>
          
          <div class="form-row">
            <div class="form-group">
              <label for="name">이름 *</label>
              <input 
                type="text" 
                id="name" 
                bind:value={formData.name}
                placeholder="실명을 입력하세요"
                class:error={errors.name}
              />
              {#if errors.name}<span class="field-error">{errors.name}</span>{/if}
            </div>
            
            <div class="form-group">
              <label for="nickname">닉네임 *</label>
              <input 
                type="text" 
                id="nickname" 
                bind:value={formData.nickname}
                placeholder="활동에 사용할 닉네임"
                class:error={errors.nickname}
              />
              {#if errors.nickname}<span class="field-error">{errors.nickname}</span>{/if}
            </div>
          </div>
          
          <div class="form-group">
            <label for="phone">전화번호 *</label>
            <input 
              type="tel" 
              id="phone" 
              bind:value={formData.phone}
              placeholder="010-0000-0000"
              class:error={errors.phone}
            />
            {#if errors.phone}<span class="field-error">{errors.phone}</span>{/if}
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="birthDate">생년월일</label>
              <input 
                type="date" 
                id="birthDate" 
                bind:value={formData.birthDate}
              />
            </div>
            
            <div class="form-group">
              <label for="gender">성별</label>
              <select id="gender" bind:value={formData.gender}>
                <option value="">선택안함</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label>관심 분야 (선택)</label>
            <div class="interest-grid">
              {#each interestOptions as interest}
                <button 
                  type="button"
                  class="interest-button {formData.interests.includes(interest) ? 'selected' : ''}"
                  on:click={() => toggleInterest(interest)}
                >
                  {interest}
                </button>
              {/each}
            </div>
          </div>
        </div>
      {/if}
      
      <!-- Step 3: 약관 동의 -->
      {#if step === 3}
        <div class="form-step">
          <h2 class="step-title">약관 동의</h2>
          
          {#if errors.agreement}
            <div class="error-message">{errors.agreement}</div>
          {/if}
          
          <div class="agreement-section">
            <div class="agreement-header">
              <input 
                type="checkbox" 
                id="agreeAll" 
                on:change={toggleAllAgreements}
                checked={formData.agreeTerms && formData.agreePrivacy && formData.agreeMarketing}
              />
              <label for="agreeAll" class="agreement-all">전체 동의</label>
            </div>
            
            <div class="agreement-list">
              <div class="agreement-item">
                <input 
                  type="checkbox" 
                  id="agreeTerms" 
                  bind:checked={formData.agreeTerms}
                />
                <label for="agreeTerms">
                  <span class="required">[필수]</span> 이용약관 동의
                </label>
                <a href="/terms" target="_blank" class="agreement-link">보기</a>
              </div>
              
              <div class="agreement-item">
                <input 
                  type="checkbox" 
                  id="agreePrivacy" 
                  bind:checked={formData.agreePrivacy}
                />
                <label for="agreePrivacy">
                  <span class="required">[필수]</span> 개인정보처리방침 동의
                </label>
                <a href="/privacy" target="_blank" class="agreement-link">보기</a>
              </div>
              
              <div class="agreement-item">
                <input 
                  type="checkbox" 
                  id="agreeMarketing" 
                  bind:checked={formData.agreeMarketing}
                />
                <label for="agreeMarketing">
                  <span class="optional">[선택]</span> 마케팅 정보 수신 동의
                </label>
                <a href="/marketing" target="_blank" class="agreement-link">보기</a>
              </div>
            </div>
          </div>
        </div>
      {/if}
      
      <!-- 폼 액션 버튼 -->
      <div class="form-actions">
        {#if step > 1}
          <Button 
            type="button" 
            variant="outline" 
            size="lg" 
            on:click={prevStep}
          >
            이전
          </Button>
        {/if}
        
        <Button 
          type="submit" 
          variant="primary" 
          size="lg" 
          fullWidth={step === 1}
          disabled={loading}
        >
          {#if step === 3}
            {loading ? '가입 중...' : '회원가입 완료'}
          {:else}
            다음
          {/if}
        </Button>
      </div>
    </form>
    
    <!-- 로그인 링크 -->
    <div class="login-link-section">
      <p>이미 계정이 있으신가요? <a href="/login">로그인</a></p>
    </div>
  </div>
</div>

<style>
  .register-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #5ce0c6 0%, #ff7eb6 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
  
  .register-container {
    width: 100%;
    max-width: 600px;
    background-color: white;
    border-radius: 1rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    padding: 3rem;
  }
  
  .register-header {
    text-align: center;
    margin-bottom: 3rem;
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
  
  .register-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
  }
  
  .register-subtitle {
    color: #6b7280;
    margin: 0;
  }
  
  .step-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 3rem;
  }
  
  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  
  .step-number {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background-color: #e5e7eb;
    color: #9ca3af;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    transition: all 0.3s;
  }
  
  .step.active .step-number {
    background-color: #5ce0c6;
    color: white;
  }
  
  .step.completed .step-number {
    background-color: #10b981;
    color: white;
  }
  
  .step-label {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
  }
  
  .step.active .step-label {
    color: #1f2937;
  }
  
  .step-divider {
    width: 3rem;
    height: 2px;
    background-color: #e5e7eb;
    margin: 0 1rem;
  }
  
  .register-form {
    margin-bottom: 2rem;
  }
  
  .error-message {
    background-color: #fee2e2;
    color: #dc2626;
    padding: 0.75rem;
    border-radius: 0.375rem;
    margin-bottom: 1.5rem;
    font-size: 0.875rem;
    text-align: center;
  }
  
  .form-step {
    min-height: 400px;
  }
  
  .step-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 2rem 0;
    text-align: center;
  }
  
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
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
  .form-group select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    transition: border-color 0.2s;
  }
  
  .form-group input:focus,
  .form-group select:focus {
    outline: none;
    border-color: #5ce0c6;
    box-shadow: 0 0 0 2px rgba(92, 224, 198, 0.2);
  }
  
  .form-group input.error {
    border-color: #dc2626;
  }
  
  .field-error {
    display: block;
    color: #dc2626;
    font-size: 0.75rem;
    margin-top: 0.25rem;
  }
  
  .interest-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  
  .interest-button {
    padding: 0.5rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 1.5rem;
    background-color: white;
    font-size: 0.875rem;
    color: #4b5563;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .interest-button:hover {
    border-color: #5ce0c6;
  }
  
  .interest-button.selected {
    background-color: #5ce0c6;
    border-color: #5ce0c6;
    color: white;
  }
  
  .agreement-section {
    background-color: #f9fafb;
    border-radius: 0.5rem;
    padding: 1.5rem;
  }
  
  .agreement-header {
    display: flex;
    align-items: center;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .agreement-header input {
    margin-right: 0.75rem;
    transform: scale(1.2);
  }
  
  .agreement-all {
    font-weight: 600;
    color: #1f2937;
    cursor: pointer;
  }
  
  .agreement-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .agreement-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .agreement-item input {
    transform: scale(1.1);
  }
  
  .agreement-item label {
    flex: 1;
    font-size: 0.875rem;
    color: #4b5563;
    cursor: pointer;
  }
  
  .required {
    color: #dc2626;
    font-weight: 600;
  }
  
  .optional {
    color: #10b981;
    font-weight: 600;
  }
  
  .agreement-link {
    color: #6b7280;
    text-decoration: underline;
    font-size: 0.75rem;
  }
  
  .form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .login-link-section {
    text-align: center;
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .login-link-section a {
    color: #5ce0c6;
    text-decoration: none;
    font-weight: 500;
  }
  
  .login-link-section a:hover {
    text-decoration: underline;
  }
  
  @media (max-width: 768px) {
    .register-container {
      padding: 2rem;
    }
    
    .form-row {
      grid-template-columns: 1fr;
    }
    
    .step-indicator {
      margin-bottom: 2rem;
    }
    
    .step-divider {
      width: 2rem;
      margin: 0 0.5rem;
    }
    
    .interest-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 480px) {
    .register-page {
      padding: 1rem;
    }
    
    .register-container {
      padding: 1.5rem;
    }
    
    .interest-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
