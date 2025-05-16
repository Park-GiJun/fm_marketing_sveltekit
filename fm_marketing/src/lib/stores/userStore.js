// src/lib/stores/userStore.js
import { writable } from 'svelte/store';

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

  // 더미 유저 데이터
  const dummyUsers = [
    { id: 1, username: 'user1', email: 'user1@example.com', password: 'password123', name: '홍길동', nickname: '길동이', profileImage: '/images/profile1.jpg' },
    { id: 2, username: 'user2', email: 'user2@example.com', password: 'password123', name: '김철수', nickname: '철수', profileImage: '/images/profile2.jpg' },
  ];

  return {
    subscribe,
    
    // 로그인 액션
    login: (username, password) => {
      update(state => ({ ...state, loading: true, error: null }));
      
      // 실제 API 연동 대신 더미 데이터로 검증
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const user = dummyUsers.find(u => u.username === username && u.password === password);
          
          if (user) {
            const { password, ...userWithoutPassword } = user;
            update(state => ({ 
              ...state, 
              isAuthenticated: true, 
              user: userWithoutPassword, 
              loading: false 
            }));
            resolve(userWithoutPassword);
          } else {
            update(state => ({
              ...state,
              loading: false,
              error: '아이디 또는 비밀번호가 일치하지 않습니다.'
            }));
            reject(new Error('아이디 또는 비밀번호가 일치하지 않습니다.'));
          }
        }, 500);
      });
    },
    
    // 로그아웃 액션
    logout: () => {
      update(state => ({ ...state, isAuthenticated: false, user: null }));
    },
    
    // 회원가입 액션
    register: (userData) => {
      update(state => ({ ...state, loading: true, error: null }));
      
      return new Promise((resolve) => {
        setTimeout(() => {
          // 실제로는 API 호출이 필요하지만 더미 데이터 사용
          const newUser = {
            id: dummyUsers.length + 1,
            ...userData
          };
          
          // 새 사용자 추가 (실제로는 서버에 전송됨)
          dummyUsers.push(newUser);
          
          const { password, ...userWithoutPassword } = newUser;
          
          update(state => ({
            ...state,
            loading: false,
            isAuthenticated: true,
            user: userWithoutPassword
          }));
          
          resolve(userWithoutPassword);
        }, 500);
      });
    },
    
    // 사용자 정보 업데이트 액션
    updateProfile: (userData) => {
      update(state => ({ ...state, loading: true, error: null }));
      
      return new Promise((resolve) => {
        setTimeout(() => {
          update(state => ({
            ...state,
            loading: false,
            user: { ...state.user, ...userData }
          }));
          
          resolve();
        }, 500);
      });
    },
    
    // 오류 상태 초기화
    clearError: () => {
      update(state => ({ ...state, error: null }));
    }
  };
}

// 스토어 인스턴스 생성 및 내보내기
export const userStore = createUserStore();
