<!-- 이미지 업로드 컴포넌트 -->
<script>
  import { createEventDispatcher } from 'svelte';
  import { apiClient } from '$lib/utils/api.js';
  import { toast } from '$lib/stores/toastStore.js';
  
  export let images = []; // 업로드된 이미지 URL 배열
  export let maxImages = 5; // 최대 이미지 개수
  export let uploadType = 'general'; // 업로드 타입 (experience, community, profile)
  export let disabled = false;
  export let aspectRatio = null; // 'square', '16:9', '4:3' 등
  
  const dispatch = createEventDispatcher();
  
  let dragOver = false;
  let uploading = false;
  let fileInput;
  
  // 드래그 앤 드롭 핸들러
  function handleDragOver(e) {
    e.preventDefault();
    if (!disabled) {
      dragOver = true;
    }
  }
  
  function handleDragLeave(e) {
    e.preventDefault();
    dragOver = false;
  }
  
  function handleDrop(e) {
    e.preventDefault();
    dragOver = false;
    
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }
  
  // 파일 선택 핸들러
  function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    handleFiles(files);
    
    // 파일 입력 초기화
    if (fileInput) {
      fileInput.value = '';
    }
  }
  
  // 파일 처리
  async function handleFiles(files) {
    if (images.length >= maxImages) {
      toast.error(`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`);
      return;
    }
    
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const remainingSlots = maxImages - images.length;
    const filesToUpload = imageFiles.slice(0, remainingSlots);
    
    if (filesToUpload.length === 0) {
      toast.error('이미지 파일만 업로드할 수 있습니다.');
      return;
    }
    
    uploading = true;
    
    try {
      const uploadPromises = filesToUpload.map(file => uploadFile(file));
      const results = await Promise.all(uploadPromises);
      
      const newImages = results
        .filter(result => result.success)
        .map(result => result.url);
      
      images = [...images, ...newImages];
      dispatch('change', images);
      
      if (results.some(r => !r.success)) {
        toast.warning('일부 파일 업로드에 실패했습니다.');
      } else {
        toast.success(`${newImages.length}개의 이미지가 업로드되었습니다.`);
      }
      
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      toast.error('이미지 업로드에 실패했습니다.');
    } finally {
      uploading = false;
    }
  }
  
  // 개별 파일 업로드
  async function uploadFile(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', uploadType);
      
      const response = await apiClient.upload('/files/upload', file, { type: uploadType });
      return response.data;
    } catch (error) {
      console.error('파일 업로드 오류:', error);
      return { success: false, error: error.message };
    }
  }
  
  // 이미지 삭제
  async function removeImage(index, imageUrl) {
    try {
      // 서버에서 파일 삭제 (선택사항)
      await apiClient.delete(`/files/upload?url=${encodeURIComponent(imageUrl)}`);
    } catch (error) {
      console.warn('서버 파일 삭제 실패:', error);
    }
    
    images = images.filter((_, i) => i !== index);
    dispatch('change', images);
    toast.success('이미지가 삭제되었습니다.');
  }
  
  // 이미지 순서 변경
  function moveImage(fromIndex, toIndex) {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    images = newImages;
    dispatch('change', images);
  }
  
  // 파일 입력 트리거
  function triggerFileInput() {
    if (!disabled && fileInput) {
      fileInput.click();
    }
  }
</script>

<div class="image-upload-container">
  <!-- 파일 입력 (숨김) -->
  <input
    bind:this={fileInput}
    type="file"
    multiple
    accept="image/*"
    on:change={handleFileSelect}
    style="display: none;"
  />
  
  <!-- 업로드 영역 -->
  {#if images.length < maxImages}
    <div 
      class="upload-area {dragOver ? 'drag-over' : ''} {disabled ? 'disabled' : ''}"
      on:dragover={handleDragOver}
      on:dragleave={handleDragLeave}
      on:drop={handleDrop}
      on:click={triggerFileInput}
      role="button"
      tabindex="0"
      on:keydown={(e) => e.key === 'Enter' && triggerFileInput()}
    >
      {#if uploading}
        <div class="upload-loading">
          <div class="spinner"></div>
          <p>이미지 업로드 중...</p>
        </div>
      {:else}
        <div class="upload-content">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <h3>이미지 업로드</h3>
          <p>클릭하거나 드래그하여 이미지를 업로드하세요</p>
          <p class="upload-info">
            최대 {maxImages}개 • JPG, PNG, WebP, GIF • 5MB 이하
          </p>
        </div>
      {/if}
    </div>
  {/if}
  
  <!-- 업로드된 이미지 목록 -->
  {#if images.length > 0}
    <div class="image-grid">
      {#each images as imageUrl, index}
        <div class="image-item" class:main={index === 0}>
          <div class="image-wrapper {aspectRatio ? `aspect-${aspectRatio}` : ''}">
            <img src={imageUrl} alt="업로드된 이미지 {index + 1}" />
            
            <div class="image-overlay">
              <div class="image-actions">
                {#if index > 0}
                  <button 
                    class="action-btn move-left"
                    on:click={() => moveImage(index, index - 1)}
                    title="왼쪽으로 이동"
                    type="button"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                {/if}
                
                {#if index < images.length - 1}
                  <button 
                    class="action-btn move-right"
                    on:click={() => moveImage(index, index + 1)}
                    title="오른쪽으로 이동"
                    type="button"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                {/if}
                
                <button 
                  class="action-btn delete"
                  on:click={() => removeImage(index, imageUrl)}
                  title="이미지 삭제"
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
            
            {#if index === 0}
              <div class="main-badge">대표</div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
    
    <p class="image-count">
      {images.length} / {maxImages} 이미지
      {#if images.length > 0}
        • 첫 번째 이미지가 대표 이미지로 사용됩니다
      {/if}
    </p>
  {/if}
</div>

<style>
  .image-upload-container {
    width: 100%;
  }
  
  .upload-area {
    border: 2px dashed #d1d5db;
    border-radius: 0.75rem;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    background-color: #fafafa;
    margin-bottom: 1rem;
  }
  
  .upload-area:hover:not(.disabled) {
    border-color: #5ce0c6;
    background-color: #f0fdf4;
  }
  
  .upload-area.drag-over {
    border-color: #5ce0c6;
    background-color: #f0fdf4;
    transform: scale(1.02);
  }
  
  .upload-area.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .upload-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }
  
  .upload-content svg {
    color: #9ca3af;
  }
  
  .upload-content h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }
  
  .upload-content p {
    color: #6b7280;
    margin: 0;
  }
  
  .upload-info {
    font-size: 0.875rem !important;
    color: #9ca3af !important;
  }
  
  .upload-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .spinner {
    width: 2rem;
    height: 2rem;
    border: 2px solid #e5e7eb;
    border-top: 2px solid #5ce0c6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .image-item {
    position: relative;
  }
  
  .image-item.main {
    grid-column: span 2;
  }
  
  .image-wrapper {
    position: relative;
    border-radius: 0.5rem;
    overflow: hidden;
    background-color: #f3f4f6;
    aspect-ratio: 1;
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
    opacity: 0;
    transition: opacity 0.2s;
  }
  
  .image-item:hover .image-overlay {
    opacity: 1;
  }
  
  .image-actions {
    display: flex;
    gap: 0.5rem;
  }
  
  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background-color: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 0.25rem;
    color: #4b5563;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .action-btn:hover {
    background-color: white;
    transform: scale(1.1);
  }
  
  .action-btn.delete {
    background-color: rgba(239, 68, 68, 0.9);
    color: white;
  }
  
  .action-btn.delete:hover {
    background-color: #dc2626;
  }
  
  .main-badge {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    background-color: #5ce0c6;
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
  }
  
  .image-count {
    font-size: 0.875rem;
    color: #6b7280;
    text-align: center;
    margin: 0;
  }
  
  @media (max-width: 768px) {
    .image-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .image-item.main {
      grid-column: span 2;
    }
  }
</style>
