// 체험단 목록 조회/생성 API - 간소화된 버전
import { json } from '@sveltejs/kit';
import { findExperiences, executeQuery } from '$lib/server/database.js';
import { getUserFromRequest } from '$lib/server/auth.js';

export async function GET({ url }) {
  try {
    console.log('체험단 API 호출됨');
    
    const region = url.searchParams.get('region') || '전체';
    const category = url.searchParams.get('category') || '';
    const type = url.searchParams.get('type') || '';
    const sort = url.searchParams.get('sort') || 'latest';
    const search = url.searchParams.get('search') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    console.log('요청 파라미터:', { region, category, type, sort, search, page, limit });

    // 상태 필터 추가 - active인 체험단만 조회
    const filters = {
      region: region !== '전체' ? region : null,
      category: category !== '카테고리' && category ? category : null,
      type: type !== '유형' && type ? type : null,
      search: search || null,
      sort,
      status: 'active', // active 체험단만
      limit
    };

    console.log('필터 객체:', filters);

    const experiences = await findExperiences(filters);

    console.log('조회된 체험단 수:', experiences.length);

    // 간단한 응답 (페이징 없이)
    return json({
      experiences,
      pagination: {
        page,
        limit,
        total: experiences.length,
        totalPages: 1
      }
    });

  } catch (error) {
    console.error('체험단 목록 조회 오류:', error);
    return json({ 
      error: '서버 오류가 발생했습니다.',
      details: error.message 
    }, { status: 500 });
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
