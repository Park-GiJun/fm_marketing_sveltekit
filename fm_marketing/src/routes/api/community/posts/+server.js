// 커뮤니티 게시글 목록 조회/생성 API - MySQL2 버전
import { json } from '@sveltejs/kit';
import { executeQuery, findCommunityPosts } from '$lib/server/database.js';
import { getUserFromRequest } from '$lib/server/auth.js';

export async function GET({ url }) {
  try {
    console.log('커뮤니티 게시글 API 호출됨');
    
    const category = url.searchParams.get('category') || '';
    const sort = url.searchParams.get('sort') || 'latest';
    const search = url.searchParams.get('search') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    console.log('요청 파라미터:', { category, sort, search, page, limit });

    // 필터 객체 생성
    const filters = {
      category: category !== '전체' && category ? category : null,
      search: search || null,
      sort,
      limit
    };

    console.log('필터 객체:', filters);

    // 데이터베이스에서 게시글 조회
    const posts = await findCommunityPosts(filters);

    console.log('조회된 게시글 수:', posts.length);

    // 간단한 응답 (페이징 없이)
    return json({
      posts,
      pagination: {
        page,
        limit,
        total: posts.length,
        totalPages: 1
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
    
    // 필수 필드 검증
    if (!data.title || !data.content || !data.category) {
      return json({ error: '필수 정보를 모두 입력해주세요.' }, { status: 400 });
    }
    
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