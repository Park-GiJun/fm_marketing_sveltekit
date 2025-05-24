// src/lib/stores/communityStore.js
import { writable } from 'svelte/store';
import { apiClient } from '$lib/utils/api.js';

function createCommunityStore() {
  const { subscribe, set, update } = writable({
    posts: [],
    loading: false,
    error: null
  });

  return {
    subscribe,
    
    // 커뮤니티 게시글 목록 불러오기
    fetchPosts: async (category = null) => {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        const params = {};
        if (category && category !== '전체') {
          params.category = category;
        }
        
        const response = await apiClient.get('/community/posts', params);
        update(state => ({
          ...state,
          posts: response.data.posts || [],
          loading: false
        }));
      } catch (error) {
        console.error('게시글 목록 로드 오류:', error);
        update(state => ({
          ...state,
          loading: false,
          error: error.message || '게시글을 불러올 수 없습니다.'
        }));
      }
    },
    
    // 게시글 상세 조회
    getPostById: async (id) => {
      try {
        const response = await apiClient.get(`/community/posts/${id}`);
        return response.data;
      } catch (error) {
        console.error('게시글 상세 조회 오류:', error);
        return null;
      }
    },
    
    // 게시글 작성
    createPost: async (postData) => {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        const response = await apiClient.post('/community/posts', postData);
        const newPost = response.data;
        
        update(state => ({
          ...state,
          posts: [newPost, ...state.posts],
          loading: false
        }));
        
        return newPost;
      } catch (error) {
        const errorMessage = error.response?.data?.error || error.message || '게시글 작성 중 오류가 발생했습니다.';
        update(state => ({
          ...state,
          loading: false,
          error: errorMessage
        }));
        throw new Error(errorMessage);
      }
    },
    
    // 댓글 목록 조회
    getComments: async (postId) => {
      try {
        const response = await apiClient.get(`/community/posts/${postId}/comments`);
        return response.data;
      } catch (error) {
        console.error('댓글 목록 조회 오류:', error);
        return [];
      }
    },
    
    // 댓글 작성
    addComment: async (postId, comment) => {
      try {
        const response = await apiClient.post(`/community/posts/${postId}/comments`, comment);
        return response.data;
      } catch (error) {
        console.error('댓글 작성 오류:', error);
        throw new Error(error.response?.data?.error || '댓글 작성 중 오류가 발생했습니다.');
      }
    },
    
    // 게시글 좋아요 (구현 예정)
    likePost: async (postId) => {
      try {
        // 좋아요 API 구현 후 연동
        console.log('좋아요 기능 구현 예정:', postId);
        return null;
      } catch (error) {
        console.error('좋아요 처리 오류:', error);
        return null;
      }
    },

    // 오류 상태 초기화
    clearError: () => {
      update(state => ({ ...state, error: null }));
    }
  };
}

export const communityStore = createCommunityStore();
