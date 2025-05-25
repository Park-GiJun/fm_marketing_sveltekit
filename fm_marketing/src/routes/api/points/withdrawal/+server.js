// 포인트 환급 신청 API - MySQL2 버전
import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database.js';
import { getUserFromRequest } from '$lib/server/auth.js';

export async function POST({ request }) {
	try {
		const user = await getUserFromRequest(request);

		if (!user) {
			return json({ error: '인증이 필요합니다.' }, { status: 401 });
		}

		const { amount, accountInfo } = await request.json();

		// 입력값 검증
		if (!amount || amount < 10000) {
			return json({ error: '최소 환급 금액은 10,000 포인트입니다.' }, { status: 400 });
		}

		if (!accountInfo || !accountInfo.bank || !accountInfo.accountNumber || !accountInfo.accountHolder) {
			return json({ error: '계좌 정보를 모두 입력해주세요.' }, { status: 400 });
		}

		// 현재 사용자 포인트 확인
		const [currentUser] = await executeQuery(`
			SELECT id, points FROM users WHERE id = ?
		`, [user.id]);

		if (!currentUser || currentUser.points < amount) {
			return json({ error: '보유 포인트가 부족합니다.' }, { status: 400 });
		}

		// 트랜잭션으로 환급 처리
		try {
			await executeQuery('START TRANSACTION');

			// 포인트 차감
			const transactionResult = await executeQuery(`
				INSERT INTO point_transactions (user_id, type, amount, description, reference_type)
				VALUES (?, 'withdraw', ?, ?, 'withdrawal')
			`, [
				user.id,
				amount,
				`포인트 환급 신청 (${accountInfo.bank} ${accountInfo.accountNumber})`
			]);

			// 사용자 포인트 업데이트
			await executeQuery(`
				UPDATE users SET points = points - ? WHERE id = ?
			`, [amount, user.id]);

			// 환급 신청 알림 생성
			await executeQuery(`
				INSERT INTO notifications (user_id, type, title, message, priority)
				VALUES (?, 'withdrawal_request', '포인트 환급 신청 완료', ?, 'medium')
			`, [
				user.id,
				`${amount.toLocaleString()}P 환급 신청이 완료되었습니다. 처리까지 3-5일 소요됩니다.`
			]);

			await executeQuery('COMMIT');

			return json({ 
				message: '포인트 환급 신청이 완료되었습니다.',
				transactionId: transactionResult.insertId,
				amount
			}, { status: 201 });

		} catch (error) {
			await executeQuery('ROLLBACK');
			throw error;
		}

	} catch (error) {
		console.error('포인트 환급 신청 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}

export async function GET({ url, request }) {
	try {
		const user = await getUserFromRequest(request);

		if (!user) {
			return json({ error: '인증이 필요합니다.' }, { status: 401 });
		}

		const page = parseInt(url.searchParams.get('page') || '1');
		const limit = parseInt(url.searchParams.get('limit') || '10');
		const offset = (page - 1) * limit;

		// 환급 내역 조회
		const withdrawals = await executeQuery(`
			SELECT * FROM point_transactions 
			WHERE user_id = ? AND type = 'withdraw'
			ORDER BY created_at DESC
			LIMIT ? OFFSET ?
		`, [user.id, limit, offset]);

		// 전체 개수 조회
		const [countResult] = await executeQuery(`
			SELECT COUNT(*) as total FROM point_transactions 
			WHERE user_id = ? AND type = 'withdraw'
		`, [user.id]);

		const total = countResult?.total || 0;

		return json({
			withdrawals: withdrawals.map(w => ({
				...w,
				userId: w.user_id,
				referenceType: w.reference_type,
				referenceId: w.reference_id,
				createdAt: w.created_at
			})),
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit)
			}
		});

	} catch (error) {
		console.error('환급 내역 조회 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}
