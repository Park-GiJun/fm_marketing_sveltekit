// 알림 상세 조회/읽음 처리/삭제 API - MySQL2 버전
import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database.js';
import { getUserFromRequest } from '$lib/server/auth.js';

export async function GET({ params, request }) {
	try {
		const { id } = params;
		const user = await getUserFromRequest(request);

		if (!user) {
			return json({ error: '인증이 필요합니다.' }, { status: 401 });
		}

		const [notification] = await executeQuery(`
			SELECT * FROM notifications 
			WHERE id = ? AND user_id = ?
		`, [parseInt(id), user.id]);

		if (!notification) {
			return json({ error: '알림을 찾을 수 없습니다.' }, { status: 404 });
		}

		return json({
			...notification,
			userId: notification.user_id,
			actionUrl: notification.action_url,
			isRead: !!notification.is_read,
			createdAt: notification.created_at
		});

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

		// 알림 소유자 확인
		const [notification] = await executeQuery(`
			SELECT id FROM notifications 
			WHERE id = ? AND user_id = ?
		`, [parseInt(id), user.id]);

		if (!notification) {
			return json({ error: '알림을 찾을 수 없습니다.' }, { status: 404 });
		}

		// 읽음 상태 업데이트
		await executeQuery(`
			UPDATE notifications SET is_read = ? WHERE id = ?
		`, [!!isRead ? 1 : 0, parseInt(id)]);

		const [updatedNotification] = await executeQuery(`
			SELECT * FROM notifications WHERE id = ?
		`, [parseInt(id)]);

		return json({
			...updatedNotification,
			userId: updatedNotification.user_id,
			actionUrl: updatedNotification.action_url,
			isRead: !!updatedNotification.is_read,
			createdAt: updatedNotification.created_at
		});

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

		// 알림 소유자 확인
		const [notification] = await executeQuery(`
			SELECT id FROM notifications 
			WHERE id = ? AND user_id = ?
		`, [parseInt(id), user.id]);

		if (!notification) {
			return json({ error: '알림을 찾을 수 없습니다.' }, { status: 404 });
		}

		await executeQuery('DELETE FROM notifications WHERE id = ?', [parseInt(id)]);

		return json({ message: '알림이 삭제되었습니다.' });

	} catch (error) {
		console.error('알림 삭제 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}
