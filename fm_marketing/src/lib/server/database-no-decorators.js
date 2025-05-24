// 데코레이터 없는 TypeORM 설정
import { DataSource, EntitySchema } from 'typeorm';
import { config } from 'dotenv';
import { User, UserEntitySchema } from './entities-simple/User.js';

// 환경변수 로드
config();

// 환경변수에서 데이터베이스 설정 가져오기
const DB_HOST = process.env.DB_HOST || '210.121.177.150';
const DB_PORT = parseInt(process.env.DB_PORT || '3306');
const DB_USERNAME = process.env.DB_USERNAME || 'gijunpark';
const DB_PASSWORD = process.env.DB_PASSWORD || 'park9832';
const DB_DATABASE = process.env.DB_DATABASE || 'FMMarketing';

// EntitySchema 생성
const UserEntity = new EntitySchema(UserEntitySchema);

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: false, // 개발 환경에서만 자동 동기화
  logging: false, // 개발 환경에서만 SQL 로깅
  entities: [UserEntity],
  charset: 'utf8mb4'
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
