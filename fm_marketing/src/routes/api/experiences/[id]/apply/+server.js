// 체험단 신청 API - MySQL2 버전
import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database.js';
import { getUserFromRequest } from '$lib/server/auth.js';

export async function POST({ params, request }) {
	try {
		const { id: experienceId } = params;
		const user = await getUserFromRequest(request);

		if (!user) {
			return json({ error: '인증이 필요합니다.' }, { status: 401 });
		}

		const { applicationText } = await request.json();

		// 체험단 정보 확인
		const [experience] = await executeQuery(`
			SELECT id, title, status, application_deadline, max_participants, current_participants, required_points
			FROM experiences WHERE id = ?
		`, [parseInt(experienceId)]);

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
		if (experience.max_participants && 
			experience.current_participants >= experience.max_participants) {
			return json({ error: '모집 인원이 마감되었습니다.' }, { status: 400 });
		}

		// 필요 포인트 확인
		if (experience.required_points > user.points) {
			return json({ error: '포인트가 부족합니다.' }, { status: 400 });
		}

		// 중복 신청 확인
		const [existingApplication] = await executeQuery(`
			SELECT id FROM experience_applications 
			WHERE experience_id = ? AND user_id = ?
		`, [parseInt(experienceId), user.id]);

		if (existingApplication) {
			return json({ error: '이미 신청한 체험단입니다.' }, { status: 409 });
		}

		// 트랜잭션으로 신청 처리
		try {
			await executeQuery('START TRANSACTION');

			// 신청 데이터 저장
			const applicationResult = await executeQuery(`
				INSERT INTO experience_applications (experience_id, user_id, application_text, status)
				VALUES (?, ?, ?, 'pending')
			`, [parseInt(experienceId), user.id, applicationText || '']);

			// 필요 포인트 차감
			if (experience.required_points > 0) {
				await executeQuery(`
					INSERT INTO point_transactions (user_id, type, amount, description, reference_type, reference_id)
					VALUES (?, 'spend', ?, '체험단 신청', 'experience_application', ?)
				`, [user.id, experience.required_points, applicationResult.insertId]);

				// 사용자 포인트 업데이트
				await executeQuery(`
					UPDATE users SET points = points - ? WHERE id = ?
				`, [experience.required_points, user.id]);
			}

			// 체험단 신청자 수 증가
			await executeQuery(`
				UPDATE experiences SET current_participants = current_participants + 1 WHERE id = ?
			`, [parseInt(experienceId)]);

			// 신청 확인 알림 생성
			await executeQuery(`
				INSERT INTO notifications (user_id, type, title, message, action_url, priority)
				VALUES (?, 'application_received', '체험단 신청 완료', ?, ?, 'medium')
			`, [
				user.id,
				`${experience.title} 체험단 신청이 완료되었습니다. 선정 결과를 기다려주세요.`,
				`/checklist/${experienceId}`
			]);

			await executeQuery('COMMIT');

			return json({ 
				message: '체험단 신청이 완료되었습니다.',
				applicationId: applicationResult.insertId
			}, { status: 201 });

		} catch (error) {
			await executeQuery('ROLLBACK');
			throw error;
		}

	} catch (error) {
		console.error('체험단 신청 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}

export async function DELETE({ params, request }) {
	try {
		const { id: experienceId } = params;
		const user = await getUserFromRequest(request);

		if (!user) {
			return json({ error: '인증이 필요합니다.' }, { status: 401 });
		}

		// 기존 신청 확인
		const [application] = await executeQuery(`
			SELECT id FROM experience_applications 
			WHERE experience_id = ? AND user_id = ? AND status = 'pending'
		`, [parseInt(experienceId), user.id]);

		if (!application) {
			return json({ error: '취소할 수 있는 신청이 없습니다.' }, { status: 404 });
		}

		// 체험단 정보 조회
		const [experience] = await executeQuery(`
			SELECT required_points FROM experiences WHERE id = ?
		`, [parseInt(experienceId)]);

		// 트랜잭션으로 신청 취소 처리
		try {
			await executeQuery('START TRANSACTION');

			// 신청 삭제
			await executeQuery('DELETE FROM experience_applications WHERE id = ?', [application.id]);

			// 포인트 환불
			if (experience.required_points > 0) {
				await executeQuery(`
					INSERT INTO point_transactions (user_id, type, amount, description, reference_type, reference_id)
					VALUES (?, 'earn', ?, '체험단 신청 취소 환불', 'application_cancel', ?)
				`, [user.id, experience.required_points, application.id]);

				// 사용자 포인트 업데이트
				await executeQuery(`
					UPDATE users SET points = points + ? WHERE id = ?
				`, [experience.required_points, user.id]);
			}

			// 체험단 신청자 수 감소
			await executeQuery(`
				UPDATE experiences SET current_participants = current_participants - 1 WHERE id = ?
			`, [parseInt(experienceId)]);

			await executeQuery('COMMIT');

			return json({ message: '체험단 신청이 취소되었습니다.' });

		} catch (error) {
			await executeQuery('ROLLBACK');
			throw error;
		}

	} catch (error) {
		console.error('체험단 신청 취소 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}
