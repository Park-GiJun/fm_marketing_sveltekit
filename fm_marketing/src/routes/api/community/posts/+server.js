// 커뮤니티 게시글 목록 조회/생성 API - 더미 데이터 버전
import { json } from '@sveltejs/kit';

// 더미 커뮤니티 게시글 데이터
const dummyPosts = [
  {
    id: 1,
    title: '강남 맛집 체험 후기',
    content: '강남에 새로 오픈한 이탈리안 레스토랑에 다녀왔습니다. 파스타가 정말 맛있었어요!',
    category: '체험 후기',
    author: {
      id: 1,
      nickname: '체험러버',
      profileImage: '/images/avatars/user1.jpg'
    },
    views: 156,
    likes: 12,
    commentCount: 8,
    tags: ['맛집', '이탈리안', '강남'],
    images: ['/images/posts/post1.jpg'],
    createdAt: '2025-02-20T10:30:00Z'
  },
  {
    id: 2,
    title: '뷰티 제품 사용 후기 공유',
    content: '최근에 받은 스킨케어 제품을 사용해보고 솔직한 후기를 남겨봅니다.',
    category: '체험 후기',
    author: {
      id: 2,
      nickname: '뷰티덕후',
      profileImage: '/images/avatars/user2.jpg'
    },
    views: 89,
    likes: 5,
    commentCount: 3,
    tags: ['뷰티', '스킨케어'],
    images: [],
    createdAt: '2025-02-19T15:20:00Z'
  },
  {
    id: 3,
    title: '체험단 신청 팁 공유',
    content: '체험단에 선정되는 확률을 높이는 방법들을 공유해드려요.',
    category: '정보 공유',
    author: {
      id: 3,
      nickname: '체험달인',
      profileImage: '/images/avatars/user3.jpg'
    },
    views: 234,
    likes: 18,
    commentCount: 15,
    tags: ['팁', '체험단'],
    images: [],
    createdAt: '2025-02-18T09:45:00Z'
  },
  {
    id: 4,
    title: '블로그 리뷰 작성법 질문',
    content: '체험단 활동 후 블로그에 리뷰를 작성할 때 어떤 점들을 주의해야 할까요?',
    category: '질문',
    author: {
      id: 4,
      nickname: '신규체험러',
      profileImage: '/images/avatars/user4.jpg'
    },
    views: 67,
    likes: 3,
    commentCount: 7,
    tags: ['블로그', '리뷰'],
    images: [],
    createdAt: '2025-02-17T14:10:00Z'
  },
  {
    id: 5,
    title: '이번 주말 추천 체험단',
    content: '주말에 참여하기 좋은 체험단들을 모아봤어요.',
    category: '정보 공유',
    author: {
      id: 5,
      nickname: '주말여행가',
      profileImage: '/images/avatars/user5.jpg'
    },
    views: 178,
    likes: 14,
    commentCount: 6,
    tags: ['주말', '추천'],
    images: ['/images/posts/post5.jpg'],
    createdAt: '2025-02-16T11:30:00Z'
  }
];

export async function GET({ url }) {
  try {
    console.log('커뮤니티 게시글 API 호출됨');
    
    const category = url.searchParams.get('category') || '';
    const sort = url.searchParams.get('sort') || 'latest';
    const search = url.searchParams.get('search') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    console.log('요청 파라미터:', { category, sort, search, page, limit });

    let filteredPosts = [...dummyPosts];

    // 카테고리 필터
    if (category && category !== '전체' && category !== '') {
      filteredPosts = filteredPosts.filter(post => post.category === category);
    }

    // 검색 필터
    if (search) {
      filteredPosts = filteredPosts.filter(post => 
        post.title.includes(search) || post.content.includes(search)
      );
    }

    // 정렬
    if (sort === 'popular') {
      filteredPosts.sort((a, b) => (b.views + b.likes) - (a.views + a.likes));
    } else if (sort === 'comments') {
      filteredPosts.sort((a, b) => b.commentCount - a.commentCount);
    } else {
      // 최신순 (기본)
      filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // 간단한 페이징
    const total = filteredPosts.length;
    const start = (page - 1) * limit;
    const posts = filteredPosts.slice(start, start + limit);

    console.log('필터링된 게시글 수:', posts.length);

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
    return json({ 
      error: '서버 오류가 발생했습니다.',
      details: error.message 
    }, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const data = await request.json();
    
    const sql = `
      INSERT INTO community_posts (title, content, category, author_id, images, tags)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const params = [
      data.title,
      data.content,
      data.category,
      user.id,
      JSON.stringify(data.images || []),
      JSON.stringify(data.tags || [])
    ];

    const result = await executeQuery(sql, params);

    // 생성된 게시글 조회
    const [newPost] = await executeQuery(`
      SELECT p.*, u.nickname, u.profile_image
      FROM community_posts p 
      LEFT JOIN users u ON p.author_id = u.id 
      WHERE p.id = ?
    `, [result.insertId]);

    return json({
      ...newPost,
      images: JSON.parse(newPost.images || '[]'),
      tags: JSON.parse(newPost.tags || '[]'),
      author: {
        id: newPost.author_id,
        nickname: newPost.nickname || user.nickname,
        profileImage: newPost.profile_image || '/images/default-avatar.jpg'
      },
      commentCount: 0
    }, { status: 201 });

  } catch (error) {
    console.error('커뮤니티 게시글 생성 오류:', error);
    return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
