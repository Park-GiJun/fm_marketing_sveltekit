// User 엔티티
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

export const UserRole = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator'
};

export const UserLevel = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum'
};

export const Gender = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other'
};

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id;

  @Column({ unique: true, length: 50 })
  username;

  @Column({ unique: true, length: 100 })
  email;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash;

  @Column({ length: 50 })
  name;

  @Column({ length: 50, nullable: true })
  nickname;

  @Column({ name: 'profile_image', nullable: true })
  profileImage;

  @Column({ length: 20, nullable: true })
  phone;

  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate;

  @Column({ type: 'enum', enum: Object.values(Gender), nullable: true })
  gender;

  @Column({ type: 'text', nullable: true })
  address;

  @Column({ name: 'blog_url', nullable: true, length: 255 })
  blogUrl;

  @Column({ name: 'instagram_url', nullable: true, length: 255 })
  instagramUrl;

  @Column({ name: 'youtube_url', nullable: true, length: 255 })
  youtubeUrl;

  @Column({ default: 0 })
  points;

  @Column({ type: 'enum', enum: Object.values(UserLevel), default: UserLevel.BRONZE })
  level;

  @Column({ name: 'is_active', default: true })
  isActive;

  @Column({ name: 'is_verified', default: false })
  isVerified;

  @Column({ type: 'enum', enum: Object.values(UserRole), default: UserRole.USER })
  role;

  @CreateDateColumn({ name: 'created_at' })
  createdAt;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt;
}
