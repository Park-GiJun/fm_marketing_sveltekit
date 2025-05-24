<!-- src/lib/components/common/NotificationSettings.svelte -->
<script>
	import { onMount } from 'svelte';
	import { notificationStore } from '$lib/stores/notificationStore.js';
	import Button from './Button.svelte';
	import { toast } from '$lib/stores/toastStore.js';

	let settings = {
		email: true,
		push: true,
		inApp: true,
		experienceReminders: true,
		applicationResults: true,
		communityReplies: true,
		systemNotices: true
	};

	let pushPermission = 'default'; // 'default', 'granted', 'denied'
	let loading = false;

	// 설정 옵션 정의
	const settingOptions = [
		{
			key: 'email',
			title: '이메일 알림',
			description: '중요한 알림을 이메일로 받습니다.',
			category: 'delivery'
		},
		{
			key: 'push',
			title: '푸시 알림',
			description: '브라우저 푸시 알림을 받습니다.',
			category: 'delivery'
		},
		{
			key: 'inApp',
			title: '앱 내 알림',
			description: '사이트 내에서 알림을 표시합니다.',
			category: 'delivery'
		},
		{
			key: 'applicationResults',
			title: '체험단 선정 결과',
			description: '체험단 신청 결과를 알려드립니다.',
			category: 'content'
		},
		{
			key: 'experienceReminders',
			title: '체험 기간 알림',
			description: '체험 마감일이 다가오면 알려드립니다.',
			category: 'content'
		},
		{
			key: 'communityReplies',
			title: '커뮤니티 댓글',
			description: '내 게시글에 댓글이 달리면 알려드립니다.',
			category: 'content'
		},
		{
			key: 'systemNotices',
			title: '시스템 공지',
			description: '시스템 점검, 업데이트 등을 알려드립니다.',
			category: 'content'
		}
	];

	// 카테고리별 분류
	$: deliverySettings = settingOptions.filter(option => option.category === 'delivery');
	$: contentSettings = settingOptions.filter(option => option.category === 'content');

	// 스토어에서 설정 로드
	onMount(() => {
		const unsubscribe = notificationStore.subscribe(state => {
			settings = { ...state.settings };
		});

		// 푸시 알림 권한 상태 확인
		if ('Notification' in window) {
			pushPermission = Notification.permission;
		}

		return () => {
			unsubscribe();
		};
	});

	// 설정 변경 핸들러
	function handleSettingChange(key, value) {
		settings[key] = value;
		
		// 푸시 알림이 활성화되었는데 권한이 없는 경우
		if (key === 'push' && value && pushPermission !== 'granted') {
			requestPushPermission();
		}
	}

	// 푸시 알림 권한 요청
	async function requestPushPermission() {
		if ('Notification' in window) {
			loading = true;
			
			try {
				const permission = await notificationStore.requestPermission();
				pushPermission = Notification.permission;
				
				if (permission) {
					toast.success('푸시 알림 권한이 허용되었습니다.');
				} else {
					toast.warning('푸시 알림 권한이 거부되었습니다. 브라우저 설정에서 변경할 수 있습니다.');
					settings.push = false;
				}
			} catch (error) {
				toast.error('푸시 알림 권한 요청 중 오류가 발생했습니다.');
				settings.push = false;
			} finally {
				loading = false;
			}
		}
	}

	// 설정 저장
	async function saveSettings() {
		loading = true;
		
		try {
			await notificationStore.updateSettings(settings);
			toast.success('알림 설정이 저장되었습니다.');
		} catch (error) {
			toast.error('설정 저장 중 오류가 발생했습니다.');
		} finally {
			loading = false;
		}
	}

	// 테스트 알림 보내기
	function sendTestNotification() {
		notificationStore.addNotification({
			type: 'test',
			title: '테스트 알림',
			message: '알림 설정이 정상적으로 작동합니다!',
			priority: 'medium',
			icon: 'info',
			category: 'system'
		});
		
		toast.success('테스트 알림을 보냈습니다.');
	}
</script>

<div class="notification-settings">
	<div class="settings-header">
		<h2 class="settings-title">알림 설정</h2>
		<p class="settings-description">원하는 알림 방식과 종류를 설정하세요.</p>
	</div>

	<div class="settings-content">
		<!-- 알림 전달 방식 -->
		<div class="settings-section">
			<h3 class="section-title">알림 전달 방식</h3>
			<div class="settings-grid">
				{#each deliverySettings as option}
					<div class="setting-item">
						<div class="setting-info">
							<h4 class="setting-title">{option.title}</h4>
							<p class="setting-description">{option.description}</p>
							
							{#if option.key === 'push' && pushPermission === 'denied'}
								<span class="permission-warning">
									브라우저에서 알림이 차단되었습니다. 설정에서 허용해주세요.
								</span>
							{/if}
						</div>
						
						<div class="setting-control">
							<label class="toggle-switch">
								<input 
									type="checkbox" 
									bind:checked={settings[option.key]}
									on:change={(e) => handleSettingChange(option.key, e.target.checked)}
									disabled={option.key === 'push' && pushPermission === 'denied'}
								/>
								<span class="toggle-slider"></span>
							</label>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- 알림 내용 -->
		<div class="settings-section">
			<h3 class="section-title">알림 내용</h3>
			<div class="settings-grid">
				{#each contentSettings as option}
					<div class="setting-item">
						<div class="setting-info">
							<h4 class="setting-title">{option.title}</h4>
							<p class="setting-description">{option.description}</p>
						</div>
						
						<div class="setting-control">
							<label class="toggle-switch">
								<input 
									type="checkbox" 
									bind:checked={settings[option.key]}
									on:change={(e) => handleSettingChange(option.key, e.target.checked)}
								/>
								<span class="toggle-slider"></span>
							</label>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- 테스트 및 저장 -->
		<div class="settings-actions">
			<div class="test-section">
				<Button 
					variant="outline" 
					size="md" 
					on:click={sendTestNotification}
				>
					테스트 알림 보내기
				</Button>
				<span class="test-description">설정된 알림이 정상 작동하는지 확인합니다.</span>
			</div>
			
			<Button 
				variant="primary" 
				size="lg" 
				disabled={loading}
				on:click={saveSettings}
			>
				{loading ? '저장 중...' : '설정 저장'}
			</Button>
		</div>
	</div>
</div>

<style>
	.notification-settings {
		background-color: white;
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}

	.settings-header {
		padding: 1.5rem 2rem;
		border-bottom: 1px solid #e5e7eb;
		background-color: #f9fafb;
	}

	.settings-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
		margin: 0 0 0.5rem 0;
	}

	.settings-description {
		font-size: 0.875rem;
		color: #6b7280;
		margin: 0;
	}

	.settings-content {
		padding: 2rem;
	}

	.settings-section {
		margin-bottom: 2rem;
	}

	.settings-section:last-child {
		margin-bottom: 0;
	}

	.section-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: #1f2937;
		margin: 0 0 1.5rem 0;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.settings-grid {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.setting-item {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 1.25rem;
		background-color: #f9fafb;
		border-radius: 0.375rem;
		border: 1px solid #e5e7eb;
	}

	.setting-info {
		flex: 1;
		margin-right: 1rem;
	}

	.setting-title {
		font-size: 1rem;
		font-weight: 500;
		color: #1f2937;
		margin: 0 0 0.25rem 0;
	}

	.setting-description {
		font-size: 0.875rem;
		color: #6b7280;
		margin: 0;
		line-height: 1.4;
	}

	.permission-warning {
		display: block;
		font-size: 0.75rem;
		color: #dc2626;
		margin-top: 0.25rem;
	}

	.setting-control {
		flex-shrink: 0;
	}

	.toggle-switch {
		position: relative;
		display: inline-block;
		width: 3rem;
		height: 1.5rem;
		cursor: pointer;
	}

	.toggle-switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.toggle-slider {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #d1d5db;
		border-radius: 1.5rem;
		transition: background-color 0.2s;
	}

	.toggle-slider:before {
		position: absolute;
		content: "";
		height: 1.25rem;
		width: 1.25rem;
		left: 0.125rem;
		bottom: 0.125rem;
		background-color: white;
		border-radius: 50%;
		transition: transform 0.2s;
	}

	.toggle-switch input:checked + .toggle-slider {
		background-color: #5ce0c6;
	}

	.toggle-switch input:checked + .toggle-slider:before {
		transform: translateX(1.5rem);
	}

	.toggle-switch input:disabled + .toggle-slider {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.settings-actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 2rem;
		padding-top: 2rem;
		border-top: 1px solid #e5e7eb;
	}

	.test-section {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.test-description {
		font-size: 0.875rem;
		color: #6b7280;
	}

	@media (max-width: 768px) {
		.settings-header {
			padding: 1rem 1.5rem;
		}

		.settings-content {
			padding: 1.5rem;
		}

		.setting-item {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}

		.setting-info {
			margin-right: 0;
		}

		.settings-actions {
			flex-direction: column;
			gap: 1rem;
			align-items: stretch;
		}

		.test-section {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}
	}
</style>
