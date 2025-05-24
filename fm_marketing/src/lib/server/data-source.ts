// TypeORM 데이터소스 설정
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { dev } from '$app/environment';

// 환경변수 로드
config();

// User 엔티티 정의
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}

export enum UserLevel {
  BRONZE = 'bronze',
  SILVER = 'silver', 
  GOLD = 'gold',
  PLATINUM = 'platinum'
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 50, nullable: true })
  nickname: string;

  @Column({ name: 'profile_image', nullable: true })
  profileImage: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate: Date;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ name: 'blog_url', nullable: true, length: 255 })
  blogUrl: string;

  @Column({ name: 'instagram_url', nullable: true, length: 255 })
  instagramUrl: string;

  @Column({ name: 'youtube_url', nullable: true, length: 255 })
  youtubeUrl: string;

  @Column({ default: 0 })
  points: number;

  @Column({ type: 'enum', enum: UserLevel, default: UserLevel.BRONZE })
  level: UserLevel;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

// PointTransaction 엔티티 정의
export enum TransactionType {
  EARN = 'earn',
  SPEND = 'spend',
  WITHDRAW = 'withdraw'
}

@Entity('point_transactions')
export class PointTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column()
  amount: number;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'reference_type', nullable: true })
  referenceType: string;

  @Column({ name: 'reference_id', nullable: true })
  referenceId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

// Experience 엔티티 정의
export enum ExperienceType {
  EXPERIENCE = '체험단',
  REPORTER = '기자단'
}

export enum ExperienceStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  CLOSED = 'closed',
  COMPLETED = 'completed'
}

@Entity('experiences')
export class Experience {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ length: 50 })
  category: string;

  @Column({ type: 'enum', enum: ExperienceType })
  type: ExperienceType;

  @Column({ length: 50 })
  region: string;

  @Column({ nullable: true })
  location: string;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date;

  @Column({ name: 'application_deadline', type: 'date', nullable: true })
  applicationDeadline: Date;

  @Column({ name: 'max_participants', nullable: true })
  maxParticipants: number;

  @Column({ name: 'current_participants', default: 0 })
  currentParticipants: number;

  @Column({ name: 'required_points', default: 0 })
  requiredPoints: number;

  @Column({ name: 'reward_points', default: 0 })
  rewardPoints: number;

  @Column({ name: 'reward_description', type: 'text', nullable: true })
  rewardDescription: string;

  @Column({ type: 'text', nullable: true })
  requirements: string;

  @Column({ name: 'company_name', nullable: true, length: 255 })
  companyName: string;

  @Column({ name: 'contact_info', nullable: true, length: 500 })
  contactInfo: string;

  @Column({ type: 'text', nullable: true })
  images: string;

  @Column({ type: 'text', nullable: true })
  tags: string;

  @Column({ type: 'enum', enum: ExperienceStatus, default: ExperienceStatus.ACTIVE })
  status: ExperienceStatus;

  @Column({ name: 'is_promoted', default: false })
  isPromoted: boolean;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  likes: number;

  @Column({ name: 'created_by' })
  createdById: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

// CommunityPost 엔티티 정의
@Entity('community_posts')
export class CommunityPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ length: 50 })
  category: string;

  @Column({ name: 'author_id' })
  authorId: number;

  @Column({ type: 'text', nullable: true })
  images: string;

  @Column({ type: 'text', nullable: true })
  tags: string;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  likes: number;

  @Column({ name: 'is_pinned', default: false })
  isPinned: boolean;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

// 환경변수에서 데이터베이스 설정 가져오기
const DB_HOST = process.env.DB_HOST || '210.121.177.150';
const DB_PORT = parseInt(process.env.DB_PORT || '3306');
const DB_USERNAME = process.env.DB_USERNAME || 'gijunpark';
const DB_PASSWORD = process.env.DB_PASSWORD || 'park9832';
const DB_DATABASE = process.env.DB_DATABASE || 'FMMarketing';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: dev, // 개발 환경에서만 자동 동기화
  logging: dev, // 개발 환경에서만 SQL 로깅
  entities: [User, PointTransaction, Experience, CommunityPost],
  charset: 'utf8mb4',
  timezone: '+09:00', // 한국 시간대
  extra: {
    charset: 'utf8mb4_unicode_ci'
  },
  ssl: false // SSL 비활성화
});

// 데이터소스 초기화
let isInitialized = false;

export async function initializeDataSource() {
  if (isInitialized) {
    return AppDataSource;
  }

  try {
    await AppDataSource.initialize();
    isInitialized = true;
    console.log('✅ TypeORM 데이터베이스 연결 성공');
    return AppDataSource;
  } catch (error) {
    console.error('❌ TypeORM 데이터베이스 연결 실패:', error);
    throw error;
  }
}

// 데이터소스 가져오기 (싱글톤)
export async function getDataSource() {
  if (!isInitialized) {
    await initializeDataSource();
  }
  return AppDataSource;
}
