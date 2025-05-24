// 가이드 상세 조회/수정/삭제 API - MySQL2 버전
import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database.js';
import { getUserFromRequest } from '$lib/server/auth.js';

export async function GET({ params }) {
	try {
		const { id } = params;

		const [guide] = await executeQuery(`
			SELECT g.*, u.name as creator_name 
			FROM guides g 
			LEFT JOIN users u ON g.created_by = u.id 
			WHERE g.id = ? AND g.is_active = 1
		`, [parseInt(id)]);

		if (!guide) {
			return json({ error: '가이드를 찾을 수 없습니다.' }, { status: 404 });
		}

		// 조회수 증가
		await executeQuery('UPDATE guides SET views = views + 1 WHERE id = ?', [parseInt(id)]);
		guide.views += 1;

		return json({
			...guide,
			creatorName: guide.creator_name,
			createdAt: guide.created_at,
			updatedAt: guide.updated_at,
			orderIndex: guide.order_index,
			isActive: !!guide.is_active
		});

	} catch (error) {
		console.error('가이드 상세 조회 오류:', error);
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

		// 가이드 존재 확인
		const [existingGuide] = await executeQuery(
			'SELECT id, order_index, is_active FROM guides WHERE id = ?',
			[parseInt(id)]
		);

		if (!existingGuide) {
			return json({ error: '가이드를 찾을 수 없습니다.' }, { status: 404 });
		}

		const { title, content, category, thumbnail, orderIndex, isActive } = await request.json();

		// 업데이트 쿼리
		const sql = `
			UPDATE guides SET 
				title = ?, content = ?, category = ?, thumbnail = ?, 
				order_index = ?, is_active = ?
			WHERE id = ?
		`;

		const params = [
			title,
			content,
			category,
			thumbnail || null,
			orderIndex !== undefined ? orderIndex : existingGuide.order_index,
			isActive !== undefined ? (isActive ? 1 : 0) : existingGuide.is_active,
			parseInt(id)
		];

		await executeQuery(sql, params);

		// 업데이트된 가이드 조회
		const [updatedGuide] = await executeQuery(`
			SELECT g.*, u.name as creator_name 
			FROM guides g 
			LEFT JOIN users u ON g.created_by = u.id 
			WHERE g.id = ?
		`, [parseInt(id)]);

		return json({
			...updatedGuide,
			creatorName: updatedGuide.creator_name,
			createdAt: updatedGuide.created_at,
			updatedAt: updatedGuide.updated_at,
			orderIndex: updatedGuide.order_index,
			isActive: !!updatedGuide.is_active
		});

	} catch (error) {
		console.error('가이드 수정 오류:', error);
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

		// 가이드 존재 확인
		const [existingGuide] = await executeQuery(
			'SELECT id FROM guides WHERE id = ?',
			[parseInt(id)]
		);

		if (!existingGuide) {
			return json({ error: '가이드를 찾을 수 없습니다.' }, { status: 404 });
		}

		await executeQuery('DELETE FROM guides WHERE id = ?', [parseInt(id)]);

		return json({ message: '가이드가 삭제되었습니다.' });

	} catch (error) {
		console.error('가이드 삭제 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}