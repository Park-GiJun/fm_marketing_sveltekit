<!-- src/lib/components/common/ImageGallery.svelte -->
<script>
	import { createEventDispatcher } from 'svelte';
	import Modal from './Modal.svelte';

	const dispatch = createEventDispatcher();

	export let images = [];
	export let columns = 4;
	export let aspectRatio = '1'; // '1', '4/3', '16/9', 'auto'
	export let gap = '0.5rem';
	export let showOverlay = true;
	export let lightbox = true;

	let selectedIndex = 0;
	let showLightbox = false;

	// 이미지 클릭 핸들러
	function handleImageClick(index, image) {
		selectedIndex = index;

		if (lightbox) {
			showLightbox = true;
		}

		dispatch('imageClick', { index, image });
	}

	// 라이트박스 네비게이션
	function goToPrevious() {
		selectedIndex = selectedIndex > 0 ? selectedIndex - 1 : images.length - 1;
	}

	function goToNext() {
		selectedIndex = selectedIndex < images.length - 1 ? selectedIndex + 1 : 0;
	}

	// 키보드 이벤트
	function handleLightboxKeydown(event) {
		if (!showLightbox) return;

		switch (event.key) {
			case 'ArrowLeft':
				event.preventDefault();
				goToPrevious();
				break;
			case 'ArrowRight':
				event.preventDefault();
				goToNext();
				break;
		}
	}
</script>

<svelte:window on:keydown={handleLightboxKeydown} />

<div
	class="image-gallery"
	style="--columns: {columns}; --gap: {gap}; --aspect-ratio: {aspectRatio};"
>
	{#each images as image, index}
		<div class="gallery-item">
			<button
				class="image-button"
				on:click={() => handleImageClick(index, image)}
				aria-label="이미지 {index + 1} 보기"
			>
				<img
					src={image.thumbnail || image.src || image}
					alt={image.alt || `이미지 ${index + 1}`}
					class="gallery-image"
					loading="lazy"
				/>

				{#if showOverlay}
					<div class="image-overlay">
						<div class="overlay-icon">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
								<circle cx="12" cy="12" r="3"></circle>
							</svg>
						</div>
					</div>
				{/if}
			</button>
		</div>
	{/each}
</div>

<!-- 라이트박스 모달 -->
{#if lightbox}
	<Modal bind:open={showLightbox} size="full" showFooter={false}>
		<div class="lightbox-content">
			<div class="lightbox-header">
				<div class="image-counter">
					{selectedIndex + 1} / {images.length}
				</div>

				<button
					class="lightbox-close"
					on:click={() => showLightbox = false}
					aria-label="닫기"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			</div>

			<div class="lightbox-main">
				<button
					class="lightbox-nav prev"
					on:click={goToPrevious}
					disabled={images.length <= 1}
					aria-label="이전 이미지"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<polyline points="15 18 9 12 15 6"></polyline>
					</svg>
				</button>

				<div class="lightbox-image-container">
					<img
						src={images[selectedIndex]?.src || images[selectedIndex]}
						alt={images[selectedIndex]?.alt || `이미지 ${selectedIndex + 1}`}
						class="lightbox-image"
					/>
				</div>

				<button
					class="lightbox-nav next"
					on:click={goToNext}
					disabled={images.length <= 1}
					aria-label="다음 이미지"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<polyline points="9 18 15 12 9 6"></polyline>
					</svg>
				</button>
			</div>

			{#if images[selectedIndex]?.caption}
				<div class="lightbox-caption">
					{images[selectedIndex].caption}
				</div>
			{/if}

			<!-- 썸네일 네비게이션 -->
			{#if images.length > 1}
				<div class="thumbnail-nav">
					{#each images as image, index}
						<button
							class="thumbnail-button {selectedIndex === index ? 'active' : ''}"
							on:click={() => selectedIndex = index}
							aria-label="이미지 {index + 1}로 이동"
						>
							<img
								src={image.thumbnail || image.src || image}
								alt={image.alt || `썸네일 ${index + 1}`}
								class="thumbnail-image"
							/>
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</Modal>
{/if}

<style>
    .image-gallery {
        display: grid;
        grid-template-columns: repeat(var(--columns), 1fr);
        gap: var(--gap);
        width: 100%;
    }

    .gallery-item {
        position: relative;
        aspect-ratio: var(--aspect-ratio);
        overflow: hidden;
        border-radius: 0.375rem;
    }

    .image-button {
        width: 100%;
        height: 100%;
        border: none;
        padding: 0;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        border-radius: inherit;
        transition: transform 0.2s;
    }

    .image-button:hover {
        transform: scale(1.02);
    }

    .gallery-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s;
    }

    .image-button:hover .gallery-image {
        transform: scale(1.1);
    }

    .image-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.2s;
    }

    .image-button:hover .image-overlay {
        opacity: 1;
    }

    .overlay-icon {
        color: white;
        background-color: rgba(0, 0, 0, 0.6);
        border-radius: 50%;
        padding: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* 라이트박스 스타일 */
    .lightbox-content {
        display: flex;
        flex-direction: column;
        height: 100%;
        background-color: #000;
        color: white;
    }

    .lightbox-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background-color: rgba(0, 0, 0, 0.8);
    }

    .image-counter {
        font-size: 1rem;
        color: #e5e7eb;
    }

    .lightbox-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 0.25rem;
        transition: background-color 0.2s;
    }

    .lightbox-close:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    .lightbox-main {
        flex: 1;
        display: flex;
        align-items: center;
        position: relative;
        min-height: 0;
    }

    .lightbox-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 10;
        background-color: rgba(0, 0, 0, 0.6);
        border: none;
        color: white;
        cursor: pointer;
        padding: 1rem;
        border-radius: 50%;
        transition: all 0.2s;
    }

    .lightbox-nav:hover:not(:disabled) {
        background-color: rgba(0, 0, 0, 0.8);
        transform: translateY(-50%) scale(1.1);
    }

    .lightbox-nav:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }

    .lightbox-nav.prev {
        left: 2rem;
    }

    .lightbox-nav.next {
        right: 2rem;
    }

    .lightbox-image-container {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 6rem;
    }

    .lightbox-image {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }

    .lightbox-caption {
        padding: 1rem;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.8);
        color: #e5e7eb;
    }

    .thumbnail-nav {
        display: flex;
        gap: 0.5rem;
        padding: 1rem;
        background-color: rgba(0, 0, 0, 0.8);
        overflow-x: auto;
        justify-content: center;
    }

    .thumbnail-button {
        flex-shrink: 0;
        width: 4rem;
        height: 3rem;
        border: 2px solid transparent;
        border-radius: 0.25rem;
        overflow: hidden;
        cursor: pointer;
        transition: border-color 0.2s;
    }

    .thumbnail-button.active {
        border-color: #5ce0c6;
    }

    .thumbnail-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    @media (max-width: 768px) {
        .image-gallery {
            grid-template-columns: repeat(2, 1fr);
        }

        .lightbox-nav.prev {
            left: 1rem;
        }

        .lightbox-nav.next {
            right: 1rem;
        }

        .lightbox-image-container {
            padding: 0 4rem;
        }

        .thumbnail-nav {
            display: none;
        }
    }

    @media (max-width: 480px) {
        .image-gallery {
            grid-template-columns: 1fr;
        }

        .lightbox-image-container {
            padding: 0 3rem;
        }
    }
</style>