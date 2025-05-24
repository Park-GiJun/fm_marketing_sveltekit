// 간단한 MySQL 데이터베이스 연결
import mysql from 'mysql2/promise';
import { config } from 'dotenv';

// 환경변수 로드
config();

// 데이터베이스 설정
const dbConfig = {
  host: process.env.DB_HOST || '210.121.177.150',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USERNAME || 'gijunpark',
  password: process.env.DB_PASSWORD || 'park9832',
  database: process.env.DB_DATABASE || 'FMMarketing',
  timezone: '+09:00',
  ssl: false,
  charset: 'utf8mb4'
};

let pool = null;

// 연결 풀 생성
export function createPool() {
  if (!pool) {
    pool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  return pool;
}

// 데이터베이스 연결 가져오기
export async function getConnection() {
  const pool = createPool();
  return await pool.getConnection();
}

// 쿼리 실행
export async function executeQuery(sql, params = []) {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(sql, params);
    return rows;
  } finally {
    connection.release();
  }
}

// 트랜잭션 실행
export async function executeTransaction(queries) {
  const connection = await getConnection();
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

// 데이터베이스 초기화
export async function initializeDatabase() {
  try {
    console.log('데이터베이스 연결 테스트 중...');
    const connection = await getConnection();
    
    // 연결 테스트
    await connection.execute('SELECT 1');
    console.log('✅ 데이터베이스 연결 성공');
    
    connection.release();
    
    // 테이블 생성
    await createTables();
    
    // 시드 데이터 생성
    await createSeedData();
    
    return true;
  } catch (error) {
    console.error('❌ 데이터베이스 초기화 실패:', error);
    throw error;
  }
}

// 테이블 생성
async function createTables() {
  console.log('테이블 생성 중...');
  
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

// 시드 데이터 생성
async function createSeedData() {
  try {
    console.log('시드 데이터 확인 중...');
    
    // 기존 관리자 계정 확인
    const existingAdmin = await executeQuery('SELECT id FROM users WHERE username = ?', ['admin']);
    
    if (existingAdmin.length > 0) {
      console.log('시드 데이터가 이미 존재합니다.');
      return;
    }
    
    console.log('시드 데이터 생성 중...');
    
    // bcryptjs를 동적으로 import
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
    
    console.log('✅ 시드 데이터 생성 완료');
    
  } catch (error) {
    console.error('시드 데이터 생성 오류:', error);
    // 시드 데이터 생성 실패해도 앱은 계속 실행
  }
}
