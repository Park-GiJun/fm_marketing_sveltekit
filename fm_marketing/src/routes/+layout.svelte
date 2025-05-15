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

<style>
    :global(body) {
        font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        background-color: #f9fafb;
        color: #1f2937;
        margin: 0;
        padding: 0;
    }

    :global(*) {
        box-sizing: border-box;
    }

    :global(a) {
        text-decoration: none;
        color: inherit;
    }
</style>