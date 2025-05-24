<!-- src/routes/points/+page.svelte -->
<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { userStore } from '$lib/stores/userStore.js';
	import MainLayout from '$lib/components/layout/MainLayout.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import Badge from '$lib/components/common/Badge.svelte';

	let isAuthenticated = false;
	let user = null;
	let activeTab = 'all'; // all, earn, spend, withdraw
	let loading = true;

	// 포인트 요약
	let pointsSummary = {
		total: 15000,
		available: 12000,
		pending: 3000,
		thisMonth: 2500
	};

	// 포인트 내역 (더미 데이터)
	let pointHistory = [
		{
			id: 1,
			type: 'earn',
			amount: 5000,
			description: '서울 맛집 체험단 활동 완료',
			date: '2025-02-20',
			status: 'completed'
		},
		{
			id: 2,
			type: 'earn',
			amount: 100,
			description: '일일 로그인 보너스',
			date: '2025-02-20',
			status: 'completed'
		},
		{
			id: 3,
			type: 'spend',
			amount: -3000,
			description: '현금 환급 신청',
			date: '2025-02-18',
			status: 'completed'
		},
		{
			id: 4,
			type: 'earn',
			amount: 50,
			description: '커뮤니티 게시글 작성',
			date: '2025-02-17',
			status: 'completed'
		},
		{
			id: 5,
			type: 'withdraw',
			amount: -10000,
			description: '현금 환급 완료 (계좌: 우리은행)',
			date: '2025-02-15',
			status: 'completed'
		},
		{
			id: 6,
			type: 'earn',
			amount: 3000,
			description: '뷰티 제품 체험단 활동 완료',
			date: '2025-02-10',
			status: 'pending'
		}
	];

	// 탭별 필터링된 내역
	$: filteredHistory = pointHistory.filter((item) => {
		if (activeTab === 'all') return true;
		return item.type === activeTab;
	});

	// 탭 변경
	function changeTab(tab) {
		activeTab = tab;
	}

	// 환급 신청 페이지로 이동
	function goToWithdraw() {
		goto('/mypage?tab=points');
	}

	// 금액 포맷팅
	function formatAmount(amount) {
		const absAmount = Math.abs(amount);
		const formatted = absAmount.toLocaleString();
		return amount >= 0 ? `+${formatted}` : `-${formatted}`;
	}

	// 타입별 색상
	function getTypeColor(type, amount) {
		if (type === 'earn') return 'text-green-600';
		if (type === 'spend' || type === 'withdraw') return 'text-red-600';
		return 'text-gray-600';
	}

	// 타입별 라벨
	function getTypeLabel(type) {
		switch (type) {
			case 'earn':
				return '적립';
			case 'spend':
				return '사용';
			case 'withdraw':
				return '환급';
			default:
				return type;
		}
	}

	// 상태별 배지
	function getStatusBadge(status) {
		if (status === 'pending') {
			return { type: 'warning', text: '대기중' };
		}
		return { type: 'success', text: '완료' };
	}

	onMount(() => {
		const unsubscribe = userStore.subscribe((state) => {
			isAuthenticated = state.isAuthenticated;
			user = state.user;

			if (!isAuthenticated) {
				goto('/login?redirect=/points');
			} else {
				loading = false;
			}
		});

		return () => {
			unsubscribe();
		};
	});
</script>

<svelte:head>
	<title>포인트 내역 - FM마케팅</title>
</svelte:head>

<MainLayout>
	<div class="points-container">
		<div class="page-header">
			<h1 class="page-title">포인트 내역</h1>
			<p class="page-description">포인트 적립 및 사용 내역을 확인하세요.</p>
		</div>

		{#if loading}
			<div class="loading-state">포인트 정보를 불러오는 중...</div>
		{:else}
			<!-- 포인트 요약 카드 -->
			<div class="points-summary-grid">
				<div class="summary-card">
					<div class="summary-icon blue">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<line x1="12" y1="1" x2="12" y2="23"></line>
							<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
						</svg>
					</div>
					<div class="summary-content">
						<p class="summary-label">총 포인트</p>
						<p class="summary-value">{pointsSummary.total.toLocaleString()}P</p>
					</div>
				</div>

				<div class="summary-card">
					<div class="summary-icon green">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
							<line x1="9" y1="9" x2="15" y2="9"></line>
							<line x1="9" y1="13" x2="15" y2="13"></line>
							<line x1="9" y1="17" x2="15" y2="17"></line>
						</svg>
					</div>
					<div class="summary-content">
						<p class="summary-label">사용 가능</p>
						<p class="summary-value primary">{pointsSummary.available.toLocaleString()}P</p>
					</div>
				</div>

				<div class="summary-card">
					<div class="summary-icon orange">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<circle cx="12" cy="12" r="10"></circle>
							<polyline points="12 6 12 12 16 14"></polyline>
						</svg>
					</div>
					<div class="summary-content">
						<p class="summary-label">적립 예정</p>
						<p class="summary-value">{pointsSummary.pending.toLocaleString()}P</p>
					</div>
				</div>

				<div class="summary-card">
					<div class="summary-icon purple">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
							<line x1="16" y1="2" x2="16" y2="6"></line>
							<line x1="8" y1="2" x2="8" y2="6"></line>
							<line x1="3" y1="10" x2="21" y2="10"></line>
						</svg>
					</div>
					<div class="summary-content">
						<p class="summary-label">이번 달 적립</p>
						<p class="summary-value">{pointsSummary.thisMonth.toLocaleString()}P</p>
					</div>
				</div>
			</div>

			<!-- 탭 네비게이션 -->
			<div class="tab-navigation">
				<button
					class="tab-button {activeTab === 'all' ? 'active' : ''}"
					on:click={() => changeTab('all')}
				>
					전체
				</button>
				<button
					class="tab-button {activeTab === 'earn' ? 'active' : ''}"
					on:click={() => changeTab('earn')}
				>
					적립
				</button>
				<button
					class="tab-button {activeTab === 'spend' ? 'active' : ''}"
					on:click={() => changeTab('spend')}
				>
					사용
				</button>
				<button
					class="tab-button {activeTab === 'withdraw' ? 'active' : ''}"
					on:click={() => changeTab('withdraw')}
				>
					환급
				</button>
			</div>

			<!-- 포인트 내역 -->
			<div class="history-section">
				<div class="section-header">
					<h2 class="section-title">포인트 내역</h2>
					<Button variant="primary" size="md" on:click={goToWithdraw}>
						포인트 환급 신청
					</Button>
				</div>

				{#if filteredHistory.length === 0}
					<div class="empty-state">
						<p>포인트 내역이 없습니다.</p>
					</div>
				{:else}
					<div class="history-list">
						{#each filteredHistory as item}
							<div class="history-item">
								<div class="history-info">
									<div class="history-header">
										<h3 class="history-title">{item.description}</h3>
										<Badge {...getStatusBadge(item.status)} size="sm" />
									</div>
									<div class="history-meta">
										<span class="history-type">{getTypeLabel(item.type)}</span>
										<span class="history-date">{item.date}</span>
									</div>
								</div>
								<div class="history-amount {getTypeColor(item.type, item.amount)}">
									{formatAmount(item.amount)}P
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>

			<!-- 포인트 안내 -->
			<div class="info-section">
				<h2 class="info-title">포인트 안내</h2>
				<div class="info-grid">
					<div class="info-card">
						<h3 class="info-card-title">포인트 적립 방법</h3>
						<ul class="info-list">
							<li>회원가입: 1,000P</li>
							<li>일일 로그인: 10P</li>
							<li>체험단 활동 완료: 5,000~50,000P</li>
							<li>커뮤니티 활동: 10~50P</li>
						</ul>
					</div>

					<div class="info-card">
						<h3 class="info-card-title">포인트 사용 방법</h3>
						<ul class="info-list">
							<li>체험단 신청 시 사용</li>
							<li>현금 환급 (최소 10,000P)</li>
							<li>이벤트 참여</li>
							<li>제휴 쇼핑몰 사용</li>
						</ul>
					</div>

					<div class="info-card">
						<h3 class="info-card-title">유의사항</h3>
						<ul class="info-list">
							<li>포인트 유효기간: 1년</li>
							<li>환급 수수료: 없음</li>
							<li>환급 소요시간: 3~5일</li>
							<li>부정 적립 시 회수 가능</li>
						</ul>
					</div>
				</div>
			</div>
		{/if}
	</div>
</MainLayout>

<style>
	.points-container {
		max-width: 1000px;
		margin: 0 auto;
		padding: 1rem;
	}

	.page-header {
		margin-bottom: 2rem;
	}

	.page-title {
		font-size: 1.875rem;
		font-weight: 700;
		color: #1f2937;
		margin: 0 0 0.5rem 0;
	}

	.page-description {
		font-size: 1rem;
		color: #6b7280;
	}

	.loading-state {
		padding: 3rem;
		text-align: center;
		color: #6b7280;
	}

	/* 포인트 요약 */
	.points-summary-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.summary-card {
		background-color: white;
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		padding: 1.5rem;
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.summary-icon {
		width: 3rem;
		height: 3rem;
		border-radius: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.summary-icon.blue {
		background-color: #dbeafe;
		color: #3b82f6;
	}

	.summary-icon.green {
		background-color: #d1fae5;
		color: #10b981;
	}

	.summary-icon.orange {
		background-color: #fed7aa;
		color: #f97316;
	}

	.summary-icon.purple {
		background-color: #e9d5ff;
		color: #9333ea;
	}

	.summary-content {
		flex: 1;
	}

	.summary-label {
		font-size: 0.75rem;
		color: #6b7280;
		margin: 0 0 0.25rem 0;
	}

	.summary-value {
		font-size: 1.25rem;
		font-weight: 700;
		color: #1f2937;
		margin: 0;
	}

	.summary-value.primary {
		color: #5ce0c6;
	}

	/* 탭 네비게이션 */
	.tab-navigation {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 2rem;
		background-color: white;
		padding: 0.5rem;
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.tab-button {
		flex: 1;
		padding: 0.75rem;
		background-color: transparent;
		border: none;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: #6b7280;
		cursor: pointer;
		transition: all 0.2s;
	}

	.tab-button:hover {
		background-color: #f3f4f6;
		color: #4b5563;
	}

	.tab-button.active {
		background-color: #5ce0c6;
		color: white;
	}

	/* 포인트 내역 */
	.history-section {
		background-color: white;
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		padding: 1.5rem;
		margin-bottom: 2rem;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.section-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
		margin: 0;
	}

	.empty-state {
		padding: 3rem;
		text-align: center;
		color: #6b7280;
	}

	.history-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.history-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background-color: #f9fafb;
		border-radius: 0.375rem;
		transition: background-color 0.2s;
	}

	.history-item:hover {
		background-color: #f3f4f6;
	}

	.history-info {
		flex: 1;
	}

	.history-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.history-title {
		font-size: 0.875rem;
		font-weight: 500;
		color: #1f2937;
		margin: 0;
	}

	.history-meta {
		display: flex;
		align-items: center;
		gap: 1rem;
		font-size: 0.75rem;
		color: #6b7280;
	}

	.history-type {
		font-weight: 500;
	}

	.history-amount {
		font-size: 1.125rem;
		font-weight: 700;
		flex-shrink: 0;
	}

	.text-green-600 {
		color: #10b981;
	}

	.text-red-600 {
		color: #ef4444;
	}

	/* 포인트 안내 */
	.info-section {
		background-color: white;
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		padding: 1.5rem;
	}

	.info-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
		margin: 0 0 1.5rem 0;
		padding-bottom: 1rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}

	.info-card {
		background-color: #f9fafb;
		border-radius: 0.375rem;
		padding: 1.25rem;
	}

	.info-card-title {
		font-size: 1rem;
		font-weight: 600;
		color: #1f2937;
		margin: 0 0 0.75rem 0;
	}

	.info-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.info-list li {
		font-size: 0.875rem;
		color: #4b5563;
		margin-bottom: 0.5rem;
		padding-left: 1rem;
		position: relative;
	}

	.info-list li::before {
		content: '•';
		position: absolute;
		left: 0;
		color: #5ce0c6;
	}

	@media (max-width: 768px) {
		.points-summary-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.tab-navigation {
			flex-wrap: wrap;
		}

		.section-header {
			flex-direction: column;
			gap: 1rem;
			align-items: flex-start;
		}

		.info-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 480px) {
		.points-summary-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
