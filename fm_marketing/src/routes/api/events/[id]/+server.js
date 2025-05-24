// 이벤트 상세 조회/수정/삭제 API
import { json } from '@sveltejs/kit';
import { getDataSource } from '$lib/server/data-source.js';
import { Event, EventType } from '$lib/server/entities/Event.js';
import { User, UserRole } from '$lib/server/entities/User.js';
import { getUserFromRequest } from '$lib/server/auth.js';

export async function GET({ params }) {
	try {
		const { id } = params;

		const dataSource = await getDataSource();
		const eventRepository = dataSource.getRepository(Event);

		const event = await eventRepository.findOne({
			where: { id: parseInt(id) },
			relations: ['creator']
		});

		if (!event) {
			return json({ error: '이벤트를 찾을 수 없습니다.' }, { status: 404 });
		}

		// 조회수 증가
		await eventRepository.update(id, { 
			views: () => 'views + 1' 
		});
		event.views += 1;

		return json(event);

	} catch (error) {
		console.error('이벤트 상세 조회 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}

export async function PUT({ params, request }) {
	try {
		const { id } = params;
		const user = await getUserFromRequest(request);

		if (!user || user.role !== UserRole.ADMIN) {
			return json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
		}

		const dataSource = await getDataSource();
		const eventRepository = dataSource.getRepository(Event);

		// 이벤트 존재 확인
		const event = await eventRepository.findOne({
			where: { id: parseInt(id) }
		});

		if (!event) {
			return json({ error: '이벤트를 찾을 수 없습니다.' }, { status: 404 });
		}

		const {
			title, content, type, category, imageUrl,
			startDate, endDate, isActive, isImportant
		} = await request.json();

		// 업데이트 데이터 준비
		const updateData = {
			title,
			content,
			type,
			category,
			imageUrl,
			startDate: startDate ? new Date(startDate) : null,
			endDate: endDate ? new Date(endDate) : null,
			isActive: isActive !== undefined ? isActive : event.isActive,
			isImportant: isImportant !== undefined ? isImportant : event.isImportant
		};

		await eventRepository.update(id, updateData);

		const updatedEvent = await eventRepository.findOne({
			where: { id: parseInt(id) },
			relations: ['creator']
		});

		return json(updatedEvent);

	} catch (error) {
		console.error('이벤트 수정 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}

export async function DELETE({ params, request }) {
	try {
		const { id } = params;
		const user = await getUserFromRequest(request);

		if (!user || user.role !== UserRole.ADMIN) {
			return json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
		}

		const dataSource = await getDataSource();
		const eventRepository = dataSource.getRepository(Event);

		// 이벤트 존재 확인
		const event = await eventRepository.findOne({
			where: { id: parseInt(id) }
		});

		if (!event) {
			return json({ error: '이벤트를 찾을 수 없습니다.' }, { status: 404 });
		}

		await eventRepository.delete(id);

		return json({ message: '이벤트가 삭제되었습니다.' });

	} catch (error) {
		console.error('이벤트 삭제 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}
