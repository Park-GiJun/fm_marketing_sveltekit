<!-- src/lib/components/common/Dropdown.svelte -->
<script>
	import { createEventDispatcher, onMount } from 'svelte';
	
	const dispatch = createEventDispatcher();
	
	export let items = [];
	export let placeholder = '선택하세요';
	export let value = null;
	export let disabled = false;
	export let searchable = false;
	export let clearable = false;
	export let size = 'md'; // sm, md, lg
	export let position = 'bottom'; // bottom, top
	
	let open = false;
	let searchQuery = '';
	let dropdownElement;
	let triggerElement;
	let searchInput;
	
	// 사이즈별 클래스
	const sizeClasses = {
		sm: 'text-sm py-1.5 px-2',
		md: 'text-base py-2 px-3',
		lg: 'text-lg py-3 px-4'
	};
	
	$: sizeClass = sizeClasses[size] || sizeClasses.md;
	
	// 필터된 아이템들
	$: filteredItems = searchable && searchQuery
		? items.filter(item => 
			item.label.toLowerCase().includes(searchQuery.toLowerCase())
		)
		: items;
	
	// 선택된 아이템
	$: selectedItem = items.find(item => item.value === value);
	
	// 드롭다운 토글
	function toggleDropdown() {
		if (disabled) return;
		
		open = !open;
		
		if (open && searchable) {
			setTimeout(() => {
				if (searchInput) {
					searchInput.focus();
				}
			}, 10);
		}
	}
	
	// 아이템 선택
	function selectItem(item) {
		value = item.value;
		open = false;
		searchQuery = '';
		
		dispatch('change', {
			value: item.value,
			label: item.label,
			item
		});
	}
	
	// 선택 해제
	function clearSelection() {
		value = null;
		dispatch('change', {
			value: null,
			label: null,
			item: null
		});
	}
	
	// 외부 클릭 감지
	function handleClickOutside(event) {
		if (dropdownElement && !dropdownElement.contains(event.target)) {
			open = false;
			searchQuery = '';
		}
	}
	
	// 키보드 이벤트
	function handleKeydown(event) {
		if (disabled) return;
		
		switch (event.key) {
			case 'Enter':
			case ' ':
				if (!open) {
					event.preventDefault();
					toggleDropdown();
				}
				break;
			case 'Escape':
				if (open) {
					event.preventDefault();
					open = false;
					searchQuery = '';
				}
				break;
			case 'ArrowDown':
				event.preventDefault();
				if (!open) {
					toggleDropdown();
				}
				break;
			case 'ArrowUp':
				event.preventDefault();
				if (!open) {
					toggleDropdown();
				}
				break;
		}
	}
	
	// 검색 키보드 이벤트
	function handleSearchKeydown(event) {
		if (event.key === 'Escape') {
			open = false;
			searchQuery = '';
			triggerElement.focus();
		}
	}
	
	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<div class="dropdown" bind:this={dropdownElement}>
	<button
		class="dropdown-trigger {sizeClass} {disabled ? 'disabled' : ''}"
		on:click={toggleDropdown}
		on:keydown={handleKeydown}
		bind:this={triggerElement}
		{disabled}
		aria-haspopup="listbox"
		aria-expanded={open}
	>
		<span class="dropdown-value">
			{selectedItem ? selectedItem.label : placeholder}
		</span>
		
		<div class="dropdown-icons">
			{#if clearable && value && !disabled}
				<button
					class="clear-button"
					on:click|stopPropagation={clearSelection}
					aria-label="선택 해제"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			{/if}
			
			<div class="chevron {open ? 'open' : ''}">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<polyline points="6 9 12 15 18 9"></polyline>
				</svg>
			</div>
		</div>
	</button>
	
	{#if open}
		<div class="dropdown-menu {position}">
			{#if searchable}
				<div class="search-container">
					<input
						type="text"
						class="search-input"
						placeholder="검색..."
						bind:value={searchQuery}
						bind:this={searchInput}
						on:keydown={handleSearchKeydown}
					/>
				</div>
			{/if}
			
			<div class="dropdown-items" role="listbox">
				{#each filteredItems as item (item.value)}
					<button
						class="dropdown-item {value === item.value ? 'selected' : ''}"
						on:click={() => selectItem(item)}
						role="option"
						aria-selected={value === item.value}
					>
						<span class="item-label">{item.label}</span>
						
						{#if item.description}
							<span class="item-description">{item.description}</span>
						{/if}
						
						{#if value === item.value}
							<div class="selected-icon">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<polyline points="20 6 9 17 4 12"></polyline>
								</svg>
							</div>
						{/if}
					</button>
				{:else}
					<div class="no-items">
						{searchQuery ? '검색 결과가 없습니다' : '항목이 없습니다'}
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.dropdown {
		position: relative;
		width: 100%;
	}
	
	.dropdown-trigger {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: white;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		cursor: pointer;
		transition: all 0.2s;
	}
	
	.dropdown-trigger:hover:not(.disabled) {
		border-color: #9ca3af;
	}
	
	.dropdown-trigger:focus:not(.disabled) {
		outline: none;
		border-color: #5ce0c6;
		box-shadow: 0 0 0 2px rgba(92, 224, 198, 0.2);
	}
	
	.dropdown-trigger.disabled {
		background-color: #f3f4f6;
		color: #9ca3af;
		cursor: not-allowed;
	}
	
	.dropdown-value {
		flex: 1;
		text-align: left;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.dropdown-icons {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		margin-left: 0.5rem;
	}
	
	.clear-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.5rem;
		height: 1.5rem;
		background-color: transparent;
		border: none;
		border-radius: 0.25rem;
		color: #9ca3af;
		cursor: pointer;
		transition: all 0.2s;
	}
	
	.clear-button:hover {
		background-color: #f3f4f6;
		color: #6b7280;
	}
	
	.chevron {
		display: flex;
		align-items: center;
		color: #9ca3af;
		transition: transform 0.2s;
	}
	
	.chevron.open {
		transform: rotate(180deg);
	}
	
	.dropdown-menu {
		position: absolute;
		left: 0;
		right: 0;
		z-index: 50;
		margin-top: 0.25rem;
		background-color: white;
		border: 1px solid #e5e7eb;
		border-radius: 0.375rem;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
		max-height: 200px;
		overflow: hidden;
	}
	
	.dropdown-menu.top {
		bottom: 100%;
		top: auto;
		margin-top: 0;
		margin-bottom: 0.25rem;
	}
	
	.search-container {
		padding: 0.5rem;
		border-bottom: 1px solid #e5e7eb;
	}
	
	.search-input {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #d1d5db;
		border-radius: 0.25rem;
		font-size: 0.875rem;
		outline: none;
	}
	
	.search-input:focus {
		border-color: #5ce0c6;
		box-shadow: 0 0 0 2px rgba(92, 224, 198, 0.2);
	}
	
	.dropdown-items {
		max-height: 160px;
		overflow-y: auto;
	}
	
	.dropdown-item {
		width: 100%;
		display: flex;
		align-items: center;
		padding: 0.75rem;
		text-align: left;
		background-color: transparent;
		border: none;
		cursor: pointer;
		transition: background-color 0.2s;
	}
	
	.dropdown-item:hover {
		background-color: #f9fafb;
	}
	
	.dropdown-item.selected {
		background-color: #ecfdf5;
		color: #10b981;
	}
	
	.item-label {
		flex: 1;
		font-size: 0.875rem;
	}
	
	.item-description {
		font-size: 0.75rem;
		color: #9ca3af;
		margin-left: 0.5rem;
	}
	
	.selected-icon {
		margin-left: 0.5rem;
		color: #10b981;
	}
	
	.no-items {
		padding: 0.75rem;
		text-align: center;
		font-size: 0.875rem;
		color: #9ca3af;
	}
</style>
