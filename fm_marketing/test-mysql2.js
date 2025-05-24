// MySQL2 전용 연결 테스트 (구문 오류 수정)
import { config } from 'dotenv';
import mysql from 'mysql2/promise';

config();

async function testMysql2Connection() {
  try {
    console.log('🚀 MySQL2 연결 테스트 시작...');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '210.121.177.150',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USERNAME || 'gijunpark',
      password: process.env.DB_PASSWORD || 'park9832',
      database: process.env.DB_DATABASE || 'FMMarketing',
      timezone: '+09:00',
      charset: 'utf8mb4'
    });

    console.log('✅ 데이터베이스 연결 성공!');
    
    // 1. 가장 기본적인 테스트
    const [basicResult] = await connection.execute('SELECT 1 as test');
    console.log('기본 테스트:', basicResult[0].test === 1 ? '성공' : '실패');
    
    // 2. 현재 시간 (MySQL 호환 방식)
    const [timeResult] = await connection.execute('SELECT NOW() as now_time');
    console.log('현재 시간:', timeResult[0].now_time);
    
    // 3. 데이터베이스 이름
    const [dbResult] = await connection.execute('SELECT DATABASE() as db_name');
    console.log('데이터베이스:', dbResult[0].db_name);
    
    // 4. MySQL 버전
    const [versionResult] = await connection.execute('SELECT VERSION() as version');
    console.log('MySQL 버전:', versionResult[0].version);
    
    // 5. 테이블 목록 확인
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('테이블 수:', tables.length);
    
    if (tables.length > 0) {
      console.log('기존 테이블들:');
      tables.forEach((table, index) => {
        const tableName = Object.values(table)[0];
        console.log(`  ${index + 1}. ${tableName}`);
      });
    } else {
      console.log('📝 테이블이 없습니다. 새로 생성됩니다.');
    }
    
    // 6. 사용자 권한 확인
    try {
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS test_permissions (
          id INT AUTO_INCREMENT PRIMARY KEY,
          test_data VARCHAR(100)
        )
      `);
      console.log('✅ CREATE 권한 확인');
      
      await connection.execute("INSERT INTO test_permissions (test_data) VALUES ('test')");
      console.log('✅ INSERT 권한 확인');
      
      const [testData] = await connection.execute("SELECT * FROM test_permissions WHERE test_data = 'test'");
      console.log('✅ SELECT 권한 확인, 조회 레코드:', testData.length);
      
      await connection.execute('DROP TABLE test_permissions');
      console.log('✅ DROP 권한 확인');
      
    } catch (permError) {
      console.warn('⚠️ 일부 권한 확인 실패:', permError.message);
    }
    
    await connection.end();
    console.log('🎉 MySQL2 연결 테스트 완료!');
    console.log('이제 개발 서버를 시작할 수 있습니다: npm run dev');
    
  } catch (error) {
    console.error('❌ MySQL2 테스트 실패:', error.message);
    
    if (error.code) {
      console.error('오류 코드:', error.code);
    }
    
    // 구체적인 해결 방법 제시
    console.log('\n💡 해결 방법:');
    if (error.message.includes('syntax')) {
      console.log('1. MySQL 버전이 오래된 경우일 수 있습니다.');
      console.log('2. SQL 모드 설정을 확인해보세요.');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('1. MySQL 서버가 실행 중인지 확인하세요.');
      console.log('2. 포트 번호를 확인하세요.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('1. 사용자명과 비밀번호를 확인하세요.');
      console.log('2. 데이터베이스 접근 권한을 확인하세요.');
    }
    
    process.exit(1);
  }
}

testMysql2Connection();
