// TypeORM 데이터소스 설정 (Vite 호환 버전)
import { dev } from '$app/environment';

// 데이터소스 초기화 상태
let isInitialized = false;
let AppDataSource = null;

/**
 * TypeORM 동적 로드 및 초기화
 */
export async function initializeDataSource() {
  if (isInitialized && AppDataSource) {
    return AppDataSource;
  }

  try {
    // 서버 환경에서만 TypeORM 로드
    if (typeof window !== 'undefined') {
      console.log('클라이언트 환경에서는 데이터베이스 연결을 건너뜁니다.');
      return null;
    }

    // 동적 import로 TypeORM 로드
    const { DataSource } = await import('typeorm');
    const { config } = await import('dotenv');
    
    // 환경변수 로드
    config();

    // 환경변수에서 데이터베이스 설정 가져오기
    const DB_HOST = process.env.DB_HOST || '210.121.177.150';
    const DB_PORT = parseInt(process.env.DB_PORT || '3306');
    const DB_USERNAME = process.env.DB_USERNAME || 'gijunpark';
    const DB_PASSWORD = process.env.DB_PASSWORD || 'park9832';
    const DB_DATABASE = process.env.DB_DATABASE || 'FMMarketing';

    // 엔티티들 동적 로드
    let entities = [];
    try {
      const entityModules = await Promise.allSettled([
        import('./entities/User.js'),
        import('./entities/Experience.js'),
        import('./entities/ExperienceApplication.js'),
        import('./entities/CommunityPost.js'),
        import('./entities/Comment.js'),
        import('./entities/PointTransaction.js'),
        import('./entities/Notification.js'),
        import('./entities/Event.js'),
        import('./entities/Guide.js'),
        import('./entities/FAQ.js'),
        import('./entities/UploadedFile.js')
      ]);

      entities = entityModules
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value)
        .map(module => Object.values(module))
        .flat()
        .filter(entity => entity && typeof entity === 'function');

    } catch (entityError) {
      console.warn('일부 엔티티 로드 실패:', entityError.message);
      entities = [];
    }

    AppDataSource = new DataSource({
      type: 'mysql',
      host: DB_HOST,
      port: DB_PORT,
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_DATABASE,
      synchronize: dev,
      logging: dev,
      entities,
      charset: 'utf8mb4',
      timezone: '+09:00',
      extra: {
        charset: 'utf8mb4_unicode_ci',
        connectionLimit: 10,
        acquireTimeout: 60000,
        timeout: 60000
      },
      ssl: false
    });

    await AppDataSource.initialize();
    isInitialized = true;
    console.log('✅ TypeORM 데이터베이스 연결 성공');
    
    // 개발 환경에서 시드 데이터 생성
    if (dev && entities.length > 0) {
      await createSeedData();
    }
    
    return AppDataSource;

  } catch (error) {
    console.error('❌ TypeORM 데이터베이스 연결 실패:', error);
    
    // 개발 환경에서는 에러를 던지지 않고 경고만 출력
    if (dev) {
      console.warn('개발 환경에서 데이터베이스 연결 실패, 더미 데이터로 진행');
      isInitialized = true;
      return null;
    }
    throw error;
  }
}

/**
 * 데이터소스 가져오기 (싱글톤)
 */
export async function getDataSource() {
  if (!isInitialized) {
    await initializeDataSource();
  }
  return AppDataSource;
}

/**
 * 데이터베이스 연결 해제
 */
export async function closeDataSource() {
  if (isInitialized && AppDataSource?.isInitialized) {
    await AppDataSource.destroy();
    isInitialized = false;
    AppDataSource = null;
    console.log('데이터베이스 연결 해제 완료');
  }
}

/**
 * 시드 데이터 생성
 */
async function createSeedData() {
  try {
    if (!AppDataSource) {
      console.log('데이터소스가 없어 시드 데이터 생성 건너뜀');
      return;
    }

    // User 엔티티 찾기
    const userEntityMetadata = AppDataSource.entityMetadatas.find(
      metadata => metadata.name === 'User'
    );

    if (!userEntityMetadata) {
      console.log('User 엔티티가 없어 시드 데이터 생성 건너뜀');
      return;
    }

    const userRepository = AppDataSource.getRepository(userEntityMetadata.target);
    const existingAdmin = await userRepository.findOne({ where: { username: 'admin' } });
    
    if (existingAdmin) {
      console.log('시드 데이터가 이미 존재합니다.');
      return;
    }

    console.log('시드 데이터 생성 중...');
    
    // bcrypt 동적 import
    const bcrypt = await import('bcryptjs');
    
    await AppDataSource.transaction(async manager => {
      // 관리자 계정 생성
      const adminPassword = await bcrypt.hash('admin123!', 12);
      const admin = manager.create(userEntityMetadata.target, {
        username: 'admin',
        email: 'admin@fmmarketing.com',
        passwordHash: adminPassword,
        name: '관리자',
        nickname: '관리자',
        points: 50000,
        role: 'admin',
        level: 'platinum',
        isVerified: true
      });
      await manager.save(admin);

      // 테스트 사용자 생성
      const userPassword = await bcrypt.hash('user123!', 12);
      const testUser = manager.create(userEntityMetadata.target, {
        username: 'user1',
        email: 'user1@example.com',
        passwordHash: userPassword,
        name: '김철수',
        nickname: '철수',
        points: 5000,
        level: 'bronze',
        isVerified: true
      });
      await manager.save(testUser);

      console.log('✅ 시드 데이터 생성 완료');
    });

  } catch (error) {
    console.error('시드 데이터 생성 오류:', error);
    // 시드 데이터 생성 실패해도 앱은 계속 실행
  }
}

// 명명된 export (더미 값으로 대체)
export const UserRole = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator'
};

export const UserLevel = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum'
};

export const Gender = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other'
};

export const ExperienceType = {
  EXPERIENCE: '체험단',
  REPORTER: '기자단'
};

export const ExperienceStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  CLOSED: 'closed',
  COMPLETED: 'completed'
};

export const ApplicationStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed'
};

export const TransactionType = {
  EARN: 'earn',
  SPEND: 'spend',
  WITHDRAW: 'withdraw'
};

export const NotificationPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

export const EventType = {
  EVENT: 'event',
  NOTICE: 'notice'
};
