// 체험단 상세 조회/수정/삭제 API
import { json } from '@sveltejs/kit';
import { getDataSource } from '$lib/server/data-source-unified.js';
import { Experience, ExperienceApplication, User } from '$lib/server/entities/index.js';
import { getUserFromRequest } from '$lib/server/auth-unified.js';

export async function GET({ params, request }) {
	try {
		const { id } = params;
		const user = await getUserFromRequest(request);

		const dataSource = await getDataSource();
		const experienceRepository = dataSource.getRepository(Experience);
		const applicationRepository = dataSource.getRepository(ExperienceApplication);

		// 체험단 정보 조회
		const experience = await experienceRepository
			.createQueryBuilder('experience')
			.leftJoinAndSelect('experience.creator', 'creator')
			.leftJoin('experience.applications', 'applications')
			.addSelect('COUNT(applications.id)', 'applicationCount')
			.where('experience.id = :id', { id })
			.groupBy('experience.id')
			.addGroupBy('creator.id')
			.getRawAndEntities();

		if (!experience.entities[0]) {
			return json({ error: '체험단을 찾을 수 없습니다.' }, { status: 404 });
		}

		const experienceData = experience.entities[0];
		const applicationCount = parseInt(experience.raw[0].applicationCount) || 0;

		// 조회수 증가
		await experienceRepository.update(id, { 
			views: () => 'views + 1' 
		});
		experienceData.views += 1;

		// 사용자의 신청 상태 확인 (로그인된 경우)
		let userApplication = null;
		if (user) {
			userApplication = await applicationRepository.findOne({
				where: {
					experienceId: parseInt(id),
					userId: user.id
				},
				select: ['status', 'appliedAt']
			});
		}

		// JSON 필드 파싱
		const result = {
			...experienceData,
			images: experienceData.images ? JSON.parse(experienceData.images) : [],
			tags: experienceData.tags ? JSON.parse(experienceData.tags) : [],
			applicationCount,
			userApplication,
			creatorName: experienceData.creator?.name
		};

		return json(result);

	} catch (error) {
		console.error('체험단 상세 조회 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}

export async function PUT({ params, request }) {
	try {
		const { id } = params;
		const user = await getUserFromRequest(request);
		
		if (!user) {
			return json({ error: '인증이 필요합니다.' }, { status: 401 });
		}

		const dataSource = await getDataSource();
		const experienceRepository = dataSource.getRepository(Experience);

		// 체험단 존재 확인 및 권한 체크
		const experience = await experienceRepository.findOne({
			where: { id: parseInt(id) },
			select: ['id', 'createdById']
		});

		if (!experience) {
			return json({ error: '체험단을 찾을 수 없습니다.' }, { status: 404 });
		}

		if (user.role !== 'admin' && user.id !== experience.createdById) {
			return json({ error: '수정 권한이 없습니다.' }, { status: 403 });
		}

		const data = await request.json();
		const {
			title, content, category, type, region, location,
			startDate, endDate, applicationDeadline,
			maxParticipants, requiredPoints, rewardPoints,
			rewardDescription, requirements, companyName,
			contactInfo, images, tags, isPromoted, status
		} = data;

		// 업데이트 데이터 준비
		const updateData = {
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
			requiredPoints,
			rewardPoints,
			rewardDescription,
			requirements,
			companyName,
			contactInfo,
			images: JSON.stringify(images || []),
			tags: JSON.stringify(tags || []),
			isPromoted,
			status
		};

		await experienceRepository.update(id, updateData);

		const updatedExperience = await experienceRepository.findOne({
			where: { id: parseInt(id) },
			relations: ['creator']
		});

		return json(updatedExperience);

	} catch (error) {
		console.error('체험단 수정 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}

export async function DELETE({ params, request }) {
	try {
		const { id } = params;
		const user = await getUserFromRequest(request);
		
		if (!user) {
			return json({ error: '인증이 필요합니다.' }, { status: 401 });
		}

		if (user.role !== 'admin') {
			return json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
		}

		const dataSource = await getDataSource();
		const experienceRepository = dataSource.getRepository(Experience);

		// 체험단 존재 확인
		const experience = await experienceRepository.findOne({
			where: { id: parseInt(id) }
		});

		if (!experience) {
			return json({ error: '체험단을 찾을 수 없습니다.' }, { status: 404 });
		}

		// 트랜잭션으로 관련 데이터 삭제
		await dataSource.transaction(async manager => {
			// 관련 신청 내역 삭제
			await manager.delete(ExperienceApplication, { experienceId: parseInt(id) });
			
			// 체험단 삭제
			await manager.delete(Experience, { id: parseInt(id) });
		});

		return json({ message: '체험단이 삭제되었습니다.' });

	} catch (error) {
		console.error('체험단 삭제 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}
