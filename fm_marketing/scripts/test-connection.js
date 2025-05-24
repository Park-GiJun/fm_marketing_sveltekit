// TypeORM 연결 테스트 스크립트 - Node.js 환경용
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

// 간단한 데이터소스 생성 (테스트용)
const testDataSource = new DataSource({
  type: 'mysql',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: false, // 테스트에서는 스키마 변경 안함
  logging: true,
  entities: [], // 엔티티 없이 기본 연결만 테스트
  charset: 'utf8mb4',
  timezone: '+09:00',
  extra: {
    charset: 'utf8mb4_unicode_ci',
    connectionLimit: 5,
    acquireTimeout: 30000,
    timeout: 30000
  },
  ssl: false
});

async function testConnection() {
  try {
    console.log('🚀 TypeORM 데이터베이스 연결 테스트 시작...');
    console.log(`📍 연결 정보: ${DB_HOST}:${DB_PORT}/${DB_DATABASE}`);
    
    await testDataSource.initialize();
    console.log('✅ 데이터베이스 연결 성공!');
    
    // 간단한 쿼리 테스트
    const result = await testDataSource.query('SELECT CURRENT_TIMESTAMP() AS current_time, DATABASE() AS db_name, VERSION() AS version');
    console.log('📅 현재 시간:', result[0].current_time);
    console.log('🗄️ 연결된 데이터베이스:', result[0].db_name);
    console.log('📊 MySQL 버전:', result[0].version);
    
    // 테이블 목록 확인
    const tables = await testDataSource.query('SHOW TABLES');
    console.log('📋 테이블 목록:', tables.map(table => Object.values(table)[0]));
    
    // 테이블별 레코드 수 확인
    const tableNames = tables.map(table => Object.values(table)[0]);
    
    for (const tableName of tableNames) {
      try {
        const [countResult] = await testDataSource.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        console.log(`📊 ${tableName}: ${countResult.count}개 레코드`);
      } catch (err) {
        console.log(`⚠️ ${tableName}: 조회 실패 (${err.message})`);
      }
    }
    
    // 사용자 테이블이 있다면 관리자 계정 확인
    if (tableNames.includes('users')) {
      try {
        const [adminUser] = await testDataSource.query(`
          SELECT id, username, name, role, created_at 
          FROM users 
          WHERE role = 'admin' 
          LIMIT 1
        `);
        
        if (adminUser) {
          console.log('👑 관리자 계정:', {
            id: adminUser.id,
            username: adminUser.username,
            name: adminUser.name,
            role: adminUser.role,
            created: adminUser.created_at
          });
        } else {
          console.log('⚠️ 관리자 계정이 없습니다.');
        }
      } catch (err) {
        console.log('⚠️ 사용자 정보 조회 실패:', err.message);
      }
    }
    
    await testDataSource.destroy();
    console.log('✅ 연결 해제 완료');
    console.log('\n🎉 모든 테스트 통과!');
    
  } catch (error) {
    console.error('❌ 테스트 실패:', error.message);
    
    if (error.code) {
      console.error('🔍 오류 코드:', error.code);
    }
    
    if (error.errno) {
      console.error('🔍 오류 번호:', error.errno);
    }
    
    // 일반적인 연결 오류 해결 방법 안내
    console.log('\n💡 문제 해결 방법:');
    console.log('1. 환경변수(.env) 파일의 데이터베이스 설정을 확인하세요.');
    console.log('2. 데이터베이스 서버가 실행 중인지 확인하세요.');
    console.log('3. 방화벽 설정을 확인하세요.');
    console.log('4. 데이터베이스 사용자 권한을 확인하세요.');
    
    process.exit(1);
  }
}

testConnection();
