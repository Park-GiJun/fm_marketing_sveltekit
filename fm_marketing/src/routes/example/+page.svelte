<!-- src/routes/examples/+page.svelte -->
<script>
	import MainLayout from '$lib/components/layout/MainLayout.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import Modal from '$lib/components/common/Modal.svelte';
	import Dropdown from '$lib/components/common/Dropdown.svelte';
	import ImageUploader from '$lib/components/common/ImageUploader.svelte';
	import ImageGallery from '$lib/components/common/ImageGallery.svelte';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import Pagination from '$lib/components/common/Pagination.svelte';
	import Badge from '$lib/components/common/Badge.svelte';
	import Avatar from '$lib/components/common/Avatar.svelte';
	import { toast } from '$lib/stores/toastStore.js';

	// Modal 상태
	let showModal = false;
	let modalLoading = false;

	// Dropdown 데이터
	let selectedCategory = null;
	const categoryOptions = [
		{ value: 'food', label: '맛집', description: '음식점 체험단' },
		{ value: 'beauty', label: '뷰티', description: '화장품/뷰티 제품' },
		{ value: 'travel', label: '여행', description: '여행지/숙박 체험' },
		{ value: 'lifestyle', label: '라이프스타일', description: '생활용품' }
	];

	// 이미지 갤러리 데이터
	const galleryImages = [
		{ src: '/images/gallery/1.jpg', alt: '갤러리 이미지 1', caption: '맛있는 음식' },
		{ src: '/images/gallery/2.jpg', alt: '갤러리 이미지 2', caption: '아름다운 풍경' },
		{ src: '/images/gallery/3.jpg', alt: '갤러리 이미지 3', caption: '멋진 제품' },
		{ src: '/images/gallery/4.jpg', alt: '갤러리 이미지 4', caption: '체험 현장' }
	];

	// 페이지네이션 상태
	let currentPage = 1;
	const totalPages = 10;
	const totalItems = 97;

	// 이벤트 핸들러들
	function handleModalConfirm() {
		modalLoading = true;
		setTimeout(() => {
			modalLoading = false;
			showModal = false;
			toast.success('작업이 완료되었습니다!');
		}, 2000);
	}

	function handleDropdownChange(event) {
		selectedCategory = event.detail.value;
		toast.info(`${event.detail.label} 카테고리를 선택했습니다.`);
	}

	function handleImageUpload(event) {
		const files = event.detail;
		toast.success(`${files.length}개의 이미지가 업로드되었습니다.`);
	}

	function handlePageChange(event) {
		currentPage = event.detail.page;
		toast.info(`${currentPage} 페이지로 이동했습니다.`);
	}

	function showToastExamples() {
		toast.success('성공 메시지입니다!');
		setTimeout(() => toast.error('오류가 발생했습니다.'), 1000);
		setTimeout(() => toast.warning('주의하세요!'), 2000);
		setTimeout(() => toast.info('정보를 확인해주세요.'), 3000);
	}
</script>

<svelte:head>
	<title>컴포넌트 예제 - FM마케팅</title>
</svelte:head>

<MainLayout>
	<div class="examples-container">
		<div class="page-header">
			<h1 class="page-title">컴포넌트 예제</h1>
			<p class="page-description">FM마케팅에서 사용하는 다양한 UI 컴포넌트들을 확인해보세요.</p>
		</div>

		<!-- 버튼 예제 -->
		<section class="example-section">
			<h2 class="section-title">버튼 (Button)</h2>
			<div class="component-showcase">
				<div class="button-group">
					<Button variant="primary" size="sm">Primary Small</Button>
					<Button variant="primary" size="md">Primary Medium</Button>
					<Button variant="primary" size="lg">Primary Large</Button>
				</div>

				<div class="button-group">
					<Button variant="secondary">Secondary</Button>
					<Button variant="outline">Outline</Button>
					<Button variant="text">Text</Button>
					<Button variant="danger">Danger</Button>
				</div>

				<div class="button-group">
					<Button disabled>Disabled</Button>
					<Button variant="primary" on:click={() => showModal = true}>모달 열기</Button>
					<Button variant="secondary" on:click={showToastExamples}>토스트 보기</Button>
				</div>
			</div>
		</section>

		<!-- 배지 예제 -->
		<section class="example-section">
			<h2 class="section-title">배지 (Badge)</h2>
			<div class="component-showcase">
				<div class="badge-group">
					<Badge type="default">기본</Badge>
					<Badge type="primary">주요</Badge>
					<Badge type="secondary">보조</Badge>
					<Badge type="success">성공</Badge>
					<Badge type="warning">경고</Badge>
					<Badge type="danger">위험</Badge>
				</div>

				<div class="badge-group">
					<Badge type="primary" size="sm">작은 크기</Badge>
					<Badge type="primary" size="md">보통 크기</Badge>
					<Badge type="primary" size="lg">큰 크기</Badge>
				</div>
			</div>
		</section>

		<!-- 아바타 예제 -->
		<section class="example-section">
			<h2 class="section-title">아바타 (Avatar)</h2>
			<div class="component-showcase">
				<div class="avatar-group">
					<Avatar size="xs" fallback="XS" />
					<Avatar size="sm" fallback="SM" />
					<Avatar size="md" fallback="MD" />
					<Avatar size="lg" fallback="LG" />
					<Avatar size="xl" fallback="XL" />
				</div>

				<div class="avatar-group">
					<Avatar status="online" fallback="ON" />
					<Avatar status="offline" fallback="OFF" />
					<Avatar status="away" fallback="AW" />
					<Avatar status="busy" fallback="BS" />
				</div>
			</div>
		</section>

		<!-- 드롭다운 예제 -->
		<section class="example-section">
			<h2 class="section-title">드롭다운 (Dropdown)</h2>
			<div class="component-showcase">
				<div class="dropdown-group">
					<div class="dropdown-item">
						<label>카테고리 선택</label>
						<Dropdown
							items={categoryOptions}
							placeholder="카테고리를 선택하세요"
							bind:value={selectedCategory}
							on:change={handleDropdownChange}
						/>
					</div>

					<div class="dropdown-item">
						<label>검색 가능한 드롭다운</label>
						<Dropdown
							items={categoryOptions}
							placeholder="검색해보세요"
							searchable={true}
							clearable={true}
						/>
					</div>
				</div>
			</div>
		</section>

		<!-- 로딩 스피너 예제 -->
		<section class="example-section">
			<h2 class="section-title">로딩 스피너 (LoadingSpinner)</h2>
			<div class="component-showcase">
				<div class="spinner-group">
					<LoadingSpinner size="xs" text="초소형" />
					<LoadingSpinner size="sm" text="소형" />
					<LoadingSpinner size="md" text="보통" />
					<LoadingSpinner size="lg" text="대형" />
				</div>

				<div class="spinner-group">
					<LoadingSpinner color="primary" text="주요" />
					<LoadingSpinner color="secondary" text="보조" />
					<LoadingSpinner color="gray" text="회색" />
					<LoadingSpinner inline text="인라인" />
				</div>
			</div>
		</section>

		<!-- 이미지 업로더 예제 -->
		<section class="example-section">
			<h2 class="section-title">이미지 업로더 (ImageUploader)</h2>
			<div class="component-showcase">
				<ImageUploader
					maxFiles={3}
					on:change={handleImageUpload}
				/>
			</div>
		</section>

		<!-- 이미지 갤러리 예제 -->
		<section class="example-section">
			<h2 class="section-title">이미지 갤러리 (ImageGallery)</h2>
			<div class="component-showcase">
				<ImageGallery
					images={galleryImages}
					columns={2}
					aspectRatio="4/3"
				/>
			</div>
		</section>

		<!-- 페이지네이션 예제 -->
		<section class="example-section">
			<h2 class="section-title">페이지네이션 (Pagination)</h2>
			<div class="component-showcase">
				<Pagination
					bind:currentPage
					{totalPages}
					{totalItems}
					itemsPerPage={10}
					on:change={handlePageChange}
				/>
			</div>
		</section>
	</div>
</MainLayout>

<!-- 모달 예제 -->
<Modal
	bind:open={showModal}
	title="예제 모달"
	confirmText="확인"
	cancelText="취소"
	loading={modalLoading}
	on:confirm={handleModalConfirm}
>
	<p>이것은 모달 다이얼로그의 예제입니다.</p>
	<p>확인 버튼을 클릭하면 2초 후에 모달이 닫힙니다.</p>
</Modal>

<style>
    .examples-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem;
    }

    .page-header {
        text-align: center;
        margin-bottom: 3rem;
    }

    .page-title {
        font-size: 2rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 0.5rem;
    }

    .page-description {
        font-size: 1rem;
        color: #6b7280;
    }

    .example-section {
        margin-bottom: 3rem;
        background-color: white;
        border-radius: 0.5rem;
        padding: 2rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .section-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 1.5rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #e5e7eb;
    }

    .component-showcase {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .button-group,
    .badge-group,
    .avatar-group,
    .spinner-group {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        align-items: center;
    }

    .dropdown-group {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
    }

    .dropdown-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .dropdown-item label {
        font-size: 0.875rem;
        font-weight: 500;
        color: #4b5563;
    }

    @media (max-width: 768px) {
        .examples-container {
            padding: 1rem;
        }

        .example-section {
            padding: 1.5rem;
        }

        .dropdown-group {
            grid-template-columns: 1fr;
        }
    }
</style>