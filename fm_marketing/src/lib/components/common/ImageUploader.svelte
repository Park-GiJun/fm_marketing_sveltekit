<!-- src/lib/components/common/ImageUploader.svelte -->
<script>
	import { createEventDispatcher } from 'svelte';
	
	const dispatch = createEventDispatcher();
	
	export let maxFiles = 5;
	export let maxSize = 5 * 1024 * 1024; // 5MB
	export let allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
	export let disabled = false;
	export let previewMode = true;
	
	let files = [];
	let dragOver = false;
	let fileInput;
	
	// 파일 선택 핸들러
	function handleFileSelect(event) {
		const selectedFiles = Array.from(event.target.files);
		processFiles(selectedFiles);
	}
	
	// 드래그 앤 드롭 핸들러
	function handleDragOver(event) {
		event.preventDefault();
		if (!disabled) {
			dragOver = true;
		}
	}
	
	function handleDragLeave(event) {
		event.preventDefault();
		dragOver = false;
	}
	
	function handleDrop(event) {
		event.preventDefault();
		dragOver = false;
		
		if (disabled) return;
		
		const droppedFiles = Array.from(event.dataTransfer.files);
		processFiles(droppedFiles);
	}
	
	// 파일 처리
	function processFiles(newFiles) {
		const validFiles = [];
		
		for (const file of newFiles) {
			// 파일 개수 체크
			if (files.length + validFiles.length >= maxFiles) {
				alert(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`);
				break;
			}
			
			// 파일 타입 체크
			if (!allowedTypes.includes(file.type)) {
				alert(`${file.name}: 지원하지 않는 파일 형식입니다.`);
				continue;
			}
			
			// 파일 크기 체크
			if (file.size > maxSize) {
				alert(`${file.name}: 파일 크기가 너무 큽니다. (최대 ${formatFileSize(maxSize)})`);
				continue;
			}
			
			validFiles.push({
				file,
				id: Date.now() + Math.random(),
				preview: URL.createObjectURL(file),
				name: file.name,
				size: file.size
			});
		}
		
		files = [...files, ...validFiles];
		dispatch('change', files);
	}
	
	// 파일 삭제
	function removeFile(fileId) {
		const fileToRemove = files.find(f => f.id === fileId);
		if (fileToRemove) {
			URL.revokeObjectURL(fileToRemove.preview);
		}
		
		files = files.filter(f => f.id !== fileId);
		dispatch('change', files);
	}
	
	// 파일 크기 포맷팅
	function formatFileSize(bytes) {
		if (bytes === 0) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}
	
	// 컴포넌트 정리
	import { onDestroy } from 'svelte';
	onDestroy(() => {
		files.forEach(file => {
			if (file.preview) {
				URL.revokeObjectURL(file.preview);
			}
		});
	});
</script>

<div class="image-uploader">
	<div 
		class="upload-area {dragOver ? 'drag-over' : ''} {disabled ? 'disabled' : ''}"
		on:dragover={handleDragOver}
		on:dragleave={handleDragLeave}
		on:drop={handleDrop}
		on:click={() => !disabled && fileInput.click()}
	>
		<input 
			type="file" 
			bind:this={fileInput}
			on:change={handleFileSelect}
			multiple={maxFiles > 1}
			accept={allowedTypes.join(',')}
			{disabled}
			class="file-input"
		/>
		
		<div class="upload-content">
			<div class="upload-icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
					<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
					<circle cx="8.5" cy="8.5" r="1.5"></circle>
					<polyline points="21 15 16 10 5 21"></polyline>
				</svg>
			</div>
			
			<div class="upload-text">
				<p class="upload-title">
					{dragOver ? '파일을 놓아주세요' : '이미지를 업로드하세요'}
				</p>
				<p class="upload-subtitle">
					클릭하거나 파일을 드래그하여 업로드 (최대 {maxFiles}개, {formatFileSize(maxSize)})
				</p>
			</div>
		</div>
	</div>
	
	{#if files.length > 0}
		<div class="preview-section">
			<h3 class="preview-title">업로드된 이미지 ({files.length}/{maxFiles})</h3>
			
			<div class="preview-grid">
				{#each files as file (file.id)}
					<div class="preview-item">
						{#if previewMode}
							<div class="preview-image">
								<img src={file.preview} alt={file.name} />
								<button 
									class="remove-button"
									on:click={() => removeFile(file.id)}
									type="button"
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<line x1="18" y1="6" x2="6" y2="18"></line>
										<line x1="6" y1="6" x2="18" y2="18"></line>
									</svg>
								</button>
							</div>
						{/if}
						
						<div class="file-info">
							<span class="file-name">{file.name}</span>
							<span class="file-size">{formatFileSize(file.size)}</span>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.image-uploader {
		width: 100%;
	}
	
	.upload-area {
		border: 2px dashed #d1d5db;
		border-radius: 0.5rem;
		padding: 2rem;
		text-align: center;
		cursor: pointer;
		transition: all 0.2s;
		background-color: #fafafa;
	}
	
	.upload-area:hover:not(.disabled) {
		border-color: #5ce0c6;
		background-color: #f0fdf9;
	}
	
	.upload-area.drag-over {
		border-color: #5ce0c6;
		background-color: #ecfdf5;
		transform: scale(1.02);
	}
	
	.upload-area.disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background-color: #f3f4f6;
	}
	
	.file-input {
		display: none;
	}
	
	.upload-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}
	
	.upload-icon {
		color: #9ca3af;
	}
	
	.upload-text {
		text-align: center;
	}
	
	.upload-title {
		font-size: 1.125rem;
		font-weight: 500;
		color: #1f2937;
		margin: 0 0 0.5rem 0;
	}
	
	.upload-subtitle {
		font-size: 0.875rem;
		color: #6b7280;
		margin: 0;
	}
	
	.preview-section {
		margin-top: 1.5rem;
	}
	
	.preview-title {
		font-size: 1rem;
		font-weight: 500;
		color: #1f2937;
		margin: 0 0 1rem 0;
	}
	
	.preview-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 1rem;
	}
	
	.preview-item {
		background-color: white;
		border: 1px solid #e5e7eb;
		border-radius: 0.375rem;
		overflow: hidden;
	}
	
	.preview-image {
		position: relative;
		aspect-ratio: 1;
	}
	
	.preview-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	
	.remove-button {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		width: 2rem;
		height: 2rem;
		background-color: rgba(0, 0, 0, 0.7);
		color: white;
		border: none;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: background-color 0.2s;
	}
	
	.remove-button:hover {
		background-color: rgba(0, 0, 0, 0.9);
	}
	
	.file-info {
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	
	.file-name {
		font-size: 0.875rem;
		color: #1f2937;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.file-size {
		font-size: 0.75rem;
		color: #9ca3af;
	}
	
	@media (max-width: 640px) {
		.preview-grid {
			grid-template-columns: repeat(2, 1fr);
		}
		
		.upload-area {
			padding: 1.5rem;
		}
	}
</style>
