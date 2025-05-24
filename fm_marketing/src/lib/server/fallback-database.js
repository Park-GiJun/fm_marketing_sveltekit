// 데이터베이스 연결 실패 시 폴백 시스템
import { dev } from '$app/environment';

// 더미 데이터 저장소
const dummyData = {
  users: [
    {
      id: 1,
      username: 'admin',
      email: 'admin@fmmarketing.com',
      password_hash: '$2a$12$dummy.hash.for.admin123!',
      name: '관리자',
      nickname: '관리자',
      points: 50000,
      level: 'platinum',
      role: 'admin',
      is_active: true,
      is_verified: true,
      created_at: '2025-01-01T00:00:00Z'
    },
    {
      id: 2,
      username: 'user1',
      email: 'user1@example.com',
      password_hash: '$2a$12$dummy.hash.for.user123!',
      name: '김철수',
      nickname: '철수',
      points: 5000,
      level: 'bronze',
      role: 'user',
      is_active: true,
      is_verified: true,
      created_at: '2025-01-01T00:00:00Z'
    }
  ],
  experiences: [
    {
      id: 1,
      title: '서울 맛집 탐방 체험단',
      content: '서울 강남구에 새로 오픈한 이탈리안 레스토랑 체험단을 모집합니다.',
      category: '음식점',
      type: '체험단',
      region: '서울',
      location: '서울특별시 강남구 테헤란로 123',
      start_date: '2025-06-15',
      end_date: '2025-06-30',
      application_deadline: '2025-06-10',
      max_participants: 10,
      current_participants: 3,
      required_points: 0,
      reward_points: 5000,
      reward_description: '5만원 상당 코스 요리 + 5000 포인트',
      requirements: '블로그 또는 인스타그램 후기 필수',
      company_name: '벨라비타 레스토랑',
      contact_info: '02-123-4567',
      images: JSON.stringify(['/images/restaurant1.jpg']),
      tags: JSON.stringify(['맛집', '이탈리안', '강남']),
      status: 'active',
      is_promoted: true,
      views: 245,
      likes: 15,
      created_by: 1,
      created_at: '2025-01-15T10:00:00Z',
      creator_name: '관리자',
      daysAgo: 7
    }
  ],
  communityPosts: [
    {
      id: 1,
      title: '첫 체험단 후기 공유합니다!',
      content: '안녕하세요! 지난주에 처음으로 체험단에 참여했는데요, 너무 좋은 경험이었어서 후기 공유합니다.',
      category: '체험 후기',
      author_id: 2,
      images: JSON.stringify([]),
      tags: JSON.stringify(['체험단', '후기', '레스토랑']),
      views: 89,
      likes: 12,
      is_pinned: false,
      is_deleted: false,
      created_at: '2025-02-20T14:30:00Z',
      author: {
        id: 2,
        nickname: '철수',
        profileImage: '/images/default-avatar.jpg'
      }
    }
  ]
};

/**
 * 폴백 데이터베이스 초기화
 */
export async function initializeFallbackDatabase() {
  console.log('🔄 폴백 더미 데이터베이스 초기화 중...');
  console.log('✅ 폴백 데이터베이스 초기화 완료');
  return true;
}

/**
 * 더미 사용자 조회
 */
export function findUser(criteria) {
  return dummyData.users.find(user => {
    if (criteria.id) return user.id === criteria.id;
    if (criteria.username) return user.username === criteria.username;
    if (criteria.email) return user.email === criteria.email;
    return false;
  });
}

/**
 * 더미 사용자 생성
 */
export function createUser(userData) {
  const newUser = {
    id: Date.now(),
    ...userData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  dummyData.users.push(newUser);
  return newUser;
}

/**
 * 더미 체험단 조회
 */
export function findExperiences(filters = {}) {
  let results = [...dummyData.experiences];
  
  if (filters.region && filters.region !== '전체') {
    results = results.filter(exp => exp.region === filters.region);
  }
  
  if (filters.category && filters.category !== '카테고리') {
    results = results.filter(exp => exp.category === filters.category);
  }
  
  return results.map(exp => ({
    ...exp,
    images: JSON.parse(exp.images || '[]'),
    tags: JSON.parse(exp.tags || '[]')
  }));
}

/**
 * 더미 커뮤니티 게시글 조회
 */
export function findCommunityPosts(filters = {}) {
  let results = [...dummyData.communityPosts];
  
  if (filters.category && filters.category !== '전체') {
    results = results.filter(post => post.category === filters.category);
  }
  
  return results.map(post => ({
    ...post,
    images: JSON.parse(post.images || '[]'),
    tags: JSON.parse(post.tags || '[]'),
    commentCount: 0
  }));
}

/**
 * 더미 쿼리 실행 (항상 빈 배열 반환)
 */
export function executeQuery(sql, params = []) {
  console.log('더미 쿼리 실행:', sql.substring(0, 50) + '...');
  return Promise.resolve([]);
}

export { dummyData };
