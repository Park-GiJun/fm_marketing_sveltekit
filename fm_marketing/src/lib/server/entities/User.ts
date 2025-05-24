// User 엔티티
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Experience } from './Experience.js';
import { CommunityPost } from './CommunityPost.js';
import { ExperienceApplication } from './ExperienceApplication.js';
import { Comment } from './Comment.js';
import { PointTransaction } from './PointTransaction.js';
import { Notification } from './Notification.js';
import { UploadedFile } from './UploadedFile.js';

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

  @Column({ name: 'blog_url', nullable: true })
  blogUrl: string;

  @Column({ name: 'instagram_url', nullable: true })
  instagramUrl: string;

  @Column({ name: 'youtube_url', nullable: true })
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

  // Relations
  @OneToMany(() => Experience, experience => experience.creator)
  createdExperiences: Experience[];

  @OneToMany(() => CommunityPost, post => post.author)
  posts: CommunityPost[];

  @OneToMany(() => ExperienceApplication, application => application.user)
  applications: ExperienceApplication[];

  @OneToMany(() => Comment, comment => comment.author)
  comments: Comment[];

  @OneToMany(() => PointTransaction, transaction => transaction.user)
  pointTransactions: PointTransaction[];

  @OneToMany(() => Notification, notification => notification.user)
  notifications: Notification[];

  @OneToMany(() => UploadedFile, file => file.uploadedBy)
  uploadedFiles: UploadedFile[];
}
