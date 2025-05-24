<!-- src/lib/components/common/Tabs.svelte -->
<script>
	import { createEventDispatcher } from 'svelte';
	
	const dispatch = createEventDispatcher();
	
	export let tabs = [];
	export let activeTab = '';
	export let variant = 'underline'; // underline, pills, buttons
	export let size = 'md'; // sm, md, lg
	export let fullWidth = false;
	export let disabled = false;
	export let vertical = false;
	
	// 사이즈별 클래스
	const sizeClasses = {
		sm: 'text-sm py-1.5 px-3',
		md: 'text-sm py-2 px-4',
		lg: 'text-base py-3 px-6'
	};
	
	$: sizeClass = sizeClasses[size] || sizeClasses.md;
	
	// 탭 변경 핸들러
	function handleTabChange(tabId) {
		if (disabled) return;
		
		activeTab = tabId;
		dispatch('change', { activeTab: tabId });
	}
	
	// 키보드 네비게이션
	function handleKeydown(event, tabId) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleTabChange(tabId);
		}
	}
</script>

<div class="tabs-container {vertical ? 'vertical' : 'horizontal'}">
	<div 
		class="tabs-list 
			{variant} 
			{fullWidth ? 'full-width' : ''} 
			{disabled ? 'disabled' : ''}"
		role="tablist"
		aria-orientation={vertical ? 'vertical' : 'horizontal'}
	>
		{#each tabs as tab (tab.id)}
			<button
				class="tab-button 
					{sizeClass} 
					{activeTab === tab.id ? 'active' : ''} 
					{tab.disabled ? 'tab-disabled' : ''}"
				role="tab"
				aria-selected={activeTab === tab.id}
				aria-controls="panel-{tab.id}"
				disabled={disabled || tab.disabled}
				on:click={() => handleTabChange(tab.id)}
				on:keydown={(e) => handleKeydown(e, tab.id)}
				tabindex={activeTab === tab.id ? 0 : -1}
			>
				{#if tab.icon}
					<span class="tab-icon">
						{@html tab.icon}
					</span>
				{/if}
				
				<span class="tab-text">{tab.label}</span>
				
				{#if tab.badge !== undefined && tab.badge !== null}
					<span class="tab-badge">
						{tab.badge}
					</span>
				{/if}
				
				{#if tab.closable}
					<button 
						class="tab-close"
						on:click|stopPropagation={() => dispatch('close', { tabId: tab.id })}
						aria-label="탭 닫기"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					</button>
				{/if}
			</button>
		{/each}
	</div>
	
	<div class="tab-panels">
		{#each tabs as tab (tab.id)}
			<div
				class="tab-panel {activeTab === tab.id ? 'active' : ''}"
				role="tabpanel"
				id="panel-{tab.id}"
				aria-labelledby="tab-{tab.id}"
				hidden={activeTab !== tab.id}
			>
				<slot name="panel" {tab} />
			</div>
		{/each}
	</div>
</div>

<style>
	.tabs-container {
		width: 100%;
	}
	
	.tabs-container.horizontal {
		display: flex;
		flex-direction: column;
	}
	
	.tabs-container.vertical {
		display: flex;
		flex-direction: row;
	}
	
	.tabs-list {
		display: flex;
		position: relative;
	}
	
	.tabs-container.horizontal .tabs-list {
		flex-direction: row;
		border-bottom: 1px solid #e5e7eb;
	}
	
	.tabs-container.vertical .tabs-list {
		flex-direction: column;
		border-right: 1px solid #e5e7eb;
		min-width: 200px;
	}
	
	.tabs-list.full-width .tab-button {
		flex: 1;
	}
	
	.tabs-list.disabled {
		opacity: 0.5;
		pointer-events: none;
	}
	
	.tab-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background-color: transparent;
		border: none;
		cursor: pointer;
		transition: all 0.2s;
		font-weight: 500;
		white-space: nowrap;
		position: relative;
		color: #6b7280;
	}
	
	.tab-button:hover:not(.tab-disabled) {
		color: #4b5563;
	}
	
	.tab-button:focus {
		outline: none;
		box-shadow: 0 0 0 2px rgba(92, 224, 198, 0.2);
	}
	
	.tab-button.tab-disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	
	.tab-icon {
		display: flex;
		align-items: center;
	}
	
	.tab-text {
		flex: 1;
	}
	
	.tab-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 1.25rem;
		height: 1.25rem;
		padding: 0 0.375rem;
		background-color: #e5e7eb;
		color: #6b7280;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 500;
		line-height: 1;
	}
	
	.tab-close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.25rem;
		height: 1.25rem;
		background-color: transparent;
		border: none;
		border-radius: 0.25rem;
		color: #9ca3af;
		cursor: pointer;
		transition: all 0.2s;
		opacity: 0;
	}
	
	.tab-button:hover .tab-close {
		opacity: 1;
	}
	
	.tab-close:hover {
		background-color: #f3f4f6;
		color: #6b7280;
	}
	
	/* Underline variant */
	.tabs-list.underline .tab-button {
		border-bottom: 2px solid transparent;
		margin-bottom: -1px;
	}
	
	.tabs-list.underline .tab-button.active {
		color: #5ce0c6;
		border-bottom-color: #5ce0c6;
	}
	
	.tabs-list.underline .tab-button.active .tab-badge {
		background-color: #5ce0c6;
		color: white;
	}
	
	/* Pills variant */
	.tabs-list.pills {
		padding: 0.25rem;
		background-color: #f3f4f6;
		border-radius: 0.5rem;
		border: none;
	}
	
	.tabs-list.pills .tab-button {
		border-radius: 0.375rem;
	}
	
	.tabs-list.pills .tab-button.active {
		background-color: white;
		color: #1f2937;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}
	
	.tabs-list.pills .tab-button.active .tab-badge {
		background-color: #5ce0c6;
		color: white;
	}
	
	/* Buttons variant */
	.tabs-list.buttons {
		gap: 0.5rem;
		border: none;
	}
	
	.tabs-list.buttons .tab-button {
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		background-color: white;
	}
	
	.tabs-list.buttons .tab-button:hover:not(.tab-disabled) {
		border-color: #9ca3af;
		background-color: #f9fafb;
	}
	
	.tabs-list.buttons .tab-button.active {
		background-color: #5ce0c6;
		border-color: #5ce0c6;
		color: white;
	}
	
	.tabs-list.buttons .tab-button.active .tab-badge {
		background-color: rgba(255, 255, 255, 0.2);
		color: white;
	}
	
	/* Vertical variants */
	.tabs-container.vertical .tabs-list.underline .tab-button {
		border-bottom: none;
		border-right: 2px solid transparent;
		margin-bottom: 0;
		margin-right: -1px;
		justify-content: flex-start;
	}
	
	.tabs-container.vertical .tabs-list.underline .tab-button.active {
		border-right-color: #5ce0c6;
	}
	
	.tabs-container.vertical .tabs-list.pills,
	.tabs-container.vertical .tabs-list.buttons {
		flex-direction: column;
	}
	
	/* Tab panels */
	.tab-panels {
		flex: 1;
	}
	
	.tabs-container.horizontal .tab-panels {
		margin-top: 1rem;
	}
	
	.tabs-container.vertical .tab-panels {
		margin-left: 1rem;
	}
	
	.tab-panel {
		width: 100%;
	}
	
	.tab-panel.active {
		animation: fadeIn 0.2s ease-out;
	}
	
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(0.5rem);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	/* 반응형 */
	@media (max-width: 768px) {
		.tabs-container.vertical {
			flex-direction: column;
		}
		
		.tabs-container.vertical .tabs-list {
			flex-direction: row;
			border-right: none;
			border-bottom: 1px solid #e5e7eb;
			min-width: auto;
			overflow-x: auto;
		}
		
		.tabs-container.vertical .tab-panels {
			margin-left: 0;
			margin-top: 1rem;
		}
		
		.tabs-list {
			overflow-x: auto;
			scrollbar-width: none;
			-ms-overflow-style: none;
		}
		
		.tabs-list::-webkit-scrollbar {
			display: none;
		}
	}
</style>
