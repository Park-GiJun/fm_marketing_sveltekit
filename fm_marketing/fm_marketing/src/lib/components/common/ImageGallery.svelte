<!-- 이미지 갤러리 컴포넌트 -->
<script>
  import { createEventDispatcher } from 'svelte';
  
  export let images = []; // 이미지 URL 배열
  export let aspectRatio = null; // 'square', '16:9', '4:3' 등
  export let columns = 3; // 그리드 컬럼 수
  export let showLightbox = true; // 라이트박스 표시 여부
  
  const dispatch = createEventDispatcher();
  
  let selectedImageIndex = -1;
  let showModal = false;
  
  // 이미지 클릭 핸들러
  function handleImageClick(index) {
    if (showLightbox) {
      selectedImageIndex = index;
      showModal = true;
    }
    dispatch('imageClick', { index, url: images[index] });
  }
  
  // 라이트박스 닫기
  function closeLightbox() {
    showModal = false;
    selectedImageIndex = -1;
  }
  
  // 이전/다음 이미지
  function navigateImage(direction) {
    if (direction === 'prev') {
      selectedImageIndex = selectedImageIndex > 0 ? selectedImageIndex - 1 : images.length - 1;
    } else {
      selectedImageIndex = selectedImageIndex < images.length - 1 ? selectedImageIndex + 1 : 0;
    }
  }
  
  // 키보드 이벤트 핸들러
  function handleKeydown(event) {
    if (!showModal) return;
    
    switch (event.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        navigateImage('prev');
        break;
      case 'ArrowRight':
        navigateImage('next');
        break;
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if images && images.length > 0}
  <div class="image-gallery">
    <div class="gallery-grid" style="--columns: {columns}">
      {#each images as imageUrl, index}
        <div 
          class="gallery-item" 
          class:main={index === 0}
          on:click={() => handleImageClick(index)}
          role="button"
          tabindex="0"
          on:keydown={(e) => e.key === 'Enter' && handleImageClick(index)}
        >
          <div class="image-wrapper {aspectRatio ? `aspect-${aspectRatio}` : ''}">
            <img 
              src={imageUrl} 
              alt="갤러리 이미지 {index + 1}" 
              loading={index < 2 ? 'eager' : 'lazy'}
            />
            
            {#if showLightbox}
              <div class="image-overlay">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path>
                </svg>
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
    
    {#if images.length > 1}
      <div class="gallery-info">
        {images.length}개의 이미지
      </div>
    {/if}
  </div>
{/if}

<!-- 라이트박스 모달 -->
{#if showModal && selectedImageIndex >= 0}
  <div class="lightbox-overlay" on:click={closeLightbox}>
    <div class="lightbox-container" on:click|stopPropagation>
      <button class="lightbox-close" on:click={closeLightbox}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <div class="lightbox-image-container">
        <img 
          src={images[selectedImageIndex]} 
          alt="확대된 이미지 {selectedImageIndex + 1}"
          class="lightbox-image"
        />
      </div>
      
      {#if images.length > 1}
        <button 
          class="lightbox-nav prev" 
          on:click={() => navigateImage('prev')}
          aria-label="이전 이미지"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        
        <button 
          class="lightbox-nav next" 
          on:click={() => navigateImage('next')}
          aria-label="다음 이미지"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
        
        <div class="lightbox-counter">
          {selectedImageIndex + 1} / {images.length}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .image-gallery {
    width: 100%;
  }
  
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(var(--columns), 1fr);
    gap: 0.5rem;
  }
  
  .gallery-item {
    cursor: pointer;
    border-radius: 0.5rem;
    overflow: hidden;
    transition: transform 0.2s;
  }
  
  .gallery-item:hover {
    transform: scale(1.02);
  }
  
  .gallery-item.main {
    grid-column: span 2;
    grid-row: span 2;
  }
  
  .image-wrapper {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    background-color: #f3f4f6;
  }
  
  .image-wrapper.aspect-square {
    aspect-ratio: 1;
  }
  
  .image-wrapper.aspect-16-9 {
    aspect-ratio: 16/9;
  }
  
  .image-wrapper.aspect-4-3 {
    aspect-ratio: 4/3;
  }
  
  .image-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    opacity: 0;
    transition: opacity 0.2s;
  }
  
  .gallery-item:hover .image-overlay {
    opacity: 1;
  }
  
  .gallery-info {
    text-align: center;
    margin-top: 0.75rem;
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  /* 라이트박스 스타일 */
  .lightbox-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 2rem;
  }
  
  .lightbox-container {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .lightbox-close {
    position: absolute;
    top: -3rem;
    right: 0;
    background-color: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.375rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .lightbox-close:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  .lightbox-image-container {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 100%;
    max-height: 100%;
  }
  
  .lightbox-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 0.5rem;
  }
  
  .lightbox-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    width: 3rem;
    height: 3rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .lightbox-nav:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  .lightbox-nav.prev {
    left: -4rem;
  }
  
  .lightbox-nav.next {
    right: -4rem;
  }
  
  .lightbox-counter {
    position: absolute;
    bottom: -3rem;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
  }
  
  @media (max-width: 768px) {
    .gallery-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .gallery-item.main {
      grid-column: span 2;
      grid-row: span 1;
    }
    
    .lightbox-overlay {
      padding: 1rem;
    }
    
    .lightbox-nav.prev {
      left: -2rem;
    }
    
    .lightbox-nav.next {
      right: -2rem;
    }
  }
  
  @media (max-width: 480px) {
    .lightbox-nav {
      width: 2.5rem;
      height: 2.5rem;
    }
    
    .lightbox-nav.prev {
      left: 1rem;
    }
    
    .lightbox-nav.next {
      right: 1rem;
    }
  }
</style>
