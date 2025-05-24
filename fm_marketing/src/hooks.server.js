// SvelteKit 서버 훅 - MySQL2 전용
let isInitialized = false;
let initializationPromise = null;

async function ensureDbInitialized() {
  if (isInitialized) {
    return true;
  }
  
  if (initializationPromise) {
    return await initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      console.log('🔄 MySQL 데이터베이스 초기화 중...');
      
      const { initializeDatabase } = await import('$lib/server/database.js');
      await initializeDatabase();
      
      isInitialized = true;
      console.log('✅ MySQL 데이터베이스 초기화 완료');
      return true;
      
    } catch (error) {
      console.error('❌ 데이터베이스 초기화 실패:', error.message);
      isInitialized = false;
      initializationPromise = null;
      throw new Error(`데이터베이스 연결 실패: ${error.message}`);
    }
  })();

  return await initializationPromise;
}

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  // 서버에서만 데이터베이스 초기화
  if (typeof window === 'undefined' && !isInitialized) {
    try {
      await ensureDbInitialized();
    } catch (error) {
      console.error('데이터베이스 초기화 실패:', error.message);
      
      if (event.url.pathname.startsWith('/api')) {
        return new Response(JSON.stringify({ 
          error: '데이터베이스 연결 오류', 
          message: error.message
        }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>서비스 점검 중</title>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .error { color: #d32f2f; }
          </style>
        </head>
        <body>
          <h1 class="error">🚨 서비스 일시 중단</h1>
          <p>데이터베이스 연결 문제로 서비스가 일시 중단되었습니다.</p>
          <p>오류: ${error.message}</p>
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

  // CORS 헤더 추가
  if (event.url.pathname.startsWith('/api')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
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
    timestamp: new Date().toISOString()
  });
  
  return {
    message: process.env.NODE_ENV === 'development' 
      ? `서버 오류: ${error.message}` 
      : '서버에서 오류가 발생했습니다.',
    code: error?.code ?? 'UNKNOWN'
  };
}
