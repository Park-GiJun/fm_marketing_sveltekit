// 데이터베이스 연결 테스트 스크립트 - MySQL 호환성 개선
import { config } from 'dotenv';

// 환경변수 로드
config();

async function testDatabaseConnection() {
  try {
    console.log('🚀 데이터베이스 연결 테스트 시작...');
    
    // MySQL2 동적 import
    const mysql = await import('mysql2/promise');
    
    const dbConfig = {
      host: process.env.DB_HOST || '210.121.177.150',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USERNAME || 'gijunpark',
      password: process.env.DB_PASSWORD || 'park9832',
      database: process.env.DB_DATABASE || 'FMMarketing',
      timezone: '+09:00',
      charset: 'utf8mb4'
    };
    
    console.log(`📍 연결 정보: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
    console.log(`👤 사용자: ${dbConfig.user}`);
    
    // 연결 생성
    const connection = await mysql.createConnection(dbConfig);
    
    // 기본 테스트 - 가장 간단한 쿼리부터
    console.log('\n📊 기본 연결 테스트:');
    
    // 1. 가장 기본적인 테스트
    const [basicResult] = await connection.execute('SELECT 1');
    console.log('✅ 기본 연결:', basicResult[0]['1'] === 1 ? '성공' : '실패');
    
    // 2. 현재 시간 (별칭 없이)
    const [timeResult] = await connection.execute('SELECT NOW()');
    console.log('✅ 현재 시간:', timeResult[0]['NOW()']);
    
    // 3. 데이터베이스 이름
    const [dbResult] = await connection.execute('SELECT DATABASE()');
    console.log('✅ 데이터베이스:', dbResult[0]['DATABASE()']);
    
    // 4. MySQL 버전
    const [versionResult] = await connection.execute('SELECT VERSION()');
    console.log('✅ MySQL 버전:', versionResult[0]['VERSION()']);
    
    // 권한 테스트
    console.log('\n🔐 권한 테스트:');
    try {
      const [userResult] = await connection.execute('SELECT USER()');
      console.log('✅ 현재 사용자:', userResult[0]['USER()']);
      
      // 테스트 테이블 생성 시도 (간단한 구조)
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS test_connection_temp (
          id INT AUTO_INCREMENT PRIMARY KEY,
          test_data VARCHAR(100)
        )
      `);
      console.log('✅ CREATE 권한 확인');
      
      // 테스트 데이터 삽입
      await connection.execute("INSERT INTO test_connection_temp (test_data) VALUES ('test')");
      console.log('✅ INSERT 권한 확인');
      
      // 테스트 데이터 조회
      const [testResult] = await connection.execute("SELECT * FROM test_connection_temp WHERE test_data = 'test'");
      console.log('✅ SELECT 권한 확인, 조회된 레코드:', testResult.length);
      
      // 테스트 데이터 업데이트
      await connection.execute("UPDATE test_connection_temp SET test_data = 'updated' WHERE test_data = 'test'");
      console.log('✅ UPDATE 권한 확인');
      
      // 테스트 테이블 삭제
      await connection.execute('DROP TABLE test_connection_temp');
      console.log('✅ DROP 권한 확인');
      
    } catch (permError) {
      console.error('❌ 권한 오류:', permError.message);
      console.error('오류 코드:', permError.code);
    }
    
    // 기존 테이블 확인
    console.log('\n📋 기존 테이블 확인:');
    const [tables] = await connection.execute('SHOW TABLES');
    if (tables.length > 0) {
      console.log('📊 기존 테이블 목록:');
      tables.forEach(table => {
        const tableName = Object.values(table)[0];
        console.log(`  - ${tableName}`);
      });
      
      // 각 테이블의 레코드 수 확인 (첫 번째 테이블만)
      if (tables.length > 0) {
        const firstTableName = Object.values(tables[0])[0];
        try {
          const [countResult] = await connection.execute(`SELECT COUNT(*) FROM ${firstTableName}`);
          const count = Object.values(countResult[0])[0];
          console.log(`    ${firstTableName}: ${count}개 레코드`);
        } catch (err) {
          console.log(`    ${firstTableName}: 조회 실패 (${err.message})`);
        }
      }
    } else {
      console.log('📝 테이블이 없습니다. 새로 생성됩니다.');
    }
    
    // 문자셋 확인 (변수 조회 방식)
    console.log('\n🔤 데이터베이스 설정 확인:');
    try {
      const [charsetResults] = await connection.execute("SHOW VARIABLES LIKE 'character_set%'");
      const [collationResults] = await connection.execute("SHOW VARIABLES LIKE 'collation%'");
      
      console.log('📝 문자셋 설정:');
      charsetResults.forEach(row => {
        if (row.Variable_name.includes('database') || row.Variable_name.includes('server')) {
          console.log(`  ${row.Variable_name}: ${row.Value}`);
        }
      });
      
      console.log('📝 콜레이션 설정:');
      collationResults.forEach(row => {
        if (row.Variable_name.includes('database') || row.Variable_name.includes('server')) {
          console.log(`  ${row.Variable_name}: ${row.Value}`);
        }
      });
    } catch (settingsError) {
      console.log('⚠️ 설정 정보 조회 건너뜀:', settingsError.message);
    }
    
    // 연결 종료
    await connection.end();
    
    console.log('\n🎉 데이터베이스 연결 테스트 성공!');
    console.log('✅ 모든 기본 권한이 정상적으로 확인되었습니다.');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ 데이터베이스 연결 테스트 실패:');
    console.error('오류 메시지:', error.message);
    
    if (error.code) {
      console.error('오류 코드:', error.code);
    }
    
    if (error.errno) {
      console.error('오류 번호:', error.errno);
    }
    
    if (error.sqlState) {
      console.error('SQL 상태:', error.sqlState);
    }
    
    if (error.sql) {
      console.error('실행된 SQL:', error.sql);
    }
    
    console.log('\n💡 해결 방법:');
    
    if (error.code === 'ER_PARSE_ERROR') {
      console.log('🔍 SQL 구문 오류가 발생했습니다:');
      console.log('1. MySQL 버전이 매우 오래된 경우일 수 있습니다.');
      console.log('2. 문자셋 설정에 문제가 있을 수 있습니다.');
      console.log('3. SQL 모드 설정에 문제가 있을 수 있습니다.');
      console.log('4. 데이터베이스 권한에 문제가 있을 수 있습니다.');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('🔍 연결 거부 오류:');
      console.log('1. MySQL 서버가 실행 중인지 확인하세요.');
      console.log('2. 포트가 올바른지 확인하세요.');
      console.log('3. 방화벽 설정을 확인하세요.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('🔍 접근 거부 오류:');
      console.log('1. 사용자명과 비밀번호를 확인하세요.');
      console.log('2. 사용자에게 해당 데이터베이스 접근 권한이 있는지 확인하세요.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('🔍 데이터베이스 오류:');
      console.log('1. 데이터베이스가 존재하는지 확인하세요.');
      console.log('2. 데이터베이스 이름이 올바른지 확인하세요.');
    } else {
      console.log('1. .env 파일의 데이터베이스 설정을 확인하세요.');
      console.log('2. MySQL 서버가 실행 중인지 확인하세요.');
      console.log('3. 네트워크 연결 및 방화벽 설정을 확인하세요.');
      console.log('4. 사용자 권한을 확인하세요.');
      console.log('5. 데이터베이스가 존재하는지 확인하세요.');
    }
    
    throw error;
  }
}

// 스크립트 실행
testDatabaseConnection()
  .then(() => {
    console.log('\n🚀 이제 개발 서버를 시작할 수 있습니다: npm run dev');
    process.exit(0);
  })
  .catch(() => {
    process.exit(1);
  });
