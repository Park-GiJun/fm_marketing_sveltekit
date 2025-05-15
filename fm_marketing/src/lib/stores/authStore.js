
import { writable } from 'svelte/store';

// 초기 상태
const initialState = {
  isAuthenticated: false,
  user: null,
  error: null,
  loading: false
};

// 스토어 생성
function createAuthStore() {
  const { subscribe, set, update } = writable(initialState);

  return {
    subscribe,
    // 로그인 메서드
    login: async (email, password) => {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        // 실제 API 호출로 대체해야 함
        const response = await mockLogin(email, password);
        
        if (response.success) {
          update(state => ({ 
            ...state, 
            isAuthenticated: true, 
            user: response.user, 
            loading: false 
          }));
          
          // 로컬 스토리지에 토큰 저장
          localStorage.setItem('token', response.token);
          
          return response.user;
        } else {
          update(state => ({ 
            ...state, 
            error: response.message, 
            loading: false 
          }));
          
          throw new Error(response.message);
        }
      } catch (error) {
        update(state => ({ 
          ...state, 
          error: error.message || '로그인 중 오류가 발생했습니다.', 
          loading: false 
        }));
        
        throw error;
      }
    },
    
    // 로그아웃 메서드
    logout: () => {
      localStorage.removeItem('token');
      set(initialState);
    },
    
    // 인증 상태 확인 메서드 (페이지 새로고침 시 등에 사용)
    checkAuth: async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return false;
      }
      
      update(state => ({ ...state, loading: true }));
      
      try {
        // 실제 API 호출로 대체해야 함
        const response = await mockCheckAuth(token);
        
        if (response.success) {
          update(state => ({ 
            ...state, 
            isAuthenticated: true, 
            user: response.user, 
            loading: false 
          }));
          
          return true;
        } else {
          localStorage.removeItem('token');
          set(initialState);
          return false;
        }
      } catch (error) {
        localStorage.removeItem('token');
        set(initialState);
        return false;
      }
    },
    
    // 에러 초기화 메서드
    clearError: () => {
      update(state => ({ ...state, error: null }));
    }
  };
}

// 목업 로그인 API (실제 구현에서는 제거)
async function mockLogin(email, password) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (email === 'admin@example.com' && password === 'password') {
        resolve({
          success: true,
          user: {
            id: 1,
            name: '관리자',
            email: 'admin@example.com',
            role: 'ROLE_ADMIN'
          },
          token: 'mock-jwt-token-for-admin'
        });
      } else if (email === 'blogger@example.com' && password === 'password') {
        resolve({
          success: true,
          user: {
            id: 2,
            name: '블로거',
            email: 'blogger@example.com',
            role: 'ROLE_BLOGGER'
          },
          token: 'mock-jwt-token-for-blogger'
        });
      } else if (email === 'store@example.com' && password === 'password') {
        resolve({
          success: true,
          user: {
            id: 3,
            name: '가게 사장님',
            email: 'store@example.com',
            role: 'ROLE_STORE'
          },
          token: 'mock-jwt-token-for-store'
        });
      } else {
        resolve({
          success: false,
          message: '이메일 또는 비밀번호가 올바르지 않습니다.'
        });
      }
    }, 800); // 네트워크 지연 시뮬레이션
  });
}

// 목업 인증 확인 API (실제 구현에서는 제거)
async function mockCheckAuth(token) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (token === 'mock-jwt-token-for-admin') {
        resolve({
          success: true,
          user: {
            id: 1,
            name: '관리자',
            email: 'admin@example.com',
            role: 'ROLE_ADMIN'
          }
        });
      } else if (token === 'mock-jwt-token-for-blogger') {
        resolve({
          success: true,
          user: {
            id: 2,
            name: '블로거',
            email: 'blogger@example.com',
            role: 'ROLE_BLOGGER'
          }
        });
      } else if (token === 'mock-jwt-token-for-store') {
        resolve({
          success: true,
          user: {
            id: 3,
            name: '가게 사장님',
            email: 'store@example.com',
            role: 'ROLE_STORE'
          }
        });
      } else {
        resolve({
          success: false,
          message: '유효하지 않은 인증 토큰입니다.'
        });
      }
    }, 500); // 네트워크 지연 시뮬레이션
  });
}

// 스토어 인스턴스 생성 및 내보내기
export const authStore = createAuthStore();
