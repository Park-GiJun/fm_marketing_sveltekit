// MySQL 서버 정보 디버깅
import { config } from 'dotenv';
import mysql from 'mysql2/promise';

config();

async function debugMysql() {
  let connection;
  
  try {
    console.log('🔧 MySQL 서버 디버깅...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || '210.121.177.150',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USERNAME || 'gijunpark',
      password: process.env.DB_PASSWORD || 'park9832',
      database: process.env.DB_DATABASE || 'FMMarketing'
    });

    console.log('✅ 기본 연결 성공');
    
    // MySQL 버전 확인 (가장 안전한 방법)
    try {
      const [version] = await connection.execute('SELECT VERSION()');
      console.log('MySQL 버전:', Object.values(version[0])[0]);
    } catch (e) {
      console.log('버전 조회 실패:', e.message);
    }
    
    // SQL 모드 확인
    try {
      const [sqlMode] = await connection.execute('SELECT @@sql_mode');
      console.log('SQL 모드:', Object.values(sqlMode[0])[0]);
    } catch (e) {
      console.log('SQL 모드 조회 실패:', e.message);
    }
    
    // 현재 데이터베이스 확인
    try {
      const [db] = await connection.execute('SELECT DATABASE()');
      console.log('현재 DB:', Object.values(db[0])[0]);
    } catch (e) {
      console.log('DB 조회 실패:', e.message);
    }
    
    // 현재 시간 (여러 방법으로 시도)
    const timeMethods = [
      'SELECT NOW()',
      'SELECT CURRENT_TIMESTAMP',
      'SELECT CURRENT_TIMESTAMP()',
      'SELECT SYSDATE()'
    ];
    
    for (const method of timeMethods) {
      try {
        const [time] = await connection.execute(method);
        console.log(`${method}: ${Object.values(time[0])[0]}`);
        break; // 첫 번째 성공하면 중단
      } catch (e) {
        console.log(`${method} 실패:`, e.message);
      }
    }
    
    console.log('🎯 디버깅 완료');
    
  } catch (error) {
    console.error('❌ 디버깅 실패:', error.message);
    console.error('전체 오류:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

debugMysql();
