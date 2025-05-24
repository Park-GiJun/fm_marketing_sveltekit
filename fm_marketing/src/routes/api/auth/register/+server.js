// 회원가입 API - 간단한 더미 데이터 버전
import { json } from '@sveltejs/kit';

// 간단한 유효성 검사 함수들
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password) {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

function isValidUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

// 더미 사용자 데이터베이스 (실제로는 데이터베이스 사용)
const dummyUsers = [
  { id: 1, username: 'admin', email: 'admin@fmmarketing.com' },
  { id: 2, username: 'user1', email: 'user1@example.com' },
  { id: 3, username: 'user2', email: 'user2@example.com' }
];

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

    // 중복 검사 (더미 데이터)
    const existingUser = dummyUsers.find(user => 
      user.username === username || user.email === email
    );

    if (existingUser) {
      return json({ error: '이미 사용 중인 사용자명 또는 이메일입니다.' }, { status: 409 });
    }

    // 새 사용자 생성 (더미)
    const newUser = {
      id: Date.now(),
      username,
      email,
      name,
      nickname: nickname || name,
      points: 1000,
      level: 'bronze',
      role: 'user',
      isActive: true,
      isVerified: false,
      createdAt: new Date().toISOString()
    };

    // 더미 JWT 토큰 생성
    const token = `dummy-jwt-token-${Date.now()}`;

    return json({ user: newUser, token }, { status: 201 });

  } catch (error) {
    console.error('회원가입 오류:', error);
    return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
