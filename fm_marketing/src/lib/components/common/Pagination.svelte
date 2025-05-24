<!-- src/lib/components/common/Pagination.svelte -->
<script>
	import { createEventDispatcher } from 'svelte';
	
	const dispatch = createEventDispatcher();
	
	export let currentPage = 1;
	export let totalPages = 1;
	export let totalItems = 0;
	export let itemsPerPage = 10;
	export let showInfo = true;
	export let showPageNumbers = true;
	export let maxPageNumbers = 5;
	export let size = 'md'; // sm, md, lg
	export let disabled = false;
	
	// 사이즈별 클래스
	const sizeClasses = {
		sm: 'text-sm py-1.5 px-2.5',
		md: 'text-sm py-2 px-3',
		lg: 'text-base py-2.5 px-4'
	};
	
	$: sizeClass = sizeClasses[size] || sizeClasses.md;
	
	// 페이지 번호 범위 계산
	$: pageNumbers = getPageNumbers(currentPage, totalPages, maxPageNumbers);
	
	// 정보 텍스트
	$: infoText = getInfoText(currentPage, totalPages, totalItems, itemsPerPage);
	
	function getPageNumbers(current, total, max) {
		if (total <= max) {
			return Array.from({ length: total }, (_, i) => i + 1);
		}
		
		const half = Math.floor(max / 2);
		let start = Math.max(1, current - half);
		let end = Math.min(total, start + max - 1);
		
		if (end - start + 1 < max) {
			start = Math.max(1, end - max + 1);
		}
		
		return Array.from({ length: end - start + 1 }, (_, i) => start + i);
	}
	
	function getInfoText(current, total, items, perPage) {
		if (items === 0) return '항목이 없습니다';
		
		const start = (current - 1) * perPage + 1;
		const end = Math.min(current * perPage, items);
		
		return `총 ${items.toLocaleString()}개 중 ${start.toLocaleString()}-${end.toLocaleString()}개 표시`;
	}
	
	function goToPage(page) {
		if (page < 1 || page > totalPages || page === currentPage || disabled) {
			return;
		}
		
		dispatch('change', { page });
	}
	
	function goToPrevious() {
		goToPage(currentPage - 1);
	}
	
	function goToNext() {
		goToPage(currentPage + 1);
	}
	
	function goToFirst() {
		goToPage(1);
	}
	
	function goToLast() {
		goToPage(totalPages);
	}
</script>

<div class="pagination-container">
	{#if showInfo && totalItems > 0}
		<div class="pagination-info">
			<span class="info-text">{infoText}</span>
		</div>
	{/if}
	
	<nav class="pagination" aria-label="페이지네이션">
		<!-- 첫 페이지 -->
		<button
			class="pagination-button {sizeClass}"
			on:click={goToFirst}
			disabled={currentPage === 1 || disabled}
			aria-label="첫 페이지"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<polyline points="11 17 6 12 11 7"></polyline>
				<polyline points="18 17 13 12 18 7"></polyline>
			</svg>
		</button>
		
		<!-- 이전 페이지 -->
		<button
			class="pagination-button {sizeClass}"
			on:click={goToPrevious}
			disabled={currentPage === 1 || disabled}
			aria-label="이전 페이지"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<polyline points="15 18 9 12 15 6"></polyline>
			</svg>
		</button>
		
		{#if showPageNumbers}
			<!-- 첫 페이지가 범위에 없으면 표시 -->
			{#if pageNumbers[0] > 1}
				<button
					class="pagination-number {sizeClass}"
					on:click={() => goToPage(1)}
					disabled={disabled}
				>
					1
				</button>
				
				{#if pageNumbers[0] > 2}
					<span class="pagination-ellipsis">...</span>
				{/if}
			{/if}
			
			<!-- 페이지 번호들 -->
			{#each pageNumbers as pageNum}
				<button
					class="pagination-number {sizeClass} {currentPage === pageNum ? 'active' : ''}"
					on:click={() => goToPage(pageNum)}
					disabled={disabled}
					aria-current={currentPage === pageNum ? 'page' : undefined}
				>
					{pageNum}
				</button>
			{/each}
			
			<!-- 마지막 페이지가 범위에 없으면 표시 -->
			{#if pageNumbers[pageNumbers.length - 1] < totalPages}
				{#if pageNumbers[pageNumbers.length - 1] < totalPages - 1}
					<span class="pagination-ellipsis">...</span>
				{/if}
				
				<button
					class="pagination-number {sizeClass}"
					on:click={() => goToPage(totalPages)}
					disabled={disabled}
				>
					{totalPages}
				</button>
			{/if}
		{:else}
			<!-- 페이지 번호 없이 현재/전체만 표시 -->
			<span class="page-indicator {sizeClass}">
				{currentPage} / {totalPages}
			</span>
		{/if}
		
		<!-- 다음 페이지 -->
		<button
			class="pagination-button {sizeClass}"
			on:click={goToNext}
			disabled={currentPage === totalPages || disabled}
			aria-label="다음 페이지"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<polyline points="9 18 15 12 9 6"></polyline>
			</svg>
		</button>
		
		<!-- 마지막 페이지 -->
		<button
			class="pagination-button {sizeClass}"
			on:click={goToLast}
			disabled={currentPage === totalPages || disabled}
			aria-label="마지막 페이지"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<polyline points="13 17 18 12 13 7"></polyline>
				<polyline points="6 17 11 12 6 7"></polyline>
			</svg>
		</button>
	</nav>
</div>

<style>
	.pagination-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}
	
	.pagination-info {
		display: flex;
		justify-content: center;
	}
	
	.info-text {
		font-size: 0.875rem;
		color: #6b7280;
	}
	
	.pagination {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}
	
	.pagination-button,
	.pagination-number {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: white;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		color: #4b5563;
		cursor: pointer;
		transition: all 0.2s;
		min-width: 2.5rem;
	}
	
	.pagination-button:hover:not(:disabled),
	.pagination-number:hover:not(:disabled):not(.active) {
		background-color: #f9fafb;
		border-color: #9ca3af;
	}
	
	.pagination-button:disabled,
	.pagination-number:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background-color: #f3f4f6;
	}
	
	.pagination-number.active {
		background-color: #5ce0c6;
		border-color: #5ce0c6;
		color: white;
		cursor: default;
	}
	
	.pagination-ellipsis {
		padding: 0 0.5rem;
		color: #9ca3af;
		font-size: 0.875rem;
	}
	
	.page-indicator {
		display: flex;
		align-items: center;
		justify-content: center;
		color: #4b5563;
		font-weight: 500;
		min-width: 4rem;
	}
	
	@media (max-width: 640px) {
		.pagination-container {
			flex-direction: column-reverse;
		}
		
		.pagination {
			flex-wrap: wrap;
			justify-content: center;
		}
		
		.pagination-info {
			order: 2;
		}
	}
</style>
