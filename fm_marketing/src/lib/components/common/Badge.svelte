<!-- src/lib/components/common/Badge.svelte -->
<script>
	// 배지 타입
	export let type = 'default'; // default, primary, secondary, success, warning, danger
	export let size = 'md'; // sm, md, lg

	// 색상 매핑
	const colors = {
		default: {
			bg: 'bg-gray-100',
			text: 'text-gray-800'
		},
		primary: {
			bg: 'bg-blue-100',
			text: 'text-blue-800'
		},
		secondary: {
			bg: 'bg-purple-100',
			text: 'text-purple-800'
		},
		success: {
			bg: 'bg-green-100',
			text: 'text-green-800'
		},
		warning: {
			bg: 'bg-yellow-100',
			text: 'text-yellow-800'
		},
		danger: {
			bg: 'bg-red-100',
			text: 'text-red-800'
		},
		review: {
			bg: 'bg-green-100',
			text: 'text-green-800'
		},
		premium: {
			bg: 'bg-blue-100',
			text: 'text-blue-800'
		}
	};

	// 사이즈 매핑
	const sizes = {
		sm: 'text-xs px-1.5 py-0.5',
		md: 'text-sm px-2 py-1',
		lg: 'text-base px-3 py-1.5'
	};

	// 선택된 스타일
	$: bgColor = colors[type]?.bg || colors.default.bg;
	$: textColor = colors[type]?.text || colors.default.text;
	$: sizeClass = sizes[size] || sizes.md;
</script>

<span class="badge {bgColor} {textColor} {sizeClass}">
  <slot></slot>
</span>

<style>
    .badge {
        display: inline-flex;
        align-items: center;
        border-radius: 9999px;
        font-weight: 500;
        line-height: 1;
        white-space: nowrap;
    }
</style>