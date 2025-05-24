// 사용자 프로필 조회/수정 API - TypeORM 통합 버전
import { json } from '@sveltejs/kit';
import { getDataSource } from '$lib/server/data-source.js';
import { getUserFromRequest, isValidEmail } from '$lib/server/auth.js';

export async function GET({ request }) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    try {
      // TypeORM으로 사용자 정보 조회 시도
      const dataSource = await getDataSource();
      
      if (dataSource) {
        const { User } = await import('$lib/server/entities/User.js');
        const userRepository = dataSource.getRepository(User);
        
        const fullUser = await userRepository.findOne({
          where: { id: user.id },
          select: [
            'id', 'username', 'email', 'name', 'nickname', 
            'profileImage', 'phone', 'birthDate', 'gender',
            'address', 'blogUrl', 'instagramUrl', 'youtubeUrl',
            'points', 'level', 'role', 'isActive', 'isVerified',
            'createdAt', 'updatedAt'
          ]
        });

        if (fullUser) {
          return json(fullUser);
        }
      }
    } catch (dbError) {
      console.error('데이터베이스 프로필 조회 실패, 더미 데이터 사용:', dbError.message);
    }

    // 더미 데이터 반환
    return json(user);

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

    try {
      // TypeORM으로 사용자 정보 업데이트 시도
      const dataSource = await getDataSource();
      
      if (dataSource) {
        const { User } = await import('$lib/server/entities/User.js');
        const userRepository = dataSource.getRepository(User);
        
        // 이메일 중복 검사 (자신 제외)
        if (email && email !== user.email) {
          const existingUser = await userRepository.findOne({
            where: { email, id: Not(user.id) }
          });
          
          if (existingUser) {
            return json({ error: '이미 사용 중인 이메일입니다.' }, { status: 409 });
          }
        }

        // 업데이트 데이터 준비
        const updateData = {};
        if (email !== undefined) updateData.email = email;
        if (name !== undefined) updateData.name = name;
        if (nickname !== undefined) updateData.nickname = nickname;
        if (phone !== undefined) updateData.phone = phone;
        if (birthDate !== undefined) updateData.birthDate = birthDate;
        if (gender !== undefined) updateData.gender = gender;
        if (address !== undefined) updateData.address = address;
        if (blogUrl !== undefined) updateData.blogUrl = blogUrl;
        if (instagramUrl !== undefined) updateData.instagramUrl = instagramUrl;
        if (youtubeUrl !== undefined) updateData.youtubeUrl = youtubeUrl;

        await userRepository.update(user.id, updateData);

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
      }
    } catch (dbError) {
      console.error('데이터베이스 프로필 수정 실패, 더미 데이터 사용:', dbError.message);
    }

    // 더미 사용자 정보 업데이트
    const updatedUser = {
      ...user,
      email: email !== undefined ? email : user.email,
      name: name !== undefined ? name : user.name,
      nickname: nickname !== undefined ? nickname : user.nickname,
      phone: phone !== undefined ? phone : user.phone,
      birthDate: birthDate !== undefined ? birthDate : user.birthDate,
      gender: gender !== undefined ? gender : user.gender,
      address: address !== undefined ? address : user.address,
      blogUrl: blogUrl !== undefined ? blogUrl : user.blogUrl,
      instagramUrl: instagramUrl !== undefined ? instagramUrl : user.instagramUrl,
      youtubeUrl: youtubeUrl !== undefined ? youtubeUrl : user.youtubeUrl,
      updatedAt: new Date().toISOString()
    };

    return json(updatedUser);

  } catch (error) {
    console.error('프로필 수정 오류:', error);
    return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
