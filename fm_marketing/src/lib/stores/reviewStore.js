<!-- src/lib/stores/reviewStore.js -->
import { writable } from 'svelte/store';

// 더미 리뷰 데이터 생성 함수
function createDummyReviews() {
	const types = ['리뷰노트', '프리미엄'];
	const titles = [
		'[제천/청풍사랑] 대고구려 해지국밥',
		'[서울/종구] 어을 서울',
		'[인천/용현동] 플차이플랜션',
		'[건강/다이어트] 폴리오 폴리지 허벌치마사지기',
		'[경기/화성군] 꽃사이 로컬라운지',
		'[대구] 윈스 퓨전레스토랑',
		'[부산/메종드] 키친메종',
		'[전주] 호성병원'
	];

	const tags = [
		['맛집', '국밥', '제천'],
		['서울', '카페', '디저트'],
		['인천', '중국집', '짜장면'],
		['건강', '다이어트', '마사지'],
		['경기', '카페', '힐링'],
		['대구', '레스토랑', '데이트'],
		['부산', '식당', '프랑스'],
		['전주', '병원', '건강검진']
	];

	// 랜덤 숫자 생성 함수
	const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

	// 15개의 더미 리뷰 생성
	return Array.from({ length: 20 }, (_, i) => {
		const titleIndex = i % titles.length;
		return {
			id: `review-${i + 1}`,
			title: titles[titleIndex],
			content: '리뷰 콘텐츠...',
			images: Array.from({ length: randomInt(1, 4) }, (_, j) => `image-${j + 1}.jpg`),
			daysAgo: randomInt(0, 15),
			views: randomInt(10, 200),
			likes: randomInt(0, 50),
			tags: tags[titleIndex],
			isPromoted: i % 5 === 0, // 5번째마다 프리미엄 리뷰
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