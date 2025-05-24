# FM마케팅 플랫폼

체험단 마케팅을 위한 통합 플랫폼입니다.

## 기술 스택

- **Frontend**: SvelteKit, Tailwind CSS
- **Backend**: SvelteKit API Routes, TypeORM
- **Database**: MySQL
- **Authentication**: JWT

## 설정 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env` 파일을 생성하고 다음 내용을 추가:

```bash
# 데이터베이스 설정
DB_HOST=210.121.177.150
DB_PORT=3306
DB_USERNAME=gijunpark
DB_PASSWORD=park9832
DB_DATABASE=FMMarketing

# JWT 시크릿 키
JWT_SECRET=fm-marketing-secret-key-2025

# 개발 환경 설정
NODE_ENV=development
```

### 3. 데이터베이스 초기화

```bash
npm run setup:db
```

### 4. 개발 서버 실행

```bash
npm run dev
```

## 주요 기능

### 사용자 기능
- 회원가입/로그인
- 체험단 검색 및 신청
- 커뮤니티 참여
- 포인트 관리

### 관리자 기능
- 체험단 관리
- 사용자 관리
- 커뮤니티 관리
- 통계 관리

## API 엔드포인트

### 인증
- `POST /api/auth/login` - 로그인
- `POST /api/auth/register` - 회원가입
- `GET /api/auth/profile` - 프로필 조회
- `PUT /api/auth/profile` - 프로필 수정

### 체험단
- `GET /api/experiences` - 체험단 목록
- `GET /api/experiences/[id]` - 체험단 상세
- `POST /api/experiences` - 체험단 생성 (관리자)
- `POST /api/experiences/[id]/apply` - 체험단 신청

### 커뮤니티
- `GET /api/community/posts` - 게시글 목록
- `GET /api/community/posts/[id]` - 게시글 상세
- `POST /api/community/posts` - 게시글 작성

## 데이터베이스 구조

### 주요 테이블
- `users` - 사용자 정보
- `experiences` - 체험단 정보
- `experience_applications` - 체험단 신청
- `community_posts` - 커뮤니티 게시글
- `comments` - 댓글
- `point_transactions` - 포인트 거래내역
- `notifications` - 알림

## 개발 모드 특징

- 데이터베이스 연결 실패 시 자동으로 더미 데이터 모드로 전환
- 개발 환경에서 자동 스키마 동기화
- 시드 데이터 자동 생성

## 프로덕션 배포

1. 환경변수 설정 (프로덕션용)
2. 빌드: `npm run build`
3. 프리뷰: `npm run preview`

## 문제 해결

### 데이터베이스 연결 오류
1. `.env` 파일의 데이터베이스 설정 확인
2. MySQL 서버 실행 상태 확인
3. 네트워크 연결 확인
4. 사용자 권한 확인

### TypeORM 오류
1. `reflect-metadata` import 확인
2. 엔티티 파일 경로 확인
3. 데코레이터 설정 확인

## 라이센스

이 프로젝트는 MIT 라이센스 하에 있습니다.
