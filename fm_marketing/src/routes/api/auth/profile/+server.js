// 사용자 프로필 조회/수정 API - MySQL2 버전
import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database.js';
import { getUserFromRequest, isValidEmail } from '$lib/server/auth.js';

export async function GET({ request }) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    // 전체 사용자 정보 조회
    const [fullUser] = await executeQuery(`
      SELECT id, username, email, name, nickname, 
             profile_image, phone, birth_date, gender,
             address, blog_url, instagram_url, youtube_url,
             points, level, role, is_active, is_verified,
             created_at, updated_at
      FROM users 
      WHERE id = ?
    `, [user.id]);

    if (!fullUser) {
      return json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
    }

    return json({
      id: fullUser.id,
      username: fullUser.username,
      email: fullUser.email,
      name: fullUser.name,
      nickname: fullUser.nickname,
      profileImage: fullUser.profile_image,
      phone: fullUser.phone,
      birthDate: fullUser.birth_date,
      gender: fullUser.gender,
      address: fullUser.address,
      blogUrl: fullUser.blog_url,
      instagramUrl: fullUser.instagram_url,
      youtubeUrl: fullUser.youtube_url,
      points: fullUser.points,
      level: fullUser.level,
      role: fullUser.role,
      isActive: !!fullUser.is_active,
      isVerified: !!fullUser.is_verified,
      createdAt: fullUser.created_at,
      updatedAt: fullUser.updated_at
    });

  } catch (error) {
    console.error('프로필 조회 오류:', error);
    return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function PUT({ request }) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const data = await request.json();
    const {
      email, name, nickname, phone, birthDate, gender,
      address, blogUrl, instagramUrl, youtubeUrl
    } = data;

    // 이메일 유효성 검사
    if (email && !isValidEmail(email)) {
      return json({ error: '올바른 이메일 형식이 아닙니다.' }, { status: 400 });
    }

    // 이메일 중복 검사 (자신 제외)
    if (email && email !== user.email) {
      const [existingUser] = await executeQuery(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, user.id]
      );
      
      if (existingUser) {
        return json({ error: '이미 사용 중인 이메일입니다.' }, { status: 409 });
      }
    }

    // 업데이트 쿼리 동적 생성
    const updates = [];
    const params = [];

    if (email !== undefined) {
      updates.push('email = ?');
      params.push(email);
    }
    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name);
    }
    if (nickname !== undefined) {
      updates.push('nickname = ?');
      params.push(nickname);
    }
    if (phone !== undefined) {
      updates.push('phone = ?');
      params.push(phone || null);
    }
    if (birthDate !== undefined) {
      updates.push('birth_date = ?');
      params.push(birthDate || null);
    }
    if (gender !== undefined) {
      updates.push('gender = ?');
      params.push(gender || null);
    }
    if (address !== undefined) {
      updates.push('address = ?');
      params.push(address || null);
    }
    if (blogUrl !== undefined) {
      updates.push('blog_url = ?');
      params.push(blogUrl || null);
    }
    if (instagramUrl !== undefined) {
      updates.push('instagram_url = ?');
      params.push(instagramUrl || null);
    }
    if (youtubeUrl !== undefined) {
      updates.push('youtube_url = ?');
      params.push(youtubeUrl || null);
    }

    if (updates.length > 0) {
      const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
      params.push(user.id);
      await executeQuery(sql, params);
    }

    // 업데이트된 사용자 정보 조회
    const [updatedUser] = await executeQuery(`
      SELECT id, username, email, name, nickname, 
             profile_image, phone, birth_date, gender,
             address, blog_url, instagram_url, youtube_url,
             points, level, role, is_active, is_verified,
             created_at, updated_at
      FROM users 
      WHERE id = ?
    `, [user.id]);

    return json({
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      name: updatedUser.name,
      nickname: updatedUser.nickname,
      profileImage: updatedUser.profile_image,
      phone: updatedUser.phone,
      birthDate: updatedUser.birth_date,
      gender: updatedUser.gender,
      address: updatedUser.address,
      blogUrl: updatedUser.blog_url,
      instagramUrl: updatedUser.instagram_url,
      youtubeUrl: updatedUser.youtube_url,
      points: updatedUser.points,
      level: updatedUser.level,
      role: updatedUser.role,
      isActive: !!updatedUser.is_active,
      isVerified: !!updatedUser.is_verified,
      createdAt: updatedUser.created_at,
      updatedAt: updatedUser.updated_at
    });

  } catch (error) {
    console.error('프로필 수정 오류:', error);
    return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}