<!-- src/lib/components/user/UserProfile.svelte -->
<script>
	import { createEventDispatcher } from 'svelte';
	import Avatar from '../common/Avatar.svelte';
	import Button from '../common/Button.svelte';
	import Badge from '../common/Badge.svelte';

	const dispatch = createEventDispatcher();

	// 사용자 정보
	export let user = null;
	export let editable = false;

	// 편집 모드
	let isEditing = false;
	let editForm = {};

	// 사용자 활동 통계 (더미 데이터)
	$: userStats = {
		experienceCount: 12,
		reviewCount: 8,
		totalPoints: 15000,
		level: getUserLevel(user?.experienceCount || 0)
	};

	// 사용자 레벨 계산
	function getUserLevel(count) {
		if (count >= 50) return { name: '플래티넘', color: 'primary' };
		if (count >= 20) return { name: '골드', color: 'warning' };
		if (count >= 10) return { name: '실버', color: 'secondary' };
		return { name: '브론즈', color: 'default' };
	}

	// 편집 모드 시작
	function startEdit() {
		editForm = { ...user };
		isEditing = true;
	}

	// 편집 취소
	function cancelEdit() {
		editForm = {};
		isEditing = false;
	}

	// 정보 저장
	function saveProfile() {
		dispatch('save', editForm);
		isEditing = false;
	}

	// 날짜 포맷팅
	function formatDate(dateString) {
		if (!dateString) return '-';
		const date = new Date(dateString);
		return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
	}
</script>

<div class="user-profile">
	{#if user}
		<div class="profile-header">
			<div class="avatar-section">
				<Avatar 
					src={user.profileImage} 
					alt={user.name}
					size="xl"
					fallback={user.name ? user.name.charAt(0) : 'U'}
				/>
				
				<div class="user-level">
					<Badge type={userStats.level.color} size="sm">
						{userStats.level.name}
					</Badge>
				</div>
			</div>

			<div class="user-info">
				{#if isEditing}
					<div class="edit-form">
						<div class="form-row">
							<label>닉네임</label>
							<input type="text" bind:value={editForm.nickname} />
						</div>
						<div class="form-row">
							<label>이메일</label>
							<input type="email" bind:value={editForm.email} />
						</div>
					</div>
				{:else}
					<h2 class="user-name">{user.name}</h2>
					<p class="user-nickname">@{user.nickname}</p>
					<p class="user-email">{user.email}</p>
				{/if}

				{#if editable}
					<div class="profile-actions">
						{#if isEditing}
							<Button variant="primary" size="sm" on:click={saveProfile}>
								저장
							</Button>
							<Button variant="outline" size="sm" on:click={cancelEdit}>
								취소
							</Button>
						{:else}
							<Button variant="outline" size="sm" on:click={startEdit}>
								정보 수정
							</Button>
						{/if}
					</div>
				{/if}
			</div>
		</div>

		<div class="profile-stats">
			<div class="stat-item">
				<span class="stat-value">{userStats.experienceCount}</span>
				<span class="stat-label">체험단 참여</span>
			</div>
			<div class="stat-item">
				<span class="stat-value">{userStats.reviewCount}</span>
				<span class="stat-label">리뷰 작성</span>
			</div>
			<div class="stat-item">
				<span class="stat-value">{userStats.totalPoints.toLocaleString()}</span>
				<span class="stat-label">보유 포인트</span>
			</div>
		</div>

		<div class="profile-details">
			<h3 class="details-title">상세 정보</h3>
			
			<div class="details-grid">
				<div class="detail-item">
					<span class="detail-label">가입일</span>
					<span class="detail-value">{formatDate(user.createdAt)}</span>
				</div>
				<div class="detail-item">
					<span class="detail-label">최근 활동</span>
					<span class="detail-value">{formatDate(user.lastLoginAt)}</span>
				</div>
				<div class="detail-item">
					<span class="detail-label">선호 지역</span>
					<span class="detail-value">{user.preferredRegion || '서울'}</span>
				</div>
				<div class="detail-item">
					<span class="detail-label">관심 카테고리</span>
					<span class="detail-value">{user.interests?.join(', ') || '맛집, 뷰티'}</span>
				</div>
			</div>
		</div>

		<div class="profile-activity">
			<h3 class="activity-title">최근 활동</h3>
			
			<div class="activity-list">
				<div class="activity-item">
					<div class="activity-icon">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M14 9V5a3 3 0 0 0-6 0v4"/>
							<rect x="2" y="9" width="20" height="12" rx="2" ry="2"/>
						</svg>
					</div>
					<div class="activity-content">
						<span class="activity-text">서울 맛집 체험단 활동 완료</span>
						<span class="activity-date">2일 전</span>
					</div>
				</div>

				<div class="activity-item">
					<div class="activity-icon">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M12 20h9"/>
							<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
						</svg>
					</div>
					<div class="activity-content">
						<span class="activity-text">체험 후기 작성</span>
						<span class="activity-date">3일 전</span>
					</div>
				</div>

				<div class="activity-item">
					<div class="activity-icon">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
						</svg>
					</div>
					<div class="activity-content">
						<span class="activity-text">포인트 적립 (+5,000P)</span>
						<span class="activity-date">5일 전</span>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div class="no-user">
			<p>사용자 정보를 불러올 수 없습니다.</p>
		</div>
	{/if}
</div>

<style>
	.user-profile {
		background-color: white;
		border-radius: 0.5rem;
		padding: 2rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.profile-header {
		display: flex;
		gap: 2rem;
		margin-bottom: 2rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.avatar-section {
		position: relative;
		flex-shrink: 0;
	}

	.user-level {
		position: absolute;
		bottom: -0.5rem;
		right: -0.5rem;
	}

	.user-info {
		flex: 1;
	}

	.user-name {
		font-size: 1.5rem;
		font-weight: 600;
		color: #1f2937;
		margin: 0 0 0.5rem 0;
	}

	.user-nickname {
		font-size: 1rem;
		color: #6b7280;
		margin: 0 0 0.25rem 0;
	}

	.user-email {
		font-size: 0.875rem;
		color: #9ca3af;
		margin: 0 0 1rem 0;
	}

	.edit-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.form-row {
		display: flex;
		flex-direction: column;
	}

	.form-row label {
		font-size: 0.875rem;
		font-weight: 500;
		color: #4b5563;
		margin-bottom: 0.25rem;
	}

	.form-row input {
		padding: 0.5rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		font-size: 0.875rem;
	}

	.profile-actions {
		display: flex;
		gap: 0.75rem;
	}

	.profile-stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 1.5rem;
		background-color: #f9fafb;
		border-radius: 0.375rem;
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 700;
		color: #5ce0c6;
		margin-bottom: 0.25rem;
	}

	.stat-label {
		font-size: 0.875rem;
		color: #6b7280;
	}

	.profile-details {
		margin-bottom: 2rem;
	}

	.details-title, .activity-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.details-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	.detail-item {
		display: flex;
		justify-content: space-between;
		padding: 0.75rem;
		background-color: #f9fafb;
		border-radius: 0.375rem;
	}

	.detail-label {
		font-size: 0.875rem;
		color: #6b7280;
	}

	.detail-value {
		font-size: 0.875rem;
		color: #1f2937;
		font-weight: 500;
	}

	.activity-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.activity-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background-color: #f9fafb;
		border-radius: 0.375rem;
	}

	.activity-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		background-color: #5ce0c6;
		color: white;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.activity-content {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.activity-text {
		font-size: 0.875rem;
		color: #1f2937;
		margin-bottom: 0.25rem;
	}

	.activity-date {
		font-size: 0.75rem;
		color: #9ca3af;
	}

	.no-user {
		text-align: center;
		padding: 3rem;
		color: #6b7280;
	}

	@media (max-width: 768px) {
		.profile-header {
			flex-direction: column;
			align-items: center;
			text-align: center;
		}

		.profile-stats {
			grid-template-columns: 1fr;
		}

		.details-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
