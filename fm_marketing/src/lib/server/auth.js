// 간단한 인증 유틸리티
import { getDataSource } from './database-init.js';

// JWT 시크릿 키
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-fm-marketing';

/**
 * 비밀번호 해싱
 */
export async function hashPassword(password) {
  const bcrypt = await import('bcryptjs');
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * 비밀번호 검증
 */
export async function verifyPassword(password, hashedPassword) {
  const bcrypt = await import('bcryptjs');
  return bcrypt.compare(password, hashedPassword);
}

/**
 * JWT 토큰 생성
 */
export async function generateToken(payload) {
  const jwt = await import('jsonwebtoken');
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
    issuer: 'fm-marketing'
  });
}

/**
 * JWT 토큰 검증
 */
export async function verifyToken(token) {
  try {
    const jwt = await import('jsonwebtoken');
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * 요청에서 사용자 정보 추출
 */
export async function getUserFromRequest(request) {
  const authHeader = request.headers.get('authorization');
  const cookieToken = request.headers.get('cookie')?.match(/token=([^;]+)/)?.[1];
  
  const token = authHeader?.replace('Bearer ', '') || cookieToken;
  
  if (!token) {
    return null;
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return null;
  }

  try {
    const dataSource = await getDataSource();
    const [user] = await dataSource.query(`
      SELECT id, username, email, name, nickname, profile_image, points, level, role, is_active, is_verified
      FROM users 
      WHERE id = ? AND is_active = 1
    `, [payload.userId]);

    return user || null;
  } catch (error) {
    console.error('사용자 조회 오류:', error);
    return null;
  }
}

/**
 * 이메일 유효성 검사
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 비밀번호 유효성 검사
 */
export function isValidPassword(password) {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

/**
 * 사용자명 유효성 검사
 */
export function isValidUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}
