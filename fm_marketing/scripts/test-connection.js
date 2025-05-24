// TypeORM 연결 테스트 스크립트
import { initializeDataSource, closeDataSource } from '../src/lib/server/data-source-unified.js';

async function testConnection() {
  try {
    console.log('TypeORM 데이터베이스 연결 테스트 시작...');
    
    const dataSource = await initializeDataSource();
    console.log('✅ 연결 성공!');
    
    // 간단한 쿼리 테스트
    const result = await dataSource.query('SELECT CURRENT_TIMESTAMP() AS current_time');
    console.log('현재 시간:', result[0].current_time);
    
    // 테이블 목록 확인
    const tables = await dataSource.query('SHOW TABLES');
    console.log('테이블 목록:', tables.map(table => Object.values(table)[0]));
    
    await closeDataSource();
    console.log('연결 해제 완료');
    
  } catch (error) {
    console.error('❌ 연결 실패:', error);
  }
}

testConnection();
