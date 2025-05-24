// 회원가입 API
import { json } from '@sveltejs/kit';
import { getDataSource } from '$lib/server/database-init.js';
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

    // 중복 검사
    const [existingUser] = await dataSource.query(`
      SELECT id FROM users WHERE username = ? OR email = ?
    `, [username, email]);

    if (existingUser) {
      return json({ error: '이미 사용 중인 사용자명 또는 이메일입니다.' }, { status: 409 });
    }

    // 비밀번호 해싱
    const passwordHash = await hashPassword(password);

    // 사용자 생성
    const result = await dataSource.query(`
      INSERT INTO users (username, email, password_hash, name, nickname, points, level, role)
      VALUES (?, ?, ?, ?, ?, 1000, 'bronze', 'user')
    `, [username, email, passwordHash, name, nickname || name]);

    const userId = result.insertId;

    // 포인트 이력 추가
    await dataSource.query(`
      INSERT INTO point_transactions (user_id, type, amount, description, reference_type)
      VALUES (?, 'earn', 1000, '회원가입 축하 포인트', 'signup')
    `, [userId]);

    // 생성된 사용자 정보 조회
    const [newUser] = await dataSource.query(`
      SELECT id, username, email, name, nickname, profile_image, points, level, role, is_active, is_verified
      FROM users WHERE id = ?
    `, [userId]);

    // JWT 토큰 생성
    const token = await generateToken({ userId: newUser.id, username, email });

    return json({ user: newUser, token }, { status: 201 });

  } catch (error) {
    console.error('회원가입 오류:', error);
    return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
