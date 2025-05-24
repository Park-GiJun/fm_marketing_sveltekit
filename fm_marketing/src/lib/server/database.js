// 안정화된 MySQL2 데이터베이스 연결 - 수정된 버전
import { dev } from '$app/environment';

let pool = null;
let isInitialized = false;
let initializationPromise = null;

/**
 * MySQL 연결 풀 생성
 */
async function createPool() {
  if (pool) return pool;

  try {
    const mysql = await import('mysql2/promise');
    const { config } = await import('dotenv');
    
    config();

    const dbConfig = {
      host: process.env.DB_HOST || '210.121.177.150',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USERNAME || 'gijunpark',
      password: process.env.DB_PASSWORD || 'park9832',
      database: process.env.DB_DATABASE || 'FMMarketing',
      timezone: '+09:00',
      charset: 'utf8mb4',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      acquireTimeout: 60000,
      timeout: 60000
    };

    console.log(`📍 데이터베이스 연결 시도: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
    
    pool = mysql.createPool(dbConfig);
    
    // 연결 테스트
    const connection = await pool.getConnection();
    const [result] = await connection.execute('SELECT 1 as test');
    connection.release();
    
    if (result[0].test !== 1) {
      throw new Error('데이터베이스 연결 테스트 실패');
    }
    
    console.log('✅ MySQL 데이터베이스 연결 성공');
    return pool;

  } catch (error) {
    console.error('❌ MySQL 데이터베이스 연결 실패:', error);
    pool = null;
    throw new Error(`데이터베이스 연결 실패: ${error.message}`);
  }
}

/**
 * 테이블 생성
 */
async function createTables() {
  if (!pool) {
    throw new Error('데이터베이스 연결이 없어 테이블을 생성할 수 없습니다.');
  }
  
  console.log('📋 테이블 생성 중...');
  
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
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
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    
    `CREATE TABLE IF NOT EXISTS experiences (
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
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    
    `CREATE TABLE IF NOT EXISTS community_posts (
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
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    
    `CREATE TABLE IF NOT EXISTS comments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      post_id INT NOT NULL,
      parent_id INT,
      author_id INT NOT NULL,
      content TEXT NOT NULL,
      is_deleted BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES community_posts(id),
      FOREIGN KEY (parent_id) REFERENCES comments(id),
      FOREIGN KEY (author_id) REFERENCES users(id)
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    
    `CREATE TABLE IF NOT EXISTS point_transactions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      type ENUM('earn', 'spend', 'withdraw') NOT NULL,
      amount INT NOT NULL,
      description TEXT,
      reference_type VARCHAR(50),
      reference_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    
    `CREATE TABLE IF NOT EXISTS experience_applications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      experience_id INT NOT NULL,
      user_id INT NOT NULL,
      application_text TEXT,
      status ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
      reviewed_at DATETIME,
      reviewed_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (experience_id) REFERENCES experiences(id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (reviewed_by) REFERENCES users(id),
      UNIQUE KEY unique_application (experience_id, user_id)
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    
    `CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      type VARCHAR(50) NOT NULL,
      title VARCHAR(200) NOT NULL,
      message TEXT,
      action_url VARCHAR(255),
      priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    
    `CREATE TABLE IF NOT EXISTS events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      content TEXT NOT NULL,
      type ENUM('event', 'notice') NOT NULL,
      category VARCHAR(50),
      image_url TEXT,
      start_date DATE,
      end_date DATE,
      is_active BOOLEAN DEFAULT TRUE,
      is_important BOOLEAN DEFAULT FALSE,
      views INT DEFAULT 0,
      created_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    
    `CREATE TABLE IF NOT EXISTS guides (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      content TEXT NOT NULL,
      category VARCHAR(50) NOT NULL,
      thumbnail TEXT,
      order_index INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      views INT DEFAULT 0,
      created_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    
    `CREATE TABLE IF NOT EXISTS faqs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      category VARCHAR(50) NOT NULL,
      order_index INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  ];
  
  for (const table of tables) {
    try {
      const [rows] = await pool.execute(table);
    } catch (error) {
      console.error('테이블 생성 실패:', error);
      throw error;
    }
  }
  
  console.log('✅ 테이블 생성 완료');
}

/**
 * 시드 데이터 생성
 */
async function createSeedData() {
  if (!pool) {
    throw new Error('데이터베이스 연결이 없어 시드 데이터를 생성할 수 없습니다.');
  }
  
  try {
    // 기존 관리자 계정 확인
    const [existingAdmin] = await pool.execute('SELECT id FROM users WHERE username = ?', ['admin']);
    
    if (existingAdmin.length > 0) {
      console.log('✅ 시드 데이터가 이미 존재합니다.');
      return;
    }
    
    console.log('📝 시드 데이터 생성 중...');
    
    // bcrypt 동적 import
    const bcryptModule = await import('bcryptjs');
    const bcrypt = bcryptModule.default || bcryptModule;
    
    // 관리자 계정 생성
    const adminPassword = await bcrypt.hash('admin123!', 12);
    
    await pool.execute(`
      INSERT INTO users (username, email, password_hash, name, nickname, points, role, level, is_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, ['admin', 'admin@fmmarketing.com', adminPassword, '관리자', '관리자', 50000, 'admin', 'platinum', 1]);
    
    // 테스트 사용자 생성
    const userPassword = await bcrypt.hash('user123!', 12);
    
    await pool.execute(`
      INSERT INTO users (username, email, password_hash, name, nickname, points, level, is_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, ['user1', 'user1@example.com', userPassword, '김철수', '철수', 5000, 'bronze', 1]);
    
    // 체험단 데이터 생성
    await pool.execute(`
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
    
    // 추가 체험단 데이터
    await pool.execute(`
      INSERT INTO experiences (title, content, category, type, region, location, start_date, end_date, application_deadline, max_participants, current_participants, required_points, reward_points, reward_description, requirements, company_name, contact_info, images, tags, status, is_promoted, views, likes, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      '제주도 카페 체험단',
      '제주도 애월읍에 위치한 오션뷰 카페 체험단을 모집합니다.',
      '카페',
      '체험단',
      '제주',
      '제주특별자치도 제주시 애월읍 애월해안로 123',
      '2025-07-01',
      '2025-07-15',
      '2025-06-25',
      5,
      1,
      1000,
      3000,
      '음료 및 디저트 무료 + 3000 포인트',
      '인스타그램 피드 포스팅 필수',
      '오션뷰 카페',
      '064-123-4567',
      JSON.stringify(['/images/cafe1.jpg']),
      JSON.stringify(['카페', '제주', '애월']),
      'active',
      0,
      89,
      7,
      1
    ]);
    
    // 커뮤니티 게시글 데이터
    await pool.execute(`
      INSERT INTO community_posts (title, content, category, author_id, images, tags, views, likes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      '첫 체험단 후기입니다!',
      '안녕하세요! FM마케팅을 통해 처음으로 체험단에 참여했는데 정말 좋았습니다.',
      '체험 후기',
      2,
      JSON.stringify([]),
      JSON.stringify(['후기', '체험단']),
      45,
      3
    ]);
    
    // 이벤트/공지사항 데이터
    await pool.execute(`
      INSERT INTO events (title, content, type, category, is_important, created_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      'FM마케팅 오픈 기념 이벤트',
      '신규 가입 회원 전원에게 1000 포인트를 지급합니다!',
      'event',
      '가입 이벤트',
      1,
      1
    ]);
    
    await pool.execute(`
      INSERT INTO events (title, content, type, category, created_by)
      VALUES (?, ?, ?, ?, ?)
    `, [
      '서비스 이용 안내',
      'FM마케팅 서비스 이용에 대한 안내사항입니다.',
      'notice',
      '공지',
      1
    ]);
    
    // 가이드 데이터
    await pool.execute(`
      INSERT INTO guides (title, content, category, order_index, created_by)
      VALUES (?, ?, ?, ?, ?)
    `, [
      '체험단 신청 방법',
      '체험단 신청 방법에 대한 자세한 가이드입니다...',
      '기본 가이드',
      1,
      1
    ]);
    
    // FAQ 데이터
    await pool.execute(`
      INSERT INTO faqs (question, answer, category, order_index, created_by)
      VALUES (?, ?, ?, ?, ?)
    `, [
      '체험단 선정 기준은 무엇인가요?',
      '체험단 선정은 SNS 활동, 이전 리뷰 품질, 신청서 내용 등을 종합적으로 고려합니다.',
      '체험단',
      1,
      1
    ]);
    
    // 체험단 신청 데이터
    await pool.execute(`
      INSERT INTO experience_applications (experience_id, user_id, application_text, status)
      VALUES (?, ?, ?, ?)
    `, [
      1,
      2,
      '맛집 블로그를 운영하고 있어서 좋은 리뷰를 작성할 수 있습니다.',
      'pending'
    ]);
    
    // 알림 데이터
    await pool.execute(`
      INSERT INTO notifications (user_id, type, title, message, action_url)
      VALUES (?, ?, ?, ?, ?)
    `, [
      2,
      'welcome',
      '환영합니다!',
      'FM마케팅에 가입해주셔서 감사합니다. 1000 포인트가 지급되었습니다.',
      '/points'
    ]);
    
    console.log('✅ 시드 데이터 생성 완료');
    
  } catch (error) {
    console.error('❌ 시드 데이터 생성 오류:', error);
    throw error;
  }
}

/**
 * 데이터베이스 초기화
 */
export async function initializeDatabase() {
  if (initializationPromise) {
    return await initializationPromise;
  }
  
  if (isInitialized && pool) {
    return pool;
  }

  initializationPromise = (async () => {
    try {
      console.log('🚀 MySQL 데이터베이스 초기화 시작...');
      
      await createPool();
      await createTables();
      await createSeedData();
      
      isInitialized = true;
      console.log('✅ 데이터베이스 초기화 완료');
      return pool;
      
    } catch (error) {
      console.error('❌ 데이터베이스 초기화 실패:', error);
      isInitialized = false;
      pool = null;
      initializationPromise = null;
      throw new Error(`데이터베이스 초기화 실패: ${error.message}`);
    }
  })();

  return await initializationPromise;
}

/**
 * 데이터베이스 연결 가져오기
 */
export async function getDatabase() {
  if (!isInitialized || !pool) {
    throw new Error('데이터베이스가 초기화되지 않았습니다.');
  }
  return pool;
}

/**
 * 쿼리 실행
 */
export async function executeQuery(sql, params = []) {
  try {
    const db = await getDatabase();
    console.log('쿼리 실행:', sql.substring(0, 100) + '...');
    console.log('파라미터:', params);
    const [rows] = await db.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('쿼리 실행 오류:', error);
    console.error('SQL:', sql);
    console.error('파라미터:', params);
    throw error;
  }
}

/**
 * 사용자 조회
 */
export async function findUser(criteria) {
  try {
    let sql = 'SELECT * FROM users WHERE is_active = 1';
    let params = [];
    
    if (criteria.id) {
      sql += ' AND id = ?';
      params.push(criteria.id);
    } else if (criteria.username) {
      sql += ' AND username = ?';
      params.push(criteria.username);
    } else if (criteria.email) {
      sql += ' AND email = ?';
      params.push(criteria.email);
    }
    
    sql += ' LIMIT 1';
    
    const users = await executeQuery(sql, params);
    return users[0] || null;
  } catch (error) {
    console.error('사용자 조회 오류:', error);
    throw error;
  }
}

/**
 * 사용자 생성
 */
export async function createUser(userData) {
  try {
    const sql = `
      INSERT INTO users (username, email, password_hash, name, nickname, points, level, role, is_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      userData.username,
      userData.email,
      userData.passwordHash,
      userData.name,
      userData.nickname || userData.name,
      userData.points || 1000,
      userData.level || 'bronze',
      userData.role || 'user',
      userData.isVerified || false
    ];
    
    const result = await executeQuery(sql, params);
    return await findUser({ id: result.insertId });
  } catch (error) {
    console.error('사용자 생성 오류:', error);
    throw error;
  }
}

/**
 * 체험단 조회 (간소화된 버전)
 */
export async function findExperiences(filters = {}) {
  try {
    console.log('체험단 조회 필터:', filters);
    
    let sql = `
      SELECT e.*, u.name as creator_name 
      FROM experiences e 
      LEFT JOIN users u ON e.created_by = u.id 
      WHERE 1=1
    `;
    let params = [];
    
    // 상태 필터 추가
    if (filters.status) {
      sql += ' AND e.status = ?';
      params.push(filters.status);
    } else {
      // 기본적으로 active 상태만 조회
      sql += ' AND e.status = ?';
      params.push('active');
    }
    
    // 지역 필터
    if (filters.region && filters.region !== '전체') {
      sql += ' AND e.region = ?';
      params.push(filters.region);
    }
    
    // 카테고리 필터
    if (filters.category && filters.category !== '카테고리') {
      sql += ' AND e.category = ?';
      params.push(filters.category);
    }
    
    // 타입 필터
    if (filters.type && filters.type !== '유형') {
      sql += ' AND e.type = ?';
      params.push(filters.type);
    }
    
    // 검색 필터
    if (filters.search) {
      sql += ' AND (e.title LIKE ? OR e.content LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }
    
    // 정렬
    if (filters.sort === 'popular') {
      sql += ' ORDER BY (e.views + e.likes) DESC';
    } else if (filters.sort === 'deadline') {
      sql += ' ORDER BY e.application_deadline ASC';
    } else {
      sql += ' ORDER BY e.created_at DESC';
    }
    
    // 페이징 - 간단하게 처리, 숫자로 확실히 변환
    if (filters.limit) {
      const limitNum = parseInt(filters.limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        sql += ' LIMIT ?';
        params.push(limitNum);
      }
    }
    
    console.log('최종 SQL:', sql);
    console.log('최종 파라미터:', params);
    
    const experiences = await executeQuery(sql, params);
    
    // JSON 필드 파싱
    return experiences.map(exp => ({
      ...exp,
      images: exp.images ? JSON.parse(exp.images) : [],
      tags: exp.tags ? JSON.parse(exp.tags) : [],
      creatorName: exp.creator_name,
      daysAgo: exp.application_deadline ? Math.ceil((new Date(exp.application_deadline) - new Date()) / (1000 * 60 * 60 * 24)) : null
    }));
  } catch (error) {
    console.error('체험단 조회 오류:', error);
    throw error;
  }
}

/**
 * 커뮤니티 게시글 조회 (간소화된 버전)
 */
export async function findCommunityPosts(filters = {}) {
  try {
    let sql = `
      SELECT p.*, u.nickname, u.profile_image
      FROM community_posts p 
      LEFT JOIN users u ON p.author_id = u.id 
      WHERE p.is_deleted = 0
    `;
    let params = [];
    
    if (filters.category && filters.category !== '전체') {
      sql += ' AND p.category = ?';
      params.push(filters.category);
    }
    
    if (filters.search) {
      sql += ' AND (p.title LIKE ? OR p.content LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }
    
    // 정렬
    if (filters.sort === 'popular') {
      sql += ' ORDER BY (p.views + p.likes) DESC';
    } else {
      sql += ' ORDER BY p.created_at DESC';
    }
    
    // 페이징 - 간단하게 처리, 숫자로 확실히 변환
    if (filters.limit) {
      const limitNum = parseInt(filters.limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        sql += ' LIMIT ?';
        params.push(limitNum);
      }
    }
    
    const posts = await executeQuery(sql, params);
    
    return posts.map(post => ({
      ...post,
      images: post.images ? JSON.parse(post.images) : [],
      tags: post.tags ? JSON.parse(post.tags) : [],
      commentCount: 0, // 일단 0으로 설정
      author: {
        id: post.author_id,
        nickname: post.nickname || '익명',
        profileImage: post.profile_image || '/images/default-avatar.jpg'
      }
    }));
  } catch (error) {
    console.error('커뮤니티 게시글 조회 오류:', error);
    throw error;
  }
}
