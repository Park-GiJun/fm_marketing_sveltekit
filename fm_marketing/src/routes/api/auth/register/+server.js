// 회원가입 API
import { json } from '@sveltejs/kit';
import { getDataSource } from '$lib/server/data-source.js';
import { User, UserLevel, UserRole } from '$lib/server/entities/User.js';
import { PointTransaction, TransactionType } from '$lib/server/entities/PointTransaction.js';
import { Notification, NotificationPriority } from '$lib/server/entities/Notification.js';
import { hashPassword, generateToken, isValidEmail, isValidPassword, isValidUsername } from '$lib/server/auth.js';

export async function POST({ request }) {
	try {
		const { username, email, password, name, nickname } = await request.json();

		// 입력값 검증
		if (!username || !email || !password || !name) {
			return json({ error: '필수 정보를 모두 입력해주세요.' }, { status: 400 });
		}

		if (!isValidEmail(email)) {
			return json({ error: '올바른 이메일 형식이 아닙니다.' }, { status: 400 });
		}

		if (!isValidUsername(username)) {
			return json({ error: '사용자명은 3-20자의 영문자, 숫자, 언더스코어만 사용 가능합니다.' }, { status: 400 });
		}

		if (!isValidPassword(password)) {
			return json({ error: '비밀번호는 최소 8자이며, 문자와 숫자를 포함해야 합니다.' }, { status: 400 });
		}

		const dataSource = await getDataSource();
		const userRepository = dataSource.getRepository(User);

		// 중복 검사
		const existingUser = await userRepository.findOne({
			where: [
				{ username },
				{ email }
			]
		});

		if (existingUser) {
			return json({ error: '이미 사용 중인 사용자명 또는 이메일입니다.' }, { status: 409 });
		}

		// 비밀번호 해싱
		const passwordHash = await hashPassword(password);

		// 트랜잭션으로 사용자 생성
		const result = await dataSource.transaction(async manager => {
			// 사용자 생성
			const user = manager.create(User, {
				username,
				email,
				passwordHash,
				name,
				nickname: nickname || name,
				points: 1000, // 가입 축하 포인트
				level: UserLevel.BRONZE,
				role: UserRole.USER
			});

			const savedUser = await manager.save(user);

			// 포인트 이력 추가
			const pointTransaction = manager.create(PointTransaction, {
				userId: savedUser.id,
				type: TransactionType.EARN,
				amount: 1000,
				description: '회원가입 축하 포인트',
				referenceType: 'signup'
			});

			await manager.save(pointTransaction);

			// 웰컴 알림 추가
			const notification = manager.create(Notification, {
				userId: savedUser.id,
				type: 'welcome',
				title: '환영합니다!',
				message: 'FM마케팅에 가입해주셔서 감사합니다. 다양한 체험단에 참여해보세요!',
				priority: NotificationPriority.MEDIUM
			});

			await manager.save(notification);

			return savedUser;
		});

		// JWT 토큰 생성
		const token = generateToken({ userId: result.id, username, email });

		// 사용자 정보 반환 (비밀번호 제외)
		const { passwordHash, ...userInfo } = result;

		return json({ user: userInfo, token }, { status: 201 });

	} catch (error) {
		console.error('회원가입 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}
