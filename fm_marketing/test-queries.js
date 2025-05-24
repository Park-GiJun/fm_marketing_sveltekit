// 쿼리별 테스트 스크립트
import { config } from 'dotenv';
import mysql from 'mysql2/promise';

config();

async function testQueries() {
  let connection;
  
  try {
    console.log('🔍 개별 쿼리 테스트...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || '210.121.177.150',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USERNAME || 'gijunpark',
      password: process.env.DB_PASSWORD || 'park9832',
      database: process.env.DB_DATABASE || 'FMMarketing'
    });

    console.log('✅ 연결 성공');
    
    // 1. 기본 체험단 쿼리 (LIMIT 없이)
    console.log('\n1. 기본 체험단 조회:');
    const [basicExperiences] = await connection.execute(`
      SELECT e.*, u.name as creator_name 
      FROM experiences e 
      LEFT JOIN users u ON e.created_by = u.id 
      WHERE e.status = 'active'
      ORDER BY e.created_at DESC
    `);
    console.log('결과:', basicExperiences.length, '개');
    
    // 2. LIMIT 테스트
    console.log('\n2. LIMIT 테스트:');
    const [limitTest] = await connection.execute(`
      SELECT e.*, u.name as creator_name 
      FROM experiences e 
      LEFT JOIN users u ON e.created_by = u.id 
      WHERE e.status = 'active'
      ORDER BY e.created_at DESC
      LIMIT ?
    `, [20]);
    console.log('LIMIT 결과:', limitTest.length, '개');
    
    // 3. LIMIT + OFFSET 테스트
    console.log('\n3. LIMIT + OFFSET 테스트:');
    const [offsetTest] = await connection.execute(`
      SELECT e.*, u.name as creator_name 
      FROM experiences e 
      LEFT JOIN users u ON e.created_by = u.id 
      WHERE e.status = 'active'
      ORDER BY e.created_at DESC
      LIMIT ?, ?
    `, [0, 20]);
    console.log('LIMIT + OFFSET 결과:', offsetTest.length, '개');
    
    // 4. 커뮤니티 기본 쿼리
    console.log('\n4. 커뮤니티 조회:');
    const [posts] = await connection.execute(`
      SELECT p.*, u.nickname, u.profile_image,
             (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id AND c.is_deleted = 0) as comment_count
      FROM community_posts p 
      LEFT JOIN users u ON p.author_id = u.id 
      WHERE p.is_deleted = 0
      ORDER BY p.created_at DESC
      LIMIT ?
    `, [20]);
    console.log('커뮤니티 결과:', posts.length, '개');
    
    console.log('\n🎉 모든 쿼리 테스트 성공!');
    
  } catch (error) {
    console.error('❌ 쿼리 테스트 실패:', error.message);
    console.error('코드:', error.code);
    console.error('SQL:', error.sql);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testQueries();
