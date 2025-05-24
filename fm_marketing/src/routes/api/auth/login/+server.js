// 로그인 API
import { json } from '@sveltejs/kit';
import { getDataSource } from '$lib/server/data-source.js';
import { User } from '$lib/server/entities/User.js';
import { PointTransaction, TransactionType } from '$lib/server/entities/PointTransaction.js';
import { verifyPassword, generateToken } from '$lib/server/auth.js';

export async function POST({ request }) {
	try {
		const { username, password } = await request.json();

		// 입력값 검증
		if (!username || !password) {
			return json({ error: '사용자명과 비밀번호를 입력해주세요.' }, { status: 400 });
		}

		const dataSource = await getDataSource();
		const userRepository = dataSource.getRepository(User);
		const pointRepository = dataSource.getRepository(PointTransaction);

		// 사용자 조회 (username 또는 email로 로그인 가능)
		const user = await userRepository.findOne({
			where: [
				{ username, isActive: true },
				{ email: username, isActive: true }
			]
		});

		if (!user) {
			return json({ error: '존재하지 않는 사용자입니다.' }, { status: 401 });
		}

		// 비밀번호 검증
		const isValidPassword = await verifyPassword(password, user.passwordHash);
		if (!isValidPassword) {
			return json({ error: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
		}

		// 로그인 포인트 지급 (일일 첫 로그인)
		const today = new Date().toISOString().split('T')[0];
		const todayLogin = await pointRepository
			.createQueryBuilder('point')
			.where('point.userId = :userId', { userId: user.id })
			.andWhere('point.type = :type', { type: TransactionType.EARN })
			.andWhere('point.referenceType = :referenceType', { referenceType: 'daily_login' })
			.andWhere('DATE(point.createdAt) = :today', { today })
			.getOne();

		// 오늘 로그인 포인트가 없으면 지급
		if (!todayLogin) {
			await dataSource.transaction(async manager => {
				// 일일 로그인 포인트 지급
				const pointTransaction = manager.create(PointTransaction, {
					userId: user.id,
					type: TransactionType.EARN,
					amount: 10,
					description: '일일 로그인 포인트',
					referenceType: 'daily_login'
				});

				await manager.save(pointTransaction);

				// 사용자 포인트 업데이트
				await manager.update(User, { id: user.id }, { 
					points: () => 'points + 10' 
				});
			});

			user.points += 10;
		}

		// JWT 토큰 생성
		const token = generateToken({ 
			userId: user.id, 
			username: user.username, 
			email: user.email 
		});

		// 사용자 정보 반환 (비밀번호 제외)
		const { passwordHash, ...userInfo } = user;

		return json({ user: userInfo, token });

	} catch (error) {
		console.error('로그인 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}
