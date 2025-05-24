// 알림 상세 조회/읽음 처리/삭제 API
import { json } from '@sveltejs/kit';
import { getDataSource } from '$lib/server/data-source.js';
import { Notification } from '$lib/server/entities/Notification.js';
import { User, UserRole } from '$lib/server/entities/User.js';
import { getUserFromRequest } from '$lib/server/auth.js';

export async function GET({ params, request }) {
	try {
		const { id } = params;
		const user = await getUserFromRequest(request);

		if (!user) {
			return json({ error: '인증이 필요합니다.' }, { status: 401 });
		}

		const dataSource = await getDataSource();
		const notificationRepository = dataSource.getRepository(Notification);

		const notification = await notificationRepository.findOne({
			where: { 
				id: parseInt(id),
				userId: user.id 
			}
		});

		if (!notification) {
			return json({ error: '알림을 찾을 수 없습니다.' }, { status: 404 });
		}

		return json(notification);

	} catch (error) {
		console.error('알림 조회 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}

export async function PATCH({ params, request }) {
	try {
		const { id } = params;
		const user = await getUserFromRequest(request);

		if (!user) {
			return json({ error: '인증이 필요합니다.' }, { status: 401 });
		}

		const { isRead } = await request.json();

		const dataSource = await getDataSource();
		const notificationRepository = dataSource.getRepository(Notification);

		// 알림 소유자 확인
		const notification = await notificationRepository.findOne({
			where: { 
				id: parseInt(id),
				userId: user.id 
			},
			select: ['id', 'isRead']
		});

		if (!notification) {
			return json({ error: '알림을 찾을 수 없습니다.' }, { status: 404 });
		}

		// 읽음 상태 업데이트
		await notificationRepository.update(id, { isRead: !!isRead });

		const updatedNotification = await notificationRepository.findOne({
			where: { id: parseInt(id) }
		});

		return json(updatedNotification);

	} catch (error) {
		console.error('알림 상태 변경 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}

export async function DELETE({ params, request }) {
	try {
		const { id } = params;
		const user = await getUserFromRequest(request);

		if (!user) {
			return json({ error: '인증이 필요합니다.' }, { status: 401 });
		}

		const dataSource = await getDataSource();
		const notificationRepository = dataSource.getRepository(Notification);

		// 알림 소유자 확인
		const notification = await notificationRepository.findOne({
			where: { 
				id: parseInt(id),
				userId: user.id 
			},
			select: ['id']
		});

		if (!notification) {
			return json({ error: '알림을 찾을 수 없습니다.' }, { status: 404 });
		}

		await notificationRepository.delete(id);

		return json({ message: '알림이 삭제되었습니다.' });

	} catch (error) {
		console.error('알림 삭제 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}
