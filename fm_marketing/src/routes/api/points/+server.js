// 포인트 내역 조회 API - MySQL2 버전
import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database.js';
import { getUserFromRequest } from '$lib/server/auth.js';

export async function GET({ url, request }) {
	try {
		const user = await getUserFromRequest(request);

		if (!user) {
			return json({ error: '인증이 필요합니다.' }, { status: 401 });
		}

		const type = url.searchParams.get('type'); // 'earn', 'spend', 'withdraw'
		const page = parseInt(url.searchParams.get('page') || '1');
		const limit = parseInt(url.searchParams.get('limit') || '20');
		const offset = (page - 1) * limit;

		// 기본 쿼리
		let sql = 'SELECT * FROM point_transactions WHERE user_id = ?';
		let params = [user.id];

		// 타입 필터
		if (type && ['earn', 'spend', 'withdraw'].includes(type)) {
			sql += ' AND type = ?';
			params.push(type);
		}

		// 개수 조회용 쿼리
		let countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total');
		const [countResult] = await executeQuery(countSql, params);
		const total = countResult?.total || 0;

		// 정렬 및 페이징
		sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
		params.push(limit, offset);

		const transactions = await executeQuery(sql, params);

		// 현재 사용자 포인트 조회
		const [currentUser] = await executeQuery(`
			SELECT points FROM users WHERE id = ?
		`, [user.id]);

		return json({
			transactions: transactions.map(t => ({
				...t,
				userId: t.user_id,
				referenceType: t.reference_type,
				referenceId: t.reference_id,
				createdAt: t.created_at
			})),
			currentPoints: currentUser?.points || 0,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit)
			}
		});

	} catch (error) {
		console.error('포인트 내역 조회 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}
