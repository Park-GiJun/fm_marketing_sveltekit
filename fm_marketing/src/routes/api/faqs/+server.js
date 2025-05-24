// FAQ 목록 조회/생성 API - MySQL2 버전
import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database.js';
import { getUserFromRequest } from '$lib/server/auth.js';

export async function GET({ url }) {
	try {
		const category = url.searchParams.get('category');
		const active = url.searchParams.get('active');
		const search = url.searchParams.get('search');
		const page = parseInt(url.searchParams.get('page') || '1');
		const limit = parseInt(url.searchParams.get('limit') || '50');
		const offset = (page - 1) * limit;

		// 기본 쿼리
		let sql = `
			SELECT f.*, u.name as creator_name 
			FROM faqs f 
			LEFT JOIN users u ON f.created_by = u.id 
			WHERE 1=1
		`;
		let countSql = 'SELECT COUNT(*) as total FROM faqs WHERE 1=1';
		let params = [];
		let countParams = [];

		// 카테고리 필터
		if (category) {
			sql += ' AND f.category = ?';
			countSql += ' AND category = ?';
			params.push(category);
			countParams.push(category);
		}

		// 검색어 필터
		if (search) {
			sql += ' AND (f.question LIKE ? OR f.answer LIKE ?)';
			countSql += ' AND (question LIKE ? OR answer LIKE ?)';
			params.push(`%${search}%`, `%${search}%`);
			countParams.push(`%${search}%`, `%${search}%`);
		}

		// 활성 상태 필터
		if (active !== 'false') {
			sql += ' AND f.is_active = 1';
			countSql += ' AND is_active = 1';
		}

		// 총 개수 조회
		const [countResult] = await executeQuery(countSql, countParams);
		const total = countResult?.total || 0;

		// 정렬 (순서, 최신순)
		sql += ' ORDER BY f.order_index ASC, f.created_at DESC';

		// 페이징 - 숫자로 확실히 변환
		sql += ' LIMIT ? OFFSET ?';
		params.push(parseInt(limit), parseInt(offset));

		// 데이터 조회
		const faqs = await executeQuery(sql, params);

		return json({
			faqs: faqs.map(faq => ({
				...faq,
				creatorName: faq.creator_name,
				createdAt: faq.created_at,
				updatedAt: faq.updated_at,
				orderIndex: faq.order_index,
				isActive: !!faq.is_active
			})),
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit)
			}
		});

	} catch (error) {
		console.error('FAQ 목록 조회 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}

export async function POST({ request }) {
	try {
		const user = await getUserFromRequest(request);

		if (!user || user.role !== 'admin') {
			return json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
		}

		const { question, answer, category, orderIndex } = await request.json();

		// 필수 필드 검증
		if (!question || !answer || !category) {
			return json({ error: '필수 정보를 모두 입력해주세요.' }, { status: 400 });
		}

		const sql = `
			INSERT INTO faqs (question, answer, category, order_index, created_by)
			VALUES (?, ?, ?, ?, ?)
		`;

		const params = [
			question,
			answer,
			category,
			orderIndex || 0,
			user.id
		];

		const result = await executeQuery(sql, params);

		// 생성된 FAQ 조회
		const [newFaq] = await executeQuery(`
			SELECT f.*, u.name as creator_name 
			FROM faqs f 
			LEFT JOIN users u ON f.created_by = u.id 
			WHERE f.id = ?
		`, [result.insertId]);

		return json({
			...newFaq,
			creatorName: newFaq.creator_name,
			createdAt: newFaq.created_at,
			updatedAt: newFaq.updated_at,
			orderIndex: newFaq.order_index,
			isActive: !!newFaq.is_active
		}, { status: 201 });

	} catch (error) {
		console.error('FAQ 생성 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}