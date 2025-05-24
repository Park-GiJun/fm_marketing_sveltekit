// 데이터베이스 연결 및 초기 설정
// @ts-ignore
import Database from 'better-sqlite3';
import { dev } from '$app/environment';

// SQLite 데이터베이스 초기화
const db = new Database(dev ? 'dev.db' : 'production.db');

// WAL 모드 활성화 (성능 향상)
db.pragma('journal_mode = WAL');

// 테이블 생성
function initializeTables() {
	// 사용자 테이블
	db.exec(`
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			username TEXT UNIQUE NOT NULL,
			email TEXT UNIQUE NOT NULL,
			password_hash TEXT NOT NULL,
			name TEXT NOT NULL,
			nickname TEXT,
			profile_image TEXT,
			phone TEXT,
			birth_date DATE,
			gender TEXT CHECK(gender IN ('male', 'female', 'other')),
			address TEXT,
			blog_url TEXT,
			instagram_url TEXT,
			youtube_url TEXT,
			points INTEGER DEFAULT 0,
			level TEXT DEFAULT 'bronze',
			is_active BOOLEAN DEFAULT true,
			is_verified BOOLEAN DEFAULT false,
			role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin', 'moderator')),
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`);

	// 체험단/리뷰 테이블
	db.exec(`
		CREATE TABLE IF NOT EXISTS experiences (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			title TEXT NOT NULL,
			content TEXT NOT NULL,
			category TEXT NOT NULL,
			type TEXT NOT NULL CHECK(type IN ('체험단', '기자단')),
			region TEXT NOT NULL,
			location TEXT,
			start_date DATE,
			end_date DATE,
			application_deadline DATE,
			max_participants INTEGER,
			current_participants INTEGER DEFAULT 0,
			required_points INTEGER DEFAULT 0,
			reward_points INTEGER DEFAULT 0,
			reward_description TEXT,
			requirements TEXT,
			company_name TEXT,
			contact_info TEXT,
			images TEXT, -- JSON array of image URLs
			tags TEXT, -- JSON array of tags
			status TEXT DEFAULT 'active' CHECK(status IN ('draft', 'active', 'closed', 'completed')),
			is_promoted BOOLEAN DEFAULT false,
			views INTEGER DEFAULT 0,
			likes INTEGER DEFAULT 0,
			created_by INTEGER,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (created_by) REFERENCES users(id)
		)
	`);

	// 체험단 신청 테이블
	db.exec(`
		CREATE TABLE IF NOT EXISTS experience_applications (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			experience_id INTEGER NOT NULL,
			user_id INTEGER NOT NULL,
			application_text TEXT,
			status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected', 'completed')),
			admin_note TEXT,
			applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			reviewed_at DATETIME,
			completed_at DATETIME,
			FOREIGN KEY (experience_id) REFERENCES experiences(id),
			FOREIGN KEY (user_id) REFERENCES users(id),
			UNIQUE(experience_id, user_id)
		)
	`);

	// 커뮤니티 게시글 테이블
	db.exec(`
		CREATE TABLE IF NOT EXISTS community_posts (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			title TEXT NOT NULL,
			content TEXT NOT NULL,
			category TEXT NOT NULL,
			author_id INTEGER NOT NULL,
			images TEXT, -- JSON array
			tags TEXT, -- JSON array
			views INTEGER DEFAULT 0,
			likes INTEGER DEFAULT 0,
			is_pinned BOOLEAN DEFAULT false,
			is_deleted BOOLEAN DEFAULT false,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (author_id) REFERENCES users(id)
		)
	`);

	// 댓글 테이블
	db.exec(`
		CREATE TABLE IF NOT EXISTS comments (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			post_id INTEGER NOT NULL,
			parent_id INTEGER, -- 대댓글용
			author_id INTEGER NOT NULL,
			content TEXT NOT NULL,
			is_deleted BOOLEAN DEFAULT false,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (post_id) REFERENCES community_posts(id),
			FOREIGN KEY (parent_id) REFERENCES comments(id),
			FOREIGN KEY (author_id) REFERENCES users(id)
		)
	`);

	// 이벤트/공지사항 테이블
	db.exec(`
		CREATE TABLE IF NOT EXISTS events (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			title TEXT NOT NULL,
			content TEXT NOT NULL,
			type TEXT NOT NULL CHECK(type IN ('event', 'notice')),
			category TEXT,
			image_url TEXT,
			start_date DATE,
			end_date DATE,
			is_active BOOLEAN DEFAULT true,
			is_important BOOLEAN DEFAULT false,
			views INTEGER DEFAULT 0,
			created_by INTEGER,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (created_by) REFERENCES users(id)
		)
	`);

	// 포인트 이력 테이블
	db.exec(`
		CREATE TABLE IF NOT EXISTS point_transactions (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			user_id INTEGER NOT NULL,
			type TEXT NOT NULL CHECK(type IN ('earn', 'spend', 'withdraw')),
			amount INTEGER NOT NULL,
			description TEXT,
			reference_type TEXT, -- 'experience', 'login', 'community', etc
			reference_id INTEGER,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (user_id) REFERENCES users(id)
		)
	`);

	// 알림 테이블
	db.exec(`
		CREATE TABLE IF NOT EXISTS notifications (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			user_id INTEGER NOT NULL,
			type TEXT NOT NULL,
			title TEXT NOT NULL,
			message TEXT NOT NULL,
			is_read BOOLEAN DEFAULT false,
			action_url TEXT,
			priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (user_id) REFERENCES users(id)
		)
	`);

	// 파일 업로드 테이블
	db.exec(`
		CREATE TABLE IF NOT EXISTS uploaded_files (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			filename TEXT NOT NULL,
			original_name TEXT NOT NULL,
			file_path TEXT NOT NULL,
			file_size INTEGER,
			mime_type TEXT,
			uploaded_by INTEGER,
			upload_type TEXT, -- 'profile', 'experience', 'community', etc
			reference_id INTEGER,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (uploaded_by) REFERENCES users(id)
		)
	`);

	// 가이드/FAQ 테이블
	db.exec(`
		CREATE TABLE IF NOT EXISTS guides (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			title TEXT NOT NULL,
			content TEXT NOT NULL,
			category TEXT NOT NULL,
			thumbnail TEXT,
			views INTEGER DEFAULT 0,
			order_index INTEGER DEFAULT 0,
			is_active BOOLEAN DEFAULT true,
			created_by INTEGER,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (created_by) REFERENCES users(id)
		)
	`);

	// FAQ 테이블
	db.exec(`
		CREATE TABLE IF NOT EXISTS faqs (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			question TEXT NOT NULL,
			answer TEXT NOT NULL,
			category TEXT NOT NULL,
			order_index INTEGER DEFAULT 0,
			is_active BOOLEAN DEFAULT true,
			created_by INTEGER,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (created_by) REFERENCES users(id)
		)
	`);

	// 인덱스 생성
	db.exec(`
		CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
		CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
		CREATE INDEX IF NOT EXISTS idx_experiences_region ON experiences(region);
		CREATE INDEX IF NOT EXISTS idx_experiences_category ON experiences(category);
		CREATE INDEX IF NOT EXISTS idx_experiences_status ON experiences(status);
		CREATE INDEX IF NOT EXISTS idx_applications_user ON experience_applications(user_id);
		CREATE INDEX IF NOT EXISTS idx_applications_experience ON experience_applications(experience_id);
		CREATE INDEX IF NOT EXISTS idx_posts_author ON community_posts(author_id);
		CREATE INDEX IF NOT EXISTS idx_posts_category ON community_posts(category);
		CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
		CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
		CREATE INDEX IF NOT EXISTS idx_points_user ON point_transactions(user_id);
	`);

	console.log('데이터베이스 테이블 초기화 완료');
}

// 초기화 실행
initializeTables();

export { db };
