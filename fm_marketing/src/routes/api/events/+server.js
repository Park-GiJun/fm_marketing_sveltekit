// 이벤트 목록 조회/생성 API - MySQL2 버전
import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database.js';
import { getUserFromRequest } from '$lib/server/auth.js';

export async function GET({ url }) {
	try {
		const type = url.searchParams.get('type'); // 'event' 또는 'notice'
		const category = url.searchParams.get('category');
		const active = url.searchParams.get('active');
		const page = parseInt(url.searchParams.get('page') || '1');
		const limit = parseInt(url.searchParams.get('limit') || '20');
		const offset = (page - 1) * limit;

		// 기본 쿼리
		let sql = `
			SELECT e.*, u.name as creator_name 
			FROM events e 
			LEFT JOIN users u ON e.created_by = u.id 
			WHERE 1=1
		`;
		let countSql = 'SELECT COUNT(*) as total FROM events WHERE 1=1';
		let params = [];
		let countParams = [];

		// 타입 필터 (이벤트 또는 공지사항)
		if (type && (type === 'event' || type === 'notice')) {
			sql += ' AND e.type = ?';
			countSql += ' AND type = ?';
			params.push(type);
			countParams.push(type);
		}

		// 카테고리 필터
		if (category) {
			sql += ' AND e.category = ?';
			countSql += ' AND category = ?';
			params.push(category);
			countParams.push(category);
		}

		// 활성 상태 필터
		if (active === 'true') {
			sql += ' AND e.is_active = 1';
			countSql += ' AND is_active = 1';
			// 현재 진행 중인 이벤트만 (종료일이 없거나 현재보다 미래)
			sql += ' AND (e.end_date IS NULL OR e.end_date >= CURDATE())';
			countSql += ' AND (end_date IS NULL OR end_date >= CURDATE())';
		} else if (active === 'false') {
			sql += ' AND e.is_active = 0';
			countSql += ' AND is_active = 0';
		}

		// 총 개수 조회
		const [countResult] = await executeQuery(countSql, countParams);
		const total = countResult?.total || 0;

		// 정렬 (중요도 우선, 최신순)
		sql += ' ORDER BY e.is_important DESC, e.created_at DESC';

		// 페이징 - 숫자로 확실히 변환
		sql += ' LIMIT ? OFFSET ?';
		params.push(parseInt(limit), parseInt(offset));

		// 데이터 조회
		const events = await executeQuery(sql, params);

		return json({
			events: events.map(event => ({
				...event,
				creatorName: event.creator_name,
				createdAt: event.created_at,
				updatedAt: event.updated_at,
				startDate: event.start_date,
				endDate: event.end_date,
				imageUrl: event.image_url,
				isActive: !!event.is_active,
				isImportant: !!event.is_important
			})),
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit)
			}
		});

	} catch (error) {
		console.error('이벤트 목록 조회 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}

export async function POST({ request }) {
	try {
		const user = await getUserFromRequest(request);

		if (!user || user.role !== 'admin') {
			return json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
		}

		const {
			title, content, type, category, imageUrl,
			startDate, endDate, isImportant
		} = await request.json();

		// 필수 필드 검증
		if (!title || !content || !type) {
			return json({ error: '필수 정보를 모두 입력해주세요.' }, { status: 400 });
		}

		if (type !== 'event' && type !== 'notice') {
			return json({ error: '올바른 타입을 선택해주세요.' }, { status: 400 });
		}

		const sql = `
			INSERT INTO events (
				title, content, type, category, image_url,
				start_date, end_date, is_important, created_by
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
		`;

		const params = [
			title,
			content,
			type,
			category || null,
			imageUrl || null,
			startDate || null,
			endDate || null,
			isImportant ? 1 : 0,
			user.id
		];

		const result = await executeQuery(sql, params);

		// 생성된 이벤트 조회
		const [newEvent] = await executeQuery(`
			SELECT e.*, u.name as creator_name 
			FROM events e 
			LEFT JOIN users u ON e.created_by = u.id 
			WHERE e.id = ?
		`, [result.insertId]);

		return json({
			...newEvent,
			creatorName: newEvent.creator_name,
			createdAt: newEvent.created_at,
			updatedAt: newEvent.updated_at,
			startDate: newEvent.start_date,
			endDate: newEvent.end_date,
			imageUrl: newEvent.image_url,
			isActive: !!newEvent.is_active,
			isImportant: !!newEvent.is_important
		}, { status: 201 });

	} catch (error) {
		console.error('이벤트 생성 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}