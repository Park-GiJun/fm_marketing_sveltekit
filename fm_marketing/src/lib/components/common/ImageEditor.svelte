<!-- src/lib/components/common/ImageEditor.svelte -->
<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { imageProcessor } from '$lib/utils/imageProcessor.js';
	import Button from './Button.svelte';
	import Modal from './Modal.svelte';
	import LoadingSpinner from './LoadingSpinner.svelte';
	import { toast } from '$lib/stores/toastStore.js';

	const dispatch = createEventDispatcher();

	export let file = null;
	export let open = false;
	export let maxWidth = 1200;
	export let maxHeight = 800;

	let currentImage = null;
	let originalImage = null;
	let previewUrl = '';
	let loading = false;
	let processingStep = '';
	
	// 편집 상태
	let editState = {
		brightness: 0,
		contrast: 0,
		saturation: 0,
		hue: 0,
		blur: 0,
		rotation: 0,
		flipHorizontal: false,
		flipVertical: false,
		grayscale: false,
		sepia: false
	};
	
	// 크롭 관련 상태
	let cropMode = false;
	let cropArea = { x: 0, y: 0, width: 100, height: 100 };
	
	// 리사이징 상태
	let resizeOptions = {
		width: 0,
		height: 0,
		maintainAspectRatio: true
	};

	// 파일이 변경될 때 이미지 로드
	$: if (file && open) {
		loadImage();
	}

	async function loadImage() {
		if (!file) return;

		loading = true;
		processingStep = '이미지 로딩 중...';

		try {
			originalImage = await imageProcessor.loadFromFile(file);
			currentImage = originalImage.clone();
			
			const imageInfo = imageProcessor.getImageInfo(currentImage);
			resizeOptions.width = imageInfo.width;
			resizeOptions.height = imageInfo.height;
			
			await updatePreview();
			
			resetEditState();
		} catch (error) {
			console.error('이미지 로드 실패:', error);
			toast.error('이미지 로드에 실패했습니다.');
		} finally {
			loading = false;
			processingStep = '';
		}
	}

	async function updatePreview() {
		if (!currentImage) return;

		try {
			const base64 = await imageProcessor.toBase64(currentImage);
			previewUrl = base64;
		} catch (error) {
			console.error('미리보기 업데이트 실패:', error);
		}
	}

	function resetEditState() {
		editState = {
			brightness: 0,
			contrast: 0,
			saturation: 0,
			hue: 0,
			blur: 0,
			rotation: 0,
			flipHorizontal: false,
			flipVertical: false,
			grayscale: false,
			sepia: false
		};
		cropMode = false;
	}

	async function applyEdit(editType, value) {
		if (!currentImage || loading) return;

		loading = true;
		processingStep = `${editType} 적용 중...`;

		try {
			let newImage = currentImage.clone();

			switch (editType) {
				case 'brightness':
					newImage = await imageProcessor.adjustBrightness(newImage, value / 100);
					break;
				case 'contrast':
					newImage = await imageProcessor.adjustContrast(newImage, value / 100);
					break;
				case 'saturation':
					newImage = await imageProcessor.adjustSaturation(newImage, value);
					break;
				case 'hue':
					newImage = await imageProcessor.adjustHue(newImage, value);
					break;
				case 'blur':
					if (value > 0) {
						newImage = await imageProcessor.blurImage(newImage, value);
					}
					break;
				case 'rotation':
					newImage = await imageProcessor.rotateImage(newImage, value);
					break;
				case 'flipHorizontal':
					if (value) {
						newImage = await imageProcessor.flipImage(newImage, true, false);
					}
					break;
				case 'flipVertical':
					if (value) {
						newImage = await imageProcessor.flipImage(newImage, false, true);
					}
					break;
				case 'grayscale':
					if (value) {
						newImage = await imageProcessor.grayscaleImage(newImage);
					}
					break;
				case 'sepia':
					if (value) {
						newImage = await imageProcessor.sepiaImage(newImage);
					}
					break;
			}

			currentImage = newImage;
			await updatePreview();

		} catch (error) {
			console.error('편집 적용 실패:', error);
			toast.error(`${editType} 적용에 실패했습니다.`);
		} finally {
			loading = false;
			processingStep = '';
		}
	}

	async function applyCrop() {
		if (!currentImage || !cropMode) return;

		loading = true;
		processingStep = '자르기 적용 중...';

		try {
			const newImage = await imageProcessor.cropImage(
				currentImage,
				cropArea.x,
				cropArea.y,
				cropArea.width,
				cropArea.height
			);

			currentImage = newImage;
			await updatePreview();

			cropMode = false;
			toast.success('이미지가 잘렸습니다.');

		} catch (error) {
			console.error('자르기 실패:', error);
			toast.error('이미지 자르기에 실패했습니다.');
		} finally {
			loading = false;
			processingStep = '';
		}
	}

	async function applyResize() {
		if (!currentImage) return;

		loading = true;
		processingStep = '크기 조정 중...';

		try {
			const newImage = await imageProcessor.resizeImage(currentImage, {
				width: resizeOptions.width,
				height: resizeOptions.height,
				maintainAspectRatio: resizeOptions.maintainAspectRatio
			});

			currentImage = newImage;
			await updatePreview();

			toast.success('이미지 크기가 조정되었습니다.');

		} catch (error) {
			console.error('크기 조정 실패:', error);
			toast.error('이미지 크기 조정에 실패했습니다.');
		} finally {
			loading = false;
			processingStep = '';
		}
	}

	async function resetImage() {
		if (!originalImage) return;

		currentImage = originalImage.clone();
		await updatePreview();
		resetEditState();
		
		const imageInfo = imageProcessor.getImageInfo(currentImage);
		resizeOptions.width = imageInfo.width;
		resizeOptions.height = imageInfo.height;

		toast.success('원본 이미지로 복원되었습니다.');
	}

	async function optimizeImage() {
		if (!currentImage) return;

		loading = true;
		processingStep = '이미지 최적화 중...';

		try {
			const optimizedImage = await imageProcessor.optimizeImage(currentImage, {
				quality: 90,
				maxWidth: 1920,
				maxHeight: 1920
			});

			currentImage = optimizedImage;
			await updatePreview();

			toast.success('이미지가 최적화되었습니다.');

		} catch (error) {
			console.error('최적화 실패:', error);
			toast.error('이미지 최적화에 실패했습니다.');
		} finally {
			loading = false;
			processingStep = '';
		}
	}

	async function saveImage() {
		if (!currentImage) return;

		loading = true;
		processingStep = '이미지 저장 중...';

		try {
			const blob = await imageProcessor.toBlob(currentImage);
			const editedFile = new File([blob], file.name, { type: blob.type });

			dispatch('save', {
				originalFile: file,
				editedFile: editedFile,
				editedImage: currentImage
			});

			open = false;
			toast.success('이미지가 저장되었습니다.');

		} catch (error) {
			console.error('저장 실패:', error);
			toast.error('이미지 저장에 실패했습니다.');
		} finally {
			loading = false;
			processingStep = '';
		}
	}

	function closeEditor() {
		open = false;
		resetEditState();
		dispatch('close');
	}

	// 비율 유지 계산
	function updateAspectRatio(dimension) {
		if (!resizeOptions.maintainAspectRatio || !originalImage) return;

		const imageInfo = imageProcessor.getImageInfo(originalImage);
		const aspectRatio = imageInfo.width / imageInfo.height;

		if (dimension === 'width') {
			resizeOptions.height = Math.round(resizeOptions.width / aspectRatio);
		} else {
			resizeOptions.width = Math.round(resizeOptions.height * aspectRatio);
		}
	}
</script>

<Modal bind:open size="xl" title="이미지 편집기" on:close={closeEditor} showFooter={false}>
	<div class="image-editor">
		{#if loading}
			<div class="loading-overlay">
				<LoadingSpinner size="lg" text={processingStep} />
			</div>
		{/if}

		<div class="editor-layout">
			<!-- 이미지 미리보기 -->
			<div class="preview-section">
				{#if previewUrl}
					<div class="image-container">
						<img src={previewUrl} alt="편집 중인 이미지" class="preview-image" />
						
						{#if cropMode}
							<div class="crop-overlay">
								<!-- 크롭 영역 UI는 여기에 구현 -->
								<div class="crop-info">
									크롭 모드 활성화됨
								</div>
							</div>
						{/if}
					</div>

					<!-- 이미지 정보 -->
					{#if currentImage}
						{@const info = imageProcessor.getImageInfo(currentImage)}
						<div class="image-info">
							<span>크기: {info.width} × {info.height}</span>
							<span>포맷: {info.format}</span>
						</div>
					{/if}
				{:else}
					<div class="no-image">
						<p>이미지를 불러오는 중...</p>
					</div>
				{/if}
			</div>

			<!-- 편집 도구 -->
			<div class="tools-section">
				<!-- 기본 조정 -->
				<div class="tool-group">
					<h3 class="tool-title">기본 조정</h3>
					
					<div class="tool-item">
						<label>밝기</label>
						<input 
							type="range" 
							min="-100" 
							max="100" 
							bind:value={editState.brightness}
							on:input={() => applyEdit('brightness', editState.brightness)}
						/>
						<span>{editState.brightness}</span>
					</div>
					
					<div class="tool-item">
						<label>대비</label>
						<input 
							type="range" 
							min="-100" 
							max="100" 
							bind:value={editState.contrast}
							on:input={() => applyEdit('contrast', editState.contrast)}
						/>
						<span>{editState.contrast}</span>
					</div>
					
					<div class="tool-item">
						<label>채도</label>
						<input 
							type="range" 
							min="-100" 
							max="100" 
							bind:value={editState.saturation}
							on:input={() => applyEdit('saturation', editState.saturation)}
						/>
						<span>{editState.saturation}</span>
					</div>
					
					<div class="tool-item">
						<label>색조</label>
						<input 
							type="range" 
							min="-180" 
							max="180" 
							bind:value={editState.hue}
							on:input={() => applyEdit('hue', editState.hue)}
						/>
						<span>{editState.hue}°</span>
					</div>
				</div>

				<!-- 효과 -->
				<div class="tool-group">
					<h3 class="tool-title">효과</h3>
					
					<div class="tool-item">
						<label>블러</label>
						<input 
							type="range" 
							min="0" 
							max="10" 
							bind:value={editState.blur}
							on:input={() => applyEdit('blur', editState.blur)}
						/>
						<span>{editState.blur}</span>
					</div>
					
					<div class="tool-item checkbox">
						<label>
							<input 
								type="checkbox" 
								bind:checked={editState.grayscale}
								on:change={() => applyEdit('grayscale', editState.grayscale)}
							/>
							그레이스케일
						</label>
					</div>
					
					<div class="tool-item checkbox">
						<label>
							<input 
								type="checkbox" 
								bind:checked={editState.sepia}
								on:change={() => applyEdit('sepia', editState.sepia)}
							/>
							세피아
						</label>
					</div>
				</div>

				<!-- 변형 -->
				<div class="tool-group">
					<h3 class="tool-title">변형</h3>
					
					<div class="tool-item">
						<label>회전</label>
						<input 
							type="range" 
							min="-180" 
							max="180" 
							bind:value={editState.rotation}
							on:input={() => applyEdit('rotation', editState.rotation)}
						/>
						<span>{editState.rotation}°</span>
					</div>
					
					<div class="tool-buttons">
						<Button 
							size="sm" 
							variant="outline"
							on:click={() => {
								editState.flipHorizontal = !editState.flipHorizontal;
								applyEdit('flipHorizontal', editState.flipHorizontal);
							}}
						>
							수평 뒤집기
						</Button>
						
						<Button 
							size="sm" 
							variant="outline"
							on:click={() => {
								editState.flipVertical = !editState.flipVertical;
								applyEdit('flipVertical', editState.flipVertical);
							}}
						>
							수직 뒤집기
						</Button>
					</div>
				</div>

				<!-- 크기 조정 -->
				<div class="tool-group">
					<h3 class="tool-title">크기 조정</h3>
					
					<div class="resize-inputs">
						<div class="input-group">
							<label>너비</label>
							<input 
								type="number" 
								bind:value={resizeOptions.width}
								on:input={() => updateAspectRatio('width')}
								min="1"
							/>
						</div>
						
						<div class="input-group">
							<label>높이</label>
							<input 
								type="number" 
								bind:value={resizeOptions.height}
								on:input={() => updateAspectRatio('height')}
								min="1"
							/>
						</div>
					</div>
					
					<div class="tool-item checkbox">
						<label>
							<input 
								type="checkbox" 
								bind:checked={resizeOptions.maintainAspectRatio}
							/>
							비율 유지
						</label>
					</div>
					
					<Button size="sm" variant="primary" on:click={applyResize}>
						크기 적용
					</Button>
				</div>
			</div>
		</div>

		<!-- 하단 액션 버튼 -->
		<div class="editor-actions">
			<div class="action-group">
				<Button variant="outline" on:click={resetImage}>
					원본으로 복원
				</Button>
				
				<Button variant="outline" on:click={optimizeImage}>
					이미지 최적화
				</Button>
			</div>
			
			<div class="action-group">
				<Button variant="outline" on:click={closeEditor}>
					취소
				</Button>
				
				<Button variant="primary" on:click={saveImage}>
					저장
				</Button>
			</div>
		</div>
	</div>
</Modal>

<style>
	.image-editor {
		position: relative;
		width: 100%;
		height: 80vh;
		display: flex;
		flex-direction: column;
	}

	.loading-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(255, 255, 255, 0.9);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
	}

	.editor-layout {
		display: grid;
		grid-template-columns: 1fr 300px;
		gap: 1rem;
		flex: 1;
		overflow: hidden;
	}

	.preview-section {
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.image-container {
		position: relative;
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #f3f4f6;
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.preview-image {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}

	.crop-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.crop-info {
		background-color: white;
		padding: 0.5rem 1rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
	}

	.image-info {
		display: flex;
		justify-content: space-between;
		padding: 0.5rem 0;
		font-size: 0.875rem;
		color: #6b7280;
	}

	.no-image {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: #9ca3af;
	}

	.tools-section {
		background-color: #f9fafb;
		border-radius: 0.5rem;
		padding: 1rem;
		overflow-y: auto;
	}

	.tool-group {
		margin-bottom: 1.5rem;
	}

	.tool-title {
		font-size: 0.875rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 0.75rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.tool-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.75rem;
	}

	.tool-item label {
		font-size: 0.875rem;
		color: #4b5563;
		margin-right: 0.5rem;
	}

	.tool-item input[type="range"] {
		flex: 1;
		margin: 0 0.5rem;
	}

	.tool-item span {
		min-width: 3rem;
		text-align: right;
		font-size: 0.875rem;
		color: #6b7280;
	}

	.tool-item.checkbox {
		justify-content: flex-start;
	}

	.tool-item.checkbox label {
		display: flex;
		align-items: center;
		cursor: pointer;
	}

	.tool-item.checkbox input {
		margin-right: 0.5rem;
	}

	.tool-buttons {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.resize-inputs {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.input-group {
		display: flex;
		flex-direction: column;
	}

	.input-group label {
		font-size: 0.75rem;
		color: #6b7280;
		margin-bottom: 0.25rem;
	}

	.input-group input {
		padding: 0.375rem;
		border: 1px solid #d1d5db;
		border-radius: 0.25rem;
		font-size: 0.875rem;
	}

	.editor-actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 1rem;
		border-top: 1px solid #e5e7eb;
		margin-top: 1rem;
	}

	.action-group {
		display: flex;
		gap: 0.75rem;
	}

	@media (max-width: 768px) {
		.editor-layout {
			grid-template-columns: 1fr;
			grid-template-rows: 1fr auto;
		}

		.tools-section {
			max-height: 200px;
		}

		.editor-actions {
			flex-direction: column;
			gap: 1rem;
		}

		.action-group {
			width: 100%;
			justify-content: center;
		}
	}
</style>
