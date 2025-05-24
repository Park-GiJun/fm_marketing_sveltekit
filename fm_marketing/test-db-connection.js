// 데이터베이스 연결 테스트
import { config } from 'dotenv';
import mysql from 'mysql2/promise';

// 환경변수 로드
config();

async function testConnection() {
  try {
    console.log('데이터베이스 연결 테스트 시작...');
    
    const connection = await mysql.createConnection({
      host: '210.121.177.150',
      port: 3306,
      user: 'gijunpark',
      password: 'park9832',
      database: 'FMMarketing',
      timezone: '+09:00',
      ssl: false
    });

    console.log('✅ 데이터베이스 연결 성공!');
    
    // 간단한 쿼리 테스트
    const [rows] = await connection.execute('SELECT CURRENT_TIMESTAMP() AS current_time');
    console.log('현재 시간:', rows[0].current_time);
    
    // 데이터베이스 정보 확인
    const [dbInfo] = await connection.execute('SELECT DATABASE() AS db_name');
    console.log('연결된 데이터베이스:', dbInfo[0].db_name);
    
    // MySQL 버전 확인
    const [version] = await connection.execute('SELECT VERSION() AS version');
    console.log('MySQL 버전:', version[0].version);
    
    // 테이블 목록 확인
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('테이블 목록:', tables.map(table => Object.values(table)[0]));
    
    await connection.end();
    console.log('연결 종료');
    
  } catch (error) {
    console.error('❌ 데이터베이스 연결 실패:', error.message);
    console.error('오류 코드:', error.code);
    console.error('SQL 상태:', error.sqlState);
  }
}

testConnection();
