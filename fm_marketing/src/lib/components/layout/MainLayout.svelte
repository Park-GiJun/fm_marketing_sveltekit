<!-- src/lib/components/layout/MainLayout.svelte -->
<script>
	import Header from '$lib/components/common/Header.svelte';
	import Footer from '$lib/components/common/Footer.svelte';
	import ToastContainer from '$lib/components/common/ToastContainer.svelte';

	// 현재 선택된 지역 (기본값: 전체)
	export let selectedRegion = '전체';
</script>

<div class="main-layout">
	<Header />

	<main class="main-content">
		<slot />
	</main>

	<Footer />
	
	<!-- 토스트 알림 -->
	<ToastContainer />
</div>

<style>
    .main-layout {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    .main-content {
        flex: 1;
        max-width: 1200px;
        width: 100%;
        margin: 0 auto;
        padding: 2rem 1rem;
    }

    @media (max-width: 1200px) {
        .main-content {
            padding: 1.5rem 1rem;
        }
    }
</style>