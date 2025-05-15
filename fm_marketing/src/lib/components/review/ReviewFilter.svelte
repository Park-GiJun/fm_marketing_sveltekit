<!-- src/lib/components/review/ReviewFilter.svelte -->
<script>
	// 현재 선택된 필터 옵션
	export let currentCategory = '카테고리';
	export let currentSort = '최신순';
	export let currentType = '유형';

	// 카테고리 목록
	const categories = [
		{ id: 'all', name: '카테고리' },
		{ id: 'food', name: '맛집' },
		{ id: 'beauty', name: '뷰티' },
		{ id: 'health', name: '건강' },
		{ id: 'travel', name: '여행' },
		{ id: 'culture', name: '문화' }
	];

	// 정렬 옵션
	const sortOptions = [
		{ id: 'latest', name: '최신순' },
		{ id: 'views', name: '조회순' },
		{ id: 'likes', name: '인기순' }
	];

	// 리뷰 유형
	const types = [
		{ id: 'all', name: '유형' },
		{ id: 'note', name: '리뷰노트' },
		{ id: 'premium', name: '프리미엄' }
	];

	// 드롭다운 상태
	let categoryDropdownOpen = false;
	let sortDropdownOpen = false;
	let typeDropdownOpen = false;

	// 필터 적용 함수
	function setCategory(category) {
		currentCategory = category.name;
		categoryDropdownOpen = false;
		dispatchFilterChange();
	}

	function setSort(sort) {
		currentSort = sort.name;
		sortDropdownOpen = false;
		dispatchFilterChange();
	}

	function setType(type) {
		currentType = type.name;
		typeDropdownOpen = false;
		dispatchFilterChange();
	}

	// 필터 변경 이벤트 발생
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	function dispatchFilterChange() {
		dispatch('filterChange', {
			category: currentCategory,
			sort: currentSort,
			type: currentType
		});
	}

	// 외부 클릭 시 드롭다운 닫기
	function handleOutsideClick(e) {
		const targetEl = e.target;

		if (!targetEl.closest('.category-dropdown') && categoryDropdownOpen) {
			categoryDropdownOpen = false;
		}

		if (!targetEl.closest('.sort-dropdown') && sortDropdownOpen) {
			sortDropdownOpen = false;
		}

		if (!targetEl.closest('.type-dropdown') && typeDropdownOpen) {
			typeDropdownOpen = false;
		}
	}

	import { onMount } from 'svelte';

	onMount(() => {
		document.addEventListener('click', handleOutsideClick);

		return () => {
			document.removeEventListener('click', handleOutsideClick);
		};
	});
</script>

<div class="filter-container">
	<div class="filter-section">
		<!-- 카테고리 필터 -->
		<div class="filter-dropdown category-dropdown">
			<button
				class="dropdown-toggle"
				on:click={() => categoryDropdownOpen = !categoryDropdownOpen}
			>
				{currentCategory}
				<svg xmlns="http://www.w3.org/2000/svg" class="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<polyline points="6 9 12 15 18 9"></polyline>
				</svg>
			</button>

			{#if categoryDropdownOpen}
				<div class="dropdown-menu">
					{#each categories as category}
						<button
							class="dropdown-item {currentCategory === category.name ? 'active' : ''}"
							on:click={() => setCategory(category)}
						>
							{category.name}
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<!-- 리뷰 유형 필터 -->
		<div class="filter-dropdown type-dropdown">
			<button
				class="dropdown-toggle"
				on:click={() => typeDropdownOpen = !typeDropdownOpen}
			>
				{currentType}
				<svg xmlns="http://www.w3.org/2000/svg" class="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<polyline points="6 9 12 15 18 9"></polyline>
				</svg>
			</button>

			{#if typeDropdownOpen}
				<div class="dropdown-menu">
					{#each types as type}
						<button
							class="dropdown-item {currentType === type.name ? 'active' : ''}"
							on:click={() => setType(type)}
						>
							{type.name}
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<!-- 정렬 필터 -->
	<div class="filter-section">
		<div class="filter-dropdown sort-dropdown">
			<button
				class="dropdown-toggle"
				on:click={() => sortDropdownOpen = !sortDropdownOpen}
			>
				{currentSort}
				<svg xmlns="http://www.w3.org/2000/svg" class="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<polyline points="6 9 12 15 18 9"></polyline>
				</svg>
			</button>

			{#if sortDropdownOpen}
				<div class="dropdown-menu">
					{#each sortOptions as sort}
						<button
							class="dropdown-item {currentSort === sort.name ? 'active' : ''}"
							on:click={() => setSort(sort)}
						>
							{sort.name}
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
    .filter-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }

    .filter-section {
        display: flex;
        gap: 0.75rem;
    }

    .filter-dropdown {
        position: relative;
    }

    .dropdown-toggle {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0.75rem;
        background-color: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        color: #4b5563;
        cursor: pointer;
        min-width: 6rem;
        justify-content: space-between;
    }

    .dropdown-toggle:hover {
        border-color: #d1d5db;
    }

    .dropdown-icon {
        color: #9ca3af;
    }

    .dropdown-menu {
        position: absolute;
        top: 100%;
        left: 0;
        z-index: 50;
        margin-top: 0.25rem;
        width: 100%;
        min-width: 10rem;
        background-color: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 0.375rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }

    .dropdown-item {
        display: block;
        width: 100%;
        padding: 0.5rem 0.75rem;
        text-align: left;
        font-size: 0.875rem;
        color: #4b5563;
        background-color: transparent;
        border: none;
        cursor: pointer;
    }

    .dropdown-item:hover {
        background-color: #f9fafb;
    }

    .dropdown-item.active {
        color: #4c96d7;
        font-weight: 500;
    }

    @media (max-width: 640px) {
        .filter-container {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
        }

        .filter-section {
            width: 100%;
            justify-content: space-between;
        }

        .dropdown-toggle {
            min-width: 0;
        }
    }
</style>