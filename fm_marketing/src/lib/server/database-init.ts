import { getDataSource } from './data-source.js';
import { seedDatabase } from './seed.js';

/**
 * 데이터베이스 초기화 함수
 */
export async function initializeDatabase() {
  try {
    console.log('TypeORM 데이터베이스 연결 중...');
    const dataSource = await getDataSource();
    
    console.log('✅ TypeORM 데이터베이스 연결 성공');
    
    // 개발 환경에서만 스키마 동기화
    if (process.env.NODE_ENV === 'development') {
      console.log('데이터베이스 스키마 동기화 중...');
      await dataSource.synchronize();
      console.log('✅ 스키마 동기화 완료');
      
      // 시드 데이터 생성 (개발 환경에서만)
      console.log('시드 데이터 생성 중...');
      try {
        await seedDatabase();
        console.log('✅ 시드 데이터 생성 완료');
      } catch (seedError) {
        console.log('⚠️ 시드 데이터가 이미 존재하거나 생성 중 오류 발생:', seedError.message);
      }
    }
    
    return dataSource;
  } catch (error) {
    console.error('❌ 데이터베이스 초기화 실패:', error);
    throw error;
  }
}

/**
 * 데이터베이스 연결 해제
 */
export async function closeDatabase() {
  try {
    const dataSource = await getDataSource();
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('데이터베이스 연결 해제 완료');
    }
  } catch (error) {
    console.error('데이터베이스 연결 해제 실패:', error);
  }
}
