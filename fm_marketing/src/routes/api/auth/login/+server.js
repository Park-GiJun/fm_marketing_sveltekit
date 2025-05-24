// 로그인 API - TypeORM 통합 버전
import { json } from '@sveltejs/kit';
import { getDataSource } from '$lib/server/data-source-unified.js';
import { User, PointTransaction } from '$lib/server/entities/index.js';
import { verifyPassword, generateToken } from '$lib/server/auth-unified.js';

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
    const user = await userRepository
      .createQueryBuilder('user')
      .where('(user.username = :username OR user.email = :username)', { username })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .getOne();

    if (!user) {
      return json({ error: '존재하지 않는 사용자입니다.' }, { status: 401 });
    }

    // 비밀번호 검증
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return json({ error: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
    }

    // 일일 로그인 포인트 지급 확인
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayLogin = await pointRepository
      .createQueryBuilder('point')
      .where('point.userId = :userId', { userId: user.id })
      .andWhere('point.type = :type', { type: 'earn' })
      .andWhere('point.referenceType = :refType', { refType: 'daily_login' })
      .andWhere('DATE(point.createdAt) = CURDATE()')
      .getOne();

    // 오늘 로그인 포인트가 없으면 지급
    if (!todayLogin) {
      await dataSource.transaction(async manager => {
        // 포인트 거래 기록 생성
        const pointTransaction = manager.create(PointTransaction, {
          userId: user.id,
          type: 'earn',
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
    const token = await generateToken({ 
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
