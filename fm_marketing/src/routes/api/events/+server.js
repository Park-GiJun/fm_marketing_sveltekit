// 이벤트 목록 조회/생성 API
import { json } from '@sveltejs/kit';
import { getDataSource } from '$lib/server/data-source.js';
import { Event, EventType } from '$lib/server/entities/Event.js';
import { User, UserRole } from '$lib/server/entities/User.js';
import { getUserFromRequest } from '$lib/server/auth.js';

export async function GET({ url }) {
	try {
		const type = url.searchParams.get('type'); // 'event' 또는 'notice'
		const category = url.searchParams.get('category');
		const active = url.searchParams.get('active');
		const page = parseInt(url.searchParams.get('page') || '1');
		const limit = parseInt(url.searchParams.get('limit') || '20');
		const offset = (page - 1) * limit;

		const dataSource = await getDataSource();
		const eventRepository = dataSource.getRepository(Event);

		// 쿼리 빌더 생성
		let queryBuilder = eventRepository
			.createQueryBuilder('event')
			.leftJoinAndSelect('event.creator', 'creator');

		// 타입 필터 (이벤트 또는 공지사항)
		if (type && Object.values(EventType).includes(type)) {
			queryBuilder.andWhere('event.type = :type', { type });
		}

		// 카테고리 필터
		if (category) {
			queryBuilder.andWhere('event.category = :category', { category });
		}

		// 활성 상태 필터
		if (active === 'true') {
			queryBuilder.andWhere('event.isActive = :isActive', { isActive: true });
			// 현재 진행 중인 이벤트만 (종료일이 없거나 현재보다 미래)
			queryBuilder.andWhere(
				'(event.endDate IS NULL OR event.endDate >= :now)',
				{ now: new Date().toISOString().split('T')[0] }
			);
		} else if (active === 'false') {
			queryBuilder.andWhere('event.isActive = :isActive', { isActive: false });
		}

		// 정렬 (중요도 우선, 최신순)
		queryBuilder
			.orderBy('event.isImportant', 'DESC')
			.addOrderBy('event.createdAt', 'DESC');

		// 총 개수 조회
		const total = await queryBuilder.getCount();

		// 데이터 조회
		const events = await queryBuilder
			.offset(offset)
			.limit(limit)
			.getMany();

		return json({
			events,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit)
			}
		});

	} catch (error) {
		console.error('이벤트 목록 조회 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}

export async function POST({ request }) {
	try {
		const user = await getUserFromRequest(request);

		if (!user || user.role !== UserRole.ADMIN) {
			return json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
		}

		const {
			title, content, type, category, imageUrl,
			startDate, endDate, isImportant
		} = await request.json();

		// 필수 필드 검증
		if (!title || !content || !type) {
			return json({ error: '필수 정보를 모두 입력해주세요.' }, { status: 400 });
		}

		if (!Object.values(EventType).includes(type)) {
			return json({ error: '올바른 타입을 선택해주세요.' }, { status: 400 });
		}

		const dataSource = await getDataSource();
		const eventRepository = dataSource.getRepository(Event);

		const event = eventRepository.create({
			title,
			content,
			type,
			category,
			imageUrl,
			startDate: startDate ? new Date(startDate) : null,
			endDate: endDate ? new Date(endDate) : null,
			isImportant: !!isImportant,
			createdById: user.id
		});

		const savedEvent = await eventRepository.save(event);

		// 작성자 정보와 함께 반환
		const eventWithCreator = await eventRepository.findOne({
			where: { id: savedEvent.id },
			relations: ['creator']
		});

		return json(eventWithCreator, { status: 201 });

	} catch (error) {
		console.error('이벤트 생성 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}
