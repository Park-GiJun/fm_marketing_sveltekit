<!-- src/routes/+page.svelte -->
<script>
	import MainLayout from '$lib/components/layout/MainLayout.svelte';
	import ContentSection from '$lib/components/layout/ContentSection.svelte';
	import Badge from '$lib/components/common/Badge.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import { reviewStore } from '$lib/stores/reviewStore.js';

	// 현재 선택된 지역
	let selectedRegion = '전체';

	// 지역 변경 핸들러
	function handleRegionChange(event) {
		selectedRegion = event.detail;

		// 지역에 따른 리뷰 데이터 로드
		reviewStore.fetchReviewsByRegion(selectedRegion);
	}

	// 간단한 배너 데이터
	const banner = {
		title: '체험단 모집 중',
		description: '다양한 지역의 맛집, 카페, 체험을 무료로 경험해보세요!',
		buttonText: '체험단 신청하기',
		buttonLink: '/apply'
	};
</script>

<svelte:head>
	<title>FMMarketing - 지역별 체험단 마케팅 플랫폼</title>
	<meta name="description" content="전국 각지의 맛집, 체험, 여행 마케팅을 한 곳에서 확인하세요. FMMarketing에서 다양한 체험단 활동에 참여해보세요!" />
</svelte:head>

<MainLayout bind:selectedRegion on:regionSelect={handleRegionChange}>
	<!-- 배너 섹션 -->
	<section class="banner-section">
		<div class="banner-content">
			<h1 class="banner-title">{banner.title}</h1>
			<p class="banner-description">{banner.description}</p>
			<a href={banner.buttonLink}>
				<Button variant="primary" size="lg">
					{banner.buttonText}
				</Button>
			</a>
		</div>

		<div class="banner-image">
			<!-- 이미지 placeholder -->
			<div class="image-placeholder"></div>
		</div>
	</section>

	<!-- 최근 리뷰 섹션 -->
	<ContentSection
		title="최근 등록된 리뷰"
		showFilter={true}
		region={selectedRegion}
	/>

	<!-- 인기 리뷰 섹션 -->
	<ContentSection
		title="인기 있는 체험단"
		showFilter={false}
		region={selectedRegion}
	/>
</MainLayout>

<style>
    .banner-section {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;
        margin-bottom: 3rem;
        padding: 2rem;
        background-color: white;
        border-radius: 0.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .banner-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .banner-title {
        font-size: 2rem;
        font-weight: 700;
        color: #1f2937;
        margin: 0 0 1rem 0;
    }

    .banner-description {
        font-size: 1.125rem;
        color: #4b5563;
        margin: 0 0 1.5rem 0;
        line-height: 1.5;
    }

    .banner-image {
        width: 100%;
        height: 100%;
        min-height: 200px;
    }

    .image-placeholder {
        width: 100%;
        height: 100%;
        min-height: 200px;
        background-color: #f3f4f6;
        border-radius: 0.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 2px dashed #e5e7eb;
        color: #9ca3af;
        position: relative;
    }

    .image-placeholder::before {
        content: "메인 배너 이미지 준비 중";
        font-size: 0.875rem;
        font-weight: 500;
    }

    .image-placeholder::after {
        content: "📸";
        font-size: 2rem;
        margin-top: 0.5rem;
    }

    @media (min-width: 768px) {
        .banner-section {
            grid-template-columns: 1fr 1fr;
            align-items: center;
        }
    }
</style>