// 포인트 환급 신청 API
import { json } from '@sveltejs/kit';
import { getDataSource } from '$lib/server/data-source.js';
import { PointTransaction, TransactionType } from '$lib/server/entities/PointTransaction.js';
import { User } from '$lib/server/entities/User.js';
import { Notification, NotificationPriority } from '$lib/server/entities/Notification.js';
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

		const dataSource = await getDataSource();
		const userRepository = dataSource.getRepository(User);
		const pointRepository = dataSource.getRepository(PointTransaction);

		// 현재 사용자 포인트 확인
		const currentUser = await userRepository.findOne({
			where: { id: user.id },
			select: ['id', 'points']
		});

		if (!currentUser || currentUser.points < amount) {
			return json({ error: '보유 포인트가 부족합니다.' }, { status: 400 });
		}

		// 트랜잭션으로 환급 처리
		const result = await dataSource.transaction(async manager => {
			// 포인트 차감
			const pointTransaction = manager.create(PointTransaction, {
				userId: user.id,
				type: TransactionType.WITHDRAW,
				amount: amount,
				description: `포인트 환급 신청 (${accountInfo.bank} ${accountInfo.accountNumber})`,
				referenceType: 'withdrawal'
			});
			const savedTransaction = await manager.save(pointTransaction);

			// 사용자 포인트 업데이트
			await manager.update(User, { id: user.id }, { 
				points: () => `points - ${amount}` 
			});

			// 환급 신청 알림 생성
			const notification = manager.create(Notification, {
				userId: user.id,
				type: 'withdrawal_request',
				title: '포인트 환급 신청 완료',
				message: `${amount.toLocaleString()}P 환급 신청이 완료되었습니다. 처리까지 3-5일 소요됩니다.`,
				priority: NotificationPriority.MEDIUM
			});
			await manager.save(notification);

			return savedTransaction;
		});

		return json({ 
			message: '포인트 환급 신청이 완료되었습니다.',
			transactionId: result.id,
			amount
		}, { status: 201 });

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

		const dataSource = await getDataSource();
		const pointRepository = dataSource.getRepository(PointTransaction);

		// 환급 내역 조회
		const [withdrawals, total] = await pointRepository
			.createQueryBuilder('point')
			.where('point.userId = :userId', { userId: user.id })
			.andWhere('point.type = :type', { type: TransactionType.WITHDRAW })
			.orderBy('point.createdAt', 'DESC')
			.offset(offset)
			.limit(limit)
			.getManyAndCount();

		return json({
			withdrawals,
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
