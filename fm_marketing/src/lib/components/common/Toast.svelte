<!-- src/lib/components/common/Toast.svelte -->
<script>
	import { fly } from 'svelte/transition';
	import { createEventDispatcher, onMount } from 'svelte';
	
	const dispatch = createEventDispatcher();
	
	export let type = 'info'; // success, error, warning, info
	export let title = '';
	export let message = '';
	export let duration = 5000; // 0이면 자동으로 사라지지 않음
	export let closable = true;
	export let position = 'top-right'; // top-right, top-left, bottom-right, bottom-left, top-center, bottom-center
	
	let visible = true;
	let timer;
	
	// 타입별 아이콘과 색상
	const typeConfig = {
		success: {
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
				<polyline points="22 4 12 14.01 9 11.01"></polyline>
			</svg>`,
			bgColor: 'bg-green-50',
			borderColor: 'border-green-200',
			iconColor: 'text-green-400',
			titleColor: 'text-green-800',
			messageColor: 'text-green-700'
		},
		error: {
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="10"></circle>
				<line x1="15" y1="9" x2="9" y2="15"></line>
				<line x1="9" y1="9" x2="15" y2="15"></line>
			</svg>`,
			bgColor: 'bg-red-50',
			borderColor: 'border-red-200',
			iconColor: 'text-red-400',
			titleColor: 'text-red-800',
			messageColor: 'text-red-700'
		},
		warning: {
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
				<line x1="12" y1="9" x2="12" y2="13"></line>
				<line x1="12" y1="17" x2="12.01" y2="17"></line>
			</svg>`,
			bgColor: 'bg-yellow-50',
			borderColor: 'border-yellow-200',
			iconColor: 'text-yellow-400',
			titleColor: 'text-yellow-800',
			messageColor: 'text-yellow-700'
		},
		info: {
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="10"></circle>
				<line x1="12" y1="16" x2="12" y2="12"></line>
				<line x1="12" y1="8" x2="12.01" y2="8"></line>
			</svg>`,
			bgColor: 'bg-blue-50',
			borderColor: 'border-blue-200',
			iconColor: 'text-blue-400',
			titleColor: 'text-blue-800',
			messageColor: 'text-blue-700'
		}
	};
	
	$: config = typeConfig[type] || typeConfig.info;
	
	// 위치별 클래스
	const positionClasses = {
		'top-right': 'top-4 right-4',
		'top-left': 'top-4 left-4',
		'bottom-right': 'bottom-4 right-4',
		'bottom-left': 'bottom-4 left-4',
		'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
		'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
	};
	
	$: positionClass = positionClasses[position] || positionClasses['top-right'];
	
	// 닫기 함수
	function close() {
		visible = false;
		if (timer) {
			clearTimeout(timer);
		}
		dispatch('close');
	}
	
	// 자동 닫기 타이머
	function startTimer() {
		if (duration > 0) {
			timer = setTimeout(() => {
				close();
			}, duration);
		}
	}
	
	// 타이머 정지
	function stopTimer() {
		if (timer) {
			clearTimeout(timer);
		}
	}
	
	onMount(() => {
		startTimer();
		
		return () => {
			if (timer) {
				clearTimeout(timer);
			}
		};
	});
</script>

{#if visible}
	<div 
		class="toast {positionClass}"
		transition:fly={{ 
			y: position.includes('top') ? -100 : 100, 
			duration: 300 
		}}
		on:mouseenter={stopTimer}
		on:mouseleave={startTimer}
	>
		<div class="toast-content {config.bgColor} {config.borderColor}">
			<div class="toast-icon {config.iconColor}">
				{@html config.icon}
			</div>
			
			<div class="toast-text">
				{#if title}
					<h4 class="toast-title {config.titleColor}">{title}</h4>
				{/if}
				
				{#if message}
					<p class="toast-message {config.messageColor}">{message}</p>
				{/if}
			</div>
			
			{#if closable}
				<button 
					class="toast-close"
					on:click={close}
					aria-label="닫기"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			{/if}
		</div>
		
		{#if duration > 0}
			<div class="progress-bar {config.iconColor.replace('text-', 'bg-')}"></div>
		{/if}
	</div>
{/if}

<style>
	.toast {
		position: fixed;
		z-index: 9999;
		max-width: 400px;
		width: auto;
		min-width: 300px;
		pointer-events: auto;
	}
	
	.toast-content {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 1rem;
		border-radius: 0.375rem;
		border: 1px solid;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
		position: relative;
		overflow: hidden;
	}
	
	.toast-icon {
		flex-shrink: 0;
		margin-top: 0.125rem;
	}
	
	.toast-text {
		flex: 1;
		min-width: 0;
	}
	
	.toast-title {
		font-size: 0.875rem;
		font-weight: 600;
		margin: 0 0 0.25rem 0;
		line-height: 1.4;
	}
	
	.toast-message {
		font-size: 0.875rem;
		margin: 0;
		line-height: 1.4;
	}
	
	.toast-close {
		flex-shrink: 0;
		background: none;
		border: none;
		color: #9ca3af;
		cursor: pointer;
		padding: 0.125rem;
		border-radius: 0.25rem;
		transition: color 0.2s;
	}
	
	.toast-close:hover {
		color: #6b7280;
	}
	
	.progress-bar {
		position: absolute;
		bottom: 0;
		left: 0;
		height: 2px;
		width: 100%;
		opacity: 0.6;
		animation: progress var(--duration, 5000ms) linear forwards;
	}
	
	@keyframes progress {
		from { width: 100%; }
		to { width: 0%; }
	}
	
	@media (max-width: 640px) {
		.toast {
			left: 1rem !important;
			right: 1rem !important;
			max-width: none;
			min-width: 0;
			transform: none !important;
		}
	}
</style>
