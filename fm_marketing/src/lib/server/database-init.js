// TypeORM 데이터베이스 초기화
export async function initializeDatabase() {
  try {
    console.log('TypeORM 데이터베이스 초기화 시작...');
    
    // 동적 import로 TypeORM 모듈들 로드
    const { DataSource } = await import('typeorm');
    const bcrypt = await import('bcryptjs');
    
    // 환경변수에서 데이터베이스 설정
    const dataSource = new DataSource({
      type: 'mysql',
      host: process.env.DB_HOST || '210.121.177.150',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME || 'gijunpark',
      password: process.env.DB_PASSWORD || 'park9832',
      database: process.env.DB_DATABASE || 'FMMarketing',
      synchronize: true, // 개발 환경에서만 사용
      logging: true,
      entities: [], // 엔티티는 나중에 추가
      charset: 'utf8mb4',
      timezone: '+09:00',
      extra: {
        charset: 'utf8mb4_unicode_ci',
        connectionLimit: 10,
        acquireTimeout: 60000,
        timeout: 60000
      },
      ssl: false
    });

    // 데이터베이스 연결
    await dataSource.initialize();
    console.log('✅ TypeORM 데이터베이스 연결 성공');

    // 테이블 생성 (SQL로 직접 생성)
    await createTables(dataSource);
    
    // 시드 데이터 생성
    await createSeedData(dataSource, bcrypt);
    
    // 전역 변수에 저장
    global.dataSource = dataSource;
    
    return dataSource;
    
  } catch (error) {
    console.error('❌ 데이터베이스 초기화 실패:', error);
    throw error;
  }
}

async function createTables(dataSource) {
  console.log('테이블 생성 중...');
  
  const queryRunner = dataSource.createQueryRunner();
  
  try {
    // 사용자 테이블
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(50) NOT NULL,
        nickname VARCHAR(50),
        profile_image TEXT,
        phone VARCHAR(20),
        birth_date DATE,
        gender ENUM('male', 'female', 'other'),
        address TEXT,
        blog_url VARCHAR(255),
        instagram_url VARCHAR(255),
        youtube_url VARCHAR(255),
        points INT DEFAULT 0,
        level ENUM('bronze', 'silver', 'gold', 'platinum') DEFAULT 'bronze',
        is_active BOOLEAN DEFAULT TRUE,
        is_verified BOOLEAN DEFAULT FALSE,
        role ENUM('user', 'admin', 'moderator') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);

    // 포인트 거래 테이블
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS point_transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        type ENUM('earn', 'spend', 'withdraw') NOT NULL,
        amount INT NOT NULL,
        description TEXT,
        reference_type VARCHAR(50),
        reference_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);

    // 체험단 테이블
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS experiences (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        type ENUM('체험단', '기자단') NOT NULL,
        region VARCHAR(50) NOT NULL,
        location TEXT,
        start_date DATE,
        end_date DATE,
        application_deadline DATE,
        max_participants INT,
        current_participants INT DEFAULT 0,
        required_points INT DEFAULT 0,
        reward_points INT DEFAULT 0,
        reward_description TEXT,
        requirements TEXT,
        company_name VARCHAR(255),
        contact_info VARCHAR(500),
        images TEXT,
        tags TEXT,
        status ENUM('draft', 'active', 'closed', 'completed') DEFAULT 'active',
        is_promoted BOOLEAN DEFAULT FALSE,
        views INT DEFAULT 0,
        likes INT DEFAULT 0,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id)
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);

    // 커뮤니티 게시글 테이블
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS community_posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        author_id INT NOT NULL,
        images TEXT,
        tags TEXT,
        views INT DEFAULT 0,
        likes INT DEFAULT 0,
        is_pinned BOOLEAN DEFAULT FALSE,
        is_deleted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id)
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);

    console.log('✅ 테이블 생성 완료');
  } finally {
    await queryRunner.release();
  }
}

async function createSeedData(dataSource, bcrypt) {
  console.log('시드 데이터 확인 중...');
  
  try {
    // 기존 관리자 계정 확인
    const [existingAdmin] = await dataSource.query('SELECT id FROM users WHERE username = ?', ['admin']);
    
    if (existingAdmin) {
      console.log('시드 데이터가 이미 존재합니다.');
      return;
    }
    
    console.log('시드 데이터 생성 중...');
    
    // 관리자 계정 생성
    const adminPassword = await bcrypt.hash('admin123!', 12);
    
    await dataSource.query(`
      INSERT INTO users (username, email, password_hash, name, nickname, points, role, level, is_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, ['admin', 'admin@fmmarketing.com', adminPassword, '관리자', '관리자', 50000, 'admin', 'platinum', 1]);
    
    // 테스트 사용자 생성
    const userPassword = await bcrypt.hash('user123!', 12);
    
    const testUsers = [
      ['user1', 'user1@example.com', userPassword, '김철수', '철수', 5000, 'user', 'bronze', 1],
      ['user2', 'user2@example.com', userPassword, '이영희', '영희', 12000, 'user', 'silver', 1],
      ['user3', 'user3@example.com', userPassword, '박민수', '민수', 25000, 'user', 'gold', 1]
    ];
    
    for (const userData of testUsers) {
      await dataSource.query(`
        INSERT INTO users (username, email, password_hash, name, nickname, points, role, level, is_verified)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, userData);
    }
    
    // 체험단 데이터 생성
    await dataSource.query(`
      INSERT INTO experiences (title, content, category, type, region, location, start_date, end_date, application_deadline, max_participants, current_participants, required_points, reward_points, reward_description, requirements, company_name, contact_info, images, tags, status, is_promoted, views, likes, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      '서울 맛집 탐방 체험단',
      '서울 강남구에 새로 오픈한 이탈리안 레스토랑 체험단을 모집합니다.',
      '음식점',
      '체험단',
      '서울',
      '서울특별시 강남구 테헤란로 123',
      '2025-06-15',
      '2025-06-30',
      '2025-06-10',
      10,
      3,
      0,
      5000,
      '5만원 상당 코스 요리 + 5000 포인트',
      '블로그 또는 인스타그램 후기 필수',
      '벨라비타 레스토랑',
      '02-123-4567',
      JSON.stringify(['/images/restaurant1.jpg']),
      JSON.stringify(['맛집', '이탈리안', '강남']),
      'active',
      1,
      245,
      15,
      1
    ]);
    
    console.log('✅ 시드 데이터 생성 완료');
    
  } catch (error) {
    console.error('❌ 시드 데이터 생성 오류:', error);
    // 시드 데이터 생성 실패해도 앱은 계속 실행
  }
}

export async function getDataSource() {
  if (global.dataSource && global.dataSource.isInitialized) {
    return global.dataSource;
  }
  return await initializeDatabase();
}

export async function closeDatabase() {
  if (global.dataSource && global.dataSource.isInitialized) {
    await global.dataSource.destroy();
    console.log('데이터베이스 연결 종료');
  }
}
