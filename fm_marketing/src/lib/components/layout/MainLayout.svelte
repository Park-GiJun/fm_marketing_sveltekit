<!-- src/lib/components/layout/MainLayout.svelte -->
<!-- src/lib/components/layout/MainLayout.svelte -->
<script>
	import Header from '$lib/components/common/Header.svelte';
	import Footer from '$lib/components/common/Footer.svelte';
	import ToastContainer from '$lib/components/common/ToastContainer.svelte';
	import ServiceWorkerManager from '$lib/components/common/ServiceWorkerManager.svelte';
	// import RegionTab from '$lib/components/layout/RegionTab.svelte';

	// 현재 선택된 지역 (기본값: 전체)
	export let selectedRegion = '전체';

	// 지역 선택 이벤트 핸들러
	// function handleRegionSelect(e) {
	// 	selectedRegion = e.detail;
	// }
</script>

<div class="main-layout">
	<Header />

<!--	<RegionTab {selectedRegion} on:regionSelect={handleRegionSelect} />-->

	<main class="main-content">
		<slot />
	</main>

	<Footer />
	
	<!-- 토스트 알림 -->
	<ToastContainer />
	
	<!-- 서비스 워커 관리 -->
	<ServiceWorkerManager />
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