// src/lib/stores/eventStore.js
import { writable } from 'svelte/store';

function createEventStore() {
  const { subscribe, set, update } = writable({
    events: [],
    notices: [],
    loading: false,
    error: null
  });

  // 더미 이벤트 데이터
  const dummyEvents = [
    {
      id: 1,
      title: '여름 맞이 체험단 특별 이벤트',
      content: '여름 시즌을 맞아 체험단 활동을 하시는 분들께 특별 포인트를 드립니다!',
      imageUrl: '/images/events/summer_event.jpg',
      startDate: '2025-06-01',
      endDate: '2025-06-30',
      isActive: true,
      createdAt: '2025-05-15T10:00:00'
    },
    {
      id: 2,
      title: '신규 가입자 웰컴 포인트 2배 증정',
      content: '6월 한 달간 신규 가입하시는 모든 분들께 웰컴 포인트를 2배로 드립니다.',
      imageUrl: '/images/events/welcome_points.jpg',
      startDate: '2025-06-01',
      endDate: '2025-06-30',
      isActive: true,
      createdAt: '2025-05-20T14:30:00'
    },
    {
      id: 3,
      title: '리뷰 작성 이벤트',
      content: '체험 후 리뷰를 작성하시면 추가 포인트를 드립니다. 사진과 함께 작성하면 포인트 2배!',
      imageUrl: '/images/events/review_event.jpg',
      startDate: '2025-05-15',
      endDate: '2025-06-15',
      isActive: true,
      createdAt: '2025-05-10T09:15:00'
    },
    {
      id: 4,
      title: '지역 맛집 탐방 체험단 모집',
      content: '전국 각 지역의 숨은 맛집을 발굴하는 체험단을 모집합니다.',
      imageUrl: '/images/events/food_experience.jpg',
      startDate: '2025-06-10',
      endDate: '2025-07-10',
      isActive: true,
      createdAt: '2025-05-25T11:20:00'
    },
    {
      id: 5,
      title: '봄 맞이 뷰티 체험단 이벤트',
      content: '봄을 맞아 새로운 뷰티 제품을 체험해보세요!',
      imageUrl: '/images/events/spring_beauty.jpg',
      startDate: '2025-04-01',
      endDate: '2025-04-30',
      isActive: false,
      createdAt: '2025-03-15T10:00:00'
    }
  ];

  // 더미 공지사항 데이터
  const dummyNotices = [
    {
      id: 1,
      title: '서비스 이용약관 개정 안내',
      content: '안녕하세요. FM마케팅입니다. 2025년 6월 1일부터 적용되는 서비스 이용약관 개정 내용을 안내드립니다.',
      category: '공지',
      isImportant: true,
      createdAt: '2025-05-15T10:00:00'
    },
    {
      id: 2,
      title: '개인정보처리방침 변경 안내',
      content: '안녕하세요. FM마케팅입니다. 개인정보처리방침 변경 내용을 안내드립니다.',
      category: '공지',
      isImportant: true,
      createdAt: '2025-05-14T14:30:00'
    },
    {
      id: 3,
      title: '5월 우수 체험단 발표',
      content: '안녕하세요. FM마케팅입니다. 5월 한 달간 활동한 체험단 중 우수 체험단으로 선정된 회원을 발표합니다.',
      category: '공지',
      isImportant: false,
      createdAt: '2025-05-31T09:15:00'
    },
    {
      id: 4,
      title: '체험단 신청 방법 안내',
      content: '안녕하세요. FM마케팅입니다. 체험단 신청 방법 및 선정 기준에 대해 안내드립니다.',
      category: '안내',
      isImportant: false,
      createdAt: '2025-05-10T11:20:00'
    },
    {
      id: 5,
      title: '시스템 점검 안내',
      content: '안녕하세요. FM마케팅입니다. 서비스 품질 향상을 위한 시스템 점검이 있을 예정입니다.',
      category: '안내',
      isImportant: false,
      createdAt: '2025-05-08T10:00:00'
    }
  ];

  return {
    subscribe,
    
    // 이벤트 목록 불러오기
    fetchEvents: () => {
      update(state => ({ ...state, loading: true }));
      
      return new Promise((resolve) => {
        setTimeout(() => {
          update(state => ({
            ...state,
            events: dummyEvents.filter(event => event.isActive),
            loading: false
          }));
          resolve();
        }, 500);
      });
    },
    
    // 공지사항 목록 불러오기
    fetchNotices: () => {
      update(state => ({ ...state, loading: true }));
      
      return new Promise((resolve) => {
        setTimeout(() => {
          update(state => ({
            ...state,
            notices: dummyNotices,
            loading: false
          }));
          resolve();
        }, 500);
      });
    },
    
    // 이벤트 상세 조회
    getEventById: (id) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const event = dummyEvents.find(e => e.id === parseInt(id));
          resolve(event);
        }, 300);
      });
    },
    
    // 공지사항 상세 조회
    getNoticeById: (id) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const notice = dummyNotices.find(n => n.id === parseInt(id));
          resolve(notice);
        }, 300);
      });
    }
  };
}

export const eventStore = createEventStore();
