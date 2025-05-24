// 가이드 상세 조회/수정/삭제 API
import { json } from '@sveltejs/kit';
import { getDataSource } from '$lib/server/data-source.js';
import { Guide } from '$lib/server/entities/Guide.js';
import { User, UserRole } from '$lib/server/entities/User.js';
import { getUserFromRequest } from '$lib/server/auth.js';

export async function GET({ params }) {
	try {
		const { id } = params;

		const dataSource = await getDataSource();
		const guideRepository = dataSource.getRepository(Guide);

		const guide = await guideRepository.findOne({
			where: { id: parseInt(id), isActive: true },
			relations: ['creator']
		});

		if (!guide) {
			return json({ error: '가이드를 찾을 수 없습니다.' }, { status: 404 });
		}

		// 조회수 증가
		await guideRepository.update(id, { 
			views: () => 'views + 1' 
		});
		guide.views += 1;

		return json(guide);

	} catch (error) {
		console.error('가이드 상세 조회 오류:', error);
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
		const guideRepository = dataSource.getRepository(Guide);

		// 가이드 존재 확인
		const guide = await guideRepository.findOne({
			where: { id: parseInt(id) }
		});

		if (!guide) {
			return json({ error: '가이드를 찾을 수 없습니다.' }, { status: 404 });
		}

		const { title, content, category, thumbnail, orderIndex, isActive } = await request.json();

		// 업데이트 데이터 준비
		const updateData = {
			title,
			content,
			category,
			thumbnail,
			orderIndex: orderIndex !== undefined ? orderIndex : guide.orderIndex,
			isActive: isActive !== undefined ? isActive : guide.isActive
		};

		await guideRepository.update(id, updateData);

		const updatedGuide = await guideRepository.findOne({
			where: { id: parseInt(id) },
			relations: ['creator']
		});

		return json(updatedGuide);

	} catch (error) {
		console.error('가이드 수정 오류:', error);
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
		const guideRepository = dataSource.getRepository(Guide);

		// 가이드 존재 확인
		const guide = await guideRepository.findOne({
			where: { id: parseInt(id) }
		});

		if (!guide) {
			return json({ error: '가이드를 찾을 수 없습니다.' }, { status: 404 });
		}

		await guideRepository.delete(id);

		return json({ message: '가이드가 삭제되었습니다.' });

	} catch (error) {
		console.error('가이드 삭제 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}
