// 간단한 User 엔티티 (데코레이터 없이)

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

export class User {
  constructor() {
    this.id = null;
    this.username = null;
    this.email = null;
    this.passwordHash = null;
    this.name = null;
    this.nickname = null;
    this.profileImage = null;
    this.phone = null;
    this.birthDate = null;
    this.gender = null;
    this.address = null;
    this.blogUrl = null;
    this.instagramUrl = null;
    this.youtubeUrl = null;
    this.points = 0;
    this.level = UserLevel.BRONZE;
    this.isActive = true;
    this.isVerified = false;
    this.role = UserRole.USER;
    this.createdAt = null;
    this.updatedAt = null;
  }
}

// TypeORM 엔티티 메타데이터
export const UserEntitySchema = {
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true
    },
    username: {
      type: 'varchar',
      length: 50,
      unique: true
    },
    email: {
      type: 'varchar',
      length: 100,
      unique: true
    },
    passwordHash: {
      type: 'varchar',
      length: 255,
      name: 'password_hash'
    },
    name: {
      type: 'varchar',
      length: 50
    },
    nickname: {
      type: 'varchar',
      length: 50,
      nullable: true
    },
    profileImage: {
      type: 'text',
      name: 'profile_image',
      nullable: true
    },
    phone: {
      type: 'varchar',
      length: 20,
      nullable: true
    },
    birthDate: {
      type: 'date',
      name: 'birth_date',
      nullable: true
    },
    gender: {
      type: 'enum',
      enum: Object.values(Gender),
      nullable: true
    },
    address: {
      type: 'text',
      nullable: true
    },
    blogUrl: {
      type: 'varchar',
      length: 255,
      name: 'blog_url',
      nullable: true
    },
    instagramUrl: {
      type: 'varchar',
      length: 255,
      name: 'instagram_url',
      nullable: true
    },
    youtubeUrl: {
      type: 'varchar',
      length: 255,
      name: 'youtube_url',
      nullable: true
    },
    points: {
      type: 'int',
      default: 0
    },
    level: {
      type: 'enum',
      enum: Object.values(UserLevel),
      default: UserLevel.BRONZE
    },
    isActive: {
      type: 'boolean',
      name: 'is_active',
      default: true
    },
    isVerified: {
      type: 'boolean',
      name: 'is_verified',
      default: false
    },
    role: {
      type: 'enum',
      enum: Object.values(UserRole),
      default: UserRole.USER
    },
    createdAt: {
      type: 'timestamp',
      name: 'created_at',
      createDate: true
    },
    updatedAt: {
      type: 'timestamp',
      name: 'updated_at',
      updateDate: true
    }
  }
};
