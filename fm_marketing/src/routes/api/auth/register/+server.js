// 회원가입 API - TypeORM 통합 버전
import { json } from '@sveltejs/kit';
import { getDataSource } from '$lib/server/data-source-unified.js';
import { User, PointTransaction } from '$lib/server/entities/index.js';
import { hashPassword, generateToken, isValidEmail, isValidPassword, isValidUsername } from '$lib/server/auth-unified.js';

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
    const pointRepository = dataSource.getRepository(PointTransaction);

    // 중복 검사
    const existingUser = await userRepository
      .createQueryBuilder('user')
      .where('user.username = :username OR user.email = :email', { username, email })
      .getOne();

    if (existingUser) {
      return json({ error: '이미 사용 중인 사용자명 또는 이메일입니다.' }, { status: 409 });
    }

    // 비밀번호 해싱
    const passwordHash = await hashPassword(password);

    // 트랜잭션으로 사용자 생성 및 포인트 지급
    const result = await dataSource.transaction(async manager => {
      // 사용자 생성
      const user = manager.create(User, {
        username,
        email,
        passwordHash,
        name,
        nickname: nickname || name,
        points: 1000,
        level: 'bronze',
        role: 'user'
      });
      const savedUser = await manager.save(user);

      // 회원가입 축하 포인트 지급
      const pointTransaction = manager.create(PointTransaction, {
        userId: savedUser.id,
        type: 'earn',
        amount: 1000,
        description: '회원가입 축하 포인트',
        referenceType: 'signup'
      });
      await manager.save(pointTransaction);

      return savedUser;
    });

    // JWT 토큰 생성
    const token = await generateToken({ 
      userId: result.id, 
      username: result.username, 
      email: result.email 
    });

    // 사용자 정보 반환 (비밀번호 제외)
    const { passwordHash, ...userInfo } = result;

    return json({ user: userInfo, token }, { status: 201 });

  } catch (error) {
    console.error('회원가입 오류:', error);
    return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
