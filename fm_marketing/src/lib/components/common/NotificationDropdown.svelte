<!-- src/lib/components/common/NotificationDropdown.svelte -->
<script>
	import { onMount } from 'svelte';
	import { notificationStore, notificationIcons } from '$lib/stores/notificationStore.js';
	import Badge from './Badge.svelte';
	import Button from './Button.svelte';

	export let position = 'bottom-right'; // bottom-right, bottom-left

	let isOpen = false;
	let dropdownElement;
	let notifications = [];
	let unreadCount = 0;

	// 스토어 구독
	$: notifications = $notificationStore.notifications;
	$: unreadCount = $notificationStore.unreadCount;

	// 드롭다운 토글
	function toggleDropdown() {
		isOpen = !isOpen;
	}

	// 외부 클릭으로 닫기
	function handleClickOutside(event) {
		if (dropdownElement && !dropdownElement.contains(event.target)) {
			isOpen = false;
		}
	}

	// 알림 클릭 처리
	function handleNotificationClick(notification) {
		if (!notification.read) {
			notificationStore.markAsRead(notification.id);
		}

		if (notification.actionUrl) {
			window.location.href = notification.actionUrl;
		}

		isOpen = false;
	}

	// 모두 읽음 처리
	function markAllAsRead() {
		notificationStore.markAllAsRead();
	}

	// 전체 삭제
	function clearAll() {
		if (confirm('모든 알림을 삭제하시겠습니까?')) {
			notificationStore.clearAll();
		}
	}

	// 상대시간 포맷팅 (로컬 함수)
	function formatRelativeTime(timestamp) {
		const date = new Date(timestamp);
		const now = new Date();
		const diffMs = now - date;
		const diffMins = Math.floor(diffMs / (60 * 1000));
		const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
		const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

		if (diffMins < 1) return '방금 전';
		if (diffMins < 60) return `${diffMins}분 전`;
		if (diffHours < 24) return `${diffHours}시간 전`;
		if (diffDays < 7) return `${diffDays}일 전`;
		
		return date.toLocaleDateString();
	}

	// 우선순위별 색상
	function getPriorityColor(priority) {
		switch (priority) {
			case 'high': return 'text-red-600';
			case 'medium': return 'text-yellow-600';
			case 'low': return 'text-gray-600';
			default: return 'text-gray-600';
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		
		// 알림 초기화
		notificationStore.initialize();

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<div class="notification-dropdown" bind:this={dropdownElement}>
	<button 
		class="notification-trigger"
		on:click={toggleDropdown}
		aria-label="알림"
		aria-expanded={isOpen}
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
			<path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
		</svg>
		
		{#if unreadCount > 0}
			<div class="notification-badge">
				<Badge type="warning" size="sm">
					{unreadCount > 99 ? '99+' : unreadCount}
				</Badge>
			</div>
		{/if}
	</button>

	{#if isOpen}
		<div class="notification-dropdown-menu {position}">
			<div class="notification-header">
				<h3 class="notification-title">알림</h3>
				
				<div class="notification-actions">
					{#if unreadCount > 0}
						<button class="action-button" on:click={markAllAsRead}>
							모두 읽음
						</button>
					{/if}
					
					{#if notifications.length > 0}
						<button class="action-button" on:click={clearAll}>
							전체 삭제
						</button>
					{/if}
				</div>
			</div>

			<div class="notification-list">
				{#if notifications.length === 0}
					<div class="empty-notifications">
						<div class="empty-icon">
							<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
								<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
								<path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
							</svg>
						</div>
						<p class="empty-text">새로운 알림이 없습니다</p>
					</div>
				{:else}
					{#each notifications.slice(0, 10) as notification (notification.id)}
						<button 
							class="notification-item {notification.read ? 'read' : 'unread'}"
							on:click={() => handleNotificationClick(notification)}
						>
							<div class="notification-icon {getPriorityColor(notification.priority)}">
								{@html notificationIcons[notification.icon] || notificationIcons['info']}
							</div>
							
							<div class="notification-content">
								<h4 class="notification-item-title">{notification.title}</h4>
								<p class="notification-message">{notification.message}</p>
								<span class="notification-time">{formatRelativeTime(notification.timestamp)}</span>
							</div>
							
							{#if !notification.read}
								<div class="unread-indicator"></div>
							{/if}
						</button>
					{/each}
					
					{#if notifications.length > 10}
						<div class="show-more">
							<a href="/notifications" class="show-more-link">
								모든 알림 보기 ({notifications.length}개)
							</a>
						</div>
					{/if}
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.notification-dropdown {
		position: relative;
	}

	.notification-trigger {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		background-color: transparent;
		border: none;
		border-radius: 0.375rem;
		color: #6b7280;
		cursor: pointer;
		transition: all 0.2s;
	}

	.notification-trigger:hover {
		background-color: #f3f4f6;
		color: #4b5563;
	}

	.notification-badge {
		position: absolute;
		top: -0.25rem;
		right: -0.25rem;
	}

	.notification-dropdown-menu {
		position: absolute;
		z-index: 50;
		margin-top: 0.5rem;
		width: 384px;
		background-color: white;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
		max-height: 500px;
		overflow: hidden;
	}

	.notification-dropdown-menu.bottom-right {
		right: 0;
	}

	.notification-dropdown-menu.bottom-left {
		left: 0;
	}

	.notification-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		border-bottom: 1px solid #e5e7eb;
		background-color: #f9fafb;
	}

	.notification-title {
		font-size: 1rem;
		font-weight: 600;
		color: #1f2937;
		margin: 0;
	}

	.notification-actions {
		display: flex;
		gap: 0.5rem;
	}

	.action-button {
		font-size: 0.75rem;
		color: #6b7280;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		transition: all 0.2s;
	}

	.action-button:hover {
		background-color: #e5e7eb;
		color: #4b5563;
	}

	.notification-list {
		max-height: 400px;
		overflow-y: auto;
	}

	.empty-notifications {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 1rem;
		text-align: center;
	}

	.empty-icon {
		color: #d1d5db;
		margin-bottom: 1rem;
	}

	.empty-text {
		color: #9ca3af;
		font-size: 0.875rem;
		margin: 0;
	}

	.notification-item {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		width: 100%;
		padding: 1rem;
		background-color: transparent;
		border: none;
		border-bottom: 1px solid #f3f4f6;
		text-align: left;
		cursor: pointer;
		transition: background-color 0.2s;
		position: relative;
	}

	.notification-item:hover {
		background-color: #f9fafb;
	}

	.notification-item.unread {
		background-color: #f0f9ff;
	}

	.notification-item.unread:hover {
		background-color: #e0f2fe;
	}

	.notification-icon {
		flex-shrink: 0;
		margin-top: 0.125rem;
	}

	.notification-content {
		flex: 1;
		min-width: 0;
	}

	.notification-item-title {
		font-size: 0.875rem;
		font-weight: 500;
		color: #1f2937;
		margin: 0 0 0.25rem 0;
		line-height: 1.4;
	}

	.notification-message {
		font-size: 0.75rem;
		color: #6b7280;
		margin: 0 0 0.25rem 0;
		line-height: 1.4;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.notification-time {
		font-size: 0.75rem;
		color: #9ca3af;
	}

	.unread-indicator {
		width: 0.5rem;
		height: 0.5rem;
		background-color: #3b82f6;
		border-radius: 50%;
		flex-shrink: 0;
		margin-top: 0.375rem;
	}

	.show-more {
		padding: 1rem;
		text-align: center;
		border-top: 1px solid #e5e7eb;
		background-color: #f9fafb;
	}

	.show-more-link {
		font-size: 0.875rem;
		color: #5ce0c6;
		text-decoration: none;
		font-weight: 500;
	}

	.show-more-link:hover {
		text-decoration: underline;
	}

	@media (max-width: 640px) {
		.notification-dropdown-menu {
			width: 320px;
			right: -2rem !important;
		}
	}
</style>
