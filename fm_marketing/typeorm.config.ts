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
  host: process.env.DB_HOST || '210.121.177.150',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'gijunpark',
  password: process.env.DB_PASSWORD || 'park9832',
  database: process.env.DB_DATABASE || 'FMMarketing',
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
  timezone: '+09:00',
  extra: {
    charset: 'utf8mb4_unicode_ci'
  },
  ssl: false
});
