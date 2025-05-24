// src/lib/stores/userStore.js
import { writable } from 'svelte/store';
import { apiClient, tokenManager } from '$lib/utils/api.js';

// 사용자 인증 상태를 위한 스토어
function createUserStore() {
  // 초기 상태
  const initialState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null
  };

  const { subscribe, set, update } = writable(initialState);

  return {
    subscribe,
    
    // 로그인 액션
    login: async (username, password) => {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        const response = await apiClient.post('/auth/login', {
          username,
          password
        });
        
        const { user, token } = response.data;
        
        // 토큰 저장 및 설정
        tokenManager.set(token);
        
        update(state => ({
          ...state,
          isAuthenticated: true,
          user,
          loading: false
        }));
        
        return user;
      } catch (error) {
        const errorMessage = error.response?.data?.error || error.message || '로그인 중 오류가 발생했습니다.';
        update(state => ({
          ...state,
          loading: false,
          error: errorMessage
        }));
        throw new Error(errorMessage);
      }
    },
    
    // 로그아웃 액션
    logout: () => {
      tokenManager.remove();
      update(state => ({
        ...state,
        isAuthenticated: false,
        user: null,
        error: null
      }));
    },
    
    // 회원가입 액션
    register: async (userData) => {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        const response = await apiClient.post('/auth/register', userData);
        const { user, token } = response.data;
        
        // 토큰 저장 및 설정
        tokenManager.set(token);
        
        update(state => ({
          ...state,
          isAuthenticated: true,
          user,
          loading: false
        }));
        
        return user;
      } catch (error) {
        const errorMessage = error.response?.data?.error || error.message || '회원가입 중 오류가 발생했습니다.';
        update(state => ({
          ...state,
          loading: false,
          error: errorMessage
        }));
        throw new Error(errorMessage);
      }
    },
    
    // 사용자 정보 업데이트 액션
    updateProfile: async (userData) => {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        const response = await apiClient.put('/auth/profile', userData);
        const updatedUser = response.data;
        
        update(state => ({
          ...state,
          loading: false,
          user: updatedUser
        }));
        
        return updatedUser;
      } catch (error) {
        const errorMessage = error.response?.data?.error || error.message || '프로필 업데이트 중 오류가 발생했습니다.';
        update(state => ({
          ...state,
          loading: false,
          error: errorMessage
        }));
        throw new Error(errorMessage);
      }
    },

    // 초기 인증 상태 확인
    initialize: async () => {
      const token = tokenManager.get();
      if (!token) return;

      try {
        update(state => ({ ...state, loading: true }));
        const response = await apiClient.get('/auth/profile');
        update(state => ({
          ...state,
          isAuthenticated: true,
          user: response.data,
          loading: false
        }));
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
        tokenManager.remove();
        update(state => ({
          ...state,
          isAuthenticated: false,
          user: null,
          loading: false
        }));
      }
    },
    
    // 오류 상태 초기화
    clearError: () => {
      update(state => ({ ...state, error: null }));
    }
  };
}

// 스토어 인스턴스 생성 및 내보내기
export const userStore = createUserStore();
