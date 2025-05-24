<!-- src/lib/components/common/SearchBar.svelte -->
<script>
	export let placeholder = '검색어를 입력하세요';
	export let value = '';
	export let size = 'md'; // sm, md, lg

	// 검색 이벤트 디스패처
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	function handleSearch() {
		dispatch('search', { query: value });
	}

	function handleKeyPress(event) {
		if (event.key === 'Enter') {
			handleSearch();
		}
	}

	// 사이즈별 클래스
	const sizeClasses = {
		sm: 'h-8 text-sm',
		md: 'h-10 text-base',
		lg: 'h-12 text-lg'
	};

	$: sizeClass = sizeClasses[size] || sizeClasses.md;
</script>

<div class="search-bar {sizeClass}">
	<input
		type="text"
		{placeholder}
		bind:value
		on:keypress={handleKeyPress}
		class="search-input"
	/>
	<button 
		type="button" 
		class="search-button" 
		on:click={handleSearch}
		aria-label="검색"
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<circle cx="11" cy="11" r="8"></circle>
			<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
		</svg>
	</button>
</div>

<style>
	.search-bar {
		display: flex;
		width: 100%;
		max-width: 400px;
		border: 1px solid #e5e7eb;
		border-radius: 0.375rem;
		overflow: hidden;
		background-color: white;
	}

	.search-bar:focus-within {
		border-color: #5ce0c6;
		box-shadow: 0 0 0 2px rgba(92, 224, 198, 0.2);
	}

	.search-input {
		flex: 1;
		padding: 0 1rem;
		border: none;
		outline: none;
		background: transparent;
	}

	.search-button {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 0.75rem;
		background-color: #f9fafb;
		border: none;
		color: #6b7280;
		cursor: pointer;
		transition: all 0.2s;
	}

	.search-button:hover {
		background-color: #f3f4f6;
		color: #4b5563;
	}
</style>
