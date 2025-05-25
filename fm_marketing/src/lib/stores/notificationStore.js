// src/lib/stores/notificationStore.js
import { writable, derived } from 'svelte/store';
import { apiClient } from '$lib/utils/api.js';

function createNotificationStore() {
	const { subscribe, update } = writable({
		notifications: [],
		unreadCount: 0,
		settings: {
			email: true,
			push: false,
			inApp: true,
			experienceReminders: true,
			applicationResults: true,
			communityReplies: true,
			systemNotices: true
		}
	});

	const store = {
		subscribe,

		// 초기 알림 로드
		initialize: async () => {
			try {
				const response = await apiClient.get('/notifications');
				update(state => ({
					...state,
					notifications: response.data.notifications || [],
					unreadCount: response.data.unreadCount || 0
				}));
			} catch (error) {
				console.error('알림 초기화 오류:', error);
			}
		},

		// 알림 목록 새로고침
		fetchNotifications: async (isRead = null) => {
			try {
				const params = {};
				if (isRead !== null) {
					params.read = isRead;
				}

				const response = await apiClient.get('/notifications', params);
				update(state => ({
					...state,
					notifications: response.data.notifications || [],
					unreadCount: response.data.unreadCount || 0
				}));
			} catch (error) {
				console.error('알림 목록 조회 오류:', error);
			}
		},

		// 새 알림 추가 (시스템에서 호출)
		addNotification: (notification) => {
			update(state => {
				const newNotification = {
					id: `notif-${Date.now()}`,
					timestamp: new Date().toISOString(),
					isRead: false,
					priority: 'medium',
					...notification
				};

				return {
					...state,
					notifications: [newNotification, ...state.notifications],
					unreadCount: state.unreadCount + 1
				};
			});
		},

		// 알림 읽음 처리
		markAsRead: async (notificationId) => {
			try {
				await apiClient.patch(`/notifications/${notificationId}`, { isRead: true });
				
				update(state => {
					const notifications = state.notifications.map(notification => 
						notification.id === notificationId 
							? { ...notification, isRead: true }
							: notification
					);
					
					const unreadCount = notifications.filter(n => !n.isRead).length;

					return {
						...state,
						notifications,
						unreadCount
					};
				});
			} catch (error) {
				console.error('알림 읽음 처리 오류:', error);
			}
		},

		// 모든 알림 읽음 처리
		markAllAsRead: async () => {
			try {
				await apiClient.post('/notifications/mark-all-read');
				
				update(state => ({
					...state,
					notifications: state.notifications.map(n => ({ ...n, isRead: true })),
					unreadCount: 0
				}));
			} catch (error) {
				console.error('모든 알림 읽음 처리 오류:', error);
			}
		},

		// 알림 삭제
		removeNotification: async (notificationId) => {
			try {
				await apiClient.delete(`/notifications/${notificationId}`);
				
				update(state => {
					const notifications = state.notifications.filter(n => n.id !== notificationId);
					const unreadCount = notifications.filter(n => !n.isRead).length;

					return {
						...state,
						notifications,
						unreadCount
					};
				});
			} catch (error) {
				console.error('알림 삭제 오류:', error);
			}
		},

		// 모든 알림 삭제
		clearAll: async () => {
			try {
				// 각 알림을 개별 삭제 (일괄 삭제 API 구현 시 변경)
				const currentState = await new Promise(resolve => {
					const unsubscribe = subscribe(state => {
						resolve(state);
						unsubscribe();
					});
				});

				for (const notification of currentState.notifications) {
					await apiClient.delete(`/notifications/${notification.id}`);
				}

				update(state => ({
					...state,
					notifications: [],
					unreadCount: 0
				}));
			} catch (error) {
				console.error('모든 알림 삭제 오류:', error);
			}
		},

		// 알림 설정 업데이트 (로컬 저장)
		updateSettings: (newSettings) => {
			update(state => ({
				...state,
				settings: { ...state.settings, ...newSettings }
			}));
		},

		// 실시간 알림 시뮬레이션 (개발용)
		simulateRealTimeNotification: () => {
			const notifications = [
				{
					type: 'application_result',
					title: '체험단 선정',
					message: '새로운 체험단에 선정되셨습니다!',
					priority: 'high',
					icon: 'check-circle',
					category: 'application'
				},
				{
					type: 'new_experience',
					title: '신규 체험단',
					message: '관심 카테고리에 새로운 체험단이 등록되었습니다.',
					priority: 'medium',
					icon: 'plus-circle',
					category: 'experience'
				},
				{
					type: 'point_earned',
					title: '포인트 적립',
					message: '일일 출석으로 100P가 적립되었습니다.',
					priority: 'low',
					icon: 'star',
					category: 'point'
				}
			];

			const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
			return store.addNotification(randomNotification);
		}
	};

	return store;
}

export const notificationStore = createNotificationStore();

// 읽지 않은 알림 수만 별도로 구독할 수 있는 derived store
export const unreadCount = derived(
	notificationStore,
	$notificationStore => $notificationStore.unreadCount
);

// 알림 타입별 아이콘 매핑
export const notificationIcons = {
	'application_received': `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
		<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
		<polyline points="22 4 12 14.01 9 11.01"></polyline>
	</svg>`,
	'application_result': `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
		<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
		<polyline points="22 4 12 14.01 9 11.01"></polyline>
	</svg>`,
	'new_experience': `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
		<circle cx="12" cy="12" r="10"></circle>
		<line x1="12" y1="8" x2="12" y2="16"></line>
		<line x1="8" y1="12" x2="16" y2="12"></line>
	</svg>`,
	'point_earned': `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
		<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
	</svg>`,
	'withdrawal_request': `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
		<line x1="12" y1="1" x2="12" y2="23"></line>
		<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
	</svg>`,
	'welcome': `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
		<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
		<circle cx="12" cy="7" r="4"></circle>
	</svg>`,
	'system': `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
		<circle cx="12" cy="12" r="3"></circle>
		<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
	</svg>`,
	'test': `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
		<path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
	</svg>`,
	'check-circle': `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
		<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
		<polyline points="22 4 12 14.01 9 11.01"></polyline>
	</svg>`,
	'clock': `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
		<circle cx="12" cy="12" r="10"></circle>
		<polyline points="12 6 12 12 16 14"></polyline>
	</svg>`,
	'message-circle': `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
		<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
	</svg>`,
	'star': `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
		<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
	</svg>`,
	'info': `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
		<circle cx="12" cy="12" r="10"></circle>
		<line x1="12" y1="16" x2="12" y2="12"></line>
		<line x1="12" y1="8" x2="12.01" y2="8"></line>
	</svg>`,
	'plus-circle': `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
		<circle cx="12" cy="12" r="10"></circle>
		<line x1="12" y1="8" x2="12" y2="16"></line>
		<line x1="8" y1="12" x2="16" y2="12"></line>
	</svg>`
};
