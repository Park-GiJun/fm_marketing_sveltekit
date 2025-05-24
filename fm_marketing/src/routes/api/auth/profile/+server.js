// 사용자 프로필 조회/수정 API - 간단한 더미 데이터 버전
import { json } from '@sveltejs/kit';

// 더미 사용자 데이터
const dummyUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  name: '테스트 사용자',
  nickname: '테스트',
  profileImage: null,
  phone: null,
  birthDate: null,
  gender: null,
  address: null,
  blogUrl: null,
  instagramUrl: null,
  youtubeUrl: null,
  points: 5000,
  level: 'bronze',
  role: 'user',
  isActive: true,
  isVerified: true,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z'
};

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function GET({ request }) {
  try {
    // 더미 인증 체크 (실제로는 JWT 토큰 검증)
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    return json(dummyUser);

  } catch (error) {
    console.error('프로필 조회 오류:', error);
    return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function PUT({ request }) {
  try {
    // 더미 인증 체크
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const data = await request.json();
    const {
      email, name, nickname, phone, birthDate, gender,
      address, blogUrl, instagramUrl, youtubeUrl
    } = data;

    // 이메일 유효성 검사
    if (email && !isValidEmail(email)) {
      return json({ error: '올바른 이메일 형식이 아닙니다.' }, { status: 400 });
    }

    // 더미 사용자 정보 업데이트
    const updatedUser = {
      ...dummyUser,
      email: email || dummyUser.email,
      name: name || dummyUser.name,
      nickname: nickname !== undefined ? nickname : dummyUser.nickname,
      phone: phone !== undefined ? phone : dummyUser.phone,
      birthDate: birthDate !== undefined ? birthDate : dummyUser.birthDate,
      gender: gender !== undefined ? gender : dummyUser.gender,
      address: address !== undefined ? address : dummyUser.address,
      blogUrl: blogUrl !== undefined ? blogUrl : dummyUser.blogUrl,
      instagramUrl: instagramUrl !== undefined ? instagramUrl : dummyUser.instagramUrl,
      youtubeUrl: youtubeUrl !== undefined ? youtubeUrl : dummyUser.youtubeUrl,
      updatedAt: new Date().toISOString()
    };

    return json(updatedUser);

  } catch (error) {
    console.error('프로필 수정 오류:', error);
    return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
