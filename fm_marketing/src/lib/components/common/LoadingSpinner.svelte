<!-- src/lib/components/common/LoadingSpinner.svelte -->
<script>
	export let size = 'md'; // xs, sm, md, lg, xl
	export let color = 'primary'; // primary, secondary, white, gray
	export let overlay = false; // 오버레이로 전체 화면 덮기
	export let text = ''; // 로딩 텍스트
	export let inline = false; // 인라인 표시
	
	// 크기별 클래스
	const sizeClasses = {
		xs: 'w-4 h-4',
		sm: 'w-6 h-6',
		md: 'w-8 h-8',
		lg: 'w-12 h-12',
		xl: 'w-16 h-16'
	};
	
	// 색상별 클래스
	const colorClasses = {
		primary: 'border-primary-mint border-t-primary-mintDark',
		secondary: 'border-primary-pink border-t-primary-pinkDark',
		white: 'border-white/30 border-t-white',
		gray: 'border-gray-300 border-t-gray-600'
	};
	
	$: sizeClass = sizeClasses[size] || sizeClasses.md;
	$: colorClass = colorClasses[color] || colorClasses.primary;
</script>

{#if overlay}
	<div class="loading-overlay">
		<div class="loading-content">
			<div class="spinner {sizeClass} {colorClass}"></div>
			{#if text}
				<p class="loading-text">{text}</p>
			{/if}
		</div>
	</div>
{:else}
	<div class="loading-container {inline ? 'inline' : ''}">
		<div class="spinner {sizeClass} {colorClass}"></div>
		{#if text}
			<p class="loading-text">{text}</p>
		{/if}
	</div>
{/if}

<style>
	.loading-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(255, 255, 255, 0.8);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
	}
	
	.loading-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 2rem;
		background-color: white;
		border-radius: 0.5rem;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
	}
	
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem;
	}
	
	.loading-container.inline {
		flex-direction: row;
		padding: 0;
	}
	
	.spinner {
		border: 2px solid;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}
	
	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
	
	.loading-text {
		font-size: 0.875rem;
		color: #6b7280;
		margin: 0;
		text-align: center;
	}
	
	.loading-container.inline .loading-text {
		margin-left: 0.5rem;
	}
</style>
