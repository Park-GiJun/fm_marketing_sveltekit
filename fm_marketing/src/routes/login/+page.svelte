<script>
  let email = '';
  let password = '';
  
  function handleSubmit() {
    // 로그인 로직 구현
    console.log('로그인 시도:', { email, password });
  }
</script>

<svelte:head>
  <title>FM 마케팅 - 로그인</title>
</svelte:head>

<div class="container mx-auto px-4 py-12">
  <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
    <h1 class="text-2xl font-bold text-center mb-6 text-sky-800">로그인</h1>
    
    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">이메일</label>
        <input 
          type="email" 
          id="email" 
          bind:value={email} 
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          required
        />
      </div>
      
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
        <input 
          type="password" 
          id="password" 
          bind:value={password} 
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          required
        />
      </div>
      
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input id="remember" type="checkbox" class="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded">
          <label for="remember" class="ml-2 block text-sm text-gray-700">로그인 상태 유지</label>
        </div>
        
        <a href="/forgot-password" class="text-sm text-sky-600 hover:text-sky-700">비밀번호를 잊으셨나요?</a>
      </div>
      
      <button 
        type="submit" 
        class="w-full bg-sky-600 text-white py-2 px-4 rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
      >
        로그인
      </button>
    </form>
    
    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">계정이 없으신가요? <a href="/register" class="text-sky-600 hover:text-sky-700">회원가입</a></p>
    </div>
  </div>
</div>
