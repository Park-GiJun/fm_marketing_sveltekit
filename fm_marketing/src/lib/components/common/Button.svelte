<!-- src/lib/components/common/Button.svelte -->
<script>
	// 버튼 속성
	export let type = 'button'; // button, submit, reset
	export let variant = 'primary'; // primary, secondary, outline, text
	export let size = 'md'; // sm, md, lg
	export let disabled = false;
	export let fullWidth = false;
	export let icon = null; // 아이콘 SVG 코드
	export let iconPosition = 'left'; // left, right

	// 각 variant별 스타일 클래스
	const variants = {
		primary: 'bg-primary-mint hover:bg-primary-mintDark text-white border-primary-mint',
		secondary: 'bg-primary-pink hover:bg-primary-pinkDark text-white border-primary-pink',
		outline: 'bg-transparent hover:bg-gray-50 text-gray-700 border-gray-300',
		text: 'bg-transparent hover:bg-gray-50 text-gray-700 border-transparent'
	};

	// 각 size별 스타일 클래스
	const sizes = {
		sm: 'text-xs px-2.5 py-1.5',
		md: 'text-sm px-4 py-2',
		lg: 'text-base px-6 py-3'
	};

	// 선택된 스타일
	$: variantClass = variants[variant] || variants.primary;
	$: sizeClass = sizes[size] || sizes.md;
	$: widthClass = fullWidth ? 'w-full' : '';
</script>

<button
	{type}
	class="button {variantClass} {sizeClass} {widthClass}"
	{disabled}
	on:click
>
	{#if icon && iconPosition === 'left'}
		<span class="icon-left">{@html icon}</span>
	{/if}

	<slot></slot>

	{#if icon && iconPosition === 'right'}
		<span class="icon-right">{@html icon}</span>
	{/if}
</button>

<style>
    .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-width: 1px;
        border-radius: 0.375rem;
        font-weight: 500;
        line-height: 1.5;
        transition: all 0.2s;
        cursor: pointer;
        white-space: nowrap;
    }

    .button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .icon-left {
        margin-right: 0.5rem;
        display: inline-flex;
    }

    .icon-right {
        margin-left: 0.5rem;
        display: inline-flex;
    }
</style>