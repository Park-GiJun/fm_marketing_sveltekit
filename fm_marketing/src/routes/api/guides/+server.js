// 가이드 목록 조회/생성 API - MySQL2 버전
import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database.js';
import { getUserFromRequest } from '$lib/server/auth.js';

export async function GET({ url }) {
	try {
		const category = url.searchParams.get('category');
		const active = url.searchParams.get('active');
		const page = parseInt(url.searchParams.get('page') || '1');
		const limit = parseInt(url.searchParams.get('limit') || '20');
		const offset = (page - 1) * limit;

		// 기본 쿼리
		let sql = `
			SELECT g.*, u.name as creator_name 
			FROM guides g 
			LEFT JOIN users u ON g.created_by = u.id 
			WHERE 1=1
		`;
		let countSql = 'SELECT COUNT(*) as total FROM guides WHERE 1=1';
		let params = [];
		let countParams = [];

		// 카테고리 필터
		if (category) {
			sql += ' AND g.category = ?';
			countSql += ' AND category = ?';
			params.push(category);
			countParams.push(category);
		}

		// 활성 상태 필터
		if (active !== 'false') {
			sql += ' AND g.is_active = 1';
			countSql += ' AND is_active = 1';
		}

		// 총 개수 조회
		const [countResult] = await executeQuery(countSql, countParams);
		const total = countResult?.total || 0;

		// 정렬 (순서, 최신순)
		sql += ' ORDER BY g.order_index ASC, g.created_at DESC';

		// 페이징
		sql += ' LIMIT ? OFFSET ?';
		params.push(limit, offset);

		// 데이터 조회
		const guides = await executeQuery(sql, params);

		return json({
			guides: guides.map(guide => ({
				...guide,
				creatorName: guide.creator_name,
				createdAt: guide.created_at,
				updatedAt: guide.updated_at,
				orderIndex: guide.order_index,
				isActive: !!guide.is_active
			})),
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit)
			}
		});

	} catch (error) {
		console.error('가이드 목록 조회 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}

export async function POST({ request }) {
	try {
		const user = await getUserFromRequest(request);

		if (!user || user.role !== 'admin') {
			return json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
		}

		const { title, content, category, thumbnail, orderIndex } = await request.json();

		// 필수 필드 검증
		if (!title || !content || !category) {
			return json({ error: '필수 정보를 모두 입력해주세요.' }, { status: 400 });
		}

		const sql = `
			INSERT INTO guides (title, content, category, thumbnail, order_index, created_by)
			VALUES (?, ?, ?, ?, ?, ?)
		`;

		const params = [
			title,
			content,
			category,
			thumbnail || null,
			orderIndex || 0,
			user.id
		];

		const result = await executeQuery(sql, params);

		// 생성된 가이드 조회
		const [newGuide] = await executeQuery(`
			SELECT g.*, u.name as creator_name 
			FROM guides g 
			LEFT JOIN users u ON g.created_by = u.id 
			WHERE g.id = ?
		`, [result.insertId]);

		return json({
			...newGuide,
			creatorName: newGuide.creator_name,
			createdAt: newGuide.created_at,
			updatedAt: newGuide.updated_at,
			orderIndex: newGuide.order_index,
			isActive: !!newGuide.is_active
		}, { status: 201 });

	} catch (error) {
		console.error('가이드 생성 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}