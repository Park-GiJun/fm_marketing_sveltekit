// 체험단 신청 API
import { json } from '@sveltejs/kit';
import { getDataSource } from '$lib/server/data-source.js';
import { Experience, ExperienceStatus } from '$lib/server/entities/Experience.js';
import { ExperienceApplication, ApplicationStatus } from '$lib/server/entities/ExperienceApplication.js';
import { User } from '$lib/server/entities/User.js';
import { PointTransaction, TransactionType } from '$lib/server/entities/PointTransaction.js';
import { Notification, NotificationPriority } from '$lib/server/entities/Notification.js';
import { getUserFromRequest } from '$lib/server/auth.js';

export async function POST({ params, request }) {
	try {
		const { id: experienceId } = params;
		const user = await getUserFromRequest(request);

		if (!user) {
			return json({ error: '인증이 필요합니다.' }, { status: 401 });
		}

		const { applicationText } = await request.json();

		const dataSource = await getDataSource();
		const experienceRepository = dataSource.getRepository(Experience);
		const applicationRepository = dataSource.getRepository(ExperienceApplication);
		const userRepository = dataSource.getRepository(User);

		// 체험단 정보 확인
		const experience = await experienceRepository.findOne({
			where: { id: parseInt(experienceId) },
			select: [
				'id', 'title', 'status', 'applicationDeadline', 
				'maxParticipants', 'currentParticipants', 'requiredPoints'
			]
		});

		if (!experience) {
			return json({ error: '체험단을 찾을 수 없습니다.' }, { status: 404 });
		}

		if (experience.status !== ExperienceStatus.ACTIVE) {
			return json({ error: '모집이 마감된 체험단입니다.' }, { status: 400 });
		}

		// 신청 마감일 확인
		if (experience.applicationDeadline) {
			const deadline = new Date(experience.applicationDeadline);
			const now = new Date();
			if (now > deadline) {
				return json({ error: '신청 기간이 마감되었습니다.' }, { status: 400 });
			}
		}

		// 모집 인원 확인
		if (experience.maxParticipants && 
			experience.currentParticipants >= experience.maxParticipants) {
			return json({ error: '모집 인원이 마감되었습니다.' }, { status: 400 });
		}

		// 필요 포인트 확인
		if (experience.requiredPoints > user.points) {
			return json({ error: '포인트가 부족합니다.' }, { status: 400 });
		}

		// 중복 신청 확인
		const existingApplication = await applicationRepository.findOne({
			where: {
				experienceId: parseInt(experienceId),
				userId: user.id
			}
		});

		if (existingApplication) {
			return json({ error: '이미 신청한 체험단입니다.' }, { status: 409 });
		}

		// 트랜잭션으로 신청 처리
		const result = await dataSource.transaction(async manager => {
			// 신청 데이터 저장
			const application = manager.create(ExperienceApplication, {
				experienceId: parseInt(experienceId),
				userId: user.id,
				applicationText: applicationText || '',
				status: ApplicationStatus.PENDING
			});
			const savedApplication = await manager.save(application);

			// 필요 포인트 차감
			if (experience.requiredPoints > 0) {
				const pointTransaction = manager.create(PointTransaction, {
					userId: user.id,
					type: TransactionType.SPEND,
					amount: experience.requiredPoints,
					description: '체험단 신청',
					referenceType: 'experience_application',
					referenceId: savedApplication.id
				});
				await manager.save(pointTransaction);

				// 사용자 포인트 업데이트
				await manager.update(User, { id: user.id }, { 
					points: () => `points - ${experience.requiredPoints}` 
				});
			}

			// 체험단 신청자 수 증가
			await manager.update(Experience, { id: parseInt(experienceId) }, {
				currentParticipants: () => 'currentParticipants + 1'
			});

			// 신청 확인 알림 생성
			const notification = manager.create(Notification, {
				userId: user.id,
				type: 'application_received',
				title: '체험단 신청 완료',
				message: `${experience.title} 체험단 신청이 완료되었습니다. 선정 결과를 기다려주세요.`,
				actionUrl: `/checklist/${experienceId}`,
				priority: NotificationPriority.MEDIUM
			});
			await manager.save(notification);

			return savedApplication;
		});

		return json({ 
			message: '체험단 신청이 완료되었습니다.',
			applicationId: result.id
		}, { status: 201 });

	} catch (error) {
		console.error('체험단 신청 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}

export async function DELETE({ params, request }) {
	try {
		const { id: experienceId } = params;
		const user = await getUserFromRequest(request);

		if (!user) {
			return json({ error: '인증이 필요합니다.' }, { status: 401 });
		}

		const dataSource = await getDataSource();
		const experienceRepository = dataSource.getRepository(Experience);
		const applicationRepository = dataSource.getRepository(ExperienceApplication);
		const userRepository = dataSource.getRepository(User);

		// 기존 신청 확인
		const application = await applicationRepository.findOne({
			where: {
				experienceId: parseInt(experienceId),
				userId: user.id,
				status: ApplicationStatus.PENDING
			}
		});

		if (!application) {
			return json({ error: '취소할 수 있는 신청이 없습니다.' }, { status: 404 });
		}

		// 체험단 정보 조회
		const experience = await experienceRepository.findOne({
			where: { id: parseInt(experienceId) },
			select: ['requiredPoints']
		});

		// 트랜잭션으로 신청 취소 처리
		await dataSource.transaction(async manager => {
			// 신청 삭제
			await manager.delete(ExperienceApplication, { id: application.id });

			// 포인트 환불
			if (experience.requiredPoints > 0) {
				const pointTransaction = manager.create(PointTransaction, {
					userId: user.id,
					type: TransactionType.EARN,
					amount: experience.requiredPoints,
					description: '체험단 신청 취소 환불',
					referenceType: 'application_cancel',
					referenceId: application.id
				});
				await manager.save(pointTransaction);

				// 사용자 포인트 업데이트
				await manager.update(User, { id: user.id }, { 
					points: () => `points + ${experience.requiredPoints}` 
				});
			}

			// 체험단 신청자 수 감소
			await manager.update(Experience, { id: parseInt(experienceId) }, {
				currentParticipants: () => 'currentParticipants - 1'
			});
		});

		return json({ message: '체험단 신청이 취소되었습니다.' });

	} catch (error) {
		console.error('체험단 신청 취소 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}
