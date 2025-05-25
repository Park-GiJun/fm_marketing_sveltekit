<!-- src/routes/notifications/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { notificationStore } from '$lib/stores/notificationStore.js';
  import { userStore } from '$lib/stores/userStore.js';
  import { goto } from '$app/navigation';
  import MainLayout from '$lib/components/layout/MainLayout.svelte';
  import NotificationSettings from '$lib/components/common/NotificationSettings.svelte';
  import Button from '$lib/components/common/Button.svelte';
  import Badge from '$lib/components/common/Badge.svelte';
  import { notificationIcons } from '$lib/stores/notificationStore.js';
  
  let isAuthenticated = false;
  let notifications = [];
  let selectedTab = 'all'; // all, unread, read
  let loading = true;
  let showSettings = false;
  
  // 탭 옵션
  const tabs = [
    { id: 'all', label: '전체', count: 0 },
    { id: 'unread', label: '읽지 않음', count: 0 },
    { id: 'read', label: '읽음', count: 0 }
  ];
  
  // 필터된 알림 목록
  $: filteredNotifications = notifications.filter(notification => {
    if (selectedTab === 'unread') return !notification.isRead;
    if (selectedTab === 'read') return notification.isRead;
    return true;
  });
  
  // 탭별 카운트 업데이트
  $: {
    tabs[0].count = notifications.length;
    tabs[1].count = notifications.filter(n => !n.isRead).length;
    tabs[2].count = notifications.filter(n => n.isRead).length;
  }
  
  // 상대시간 포맷팅
  function getRelativeTime(timestamp) {
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
  
  // 타입별 배지 색상
  function getTypeBadgeType(type) {
    switch (type) {
      case 'application_received':
      case 'application_result': return 'success';
      case 'new_experience': return 'warning';
      case 'point_earned': return 'secondary';
      case 'system':
      case 'welcome': return 'default';
      default: return 'default';
    }
  }
  
  // 알림 클릭 처리
  function handleNotificationClick(notification) {
    if (!notification.isRead) {
      notificationStore.markAsRead(notification.id);
    }

    if (notification.actionUrl) {
      goto(notification.actionUrl);
    }
  }
  
  // 알림 삭제
  function deleteNotification(notificationId, event) {
    event.stopPropagation();
    notificationStore.removeNotification(notificationId);
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
  
  // 테스트 알림 추가
  function addTestNotification() {
    notificationStore.addNotification({
      type: 'test',
      title: '테스트 알림',
      message: '이것은 테스트 알림입니다.',
      priority: 'medium'
    });
  }
  
  onMount(() => {
    const unsubscribeUser = userStore.subscribe(state => {
      isAuthenticated = state.isAuthenticated;
      
      if (!isAuthenticated) {
        goto('/login?redirect=/notifications');
      }
    });
    
    const unsubscribeNotifications = notificationStore.subscribe(state => {
      notifications = state.notifications;
      loading = false;
    });
    
    // 알림 초기화
    notificationStore.initialize();
    
    return () => {
      unsubscribeUser();
      unsubscribeNotifications();
    };
  });
</script>

<svelte:head>
  <title>알림 - FM마케팅</title>
  <meta name="description" content="알림을 확인하고 설정을 관리하세요." />
</svelte:head>

<MainLayout>
  <div class="notifications-page-container">
    <div class="page-header">
      <h1 class="page-title">알림</h1>
      <div class="header-actions">
        <Button 
          variant="outline" 
          size="md" 
          on:click={addTestNotification}
        >
          테스트 알림
        </Button>
        <Button 
          variant="outline" 
          size="md" 
          on:click={() => showSettings = !showSettings}
        >
          설정
        </Button>
      </div>
    </div>
    
    {#if showSettings}
      <div class="settings-section">
        <NotificationSettings />
      </div>
    {:else}
      <div class="notifications-content">
        <!-- 탭 네비게이션 -->
        <div class="tab-navigation">
          {#each tabs as tab}
            <button 
              class="tab-button {selectedTab === tab.id ? 'active' : ''}"
              on:click={() => selectedTab = tab.id}
            >
              {tab.label}
              {#if tab.count > 0}
                <Badge type="primary" size="sm">{tab.count}</Badge>
              {/if}
            </button>
          {/each}
          
          <div class="tab-actions">
            {#if notifications.filter(n => !n.isRead).length > 0}
              <button class="action-button" on:click={markAllAsRead}>
                모두 읽음
              </button>
            {/if}
            
            {#if notifications.length > 0}
              <button class="action-button danger" on:click={clearAll}>
                전체 삭제
              </button>
            {/if}
          </div>
        </div>
        
        <!-- 알림 목록 -->
        <div class="notifications-list">
          {#if loading}
            <div class="loading-state">
              <div class="spinner"></div>
              <p>알림을 불러오는 중입니다...</p>
            </div>
          {:else if filteredNotifications.length === 0}
            <div class="empty-state">
              <div class="empty-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </div>
              <h3 class="empty-title">
                {selectedTab === 'unread' ? '읽지 않은 알림이 없습니다' : 
                 selectedTab === 'read' ? '읽은 알림이 없습니다' : 
                 '알림이 없습니다'}
              </h3>
              <p class="empty-description">
                새로운 체험단이나 활동이 있을 때 알림을 받을 수 있습니다.
              </p>
            </div>
          {:else}
            {#each filteredNotifications as notification (notification.id)}
              <div 
                class="notification-item {notification.isRead ? 'read' : 'unread'}"
                on:click={() => handleNotificationClick(notification)}
              >
                <div class="notification-icon {getPriorityColor(notification.priority)}">
                  {@html notificationIcons[notification.type] || notificationIcons['info']}
                </div>
                
                <div class="notification-content">
                  <div class="notification-header">
                    <h3 class="notification-title">{notification.title}</h3>
                    <div class="notification-meta">
                      <Badge type={getTypeBadgeType(notification.type)} size="sm">
                        {notification.type}
                      </Badge>
                      <span class="notification-time">{getRelativeTime(notification.createdAt || notification.timestamp)}</span>
                    </div>
                  </div>
                  
                  <p class="notification-message">{notification.message}</p>
                  
                  {#if notification.priority === 'high'}
                    <div class="priority-indicator">
                      <Badge type="danger" size="sm">긴급</Badge>
                    </div>
                  {/if}
                </div>
                
                <div class="notification-actions">
                  {#if !notification.isRead}
                    <div class="unread-indicator"></div>
                  {/if}
                  
                  <button 
                    class="delete-button"
                    on:click={(e) => deleteNotification(notification.id, e)}
                    aria-label="알림 삭제"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
            {/each}
          {/if}
        </div>
      </div>
    {/if}
  </div>
</MainLayout>

<style>
  .notifications-page-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
  }
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .page-title {
    font-size: 1.875rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
  }
  
  .header-actions {
    display: flex;
    gap: 0.75rem;
  }
  
  .settings-section {
    margin-bottom: 2rem;
  }
  
  .notifications-content {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .tab-navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    background-color: #f9fafb;
  }
  
  .tab-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
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
    background-color: #e5e7eb;
    color: #4b5563;
  }
  
  .tab-button.active {
    background-color: #5ce0c6;
    color: white;
  }
  
  .tab-actions {
    display: flex;
    gap: 0.75rem;
  }
  
  .action-button {
    font-size: 0.75rem;
    font-weight: 500;
    color: #6b7280;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.375rem 0.75rem;
    border-radius: 0.25rem;
    transition: all 0.2s;
  }
  
  .action-button:hover {
    background-color: #e5e7eb;
    color: #4b5563;
  }
  
  .action-button.danger {
    color: #dc2626;
  }
  
  .action-button.danger:hover {
    background-color: #fee2e2;
  }
  
  .notifications-list {
    max-height: 600px;
    overflow-y: auto;
  }
  
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    gap: 1rem;
  }
  
  .spinner {
    width: 2rem;
    height: 2rem;
    border: 2px solid #e5e7eb;
    border-top: 2px solid #5ce0c6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;
  }
  
  .empty-icon {
    color: #d1d5db;
    margin-bottom: 1.5rem;
  }
  
  .empty-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
  }
  
  .empty-description {
    color: #6b7280;
    font-size: 0.875rem;
    margin: 0;
  }
  
  .notification-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.5rem;
    border-bottom: 1px solid #f3f4f6;
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
    margin-top: 0.25rem;
  }
  
  .notification-content {
    flex: 1;
    min-width: 0;
  }
  
  .notification-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.5rem;
    gap: 1rem;
  }
  
  .notification-title {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
    line-height: 1.4;
  }
  
  .notification-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
  }
  
  .notification-time {
    font-size: 0.75rem;
    color: #9ca3af;
    white-space: nowrap;
  }
  
  .notification-message {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
    line-height: 1.5;
  }
  
  .priority-indicator {
    margin-top: 0.5rem;
  }
  
  .notification-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }
  
  .unread-indicator {
    width: 0.5rem;
    height: 0.5rem;
    background-color: #3b82f6;
    border-radius: 50%;
  }
  
  .delete-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background-color: transparent;
    border: none;
    border-radius: 0.25rem;
    color: #9ca3af;
    cursor: pointer;
    transition: all 0.2s;
    opacity: 0;
  }
  
  .notification-item:hover .delete-button {
    opacity: 1;
  }
  
  .delete-button:hover {
    background-color: #fee2e2;
    color: #dc2626;
  }
  
  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }
    
    .tab-navigation {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }
    
    .notification-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
    
    .notification-meta {
      gap: 0.5rem;
    }
  }
</style>
