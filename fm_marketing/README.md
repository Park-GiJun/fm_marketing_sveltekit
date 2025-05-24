# FM마케팅 체험단 플랫폼

TypeORM 기반의 체험단 마케팅 플랫폼입니다.

## 주요 기능

- 사용자 인증 (회원가입, 로그인)
- 체험단 관리 (생성, 조회, 신청)
- 커뮤니티 (게시글, 댓글)
- 포인트 시스템
- 알림 시스템
- 관리자 대시보드

## 기술 스택

- **Frontend**: SvelteKit, TypeScript
- **Backend**: SvelteKit API Routes, TypeORM
- **Database**: MySQL
- **Authentication**: JWT

## 개발 환경 설정

### 1. 프로젝트 클론

```bash
git clone <repository-url>
cd fm-marketing
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경변수 설정

`.env.example` 파일을 `.env`로 복사하고 필요한 값들을 설정하세요.

```bash
cp .env.example .env
```

### 4. 데이터베이스 연결 테스트

```bash
npm run test:db
```

### 5. 개발 서버 실행

```bash
npm run dev
```

## 프로젝트 구조

```
src/
├── lib/
│   ├── server/
│   │   ├── entities/          # TypeORM 엔티티
│   │   ├── data-source-unified.js  # 통합 데이터소스
│   │   ├── auth-unified.js    # 통합 인증 유틸리티
│   │   └── utils/
│   ├── stores/               # Svelte 스토어
│   ├── components/           # UI 컴포넌트
│   └── utils/               # 클라이언트 유틸리티
├── routes/
│   ├── api/                 # API 엔드포인트
│   └── (앱 페이지들)
└── app.html
```

## API 엔드포인트

### 인증
- `POST /api/auth/login` - 로그인
- `POST /api/auth/register` - 회원가입
- `GET /api/auth/profile` - 프로필 조회
- `PUT /api/auth/profile` - 프로필 수정

### 체험단
- `GET /api/experiences` - 체험단 목록
- `POST /api/experiences` - 체험단 생성 (관리자)
- `GET /api/experiences/[id]` - 체험단 상세
- `POST /api/experiences/[id]/apply` - 체험단 신청

### 커뮤니티
- `GET /api/community/posts` - 게시글 목록
- `POST /api/community/posts` - 게시글 작성
- `GET /api/community/posts/[id]` - 게시글 상세

## 데이터베이스 스키마

주요 엔티티:
- `User` - 사용자
- `Experience` - 체험단
- `ExperienceApplication` - 체험단 신청
- `CommunityPost` - 커뮤니티 게시글
- `Comment` - 댓글
- `PointTransaction` - 포인트 거래 내역
- `Notification` - 알림

## 개발 가이드

### 새로운 API 엔드포인트 추가

1. `src/routes/api/` 하위에 폴더 생성
2. `+server.js` 파일에 HTTP 메소드별 핸들러 작성
3. TypeORM 리포지토리를 사용한 데이터베이스 작업
4. 적절한 에러 핸들링 및 응답 구조 준수

### 새로운 엔티티 추가

1. `src/lib/server/entities/` 하위에 엔티티 파일 생성
2. TypeORM 데코레이터를 사용한 엔티티 정의
3. `entities/index.js`에 엔티티 export 추가
4. `data-source-unified.js`의 entities 배열에 추가

## 배포

### 프로덕션 빌드

```bash
npm run build
```

### 환경변수 설정

프로덕션 환경에서는 다음 환경변수들을 반드시 설정해야 합니다:
- `JWT_SECRET` - 안전한 랜덤 문자열로 변경
- `DB_*` - 프로덕션 데이터베이스 정보
- `NODE_ENV=production`

## 문제 해결

### 데이터베이스 연결 오류

1. 환경변수 확인
2. 데이터베이스 서버 상태 확인
3. 방화벽 설정 확인

### 테스트 명령어

```bash
# 데이터베이스 연결 테스트
npm run test:db

# TypeORM 엔티티 동기화 확인
npm run dev
```

## 기여하기

1. 이슈 생성
2. 기능 브랜치 생성
3. 변경사항 커밋
4. 풀 리퀘스트 생성

## 라이선스

MIT License
