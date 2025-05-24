// 체험단 통계 API - MySQL2 버전
import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database.js';
import { getUserFromRequest } from '$lib/server/auth.js';

export async function GET({ url, request }) {
  try {
    const user = await getUserFromRequest(request);

    if (!user || user.role !== 'admin') {
      return json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
    }

    const period = url.searchParams.get('period') || '7days';
    
    // 기간 계산
    let daysAgo = 7;
    switch (period) {
      case '30days': daysAgo = 30; break;
      case '90days': daysAgo = 90; break;
      case 'year': daysAgo = 365; break;
    }

    // 사용자 통계
    const [totalUsersResult] = await executeQuery(
      'SELECT COUNT(*) as count FROM users WHERE is_active = 1'
    );
    
    const [newUsersTodayResult] = await executeQuery(
      'SELECT COUNT(*) as count FROM users WHERE DATE(created_at) = CURDATE()'
    );
    
    const [newUsersWeekResult] = await executeQuery(
      'SELECT COUNT(*) as count FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
    );
    
    const [newUsersMonthResult] = await executeQuery(
      'SELECT COUNT(*) as count FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)'
    );
    
    const [activeUsersResult] = await executeQuery(`
      SELECT COUNT(DISTINCT user_id) as count 
      FROM point_transactions 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${daysAgo} DAY)
    `);
    
    const [verifiedUsersResult] = await executeQuery(
      'SELECT COUNT(*) as count FROM users WHERE is_verified = 1'
    );

    // 체험단 통계
    const [totalExperiencesResult] = await executeQuery(
      'SELECT COUNT(*) as count FROM experiences'
    );
    
    const [activeExperiencesResult] = await executeQuery(
      'SELECT COUNT(*) as count FROM experiences WHERE status = "active"'
    );
    
    const [completedExperiencesResult] = await executeQuery(
      'SELECT COUNT(*) as count FROM experiences WHERE status = "completed"'
    );
    
    const [totalApplicationsResult] = await executeQuery(
      'SELECT COUNT(*) as count FROM experience_applications'
    );
    
    const [approvedApplicationsResult] = await executeQuery(
      'SELECT COUNT(*) as count FROM experience_applications WHERE status = "approved"'
    );

    // 평균 신청자 수 계산
    const avgApplications = totalExperiencesResult[0].count > 0 
      ? totalApplicationsResult[0].count / totalExperiencesResult[0].count 
      : 0;

    // 커뮤니티 통계
    const [totalPostsResult] = await executeQuery(
      'SELECT COUNT(*) as count FROM community_posts WHERE is_deleted = 0'
    );
    
    const [postsTodayResult] = await executeQuery(
      'SELECT COUNT(*) as count FROM community_posts WHERE DATE(created_at) = CURDATE() AND is_deleted = 0'
    );
    
    const [totalCommentsResult] = await executeQuery(
      'SELECT COUNT(*) as count FROM comments WHERE is_deleted = 0'
    );
    
    const [activePostersResult] = await executeQuery(`
      SELECT COUNT(DISTINCT author_id) as count 
      FROM community_posts 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${daysAgo} DAY) AND is_deleted = 0
    `);

    // 포인트 통계
    const [totalPointsDistributedResult] = await executeQuery(
      'SELECT COALESCE(SUM(amount), 0) as sum FROM point_transactions WHERE type = "earn"'
    );
    
    const [totalPointsUsedResult] = await executeQuery(
      'SELECT COALESCE(SUM(amount), 0) as sum FROM point_transactions WHERE type = "spend"'
    );
    
    const [averagePointsResult] = await executeQuery(
      'SELECT AVG(points) as avg FROM users WHERE is_active = 1'
    );
    
    const [pendingWithdrawalsResult] = await executeQuery(
      'SELECT COUNT(*) as count FROM point_transactions WHERE type = "withdraw" AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
    );

    // 응답 데이터 구성
    const statsData = {
      userStats: {
        totalUsers: totalUsersResult[0]?.count || 0,
        newUsersToday: newUsersTodayResult[0]?.count || 0,
        newUsersWeek: newUsersWeekResult[0]?.count || 0,
        newUsersMonth: newUsersMonthResult[0]?.count || 0,
        activeUsers: activeUsersResult[0]?.count || 0,
        verifiedUsers: verifiedUsersResult[0]?.count || 0
      },
      experienceStats: {
        totalExperiences: totalExperiencesResult[0]?.count || 0,
        activeExperiences: activeExperiencesResult[0]?.count || 0,
        completedExperiences: completedExperiencesResult[0]?.count || 0,
        totalApplications: totalApplicationsResult[0]?.count || 0,
        approvedApplications: approvedApplicationsResult[0]?.count || 0,
        averageApplicationsPerExperience: parseFloat(avgApplications.toFixed(1))
      },
      communityStats: {
        totalPosts: totalPostsResult[0]?.count || 0,
        postsToday: postsTodayResult[0]?.count || 0,
        totalComments: totalCommentsResult[0]?.count || 0,
        activePosters: activePostersResult[0]?.count || 0
      },
      pointStats: {
        totalPointsDistributed: totalPointsDistributedResult[0]?.sum || 0,
        totalPointsUsed: totalPointsUsedResult[0]?.sum || 0,
        averagePointsPerUser: Math.round(averagePointsResult[0]?.avg || 0),
        pendingWithdrawals: pendingWithdrawalsResult[0]?.count || 0
      }
    };

    return json(statsData);

  } catch (error) {
    console.error('통계 데이터 조회 오류:', error);
    return json({ 
      error: '서버 오류가 발생했습니다.',
      details: error.message 
    }, { status: 500 });
  }
}
