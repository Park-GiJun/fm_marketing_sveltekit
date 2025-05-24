// 가이드 목록 조회/생성 API
import { json } from '@sveltejs/kit';
import { getDataSource } from '$lib/server/data-source.js';
import { Guide } from '$lib/server/entities/Guide.js';
import { User, UserRole } from '$lib/server/entities/User.js';
import { getUserFromRequest } from '$lib/server/auth.js';

export async function GET({ url }) {
	try {
		const category = url.searchParams.get('category');
		const active = url.searchParams.get('active');
		const page = parseInt(url.searchParams.get('page') || '1');
		const limit = parseInt(url.searchParams.get('limit') || '20');
		const offset = (page - 1) * limit;

		const dataSource = await getDataSource();
		const guideRepository = dataSource.getRepository(Guide);

		// 쿼리 빌더 생성
		let queryBuilder = guideRepository
			.createQueryBuilder('guide')
			.leftJoinAndSelect('guide.creator', 'creator');

		// 카테고리 필터
		if (category) {
			queryBuilder.andWhere('guide.category = :category', { category });
		}

		// 활성 상태 필터
		if (active !== 'false') {
			queryBuilder.andWhere('guide.isActive = :isActive', { isActive: true });
		}

		// 정렬 (순서, 최신순)
		queryBuilder
			.orderBy('guide.orderIndex', 'ASC')
			.addOrderBy('guide.createdAt', 'DESC');

		// 총 개수 조회
		const total = await queryBuilder.getCount();

		// 데이터 조회
		const guides = await queryBuilder
			.offset(offset)
			.limit(limit)
			.getMany();

		return json({
			guides,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit)
			}
		});

	} catch (error) {
		console.error('가이드 목록 조회 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}

export async function POST({ request }) {
	try {
		const user = await getUserFromRequest(request);

		if (!user || user.role !== UserRole.ADMIN) {
			return json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
		}

		const { title, content, category, thumbnail, orderIndex } = await request.json();

		// 필수 필드 검증
		if (!title || !content || !category) {
			return json({ error: '필수 정보를 모두 입력해주세요.' }, { status: 400 });
		}

		const dataSource = await getDataSource();
		const guideRepository = dataSource.getRepository(Guide);

		const guide = guideRepository.create({
			title,
			content,
			category,
			thumbnail,
			orderIndex: orderIndex || 0,
			createdById: user.id
		});

		const savedGuide = await guideRepository.save(guide);

		// 작성자 정보와 함께 반환
		const guideWithCreator = await guideRepository.findOne({
			where: { id: savedGuide.id },
			relations: ['creator']
		});

		return json(guideWithCreator, { status: 201 });

	} catch (error) {
		console.error('가이드 생성 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}
