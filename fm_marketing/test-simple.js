// 가장 간단한 MySQL2 연결 테스트
import { config } from 'dotenv';
import mysql from 'mysql2/promise';

config();

async function simpleTest() {
  let connection;
  
  try {
    console.log('🔍 간단한 MySQL 연결 테스트...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || '210.121.177.150',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USERNAME || 'gijunpark',
      password: process.env.DB_PASSWORD || 'park9832',
      database: process.env.DB_DATABASE || 'FMMarketing'
    });

    console.log('✅ 연결 성공!');
    
    // 가장 기본적인 쿼리만
    const [rows] = await connection.execute('SELECT 1');
    console.log('✅ 쿼리 실행 성공!');
    
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`📊 테이블 개수: ${tables.length}`);
    
    console.log('🎉 모든 테스트 통과!');
    
  } catch (error) {
    console.error('❌ 오류:', error.message);
    console.error('코드:', error.code);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 연결 종료');
    }
  }
}

simpleTest();
