<!-- src/lib/components/review/ReviewCard.svelte -->
<script>
	// 리뷰 데이터 props
	export let id = '';              // ID를 활용하여 링크 생성에 사용
	export let title = '';
	export let content = '';         // 콘텐츠 요약 표시에 사용
	export let images = [];
	export let daysAgo = 0;
	export let views = 0;
	export let likes = 0;
	export let tags = [];
	export let isPromoted = false; // 기자단 여부
	export let type = '체험단'; // 유형 (체험단, 기자단 등)

	// 이미지 없는 경우 더미 이미지 표시
	const hasImages = images && images.length > 0;

	// 날짜 포맷팅
	function formatDaysAgo(days) {
		if (days === 0) return '오늘';
		return `${days}일 남음`;
	}

	// 콘텐츠 요약 생성
	const contentSummary = content && content.length > 50
		? content.substring(0, 50) + '...'
		: content || '자세한 정보는 클릭하여 확인하세요.';
</script>

<a href={`/checklist/${id}`} class="review-card">
	<div class="card-badge">
    <span class={isPromoted ? 'premium-badge' : 'normal-badge'}>
      {type}
    </span>
	</div>

	<div class="card-image">
		<!-- 이미지 placeholder (실제 이미지는 추후 구현) -->
		<div class="image-placeholder"></div>
	</div>

	<div class="card-content">
		<div class="days-stats">
			<span class="days-ago">{formatDaysAgo(daysAgo)}</span>
			<span class="stats-divider">|</span>
			<span class="views">신청 {views}</span>
			{#if likes > 0}
				<span class="stats-divider">|</span>
				<span class="likes">{likes}</span>
			{/if}
		</div>

		<h3 class="card-title">{title}</h3>

		<p class="card-description">{contentSummary}</p>

		<div class="card-additional">
			<div class="additional-content">
				<span class="additional-item">자유식사권 5만원</span>
				<span class="additional-item">블로그</span>
				<span class="additional-item">방문형</span>
			</div>
		</div>

		<div class="card-footer">
			<div class="price-info">
				{#if isPromoted}
					<del class="original-price">500,000 P</del>
					<span class="discounted-price">120,000 P</span>
				{:else}
					<span class="price">0 P</span>
				{/if}
			</div>

			<div class="card-tags">
				{#each tags.slice(0, 2) as tag}
					<span class="tag">{tag}</span>
				{/each}
			</div>
		</div>
	</div>
</a>

<style>
    .review-card {
        position: relative;
        width: 100%;
        background-color: white;
        border-radius: 0.5rem;
        overflow: hidden;
        transition: transform 0.2s, box-shadow 0.2s;
        display: block;
        text-decoration: none;
        color: inherit;
    }

    .review-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .card-badge {
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 10;
    }

    .normal-badge {
        background-color: #5ce0c6; /* 민트색 */
        color: white;
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
    }

    .premium-badge {
        background-color: #ff7eb6; /* 핑크색 */
        color: white;
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
    }

    .card-image {
        width: 100%;
        aspect-ratio: 4 / 3;
        overflow: hidden;
    }

    .image-placeholder {
        width: 100%;
        height: 100%;
        background-color: #f3f4f6;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .image-placeholder::before {
        content: "이미지 준비 중";
        font-size: 0.75rem;
        color: #9ca3af;
    }

    .image-placeholder::after {
        content: "📸";
        font-size: 1.5rem;
        position: absolute;
        opacity: 0.2;
    }

    .card-content {
        padding: 1rem;
    }

    .days-stats {
        font-size: 0.75rem;
        color: #6b7280;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
    }

    .days-ago {
        color: #6bb546;
        font-weight: 500;
    }

    .stats-divider {
        margin: 0 0.25rem;
        color: #d1d5db;
    }

    .views, .likes {
        color: #6b7280;
    }

    .card-title {
        font-size: 1rem;
        font-weight: 600;
        color: #1f2937;
        margin: 0 0 0.5rem 0;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        min-height: 2.5rem;
    }

    .card-description {
        font-size: 0.75rem;
        color: #6b7280;
        margin-bottom: 0.75rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .card-additional {
        margin-bottom: 0.75rem;
    }

    .additional-content {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        font-size: 0.75rem;
        color: #6b7280;
    }

    .additional-item {
        position: relative;
        padding-right: 0.5rem;
    }

    .additional-item:not(:last-child)::after {
        content: '•';
        position: absolute;
        right: 0;
        color: #d1d5db;
    }

    .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .price-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .price {
        font-weight: 600;
        color: #5ce0c6; /* 민트색 */
        font-size: 0.875rem;
    }

    .original-price {
        font-size: 0.75rem;
        color: #9ca3af;
        text-decoration: line-through;
    }

    .discounted-price {
        font-weight: 600;
        color: #ff7eb6; /* 핑크색 */
        font-size: 0.875rem;
    }

    .card-tags {
        display: flex;
        gap: 0.25rem;
    }

    .tag {
        font-size: 0.75rem;
        color: #6b7280;
        background-color: #f3f4f6;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
    }
</style>