// 커뮤니티 게시글 목록 조회/생성 API - MySQL2 버전
import { json } from '@sveltejs/kit';
import { findCommunityPosts, executeQuery } from '$lib/server/database.js';
import { getUserFromRequest } from '$lib/server/auth.js';

export async function GET({ url }) {
  try {
    const category = url.searchParams.get('category') || '';
    const sort = url.searchParams.get('sort') || 'latest';
    const search = url.searchParams.get('search') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    const filters = {
      category: category !== '전체' ? category : null,
      search: search || null,
      sort,
      limit,
      offset: (page - 1) * limit
    };

    const posts = await findCommunityPosts(filters);

    // 총 개수 조회 (페이징용)
    let countSql = 'SELECT COUNT(*) as total FROM community_posts WHERE is_deleted = 0';
    let countParams = [];

    if (filters.category) {
      countSql += ' AND category = ?';
      countParams.push(filters.category);
    }

    if (filters.search) {
      countSql += ' AND (title LIKE ? OR content LIKE ?)';
      countParams.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    const [{ total }] = await executeQuery(countSql, countParams);

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
