<!-- src/lib/components/layout/ContentSection.svelte -->
<script>
	import ReviewFilter from '$lib/components/review/ReviewFilter.svelte';
	import ReviewList from '$lib/components/review/ReviewList.svelte';
	import { reviewStore } from '$lib/stores/reviewStore.js';
	import { onMount } from 'svelte';

	// props
	export let title = "마케팅 목록";
	export let showFilter = true;
	export let region = '전체';

	// 스토어 구독
	$: reviews = $reviewStore.reviews;
	$: loading = $reviewStore.loading;

	// 필터 옵션
	let category = '카테고리';
	let sortOption = '최신순';
	let type = '유형';
	let currentRegion = region;

	// 필터 변경 핸들러
	function handleFilterChange(e) {
		const { category: newCategory, sort: newSort, type: newType, region: newRegion } = e.detail;

		category = newCategory;
		sortOption = newSort;
		type = newType;
		
		// 지역이 변경되었다면 업데이트
		if (newRegion && newRegion !== currentRegion) {
			currentRegion = newRegion;
			reviewStore.fetchReviewsByRegion(newRegion);
		}

		// 스토어에 필터 적용
		reviewStore.applyFilter({
			category,
			sort: sortOption,
			type,
			region: currentRegion
		});
	}

	// 컴포넌트 마운트 시 데이터 로드
	onMount(() => {
		if (region === '전체') {
			reviewStore.fetchReviews();
		} else {
			reviewStore.fetchReviewsByRegion(region);
			currentRegion = region;
		}
	});

	// region prop 변경 시 데이터 다시 로드
	$: if (region !== currentRegion) {
		reviewStore.fetchReviewsByRegion(region);
		currentRegion = region;
	}
</script>

<section class="content-section">
	<div class="section-header">
		<h2 class="section-title">{title}</h2>

		{#if showFilter}
			<ReviewFilter
				currentCategory={category}
				currentSort={sortOption}
				currentType={type}
				currentRegion={currentRegion}
				on:filterChange={handleFilterChange}
			/>
		{/if}
	</div>

	<ReviewList {reviews} {loading} />

	{#if reviews.length > 0}
		<div class="pagination">
			<button class="pagination-button">이전</button>
			<span class="page-info">1 / 10</span>
			<button class="pagination-button">다음</button>
		</div>
	{/if}
</section>

<style>
    .content-section {
        margin-bottom: 3rem;
    }

    .section-header {
        margin-bottom: 1.5rem;
    }

    .section-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 1.5rem;
    }

    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 2rem;
        gap: 1rem;
    }

    .pagination-button {
        padding: 0.5rem 1rem;
        background-color: #f3f4f6;
        border: none;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        color: #4b5563;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .pagination-button:hover {
        background-color: #e5e7eb;
    }

    .pagination-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .page-info {
        font-size: 0.875rem;
        color: #6b7280;
    }
</style>