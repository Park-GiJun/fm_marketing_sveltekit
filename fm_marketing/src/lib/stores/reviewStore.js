// src/lib/stores/reviewStore.js
import { writable } from 'svelte/store';
import { apiClient } from '$lib/utils/api.js';

// 리뷰 스토어 생성
function createReviewStore() {
	const { subscribe, set, update } = writable({
		reviews: [],
		loading: false,
		error: null,
		filter: {
			region: '전체',
			category: '카테고리',
			sort: '최신순',
			type: '유형'
		}
	});

	return {
		subscribe,

		// 리뷰 목록 불러오기
		fetchReviews: async () => {
			update(state => ({ ...state, loading: true, error: null }));

			try {
				const response = await apiClient.get('/experiences');
				update(state => ({
					...state,
					reviews: response.data.experiences || [],
					loading: false
				}));
			} catch (error) {
				console.error('체험단 목록 로드 오류:', error);
				update(state => ({
					...state,
					loading: false,
					error: error.message || '체험단 목록을 불러올 수 없습니다.'
				}));
			}
		},

		// 특정 지역의 리뷰 불러오기
		fetchReviewsByRegion: async (region) => {
			update(state => ({ ...state, loading: true, error: null }));

			try {
				const params = {};
				if (region && region !== '전체') {
					params.region = region;
				}

				const response = await apiClient.get('/experiences', params);
				update(state => ({
					...state,
					reviews: response.data.experiences || [],
					loading: false,
					filter: { ...state.filter, region }
				}));
			} catch (error) {
				console.error('지역별 체험단 로드 오류:', error);
				update(state => ({
					...state,
					loading: false,
					error: error.message || '체험단 목록을 불러올 수 없습니다.'
				}));
			}
		},

		// 필터 적용
		applyFilter: async (filter) => {
			update(state => ({ ...state, loading: true, filter: { ...state.filter, ...filter } }));

			try {
				const params = {};
				
				if (filter.region && filter.region !== '전체') {
					params.region = filter.region;
				}
				if (filter.category && filter.category !== '카테고리') {
					params.category = filter.category;
				}
				if (filter.type && filter.type !== '유형') {
					params.type = filter.type;
				}
				if (filter.sort && filter.sort !== '최신순') {
					params.sort = filter.sort === '인기순' ? 'popular' : 'latest';
				}

				const response = await apiClient.get('/experiences', params);
				update(state => ({
					...state,
					reviews: response.data.experiences || [],
					loading: false
				}));
			} catch (error) {
				console.error('필터 적용 오류:', error);
				update(state => ({
					...state,
					loading: false,
					error: error.message || '체험단 목록을 불러올 수 없습니다.'
				}));
			}
		},

		// 특정 리뷰 조회
		getReviewById: async (id) => {
			try {
				const response = await apiClient.get(`/experiences/${id}`);
				return response.data;
			} catch (error) {
				console.error('체험단 상세 조회 오류:', error);
				return null;
			}
		}
	};
}

// 스토어 인스턴스 생성 및 내보내기
export const reviewStore = createReviewStore();