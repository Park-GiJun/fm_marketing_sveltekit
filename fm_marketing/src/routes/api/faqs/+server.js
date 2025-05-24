// FAQ 목록 조회/생성 API
import { json } from '@sveltejs/kit';
import { getDataSource } from '$lib/server/data-source.js';
import { FAQ } from '$lib/server/entities/FAQ.js';
import { User, UserRole } from '$lib/server/entities/User.js';
import { getUserFromRequest } from '$lib/server/auth.js';

export async function GET({ url }) {
	try {
		const category = url.searchParams.get('category');
		const active = url.searchParams.get('active');
		const search = url.searchParams.get('search');
		const page = parseInt(url.searchParams.get('page') || '1');
		const limit = parseInt(url.searchParams.get('limit') || '50');
		const offset = (page - 1) * limit;

		const dataSource = await getDataSource();
		const faqRepository = dataSource.getRepository(FAQ);

		// 쿼리 빌더 생성
		let queryBuilder = faqRepository
			.createQueryBuilder('faq')
			.leftJoinAndSelect('faq.creator', 'creator');

		// 카테고리 필터
		if (category) {
			queryBuilder.andWhere('faq.category = :category', { category });
		}

		// 검색어 필터
		if (search) {
			queryBuilder.andWhere(
				'(faq.question LIKE :search OR faq.answer LIKE :search)',
				{ search: `%${search}%` }
			);
		}

		// 활성 상태 필터
		if (active !== 'false') {
			queryBuilder.andWhere('faq.isActive = :isActive', { isActive: true });
		}

		// 정렬 (순서, 최신순)
		queryBuilder
			.orderBy('faq.orderIndex', 'ASC')
			.addOrderBy('faq.createdAt', 'DESC');

		// 총 개수 조회
		const total = await queryBuilder.getCount();

		// 데이터 조회
		const faqs = await queryBuilder
			.offset(offset)
			.limit(limit)
			.getMany();

		return json({
			faqs,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit)
			}
		});

	} catch (error) {
		console.error('FAQ 목록 조회 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}

export async function POST({ request }) {
	try {
		const user = await getUserFromRequest(request);

		if (!user || user.role !== UserRole.ADMIN) {
			return json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
		}

		const { question, answer, category, orderIndex } = await request.json();

		// 필수 필드 검증
		if (!question || !answer || !category) {
			return json({ error: '필수 정보를 모두 입력해주세요.' }, { status: 400 });
		}

		const dataSource = await getDataSource();
		const faqRepository = dataSource.getRepository(FAQ);

		const faq = faqRepository.create({
			question,
			answer,
			category,
			orderIndex: orderIndex || 0,
			createdById: user.id
		});

		const savedFaq = await faqRepository.save(faq);

		// 작성자 정보와 함께 반환
		const faqWithCreator = await faqRepository.findOne({
			where: { id: savedFaq.id },
			relations: ['creator']
		});

		return json(faqWithCreator, { status: 201 });

	} catch (error) {
		console.error('FAQ 생성 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}
