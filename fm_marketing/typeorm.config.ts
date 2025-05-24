import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import {
  User,
  Experience,
  ExperienceApplication,
  CommunityPost,
  Comment,
  PointTransaction,
  Notification,
  Event,
  Guide,
  FAQ,
  UploadedFile
} from './src/lib/server/entities/index.js';

// 환경변수 로드
config();

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'fm_marketing',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [
    User,
    Experience,
    ExperienceApplication,
    CommunityPost,
    Comment,
    PointTransaction,
    Notification,
    Event,
    Guide,
    FAQ,
    UploadedFile
  ],
  migrations: ['src/lib/server/migrations/*.ts'],
  charset: 'utf8mb4',
  extra: {
    charset: 'utf8mb4_unicode_ci'
  }
});
