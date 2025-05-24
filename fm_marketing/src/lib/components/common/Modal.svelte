<!-- src/lib/components/common/Modal.svelte -->
<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import Button from './Button.svelte';
	
	const dispatch = createEventDispatcher();
	
	export let open = false;
	export let title = '';
	export let size = 'md'; // sm, md, lg, xl, full
	export let closable = true;
	export let confirmText = '확인';
	export let cancelText = '취소';
	export let showFooter = true;
	export let showCancel = true;
	export let showConfirm = true;
	export let loading = false;
	export let danger = false;
	
	let modal;
	let modalContent;
	
	// 사이즈별 클래스
	const sizeClasses = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-2xl',
		xl: 'max-w-4xl',
		full: 'max-w-full mx-4'
	};
	
	$: sizeClass = sizeClasses[size] || sizeClasses.md;
	
	// 모달 닫기
	function closeModal() {
		if (!closable || loading) return;
		open = false;
		dispatch('close');
	}
	
	// 확인 버튼
	function handleConfirm() {
		dispatch('confirm');
	}
	
	// 취소 버튼
	function handleCancel() {
		dispatch('cancel');
		closeModal();
	}
	
	// 백드롭 클릭
	function handleBackdropClick(event) {
		if (event.target === modal && closable && !loading) {
			closeModal();
		}
	}
	
	// ESC 키 처리
	function handleKeydown(event) {
		if (event.key === 'Escape' && open && closable && !loading) {
			closeModal();
		}
	}
	
	// 포커스 트랩
	function trapFocus(event) {
		if (!open || !modalContent) return;
		
		const focusableElements = modalContent.querySelectorAll(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);
		
		const firstElement = focusableElements[0];
		const lastElement = focusableElements[focusableElements.length - 1];
		
		if (event.key === 'Tab') {
			if (event.shiftKey) {
				if (document.activeElement === firstElement) {
					event.preventDefault();
					lastElement.focus();
				}
			} else {
				if (document.activeElement === lastElement) {
					event.preventDefault();
					firstElement.focus();
				}
			}
		}
	}
	
	// 모달 열릴 때 포커스 설정
	$: if (open && modalContent) {
		const firstFocusable = modalContent.querySelector(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);
		if (firstFocusable) {
			firstFocusable.focus();
		}
	}
	
	// body 스크롤 방지
	$: if (typeof document !== 'undefined') {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	}
	
	onMount(() => {
		return () => {
			if (typeof document !== 'undefined') {
				document.body.style.overflow = '';
			}
		};
	});
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
	<div 
		class="modal-backdrop"
		bind:this={modal}
		on:click={handleBackdropClick}
		on:keydown={trapFocus}
	>
		<div class="modal-container {sizeClass}" bind:this={modalContent}>
			<!-- 헤더 -->
			{#if title || closable}
				<div class="modal-header">
					{#if title}
						<h2 class="modal-title">{title}</h2>
					{/if}
					
					{#if closable}
						<button 
							class="modal-close"
							on:click={closeModal}
							disabled={loading}
							aria-label="닫기"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<line x1="18" y1="6" x2="6" y2="18"></line>
								<line x1="6" y1="6" x2="18" y2="18"></line>
							</svg>
						</button>
					{/if}
				</div>
			{/if}
			
			<!-- 본문 -->
			<div class="modal-body">
				<slot></slot>
			</div>
			
			<!-- 푸터 -->
			{#if showFooter}
				<div class="modal-footer">
					<slot name="footer">
						<div class="modal-actions">
							{#if showCancel}
								<Button 
									variant="outline" 
									size="md" 
									on:click={handleCancel}
									disabled={loading}
								>
									{cancelText}
								</Button>
							{/if}
							
							{#if showConfirm}
								<Button 
									variant={danger ? 'danger' : 'primary'} 
									size="md" 
									on:click={handleConfirm}
									disabled={loading}
								>
									{loading ? '처리 중...' : confirmText}
								</Button>
							{/if}
						</div>
					</slot>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 1rem;
		animation: fadeIn 0.2s ease-out;
	}
	
	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	
	.modal-container {
		background-color: white;
		border-radius: 0.5rem;
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
		width: 100%;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
		animation: slideIn 0.2s ease-out;
	}
	
	@keyframes slideIn {
		from { 
			opacity: 0;
			transform: translateY(-1rem) scale(0.95);
		}
		to { 
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}
	
	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.5rem;
		border-bottom: 1px solid #e5e7eb;
	}
	
	.modal-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
		margin: 0;
	}
	
	.modal-close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		background-color: transparent;
		border: none;
		border-radius: 0.25rem;
		color: #9ca3af;
		cursor: pointer;
		transition: all 0.2s;
	}
	
	.modal-close:hover:not(:disabled) {
		background-color: #f3f4f6;
		color: #6b7280;
	}
	
	.modal-close:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	
	.modal-body {
		flex: 1;
		padding: 1.5rem;
		overflow-y: auto;
	}
	
	.modal-footer {
		padding: 1.5rem;
		border-top: 1px solid #e5e7eb;
		background-color: #f9fafb;
	}
	
	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
	}
	
	@media (max-width: 640px) {
		.modal-container {
			margin: 0;
			max-height: 100vh;
			border-radius: 0;
		}
		
		.modal-actions {
			flex-direction: column-reverse;
		}
	}
</style>
