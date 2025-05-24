// src/lib/stores/reviewStore.js
import { writable } from 'svelte/store';

// 더미 리뷰 데이터 생성 함수
function createDummyReviews() {
	const types = ['체험단', '기자단'];
	const titles = [
		'[더미데이터] 샘플 체험단 모집 1',
		'[더미데이터] 샘플 기자단 모집 2',
		'[더미데이터] 음식점 체험 이벤트',
		'[더미데이터] 신제품 홍보 캠페인',
		'[더미데이터] 카페 방문 체험단',
		'[더미데이터] 레스토랑 기자단',
		'[더미데이터] 신규 매장 체험단',
		'[더미데이터] 여행지 홍보 기자단'
	];

	const tags = [
		['더미', '체험단', '홍보'],
		['더미', '기자단', '캠페인'],
		['더미', '식당', '맛집'],
		['더미', '제품', '홍보'],
		['더미', '카페', '음료'],
		['더미', '식당', '홍보'],
		['더미', '매장', '오픈'],
		['더미', '여행', '관광']
	];

	// 랜덤 숫자 생성 함수
	const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

	// 20개의 더미 리뷰 생성
	return Array.from({ length: 20 }, (_, i) => {
		const titleIndex = i % titles.length;
		return {
			id: `dummy-${i + 1}`,
			title: titles[titleIndex],
			content: '더미 콘텐츠 내용...',
			images: Array.from({ length: randomInt(1, 4) }, (_, j) => `/images/default-image.jpg`),
			daysAgo: randomInt(0, 15),
			views: randomInt(10, 200),
			likes: randomInt(0, 50),
			tags: tags[titleIndex],
			isPromoted: i % 5 === 0, // 5번째마다 기자단
			type: i % 5 === 0 ? types[1] : types[0],
			region: ['서울', '경기', '인천', '강원', '충북', '대전', '전주', '부산'][randomInt(0, 7)]
		};
	});
}

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
		fetchReviews: () => {
			update(state => ({ ...state, loading: true, error: null }));

			// 실제 API 호출 대신 더미 데이터 사용
			setTimeout(() => {
				const dummyReviews = createDummyReviews();
				update(state => ({
					...state,
					reviews: dummyReviews,
					loading: false
				}));
			}, 500);
		},

		// 특정 지역의 리뷰 불러오기
		fetchReviewsByRegion: (region) => {
			update(state => ({ ...state, loading: true, error: null }));

			setTimeout(() => {
				const dummyReviews = createDummyReviews();
				const filteredReviews = region === '전체'
					? dummyReviews
					: dummyReviews.filter(review => review.region === region);

				update(state => ({
					...state,
					reviews: filteredReviews,
					loading: false,
					filter: { ...state.filter, region }
				}));
			}, 500);
		},

		// 필터 적용
		applyFilter: (filter) => {
			update(state => ({ ...state, filter: { ...state.filter, ...filter } }));

			// 여기서 필터링된 리뷰를 불러오는 로직 구현 (실제 API 호출)

			// 더미 데이터로 구현
			setTimeout(() => {
				const dummyReviews = createDummyReviews();
				update(state => ({ ...state, loading: false }));
			}, 300);
		},

		// 특정 리뷰 조회
		getReviewById: (id) => {
			return new Promise((resolve) => {
				setTimeout(() => {
					const dummyReviews = createDummyReviews();
					const review = dummyReviews.find(r => r.id === id);
					resolve(review);
				}, 300);
			});
		}
	};
}

// 스토어 인스턴스 생성 및 내보내기
export const reviewStore = createReviewStore();