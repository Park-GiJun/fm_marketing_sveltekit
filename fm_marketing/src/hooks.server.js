// SvelteKit 서버 훅
import { initializeDatabase } from '$lib/server/database-init.js';
import { getUserFromRequest } from '$lib/server/auth.js';

// 앱 시작 시 데이터베이스 초기화
let isInitialized = false;

async function ensureDbInitialized() {
  if (!isInitialized) {
    try {
      await initializeDatabase();
      isInitialized = true;
    } catch (error) {
      console.error('데이터베이스 초기화 실패:', error);
      // 개발 환경에서는 에러를 던지지 않고 로그만 출력
      if (process.env.NODE_ENV === 'production') {
        throw error;
      }
    }
  }
}

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  // 데이터베이스 초기화 확인
  await ensureDbInitialized();

  // API 요청에 대한 CORS 헤더 설정
  if (event.url.pathname.startsWith('/api')) {
    // 사용자 인증 정보 추가
    const user = await getUserFromRequest(event.request);
    event.locals.user = user;
  }

  const response = await resolve(event);

  // CORS 헤더 추가
  if (event.url.pathname.startsWith('/api')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  return response;
}

/** @type {import('@sveltejs/kit').HandleServerError} */
export async function handleError({ error, event }) {
  console.error('서버 에러:', error);
  
  return {
    message: '서버에서 오류가 발생했습니다.',
    code: error?.code ?? 'UNKNOWN'
  };
}
