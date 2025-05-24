// 알림 목록 조회/생성 API - 간단한 더미 데이터 버전
import { json } from '@sveltejs/kit';

// 더미 알림 데이터
const dummyNotifications = [
  {
    id: 1,
    userId: 1,
    type: 'application_result',
    title: '체험단 선정 안내',
    message: '서울 맛집 탐방 체험단에 선정되셨습니다!',
    isRead: false,
    actionUrl: '/checklist/1',
    priority: 'high',
    createdAt: '2025-02-20T10:00:00Z'
  },
  {
    id: 2,
    userId: 1,
    type: 'point_earned',
    title: '포인트 적립',
    message: '일일 로그인으로 10P가 적립되었습니다.',
    isRead: true,
    actionUrl: '/points',
    priority: 'medium',
    createdAt: '2025-02-19T09:00:00Z'
  },
  {
    id: 3,
    userId: 1,
    type: 'new_experience',
    title: '신규 체험단',
    message: '관심 카테고리에 새로운 체험단이 등록되었습니다.',
    isRead: false,
    actionUrl: '/checklist',
    priority: 'medium',
    createdAt: '2025-02-18T15:30:00Z'
  }
];

export async function GET({ url, request }) {
  try {
    // 더미 인증 체크
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const isRead = url.searchParams.get('read');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    let filteredNotifications = [...dummyNotifications];

    // 읽음 상태 필터
    if (isRead === 'true') {
      filteredNotifications = filteredNotifications.filter(n => n.isRead);
    } else if (isRead === 'false') {
      filteredNotifications = filteredNotifications.filter(n => !n.isRead);
    }

    // 정렬 (최신순)
    filteredNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // 페이징
    const total = filteredNotifications.length;
    const start = (page - 1) * limit;
    const notifications = filteredNotifications.slice(start, start + limit);

    // 읽지 않은 알림 수
    const unreadCount = dummyNotifications.filter(n => !n.isRead).length;

    return json({
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('알림 목록 조회 오류:', error);
    return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    // 더미 관리자 권한 체크
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
    }

    const { userId, type, title, message, actionUrl, priority } = await request.json();

    if (!userId || !type || !title || !message) {
      return json({ error: '필수 정보를 모두 입력해주세요.' }, { status: 400 });
    }

    // 새 알림 생성 (더미)
    const newNotification = {
      id: Date.now(),
      userId: parseInt(userId),
      type,
      title,
      message,
      actionUrl,
      priority: priority || 'medium',
      isRead: false,
      createdAt: new Date().toISOString()
    };

    return json(newNotification, { status: 201 });

  } catch (error) {
    console.error('알림 생성 오류:', error);
    return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
