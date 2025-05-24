<!-- src/routes/+layout.svelte -->
<script>
	// 전체 레이아웃 스타일
	import '../app.css';
	import { reviewStore } from '$lib/stores/reviewStore.js';
	import { userStore } from '$lib/stores/userStore.js';
	import { notificationStore } from '$lib/stores/notificationStore.js';
	import { onMount } from 'svelte';

	// 페이지 로드 시 초기 설정
	onMount(() => {
		// 사용자 인증 상태 초기화
		userStore.initialize();
		
		// 사용자가 로그인된 경우 알림 초기화
		const unsubscribe = userStore.subscribe(state => {
			if (state.isAuthenticated) {
				notificationStore.initialize();
			}
		});

		// 초기 리뷰 데이터 로드
		reviewStore.fetchReviews();

		return () => {
			unsubscribe();
		};
	});
</script>

<slot></slot>
