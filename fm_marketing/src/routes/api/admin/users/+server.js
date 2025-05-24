// 관리자 사용자 관리 API - MySQL2 버전
import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database.js';
import { getUserFromRequest } from '$lib/server/auth.js';

export async function GET({ url, request }) {
  try {
    const user = await getUserFromRequest(request);

    if (!user || user.role !== 'admin') {
      return json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
    }

    const search = url.searchParams.get('search') || '';
    const role = url.searchParams.get('role') || '';
    const level = url.searchParams.get('level') || '';
    const status = url.searchParams.get('status') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // 기본 쿼리
    let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
    let selectQuery = `
      SELECT id, username, email, name, nickname, phone, 
             blog_url, instagram_url, youtube_url,
             points, level, role, is_active, is_verified,
             created_at, updated_at
      FROM users 
      WHERE 1=1
    `;
    let params = [];

    // 검색 조건
    if (search) {
      const searchCondition = ' AND (name LIKE ? OR email LIKE ? OR username LIKE ?)';
      countQuery += searchCondition;
      selectQuery += searchCondition;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // 역할 필터
    if (role && role !== 'all') {
      const roleCondition = ' AND role = ?';
      countQuery += roleCondition;
      selectQuery += roleCondition;
      params.push(role);
    }

    // 레벨 필터
    if (level && level !== 'all') {
      const levelCondition = ' AND level = ?';
      countQuery += levelCondition;
      selectQuery += levelCondition;
      params.push(level);
    }

    // 상태 필터
    if (status && status !== 'all') {
      switch (status) {
        case 'active':
          const activeCondition = ' AND is_active = 1';
          countQuery += activeCondition;
          selectQuery += activeCondition;
          break;
        case 'inactive':
          const inactiveCondition = ' AND is_active = 0';
          countQuery += inactiveCondition;
          selectQuery += inactiveCondition;
          break;
        case 'verified':
          const verifiedCondition = ' AND is_verified = 1';
          countQuery += verifiedCondition;
          selectQuery += verifiedCondition;
          break;
        case 'unverified':
          const unverifiedCondition = ' AND is_verified = 0';
          countQuery += unverifiedCondition;
          selectQuery += unverifiedCondition;
          break;
      }
    }

    // 전체 개수 조회
    const countParams = [...params];
    const [countResult] = await executeQuery(countQuery, countParams);
    const total = countResult?.total || 0;

    // 사용자 목록 조회 - 숫자로 확실히 변환
    selectQuery += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const users = await executeQuery(selectQuery, params);

    return json({
      users: users.map(user => ({
        ...user,
        blogUrl: user.blog_url,
        instagramUrl: user.instagram_url,
        youtubeUrl: user.youtube_url,
        isActive: !!user.is_active,
        isVerified: !!user.is_verified,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('사용자 목록 조회 오류:', error);
    return json({ 
      error: '서버 오류가 발생했습니다.',
      details: error.message 
    }, { status: 500 });
  }
}
