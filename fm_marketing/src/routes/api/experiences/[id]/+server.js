// 체험단 상세 조회 API - 간단한 더미 데이터 버전
import { json } from '@sveltejs/kit';

// 더미 체험단 데이터 (상세 정보 포함)
const dummyExperiences = {
  1: {
    id: 1,
    title: '서울 맛집 탐방 체험단',
    content: '서울 강남구에 새로 오픈한 이탈리안 레스토랑 체험단을 모집합니다. 고급 이탈리안 요리를 무료로 체험하고 솔직한 후기를 작성해주세요. 이 체험단에 참여하시면 5만원 상당의 코스 요리를 무료로 체험할 수 있으며, 추가로 5000 포인트를 적립받으실 수 있습니다.',
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
    requirements: '블로그 또는 인스타그램 후기 필수, 최소 5장 이상 사진 첨부',
    companyName: '벨라비타 레스토랑',
    contactInfo: '02-123-4567, manager@bellavita.co.kr',
    images: ['/images/restaurant1.jpg', '/images/restaurant2.jpg'],
    tags: ['맛집', '이탈리안', '강남', '데이트'],
    status: 'active',
    isPromoted: true,
    views: 245,
    likes: 15,
    createdAt: '2025-01-15T10:00:00Z',
    applicationCount: 8,
    creatorName: '관리자',
    userApplication: null,
    daysAgo: 5
  },
  2: {
    id: 2,
    title: '뷰티 신제품 체험단',
    content: '인기 브랜드의 신제품 스킨케어 세트를 체험해보세요. 2주간 사용 후 상세한 리뷰를 작성해주시면 됩니다.',
    category: '뷰티',
    type: '체험단',
    region: '전국',
    location: '택배 발송',
    startDate: '2025-06-01',
    endDate: '2025-06-30',
    applicationDeadline: '2025-05-30',
    maxParticipants: 20,
    currentParticipants: 8,
    requiredPoints: 1000,
    rewardPoints: 3000,
    rewardDescription: '15만원 상당 스킨케어 세트 + 3000 포인트',
    requirements: '민감성 피부 불가, 2주 연속 사용 필수, 사진 포함 상세 리뷰',
    companyName: '뷰티랩 코스메틱',
    contactInfo: '02-987-6543, pr@beautylab.co.kr',
    images: ['/images/beauty1.jpg', '/images/beauty2.jpg'],
    tags: ['뷰티', '스킨케어', '신제품', '여성'],
    status: 'active',
    isPromoted: false,
    views: 189,
    likes: 22,
    createdAt: '2025-02-01T14:30:00Z',
    applicationCount: 12,
    creatorName: '관리자',
    userApplication: null,
    daysAgo: 7
  },
  3: {
    id: 3,
    title: '카페 신메뉴 기자단',
    content: '홍대 핫플레이스 카페의 신메뉴 런칭 기자단을 모집합니다. 인플루언서 우대하며, 높은 퀄리티의 콘텐츠를 원합니다.',
    category: '카페',
    type: '기자단',
    region: '서울',
    location: '서울특별시 마포구 홍익로 456',
    startDate: '2025-06-20',
    endDate: '2025-06-25',
    applicationDeadline: '2025-06-15',
    maxParticipants: 5,
    currentParticipants: 2,
    requiredPoints: 5000,
    rewardPoints: 10000,
    rewardDescription: '신메뉴 무료 체험 + 1만원 상당 기프트카드',
    requirements: '인스타그램 팔로워 1000명 이상, 고퀄리티 사진/영상 필수',
    companyName: '카페 모먼트',
    contactInfo: '02-456-7890, marketing@cafemoment.co.kr',
    images: ['/images/cafe1.jpg', '/images/cafe2.jpg'],
    tags: ['카페', '홍대', '신메뉴', '인플루언서'],
    status: 'active',
    isPromoted: true,
    views: 567,
    likes: 31,
    createdAt: '2025-02-10T09:00:00Z',
    applicationCount: 15,
    creatorName: '관리자',
    userApplication: null,
    daysAgo: 3
  }
};

export async function GET({ params, request }) {
  try {
    const { id } = params;
    const experienceId = parseInt(id);

    // 더미 데이터에서 체험단 찾기
    const experience = dummyExperiences[experienceId];

    if (!experience) {
      return json({ error: '체험단을 찾을 수 없습니다.' }, { status: 404 });
    }

    // 조회수 증가 (실제로는 DB 업데이트)
    experience.views += 1;

    return json(experience);

  } catch (error) {
    console.error('체험단 상세 조회 오류:', error);
    return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function PUT({ params, request }) {
  try {
    const { id } = params;
    const data = await request.json();
    
    // 간단한 더미 응답
    const updatedExperience = {
      id: parseInt(id),
      ...data,
      updatedAt: new Date().toISOString()
    };

    return json(updatedExperience);

  } catch (error) {
    console.error('체험단 수정 오류:', error);
    return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function DELETE({ params, request }) {
  try {
    const { id } = params;

    return json({ message: '체험단이 삭제되었습니다.' });

  } catch (error) {
    console.error('체험단 삭제 오류:', error);
    return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
