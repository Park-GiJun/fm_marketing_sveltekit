// 순수 TypeORM 연결 테스트 (MySQL2 설정 최소화)
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// 환경변수 로드
config();

// 데이터베이스 설정
const DB_HOST = process.env.DB_HOST || '210.121.177.150';
const DB_PORT = parseInt(process.env.DB_PORT || '3306');
const DB_USERNAME = process.env.DB_USERNAME || 'gijunpark';
const DB_PASSWORD = process.env.DB_PASSWORD || 'park9832';
const DB_DATABASE = process.env.DB_DATABASE || 'FMMarketing';

// 최소한의 TypeORM 설정
const testDataSource = new DataSource({
  type: 'mysql',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: false,
  logging: false,
  entities: [],
  charset: 'utf8mb4'
});

async function testConnection() {
  try {
    console.log('🚀 TypeORM 연결 테스트 시작...');
    console.log(`📍 연결 정보: ${DB_HOST}:${DB_PORT}/${DB_DATABASE}`);
    
    await testDataSource.initialize();
    console.log('✅ 데이터베이스 연결 성공!');
    
    // 기본 쿼리 테스트
    console.log('\n📊 데이터베이스 정보:');
    
    const timeResult = await testDataSource.query('SELECT NOW() AS current_time');
    console.log('현재 시간:', timeResult[0].current_time);
    
    const dbResult = await testDataSource.query('SELECT DATABASE() AS db_name');
    console.log('데이터베이스:', dbResult[0].db_name);
    
    const versionResult = await testDataSource.query('SELECT VERSION() AS version');
    console.log('MySQL 버전:', versionResult[0].version);
    
    // 테이블 목록 확인
    console.log('\n📋 테이블 목록:');
    const tables = await testDataSource.query('SHOW TABLES');
    if (tables.length > 0) {
      tables.forEach(table => {
        const tableName = Object.values(table)[0];
        console.log(`- ${tableName}`);
      });
    } else {
      console.log('테이블이 없습니다.');
    }
    
    // 연결 해제
    await testDataSource.destroy();
    console.log('\n✅ 연결 해제 완료');
    console.log('🎉 테스트 성공!');
    
  } catch (error) {
    console.error('❌ 테스트 실패:', error.message);
    console.error('오류 유형:', error.constructor.name);
    
    if (error.code) {
      console.error('오류 코드:', error.code);
    }
    
    if (error.errno) {
      console.error('오류 번호:', error.errno);
    }
    
    console.log('\n💡 해결 방법:');
    console.log('1. .env 파일의 데이터베이스 설정 확인');
    console.log('2. MySQL 서버가 실행 중인지 확인');
    console.log('3. 네트워크 연결 확인');
    console.log('4. 사용자 권한 확인');
    
    process.exit(1);
  }
}

testConnection();
