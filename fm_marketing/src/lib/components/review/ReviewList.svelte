<!-- src/lib/components/review/ReviewList.svelte -->
<script>
	import Badge from '$lib/components/common/Badge.svelte';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';

	export let reviews = [];
	export let loading = false;
	export let columns = 3; // 그리드 컬럼 수

	// 그리드 컬럼 클래스 매핑
	const columnClasses = {
		1: 'grid-cols-1',
		2: 'grid-cols-1 md:grid-cols-2',
		3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
		4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
	};

	$: gridClass = columnClasses[columns] || columnClasses[3];

	// 날짜 포맷팅
	function formatDate(daysAgo) {
		const today = new Date();
		const date = new Date(today);
		date.setDate(today.getDate() - daysAgo);
		
		return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
	}

	// 상대 시간 표시
	function getRelativeTime(daysAgo) {
		if (daysAgo === 0) return '오늘';
		if (daysAgo === 1) return '어제';
		if (daysAgo <= 7) return `${daysAgo}일 전`;
		if (daysAgo <= 30) return `${Math.floor(daysAgo / 7)}주 전`;
		return formatDate(daysAgo);
	}
</script>

<div class="review-list-container">
	{#if loading}
		<div class="loading-container">
			<LoadingSpinner size="lg" text="리뷰를 불러오는 중입니다..." />
		</div>
	{:else if reviews.length === 0}
		<div class="empty-state">
			<div class="empty-icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
					<circle cx="11" cy="11" r="8"></circle>
					<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
				</svg>
			</div>
			<h3 class="empty-title">검색 결과가 없습니다</h3>
			<p class="empty-description">다른 검색어나 필터를 사용해보세요.</p>
		</div>
	{:else}
		<div class="review-grid {gridClass}">
			{#each reviews as review (review.id)}
				<div class="review-card">
					<a href="/checklist/{review.id}" class="review-link">
						<!-- 이미지 영역 -->
						<div class="review-image">
							{#if review.images && review.images.length > 0}
								<img 
									src={review.images[0]} 
									alt={review.title} 
									loading="lazy"
								/>
							{:else}
								<div class="placeholder-image">
									<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
										<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
										<circle cx="8.5" cy="8.5" r="1.5"></circle>
										<polyline points="21 15 16 10 5 21"></polyline>
									</svg>
								</div>
							{/if}

							<!-- 배지 -->
							<div class="review-badges">
								{#if review.isPromoted}
									<Badge type="premium" size="sm">기자단</Badge>
								{:else}
									<Badge type="review" size="sm">체험단</Badge>
								{/if}

								{#if review.daysAgo <= 3}
									<Badge type="success" size="sm">NEW</Badge>
								{/if}
							</div>
						</div>

						<!-- 콘텐츠 영역 -->
						<div class="review-content">
							<h3 class="review-title">{review.title}</h3>
							
							<div class="review-meta">
								<span class="review-region">{review.region || '전국'}</span>
								<span class="meta-divider">·</span>
								<span class="review-date">{getRelativeTime(review.daysAgo)}</span>
							</div>

							<div class="review-stats">
								<div class="stat-item">
									<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
										<circle cx="12" cy="12" r="3"></circle>
									</svg>
									<span>{review.views || 0}</span>
								</div>

								<div class="stat-item">
									<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
									</svg>
									<span>{review.likes || 0}</span>
								</div>
							</div>

							{#if review.tags && review.tags.length > 0}
								<div class="review-tags">
									{#each review.tags.slice(0, 3) as tag}
										<span class="tag">#{tag}</span>
									{/each}
								</div>
							{/if}
						</div>
					</a>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.review-list-container {
		width: 100%;
	}

	.loading-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 300px;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 400px;
		text-align: center;
		color: #9ca3af;
	}

	.empty-icon {
		margin-bottom: 1rem;
		opacity: 0.6;
	}

	.empty-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #4b5563;
		margin: 0 0 0.5rem 0;
	}

	.empty-description {
		font-size: 0.875rem;
		margin: 0;
	}

	.review-grid {
		display: grid;
		gap: 1.5rem;
		width: 100%;
	}

	.review-card {
		background-color: white;
		border-radius: 0.5rem;
		overflow: hidden;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		transition: all 0.2s ease;
	}

	.review-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.review-link {
		display: block;
		text-decoration: none;
		color: inherit;
		height: 100%;
	}

	.review-image {
		position: relative;
		width: 100%;
		height: 200px;
		overflow: hidden;
	}

	.review-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease;
	}

	.review-card:hover .review-image img {
		transform: scale(1.05);
	}

	.placeholder-image {
		width: 100%;
		height: 100%;
		background-color: #f3f4f6;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #9ca3af;
	}

	.review-badges {
		position: absolute;
		top: 0.75rem;
		left: 0.75rem;
		display: flex;
		gap: 0.5rem;
	}

	.review-content {
		padding: 1.25rem;
	}

	.review-title {
		font-size: 1rem;
		font-weight: 600;
		color: #1f2937;
		margin: 0 0 0.75rem 0;
		line-height: 1.5;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.review-meta {
		display: flex;
		align-items: center;
		font-size: 0.75rem;
		color: #9ca3af;
		margin-bottom: 0.75rem;
	}

	.meta-divider {
		margin: 0 0.5rem;
	}

	.review-stats {
		display: flex;
		gap: 1rem;
		margin-bottom: 0.75rem;
	}

	.stat-item {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.75rem;
		color: #9ca3af;
	}

	.review-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.tag {
		font-size: 0.75rem;
		color: #6b7280;
		background-color: #f3f4f6;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
	}

	/* 반응형 그리드 클래스 */
	.grid-cols-1 {
		grid-template-columns: repeat(1, minmax(0, 1fr));
	}

	@media (min-width: 768px) {
		.md\:grid-cols-2 {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (min-width: 1024px) {
		.lg\:grid-cols-3 {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (min-width: 1280px) {
		.xl\:grid-cols-4 {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	@media (max-width: 640px) {
		.review-grid {
			gap: 1rem;
		}

		.review-content {
			padding: 1rem;
		}

		.review-image {
			height: 160px;
		}
	}
</style>
