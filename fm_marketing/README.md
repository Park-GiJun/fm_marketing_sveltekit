# FM마케팅 플랫폼

SvelteKit + TypeORM + MySQL을 사용한 체험단 마케팅 플랫폼입니다.

## 기술 스택

- **Frontend**: SvelteKit, JavaScript
- **Backend**: Node.js, TypeORM
- **Database**: MySQL
- **Authentication**: JWT
- **Styling**: Tailwind CSS (일부), 커스텀 CSS

## 주요 기능

### 사용자 기능
- 회원가입/로그인
- 체험단 검색 및 신청
- 커뮤니티 게시글 작성/댓글
- 포인트 적립 및 환급
- 알림 시스템
- 이벤트/공지사항 확인

### 관리자 기능
- 체험단 관리 (CRUD)
- 사용자 관리
- 커뮤니티 관리
- 이벤트/공지사항 관리
- 가이드/FAQ 관리

## 설치 및 실행

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
`.env.example`을 참고하여 `.env` 파일을 생성하고 설정값을 입력합니다.

```bash
cp .env.example .env
```

### 4. 데이터베이스 설정
MySQL 데이터베이스를 생성하고 연결 정보를 `.env`에 설정합니다.

```sql
CREATE DATABASE fm_marketing CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. 데이터베이스 초기화
```bash
npm run db:init
```

### 6. 개발 서버 실행
```bash
npm run dev
```

서버가 실행되면 `http://localhost:5173`에서 접속할 수 있습니다.

## API 엔드포인트

### 인증
- `POST /api/auth/login` - 로그인
- `POST /api/auth/register` - 회원가입
- `GET /api/auth/profile` - 프로필 조회

### 체험단
- `GET /api/experiences` - 체험단 목록
- `GET /api/experiences/{id}` - 체험단 상세
- `POST /api/experiences/{id}/apply` - 체험단 신청
- `DELETE /api/experiences/{id}/apply` - 체험단 신청 취소

### 커뮤니티
- `GET /api/community/posts` - 게시글 목록
- `POST /api/community/posts` - 게시글 작성
- `GET /api/community/posts/{id}` - 게시글 상세
- `GET /api/community/posts/{id}/comments` - 댓글 목록
- `POST /api/community/posts/{id}/comments` - 댓글 작성

### 알림
- `GET /api/notifications` - 알림 목록
- `PATCH /api/notifications/{id}` - 알림 읽음 처리
- `POST /api/notifications/mark-all-read` - 모든 알림 읽음 처리

### 이벤트/공지사항
- `GET /api/events` - 이벤트/공지사항 목록
- `GET /api/events/{id}` - 이벤트/공지사항 상세

### 가이드/FAQ
- `GET /api/guides` - 가이드 목록
- `GET /api/guides/{id}` - 가이드 상세
- `GET /api/faqs` - FAQ 목록

### 포인트
- `GET /api/points` - 포인트 내역
- `POST /api/points/withdrawal` - 포인트 환급 신청

## 테스트 계정

시드 데이터로 생성되는 테스트 계정:

### 관리자
- ID: `admin`
- PW: `admin123!`

### 일반 사용자
- ID: `user1` / PW: `user123!`
- ID: `user2` / PW: `user123!`
- ID: `user3` / PW: `user123!`

## 프로젝트 구조

```
src/
├── lib/
│   ├── components/        # Svelte 컴포넌트
│   ├── server/           # 서버사이드 코드
│   │   ├── entities/     # TypeORM 엔티티
│   │   ├── migrations/   # 데이터베이스 마이그레이션
│   │   └── ...
│   ├── stores/           # Svelte 스토어
│   └── utils/            # 유틸리티 함수
├── routes/              # SvelteKit 라우트
│   ├── api/            # API 엔드포인트
│   └── ...
└── ...
```

## 개발 가이드

### 새로운 API 추가
1. `src/routes/api/` 하위에 라우트 파일 생성
2. TypeORM 엔티티 정의 (필요시)
3. 프론트엔드 스토어에서 API 연동

### 새로운 페이지 추가
1. `src/routes/` 하위에 Svelte 페이지 파일 생성
2. 필요한 컴포넌트 및 스토어 연동

### 데이터베이스 스키마 변경
1. TypeORM 엔티티 수정
2. 마이그레이션 생성: `npm run migration:generate`
3. 마이그레이션 실행: `npm run migration:run`

## 배포

### 프로덕션 빌드
```bash
npm run build
```

### 프로덕션 환경 설정
- `.env` 파일에서 `NODE_ENV=production` 설정
- 데이터베이스 연결 정보 업데이트
- JWT_SECRET 보안 강화

## 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

## 기여

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 문의

프로젝트 관련 문의사항이 있으시면 이슈를 생성해 주세요.
