// 통합된 TypeORM 데이터소스 설정

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { dev } from '$app/environment';
import {
  User,
  Experience,
  ExperienceApplication,
  CommunityPost,
  Comment,
  PointTransaction,
  Notification,
  Event,
  Guide,
  FAQ,
  UploadedFile
} from './entities/index.js';

// 환경변수 로드
config();

// 환경변수에서 데이터베이스 설정 가져오기
const DB_HOST = process.env.DB_HOST || '210.121.177.150';
const DB_PORT = parseInt(process.env.DB_PORT || '3306');
const DB_USERNAME = process.env.DB_USERNAME || 'gijunpark';
const DB_PASSWORD = process.env.DB_PASSWORD || 'park9832';
const DB_DATABASE = process.env.DB_DATABASE || 'FMMarketing';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: dev, // 개발 환경에서만 자동 동기화
  logging: dev, // 개발 환경에서만 SQL 로깅
  entities: [
    User,
    Experience,
    ExperienceApplication,
    CommunityPost,
    Comment,
    PointTransaction,
    Notification,
    Event,
    Guide,
    FAQ,
    UploadedFile
  ],
  charset: 'utf8mb4',
  timezone: '+09:00', // 한국 시간대
  extra: {
    charset: 'utf8mb4_unicode_ci'
  },
  ssl: false // SSL 비활성화
});

// 데이터소스 초기화 상태
let isInitialized = false;

/**
 * 데이터소스 초기화
 */
export async function initializeDataSource() {
  if (isInitialized) {
    return AppDataSource;
  }

  try {
    await AppDataSource.initialize();
    isInitialized = true;
    console.log('✅ TypeORM 데이터베이스 연결 성공');
    
    // 개발 환경에서 시드 데이터 생성
    if (dev) {
      await createSeedData();
    }
    
    return AppDataSource;
  } catch (error) {
    console.error('❌ TypeORM 데이터베이스 연결 실패:', error);
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
  if (isInitialized && AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    isInitialized = false;
    console.log('데이터베이스 연결 해제 완료');
  }
}

/**
 * 시드 데이터 생성
 */
async function createSeedData() {
  try {
    const userRepository = AppDataSource.getRepository(User);
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
      const admin = manager.create(User, {
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

      // 테스트 사용자들 생성
      const userPassword = await bcrypt.hash('user123!', 12);
      const testUsers = [
        {
          username: 'user1',
          email: 'user1@example.com',
          passwordHash: userPassword,
          name: '김철수',
          nickname: '철수',
          points: 5000,
          level: 'bronze',
          isVerified: true
        },
        {
          username: 'user2',
          email: 'user2@example.com',
          passwordHash: userPassword,
          name: '이영희',
          nickname: '영희',
          points: 12000,
          level: 'silver',
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
      const experience = manager.create(Experience, {
        title: '서울 맛집 탐방 체험단',
        content: '서울 강남구에 새로 오픈한 이탈리안 레스토랑 체험단을 모집합니다.',
        category: '음식점',
        type: '체험단',
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
        requirements: '블로그 또는 인스타그램 후기 필수',
        companyName: '벨라비타 레스토랑',
        contactInfo: '02-123-4567',
        images: JSON.stringify(['/images/restaurant1.jpg']),
        tags: JSON.stringify(['맛집', '이탈리안', '강남']),
        status: 'active',
        isPromoted: true,
        views: 245,
        likes: 15,
        createdById: admin.id
      });
      await manager.save(experience);

      console.log('✅ 시드 데이터 생성 완료');
    });

  } catch (error) {
    console.error('시드 데이터 생성 오류:', error);
    // 시드 데이터 생성 실패해도 앱은 계속 실행
  }
}
