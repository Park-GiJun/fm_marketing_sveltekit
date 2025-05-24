<!-- src/lib/components/review/ReviewFilter.svelte -->
<script>
	import { createEventDispatcher } from 'svelte';
	
	const dispatch = createEventDispatcher();

	export let currentCategory = '카테고리';
	export let currentSort = '최신순';
	export let currentType = '유형';
	export let currentRegion = '전체';

	// 필터 옵션들
	const categories = [
		{ value: '카테고리', label: '카테고리' },
		{ value: '맛집', label: '맛집' },
		{ value: '뷰티', label: '뷰티' },
		{ value: '패션', label: '패션' },
		{ value: '여행', label: '여행' },
		{ value: '건강', label: '건강' },
		{ value: '문화', label: '문화' },
		{ value: '디지털', label: '디지털' },
		{ value: '생활', label: '생활' }
	];

	const sortOptions = [
		{ value: '최신순', label: '최신순' },
		{ value: '인기순', label: '인기순' },
		{ value: '마감임박순', label: '마감임박순' },
		{ value: '조회순', label: '조회순' }
	];

	const types = [
		{ value: '유형', label: '유형' },
		{ value: '체험단', label: '체험단' },
		{ value: '기자단', label: '기자단' }
	];

	const regions = [
		{ value: '전체', label: '전체' },
		{ value: '서울', label: '서울' },
		{ value: '경기', label: '경기' },
		{ value: '인천', label: '인천' },
		{ value: '강원', label: '강원' },
		{ value: '충북', label: '충북' },
		{ value: '충남', label: '충남' },
		{ value: '대전', label: '대전' },
		{ value: '세종', label: '세종' },
		{ value: '전북', label: '전북' },
		{ value: '전남', label: '전남' },
		{ value: '광주', label: '광주' },
		{ value: '경북', label: '경북' },
		{ value: '경남', label: '경남' },
		{ value: '대구', label: '대구' },
		{ value: '부산', label: '부산' },
		{ value: '울산', label: '울산' },
		{ value: '제주', label: '제주' }
	];

	// 필터 변경 핸들러
	function handleFilterChange() {
		dispatch('filterChange', {
			category: currentCategory,
			sort: currentSort,
			type: currentType,
			region: currentRegion
		});
	}

	// 필터 초기화
	function resetFilters() {
		currentCategory = '카테고리';
		currentSort = '최신순';
		currentType = '유형';
		currentRegion = '전체';
		handleFilterChange();
	}

	// 활성 필터 개수 계산
	$: activeFiltersCount = [
		currentCategory !== '카테고리',
		currentType !== '유형',
		currentRegion !== '전체'
	].filter(Boolean).length;
</script>

<div class="review-filter">
	<div class="filter-controls">
		<div class="filter-group">
			<select 
				bind:value={currentCategory} 
				on:change={handleFilterChange}
				class="filter-select"
			>
				{#each categories as category}
					<option value={category.value}>{category.label}</option>
				{/each}
			</select>
		</div>

		<div class="filter-group">
			<select 
				bind:value={currentType} 
				on:change={handleFilterChange}
				class="filter-select"
			>
				{#each types as type}
					<option value={type.value}>{type.label}</option>
				{/each}
			</select>
		</div>

		<div class="filter-group">
			<select 
				bind:value={currentRegion} 
				on:change={handleFilterChange}
				class="filter-select"
			>
				{#each regions as region}
					<option value={region.value}>{region.label}</option>
				{/each}
			</select>
		</div>

		<div class="filter-group">
			<select 
				bind:value={currentSort} 
				on:change={handleFilterChange}
				class="filter-select sort-select"
			>
				{#each sortOptions as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</div>
	</div>

	<div class="filter-actions">
		{#if activeFiltersCount > 0}
			<button class="reset-button" on:click={resetFilters}>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
					<path d="M3 3v5h5"></path>
				</svg>
				초기화 ({activeFiltersCount})
			</button>
		{/if}
	</div>
</div>

<style>
	.review-filter {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		width: 100%;
	}

	.filter-controls {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		flex: 1;
	}

	.filter-group {
		position: relative;
	}

	.filter-select {
		padding: 0.5rem 2.5rem 0.5rem 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		background-color: white;
		font-size: 0.875rem;
		color: #4b5563;
		cursor: pointer;
		appearance: none;
		background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
		background-repeat: no-repeat;
		background-position: right 0.5rem center;
		background-size: 1rem;
		min-width: 120px;
		transition: all 0.2s ease;
	}

	.filter-select:hover {
		border-color: #9ca3af;
	}

	.filter-select:focus {
		outline: none;
		border-color: #5ce0c6;
		box-shadow: 0 0 0 2px rgba(92, 224, 198, 0.2);
	}

	.sort-select {
		border-color: #5ce0c6;
		color: #1f2937;
		font-weight: 500;
	}

	.filter-actions {
		display: flex;
		align-items: center;
	}

	.reset-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background-color: #f3f4f6;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		color: #6b7280;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.reset-button:hover {
		background-color: #e5e7eb;
		color: #4b5563;
	}

	@media (max-width: 768px) {
		.review-filter {
			flex-direction: column;
			align-items: stretch;
		}

		.filter-controls {
			justify-content: space-between;
		}

		.filter-select {
			min-width: auto;
			flex: 1;
		}

		.filter-actions {
			justify-content: center;
		}
	}

	@media (max-width: 640px) {
		.filter-controls {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 0.5rem;
		}

		.filter-select {
			min-width: 0;
		}
	}
</style>
