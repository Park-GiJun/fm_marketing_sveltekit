// 관리자 사용자 개별 관리 API - MySQL2 버전
import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database.js';
import { getUserFromRequest } from '$lib/server/auth.js';

export async function PATCH({ params, request }) {
  try {
    const user = await getUserFromRequest(request);

    if (!user || user.role !== 'admin') {
      return json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
    }

    const { id } = params;
    const userId = parseInt(id);
    const updates = await request.json();

    // 자기 자신의 권한은 변경할 수 없음
    if (userId === user.id && updates.role) {
      return json({ error: '자신의 권한은 변경할 수 없습니다.' }, { status: 400 });
    }

    // 업데이트할 필드 준비
    const updateFields = [];
    const updateParams = [];

    if (updates.role !== undefined) {
      updateFields.push('role = ?');
      updateParams.push(updates.role);
    }

    if (updates.level !== undefined) {
      updateFields.push('level = ?');
      updateParams.push(updates.level);
    }

    if (updates.isActive !== undefined) {
      updateFields.push('is_active = ?');
      updateParams.push(updates.isActive ? 1 : 0);
    }

    if (updates.isVerified !== undefined) {
      updateFields.push('is_verified = ?');
      updateParams.push(updates.isVerified ? 1 : 0);
    }

    if (updates.points !== undefined) {
      updateFields.push('points = ?');
      updateParams.push(updates.points);
    }

    if (updateFields.length === 0) {
      return json({ error: '업데이트할 필드가 없습니다.' }, { status: 400 });
    }

    // 사용자 업데이트
    const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    updateParams.push(userId);

    await executeQuery(updateQuery, updateParams);

    // 업데이트된 사용자 정보 조회
    const [updatedUser] = await executeQuery(
      'SELECT id, username, email, name, nickname, role, level, points, is_active, is_verified FROM users WHERE id = ?',
      [userId]
    );

    return json({
      message: '사용자 정보가 업데이트되었습니다.',
      user: {
        ...updatedUser,
        isActive: !!updatedUser.is_active,
        isVerified: !!updatedUser.is_verified
      }
    });

  } catch (error) {
    console.error('사용자 정보 업데이트 오류:', error);
    return json({ 
      error: '서버 오류가 발생했습니다.',
      details: error.message 
    }, { status: 500 });
  }
}
