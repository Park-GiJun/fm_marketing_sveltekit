// 데이터베이스 초기 설정 스크립트
import 'reflect-metadata';
import { initializeDataSource } from '../src/lib/server/data-source.js';

async function setupDatabase() {
  try {
    console.log('🚀 데이터베이스 설정 시작...');
    
    const dataSource = await initializeDataSource();
    
    if (dataSource) {
      console.log('✅ 데이터베이스 연결 성공');
      console.log('✅ 테이블 동기화 완료');
      console.log('✅ 시드 데이터 생성 완료');
      
      await dataSource.destroy();
      console.log('✅ 연결 해제 완료');
    } else {
      console.log('⚠️ 데이터베이스 연결 실패 - 더미 모드로 동작');
    }
    
    console.log('🎉 설정 완료!');
    
  } catch (error) {
    console.error('❌ 설정 실패:', error);
    process.exit(1);
  }
}

setupDatabase();
