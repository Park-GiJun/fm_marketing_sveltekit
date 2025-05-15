
import { writable } from 'svelte/store';

// 초기 상태
const initialState = {
  applications: [],
  currentApplication: null,
  error: null,
  loading: false
};

function createApplicationStore() {
  const { subscribe, set, update } = writable(initialState);

  return {
    subscribe,
    
    // 캠페인에 지원하는 메서드
    applyToCampaign: async (campaignId, formData) => {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        // 실제 API 호출로 대체해야 함
        const response = await mockApplyToCampaign(campaignId, formData);
        
        if (response.success) {
          update(state => ({ 
            ...state, 
            loading: false,
            applications: [...state.applications, response.application]
          }));
          
          return response.application;
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
          error: error.message || '지원 중 오류가 발생했습니다.', 
          loading: false 
        }));
        
        throw error;
      }
    },
    
    // 리뷰 제출 메서드
    submitReview: async (campaignId, reviewData) => {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        // 실제 API 호출로 대체해야 함
        const response = await mockSubmitReview(campaignId, reviewData);
        
        if (response.success) {
          update(state => ({
            ...state,
            loading: false,
            applications: state.applications.map(app => 
              app.id === response.application.id ? response.application : app
            )
          }));
          
          return response.application;
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
          error: error.message || '리뷰 제출 중 오류가 발생했습니다.', 
          loading: false 
        }));
        
        throw error;
      }
    },
    
    // 내 지원 목록 조회 메서드
    fetchMyApplications: async () => {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        // 실제 API 호출로 대체해야 함
        const response = await mockFetchMyApplications();
        
        if (response.success) {
          update(state => ({ 
            ...state, 
            applications: response.applications, 
            loading: false 
          }));
          
          return response.applications;
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
          error: error.message || '지원 목록 조회 중 오류가 발생했습니다.', 
          loading: false 
        }));
        
        throw error;
      }
    },
    
    // 특정 캠페인의 지원 목록 조회 메서드
    fetchCampaignApplications: async (campaignId) => {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        // 실제 API 호출로 대체해야 함
        const response = await mockFetchCampaignApplications(campaignId);
        
        if (response.success) {
          update(state => ({ 
            ...state, 
            loading: false 
          }));
          
          return response.applications;
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
          error: error.message || '캠페인 지원 목록 조회 중 오류가 발생했습니다.', 
          loading: false 
        }));
        
        throw error;
      }
    },
    
    // 에러 초기화 메서드
    clearError: () => {
      update(state => ({ ...state, error: null }));
    }
  };
}

// 목업 API 함수들 (실제 구현에서는 제거)
async function mockApplyToCampaign(campaignId, formData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // URL 유효성 검사 실패 테스트
      if (formData.blogUrl && !formData.blogUrl.startsWith('http')) {
        resolve({
          success: false,
          message: '유효한 URL 형식이 아닙니다.'
        });
        return;
      }
      
      resolve({
        success: true,
        application: {
          id: Math.floor(Math.random() * 1000) + 1,
          campaignId: campaignId,
          campaignTitle: '맛있는 음식점 체험단',
          storeName: '맛있는 식당',
          blogUrl: formData.blogUrl,
          reason: formData.reason,
          status: 'PENDING',
          createdAt: new Date().toISOString()
        }
      });
    }, 800);
  });
}

async function mockSubmitReview(campaignId, reviewData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // URL 유효성 검사 실패 테스트
      if (reviewData.reviewUrl && !reviewData.reviewUrl.startsWith('http')) {
        resolve({
          success: false,
          message: '유효한 URL 형식이 아닙니다.'
        });
        return;
      }
      
      resolve({
        success: true,
        application: {
          id: Math.floor(Math.random() * 1000) + 1,
          campaignId: campaignId,
          campaignTitle: '맛있는 음식점 체험단',
          storeName: '맛있는 식당',
          status: 'COMPLETED',
          reviewUrl: reviewData.reviewUrl,
          completedAt: new Date().toISOString()
        }
      });
    }, 800);
  });
}

async function mockFetchMyApplications() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        applications: [
          {
            id: 1,
            campaignId: 101,
            campaignTitle: '맛있는 음식점 체험단',
            storeName: '맛있는 식당',
            status: 'APPROVED',
            createdAt: '2023-01-15T09:00:00Z'
          },
          {
            id: 2,
            campaignId: 102,
            campaignTitle: '새로운 카페 홍보단',
            storeName: '커피 한잔',
            status: 'PENDING',
            createdAt: '2023-02-20T14:30:00Z'
          },
          {
            id: 3,
            campaignId: 103,
            campaignTitle: '디저트 맛집 체험단',
            storeName: '달콤한 디저트',
            status: 'COMPLETED',
            reviewUrl: 'https://blog.example.com/post/123',
            createdAt: '2023-03-10T11:15:00Z',
            completedAt: '2023-03-25T16:45:00Z'
          },
          {
            id: 4,
            campaignId: 104,
            campaignTitle: '한식 맛집 체험단',
            storeName: '전통 한식당',
            status: 'REJECTED',
            createdAt: '2023-04-05T10:00:00Z'
          },
          {
            id: 5,
            campaignId: 105,
            campaignTitle: '이탈리안 레스토랑 체험단',
            storeName: '로마의 맛',
            status: 'PENDING',
            createdAt: '2023-05-01T13:20:00Z'
          }
        ]
      });
    }, 800);
  });
}

async function mockFetchCampaignApplications(campaignId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        applications: [
          {
            id: 10,
            campaignId: campaignId,
            bloggerName: '김블로거',
            bloggerEmail: 'blogger1@example.com',
            status: 'PENDING',
            createdAt: '2023-01-15T09:00:00Z'
          },
          {
            id: 11,
            campaignId: campaignId,
            bloggerName: '이블로거',
            bloggerEmail: 'blogger2@example.com',
            status: 'APPROVED',
            createdAt: '2023-01-16T10:20:00Z'
          },
          {
            id: 12,
            campaignId: campaignId,
            bloggerName: '박블로거',
            bloggerEmail: 'blogger3@example.com',
            status: 'REJECTED',
            createdAt: '2023-01-17T11:30:00Z'
          },
          {
            id: 13,
            campaignId: campaignId,
            bloggerName: '최블로거',
            bloggerEmail: 'blogger4@example.com',
            status: 'COMPLETED',
            reviewUrl: 'https://blog.example.com/post/456',
            createdAt: '2023-01-18T14:00:00Z',
            completedAt: '2023-01-28T15:45:00Z'
          },
          {
            id: 14,
            campaignId: campaignId,
            bloggerName: '정블로거',
            bloggerEmail: 'blogger5@example.com',
            status: 'PENDING',
            createdAt: '2023-01-19T16:10:00Z'
          }
        ]
      });
    }, 800);
  });
}

// 스토어 인스턴스 생성 및 내보내기
export const applicationStore = createApplicationStore();
