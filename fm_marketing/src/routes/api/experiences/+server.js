// 체험단 목록 조회/생성 API - 간단한 더미 데이터 버전
import { json } from '@sveltejs/kit';

// 더미 체험단 데이터
const dummyExperiences = [
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
    images: ['/images/restaurant1.jpg'],
    tags: ['맛집', '이탈리안', '강남'],
    status: 'active',
    isPromoted: true,
    views: 245,
    likes: 15,
    createdAt: '2025-01-15T10:00:00Z',
    applicationCount: 8,
    creatorName: '관리자'
  },
  {
    id: 2,
    title: '뷰티 신제품 체험단',
    content: '인기 브랜드의 신제품 스킨케어 세트를 체험해보세요.',
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
    requirements: '민감성 피부 불가, 2주 연속 사용 필수',
    companyName: '뷰티랩 코스메틱',
    contactInfo: '02-987-6543',
    images: ['/images/beauty1.jpg'],
    tags: ['뷰티', '스킨케어', '신제품'],
    status: 'active',
    isPromoted: false,
    views: 189,
    likes: 22,
    createdAt: '2025-02-01T14:30:00Z',
    applicationCount: 12,
    creatorName: '관리자'
  },
  {
    id: 3,
    title: '카페 신메뉴 기자단',
    content: '홍대 핫플레이스 카페의 신메뉴 런칭 기자단을 모집합니다.',
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
    requirements: '인스타그램 팔로워 1000명 이상',
    companyName: '카페 모먼트',
    contactInfo: '02-456-7890',
    images: ['/images/cafe1.jpg'],
    tags: ['카페', '홍대', '신메뉴', '인플루언서'],
    status: 'active',
    isPromoted: true,
    views: 567,
    likes: 31,
    createdAt: '2025-02-10T09:00:00Z',
    applicationCount: 15,
    creatorName: '관리자'
  }
];

export async function GET({ url }) {
  try {
    const region = url.searchParams.get('region') || '전체';
    const category = url.searchParams.get('category') || '';
    const type = url.searchParams.get('type') || '';
    const sort = url.searchParams.get('sort') || 'latest';
    const search = url.searchParams.get('search') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    let filteredExperiences = [...dummyExperiences];

    // 지역 필터
    if (region && region !== '전체') {
      filteredExperiences = filteredExperiences.filter(exp => exp.region === region);
    }

    // 카테고리 필터
    if (category && category !== '카테고리') {
      filteredExperiences = filteredExperiences.filter(exp => exp.category === category);
    }

    // 타입 필터
    if (type && type !== '유형') {
      filteredExperiences = filteredExperiences.filter(exp => exp.type === type);
    }

    // 검색어 필터
    if (search) {
      filteredExperiences = filteredExperiences.filter(exp => 
        exp.title.includes(search) || exp.content.includes(search)
      );
    }

    // 정렬
    switch (sort) {
      case 'popular':
        filteredExperiences.sort((a, b) => (b.views + b.likes) - (a.views + a.likes));
        break;
      case 'deadline':
        filteredExperiences.sort((a, b) => new Date(a.applicationDeadline) - new Date(b.applicationDeadline));
        break;
      default: // latest
        filteredExperiences.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const total = filteredExperiences.length;
    const start = (page - 1) * limit;
    const experiences = filteredExperiences.slice(start, start + limit);

    return json({
      experiences,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('체험단 목록 조회 오류:', error);
    return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    const data = await request.json();
    
    // 간단한 더미 응답
    const newExperience = {
      id: Date.now(),
      ...data,
      createdAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      applicationCount: 0,
      creatorName: '관리자'
    };

    return json(newExperience, { status: 201 });

  } catch (error) {
    console.error('체험단 생성 오류:', error);
    return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
