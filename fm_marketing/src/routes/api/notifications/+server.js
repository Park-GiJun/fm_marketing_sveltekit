// 알림 목록 조회/생성 API
import { json } from '@sveltejs/kit';
import { getDataSource } from '$lib/server/data-source.js';
import { Notification, NotificationPriority } from '$lib/server/entities/Notification.js';
import { User, UserRole } from '$lib/server/entities/User.js';
import { getUserFromRequest } from '$lib/server/auth.js';

export async function GET({ url, request }) {
	try {
		const user = await getUserFromRequest(request);

		if (!user) {
			return json({ error: '인증이 필요합니다.' }, { status: 401 });
		}

		const isRead = url.searchParams.get('read');
		const page = parseInt(url.searchParams.get('page') || '1');
		const limit = parseInt(url.searchParams.get('limit') || '20');
		const offset = (page - 1) * limit;

		const dataSource = await getDataSource();
		const notificationRepository = dataSource.getRepository(Notification);

		// 쿼리 빌더 생성
		let queryBuilder = notificationRepository
			.createQueryBuilder('notification')
			.where('notification.userId = :userId', { userId: user.id });

		// 읽음 상태 필터
		if (isRead === 'true') {
			queryBuilder.andWhere('notification.isRead = :isRead', { isRead: true });
		} else if (isRead === 'false') {
			queryBuilder.andWhere('notification.isRead = :isRead', { isRead: false });
		}

		// 정렬 및 페이징
		queryBuilder
			.orderBy('notification.createdAt', 'DESC')
			.offset(offset)
			.limit(limit);

		const [notifications, total] = await queryBuilder.getManyAndCount();

		// 읽지 않은 알림 수
		const unreadCount = await notificationRepository.count({
			where: { userId: user.id, isRead: false }
		});

		return json({
			notifications,
			unreadCount,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit)
			}
		});

	} catch (error) {
		console.error('알림 목록 조회 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}

export async function POST({ request }) {
	try {
		const user = await getUserFromRequest(request);

		if (!user || user.role !== UserRole.ADMIN) {
			return json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
		}

		const { userId, type, title, message, actionUrl, priority } = await request.json();

		if (!userId || !type || !title || !message) {
			return json({ error: '필수 정보를 모두 입력해주세요.' }, { status: 400 });
		}

		const dataSource = await getDataSource();
		const notificationRepository = dataSource.getRepository(Notification);
		const userRepository = dataSource.getRepository(User);

		// 대상 사용자 확인
		if (userId !== 'all') {
			const targetUser = await userRepository.findOne({
				where: { id: parseInt(userId), isActive: true }
			});

			if (!targetUser) {
				return json({ error: '대상 사용자를 찾을 수 없습니다.' }, { status: 404 });
			}
		}

		// 전체 사용자에게 알림 (userId가 'all'인 경우)
		if (userId === 'all') {
			const activeUsers = await userRepository.find({
				where: { isActive: true },
				select: ['id']
			});

			const notifications = activeUsers.map(u => 
				notificationRepository.create({
					userId: u.id,
					type,
					title,
					message,
					actionUrl,
					priority: priority || NotificationPriority.MEDIUM
				})
			);

			await notificationRepository.save(notifications);

			return json({ 
				message: `${activeUsers.length}명의 사용자에게 알림을 발송했습니다.`,
				count: activeUsers.length
			}, { status: 201 });
		}

		// 특정 사용자에게 알림
		const notification = notificationRepository.create({
			userId: parseInt(userId),
			type,
			title,
			message,
			actionUrl,
			priority: priority || NotificationPriority.MEDIUM
		});

		const savedNotification = await notificationRepository.save(notification);

		return json(savedNotification, { status: 201 });

	} catch (error) {
		console.error('알림 생성 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}
