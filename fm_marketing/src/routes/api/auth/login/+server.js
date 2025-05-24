// 로그인 API - 간단한 더미 데이터 버전
import { json } from '@sveltejs/kit';

// 더미 사용자 데이터베이스
const dummyUsers = [
  { 
    id: 1, 
    username: 'admin', 
    email: 'admin@fmmarketing.com', 
    password: 'admin123!',
    name: '관리자',
    nickname: '관리자',
    points: 50000,
    level: 'platinum',
    role: 'admin',
    isActive: true,
    isVerified: true
  },
  { 
    id: 2, 
    username: 'user1', 
    email: 'user1@example.com', 
    password: 'user123!',
    name: '김철수',
    nickname: '철수',
    points: 5000,
    level: 'bronze',
    role: 'user',
    isActive: true,
    isVerified: true
  },
  { 
    id: 3, 
    username: 'user2', 
    email: 'user2@example.com', 
    password: 'user123!',
    name: '이영희',
    nickname: '영희',
    points: 12000,
    level: 'silver',
    role: 'user',
    isActive: true,
    isVerified: true
  }
];

export async function POST({ request }) {
  try {
    const { username, password } = await request.json();

    // 입력값 검증
    if (!username || !password) {
      return json({ error: '사용자명과 비밀번호를 입력해주세요.' }, { status: 400 });
    }

    // 사용자 조회 (username 또는 email로 로그인 가능)
    const user = dummyUsers.find(u => 
      (u.username === username || u.email === username) && u.isActive
    );

    if (!user) {
      return json({ error: '존재하지 않는 사용자입니다.' }, { status: 401 });
    }

    // 비밀번호 검증 (실제로는 해시 비교)
    if (user.password !== password) {
      return json({ error: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
    }

    // 일일 로그인 포인트 지급 (더미)
    user.points += 10;

    // 더미 JWT 토큰 생성
    const token = `dummy-jwt-token-${user.id}-${Date.now()}`;

    // 사용자 정보 반환 (비밀번호 제외)
    const { password: _, ...userInfo } = user;

    return json({ user: userInfo, token });

  } catch (error) {
    console.error('로그인 오류:', error);
    return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
