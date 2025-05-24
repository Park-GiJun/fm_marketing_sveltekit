// 체험단 목록 조회/생성 API - MySQL2 버전
import { json } from '@sveltejs/kit';
import { findExperiences, executeQuery } from '$lib/server/database.js';
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

    const filters = {
      region: region !== '전체' ? region : null,
      category: category !== '카테고리' ? category : null,
      type: type !== '유형' ? type : null,
      search: search || null,
      sort,
      limit,
      offset: (page - 1) * limit
    };

    const experiences = await findExperiences(filters);

    // 총 개수 조회 (페이징용)
    let countSql = 'SELECT COUNT(*) as total FROM experiences WHERE status = "active"';
    let countParams = [];

    if (filters.region) {
      countSql += ' AND region = ?';
      countParams.push(filters.region);
    }

    if (filters.category) {
      countSql += ' AND category = ?';
      countParams.push(filters.category);
    }

    if (filters.type) {
      countSql += ' AND type = ?';
      countParams.push(filters.type);
    }

    if (filters.search) {
      countSql += ' AND (title LIKE ? OR content LIKE ?)';
      countParams.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    const [{ total }] = await executeQuery(countSql, countParams);

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
    const user = await getUserFromRequest(request);

    if (!user || user.role !== 'admin') {
      return json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
    }

    const data = await request.json();
    
    const sql = `
      INSERT INTO experiences (
        title, content, category, type, region, location, 
        start_date, end_date, application_deadline, max_participants,
        required_points, reward_points, reward_description, requirements,
        company_name, contact_info, images, tags, status, is_promoted, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      data.title,
      data.content,
      data.category,
      data.type,
      data.region,
      data.location,
      data.startDate,
      data.endDate,
      data.applicationDeadline,
      data.maxParticipants,
      data.requiredPoints || 0,
      data.rewardPoints || 0,
      data.rewardDescription,
      data.requirements,
      data.companyName,
      data.contactInfo,
      JSON.stringify(data.images || []),
      JSON.stringify(data.tags || []),
      data.status || 'active',
      data.isPromoted || false,
      user.id
    ];

    const result = await executeQuery(sql, params);

    // 생성된 체험단 조회
    const [newExperience] = await executeQuery(
      'SELECT e.*, u.name as creator_name FROM experiences e LEFT JOIN users u ON e.created_by = u.id WHERE e.id = ?',
      [result.insertId]
    );

    return json({
      ...newExperience,
      images: JSON.parse(newExperience.images || '[]'),
      tags: JSON.parse(newExperience.tags || '[]'),
      creatorName: newExperience.creator_name
    }, { status: 201 });

  } catch (error) {
    console.error('체험단 생성 오류:', error);
    return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
