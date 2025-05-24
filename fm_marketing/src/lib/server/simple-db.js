// 간단한 더미 데이터베이스 (TypeORM 없이 사용)
import { dev } from '$app/environment';

// 더미 데이터 저장소
const dummyData = {
  users: [
    {
      id: 1,
      username: 'admin',
      email: 'admin@fmmarketing.com',
      passwordHash: '$2a$12$dummy.hash.for.admin123!',
      name: '관리자',
      nickname: '관리자',
      points: 50000,
      level: 'platinum',
      role: 'admin',
      isActive: true,
      isVerified: true,
      createdAt: '2025-01-01T00:00:00Z'
    },
    {
      id: 2,
      username: 'user1',
      email: 'user1@example.com',
      passwordHash: '$2a$12$dummy.hash.for.user123!',
      name: '김철수',
      nickname: '철수',
      points: 5000,
      level: 'bronze',
      role: 'user',
      isActive: true,
      isVerified: true,
      createdAt: '2025-01-01T00:00:00Z'
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
      startDate: '2025-06-15',
      endDate: '2025-06-30',
      applicationDeadline: '2025-06-10',
      maxParticipants: 10,
      currentParticipants: 3,
      requiredPoints: 0,
      rewardPoints: 5000,
      rewardDescription: '5만원 상당 코스 요리 + 5000 포인트',
      requirements: '블로그 또는 인스타그램 후기 필수',
      companyName: '벨라비타 레스토랑',
      contactInfo: '02-123-4567',
      images: JSON.stringify(['/images/restaurant1.jpg']),
      tags: JSON.stringify(['맛집', '이탈리안', '강남']),
      status: 'active',
      isPromoted: true,
      views: 245,
      likes: 15,
      createdById: 1,
      createdAt: '2025-01-15T10:00:00Z'
    }
  ],
  communityPosts: [
    {
      id: 1,
      title: '첫 체험단 후기 공유합니다!',
      content: '안녕하세요! 지난주에 처음으로 체험단에 참여했는데요, 너무 좋은 경험이었어서 후기 공유합니다.',
      category: '체험 후기',
      authorId: 2,
      images: JSON.stringify([]),
      tags: JSON.stringify(['체험단', '후기', '레스토랑']),
      views: 89,
      likes: 12,
      isPinned: false,
      isDeleted: false,
      createdAt: '2025-02-20T14:30:00Z'
    }
  ]
};

/**
 * 더미 데이터베이스 초기화
 */
export async function initializeSimpleDb() {
  console.log('✅ 더미 데이터베이스 초기화 완료');
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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
  
  return results;
}

/**
 * 더미 체험단 상세 조회
 */
export function findExperienceById(id) {
  return dummyData.experiences.find(exp => exp.id === parseInt(id));
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
    author: findUser({ id: post.authorId }),
    images: JSON.parse(post.images || '[]'),
    tags: JSON.parse(post.tags || '[]'),
    commentCount: 0
  }));
}

/**
 * 더미 게시글 생성
 */
export function createCommunityPost(postData) {
  const newPost = {
    id: Date.now(),
    ...postData,
    images: JSON.stringify(postData.images || []),
    tags: JSON.stringify(postData.tags || []),
    views: 0,
    likes: 0,
    isPinned: false,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  dummyData.communityPosts.push(newPost);
  
  return {
    ...newPost,
    author: findUser({ id: newPost.authorId }),
    images: JSON.parse(newPost.images),
    tags: JSON.parse(newPost.tags),
    commentCount: 0
  };
}

// Export 더미 데이터
export { dummyData };
