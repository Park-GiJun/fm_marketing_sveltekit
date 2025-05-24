// 이벤트 상세 조회/수정/삭제 API - MySQL2 버전
import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database.js';
import { getUserFromRequest } from '$lib/server/auth.js';

export async function GET({ params }) {
	try {
		const { id } = params;

		const [event] = await executeQuery(`
			SELECT e.*, u.name as creator_name 
			FROM events e 
			LEFT JOIN users u ON e.created_by = u.id 
			WHERE e.id = ?
		`, [parseInt(id)]);

		if (!event) {
			return json({ error: '이벤트를 찾을 수 없습니다.' }, { status: 404 });
		}

		// 조회수 증가
		await executeQuery('UPDATE events SET views = views + 1 WHERE id = ?', [parseInt(id)]);
		event.views += 1;

		return json({
			...event,
			creatorName: event.creator_name,
			createdAt: event.created_at,
			updatedAt: event.updated_at,
			startDate: event.start_date,
			endDate: event.end_date,
			imageUrl: event.image_url,
			isActive: !!event.is_active,
			isImportant: !!event.is_important
		});

	} catch (error) {
		console.error('이벤트 상세 조회 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}

export async function PUT({ params, request }) {
	try {
		const { id } = params;
		const user = await getUserFromRequest(request);

		if (!user || user.role !== 'admin') {
			return json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
		}

		// 이벤트 존재 확인
		const [existingEvent] = await executeQuery(
			'SELECT id FROM events WHERE id = ?',
			[parseInt(id)]
		);

		if (!existingEvent) {
			return json({ error: '이벤트를 찾을 수 없습니다.' }, { status: 404 });
		}

		const {
			title, content, type, category, imageUrl,
			startDate, endDate, isActive, isImportant
		} = await request.json();

		// 업데이트 쿼리
		const sql = `
			UPDATE events SET 
				title = ?, content = ?, type = ?, category = ?, 
				image_url = ?, start_date = ?, end_date = ?, 
				is_active = ?, is_important = ?
			WHERE id = ?
		`;

		const params = [
			title,
			content,
			type,
			category || null,
			imageUrl || null,
			startDate || null,
			endDate || null,
			isActive !== undefined ? (isActive ? 1 : 0) : 1,
			isImportant !== undefined ? (isImportant ? 1 : 0) : 0,
			parseInt(id)
		];

		await executeQuery(sql, params);

		// 업데이트된 이벤트 조회
		const [updatedEvent] = await executeQuery(`
			SELECT e.*, u.name as creator_name 
			FROM events e 
			LEFT JOIN users u ON e.created_by = u.id 
			WHERE e.id = ?
		`, [parseInt(id)]);

		return json({
			...updatedEvent,
			creatorName: updatedEvent.creator_name,
			createdAt: updatedEvent.created_at,
			updatedAt: updatedEvent.updated_at,
			startDate: updatedEvent.start_date,
			endDate: updatedEvent.end_date,
			imageUrl: updatedEvent.image_url,
			isActive: !!updatedEvent.is_active,
			isImportant: !!updatedEvent.is_important
		});

	} catch (error) {
		console.error('이벤트 수정 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}

export async function DELETE({ params, request }) {
	try {
		const { id } = params;
		const user = await getUserFromRequest(request);

		if (!user || user.role !== 'admin') {
			return json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
		}

		// 이벤트 존재 확인
		const [existingEvent] = await executeQuery(
			'SELECT id FROM events WHERE id = ?',
			[parseInt(id)]
		);

		if (!existingEvent) {
			return json({ error: '이벤트를 찾을 수 없습니다.' }, { status: 404 });
		}

		await executeQuery('DELETE FROM events WHERE id = ?', [parseInt(id)]);

		return json({ message: '이벤트가 삭제되었습니다.' });

	} catch (error) {
		console.error('이벤트 삭제 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}