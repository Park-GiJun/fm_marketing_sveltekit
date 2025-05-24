// 관리자 대시보드 통계 API - MySQL2 버전
import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database.js';
import { getUserFromRequest } from '$lib/server/auth.js';

export async function GET({ request }) {
  try {
    const user = await getUserFromRequest(request);

    if (!user || user.role !== 'admin') {
      return json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
    }

    console.log('대시보드 통계 조회 시작');

    // 전체 사용자 수
    const [totalUsersResult] = await executeQuery(
      'SELECT COUNT(*) as count FROM users WHERE is_active = 1'
    );
    const totalUsers = totalUsersResult?.count || 0;

    // 신규 사용자 수 (최근 7일)
    const [newUsersResult] = await executeQuery(
      'SELECT COUNT(*) as count FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
    );
    const newUsers = newUsersResult?.count || 0;

    // 전체 체험단 수
    const [totalExperiencesResult] = await executeQuery(
      'SELECT COUNT(*) as count FROM experiences'
    );
    const totalExperiences = totalExperiencesResult?.count || 0;

    // 진행중인 체험단 수
    const [activeExperiencesResult] = await executeQuery(
      'SELECT COUNT(*) as count FROM experiences WHERE status = "active" AND (application_deadline IS NULL OR application_deadline >= CURDATE())'
    );
    const activeExperiences = activeExperiencesResult?.count || 0;

    // 전체 게시글 수
    const [totalPostsResult] = await executeQuery(
      'SELECT COUNT(*) as count FROM community_posts WHERE is_deleted = 0'
    );
    const totalPosts = totalPostsResult?.count || 0;

    // 오늘 작성된 게시글 수
    const [todayPostsResult] = await executeQuery(
      'SELECT COUNT(*) as count FROM community_posts WHERE DATE(created_at) = CURDATE() AND is_deleted = 0'
    );
    const todayPosts = todayPostsResult?.count || 0;

    // 체험단 신청 통계를 위한 테이블 생성 (없을 경우)
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS experience_applications (
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
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);

    // 전체 신청 수
    const [totalApplicationsResult] = await executeQuery(
      'SELECT COUNT(*) as count FROM experience_applications'
    );
    const totalApplications = totalApplicationsResult?.count || 0;

    // 대기중인 신청 수
    const [pendingApplicationsResult] = await executeQuery(
      'SELECT COUNT(*) as count FROM experience_applications WHERE status = "pending"'
    );
    const pendingApplications = pendingApplicationsResult?.count || 0;

    // 최근 가입 사용자 (5명)
    const recentUsers = await executeQuery(`
      SELECT id, username, email, name, nickname, created_at 
      FROM users 
      WHERE is_active = 1 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    // 최근 등록 체험단 (5개)
    const recentExperiences = await executeQuery(`
      SELECT id, title, category, type, region, status, created_at 
      FROM experiences 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    // 최근 체험단 신청 (5개)
    const recentApplications = await executeQuery(`
      SELECT 
        ea.id,
        ea.status,
        ea.created_at,
        e.id as experience_id,
        e.title as experience_title,
        u.id as user_id,
        u.name as user_name
      FROM experience_applications ea
      LEFT JOIN experiences e ON ea.experience_id = e.id
      LEFT JOIN users u ON ea.user_id = u.id
      ORDER BY ea.created_at DESC
      LIMIT 5
    `);

    // 최근 커뮤니티 게시글 (5개)
    const recentPosts = await executeQuery(`
      SELECT 
        p.id,
        p.title,
        p.category,
        p.created_at,
        u.name as author_name
      FROM community_posts p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.is_deleted = 0
      ORDER BY p.created_at DESC
      LIMIT 5
    `);

    // 응답 데이터 구성
    const dashboardData = {
      stats: {
        totalUsers,
        newUsers,
        totalExperiences,
        activeExperiences,
        totalPosts,
        todayPosts,
        totalApplications,
        pendingApplications
      },
      recentUsers: recentUsers.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        nickname: user.nickname,
        createdAt: user.created_at
      })),
      recentExperiences: recentExperiences.map(exp => ({
        id: exp.id,
        title: exp.title,
        category: exp.category,
        type: exp.type,
        region: exp.region,
        status: exp.status,
        createdAt: exp.created_at
      })),
      recentApplications: recentApplications.map(app => ({
        id: app.id,
        status: app.status,
        createdAt: app.created_at,
        experienceId: app.experience_id,
        experienceTitle: app.experience_title,
        userId: app.user_id,
        userName: app.user_name
      })),
      recentPosts: recentPosts.map(post => ({
        id: post.id,
        title: post.title,
        category: post.category,
        createdAt: post.created_at,
        authorName: post.author_name
      }))
    };

    console.log('대시보드 통계 조회 완료:', {
      totalUsers,
      newUsers,
      activeExperiences,
      pendingApplications
    });

    return json(dashboardData);

  } catch (error) {
    console.error('대시보드 통계 조회 오류:', error);
    return json({ 
      error: '서버 오류가 발생했습니다.',
      details: error.message 
    }, { status: 500 });
  }
}
