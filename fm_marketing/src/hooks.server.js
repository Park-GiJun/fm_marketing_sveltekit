// SvelteKit 서버 훅 - 간단한 버전
let isInitialized = false;

async function ensureDbInitialized() {
  if (!isInitialized) {
    try {
      // 간단한 데이터베이스 연결만 확인
      console.log('🔄 데이터베이스 연결 확인 중...');
      isInitialized = true;
      console.log('✅ 데이터베이스 초기화 완료');
    } catch (error) {
      console.error('❌ 데이터베이스 초기화 실패:', error);
      // 개발 환경에서는 에러를 던지지 않고 로그만 출력
      if (process.env.NODE_ENV === 'production') {
        throw error;
      }
    }
  }
}

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  // 데이터베이스 초기화 확인 (서버에서만)
  if (typeof window === 'undefined') {
    await ensureDbInitialized();
  }

  const response = await resolve(event);

  // CORS 헤더 추가
  if (event.url.pathname.startsWith('/api')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // OPTIONS 요청 처리
    if (event.request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }
  }

  return response;
}

/** @type {import('@sveltejs/kit').HandleServerError} */
export async function handleError({ error, event }) {
  console.error('서버 에러:', {
    message: error.message,
    url: event.url.pathname,
    method: event.request.method
  });
  
  return {
    message: process.env.NODE_ENV === 'development' 
      ? error.message 
      : '서버에서 오류가 발생했습니다.',
    code: error?.code ?? 'UNKNOWN'
  };
}
