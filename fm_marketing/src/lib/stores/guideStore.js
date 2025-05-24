// src/lib/stores/guideStore.js
import { writable } from 'svelte/store';
import { apiClient } from '$lib/utils/api.js';

function createGuideStore() {
  const { subscribe, set, update } = writable({
    guides: [],
    faqs: [],
    loading: false,
    error: null
  });

  // 더미 이용 가이드 데이터
  const dummyGuides = [
    {
      id: 1,
      title: '체험단 신청 방법',
      content: `
        <h2>체험단 신청 방법</h2>
        <p>FM마케팅에서 체험단에 신청하는 방법을 안내해드립니다.</p>
        
        <h3>1. 회원가입 및 로그인</h3>
        <p>FM마케팅에 회원가입 후 로그인합니다. 회원가입 시 기본 정보 외에도 블로그, 인스타그램 등 SNS 정보를 추가하면 체험단 선정에 도움이 됩니다.</p>
        
        <h3>2. 체험단 목록 확인</h3>
        <p>메인 페이지 또는 '체험단 검색' 메뉴에서 현재 모집 중인 체험단 목록을 확인할 수 있습니다. 원하는 지역이나 카테고리로 필터링하여 검색할 수 있습니다.</p>
        
        <h3>3. 체험단 상세 정보 확인</h3>
        <p>관심 있는 체험단을 클릭하여 상세 정보를 확인합니다. 체험 장소, 기간, 미션 내용, 제공 혜택 등을 꼼꼼히 확인하세요.</p>
        
        <h3>4. 신청서 작성</h3>
        <p>체험단 참여를 원하면 '신청하기' 버튼을 클릭하여 신청서를 작성합니다. 신청 이유, 블로그 주소, 이전 체험 활동 경험 등을 상세하게 작성하면 선정 확률이 높아집니다.</p>
        
        <h3>5. 선정 결과 확인</h3>
        <p>신청 마감 후 3일 이내에 선정 결과가 발표됩니다. 마이페이지에서 선정 결과를 확인할 수 있으며, 선정될 경우 SMS와 이메일로도 안내됩니다.</p>
      `,
      category: '기본 가이드',
      thumbnail: '/images/guides/application_guide.jpg',
      createdAt: '2025-01-15T10:00:00'
    },
    {
      id: 2,
      title: '체험단 활동 인증 방법',
      content: `
        <h2>체험단 활동 인증 방법</h2>
        <p>FM마케팅 체험단으로 선정된 후 활동 인증 방법을 안내해드립니다.</p>
        
        <h3>1. 체험 진행</h3>
        <p>선정된 체험단은 정해진 기간 내에 체험을 진행합니다. 체험 시 다양한 사진과 영상을 촬영하는 것이 좋습니다.</p>
        
        <h3>2. 리뷰 작성</h3>
        <p>체험 후 48시간 이내에 지정된 플랫폼(블로그, 인스타그램 등)에 리뷰를 작성합니다. 리뷰 작성 시 아래 사항을 준수해주세요:</p>
        <ul>
          <li>FM마케팅을 통한 체험단 활동임을 명시</li>
          <li>최소 5장 이상의 사진 첨부</li>
          <li>장점과 단점을 균형있게 서술</li>
          <li>지정된 키워드 포함</li>
        </ul>
        
        <h3>3. 인증 링크 등록</h3>
        <p>리뷰 작성 후 마이페이지 > 체험단 활동 > 해당 체험단 항목에서 '인증하기' 버튼을 클릭하여 리뷰 URL을 등록합니다.</p>
        
        <h3>4. 승인 과정</h3>
        <p>등록된 리뷰는 담당자 확인 후 24시간 이내에 승인됩니다. 가이드라인을 준수하지 않은 경우 수정 요청이 있을 수 있습니다.</p>
        
        <h3>5. 포인트 지급</h3>
        <p>리뷰가 승인되면 해당 체험단 활동에 대한 포인트가 지급됩니다. 포인트는 추후 다른 체험단 활동이나 현금으로 환급 가능합니다.</p>
      `,
      category: '기본 가이드',
      thumbnail: '/images/guides/verification_guide.jpg',
      createdAt: '2025-01-20T14:30:00'
    },
    {
      id: 3,
      title: '포인트 적립 및 사용 안내',
      content: `
        <h2>포인트 적립 및 사용 안내</h2>
        <p>FM마케팅의 포인트 시스템에 대해 안내해드립니다.</p>
        
        <h3>1. 포인트 적립 방법</h3>
        <p>다음과 같은 활동을 통해 포인트를 적립할 수 있습니다:</p>
        <ul>
          <li>회원가입: 1,000 포인트</li>
          <li>로그인(일일): 10 포인트</li>
          <li>체험단 활동 완료: 체험단별 상이 (5,000~50,000 포인트)</li>
          <li>커뮤니티 게시글 작성: 50 포인트</li>
          <li>댓글 작성: 10 포인트</li>
          <li>이벤트 참여: 이벤트별 상이</li>
        </ul>
        
        <h3>2. 포인트 사용 방법</h3>
        <p>적립된 포인트는 다음과 같은 방법으로 사용할 수 있습니다:</p>
        <ul>
          <li>유료 체험단 신청 시 사용</li>
          <li>현금 환급 (1,000 포인트 = 1,000원, 최소 환급 가능 포인트: 10,000 포인트)</li>
          <li>쇼핑몰 포인트로 전환</li>
        </ul>
        
        <h3>3. 포인트 유효기간</h3>
        <p>포인트의 유효기간은 적립일로부터 1년입니다. 유효기간이 임박한 포인트는 마이페이지에서 확인할 수 있습니다.</p>
        
        <h3>4. 포인트 확인 방법</h3>
        <p>적립된 포인트는 웹사이트 상단 또는 마이페이지 > 포인트 내역에서 확인할 수 있습니다.</p>
      `,
      category: '포인트/결제',
      thumbnail: '/images/guides/point_guide.jpg',
      createdAt: '2025-02-05T09:00:00'
    },
    {
      id: 4,
      title: '체험단 선정 기준',
      content: `
        <h2>체험단 선정 기준</h2>
        <p>FM마케팅의 체험단 선정 기준에 대해 안내해드립니다.</p>
        
        <h3>1. 기본 선정 기준</h3>
        <p>체험단 선정 시 다음과 같은 기준으로 평가합니다:</p>
        <ul>
          <li>블로그, 인스타그램 등 SNS 활동 현황</li>
          <li>이전 체험단 활동 성실도</li>
          <li>신청서 작성 내용의 충실도</li>
          <li>지원자의 특성과 체험단의 적합성</li>
        </ul>
        
        <h3>2. 블로그 체험단 선정 기준</h3>
        <p>블로그 체험단의 경우 다음 사항을 추가로 고려합니다:</p>
        <ul>
          <li>블로그 방문자 수 및 조회수</li>
          <li>블로그 포스팅의 질과 전문성</li>
          <li>블로그 활동 기간 및 포스팅 주기</li>
        </ul>
        
        <h3>3. SNS 체험단 선정 기준</h3>
        <p>인스타그램, 유튜브 등 SNS 체험단의 경우 다음 사항을 추가로 고려합니다:</p>
        <ul>
          <li>팔로워 수 및 팔로워의 활동성</li>
          <li>콘텐츠의 퀄리티 및 일관성</li>
          <li>해시태그 활용도 및 콘텐츠 확산력</li>
        </ul>
        
        <h3>4. 우대사항</h3>
        <p>다음과 같은 경우 체험단 선정 시 우대될 수 있습니다:</p>
        <ul>
          <li>이전 체험단 활동에서 우수한 리뷰를 작성한 경우</li>
          <li>관련 분야에 전문성이 있는 경우 (예: 요리사, 뷰티 전문가 등)</li>
          <li>체험 지역 근처에 거주하는 경우</li>
        </ul>
        
        <h3>5. 선정 제외 사항</h3>
        <p>다음과 같은 경우 체험단 선정에서 제외될 수 있습니다:</p>
        <ul>
          <li>이전 체험단 활동 시 미션을 수행하지 않은 경우</li>
          <li>허위 정보를 제공한 경우</li>
          <li>동일 기간 내 다수의 체험단에 중복 신청한 경우</li>
        </ul>
      `,
      category: '체험단 정보'
    }
  ];

  return {
    subscribe,
    
    // 가이드 목록 불러오기
    fetchGuides: async (category = null) => {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        const params = {};
        if (category) {
          params.category = category;
        }
        
        const response = await apiClient.get('/guides', params);
        update(state => ({
          ...state,
          guides: response.data.guides || [],
          loading: false
        }));
        
        return response.data.guides || [];
      } catch (error) {
        console.error('가이드 목록 로드 오류:', error);
        update(state => ({
          ...state,
          loading: false,
          error: error.message || '가이드 목록을 불러올 수 없습니다.'
        }));
        return [];
      }
    },
    
    // FAQ 목록 불러오기
    fetchFaqs: async (category = null) => {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        const params = {};
        if (category) {
          params.category = category;
        }
        
        const response = await apiClient.get('/faqs', params);
        update(state => ({
          ...state,
          faqs: response.data.faqs || [],
          loading: false
        }));
        
        return response.data.faqs || [];
      } catch (error) {
        console.error('FAQ 목록 로드 오류:', error);
        update(state => ({
          ...state,
          loading: false,
          error: error.message || 'FAQ 목록을 불러올 수 없습니다.'
        }));
        return [];
      }
    },
    
    // 가이드 상세 조회
    getGuideById: async (id) => {
      try {
        const response = await apiClient.get(`/guides/${id}`);
        return response.data;
      } catch (error) {
        console.error('가이드 상세 조회 오류:', error);
        return null;
      }
    },

    // 오류 상태 초기화
    clearError: () => {
      update(state => ({ ...state, error: null }));
    }
  };
}

export const guideStore = createGuideStore();
