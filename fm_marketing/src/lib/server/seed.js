// 데이터베이스 시드 데이터
import { db } from './database.js';
import { hashPassword } from './auth.js';

export async function seedDatabase() {
	console.log('시드 데이터 생성 시작...');

	try {
		// 관리자 계정 생성
		const adminPassword = await hashPassword('admin123!');
		const adminStmt = db.prepare(`
			INSERT OR IGNORE INTO users (username, email, password_hash, name, nickname, points, role, is_verified)
			VALUES ('admin', 'admin@fmmarketing.com', ?, '관리자', '관리자', 50000, 'admin', true)
		`);
		adminStmt.run(adminPassword);

		// 테스트 사용자 생성
		const userPassword = await hashPassword('user123!');
		const userStmt = db.prepare(`
			INSERT OR IGNORE INTO users (username, email, password_hash, name, nickname, points, level, is_verified)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?)
		`);

		const testUsers = [
			['user1', 'user1@example.com', userPassword, '김철수', '철수', 5000, 'bronze', true],
			['user2', 'user2@example.com', userPassword, '이영희', '영희', 12000, 'silver', true],
			['user3', 'user3@example.com', userPassword, '박민수', '민수', 25000, 'gold', true]
		];

		testUsers.forEach(user => {
			userStmt.run(...user);
		});

		// 체험단 데이터 생성
		const experienceStmt = db.prepare(`
			INSERT OR IGNORE INTO experiences (
				title, content, category, type, region, location,
				start_date, end_date, application_deadline,
				max_participants, current_participants, required_points, reward_points,
				reward_description, requirements, company_name, contact_info,
				images, tags, status, is_promoted, views, likes, created_by
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`);

		const experiences = [
			[
				'서울 맛집 탐방 체험단',
				'서울 강남구에 새로 오픈한 이탈리안 레스토랑 체험단을 모집합니다. 고급 이탈리안 요리를 무료로 체험하고 솔직한 후기를 작성해주세요.',
				'음식점',
				'체험단',
				'서울',
				'서울특별시 강남구 테헤란로 123',
				'2025-06-15',
				'2025-06-30',
				'2025-06-10',
				10,
				3,
				0,
				5000,
				'5만원 상당 코스 요리 + 5000 포인트',
				'블로그 또는 인스타그램 후기 필수, 최소 5장 이상 사진 첨부',
				'벨라비타 레스토랑',
				'02-123-4567, manager@bellavita.co.kr',
				JSON.stringify(['/images/restaurant1.jpg', '/images/restaurant2.jpg']),
				JSON.stringify(['맛집', '이탈리안', '강남', '데이트']),
				'active',
				true,
				245,
				15,
				1
			],
			[
				'뷰티 신제품 체험단',
				'인기 브랜드의 신제품 스킨케어 세트를 체험해보세요. 2주간 사용 후 상세한 리뷰를 작성해주시면 됩니다.',
				'뷰티',
				'체험단',
				'전국',
				'택배 발송',
				'2025-06-01',
				'2025-06-30',
				'2025-05-30',
				20,
				8,
				1000,
				3000,
				'15만원 상당 스킨케어 세트 + 3000 포인트',
				'민감성 피부 불가, 2주 연속 사용 필수, 사진 포함 상세 리뷰',
				'뷰티랩 코스메틱',
				'02-987-6543, pr@beautylab.co.kr',
				JSON.stringify(['/images/beauty1.jpg', '/images/beauty2.jpg']),
				JSON.stringify(['뷰티', '스킨케어', '신제품', '여성']),
				'active',
				false,
				189,
				22,
				1
			],
			[
				'카페 신메뉴 기자단',
				'홍대 핫플레이스 카페의 신메뉴 런칭 기자단을 모집합니다. 인플루언서 우대하며, 높은 퀄리티의 콘텐츠를 원합니다.',
				'카페',
				'기자단',
				'서울',
				'서울특별시 마포구 홍익로 456',
				'2025-06-20',
				'2025-06-25',
				'2025-06-15',
				5,
				2,
				5000,
				10000,
				'신메뉴 무료 체험 + 1만원 상당 기프트카드',
				'인스타그램 팔로워 1000명 이상, 고퀄리티 사진/영상 필수',
				'카페 모먼트',
				'02-456-7890, marketing@cafemoment.co.kr',
				JSON.stringify(['/images/cafe1.jpg', '/images/cafe2.jpg']),
				JSON.stringify(['카페', '홍대', '신메뉴', '인플루언서']),
				'active',
				true,
				567,
				31,
				1
			],
			[
				'부산 펜션 숙박 체험단',
				'부산 해운대 오션뷰 펜션에서 1박 2일 무료 숙박 체험단을 모집합니다. 가족 단위 신청 가능합니다.',
				'숙박',
				'체험단',
				'부산',
				'부산광역시 해운대구 해운대해변로 789',
				'2025-07-01',
				'2025-07-31',
				'2025-06-25',
				3,
				1,
				3000,
				8000,
				'1박 2일 숙박 + 조식 포함 + 8000 포인트',
				'가족 단위 우대, SNS 후기 필수, 주말 이용 가능한 분',
				'해운대 오션 펜션',
				'051-123-4567, info@oceanpension.co.kr',
				JSON.stringify(['/images/pension1.jpg', '/images/pension2.jpg']),
				JSON.stringify(['펜션', '부산', '해운대', '가족여행']),
				'active',
				false,
				298,
				18,
				1
			],
			[
				'헬스장 PT 체험단',
				'강남 프리미엄 헬스장에서 개인 트레이닝을 무료로 체험해보세요. 운동 초보자도 환영합니다.',
				'헬스/피트니스',
				'체험단',
				'서울',
				'서울특별시 강남구 논현로 321',
				'2025-06-10',
				'2025-06-30',
				'2025-06-08',
				15,
				12,
				0,
				4000,
				'개인 트레이닝 4회 + 헬스장 1개월 이용권',
				'운동 경험 무관, 성실한 참여 필수, 변화 과정 기록',
				'스트롱 피트니스',
				'02-789-0123, pt@strongfitness.co.kr',
				JSON.stringify(['/images/gym1.jpg', '/images/gym2.jpg']),
				JSON.stringify(['헬스장', 'PT', '다이어트', '건강']),
				'active',
				false,
				156,
				9,
				1
			]
		];

		experiences.forEach(exp => {
			experienceStmt.run(...exp);
		});

		// 커뮤니티 게시글 생성
		const postStmt = db.prepare(`
			INSERT OR IGNORE INTO community_posts (title, content, category, author_id, tags, views, likes)
			VALUES (?, ?, ?, ?, ?, ?, ?)
		`);

		const posts = [
			[
				'첫 체험단 후기 공유합니다!',
				'안녕하세요! 지난주에 처음으로 체험단에 참여했는데요, 너무 좋은 경험이었어서 후기 공유합니다. 강남에 있는 이탈리안 레스토랑이었는데...',
				'체험 후기',
				2,
				JSON.stringify(['체험단', '후기', '레스토랑']),
				89,
				12
			],
			[
				'체험단 신청할 때 팁 있나요?',
				'체험단 신청을 자주 하는데 잘 안 되네요. 혹시 선정되는 팁이 있을까요? 블로그나 인스타 팔로워가 많아야 하나요?',
				'질문',
				3,
				JSON.stringify(['체험단', '팁', '질문']),
				145,
				8
			],
			[
				'뷰티 체험단 관련 정보 공유',
				'뷰티 체험단 자주 하시는 분들께 도움이 될 정보들을 정리해봤어요. 신청할 때 주의사항이나 좋은 브랜드들...',
				'정보 공유',
				4,
				JSON.stringify(['뷰티', '정보공유', '체험단']),
				234,
				25
			]
		];

		posts.forEach(post => {
			postStmt.run(...post);
		});

		// 이벤트/공지사항 생성
		const eventStmt = db.prepare(`
			INSERT OR IGNORE INTO events (title, content, type, category, start_date, end_date, is_active, is_important, created_by)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
		`);

		const events = [
			[
				'여름 맞이 체험단 특별 이벤트',
				'여름 시즌을 맞아 체험단 활동을 하시는 분들께 특별 포인트를 드립니다! 6월 한 달간 체험단 완료 시 기존 포인트의 2배를 지급합니다.',
				'event',
				'포인트',
				'2025-06-01',
				'2025-06-30',
				true,
				false,
				1
			],
			[
				'서비스 이용약관 개정 안내',
				'2025년 6월 1일부터 적용되는 서비스 이용약관 개정 내용을 안내드립니다. 주요 변경사항은...',
				'notice',
				'공지',
				'2025-05-15',
				null,
				true,
				true,
				1
			]
		];

		events.forEach(event => {
			eventStmt.run(...event);
		});

		// 가이드 생성
		const guideStmt = db.prepare(`
			INSERT OR IGNORE INTO guides (title, content, category, order_index, created_by)
			VALUES (?, ?, ?, ?, ?)
		`);

		const guides = [
			[
				'체험단 신청 방법',
				'# 체험단 신청 방법\n\n체험단에 신청하는 방법을 단계별로 안내해드립니다...',
				'기본 가이드',
				1,
				1
			],
			[
				'포인트 적립 및 사용 안내',
				'# 포인트 시스템\n\n포인트 적립 방법과 사용법에 대해 안내해드립니다...',
				'포인트/결제',
				2,
				1
			]
		];

		guides.forEach(guide => {
			guideStmt.run(...guide);
		});

		// FAQ 생성
		const faqStmt = db.prepare(`
			INSERT OR IGNORE INTO faqs (question, answer, category, order_index, created_by)
			VALUES (?, ?, ?, ?, ?)
		`);

		const faqs = [
			[
				'체험단 신청은 어떻게 하나요?',
				'체험단 목록에서 원하는 체험단을 선택한 후 "신청하기" 버튼을 클릭하여 신청하실 수 있습니다.',
				'체험단 신청',
				1,
				1
			],
			[
				'포인트는 어떻게 적립되나요?',
				'회원가입, 체험단 완료, 커뮤니티 활동 등 다양한 방법으로 포인트를 적립할 수 있습니다.',
				'포인트/결제',
				2,
				1
			]
		];

		faqs.forEach(faq => {
			faqStmt.run(...faq);
		});

		console.log('시드 데이터 생성 완료!');

	} catch (error) {
		console.error('시드 데이터 생성 오류:', error);
	}
}
