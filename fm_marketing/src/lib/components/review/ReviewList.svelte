<div class="review-list-container">
	{#if loading}
		<div class="loading-indicator">로딩 중...</div>
	{:else if reviews.length === 0}
		<div class="empty-state">
			<p>표시할 리뷰가 없습니다.</p>
		</div>
	{:else}
		<div class="review-grid" style="--columns: {columns}">
			{#each reviews as review (review.id)}
				<div class="review-grid-item">
					<ReviewCard
						id={review.id}
						title={review.title}
						content={review.content}
						images={review.images}
						daysAgo={review.daysAgo}
						views={review.views}
						likes={review.likes}
						tags={review.tags}
						isPromoted={review.isPromoted}
						type={review.type}
					/>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
    .review-list-container {
        width: 100%;
    }

    .review-grid {
        display: grid;
        grid-template-columns: repeat(var(--columns), 1fr);
        gap: 1.5rem;
        width: 100%;
    }

    .review-grid-item {
        width: 100%;
    }

    .loading-indicator {
        text-align: center;
        padding: 2rem;
        color: #6b7280;
    }

    .empty-state {
        text-align: center;
        padding: 3rem 1rem;
        background-color: #f9fafb;
        border-radius: 0.5rem;
        color: #6b7280;
    }

    @media (max-width: 1280px) {
        .review-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media (max-width: 1024px) {
        .review-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 640px) {
        .review-grid {
            grid-template-columns: 1fr;
        }
    }
</style>