// TypeORM 데이터소스 설정

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
  migrations: ['src/lib/server/migrations/*.ts'],
  subscribers: ['src/lib/server/subscribers/*.ts'],
  charset: 'utf8mb4',
  timezone: '+09:00', // 한국 시간대
  extra: {
    charset: 'utf8mb4_unicode_ci',
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000
  },
  ssl: false // SSL 비활성화
});

// 데이터소스 초기화
let isInitialized = false;

export async function initializeDatabase() {
  if (isInitialized) {
    return AppDataSource;
  }

  try {
    await AppDataSource.initialize();
    isInitialized = true;
    console.log('데이터베이스 연결 성공');
    return AppDataSource;
  } catch (error) {
    console.error('데이터베이스 연결 실패:', error);
    throw error;
  }
}

// 데이터소스 가져오기 (싱글톤)
export async function getDataSource() {
  if (!isInitialized) {
    await initializeDatabase();
  }
  return AppDataSource;
}
