// 체험단 상세 조회/수정/삭제 API
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database.js';
import { getUserFromRequest } from '$lib/server/auth.js';

export async function GET({ params, request }) {
	try {
		const { id } = params;
		const user = await getUserFromRequest(request);

		// 조회수 증가
		const updateViewsStmt = db.prepare('UPDATE experiences SET views = views + 1 WHERE id = ?');
		updateViewsStmt.run(id);

		// 체험단 정보 조회
		const stmt = db.prepare(`
			SELECT 
				e.*,
				u.name as creator_name,
				(SELECT COUNT(*) FROM experience_applications WHERE experience_id = e.id) as application_count
			FROM experiences e
			LEFT JOIN users u ON e.created_by = u.id
			WHERE e.id = ?
		`);

		const experience = stmt.get(id);

		if (!experience) {
			return json({ error: '체험단을 찾을 수 없습니다.' }, { status: 404 });
		}

		// 사용자의 신청 상태 확인 (로그인된 경우)
		let userApplication = null;
		if (user) {
			const appStmt = db.prepare(`
				SELECT status, applied_at FROM experience_applications 
				WHERE experience_id = ? AND user_id = ?
			`);
			userApplication = appStmt.get(id, user.id);
		}

		// JSON 필드 파싱
		const parsedExperience = {
			...experience,
			images: experience.images ? JSON.parse(experience.images) : [],
			tags: experience.tags ? JSON.parse(experience.tags) : [],
			user_application: userApplication
		};

		return json(parsedExperience);

	} catch (error) {
		console.error('체험단 상세 조회 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}

export async function PUT({ params, request }) {
	try {
		const { id } = params;
		const user = await getUserFromRequest(request);
		
		if (!user) {
			return json({ error: '인증이 필요합니다.' }, { status: 401 });
		}

		// 체험단 존재 확인 및 권한 체크
		const experienceStmt = db.prepare('SELECT created_by FROM experiences WHERE id = ?');
		const experience = experienceStmt.get(id);

		if (!experience) {
			return json({ error: '체험단을 찾을 수 없습니다.' }, { status: 404 });
		}

		if (user.role !== 'admin' && user.id !== experience.created_by) {
			return json({ error: '수정 권한이 없습니다.' }, { status: 403 });
		}

		const data = await request.json();
		const {
			title, content, category, type, region, location,
			start_date, end_date, application_deadline,
			max_participants, required_points, reward_points,
			reward_description, requirements, company_name,
			contact_info, images, tags, is_promoted, status
		} = data;

		const stmt = db.prepare(`
			UPDATE experiences SET 
				title = ?, content = ?, category = ?, type = ?, region = ?, 
				location = ?, start_date = ?, end_date = ?, application_deadline = ?,
				max_participants = ?, required_points = ?, reward_points = ?,
				reward_description = ?, requirements = ?, company_name = ?,
				contact_info = ?, images = ?, tags = ?, is_promoted = ?, 
				status = ?, updated_at = CURRENT_TIMESTAMP
			WHERE id = ?
		`);

		stmt.run(
			title, content, category, type, region, location,
			start_date, end_date, application_deadline,
			max_participants, required_points, reward_points,
			reward_description, requirements, company_name,
			contact_info, JSON.stringify(images || []), JSON.stringify(tags || []),
			is_promoted, status, id
		);

		const updatedExperience = db.prepare('SELECT * FROM experiences WHERE id = ?').get(id);

		return json({
			...updatedExperience,
			images: JSON.parse(updatedExperience.images || '[]'),
			tags: JSON.parse(updatedExperience.tags || '[]')
		});

	} catch (error) {
		console.error('체험단 수정 오류:', error);
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

		if (user.role !== 'admin') {
			return json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
		}

		// 체험단 존재 확인
		const experienceStmt = db.prepare('SELECT id FROM experiences WHERE id = ?');
		const experience = experienceStmt.get(id);

		if (!experience) {
			return json({ error: '체험단을 찾을 수 없습니다.' }, { status: 404 });
		}

		// 관련 데이터 삭제 (신청 내역, 알림 등)
		db.prepare('DELETE FROM experience_applications WHERE experience_id = ?').run(id);
		db.prepare('DELETE FROM notifications WHERE reference_type = ? AND reference_id = ?').run('experience', id);
		db.prepare('DELETE FROM experiences WHERE id = ?').run(id);

		return json({ message: '체험단이 삭제되었습니다.' });

	} catch (error) {
		console.error('체험단 삭제 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}
