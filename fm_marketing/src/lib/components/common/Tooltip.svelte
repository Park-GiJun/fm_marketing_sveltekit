<!-- src/lib/components/common/Tooltip.svelte -->
<script>
	import { createEventDispatcher } from 'svelte';
	
	const dispatch = createEventDispatcher();
	
	export let text = '';
	export let position = 'top'; // top, bottom, left, right
	export let trigger = 'hover'; // hover, click, focus, manual
	export let delay = 0; // ms
	export let disabled = false;
	export let maxWidth = '200px';
	export let theme = 'dark'; // dark, light
	
	let visible = false;
	let tooltipElement;
	let triggerElement;
	let showTimeout;
	let hideTimeout;
	
	// 위치별 클래스
	const positionClasses = {
		top: 'tooltip-top',
		bottom: 'tooltip-bottom',
		left: 'tooltip-left',
		right: 'tooltip-right'
	};
	
	$: positionClass = positionClasses[position] || positionClasses.top;
	$: themeClass = theme === 'light' ? 'tooltip-light' : 'tooltip-dark';
	
	// 툴팁 표시
	function show() {
		if (disabled || visible) return;
		
		clearTimeout(hideTimeout);
		
		if (delay > 0) {
			showTimeout = setTimeout(() => {
				visible = true;
				dispatch('show');
			}, delay);
		} else {
			visible = true;
			dispatch('show');
		}
	}
	
	// 툴팁 숨김
	function hide() {
		if (disabled) return;
		
		clearTimeout(showTimeout);
		
		hideTimeout = setTimeout(() => {
			visible = false;
			dispatch('hide');
		}, 100); // 짧은 딜레이로 마우스 이동 시 깜빡임 방지
	}
	
	// 즉시 숨김
	function hideImmediate() {
		if (disabled) return;
		
		clearTimeout(showTimeout);
		clearTimeout(hideTimeout);
		visible = false;
		dispatch('hide');
	}
	
	// 이벤트 핸들러
	function handleMouseEnter() {
		if (trigger === 'hover') show();
	}
	
	function handleMouseLeave() {
		if (trigger === 'hover') hide();
	}
	
	function handleClick() {
		if (trigger === 'click') {
			visible ? hideImmediate() : show();
		}
	}
	
	function handleFocus() {
		if (trigger === 'focus') show();
	}
	
	function handleBlur() {
		if (trigger === 'focus') hide();
	}
	
	function handleKeyDown(event) {
		if (event.key === 'Escape' && visible) {
			hideImmediate();
		}
	}
	
	// 툴팁 마우스 이벤트 (마우스가 툴팁 위에 있을 때 사라지지 않도록)
	function handleTooltipMouseEnter() {
		if (trigger === 'hover') {
			clearTimeout(hideTimeout);
		}
	}
	
	function handleTooltipMouseLeave() {
		if (trigger === 'hover') {
			hide();
		}
	}
	
	// 외부 API
	export function showTooltip() {
		show();
	}
	
	export function hideTooltip() {
		hideImmediate();
	}
	
	export function toggleTooltip() {
		visible ? hideImmediate() : show();
	}
</script>

<svelte:window on:keydown={handleKeyDown} />

<div 
	class="tooltip-wrapper"
	bind:this={triggerElement}
	on:mouseenter={handleMouseEnter}
	on:mouseleave={handleMouseLeave}
	on:click={handleClick}
	on:focus={handleFocus}
	on:blur={handleBlur}
>
	<slot></slot>
	
	{#if visible && text}
		<div 
			class="tooltip {positionClass} {themeClass}"
			bind:this={tooltipElement}
			style="max-width: {maxWidth}"
			on:mouseenter={handleTooltipMouseEnter}
			on:mouseleave={handleTooltipMouseLeave}
			role="tooltip"
			aria-hidden={!visible}
		>
			<div class="tooltip-content">
				{text}
			</div>
			<div class="tooltip-arrow"></div>
		</div>
	{/if}
</div>

<style>
	.tooltip-wrapper {
		position: relative;
		display: inline-block;
	}
	
	.tooltip {
		position: absolute;
		z-index: 9999;
		padding: 0;
		border-radius: 0.375rem;
		font-size: 0.75rem;
		line-height: 1.4;
		word-wrap: break-word;
		animation: tooltipFadeIn 0.15s ease-out;
		pointer-events: auto;
	}
	
	@keyframes tooltipFadeIn {
		from {
			opacity: 0;
			transform: scale(0.8);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
	
	.tooltip-content {
		padding: 0.5rem 0.75rem;
		border-radius: inherit;
	}
	
	.tooltip-arrow {
		position: absolute;
		width: 0;
		height: 0;
		border-style: solid;
	}
	
	/* 다크 테마 */
	.tooltip-dark .tooltip-content {
		background-color: #1f2937;
		color: white;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}
	
	/* 라이트 테마 */
	.tooltip-light .tooltip-content {
		background-color: white;
		color: #1f2937;
		border: 1px solid #e5e7eb;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}
	
	/* 위치별 스타일 */
	.tooltip-top {
		bottom: 100%;
		left: 50%;
		transform: translateX(-50%);
		margin-bottom: 0.5rem;
	}
	
	.tooltip-top .tooltip-arrow {
		top: 100%;
		left: 50%;
		margin-left: -5px;
		border-width: 5px 5px 0 5px;
	}
	
	.tooltip-dark.tooltip-top .tooltip-arrow {
		border-color: #1f2937 transparent transparent transparent;
	}
	
	.tooltip-light.tooltip-top .tooltip-arrow {
		border-color: #e5e7eb transparent transparent transparent;
	}
	
	.tooltip-bottom {
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		margin-top: 0.5rem;
	}
	
	.tooltip-bottom .tooltip-arrow {
		bottom: 100%;
		left: 50%;
		margin-left: -5px;
		border-width: 0 5px 5px 5px;
	}
	
	.tooltip-dark.tooltip-bottom .tooltip-arrow {
		border-color: transparent transparent #1f2937 transparent;
	}
	
	.tooltip-light.tooltip-bottom .tooltip-arrow {
		border-color: transparent transparent #e5e7eb transparent;
	}
	
	.tooltip-left {
		top: 50%;
		right: 100%;
		transform: translateY(-50%);
		margin-right: 0.5rem;
	}
	
	.tooltip-left .tooltip-arrow {
		top: 50%;
		left: 100%;
		margin-top: -5px;
		border-width: 5px 0 5px 5px;
	}
	
	.tooltip-dark.tooltip-left .tooltip-arrow {
		border-color: transparent transparent transparent #1f2937;
	}
	
	.tooltip-light.tooltip-left .tooltip-arrow {
		border-color: transparent transparent transparent #e5e7eb;
	}
	
	.tooltip-right {
		top: 50%;
		left: 100%;
		transform: translateY(-50%);
		margin-left: 0.5rem;
	}
	
	.tooltip-right .tooltip-arrow {
		top: 50%;
		right: 100%;
		margin-top: -5px;
		border-width: 5px 5px 5px 0;
	}
	
	.tooltip-dark.tooltip-right .tooltip-arrow {
		border-color: transparent #1f2937 transparent transparent;
	}
	
	.tooltip-light.tooltip-right .tooltip-arrow {
		border-color: transparent #e5e7eb transparent transparent;
	}
	
	/* 반응형 조정 */
	@media (max-width: 640px) {
		.tooltip {
			max-width: 90vw !important;
		}
		
		.tooltip-left,
		.tooltip-right {
			position: fixed;
			top: auto !important;
			bottom: 1rem;
			left: 1rem !important;
			right: 1rem !important;
			transform: none !important;
			margin: 0 !important;
		}
		
		.tooltip-left .tooltip-arrow,
		.tooltip-right .tooltip-arrow {
			display: none;
		}
	}
</style>
