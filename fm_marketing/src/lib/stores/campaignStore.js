
import { writable } from 'svelte/store';

// 초기 상태
const initialState = {
  campaigns: [],
  currentCampaign: null,
  error: null,
  loading: false
};

function createCampaignStore() {
  const { subscribe, set, update } = writable(initialState);

  return {
    subscribe,
    
    // 캠페인 목록 조회 메서드
    fetchCampaigns: async () => {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        // 실제 API 호출로 대체해야 함
        const response = await mockFetchCampaigns();
        
        if (response.success) {
          update(state => ({ 
            ...state, 
            campaigns: response.campaigns, 
            loading: false 
          }));
          
          return response.campaigns;
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
          error: error.message || '캠페인 목록 조회 중 오류가 발생했습니다.', 
          loading: false 
        }));
        
        throw error;
      }
    },
    
    // 캠페인 상세 조회 메서드
    fetchCampaignDetails: async (campaignId) => {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        // 실제 API 호출로 대체해야 함
        const response = await mockFetchCampaignDetails(campaignId);
        
        if (response.success) {
          update(state => ({ 
            ...state, 
            currentCampaign: response.campaign, 
            loading: false 
          }));
          
          return response.campaign;
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
          error: error.message || '캠페인 상세 조회 중 오류가 발생했습니다.', 
          loading: false 
        }));
        
        throw error;
      }
    },
    
    // 캠페인 생성 메서드
    createCampaign: async (campaignData) => {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        // 실제 API 호출로 대체해야 함
        const response = await mockCreateCampaign(campaignData);
        
        if (response.success) {
          update(state => ({ 
            ...state, 
            campaigns: [...state.campaigns, response.campaign],
            currentCampaign: response.campaign,
            loading: false 
          }));
          
          return response.campaign;
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
          error: error.message || '캠페인 생성 중 오류가 발생했습니다.', 
          loading: false 
        }));
        
        throw error;
      }
    },
    
    // 캠페인 수정 메서드
    updateCampaign: async (campaignId, campaignData) => {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        // 실제 API 호출로 대체해야 함
        const response = await mockUpdateCampaign(campaignId, campaignData);
        
        if (response.success) {
          update(state => ({
            ...state,
            campaigns: state.campaigns.map(camp => 
              camp.id === response.campaign.id ? response.campaign : camp
            ),
            currentCampaign: response.campaign,
            loading: false
          }));
          
          return response.campaign;
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
          error: error.message || '캠페인 수정 중 오류가 발생했습니다.', 
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
async function mockFetchCampaigns() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        campaigns: [
          {
            id: 101,
            title: '맛있는 음식점 체험단',
            storeName: '맛있는 식당',
            storeAddress: '서울시 강남구 테헤란로 123',
            applicationDeadline: '2023-06-30T23:59:59Z',
            reviewDeadline: '2023-07-15T23:59:59Z',
            appliedCount: 12,
            approvedCount: 5,
            requiredBloggerCount: 10,
            imageUrl: 'https://example.com/images/restaurant.jpg'
          },
          {
            id: 102,
            title: '새로운 카페 홍보단',
            storeName: '커피 한잔',
            storeAddress: '서울시 마포구 홍대로 456',
            applicationDeadline: '2023-07-15T23:59:59Z',
            reviewDeadline: '2023-07-30T23:59:59Z',
            appliedCount: 8,
            approvedCount: 3,
            requiredBloggerCount: 5,
            imageUrl: 'https://example.com/images/cafe.jpg'
          },
          {
            id: 103,
            title: '디저트 맛집 체험단',
            storeName: '달콤한 디저트',
            storeAddress: '서울시 서초구 서초대로 789',
            applicationDeadline: '2023-07-20T23:59:59Z',
            reviewDeadline: '2023-08-05T23:59:59Z',
            appliedCount: 15,
            approvedCount: 7,
            requiredBloggerCount: 8,
            imageUrl: 'https://example.com/images/dessert.jpg'
          }
        ]
      });
    }, 800);
  });
}

async function mockFetchCampaignDetails(campaignId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        campaign: {
          id: parseInt(campaignId),
          title: '맛있는 음식점 체험단',
          content: '맛있는 음식점에서 신메뉴를, 맛있는 음식점은 서울시 강남구에 위치한 한식 전문점으로, 신선한 재료와 정성을 담아 만든 요리를 제공합니다. 이번 체험단은 새롭게 출시되는 계절 특선 메뉴를 소개하고자 합니다. 블로거님들의 솔직한 리뷰와 사진을 통해 많은 분들에게 저희 음식점을 알려주세요!',
          storeName: '맛있는 식당',
          storeAddress: '서울시 강남구 테헤란로 123',
          applicationDeadline: '2023-06-30T23:59:59Z',
          reviewDeadline: '2023-07-15T23:59:59Z',
          appliedCount: 12,
          approvedCount: 5,
          requiredBloggerCount: 10,
          imageUrl: 'https://example.com/images/restaurant.jpg',
          createdAt: '2023-06-01T10:00:00Z'
        }
      });
    }, 800);
  });
}

async function mockCreateCampaign(campaignData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 필수 필드 검증 테스트
      if (!campaignData.title || !campaignData.storeName || !campaignData.storeAddress) {
        resolve({
          success: false,
          message: '필수 항목을 모두 입력해주세요.'
        });
        return;
      }
      
      resolve({
        success: true,
        campaign: {
          id: Math.floor(Math.random() * 1000) + 1,
          ...campaignData,
          appliedCount: 0,
          approvedCount: 0,
          createdAt: new Date().toISOString()
        }
      });
    }, 800);
  });
}

async function mockUpdateCampaign(campaignId, campaignData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 필수 필드 검증 테스트
      if (!campaignData.title || !campaignData.storeName || !campaignData.storeAddress) {
        resolve({
          success: false,
          message: '필수 항목을 모두 입력해주세요.'
        });
        return;
      }
      
      resolve({
        success: true,
        campaign: {
          id: parseInt(campaignId),
          ...campaignData,
          appliedCount: 12, // 기존 데이터 유지
          approvedCount: 5, // 기존 데이터 유지
          updatedAt: new Date().toISOString()
        }
      });
    }, 800);
  });
}

// 스토어 인스턴스 생성 및 내보내기
export const campaignStore = createCampaignStore();
