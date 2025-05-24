// src/lib/stores/notificationStore.js
import { writable, derived } from 'svelte/store';

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

	// 더미 알림 데이터
	const dummyNotifications = [
		{
			id: 'notif-1',
			type: 'application_result',
			title: '체험단 선정 결과',
			message: '서울 맛집 체험단에 선정되셨습니다! 축하드립니다.',
			timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30분 전
			read: false,
			actionUrl: '/checklist/dummy-1',
			priority: 'high',
			icon: 'check-circle',
			category: 'application'
		},
		{
			id: 'notif-2',
			type: 'experience_reminder',
			title: '체험 기간 알림',
			message: '뷰티 제품 체험단 활동 마감이 3일 남았습니다.',
			timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2시간 전
			read: false,
			actionUrl: '/checklist/dummy-2',
			priority: 'medium',
			icon: 'clock',
			category: 'reminder'
		},
		{
			id: 'notif-3',
			type: 'community_reply',
			title: '댓글 알림',
			message: '작성하신 게시글에 새로운 댓글이 달렸습니다.',
			timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4시간 전
			read: true,
			actionUrl: '/community/1',
			priority: 'low',
			icon: 'message-circle',
			category: 'community'
		},
		{
			id: 'notif-4',
			type: 'point_earned',
			title: '포인트 적립',
			message: '체험단 활동 완료로 5,000P가 적립되었습니다.',
			timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6시간 전
			read: true,
			actionUrl: '/mypage',
			priority: 'medium',
			icon: 'star',
			category: 'point'
		},
		{
			id: 'notif-5',
			type: 'system_notice',
			title: '시스템 공지',
			message: '서비스 점검이 완료되었습니다.',
			timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1일 전
			read: true,
			actionUrl: '/event',
			priority: 'low',
			icon: 'info',
			category: 'system'
		}
	];

	const store = {
		subscribe,

		// 초기 알림 로드
		initialize: () => {
			update(state => ({
				...state,
				notifications: dummyNotifications,
				unreadCount: dummyNotifications.filter(n => !n.read).length
			}));
		},

		// 새 알림 추가
		addNotification: (notification) => {
			const newNotification = {
				id: `notif-${Date.now()}`,
				timestamp: new Date().toISOString(),
				read: false,
				priority: 'medium',
				...notification
			};

			update(state => ({
				...state,
				notifications: [newNotification, ...state.notifications],
				unreadCount: state.unreadCount + 1
			}));

			return newNotification.id;
		},

		// 알림 읽음 처리
		markAsRead: (notificationId) => {
			update(state => {
				const notifications = state.notifications.map(notification => 
					notification.id === notificationId 
						? { ...notification, read: true }
						: notification
				);
				
				const unreadCount = notifications.filter(n => !n.read).length;

				return {
					...state,
					notifications,
					unreadCount
				};
			});
		},

		// 모든 알림 읽음 처리
		markAllAsRead: () => {
			update(state => ({
				...state,
				notifications: state.notifications.map(n => ({ ...n, read: true })),
				unreadCount: 0
			}));
		},

		// 알림 삭제
		removeNotification: (notificationId) => {
			update(state => {
				const notifications = state.notifications.filter(n => n.id !== notificationId);
				const unreadCount = notifications.filter(n => !n.read).length;

				return {
					...state,
					notifications,
					unreadCount
				};
			});
		},

		// 모든 알림 삭제
		clearAll: () => {
			update(state => ({
				...state,
				notifications: [],
				unreadCount: 0
			}));
		},

		// 알림 설정 업데이트
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
