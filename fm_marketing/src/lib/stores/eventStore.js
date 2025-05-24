// src/lib/stores/eventStore.js
import { writable } from 'svelte/store';
import { apiClient } from '$lib/utils/api.js';

function createEventStore() {
  const { subscribe, set, update } = writable({
    events: [],
    notices: [],
    loading: false,
    error: null
  });

  return {
    subscribe,
    
    // 이벤트 목록 불러오기
    fetchEvents: async () => {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        const response = await apiClient.get('/events', { type: 'event', active: 'true' });
        update(state => ({
          ...state,
          events: response.data.events || [],
          loading: false
        }));
      } catch (error) {
        console.error('이벤트 목록 로드 오류:', error);
        update(state => ({
          ...state,
          loading: false,
          error: error.message || '이벤트 목록을 불러올 수 없습니다.'
        }));
      }
    },
    
    // 공지사항 목록 불러오기
    fetchNotices: async () => {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        const response = await apiClient.get('/events', { type: 'notice', active: 'true' });
        update(state => ({
          ...state,
          notices: response.data.events || [],
          loading: false
        }));
      } catch (error) {
        console.error('공지사항 목록 로드 오류:', error);
        update(state => ({
          ...state,
          loading: false,
          error: error.message || '공지사항 목록을 불러올 수 없습니다.'
        }));
      }
    },
    
    // 이벤트 상세 조회
    getEventById: async (id) => {
      try {
        const response = await apiClient.get(`/events/${id}`);
        return response.data;
      } catch (error) {
        console.error('이벤트 상세 조회 오류:', error);
        return null;
      }
    },
    
    // 공지사항 상세 조회 (이벤트와 동일한 API 사용)
    getNoticeById: async (id) => {
      try {
        const response = await apiClient.get(`/events/${id}`);
        return response.data;
      } catch (error) {
        console.error('공지사항 상세 조회 오류:', error);
        return null;
      }
    },

    // 오류 상태 초기화
    clearError: () => {
      update(state => ({ ...state, error: null }));
    }
  };
}

export const eventStore = createEventStore();
