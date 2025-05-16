<!-- src/lib/components/layout/RegionTab.svelte -->
<script>
	// 지역 목록 데이터
	const regions = [
		{ id: 'all', name: '전체' },
		{ id: 'seoul', name: '서울' },
		{ id: 'gyeonggi', name: '경기' },
		{ id: 'incheon', name: '인천' },
		{ id: 'gangwon', name: '강원' },
		{ id: 'chungbuk', name: '충북' },
		{ id: 'chungnam', name: '충남' },
		{ id: 'daejeon', name: '대전' },
		{ id: 'sejong', name: '세종' },
		{ id: 'daegu', name: '대구' },
		{ id: 'gyeongbuk', name: '경북' },
		{ id: 'gyeongnam', name: '경남' },
		{ id: 'busan', name: '부산' },
		{ id: 'ulsan', name: '울산' },
		{ id: 'jeonbuk', name: '전북' },
		{ id: 'jeonnam', name: '전남' },
		{ id: 'gwangju', name: '광주' },
		{ id: 'jeju', name: '제주' }
	];

	// 초기 선택된 지역 (기본값: 전체)
	export let selectedRegion = 'all';

	// 지역 선택 이벤트 핸들러
	function handleRegionSelect(regionId) {
		selectedRegion = regionId;
	}
</script>

<div class="region-tab-container">
	<div class="region-tabs">
		{#each regions as region}
			<button
				class="region-tab {selectedRegion === region.id ? 'active' : ''}"
				on:click={() => handleRegionSelect(region.id)}
			>
				{region.name}
			</button>
		{/each}
	</div>
</div>

<style>
    .region-tab-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 1rem;
        background-color: #fff;
        border-bottom: 1px solid #e5e7eb;
    }

    .region-tabs {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .region-tab {
        padding: 0.5rem 1rem;
        background-color: #f3f4f6;
        border: none;
        border-radius: 1.5rem;
        font-size: 0.875rem;
        color: #6b7280;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .region-tab:hover {
        background-color: #e5e7eb;
    }

    .region-tab.active {
        background-color: #5ce0c6; /* 민트색 */
        color: white;
    }

    @media (max-width: 768px) {
        .region-tabs {
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        .region-tab {
            font-size: 0.75rem;
            padding: 0.4rem 0.8rem;
        }
    }
</style>