// TypeORM을 사용한 시드 데이터 생성
import { getDataSource, User, UserRole, UserLevel, PointTransaction, TransactionType, Experience, ExperienceType, ExperienceStatus, CommunityPost } from './data-source.js';
import { hashPassword } from './auth.js';

export async function seedDatabase() {
  console.log('시드 데이터 생성 시작...');

  try {
    const dataSource = await getDataSource();

    // 기존 데이터 확인
    const userRepository = dataSource.getRepository(User);
    const existingAdmin = await userRepository.findOne({ 
      where: { username: 'admin' } 
    });

    if (existingAdmin) {
      console.log('시드 데이터가 이미 존재합니다.');
      return;
    }

    // 트랜잭션으로 시드 데이터 생성
    await dataSource.transaction(async manager => {
      // 관리자 계정 생성
      const adminPassword = await hashPassword('admin123!');
      const admin = manager.create(User, {
        username: 'admin',
        email: 'admin@fmmarketing.com',
        passwordHash: adminPassword,
        name: '관리자',
        nickname: '관리자',
        points: 50000,
        role: UserRole.ADMIN,
        level: UserLevel.PLATINUM,
        isVerified: true
      });
      await manager.save(admin);

      // 테스트 사용자들 생성
      const userPassword = await hashPassword('user123!');
      const testUsers = [
        {
          username: 'user1',
          email: 'user1@example.com',
          passwordHash: userPassword,
          name: '김철수',
          nickname: '철수',
          points: 5000,
          level: UserLevel.BRONZE,
          isVerified: true
        },
        {
          username: 'user2',
          email: 'user2@example.com',
          passwordHash: userPassword,
          name: '이영희',
          nickname: '영희',
          points: 12000,
          level: UserLevel.SILVER,
          isVerified: true
        },
        {
          username: 'user3',
          email: 'user3@example.com',
          passwordHash: userPassword,
          name: '박민수',
          nickname: '민수',
          points: 25000,
          level: UserLevel.GOLD,
          isVerified: true
        }
      ];

      const users = [];
      for (const userData of testUsers) {
        const user = manager.create(User, userData);
        const savedUser = await manager.save(user);
        users.push(savedUser);
      }

      // 체험단 데이터 생성
      const experiences = [
        {
          title: '서울 맛집 탐방 체험단',
          content: '서울 강남구에 새로 오픈한 이탈리안 레스토랑 체험단을 모집합니다. 고급 이탈리안 요리를 무료로 체험하고 솔직한 후기를 작성해주세요.',
          category: '음식점',
          type: ExperienceType.EXPERIENCE,
          region: '서울',
          location: '서울특별시 강남구 테헤란로 123',
          startDate: new Date('2025-06-15'),
          endDate: new Date('2025-06-30'),
          applicationDeadline: new Date('2025-06-10'),
          maxParticipants: 10,
          currentParticipants: 3,
          requiredPoints: 0,
          rewardPoints: 5000,
          rewardDescription: '5만원 상당 코스 요리 + 5000 포인트',
          requirements: '블로그 또는 인스타그램 후기 필수, 최소 5장 이상 사진 첨부',
          companyName: '벨라비타 레스토랑',
          contactInfo: '02-123-4567, manager@bellavita.co.kr',
          images: JSON.stringify(['/images/restaurant1.jpg', '/images/restaurant2.jpg']),
          tags: JSON.stringify(['맛집', '이탈리안', '강남', '데이트']),
          status: ExperienceStatus.ACTIVE,
          isPromoted: true,
          views: 245,
          likes: 15,
          createdById: admin.id
        },
        {
          title: '뷰티 신제품 체험단',
          content: '인기 브랜드의 신제품 스킨케어 세트를 체험해보세요. 2주간 사용 후 상세한 리뷰를 작성해주시면 됩니다.',
          category: '뷰티',
          type: ExperienceType.EXPERIENCE,
          region: '전국',
          location: '택배 발송',
          startDate: new Date('2025-06-01'),
          endDate: new Date('2025-06-30'),
          applicationDeadline: new Date('2025-05-30'),
          maxParticipants: 20,
          currentParticipants: 8,
          requiredPoints: 1000,
          rewardPoints: 3000,
          rewardDescription: '15만원 상당 스킨케어 세트 + 3000 포인트',
          requirements: '민감성 피부 불가, 2주 연속 사용 필수, 사진 포함 상세 리뷰',
          companyName: '뷰티랩 코스메틱',
          contactInfo: '02-987-6543, pr@beautylab.co.kr',
          images: JSON.stringify(['/images/beauty1.jpg', '/images/beauty2.jpg']),
          tags: JSON.stringify(['뷰티', '스킨케어', '신제품', '여성']),
          status: ExperienceStatus.ACTIVE,
          isPromoted: false,
          views: 189,
          likes: 22,
          createdById: admin.id
        },
        {
          title: '카페 신메뉴 기자단',
          content: '홍대 핫플레이스 카페의 신메뉴 런칭 기자단을 모집합니다. 인플루언서 우대하며, 높은 퀄리티의 콘텐츠를 원합니다.',
          category: '카페',
          type: ExperienceType.REPORTER,
          region: '서울',
          location: '서울특별시 마포구 홍익로 456',
          startDate: new Date('2025-06-20'),
          endDate: new Date('2025-06-25'),
          applicationDeadline: new Date('2025-06-15'),
          maxParticipants: 5,
          currentParticipants: 2,
          requiredPoints: 5000,
          rewardPoints: 10000,
          rewardDescription: '신메뉴 무료 체험 + 1만원 상당 기프트카드',
          requirements: '인스타그램 팔로워 1000명 이상, 고퀄리티 사진/영상 필수',
          companyName: '카페 모먼트',
          contactInfo: '02-456-7890, marketing@cafemoment.co.kr',
          images: JSON.stringify(['/images/cafe1.jpg', '/images/cafe2.jpg']),
          tags: JSON.stringify(['카페', '홍대', '신메뉴', '인플루언서']),
          status: ExperienceStatus.ACTIVE,
          isPromoted: true,
          views: 567,
          likes: 31,
          createdById: admin.id
        }
      ];

      for (const expData of experiences) {
        const experience = manager.create(Experience, expData);
        await manager.save(experience);
      }

      // 커뮤니티 게시글 생성
      const posts = [
        {
          title: '첫 체험단 후기 공유합니다!',
          content: '안녕하세요! 지난주에 처음으로 체험단에 참여했는데요, 너무 좋은 경험이었어서 후기 공유합니다. 강남에 있는 이탈리안 레스토랑이었는데...',
          category: '체험 후기',
          authorId: users[0].id,
          tags: JSON.stringify(['체험단', '후기', '레스토랑']),
          views: 89,
          likes: 12
        },
        {
          title: '체험단 신청할 때 팁 있나요?',
          content: '체험단 신청을 자주 하는데 잘 안 되네요. 혹시 선정되는 팁이 있을까요? 블로그나 인스타 팔로워가 많아야 하나요?',
          category: '질문',
          authorId: users[1].id,
          tags: JSON.stringify(['체험단', '팁', '질문']),
          views: 145,
          likes: 8
        }
      ];

      for (const postData of posts) {
        const post = manager.create(CommunityPost, postData);
        await manager.save(post);
      }

      // 테스트용 포인트 거래 내역 생성
      for (const user of users) {
        const signupTransaction = manager.create(PointTransaction, {
          userId: user.id,
          type: TransactionType.EARN,
          amount: 1000,
          description: '회원가입 축하 포인트',
          referenceType: 'signup'
        });
        await manager.save(signupTransaction);

        // 일부 사용자에게 추가 포인트 거래 내역
        if (user.id % 2 === 0) {
          const loginTransaction = manager.create(PointTransaction, {
            userId: user.id,
            type: TransactionType.EARN,
            amount: 50,
            description: '일일 로그인 포인트',
            referenceType: 'daily_login'
          });
          await manager.save(loginTransaction);
        }
      }
    });

    console.log('✅ 시드 데이터 생성 완료!');

  } catch (error) {
    console.error('❌ 시드 데이터 생성 오류:', error);
    throw error;
  }
}
