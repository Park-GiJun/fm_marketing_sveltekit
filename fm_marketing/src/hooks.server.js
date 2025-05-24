// SvelteKit 서버 훅 - 무조건 DB 사용 버전
let isInitialized = false;
/**
 * @type {Promise<boolean> | null}
 */
let initializationPromise = null;

async function ensureDbInitialized() {
  // 이미 초기화되었으면 바로 반환
  if (isInitialized) {
    return true;
  }
  
  // 초기화가 진행 중이면 해당 Promise를 기다림
  if (initializationPromise) {
    return await initializationPromise;
  }

  // 새로운 초기화 시작
  initializationPromise = (async () => {
    try {
      console.log('🔄 데이터베이스 초기화 중...');
      
      // MySQL2 데이터베이스 초기화
      const { initializeDatabase } = await import('$lib/server/database.js');
      await initializeDatabase();
      
      isInitialized = true;
      console.log('✅ 데이터베이스 초기화 완료');
      return true;
      
    } catch (error) {
      console.error('❌ 데이터베이스 초기화 실패:', error.message);
      
      // 초기화 실패 시 상태 리셋하여 재시도 가능하게 함
      isInitialized = false;
      initializationPromise = null;
      
      // 무조건 DB를 사용해야 하므로 에러를 던짐
      throw new Error(`데이터베이스 연결 필수: ${error.message}`);
    }
  })();

  return await initializationPromise;
}

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  // 서버에서만 데이터베이스 초기화 시도
  if (typeof window === 'undefined' && !isInitialized) {
    try {
      await ensureDbInitialized();
    } catch (error) {
      console.error('데이터베이스 초기화 실패:', error.message);
      
      // API 요청에 대해서는 에러 응답 반환
      if (event.url.pathname.startsWith('/api')) {
        return new Response(JSON.stringify({ 
          error: '데이터베이스 연결 오류', 
          message: '데이터베이스에 연결할 수 없습니다. 서버 관리자에게 문의하세요.',
          details: error.message
        }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // 일반 페이지 요청도 에러 페이지로 리다이렉트
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>서비스 점검 중</title>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .error { color: #d32f2f; }
            .details { background: #f5f5f5; padding: 20px; margin: 20px; border-radius: 8px; }
          </style>
        </head>
        <body>
          <h1 class="error">🚨 서비스 일시 중단</h1>
          <p>데이터베이스 연결 문제로 서비스가 일시 중단되었습니다.</p>
          <div class="details">
            <h3>오류 정보:</h3>
            <p>${error.message}</p>
          </div>
          <p>잠시 후 다시 시도해주세요.</p>
          <button onclick="window.location.reload()">새로고침</button>
        </body>
        </html>
      `, {
        status: 503,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
  }

  const response = await resolve(event);

  // CORS 헤더 추가 (API 요청에만)
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
    timestamp: new Date().toISOString(),
    stack: error.stack
  });
  
  return {
    message: process.env.NODE_ENV === 'development' 
      ? `서버 오류: ${error.message}` 
      : '서버에서 오류가 발생했습니다.',
    code: error?.code ?? 'UNKNOWN'
  };
}
