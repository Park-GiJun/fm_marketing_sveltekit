// 체험단 상세 조회 API - MySQL2 버전
import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database.js';

export async function GET({ params, request }) {
  try {
    const { id } = params;
    const experienceId = parseInt(id);

    // 체험단 상세 조회
    const [experience] = await executeQuery(`
      SELECT e.*, u.name as creator_name 
      FROM experiences e 
      LEFT JOIN users u ON e.created_by = u.id 
      WHERE e.id = ? AND e.status = 'active'
    `, [experienceId]);

    if (!experience) {
      return json({ error: '체험단을 찾을 수 없습니다.' }, { status: 404 });
    }

    // 조회수 증가
    await executeQuery('UPDATE experiences SET views = views + 1 WHERE id = ?', [experienceId]);
    experience.views += 1;

    // JSON 필드 파싱
    const result = {
      ...experience,
      images: experience.images ? JSON.parse(experience.images) : [],
      tags: experience.tags ? JSON.parse(experience.tags) : [],
      creatorName: experience.creator_name,
      daysAgo: Math.ceil((new Date(experience.application_deadline) - new Date()) / (1000 * 60 * 60 * 24))
    };

    return json(result);

  } catch (error) {
    console.error('체험단 상세 조회 오류:', error);
    return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function PUT({ params, request }) {
  try {
    const { id } = params;
    const data = await request.json();
    
    const sql = `
      UPDATE experiences 
      SET title = ?, content = ?, category = ?, type = ?, region = ?, 
          location = ?, start_date = ?, end_date = ?, application_deadline = ?,
          max_participants = ?, required_points = ?, reward_points = ?,
          reward_description = ?, requirements = ?, company_name = ?,
          contact_info = ?, images = ?, tags = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
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
      data.requiredPoints,
      data.rewardPoints,
      data.rewardDescription,
      data.requirements,
      data.companyName,
      data.contactInfo,
      JSON.stringify(data.images || []),
      JSON.stringify(data.tags || []),
      parseInt(id)
    ];

    await executeQuery(sql, params);

    // 수정된 체험단 조회
    const [updatedExperience] = await executeQuery(`
      SELECT e.*, u.name as creator_name 
      FROM experiences e 
      LEFT JOIN users u ON e.created_by = u.id 
      WHERE e.id = ?
    `, [parseInt(id)]);

    return json({
      ...updatedExperience,
      images: JSON.parse(updatedExperience.images || '[]'),
      tags: JSON.parse(updatedExperience.tags || '[]'),
      creatorName: updatedExperience.creator_name
    });

  } catch (error) {
    console.error('체험단 수정 오류:', error);
    return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function DELETE({ params, request }) {
  try {
    const { id } = params;

    await executeQuery('UPDATE experiences SET status = "closed" WHERE id = ?', [parseInt(id)]);

    return json({ message: '체험단이 삭제되었습니다.' });

  } catch (error) {
    console.error('체험단 삭제 오류:', error);
    return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
