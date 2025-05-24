// 사용자 프로필 조회/수정 API
import { json } from '@sveltejs/kit';
import { getDataSource } from '$lib/server/data-source-unified.js';
import { User } from '$lib/server/entities/index.js';
import { getUserFromRequest, hashPassword, isValidEmail } from '$lib/server/auth-unified.js';

export async function GET({ request }) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);

    // 최신 사용자 정보 조회
    const currentUser = await userRepository.findOne({
      where: { id: user.id },
      select: [
        'id', 'username', 'email', 'name', 'nickname', 
        'profileImage', 'phone', 'birthDate', 'gender', 
        'address', 'blogUrl', 'instagramUrl', 'youtubeUrl',
        'points', 'level', 'role', 'isActive', 'isVerified',
        'createdAt', 'updatedAt'
      ]
    });

    if (!currentUser) {
      return json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
    }

    return json(currentUser);

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

    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);

    // 이메일 중복 검사 (현재 사용자 제외)
    if (email && email !== user.email) {
      const existingUser = await userRepository
        .createQueryBuilder('user')
        .where('user.email = :email AND user.id != :userId', { email, userId: user.id })
        .getOne();

      if (existingUser) {
        return json({ error: '이미 사용 중인 이메일입니다.' }, { status: 409 });
      }
    }

    // 업데이트 데이터 준비
    const updateData = {};
    if (email) updateData.email = email;
    if (name) updateData.name = name;
    if (nickname !== undefined) updateData.nickname = nickname;
    if (phone !== undefined) updateData.phone = phone;
    if (birthDate !== undefined) updateData.birthDate = birthDate ? new Date(birthDate) : null;
    if (gender !== undefined) updateData.gender = gender;
    if (address !== undefined) updateData.address = address;
    if (blogUrl !== undefined) updateData.blogUrl = blogUrl;
    if (instagramUrl !== undefined) updateData.instagramUrl = instagramUrl;
    if (youtubeUrl !== undefined) updateData.youtubeUrl = youtubeUrl;

    // 사용자 정보 업데이트
    await userRepository.update({ id: user.id }, updateData);

    // 업데이트된 사용자 정보 조회
    const updatedUser = await userRepository.findOne({
      where: { id: user.id },
      select: [
        'id', 'username', 'email', 'name', 'nickname', 
        'profileImage', 'phone', 'birthDate', 'gender', 
        'address', 'blogUrl', 'instagramUrl', 'youtubeUrl',
        'points', 'level', 'role', 'isActive', 'isVerified',
        'createdAt', 'updatedAt'
      ]
    });

    return json(updatedUser);

  } catch (error) {
    console.error('프로필 수정 오류:', error);
    return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
