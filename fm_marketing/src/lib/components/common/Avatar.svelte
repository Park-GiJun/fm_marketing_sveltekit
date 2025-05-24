<!-- src/lib/components/common/Avatar.svelte -->
<script>
	export let src = '';
	export let alt = '사용자 아바타';
	export let size = 'md'; // xs, sm, md, lg, xl
	export let fallback = ''; // 이니셜 등
	export let status = null; // online, offline, away, busy

	// 사이즈별 클래스
	const sizeClasses = {
		xs: 'w-6 h-6 text-xs',
		sm: 'w-8 h-8 text-sm',
		md: 'w-10 h-10 text-base',
		lg: 'w-12 h-12 text-lg',
		xl: 'w-16 h-16 text-xl'
	};

	// 상태별 색상
	const statusColors = {
		online: 'bg-green-400',
		offline: 'bg-gray-400',
		away: 'bg-yellow-400',
		busy: 'bg-red-400'
	};

	$: sizeClass = sizeClasses[size] || sizeClasses.md;
	$: statusColor = statusColors[status] || '';

	let imageError = false;

	function handleImageError() {
		imageError = true;
	}
</script>

<div class="avatar-container {sizeClass}">
	<div class="avatar {sizeClass}">
		{#if src && !imageError}
			<img 
				{src} 
				{alt} 
				class="avatar-image" 
				on:error={handleImageError}
			/>
		{:else if fallback}
			<span class="avatar-fallback">{fallback}</span>
		{:else}
			<svg class="avatar-default" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
				<path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
			</svg>
		{/if}
	</div>

	{#if status}
		<div class="status-indicator {statusColor}"></div>
	{/if}
</div>

<style>
	.avatar-container {
		position: relative;
		display: inline-block;
	}

	.avatar {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		overflow: hidden;
		background-color: #e5e7eb;
		color: #6b7280;
	}

	.avatar-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.avatar-fallback {
		font-weight: 500;
		text-transform: uppercase;
	}

	.avatar-default {
		width: 60%;
		height: 60%;
	}

	.status-indicator {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 25%;
		height: 25%;
		border-radius: 50%;
		border: 2px solid white;
	}
</style>
