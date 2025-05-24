// 로그인 API - MySQL2 버전
import { json } from '@sveltejs/kit';
import { findUser, executeQuery } from '$lib/server/database.js';
import { verifyPassword, generateToken } from '$lib/server/auth.js';

export async function POST({ request }) {
  try {
    const { username, password } = await request.json();

    // 입력값 검증
    if (!username || !password) {
      return json({ error: '사용자명과 비밀번호를 입력해주세요.' }, { status: 400 });
    }

    // 사용자 조회 (username 또는 email로 로그인 가능)
    let user = await findUser({ username });
    if (!user) {
      user = await findUser({ email: username });
    }

    if (!user) {
      return json({ error: '존재하지 않는 사용자입니다.' }, { status: 401 });
    }

    // 비밀번호 검증
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return json({ error: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
    }

    // 일일 로그인 포인트 지급 (10포인트)
    await executeQuery('UPDATE users SET points = points + 10 WHERE id = ?', [user.id]);
    user.points += 10;

    // JWT 토큰 생성
    const token = await generateToken({ userId: user.id });

    // 사용자 정보 반환 (비밀번호 제외)
    const { password_hash, ...userInfo } = user;

    return json({ user: userInfo, token });

  } catch (error) {
    console.error('로그인 오류:', error);
    return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
