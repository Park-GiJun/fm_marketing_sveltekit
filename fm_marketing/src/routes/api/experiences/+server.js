// 체험단 목록 조회/생성 API - TypeORM 통합 버전
import { json } from '@sveltejs/kit';
import { getDataSource } from '$lib/server/data-source-unified.js';
import { Experience, User } from '$lib/server/entities/index.js';
import { getUserFromRequest } from '$lib/server/auth-unified.js';
import { processEntityJsonFields } from '$lib/server/utils/json-helper.js';

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
    const experienceRepository = dataSource.getRepository(Experience);

    // 쿼리 빌더 생성
    let queryBuilder = experienceRepository
      .createQueryBuilder('experience')
      .leftJoinAndSelect('experience.creator', 'creator')
      .leftJoin('experience.applications', 'applications')
      .addSelect('COUNT(applications.id)', 'applicationCount')
      .where('experience.status = :status', { status: 'active' })
      .groupBy('experience.id')
      .addGroupBy('creator.id');

    // 지역 필터
    if (region && region !== '전체') {
      queryBuilder.andWhere('experience.region = :region', { region });
    }

    // 카테고리 필터
    if (category && category !== '카테고리') {
      queryBuilder.andWhere('experience.category = :category', { category });
    }

    // 타입 필터
    if (type && type !== '유형') {
      queryBuilder.andWhere('experience.type = :type', { type });
    }

    // 검색어 필터
    if (search) {
      queryBuilder.andWhere(
        '(experience.title LIKE :search OR experience.content LIKE :search)',
        { search: `%${search}%` }
      );
    }

    // 정렬 조건
    switch (sort) {
      case 'popular':
        queryBuilder.orderBy('experience.views', 'DESC')
          .addOrderBy('experience.likes', 'DESC');
        break;
      case 'deadline':
        queryBuilder.orderBy('experience.applicationDeadline', 'ASC');
        break;
      default: // latest
        queryBuilder.orderBy('experience.createdAt', 'DESC');
    }

    // 총 개수 조회
    const totalQueryBuilder = experienceRepository
      .createQueryBuilder('experience')
      .where('experience.status = :status', { status: 'active' });

    if (region && region !== '전체') {
      totalQueryBuilder.andWhere('experience.region = :region', { region });
    }
    if (category && category !== '카테고리') {
      totalQueryBuilder.andWhere('experience.category = :category', { category });
    }
    if (type && type !== '유형') {
      totalQueryBuilder.andWhere('experience.type = :type', { type });
    }
    if (search) {
      totalQueryBuilder.andWhere(
        '(experience.title LIKE :search OR experience.content LIKE :search)',
        { search: `%${search}%` }
      );
    }

    const total = await totalQueryBuilder.getCount();

    // 데이터 조회
    const rawResults = await queryBuilder
      .offset(offset)
      .limit(limit)
      .getRawAndEntities();

    const experiences = rawResults.entities.map((experience, index) => {
      const processed = processEntityJsonFields(experience, ['images', 'tags']);
      return {
        ...processed,
        applicationCount: parseInt(rawResults.raw[index].applicationCount) || 0,
        creatorName: experience.creator?.name
      };
    });

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
    const experienceRepository = dataSource.getRepository(Experience);

    const experience = experienceRepository.create({
      title,
      content,
      category,
      type,
      region,
      location,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : null,
      maxParticipants,
      requiredPoints: requiredPoints || 0,
      rewardPoints: rewardPoints || 0,
      rewardDescription,
      requirements,
      companyName,
      contactInfo,
      images: JSON.stringify(images || []),
      tags: JSON.stringify(tags || []),
      isPromoted: !!isPromoted,
      createdById: user.id
    });

    const savedExperience = await experienceRepository.save(experience);

    // 작성자 정보와 함께 반환
    const experienceWithCreator = await experienceRepository.findOne({
      where: { id: savedExperience.id },
      relations: ['creator']
    });

    return json(experienceWithCreator, { status: 201 });

  } catch (error) {
    console.error('체험단 생성 오류:', error);
    return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
