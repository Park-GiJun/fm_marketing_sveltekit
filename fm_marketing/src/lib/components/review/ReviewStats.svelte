<!-- src/lib/components/review/ReviewStats.svelte -->
<script>
	import { onMount } from 'svelte';
	import { reviewStore } from '$lib/stores/reviewStore.js';

	// 통계 데이터
	let stats = {
		totalReviews: 0,
		activeReviews: 0,
		totalParticipants: 0,
		averageRating: 0,
		monthlyGrowth: 0
	};

	let loading = true;

	// 더미 통계 데이터 생성
	function generateStats() {
		stats = {
			totalReviews: 1247,
			activeReviews: 89,
			totalParticipants: 3429,
			averageRating: 4.7,
			monthlyGrowth: 15.3
		};
		loading = false;
	}

	// 숫자 포맷팅
	function formatNumber(num) {
		return num.toLocaleString();
	}

	onMount(() => {
		// 실제 구현에서는 API 호출
		setTimeout(generateStats, 500);
	});
</script>

<div class="stats-container">
	<h2 class="stats-title">체험단 통계</h2>

	{#if loading}
		<div class="loading-skeleton">
			{#each Array(5) as _}
				<div class="skeleton-item"></div>
			{/each}
		</div>
	{:else}
		<div class="stats-grid">
			<div class="stat-card">
				<div class="stat-icon total">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M3 3h18v18H3zM9 9h6v6H9z"/>
					</svg>
				</div>
				<div class="stat-content">
					<span class="stat-label">총 체험단 수</span>
					<span class="stat-value">{formatNumber(stats.totalReviews)}</span>
				</div>
			</div>

			<div class="stat-card">
				<div class="stat-icon active">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="10"/>
						<polyline points="12,6 12,12 16,14"/>
					</svg>
				</div>
				<div class="stat-content">
					<span class="stat-label">진행 중</span>
					<span class="stat-value">{formatNumber(stats.activeReviews)}</span>
				</div>
			</div>

			<div class="stat-card">
				<div class="stat-icon participants">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
						<circle cx="9" cy="7" r="4"/>
						<path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
						<path d="M16 3.13a4 4 0 0 1 0 7.75"/>
					</svg>
				</div>
				<div class="stat-content">
					<span class="stat-label">총 참여자</span>
					<span class="stat-value">{formatNumber(stats.totalParticipants)}</span>
				</div>
			</div>

			<div class="stat-card">
				<div class="stat-icon rating">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
					</svg>
				</div>
				<div class="stat-content">
					<span class="stat-label">평균 평점</span>
					<span class="stat-value">{stats.averageRating}</span>
				</div>
			</div>

			<div class="stat-card">
				<div class="stat-icon growth">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/>
						<polyline points="17,6 23,6 23,12"/>
					</svg>
				</div>
				<div class="stat-content">
					<span class="stat-label">월간 성장률</span>
					<span class="stat-value">+{stats.monthlyGrowth}%</span>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.stats-container {
		background-color: white;
		border-radius: 0.5rem;
		padding: 1.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		margin-bottom: 2rem;
	}

	.stats-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 1.5rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.loading-skeleton {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.skeleton-item {
		height: 100px;
		background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
		background-size: 200% 100%;
		animation: loading 1.5s infinite;
		border-radius: 0.375rem;
	}

	@keyframes loading {
		0% { background-position: 200% 0; }
		100% { background-position: -200% 0; }
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.stat-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.25rem;
		background-color: #f9fafb;
		border-radius: 0.375rem;
		border: 1px solid #e5e7eb;
		transition: all 0.2s;
	}

	.stat-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
	}

	.stat-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 3rem;
		height: 3rem;
		border-radius: 0.5rem;
		color: white;
	}

	.stat-icon.total { background-color: #5ce0c6; }
	.stat-icon.active { background-color: #3b82f6; }
	.stat-icon.participants { background-color: #8b5cf6; }
	.stat-icon.rating { background-color: #f59e0b; }
	.stat-icon.growth { background-color: #10b981; }

	.stat-content {
		display: flex;
		flex-direction: column;
	}

	.stat-label {
		font-size: 0.875rem;
		color: #6b7280;
		margin-bottom: 0.25rem;
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 700;
		color: #1f2937;
	}

	@media (max-width: 768px) {
		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 480px) {
		.stats-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
