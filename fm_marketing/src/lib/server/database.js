// 순수 MySQL2를 사용한 데이터베이스 연결
import { dev } from '$app/environment';

let pool = null;
let isInitialized = false;

/**
 * MySQL 연결 풀 생성
 */
async function createPool() {
  if (pool) return pool;

  try {
    const mysql = await import('mysql2/promise');
    const { config } = await import('dotenv');
    
    // 환경변수 로드
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
      queueLimit: 0
    };

    pool = mysql.createPool(dbConfig);
    
    // 연결 테스트
    const connection = await pool.getConnection();
    await connection.execute('SELECT 1');
    connection.release();
    
    console.log('✅ MySQL 데이터베이스 연결 성공');
    return pool;

  } catch (error) {
    console.error('❌ MySQL 데이터베이스 연결 실패:', error);
    pool = null;
    throw error;
  }
}

/**
 * 데이터베이스 초기화
 */
export async function initializeDatabase() {
  if (isInitialized) return pool;

  try {
    console.log('🔄 MySQL 데이터베이스 초기화 중...');
    
    await createPool();
    
    // 테이블 생성
    await createTables();
    
    // 시드 데이터 생성
    if (dev) {
      await createSeedData();
    }
    
    isInitialized = true;
    console.log('✅ 데이터베이스 초기화 완료');
    return pool;

  } catch (error) {
    console.error('❌ 데이터베이스 초기화 실패:', error);
    
    if (dev) {
      console.warn('개발 환경에서 계속 진행 (연결 실패 시 오류 반환)');
      isInitialized = true;
      return null;
    }
    throw error;
  }
}

/**
 * 데이터베이스 연결 가져오기
 */
export async function getDatabase() {
  if (!isInitialized) {
    await initializeDatabase();
  }
  return pool;
}

/**
 * 쿼리 실행
 */
export async function executeQuery(sql, params = []) {
  try {
    const db = await getDatabase();
    if (!db) {
      throw new Error('데이터베이스 연결이 없습니다.');
    }
    
    const [rows] = await db.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('쿼리 실행 오류:', error);
    throw error;
  }
}

/**
 * 트랜잭션 실행
 */
export async function executeTransaction(queries) {
  const db = await getDatabase();
  if (!db) {
    throw new Error('데이터베이스 연결이 없습니다.');
  }

  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const results = [];
    for (const { sql, params } of queries) {
      const [result] = await connection.execute(sql, params);
      results.push(result);
    }
    
    await connection.commit();
    return results;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * 테이블 생성
 */
async function createTables() {
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
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  ];
  
  for (const table of tables) {
    await executeQuery(table);
  }
  
  console.log('✅ 테이블 생성 완료');
}

/**
 * 시드 데이터 생성
 */
async function createSeedData() {
  try {
    // 기존 관리자 계정 확인
    const existingAdmin = await executeQuery('SELECT id FROM users WHERE username = ?', ['admin']);
    
    if (existingAdmin.length > 0) {
      console.log('시드 데이터가 이미 존재합니다.');
      return;
    }
    
    console.log('시드 데이터 생성 중...');
    
    // bcrypt 동적 import
    const bcrypt = await import('bcryptjs');
    
    // 관리자 계정 생성
    const adminPassword = await bcrypt.hash('admin123!', 12);
    
    await executeQuery(`
      INSERT INTO users (username, email, password_hash, name, nickname, points, role, level, is_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, ['admin', 'admin@fmmarketing.com', adminPassword, '관리자', '관리자', 50000, 'admin', 'platinum', 1]);
    
    // 테스트 사용자 생성
    const userPassword = await bcrypt.hash('user123!', 12);
    
    await executeQuery(`
      INSERT INTO users (username, email, password_hash, name, nickname, points, level, is_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, ['user1', 'user1@example.com', userPassword, '김철수', '철수', 5000, 'bronze', 1]);
    
    // 체험단 데이터 생성
    await executeQuery(`
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
    console.error('시드 데이터 생성 오류:', error);
    // 시드 데이터 생성 실패해도 앱은 계속 실행
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
    return null;
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
    
    // 생성된 사용자 조회
    return await findUser({ id: result.insertId });
  } catch (error) {
    console.error('사용자 생성 오류:', error);
    throw error;
  }
}

/**
 * 체험단 조회
 */
export async function findExperiences(filters = {}) {
  try {
    let sql = `
      SELECT e.*, u.name as creator_name 
      FROM experiences e 
      LEFT JOIN users u ON e.created_by = u.id 
      WHERE e.status = 'active'
    `;
    let params = [];
    
    if (filters.region && filters.region !== '전체') {
      sql += ' AND e.region = ?';
      params.push(filters.region);
    }
    
    if (filters.category && filters.category !== '카테고리') {
      sql += ' AND e.category = ?';
      params.push(filters.category);
    }
    
    if (filters.type && filters.type !== '유형') {
      sql += ' AND e.type = ?';
      params.push(filters.type);
    }
    
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
    
    // 페이징
    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(filters.limit);
      
      if (filters.offset) {
        sql += ' OFFSET ?';
        params.push(filters.offset);
      }
    }
    
    const experiences = await executeQuery(sql, params);
    
    // JSON 필드 파싱
    return experiences.map(exp => ({
      ...exp,
      images: exp.images ? JSON.parse(exp.images) : [],
      tags: exp.tags ? JSON.parse(exp.tags) : [],
      creatorName: exp.creator_name
    }));
  } catch (error) {
    console.error('체험단 조회 오류:', error);
    return [];
  }
}

/**
 * 커뮤니티 게시글 조회
 */
export async function findCommunityPosts(filters = {}) {
  try {
    let sql = `
      SELECT p.*, u.nickname, u.profile_image,
             (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id AND c.is_deleted = 0) as comment_count
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
    } else if (filters.sort === 'comments') {
      sql += ' ORDER BY comment_count DESC';
    } else {
      sql += ' ORDER BY p.created_at DESC';
    }
    
    // 페이징
    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(filters.limit);
      
      if (filters.offset) {
        sql += ' OFFSET ?';
        params.push(filters.offset);
      }
    }
    
    const posts = await executeQuery(sql, params);
    
    // JSON 필드 파싱 및 작성자 정보 추가
    return posts.map(post => ({
      ...post,
      images: post.images ? JSON.parse(post.images) : [],
      tags: post.tags ? JSON.parse(post.tags) : [],
      commentCount: post.comment_count,
      author: {
        id: post.author_id,
        nickname: post.nickname || '익명',
        profileImage: post.profile_image || '/images/default-avatar.jpg'
      }
    }));
  } catch (error) {
    console.error('커뮤니티 게시글 조회 오류:', error);
    return [];
  }
}
