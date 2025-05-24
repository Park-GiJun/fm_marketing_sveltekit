// 로그인 API
import { json } from '@sveltejs/kit';
import { getDataSource } from '$lib/server/database-init.js';
import { verifyPassword, generateToken } from '$lib/server/auth.js';

export async function POST({ request }) {
  try {
    const { username, password } = await request.json();

    // 입력값 검증
    if (!username || !password) {
      return json({ error: '사용자명과 비밀번호를 입력해주세요.' }, { status: 400 });
    }

    const dataSource = await getDataSource();

    // 사용자 조회 (username 또는 email로 로그인 가능)
    const [user] = await dataSource.query(`
      SELECT id, username, email, password_hash, name, nickname, profile_image, points, level, role, is_active, is_verified
      FROM users 
      WHERE (username = ? OR email = ?) AND is_active = 1
    `, [username, username]);

    if (!user) {
      return json({ error: '존재하지 않는 사용자입니다.' }, { status: 401 });
    }

    // 비밀번호 검증
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return json({ error: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
    }

    // 로그인 포인트 지급 (일일 첫 로그인)
    const today = new Date().toISOString().split('T')[0];
    const [todayLogin] = await dataSource.query(`
      SELECT id FROM point_transactions 
      WHERE user_id = ? AND type = 'earn' AND reference_type = 'daily_login' AND DATE(created_at) = ?
    `, [user.id, today]);

    // 오늘 로그인 포인트가 없으면 지급
    if (!todayLogin) {
      await dataSource.query(`
        INSERT INTO point_transactions (user_id, type, amount, description, reference_type)
        VALUES (?, 'earn', 10, '일일 로그인 포인트', 'daily_login')
      `, [user.id]);

      await dataSource.query(`
        UPDATE users SET points = points + 10 WHERE id = ?
      `, [user.id]);

      user.points += 10;
    }

    // JWT 토큰 생성
    const token = await generateToken({ 
      userId: user.id, 
      username: user.username, 
      email: user.email 
    });

    // 사용자 정보 반환 (비밀번호 제외)
    const { password_hash, ...userInfo } = user;

    return json({ user: userInfo, token });

  } catch (error) {
    console.error('로그인 오류:', error);
    return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
