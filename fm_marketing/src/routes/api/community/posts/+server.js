// 커뮤니티 게시글 목록 조회/생성 API - 간단한 더미 데이터 버전
import { json } from '@sveltejs/kit';

// 더미 커뮤니티 게시글 데이터
const dummyPosts = [
  {
    id: 1,
    title: '첫 체험단 후기 공유합니다!',
    content: '안녕하세요! 지난주에 처음으로 체험단에 참여했는데요, 너무 좋은 경험이었어서 후기 공유합니다. 강남에 있는 이탈리안 레스토랑이었는데 음식이 정말 맛있었어요.',
    category: '체험 후기',
    author: {
      id: 1,
      nickname: '김철수',
      profileImage: '/images/default-avatar.jpg'
    },
    images: [],
    tags: ['체험단', '후기', '레스토랑'],
    views: 89,
    likes: 12,
    commentCount: 5,
    isPinned: false,
    isDeleted: false,
    createdAt: '2025-02-20T14:30:00Z',
    updatedAt: '2025-02-20T14:30:00Z'
  },
  {
    id: 2,
    title: '체험단 신청할 때 팁 있나요?',
    content: '체험단 신청을 자주 하는데 잘 안 되네요. 혹시 선정되는 팁이 있을까요? 블로그나 인스타 팔로워가 많아야 하나요?',
    category: '질문',
    author: {
      id: 2,
      nickname: '이영희',
      profileImage: '/images/default-avatar.jpg'
    },
    images: [],
    tags: ['체험단', '팁', '질문'],
    views: 145,
    likes: 8,
    commentCount: 12,
    isPinned: false,
    isDeleted: false,
    createdAt: '2025-02-19T10:15:00Z',
    updatedAt: '2025-02-19T10:15:00Z'
  },
  {
    id: 3,
    title: '포인트 환급 받으신 분 계신가요?',
    content: '포인트를 좀 모았는데 환급 받으신 분들 후기가 궁금해요. 얼마나 걸리는지, 어떤 방식으로 받는지 알려주세요!',
    category: '정보 공유',
    author: {
      id: 3,
      nickname: '박민수',
      profileImage: '/images/default-avatar.jpg'
    },
    images: [],
    tags: ['포인트', '환급', '정보'],
    views: 76,
    likes: 6,
    commentCount: 8,
    isPinned: false,
    isDeleted: false,
    createdAt: '2025-02-18T16:45:00Z',
    updatedAt: '2025-02-18T16:45:00Z'
  }
];

export async function GET({ url }) {
  try {
    const category = url.searchParams.get('category') || '';
    const sort = url.searchParams.get('sort') || 'latest';
    const search = url.searchParams.get('search') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    let filteredPosts = [...dummyPosts];

    // 카테고리 필터
    if (category && category !== '전체') {
      filteredPosts = filteredPosts.filter(post => post.category === category);
    }

    // 검색어 필터
    if (search) {
      filteredPosts = filteredPosts.filter(post => 
        post.title.includes(search) || post.content.includes(search)
      );
    }

    // 정렬
    switch (sort) {
      case 'popular':
        filteredPosts.sort((a, b) => (b.views + b.likes) - (a.views + a.likes));
        break;
      case 'comments':
        filteredPosts.sort((a, b) => b.commentCount - a.commentCount);
        break;
      default: // latest
        filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const total = filteredPosts.length;
    const start = (page - 1) * limit;
    const posts = filteredPosts.slice(start, start + limit);

    return json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('커뮤니티 게시글 목록 조회 오류:', error);
    return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    const data = await request.json();
    
    // 간단한 더미 응답
    const newPost = {
      id: Date.now(),
      ...data,
      author: {
        id: 99,
        nickname: '테스트유저',
        profileImage: '/images/default-avatar.jpg'
      },
      views: 0,
      likes: 0,
      commentCount: 0,
      isPinned: false,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return json(newPost, { status: 201 });

  } catch (error) {
    console.error('커뮤니티 게시글 생성 오류:', error);
    return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
