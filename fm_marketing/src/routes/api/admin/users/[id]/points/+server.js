// 관리자 포인트 지급 API - MySQL2 버전
import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database.js';
import { getUserFromRequest } from '$lib/server/auth.js';

export async function POST({ params, request }) {
  try {
    const admin = await getUserFromRequest(request);

    if (!admin || admin.role !== 'admin') {
      return json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
    }

    const { id } = params;
    const userId = parseInt(id);
    const { amount, reason } = await request.json();

    // 입력값 검증
    if (!amount || amount === 0) {
      return json({ error: '유효한 포인트 금액을 입력해주세요.' }, { status: 400 });
    }

    if (!reason || reason.trim() === '') {
      return json({ error: '지급 사유를 입력해주세요.' }, { status: 400 });
    }

    // 대상 사용자 확인
    const [targetUser] = await executeQuery(
      'SELECT id, points FROM users WHERE id = ?',
      [userId]
    );

    if (!targetUser) {
      return json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 포인트가 음수가 되지 않도록 확인
    if (targetUser.points + amount < 0) {
      return json({ error: '포인트가 음수가 될 수 없습니다.' }, { status: 400 });
    }

    // 트랜잭션 시작
    const connection = await executeQuery('START TRANSACTION');

    try {
      // 포인트 업데이트
      await executeQuery(
        'UPDATE users SET points = points + ? WHERE id = ?',
        [amount, userId]
      );

      // 포인트 거래 내역 저장
      const transactionType = amount > 0 ? 'earn' : 'spend';
      await executeQuery(
        'INSERT INTO point_transactions (user_id, type, amount, description, reference_type, reference_id) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, transactionType, Math.abs(amount), `관리자 지급: ${reason}`, 'admin_grant', admin.id]
      );

      // 커밋
      await executeQuery('COMMIT');

      // 업데이트된 사용자 정보 조회
      const [updatedUser] = await executeQuery(
        'SELECT id, username, points FROM users WHERE id = ?',
        [userId]
      );

      return json({
        message: `${amount}포인트가 ${amount > 0 ? '지급' : '차감'}되었습니다.`,
        user: updatedUser,
        transaction: {
          amount,
          reason,
          adminId: admin.id,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      // 롤백
      await executeQuery('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('포인트 지급 오류:', error);
    return json({ 
      error: '서버 오류가 발생했습니다.',
      details: error.message 
    }, { status: 500 });
  }
}
