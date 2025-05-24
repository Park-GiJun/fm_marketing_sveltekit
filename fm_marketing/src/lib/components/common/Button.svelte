<!-- src/lib/components/common/Button.svelte -->
<script>
	// 버튼 속성
	export let type = 'button'; // button, submit, reset
	export let variant = 'primary'; // primary, secondary, outline, text, mint, pink
	export let size = 'md'; // sm, md, lg
	export let disabled = false;
	export let fullWidth = false;
	export let icon = null; // 아이콘 SVG 코드
	export let iconPosition = 'left'; // left, right

	// 선택된 스타일
	$: buttonClass = `button button-${variant} button-${size} ${fullWidth ? 'button-full' : ''} ${disabled ? 'disabled' : ''}`;
</script>

<button
	{type}
	class={buttonClass}
	{disabled}
	on:click
>
	{#if icon && iconPosition === 'left'}
		<span class="icon icon-left">{@html icon}</span>
	{/if}

	<span class="button-text">
		<slot></slot>
	</span>

	{#if icon && iconPosition === 'right'}
		<span class="icon icon-right">{@html icon}</span>
	{/if}
</button>

<style>
	.button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: 1px solid transparent;
		border-radius: 0.375rem;
		font-weight: 500;
		line-height: 1.5;
		transition: all 0.2s ease;
		cursor: pointer;
		white-space: nowrap;
		text-decoration: none;
		outline: none;
		position: relative;
		overflow: hidden;
	}

	.button:hover:not(.disabled) {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.button:active:not(.disabled) {
		transform: translateY(0);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.button:focus-visible {
		box-shadow: 0 0 0 3px rgba(92, 224, 198, 0.3);
	}

	/* 크기 */
	.button-sm {
		font-size: 0.75rem;
		padding: 0.375rem 0.75rem;
	}

	.button-md {
		font-size: 0.875rem;
		padding: 0.5rem 1rem;
	}

	.button-lg {
		font-size: 1rem;
		padding: 0.75rem 1.5rem;
	}

	/* 변형 - 프로젝트 색상 사용 */
	.button-primary {
		background-color: #5ce0c6; /* mint */
		color: white;
		border-color: #5ce0c6;
		box-shadow: 0 2px 4px rgba(92, 224, 198, 0.3);
	}

	.button-primary:hover:not(.disabled) {
		background-color: #3aaa94; /* mint-dark */
		border-color: #3aaa94;
	}

	.button-secondary {
		background-color: #ff7eb6; /* pink */
		color: white;
		border-color: #ff7eb6;
		box-shadow: 0 2px 4px rgba(255, 126, 182, 0.3);
	}

	.button-secondary:hover:not(.disabled) {
		background-color: #d6558e; /* pink-dark */
		border-color: #d6558e;
	}

	.button-mint {
		background-color: #5ce0c6;
		color: white;
		border-color: #5ce0c6;
		box-shadow: 0 2px 4px rgba(92, 224, 198, 0.3);
	}

	.button-mint:hover:not(.disabled) {
		background-color: #3aaa94;
		border-color: #3aaa94;
	}

	.button-pink {
		background-color: #ff7eb6;
		color: white;
		border-color: #ff7eb6;
		box-shadow: 0 2px 4px rgba(255, 126, 182, 0.3);
	}

	.button-pink:hover:not(.disabled) {
		background-color: #d6558e;
		border-color: #d6558e;
	}

	.button-outline {
		background-color: white;
		color: #374151;
		border-color: #d1d5db;
	}

	.button-outline:hover:not(.disabled) {
		background-color: #f9fafb;
		border-color: #9ca3af;
		color: #1f2937;
	}

	.button-text {
		background-color: transparent;
		color: #374151;
		border-color: transparent;
		box-shadow: none;
	}

	.button-text:hover:not(.disabled) {
		background-color: #f3f4f6;
		color: #1f2937;
	}

	/* 전체 너비 */
	.button-full {
		width: 100%;
	}

	/* 비활성화 상태 */
	.button.disabled,
	.button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none !important;
		box-shadow: none !important;
	}

	/* 아이콘 */
	.icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1em;
		height: 1em;
		flex-shrink: 0;
	}

	.icon-left {
		margin-right: 0.5rem;
	}

	.icon-right {
		margin-left: 0.5rem;
	}

	.button-text {
		display: inline-flex;
		align-items: center;
	}

	/* 아이콘만 있는 버튼 처리 */
	.button:not(:has(.button-text)) {
		padding-left: 0.75rem;
		padding-right: 0.75rem;
	}

	.button-sm:not(:has(.button-text)) {
		padding-left: 0.5rem;
		padding-right: 0.5rem;
	}

	.button-lg:not(:has(.button-text)) {
		padding-left: 1rem;
		padding-right: 1rem;
	}

	/* 리플 효과 */
	.button::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 0;
		height: 0;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.5);
		transform: translate(-50%, -50%);
		transition: width 0.6s, height 0.6s;
	}

	.button:active::before {
		width: 300px;
		height: 300px;
	}

	/* 로딩 상태 준비 (추후 구현) */
	.button.loading {
		color: transparent;
		pointer-events: none;
	}

	.button.loading::after {
		content: '';
		position: absolute;
		width: 1rem;
		height: 1rem;
		border: 2px solid #ffffff;
		border-radius: 50%;
		border-top-color: transparent;
		animation: button-loading-spinner 0.8s linear infinite;
	}

	@keyframes button-loading-spinner {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>