// 체험단 목록 조회/생성 API
import { json } from '@sveltejs/kit';
import { getDataSource } from '$lib/server/database-init.js';
import { getUserFromRequest } from '$lib/server/auth.js';

export async function GET({ url }) {
  try {
    const region = url.searchParams.get('region') || '전체';
    const category = url.searchParams.get('category') || '';
    const type = url.searchParams.get('type') || '';
    const sort = url.searchParams.get('sort') || 'latest';
    const search = url.searchParams.get('search') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const dataSource = await getDataSource();

    // 기본 쿼리
    let whereClause = "WHERE status = 'active'";
    let params = [];

    // 지역 필터
    if (region && region !== '전체') {
      whereClause += " AND region = ?";
      params.push(region);
    }

    // 카테고리 필터
    if (category && category !== '카테고리') {
      whereClause += " AND category = ?";
      params.push(category);
    }

    // 타입 필터
    if (type && type !== '유형') {
      whereClause += " AND type = ?";
      params.push(type);
    }

    // 검색어 필터
    if (search) {
      whereClause += " AND (title LIKE ? OR content LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    // 정렬 조건
    let orderClause = "ORDER BY created_at DESC";
    if (sort === 'popular') {
      orderClause = "ORDER BY views DESC, likes DESC";
    } else if (sort === 'deadline') {
      orderClause = "ORDER BY application_deadline ASC";
    }

    // 총 개수 조회
    const [countResult] = await dataSource.query(`
      SELECT COUNT(*) as total FROM experiences ${whereClause}
    `, params);

    const total = countResult.total;

    // 데이터 조회
    const experiences = await dataSource.query(`
      SELECT e.*, u.name as creator_name 
      FROM experiences e 
      LEFT JOIN users u ON e.created_by = u.id 
      ${whereClause} 
      ${orderClause} 
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    // JSON 필드 파싱
    const processedExperiences = experiences.map(exp => ({
      ...exp,
      images: exp.images ? JSON.parse(exp.images) : [],
      tags: exp.tags ? JSON.parse(exp.tags) : []
    }));

    return json({
      experiences: processedExperiences,
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
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    if (user.role !== 'admin') {
      return json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
    }

    const data = await request.json();
    const {
      title, content, category, type, region, location,
      startDate, endDate, applicationDeadline,
      maxParticipants, requiredPoints, rewardPoints,
      rewardDescription, requirements, companyName,
      contactInfo, images, tags, isPromoted
    } = data;

    // 필수 필드 검증
    if (!title || !content || !category || !type || !region) {
      return json({ error: '필수 정보를 모두 입력해주세요.' }, { status: 400 });
    }

    const dataSource = await getDataSource();

    const result = await dataSource.query(`
      INSERT INTO experiences (
        title, content, category, type, region, location,
        start_date, end_date, application_deadline,
        max_participants, required_points, reward_points,
        reward_description, requirements, company_name,
        contact_info, images, tags, is_promoted, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      title, content, category, type, region, location,
      startDate, endDate, applicationDeadline,
      maxParticipants, requiredPoints || 0, rewardPoints || 0,
      rewardDescription, requirements, companyName,
      contactInfo, JSON.stringify(images || []), JSON.stringify(tags || []), 
      isPromoted || false, user.id
    ]);

    return json({ id: result.insertId, message: '체험단이 생성되었습니다.' }, { status: 201 });

  } catch (error) {
    console.error('체험단 생성 오류:', error);
    return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
