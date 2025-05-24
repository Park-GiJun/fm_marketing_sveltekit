// SvelteKit 서버 훅 - MySQL2 사용
let isInitialized = false;

async function ensureDbInitialized() {
  if (!isInitialized) {
    try {
      console.log('🔄 데이터베이스 초기화 중...');
      
      // MySQL2 데이터베이스 초기화
      const { initializeDatabase } = await import('$lib/server/database.js');
      await initializeDatabase();
      
      isInitialized = true;
      console.log('✅ 데이터베이스 초기화 완료');
    } catch (error) {
      console.error('❌ 데이터베이스 초기화 실패:', error);
      
      // 개발/프로덕션 환경 모두에서 에러 발생 시 실패
      throw new Error(`데이터베이스 연결 실패: ${error.message}`);
    }
  }
}

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  // 데이터베이스 초기화 확인 (서버에서만)
  if (typeof window === 'undefined') {
    try {
      await ensureDbInitialized();
    } catch (error) {
      // API 요청에 대해서는 에러 응답 반환
      if (event.url.pathname.startsWith('/api')) {
        return new Response(JSON.stringify({ 
          error: '데이터베이스 연결 오류', 
          message: error.message 
        }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // 일반 페이지 요청은 계속 진행하되 콘솔에 에러 로그
      console.error('데이터베이스 연결 실패로 인한 제한된 기능:', error.message);
    }
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
    method: event.request.method,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
  
  return {
    message: process.env.NODE_ENV === 'development' 
      ? error.message 
      : '서버에서 오류가 발생했습니다.',
    code: error?.code ?? 'UNKNOWN'
  };
}
