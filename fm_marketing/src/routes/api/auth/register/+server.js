// 회원가입 API - MySQL2 버전
import { json } from '@sveltejs/kit';
import { findUser, executeQuery } from '$lib/server/database.js';
import { hashPassword, generateToken, isValidEmail, isValidPassword, isValidUsername, createUser } from '$lib/server/auth.js';

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

    // 중복 검사
    const existingUserByUsername = await findUser({ username });
    const existingUserByEmail = await findUser({ email });

    if (existingUserByUsername) {
      return json({ error: '이미 사용 중인 사용자명입니다.' }, { status: 409 });
    }

    if (existingUserByEmail) {
      return json({ error: '이미 사용 중인 이메일입니다.' }, { status: 409 });
    }

    // 비밀번호 해싱
    const passwordHash = await hashPassword(password);

    // 새 사용자 생성
    const newUser = await createUser({
      username,
      email,
      passwordHash,
      name,
      nickname: nickname || name,
      points: 1000, // 회원가입 축하 포인트
      level: 'bronze',
      role: 'user',
      isVerified: false
    });

    // JWT 토큰 생성
    const token = await generateToken({ userId: newUser.id });

    // 사용자 정보 반환 (비밀번호 제외)
    const { password_hash, ...userInfo } = newUser;

    return json({ user: userInfo, token }, { status: 201 });

  } catch (error) {
    console.error('회원가입 오류:', error);
    return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
