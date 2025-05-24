// 포인트 내역 조회 API
import { json } from '@sveltejs/kit';
import { getDataSource } from '$lib/server/data-source.js';
import { PointTransaction, TransactionType } from '$lib/server/entities/PointTransaction.js';
import { User } from '$lib/server/entities/User.js';
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

		const dataSource = await getDataSource();
		const pointRepository = dataSource.getRepository(PointTransaction);

		// 쿼리 빌더 생성
		let queryBuilder = pointRepository
			.createQueryBuilder('point')
			.where('point.userId = :userId', { userId: user.id });

		// 타입 필터
		if (type && Object.values(TransactionType).includes(type)) {
			queryBuilder.andWhere('point.type = :type', { type });
		}

		// 정렬 및 페이징
		queryBuilder
			.orderBy('point.createdAt', 'DESC')
			.offset(offset)
			.limit(limit);

		const [transactions, total] = await queryBuilder.getManyAndCount();

		// 현재 사용자 포인트 조회
		const userRepository = dataSource.getRepository(User);
		const currentUser = await userRepository.findOne({
			where: { id: user.id },
			select: ['points']
		});

		return json({
			transactions,
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
