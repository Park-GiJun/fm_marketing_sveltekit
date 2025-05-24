// 체험단 신청 API
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database.js';
import { requireAuth } from '$lib/server/auth.js';

export const POST = requireAuth(async ({ params, request, locals }) => {
	try {
		const { id: experienceId } = params;
		const user = locals.user;
		const { applicationText } = await request.json();

		// 체험단 정보 확인
		const experienceStmt = db.prepare(`
			SELECT id, title, status, application_deadline, max_participants, current_participants, required_points
			FROM experiences WHERE id = ?
		`);
		const experience = experienceStmt.get(experienceId);

		if (!experience) {
			return json({ error: '체험단을 찾을 수 없습니다.' }, { status: 404 });
		}

		if (experience.status !== 'active') {
			return json({ error: '모집이 마감된 체험단입니다.' }, { status: 400 });
		}

		// 신청 마감일 확인
		if (experience.application_deadline) {
			const deadline = new Date(experience.application_deadline);
			const now = new Date();
			if (now > deadline) {
				return json({ error: '신청 기간이 마감되었습니다.' }, { status: 400 });
			}
		}

		// 모집 인원 확인
		if (experience.max_participants && experience.current_participants >= experience.max_participants) {
			return json({ error: '모집 인원이 마감되었습니다.' }, { status: 400 });
		}

		// 필요 포인트 확인
		if (experience.required_points > user.points) {
			return json({ error: '포인트가 부족합니다.' }, { status: 400 });
		}

		// 중복 신청 확인
		const existingStmt = db.prepare(`
			SELECT id FROM experience_applications WHERE experience_id = ? AND user_id = ?
		`);
		const existing = existingStmt.get(experienceId, user.id);

		if (existing) {
			return json({ error: '이미 신청한 체험단입니다.' }, { status: 409 });
		}

		// 트랜잭션 시작
		const transaction = db.transaction(() => {
			// 신청 데이터 저장
			const applicationStmt = db.prepare(`
				INSERT INTO experience_applications (experience_id, user_id, application_text)
				VALUES (?, ?, ?)
			`);
			const applicationResult = applicationStmt.run(experienceId, user.id, applicationText || '');

			// 필요 포인트 차감
			if (experience.required_points > 0) {
				const pointStmt = db.prepare(`
					INSERT INTO point_transactions (user_id, type, amount, description, reference_type, reference_id)
					VALUES (?, 'spend', ?, '체험단 신청', 'experience_application', ?)
				`);
				pointStmt.run(user.id, -experience.required_points, applicationResult.lastInsertRowid);

				// 사용자 포인트 업데이트
				const updateUserPointsStmt = db.prepare('UPDATE users SET points = points - ? WHERE id = ?');
				updateUserPointsStmt.run(experience.required_points, user.id);
			}

			// 체험단 신청자 수 증가
			const updateCountStmt = db.prepare('UPDATE experiences SET current_participants = current_participants + 1 WHERE id = ?');
			updateCountStmt.run(experienceId);

			// 신청 확인 알림 생성
			const notificationStmt = db.prepare(`
				INSERT INTO notifications (user_id, type, title, message, action_url, priority)
				VALUES (?, 'application_received', '체험단 신청 완료', ?, ?, 'medium')
			`);
			notificationStmt.run(
				user.id,
				`${experience.title} 체험단 신청이 완료되었습니다. 선정 결과를 기다려주세요.`,
				`/checklist/${experienceId}`
			);
		});

		transaction();

		return json({ 
			message: '체험단 신청이 완료되었습니다.',
			applicationId: db.prepare('SELECT last_insert_rowid()').get()['last_insert_rowid()']
		}, { status: 201 });

	} catch (error) {
		console.error('체험단 신청 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
});

export const DELETE = requireAuth(async ({ params, locals }) => {
	try {
		const { id: experienceId } = params;
		const user = locals.user;

		// 기존 신청 확인
		const applicationStmt = db.prepare(`
			SELECT id FROM experience_applications WHERE experience_id = ? AND user_id = ? AND status = 'pending'
		`);
		const application = applicationStmt.get(experienceId, user.id);

		if (!application) {
			return json({ error: '취소할 수 있는 신청이 없습니다.' }, { status: 404 });
		}

		// 체험단 정보 조회
		const experienceStmt = db.prepare('SELECT required_points FROM experiences WHERE id = ?');
		const experience = experienceStmt.get(experienceId);

		// 트랜잭션으로 신청 취소 처리
		const transaction = db.transaction(() => {
			// 신청 삭제
			const deleteStmt = db.prepare('DELETE FROM experience_applications WHERE id = ?');
			deleteStmt.run(application.id);

			// 포인트 환불
			if (experience.required_points > 0) {
				const pointStmt = db.prepare(`
					INSERT INTO point_transactions (user_id, type, amount, description, reference_type, reference_id)
					VALUES (?, 'earn', ?, '체험단 신청 취소 환불', 'application_cancel', ?)
				`);
				pointStmt.run(user.id, experience.required_points, application.id);

				// 사용자 포인트 업데이트
				const updateUserPointsStmt = db.prepare('UPDATE users SET points = points + ? WHERE id = ?');
				updateUserPointsStmt.run(experience.required_points, user.id);
			}

			// 체험단 신청자 수 감소
			const updateCountStmt = db.prepare('UPDATE experiences SET current_participants = current_participants - 1 WHERE id = ?');
			updateCountStmt.run(experienceId);
		});

		transaction();

		return json({ message: '체험단 신청이 취소되었습니다.' });

	} catch (error) {
		console.error('체험단 신청 취소 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
});
