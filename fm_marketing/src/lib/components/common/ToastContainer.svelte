<!-- src/lib/components/common/ToastContainer.svelte -->
<script>
	import { toastStore } from '$lib/stores/toastStore.js';
	import Toast from './Toast.svelte';
	
	$: toasts = $toastStore;
	
	function handleToastClose(toastId) {
		toastStore.remove(toastId);
	}
</script>

<div class="toast-container">
	{#each toasts as toast (toast.id)}
		<Toast
			type={toast.type}
			title={toast.title}
			message={toast.message}
			duration={toast.duration}
			closable={toast.closable}
			position={toast.position}
			on:close={() => handleToastClose(toast.id)}
		/>
	{/each}
</div>

<style>
	.toast-container {
		pointer-events: none;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 9999;
	}
</style>
