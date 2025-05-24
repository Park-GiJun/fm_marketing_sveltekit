// 모든 알림 읽음 처리 API
import { json } from '@sveltejs/kit';
import { getDataSource } from '$lib/server/data-source.js';
import { Notification } from '$lib/server/entities/Notification.js';
import { getUserFromRequest } from '$lib/server/auth.js';

export async function POST({ request }) {
	try {
		const user = await getUserFromRequest(request);

		if (!user) {
			return json({ error: '인증이 필요합니다.' }, { status: 401 });
		}

		const dataSource = await getDataSource();
		const notificationRepository = dataSource.getRepository(Notification);

		// 사용자의 모든 읽지 않은 알림을 읽음으로 처리
		const result = await notificationRepository.update(
			{ userId: user.id, isRead: false },
			{ isRead: true }
		);

		return json({ 
			message: '모든 알림을 읽음 처리했습니다.',
			updatedCount: result.affected || 0
		});

	} catch (error) {
		console.error('알림 일괄 읽음 처리 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}
