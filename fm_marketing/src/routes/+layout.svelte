<!-- src/routes/+layout.svelte -->
<script>
	// 전체 레이아웃 스타일
	import '../app.css';
	import { reviewStore } from '$lib/stores/reviewStore.js';
	import { onMount } from 'svelte';

	// 페이지 로드 시 초기 리뷰 데이터 로드
	onMount(() => {
		reviewStore.fetchReviews();
	});
</script>

<slot></slot>
