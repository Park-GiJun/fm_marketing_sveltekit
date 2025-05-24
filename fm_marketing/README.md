# FM Marketing - 체험단 마케팅 플랫폼

SvelteKit과 TypeORM을 사용한 체험단 마케팅 플랫폼입니다.

## 기술 스택

- **Frontend**: SvelteKit, Svelte 4
- **Backend**: SvelteKit API Routes
- **Database**: MySQL + TypeORM
- **Authentication**: JWT
- **Styling**: Tailwind CSS (custom)

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env` 파일을 생성하고 데이터베이스 정보를 입력하세요:

```env
# 데이터베이스 설정
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=fm_marketing

# JWT 설정
JWT_SECRET=your-super-secret-jwt-key

# 개발 환경 설정
NODE_ENV=development
```

### 3. 데이터베이스 설정

MySQL 데이터베이스를 생성하세요:

```sql
CREATE DATABASE fm_marketing CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. 개발 서버 실행

```bash
npm run dev
```

앱이 시작되면서 자동으로 데이터베이스 스키마가 생성되고 시드 데이터가 삽입됩니다.

## 기본 계정 정보

### 관리자 계정
- 사용자명: `admin`
- 비밀번호: `admin123!`

### 테스트 사용자 계정
- 사용자명: `user1` / 비밀번호: `user123!`
- 사용자명: `user2` / 비밀번호: `user123!`
- 사용자명: `user3` / 비밀번호: `user123!`

## 주요 기능

### 사용자 기능
- 회원가입/로그인
- 체험단 검색 및 신청
- 포인트 시스템
- 커뮤니티 게시판
- 알림 시스템
- 마이페이지

### 관리자 기능
- 체험단 관리
- 사용자 관리
- 이벤트/공지사항 관리
- 통계 대시보드

## API 엔드포인트

### 인증
- `POST /api/auth/login` - 로그인
- `POST /api/auth/register` - 회원가입

### 체험단
- `GET /api/experiences` - 체험단 목록 조회
- `POST /api/experiences` - 체험단 생성 (관리자)
- `GET /api/experiences/[id]` - 체험단 상세 조회
- `PUT /api/experiences/[id]` - 체험단 수정 (관리자)
- `DELETE /api/experiences/[id]` - 체험단 삭제 (관리자)
- `POST /api/experiences/[id]/apply` - 체험단 신청
- `DELETE /api/experiences/[id]/apply` - 체험단 신청 취소

## 데이터베이스 스키마

### 주요 테이블
- `users` - 사용자 정보
- `experiences` - 체험단 정보
- `experience_applications` - 체험단 신청 내역
- `community_posts` - 커뮤니티 게시글
- `comments` - 댓글
- `point_transactions` - 포인트 거래 내역
- `notifications` - 알림
- `events` - 이벤트/공지사항
- `guides` - 이용 가이드
- `faqs` - 자주 묻는 질문

## 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드된 앱 미리보기
npm run preview

# 타입 체크
npm run check

# 마이그레이션 생성
npm run migration:generate -- -n MigrationName

# 마이그레이션 실행
npm run migration:run

# 마이그레이션 되돌리기
npm run migration:revert

# 시드 데이터 실행
npm run db:seed
```

## 프로젝트 구조

```
src/
├── lib/
│   ├── components/          # Svelte 컴포넌트
│   │   ├── common/         # 공통 컴포넌트
│   │   ├── layout/         # 레이아웃 컴포넌트
│   │   └── review/         # 체험단 관련 컴포넌트
│   ├── server/             # 서버사이드 코드
│   │   ├── entities/       # TypeORM 엔티티
│   │   ├── migrations/     # 데이터베이스 마이그레이션
│   │   ├── auth.js        # 인증 유틸리티
│   │   ├── data-source.js # 데이터베이스 연결
│   │   └── seed.js        # 시드 데이터
│   ├── stores/             # Svelte 스토어
│   ├── styles/             # 스타일시트
│   └── utils/              # 유틸리티 함수
├── routes/                 # SvelteKit 라우트
│   ├── api/               # API 엔드포인트
│   ├── admin/             # 관리자 페이지
│   ├── checklist/         # 체험단 목록/상세
│   ├── community/         # 커뮤니티
│   ├── event/             # 이벤트/공지
│   ├── guide/             # 이용가이드
│   └── notifications/     # 알림
├── app.html               # HTML 템플릿
├── app.css               # 전역 스타일
└── hooks.server.js       # SvelteKit 서버 훅
```

## 환경변수

프로덕션 환경에서는 다음 환경변수들을 설정해야 합니다:

- `DB_HOST` - 데이터베이스 호스트
- `DB_PORT` - 데이터베이스 포트
- `DB_USERNAME` - 데이터베이스 사용자명
- `DB_PASSWORD` - 데이터베이스 비밀번호
- `DB_DATABASE` - 데이터베이스 이름
- `JWT_SECRET` - JWT 시크릿 키
- `NODE_ENV` - 환경 설정 (production/development)

## 라이센스

MIT License